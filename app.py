import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app)

openai.api_key = os.environ.get("OPENAI_API_KEY")

TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID")

def dispatch_instant_notification(client_message, ai_reply, brand_name):
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("Notification Engine Alert: Environment credentials missing.")
        return

    alert_payload = (
        f"🚨 <b>{brand_name} - New Lead Activity Alert</b> 🚨\n\n"
        f"👤 <b>Client Message:</b> {client_message}\n\n"
        f"🤖 <b>AI Concierge Action:</b> <i>{ai_reply[:150]}...</i>\n\n"
        f"👉 Check your tracking logs for conversion data verification."
    )
    
    telegram_endpoint = f"https://telegram.org{TELEGRAM_BOT_TOKEN}/sendMessage"
    data_payload = {"chat_id": TELEGRAM_CHAT_ID, "text": alert_payload, "parse_mode": "HTML"}
    
    try:
        requests.post(telegram_endpoint, json=data_payload, timeout=5)
        print("Notification successfully transmitted.")
    except Exception as e:
        print(f"Failed to transmit instant notification alert: {e}")

@app.route("/api/chat", methods=["POST"])
def dynamic_whitelabel_chat():
    payload = request.json
    user_message = payload.get("message", "")
    brand_context = payload.get("brandContext", {})
    
    if not user_message:
        return jsonify({"reply": "System Error: Missing text payload."}), 400

    brand_name = brand_context.get('brandName', 'RBL Med & Wellness Spa')

    dynamic_system_prompt = f"""
    You are the premium AI Assistant for "{brand_name}".
    Location: "{brand_context.get('location')}".
    Contact Number: "{brand_context.get('phone')}".
    Operating Hours: {brand_context.get('hours')}
    
    Behavior Directives:
    - Provide short, luxurious, clear responses. Use brief paragraph spaces.
    - Always provide their explicit live booking link for slot questions: {brand_context.get('bookingUrl')}
    """
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": dynamic_system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.3
        )
        ai_reply = response.choices.message['content'].strip()
        dispatch_instant_notification(user_message, ai_reply, brand_name)
        return jsonify({"reply": ai_reply})
    except Exception as e:
        return jsonify({"reply": "Our concierge line is updating. Please try again shortly."}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)

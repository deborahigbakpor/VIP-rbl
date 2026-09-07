const SPA_DATA_SOURCE = {
    brandName: "RBL Med & Wellness Spa",
    location: "13 Olufemi Olatunji Street, Agungi Osapa Road, Lekki, Lagos",
    phone: "08104359308",
    whatsapp: "+2348184454214",
    bookingUrl: "https://fresha.com",
    hours: "Tue-Sat: 10 AM - 7 PM, Sun: 1 PM - 7 PM (Closed Mondays)",
    
    menu: [
        { name: "Advanced HydraFacial", price: "₦55,000", desc: "Medical-grade skin resurfacing system cleansing pores, extracting oil, and hydrating deep skin tissue layers." },
        { name: "Laser Hair Removal Session", price: "Consultation Required", desc: "Permanent aesthetic laser target reduction treatment for smooth skin optimization." },
        { name: "IV Vitamin Infusion Therapy", price: "₦45,000", desc: "Direct bloodstream cellular replenishment bag optimizing hydration, system immunity, and instant energetic radiance." },
        { name: "RBL Signature Spa Pamper Combo", price: "₦33,000", desc: "Entry combination package merging full-body structural exfoliation scrubs with introductory body therapies." },
        { name: "Deep Tissue Muscle Therapy", price: "₦35,000", desc: "Intense structural pressure manipulation targeting chronic muscle tight spots and alignment tension fields." },
        { name: "VVIP Luxury Birthday Package", price: "₦120,000", desc: "Elite private group package bundling luxury sauna access, custom treatments, couples-ready Jacuzzi slots, and treats." }
    ]
};

document.getElementById('heroTitle').innerText = SPA_DATA_SOURCE.brandName;
document.getElementById('welcomeBubble').innerText = `Welcome to ${SPA_DATA_SOURCE.brandName}, Lekki. ✨ How can I help you tonight? I can check pricing, operational details, or guide your booking slots.`;

const menuContainer = document.getElementById('htmlMenuGrid');
SPA_DATA_SOURCE.menu.forEach(item => {
    menuContainer.innerHTML += `
        <div class="menu-card">
            <div class="card-meta"><h3>${item.name}</h3><p>${item.desc}</p></div>
            <div class="card-footer"><span class="price">${item.price}</span><a href="#" class="book-item-link" onclick="executeGlobalBooking(event)">Reserve Slot</a></div>
        </div>`;
});

function toggleChat() {
    const box = document.getElementById('chatBox');
    const btn = document.getElementById('launcherBtn');
    box.classList.toggle('active');
    btn.innerHTML = box.classList.contains('active') ? '✕' : '✦';
}

function executeGlobalBooking(e) {
    if(e) e.preventDefault();
    window.open(SPA_DATA_SOURCE.bookingUrl, '_blank');
}

async function processUserMessage() {
    const input = document.getElementById('userInput');
    const query = input.value.trim();
    if(!query) return;

    appendMessageBubble(query, 'user');
    input.value = '';
    const loadingId = appendMessageBubble('Thinking...', 'bot');

    try {
        const apiResponse = await fetch('http://127.0.0', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: query, brandContext: SPA_DATA_SOURCE })
        });
        const data = await apiResponse.json();
        document.getElementById(loadingId).innerText = data.reply;
    } catch (error) {
        setTimeout(() => {
            let fallbackReply = `To view real-time open calendar grids and secure your treatment opening instantly on your smartphone, click directly here: ${SPA_DATA_SOURCE.bookingUrl}`;
            const lowerQuery = query.toLowerCase();
            if(lowerQuery.includes('price') || lowerQuery.includes('how much') || lowerQuery.includes('cost')) {
                fallbackReply = `Our aesthetic menu packages scale from ₦33,000 for spa treatments, up to our deep medical HydraFacials at ₦55,000 and luxury private group packages at ₦120,000. View details here: ${SPA_DATA_SOURCE.bookingUrl}`;
            } else if(lowerQuery.includes('monday') || lowerQuery.includes('hour') || lowerQuery.includes('open')) {
                fallbackReply = `Our doors are open Tue-Sat (10 AM - 7 PM) and Sun (1 PM - 7 PM). Closed Mondays. Lock in slots online here: ${SPA_DATA_SOURCE.bookingUrl}`;
            } else if(lowerQuery.includes('where') || lowerQuery.includes('location') || lowerQuery.includes('address')) {
                fallbackReply = `Our luxury clinic is located at ${SPA_DATA_SOURCE.location}. We have secure private parking on site.`;
            }
            document.getElementById(loadingId).innerText = fallbackReply;
        }, 600);
    }
}

function appendMessageBubble(text, sender) {
    const id = 'msg-' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.id = id;
    msgDiv.innerText = text;
    const grid = document.getElementById('messageGrid');
    grid.appendChild(msgDiv);
    grid.scrollTop = grid.scrollHeight;
    return id;
}

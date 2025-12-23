const products = [
    {
        id: "atta",
        name: "Atta Golgappa",
        price: 1, // 1 Rs per piece
        unit: "Piece",
        minQty: 100,
        displayUnit: "pcs",
        step: 50,
        image: "atta golgappa.png"
    },
    {
        id: "suji",
        name: "Suji Golgappa",
        price: 2.5, // 2.5 Rs per piece
        unit: "Piece",
        minQty: 100,
        displayUnit: "pcs",
        step: 50,
        image: "suji golgappa.png"
    },
    {
        id: "sev",
        name: "Sev Papdi",
        price: 1, // 1 Rs per piece
        unit: "Piece",
        minQty: 100,
        displayUnit: "pcs",
        step: 50,
        image: "sev papdi.png"
    }
];

const productList = document.getElementById('product-list');
const grandTotalEl = document.getElementById('grand-total');
const orderBtn = document.getElementById('place-order-btn');

// Render Items
function renderApp() {
    productList.innerHTML = products.map(product => `
        <div class="product-item">
            <img src="${product.image}" alt="${product.name}" class="product-thumb">
            <div class="product-details">
                <h3>${product.name}</h3>
                <span class="product-price">₹${product.price} / ${product.unit}</span>
            </div>
            <div class="quantity-control">
                <div class="qty-input-group">
                    <input type="number" 
                           class="qty-input" 
                           id="qty-${product.id}" 
                           placeholder="0" 
                           min="0" 
                           step="${product.step}"
                           oninput="calculateTotal()">
                </div>
                <span class="min-qty-label">Min: ${product.minQty}</span>
            </div>
        </div>
    `).join('');
}

// Calculate Total
function calculateTotal() {
    let total = 0;
    products.forEach(p => {
        const input = document.getElementById(`qty-${p.id}`);
        const qty = parseInt(input.value) || 0;

        // Price logic: Direct multiplication as price is per piece
        let itemTotal = qty * p.price;

        total += itemTotal;
    });

    // Update UI
    grandTotalEl.innerText = `₹${Math.ceil(total)}`;
    return total;
}

// WhatsApp Integration
orderBtn.addEventListener('click', () => {
    let message = "👋 Hello Raju Bhai, I would like to place an order:%0A%0A";
    let hasItems = false;
    let total = 0;

    products.forEach(p => {
        const input = document.getElementById(`qty-${p.id}`);
        const qty = parseInt(input.value) || 0;

        if (qty > 0) {
            hasItems = true;
            // Check min qty
            if (qty < p.minQty) {
                // Warning logic could go here
            }
            message += `🔹 *${p.name}:* ${qty} pcs%0A`;

            // Calc expected price for message
            let itemPrice = qty * p.price;
            total += itemPrice;
        }
    });

    if (!hasItems) {
        alert("Please select at least one item.");
        return;
    }

    const notes = document.getElementById('order-notes').value;
    if (notes.trim()) {
        message += `%0A📝 *Notes:* ${notes}%0A`;
    }

    // Policy & Terms
    message += `%0A⚠️ *Order Terms:*%0A`;
    message += `1. *Pickup Only* 🏪%0A`;
    message += `2. *Prep Time:* 1-2 Days ⏳%0A`;
    message += `3. *50% Advance Payment Required* 💸%0A`;

    message += `%0A💰 *Estimated Total:* ₹${Math.ceil(total)}`;

    // Wholesaler Number
    const waNumber = "918010123251"; // WhatsApp Number
    const callNumber = "9311587237"; // Calling Number

    // Add contact info to message
    message += `%0A%0A📞 *Contact for Call:* +91-${callNumber}`;

    window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
});

renderApp();

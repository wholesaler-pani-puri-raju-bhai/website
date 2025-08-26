// Function to handle WhatsApp orders
function orderProduct(productName) {
    const phoneNumber = 'XXXXXXXXXX'; // Replace with your WhatsApp number (without +91)
    const message = `Hi! I want to order ${productName}. Please share more details about pricing and availability.`;
    const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Add interactive animations for product cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Initialize the slideshow when the DOM is fully loaded
    showSlides(slideIndex);
    // Start auto-sliding
    autoSlide();
});

// --- Render Products Dynamically ---
document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('productGrid');
    if (grid && typeof products !== 'undefined') {
        grid.innerHTML = products.map((product, idx) => {
            // Gallery thumbnails
            const gallery = product.images.map((img, i) => `
                <img src="${img}" alt="${product.name} image ${i+1}" class="product-thumb${i === 0 ? ' cover-thumb' : ''}" data-pidx="${idx}" data-imgidx="${i}">
            `).join('');
            return `
            <div class="product-card" data-product="${product.name}">
                <div class="product-image">
                    <img src="${product.images[0]}" alt="${product.name}" class="product-photo">
                </div>
                <div class="product-gallery">${gallery}</div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${product.price}<br><span style="font-size:0.95em; color:#888;">Min. ${product.minOrder} pieces</span></div>
                    <button class="order-btn pulse" onclick="openOrderModal('${product.name.replace(/'/g, "\'")}', ${product.minOrder}, '${product.priceInfo.replace(/'/g, "\'")}')">
                        <span class="whatsapp-icon">📱</span>
                        Set Requirements
                    </button>
                </div>
            </div>
            `;
        }).join('');

        // Add thumbnail click logic
        grid.querySelectorAll('.product-thumb').forEach(thumb => {
            thumb.addEventListener('click', function() {
                const pidx = parseInt(this.getAttribute('data-pidx'));
                const imgidx = parseInt(this.getAttribute('data-imgidx'));
                if (imgidx === 0) return; // Already cover
                // Move clicked image to front (cover)
                const imgs = products[pidx].images;
                const [clicked] = imgs.splice(imgidx, 1);
                imgs.unshift(clicked);
                // Re-render products
                document.dispatchEvent(new Event('DOMContentLoaded'));
            });
        });
    }
});

// --- Render Paste Cards Dynamically ---
document.addEventListener('DOMContentLoaded', function() {
    const pasteGrid = document.getElementById('pasteGrid');
    if (!pasteGrid) return;
    const pastes = [
        { name: 'Hing', image: 'assets/pani-puri-paste/hing.png' },
        { name: 'Jaljeera', image: 'assets/pani-puri-paste/Jaljeera.png' },
        { name: 'Lasooni', image: 'assets/pani-puri-paste/lasooni.png' },
        { name: 'Pudina', image: 'assets/pani-puri-paste/Pudina .png' },
        { name: 'Teekha', image: 'assets/pani-puri-paste/Teekha.png' }
    ];
    pasteGrid.innerHTML = pastes.map(paste => `
        <div class="product-card">
            <div class="product-image">
                <img src="${paste.image}" alt="${paste.name} Paste" class="paste-image" />
            </div>
            <div class="product-info">
                <h3 class="product-title">${paste.name} Paste</h3>
                <p class="product-description">Made-to-order paste. We will confirm your requirements and then prepare it fresh.</p>
                <button class="order-btn" onclick="openPasteInquiry('${paste.name}')">Talk on WhatsApp</button>
            </div>
        </div>
    `).join('');
});

// --- Image Carousel Logic ---
let slideIndex = 1; // Current slide index
let slideInterval; // Variable to hold the interval for auto-slide

/**
 * Displays a specific slide in the carousel.
 * @param {number} n - The index of the slide to display (1-based).
 */
function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("dot");

    // Handle wrapping around for slide index
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }

    // Hide all slides
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    // Remove 'active' class from all dots
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    // Display the current slide and mark the corresponding dot as active
    if (slides[slideIndex - 1]) { // Ensure slide exists before trying to access
        slides[slideIndex - 1].style.display = "block";
    }
    if (dots[slideIndex - 1]) { // Ensure dot exists before trying to access
        dots[slideIndex - 1].className += " active";
    }
}

/**
 * Changes the current slide by a given number (e.g., +1 for next, -1 for previous).
 * @param {number} n - The number of slides to advance/go back.
 */
function plusSlides(n) {
    // Clear the existing auto-slide interval to prevent immediate slide change
    clearInterval(slideInterval);
    showSlides(slideIndex += n);
    // Restart auto-slide after manual navigation
    autoSlide();
}

/**
 * Sets the current slide to a specific index.
 * @param {number} n - The index of the slide to show (1-based).
 */
function currentSlide(n) {
    // Clear the existing auto-slide interval
    clearInterval(slideInterval);
    showSlides(slideIndex = n);
    // Restart auto-slide after manual navigation
    autoSlide();
}

/**
 * Starts the automatic slideshow.
 */
function autoSlide() {
    // Set an interval to automatically advance slides every 3 seconds
    slideInterval = setInterval(function() {
        plusSlides(1); // Advance to the next slide
    }, 3000); // Change image every 3 seconds
}

window.plusSlides = plusSlides;
window.currentSlide = currentSlide;
window.orderProduct = orderProduct;

// --- Order Modal Logic ---
const whatsappNumber = '9311587237'; // Without +91
let currentProduct = '';
let currentMinQty = 1;
let currentPriceInfo = '';

function openOrderModal(product, minQty, priceInfo) {
    currentProduct = product;
    currentMinQty = minQty;
    currentPriceInfo = priceInfo;
    document.getElementById('modalProductTitle').innerText = `Order: ${product}`;
    const qtyInput = document.getElementById('orderQuantity');
    qtyInput.value = minQty;
    qtyInput.min = minQty;
    document.getElementById('orderMinInfo').innerText = `(Minimum ${minQty} pieces)`;
    document.getElementById('orderNote').value = '';
    document.getElementById('orderModal').style.display = 'block';
    qtyInput.focus();
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

function sendOrderToWhatsApp(event) {
    event.preventDefault();
    const qty = document.getElementById('orderQuantity').value;
    const note = document.getElementById('orderNote').value.trim();
    if (parseInt(qty) < currentMinQty) {
        alert(`Minimum order quantity for ${currentProduct} is ${currentMinQty}.`);
        return;
    }
    let message = `Hi! I want to order ${currentProduct}.\nQuantity: ${qty}\nPrice: ${currentPriceInfo}`;
    if (note) {
        message += `\nNote: ${note}`;
    }
    message += '\nPlease share more details about pricing and availability.';
    const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    closeOrderModal();
}

// Optional: Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target === modal) {
        closeOrderModal();
    }
};

// --- Paste Inquiry CTA ---
function openPasteInquiry(flavor) {
    const flavorText = flavor ? `\nFlavor: ${flavor}` : '';
    const message = `Hello! I want to discuss Pani Puri Paste (made-to-order).${flavorText}\nPlease verify my requirements, capacity, delivery area, and paste options.`;
    const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}
window.openPasteInquiry = openPasteInquiry;
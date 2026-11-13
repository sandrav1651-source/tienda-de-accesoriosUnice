/**
 * =====================================================
 * LÓGICA DE TIENDA, CARRITO Y PAGO QR - AURELIA JOYERÍA
 * =====================================================
 */

// 1. CONFIGURACIÓN PRINCIPAL (Moneda en Bolivianos y ruta directa a tu imagen QR)
const STORE_CONFIG = {
    whatsappNumber: "59162044849", // Código de país + número sin '+'
    currency: "Bs ",
    // Guarda tu imagen QR dentro de la carpeta img/ con el nombre mi-qr.png
    defaultQRImage: "qr.jpg"
};

// 2. CATÁLOGO DE PRODUCTOS (PRECIOS EN BOLIVIANOS)
const PRODUCTS = [
    {
        "id": 1,
        "name": "Anillo Solitario Aura Oro 18k",
        "category": "anillos",
        "price": 1280,
        "material": "Oro Amarillo 18k & Circón Suizo",
        "image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 2,
        "name": "Collar Cascada de Perlas",
        "category": "collares",
        "price": 950,
        "material": "Plata 925 Bañada en Oro & Perla Natural",
        "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 3,
        "name": "Aretes Lágrima Esmeralda",
        "category": "aretes",
        "price": 820,
        "material": "Oro 18k & Piedra Esmeralda Sintética",
        "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 4,
        "name": "Pulsera Eslabones Imperial",
        "category": "pulseras",
        "price": 650,
        "material": "Acero Quirúrgico Chapado en Oro 18k",
        "image": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 5,
        "name": "Anillo Alianza Infinito",
        "category": "anillos",
        "price": 760,
        "material": "Plata Esterlina 925 & Micro Pavé",
        "image": "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 6,
        "name": "Gargantilla Luz de Luna",
        "category": "collares",
        "price": 1120,
        "material": "Oro Rosa 18k & Ópalo Blanco",
        "image": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 7,
        "name": "Argollas Clásicas Entrelazadas",
        "category": "aretes",
        "price": 590,
        "material": "Oro Amarillo 14k Hipoalergénico",
        "image": "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 8,
        "name": "Brazalete Rígido Minimalista",
        "category": "pulseras",
        "price": 890,
        "material": "Plata 925 Rodinada",
        "image": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=600&q=80"
    }
];

// 3. ESTADO DEL CARRITO
let cart = JSON.parse(localStorage.getItem('aurelia_cart')) || [];
let currentCategory = 'todos';

// 4. INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(PRODUCTS);
    updateCartUI();
    const qrDisplay = document.getElementById('qr-image-display');
    if (qrDisplay) qrDisplay.src = STORE_CONFIG.defaultQRImage;
});

// 5. RENDERIZADO DE PRODUCTOS Y FILTROS
function renderProducts(items) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    items.forEach(product => {
        const card = document.createElement('article');
        card.className = "bg-white rounded-3xl overflow-hidden border border-neutral-200/70 shadow-sm hover:shadow-xl hover:border-gold-300 transition-all duration-300 flex flex-col group animate-fade-in";
        
        card.innerHTML = `
            <div class="relative h-64 overflow-hidden bg-cream">
                <img 
                    src="${product.image}" 
                    onerror="this.src='https://placehold.co/600x600/faf8f5/c58b3b?text=${encodeURIComponent(product.name)}'"
                    alt="${product.name}" 
                    class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                >
                <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-obsidian text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                    ${product.category}
                </span>
            </div>
            
            <div class="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <p class="text-xs text-gold-600 font-medium mb-1">${product.material}</p>
                    <h3 class="font-serif text-lg font-bold text-obsidian leading-snug mb-2 group-hover:text-gold-700 transition-colors">
                        ${product.name}
                    </h3>
                </div>
                
                <div class="pt-4 mt-2 border-t border-neutral-100 flex items-center justify-between">
                    <span class="text-xl font-bold text-obsidian">
                        ${STORE_CONFIG.currency}${product.price.toFixed(2)}
                    </span>
                    <button 
                        onclick="addToCart(${product.id})" 
                        class="px-4 py-2.5 rounded-full bg-obsidian hover:bg-gold-600 text-white text-xs font-semibold tracking-wide transition-colors flex items-center gap-2 shadow-sm active:scale-95">
                        <i class="fa-solid fa-plus"></i>
                        <span>Agregar</span>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterProducts(category) {
    currentCategory = category;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.cat === category) {
            btn.className = "filter-btn active px-5 py-2.5 rounded-full text-sm font-medium transition-all bg-obsidian text-white shadow-sm";
        } else {
            btn.className = "filter-btn px-5 py-2.5 rounded-full text-sm font-medium transition-all bg-white text-neutral-700 border border-neutral-200 hover:border-gold-400";
        }
    });

    const filtered = category === 'todos' ? PRODUCTS : PRODUCTS.filter(p => p.category === category);
    renderProducts(filtered);
}

// 6. FUNCIONES DEL CARRITO
function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`"${product.name}" agregado a tu bolsa`);
}

function updateQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;

    cart[itemIndex].quantity += change;
    if (cart[itemIndex].quantity <= 0) cart.splice(itemIndex, 1);

    saveCart();
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('aurelia_cart', JSON.stringify(cart));
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const container = document.getElementById('cart-items-container');
    const footer = document.getElementById('cart-footer');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;

    if (cart.length === 0) {
        footer.classList.add('hidden');
        container.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-center py-12">
                <div class="w-20 h-20 rounded-full bg-cream text-gold-400 flex items-center justify-center text-3xl mb-4">
                    <i class="fa-solid fa-bag-shopping"></i>
                </div>
                <h4 class="font-serif text-xl font-bold text-obsidian mb-2">Tu bolsa está vacía</h4>
                <p class="text-sm text-neutral-500 max-w-xs mb-6">Explora nuestra colección y elige esa pieza especial que te hará brillar.</p>
                <button onclick="toggleCart()" class="px-6 py-3 rounded-full bg-obsidian text-white text-xs font-semibold uppercase tracking-wider hover:bg-gold-600 transition-colors">
                    Ver Joyas
                </button>
            </div>
        `;
        return;
    }

    footer.classList.remove('hidden');
    container.innerHTML = '';

    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = "flex gap-4 p-3.5 rounded-2xl bg-cream/60 border border-neutral-200/60 items-center";
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 rounded-xl object-cover shrink-0 bg-white">
            <div class="flex-1 min-w-0">
                <h4 class="font-serif font-bold text-sm text-obsidian truncate">${item.name}</h4>
                <p class="text-xs text-gold-700 font-semibold mt-0.5">${STORE_CONFIG.currency}${item.price.toFixed(2)}</p>
                
                <div class="flex items-center justify-between mt-3">
                    <div class="inline-flex items-center bg-white rounded-full border border-neutral-200 p-0.5">
                        <button onclick="updateQuantity(${item.id}, -1)" class="w-6 h-6 rounded-full hover:bg-neutral-100 text-xs flex items-center justify-center text-neutral-700">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <span class="px-2.5 text-xs font-bold">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="w-6 h-6 rounded-full hover:bg-neutral-100 text-xs flex items-center justify-center text-neutral-700">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    
                    <button onclick="removeFromCart(${item.id})" class="text-neutral-400 hover:text-red-500 text-xs p-1.5 transition-colors" title="Eliminar">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(itemEl);
    });

    const total = getCartTotal();
    subtotalEl.textContent = `${STORE_CONFIG.currency}${total.toFixed(2)}`;
    totalEl.textContent = `${STORE_CONFIG.currency}${total.toFixed(2)}`;
}

function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    const isClosed = drawer.classList.contains('translate-x-full');

    if (isClosed) {
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
        drawer.classList.remove('translate-x-full');
    } else {
        overlay.classList.add('opacity-0');
        drawer.classList.add('translate-x-full');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
}

// 7. MODAL DE PAGO QR Y WHATSAPP
function openCheckoutModal() {
    if (cart.length === 0) {
        showToast("Agrega al menos una joya a tu bolsa primero");
        return;
    }
    toggleCart();

    const total = getCartTotal();
    document.getElementById('modal-total-amount').textContent = `${STORE_CONFIG.currency}${total.toFixed(2)}`;
    
    const summaryContainer = document.getElementById('modal-order-summary');
    summaryContainer.innerHTML = cart.map(item => 
        `<div class="flex justify-between">
            <span>${item.quantity}x ${item.name}</span>
            <span class="font-medium">${STORE_CONFIG.currency}${(item.price * item.quantity).toFixed(2)}</span>
        </div>`
    ).join('');

    const modal = document.getElementById('checkout-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function openCheckoutModalDirect() {
    if (cart.length === 0) addToCart(PRODUCTS[0].id);
    openCheckoutModal();
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function downloadQRImage() {
    const qrImg = document.getElementById('qr-image-display');
    const link = document.createElement('a');
    link.href = qrImg.src;
    link.download = 'QR-Pago-AURELIA-Joyeria.png';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Abriendo imagen QR para guardar...");
}

function sendOrderToWhatsApp(event) {
    event.preventDefault();

    const name = document.getElementById('customer-name').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    const note = document.getElementById('customer-note').value.trim();
    const total = getCartTotal();

    if (!name || !address) {
        showToast("Por favor completa tu nombre y dirección");
        return;
    }

    let productLines = "";
    cart.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        productLines += `▪ ${item.quantity}x *${item.name}* (${STORE_CONFIG.currency}${itemTotal})%0A`;
    });

    let message = `✨ *NUEVO PEDIDO - AURELIA JOYERÍA* ✨%0A%0A`;
    message += `👤 *Cliente:* ${encodeURIComponent(name)}%0A`;
    message += `📍 *Entrega:* ${encodeURIComponent(address)}%0A`;
    if (note) message += `📝 *Nota:* ${encodeURIComponent(note)}%0A`;
    message += `%0A🛍️ *Detalle de Joyas:*%0A${productLines}`;
    message += `%0A💰 *TOTAL PAGADO (QR): ${STORE_CONFIG.currency}${total.toFixed(2)}*%0A%0A`;
    message += `📸 _Adjunto mi comprobante de transferencia QR a continuación:_`;

    const whatsappURL = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${message}`;
    window.open(whatsappURL, '_blank');

    cart = [];
    saveCart();
    updateCartUI();
    closeCheckoutModal();
    showToast("¡Pedido generado! Envía tu captura en WhatsApp.");
}

// 8. NOTIFICACIONES TOAST
let toastTimeout;
function showToast(text) {
    const toast = document.getElementById('toast-notification');
    const messageEl = document.getElementById('toast-message');
    messageEl.textContent = text;
    toast.classList.remove('opacity-0', 'translate-y-8');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-8');
    }, 3000);
}

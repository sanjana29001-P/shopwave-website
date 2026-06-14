// Custom Toast Notification System
function showToast(message) {
  // Create container if it doesn't exist
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  // Icon
  const icon = document.createElement('div');
  icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  
  // Message
  const text = document.createElement('span');
  text.innerText = message;

  toast.appendChild(icon);
  toast.appendChild(text);
  container.appendChild(toast);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      if(toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300); // Wait for animation to finish
  }, 3000);
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
}

/* ==========================================================================
   PRODUCT & INVENTORY DATABASE (LOCALSTORAGE)
   ========================================================================== */

const productMockData = {
  "iPhone 15 Pro Max": { stock: 5, viewers: 18, desc: "Apple's latest flagship phone featuring an aerospace-grade titanium design, a powerful 5x telephoto camera, and the industry-leading A17 Pro chip.", cat: "Electronics", icon: "📱" },
  "The Pragmatic Programmer": { stock: 8, viewers: 14, desc: "A seminal book for software craftspeople. Learn critical thinking, software architecture guidelines, and best practices to code efficiently.", cat: "Books", icon: "📘" },
  "Eloquent JavaScript": { stock: 4, viewers: 22, desc: "A deep dive into JavaScript mechanics, objects, and the browser sandbox. Filled with code exercises and projects.", cat: "Books", icon: "📙" },
  "Atomic Habits": { stock: 11, viewers: 31, desc: "The legendary productivity handbook. Discover how small daily actions compound into life-changing habits.", cat: "Books", icon: "📗" },
  "Clean Code": { stock: 6, viewers: 12, desc: "Master clean programming paradigms. Learn to write readable, refactorable, and modular software elements.", cat: "Books", icon: "📚" },
  "Apple Watch Ultra": { stock: 3, viewers: 7, desc: "The ultimate smartwatch for extreme sports and outdoor navigation, built with titanium armor and multi-band GPS.", cat: "Electronics", icon: "⌚" },
  "Sony WH-1000XM5": { stock: 9, viewers: 16, desc: "Premium wireless headphones with industry-leading active noise cancellation, smart voice pickup, and high-res audio.", cat: "Electronics", icon: "🎧" },
  "PlayStation 5": { stock: 2, viewers: 42, desc: "Next-gen console gaming. Ultra-fast loading SSD, immersive 3D spatial audio, and deep haptic feedback support.", cat: "Electronics", icon: "🎮" },
  "Sony Alpha A7 IV": { stock: 2, viewers: 9, desc: "A hybrid camera combining stellar 33MP photography and pro-grade 4K recording for professional content creators.", cat: "Electronics", icon: "📷" },
  "Premium Cotton T-Shirt": { stock: 25, viewers: 5, desc: "Crafted from 100% long-staple combed cotton. Pre-shrunk, breathable fit designed for active wear.", cat: "Clothing", icon: "👕" },
  "Classic Denim Jacket": { stock: 14, viewers: 8, desc: "A vintage denim jacket tailored with dual-stitching, brass buttons, and reinforced pockets for classic style.", cat: "Clothing", icon: "🧥" },
  "Samsung Microwave Oven": { stock: 7, viewers: 4, desc: "Smart sensor technology countertop microwave. Auto-defrosts and senses moisture to cook food perfectly.", cat: "Home", icon: "♨️" },
  "Dyson V11 Vacuum": { stock: 5, viewers: 11, desc: "High-performance cordless vacuum cleaner. Intelligently senses and adapts suction to carpet and hard floor types.", cat: "Home", icon: "🧹" },
  "Premium Skincare Set": { stock: 18, viewers: 13, desc: "Includes natural hydrating foam cleanser, vitamin C recovery serum, and multi-layer day defense cream.", cat: "Beauty", icon: "🧴" },
  "Luxury Perfume": { stock: 12, viewers: 19, desc: "A premium floral scent blended with warm amber and subtle cedar notes for a lasting signature trail.", cat: "Beauty", icon: "✨" },
  "Pro Yoga Mat": { stock: 20, viewers: 6, desc: "Eco-friendly natural rubber yoga mat. 6mm cushioned layer with laser-engraved alignment lines.", cat: "Sports", icon: "🧘‍♀️" },
  "Adjustable Dumbbell Set": { stock: 4, viewers: 23, desc: "Space-saving home gym system. Adjust weights easily from 2.5 kg up to 24 kg with dial turn selectors.", cat: "Sports", icon: "🏋️" },
  "RC Racing Car": { stock: 8, viewers: 15, desc: "High-speed 4WD remote control car. All-terrain tires, independent shock absorbers, and USB charger.", cat: "Toys", icon: "🏎️" },
  "Creative Building Blocks": { stock: 15, viewers: 10, desc: "Over 800 pieces of engineering block components. Fully compatible with major brands to inspire creative design.", cat: "Toys", icon: "🧱" }
};

function initializeProductDB() {
  if (!localStorage.getItem("shopwave_products")) {
    localStorage.setItem("shopwave_products", JSON.stringify(productMockData));
  }
}

// Injects stocks and viewer badges dynamically to card elements
function renderProductBadges() {
  const db = JSON.parse(localStorage.getItem("shopwave_products"));
  if (!db) return;
  const cards = document.querySelectorAll(".products .card");
  cards.forEach(card => {
    const titleEl = card.querySelector("h3");
    if (!titleEl) return;
    const name = titleEl.innerText.trim();
    const data = db[name];
    if (!data) return;
    
    // Add badge container if not present
    let badgeContainer = card.querySelector(".card-badges");
    if (!badgeContainer) {
      badgeContainer = document.createElement("div");
      badgeContainer.className = "card-badges";
      card.insertBefore(badgeContainer, card.firstChild);
    }
    
    // Live viewers count badge
    let viewersBadge = badgeContainer.querySelector(".badge-live-viewers");
    if (!viewersBadge) {
      viewersBadge = document.createElement("span");
      viewersBadge.className = "badge-live-viewers";
      badgeContainer.appendChild(viewersBadge);
    }
    viewersBadge.innerHTML = `👀 <span class="viewer-count">${data.viewers}</span> watching`;
    
    // Stock levels badge
    let stockBadge = badgeContainer.querySelector(".badge-stock");
    if (!stockBadge) {
      stockBadge = document.createElement("span");
      stockBadge.className = "badge-stock";
      badgeContainer.appendChild(stockBadge);
    }
    
    const btn = card.querySelector("button");
    
    if (data.stock <= 0) {
      stockBadge.className = "badge-stock";
      stockBadge.style.color = "#ef4444";
      stockBadge.style.borderColor = "rgba(239, 68, 68, 0.35)";
      stockBadge.innerHTML = `⚠️ Sold Out`;
      if (btn) {
        btn.disabled = true;
        btn.innerText = "Sold Out";
        btn.style.background = "#1e293b";
        btn.style.borderColor = "#334155";
        btn.style.color = "#64748b";
        btn.style.cursor = "not-allowed";
      }
    } else if (data.stock <= 3) {
      stockBadge.className = "badge-stock";
      stockBadge.style.color = "#f43f5e";
      stockBadge.style.borderColor = "rgba(244, 63, 94, 0.35)";
      stockBadge.innerHTML = `⚡ Only ${data.stock} left`;
      if (btn) {
        btn.disabled = false;
        btn.innerText = "Add To Cart";
        btn.removeAttribute("style");
      }
    } else {
      stockBadge.className = "badge-stock in-stock";
      stockBadge.style.color = "#34d399";
      stockBadge.style.borderColor = "rgba(52, 211, 153, 0.35)";
      stockBadge.innerHTML = `✅ In Stock (${data.stock})`;
      if (btn) {
        btn.disabled = false;
        btn.innerText = "Add To Cart";
        btn.removeAttribute("style");
      }
    }
  });
}

// Simulated dynamic updates to viewers and occasionally stock
function startMetricsSimulation() {
  setInterval(() => {
    const db = JSON.parse(localStorage.getItem("shopwave_products"));
    if (!db) return;
    
    const keys = Object.keys(db);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const product = db[randomKey];
    
    // Tweak viewer numbers
    const viewerDelta = Math.random() > 0.5 ? 1 : -1;
    product.viewers = Math.max(2, product.viewers + viewerDelta * Math.floor(Math.random() * 4));
    
    // Occasional simulated purchases
    if (Math.random() > 0.90 && product.stock > 0) {
      product.stock--;
      
      const cities = ["Mumbai", "Bangalore", "Delhi", "Hyderabad", "Pune", "Chennai", "Kolkata"];
      const names = ["Aravind", "Sneha", "Rohan", "Priya", "Karthik", "Anjali", "Vikram"];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomName = names[Math.floor(Math.random() * names.length)];
      triggerLiveActivityNotification(randomName, randomCity, randomKey, "bought");
    }
    
    localStorage.setItem("shopwave_products", JSON.stringify(db));
    renderProductBadges();
    
    // Update active modal numbers if open
    const modal = document.getElementById("productModal");
    if (modal && modal.classList.contains("active") && currentOpenProduct === randomKey) {
      document.getElementById("modalProductViewers").innerText = `${product.viewers} people watching this item`;
      const stockEl = document.getElementById("modalProductStock");
      if (product.stock <= 0) {
        stockEl.innerText = "Out of Stock";
        stockEl.style.color = "#ef4444";
      } else {
        stockEl.innerText = `In Stock (${product.stock} units left)`;
        stockEl.style.color = "#34d399";
      }
    }
  }, 5000);
}

/* ==========================================================================
   DYNAMIC ACTIVITY NOTIFICATIONS TICKER
   ========================================================================== */

function triggerLiveActivityNotification(name, city, product, action) {
  const ticker = document.getElementById("activityTicker");
  if (!ticker) return;
  
  const toast = document.createElement("div");
  toast.className = "activity-toast";
  
  let actionText = action === "bought" ? "just purchased" : "added to cart";
  let emoji = action === "bought" ? "🛍️" : "🛒";
  
  toast.innerHTML = `
    <span class="activity-icon">${emoji}</span>
    <div>
      <strong>${name}</strong> from ${city} ${actionText} <br>
      <span style="color:var(--primary); font-weight:600; font-size:12.5px;">${product}</span>
    </div>
  `;
  
  ticker.appendChild(toast);
  
  // Slide out and remove toast
  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 400);
  }, 4000);
}

// Periodically runs random activities to make the app feel alive
function startNotificationSimulation() {
  const actions = ["cart", "cart", "bought"];
  const products = Object.keys(productMockData);
  const cities = ["Noida", "Mumbai", "Kochi", "Gurugram", "Ahmedabad", "Chandigarh", "Jaipur", "Lucknow"];
  const names = ["Divya", "Rahul", "Varun", "Kavya", "Siddharth", "Preeti", "Arjun", "Aditi"];
  
  setInterval(() => {
    // Only fire if chatbot or modal is not taking attention (or just occasionally)
    if (Math.random() > 0.6) {
      const name = names[Math.floor(Math.random() * names.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      
      triggerLiveActivityNotification(name, city, product, action);
    }
  }, 10000);
}

/* ==========================================================================
   CART OPERATIONS
   ========================================================================== */

function addToCart(product, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // Verify inventory levels first
  const db = JSON.parse(localStorage.getItem("shopwave_products")) || {};
  const data = db[product];
  if (data && data.stock <= 0) {
    showToast("Sorry, " + product + " is currently sold out!");
    return;
  }
  
  // Decrement stock count
  if (data) {
    data.stock--;
    localStorage.setItem("shopwave_products", JSON.stringify(db));
    renderProductBadges();
  }

  const existingItem = cart.find(item => item.name === product);
  if (existingItem) {
    existingItem.qty = (existingItem.qty || 1) + 1;
  } else {
    cart.push({
      name: product,
      price: price,
      qty: 1,
      id: Date.now()
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  showToast(product + " added to cart!");
}

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(item => item.id === id);
  
  // Return stock to inventory
  if (item) {
    const db = JSON.parse(localStorage.getItem("shopwave_products")) || {};
    const data = db[item.name];
    if (data) {
      data.stock += item.qty;
      localStorage.setItem("shopwave_products", JSON.stringify(db));
    }
  }
  
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  renderProductBadges();
  showToast("Item removed from cart");
}

function updateQty(id, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(item => item.id === id);
  if (!item) return;
  
  const db = JSON.parse(localStorage.getItem("shopwave_products")) || {};
  const data = db[item.name];
  
  if (delta > 0) {
    // Check stock availability
    if (data && data.stock <= 0) {
      showToast("Cannot add more. Item is out of stock!");
      return;
    }
    if (data) data.stock--;
    item.qty++;
  } else {
    if (data) data.stock++;
    item.qty--;
  }
  
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
    showToast("Item removed from cart");
  }
  
  localStorage.setItem("shopwave_products", JSON.stringify(db));
  localStorage.setItem("cart", JSON.stringify(cart));
  
  renderCart();
  renderProductBadges();
}

let couponApplied = localStorage.getItem("couponApplied") === "true";

function renderCart() {
  const list = document.getElementById("cartItems");
  if (!list) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;

  // Clear current list
  list.innerHTML = '';

  const couponSec = document.getElementById("couponSection");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (cart.length === 0) {
    list.innerHTML = '<div class="empty-cart">Your cart is currently empty.</div>';
    if (couponSec) couponSec.style.display = "none";
    if (checkoutBtn) checkoutBtn.style.display = "none";
    return;
  }

  if (couponSec) couponSec.style.display = "flex";
  if (checkoutBtn) checkoutBtn.style.display = "block";

  cart.forEach(item => {
    let li = document.createElement("li");
    
    let nameSpan = document.createElement("span");
    nameSpan.innerText = item.name;
    
    let actionsDiv = document.createElement("div");
    actionsDiv.style.display = "flex";
    actionsDiv.style.alignItems = "center";
    actionsDiv.style.gap = "15px";
    
    // Qty controls
    let qtyDiv = document.createElement("div");
    qtyDiv.className = "cart-item-qty";
    
    let decBtn = document.createElement("button");
    decBtn.className = "qty-btn";
    decBtn.innerText = "-";
    decBtn.onclick = () => updateQty(item.id, -1);
    
    let qtyVal = document.createElement("span");
    qtyVal.className = "qty-val";
    qtyVal.innerText = item.qty || 1;
    
    let incBtn = document.createElement("button");
    incBtn.className = "qty-btn";
    incBtn.innerText = "+";
    incBtn.onclick = () => updateQty(item.id, 1);
    
    qtyDiv.appendChild(decBtn);
    qtyDiv.appendChild(qtyVal);
    qtyDiv.appendChild(incBtn);
    
    let priceSpan = document.createElement("span");
    priceSpan.innerText = formatPrice(item.price * (item.qty || 1));
    
    let removeBtn = document.createElement("button");
    removeBtn.innerHTML = "&times;";
    removeBtn.style.background = "rgba(236, 72, 153, 0.1)";
    removeBtn.style.color = "#ec4899";
    removeBtn.style.border = "none";
    removeBtn.style.borderRadius = "50%";
    removeBtn.style.width = "28px";
    removeBtn.style.height = "28px";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.display = "flex";
    removeBtn.style.alignItems = "center";
    removeBtn.style.justifyContent = "center";
    removeBtn.style.fontSize = "18px";
    removeBtn.onclick = () => removeFromCart(item.id);

    actionsDiv.appendChild(qtyDiv);
    actionsDiv.appendChild(priceSpan);
    actionsDiv.appendChild(removeBtn);
    
    li.appendChild(nameSpan);
    li.appendChild(actionsDiv);

    list.appendChild(li);

    total += item.price * (item.qty || 1);
  });

  // Calculate totals
  let subtotal = total;
  let discount = 0;
  
  if (couponApplied) {
    discount = subtotal * 0.20; // 20% discount
    total = subtotal - discount;
    
    const msg = document.getElementById("couponMessage");
    if (msg) {
      msg.className = "coupon-applied-msg";
      msg.innerText = "Coupon SHOPWAVE20 active (20% discount applied!)";
    }
  }

  // Draw prices summaries
  if (couponApplied) {
    let subtotalRow = document.createElement("div");
    subtotalRow.className = "cart-total";
    subtotalRow.style.fontSize = "18px";
    subtotalRow.style.color = "var(--text-muted)";
    subtotalRow.style.border = "none";
    subtotalRow.style.marginTop = "20px";
    subtotalRow.style.paddingTop = "0";
    subtotalRow.innerHTML = `<span>Subtotal:</span> <span>${formatPrice(subtotal)}</span>`;
    list.appendChild(subtotalRow);

    let discountRow = document.createElement("div");
    discountRow.className = "cart-total";
    discountRow.style.fontSize = "18px";
    discountRow.style.color = "#34d399";
    discountRow.style.border = "none";
    discountRow.style.marginTop = "5px";
    discountRow.style.paddingTop = "0";
    discountRow.innerHTML = `<span>Discount (20%):</span> <span>-${formatPrice(discount)}</span>`;
    list.appendChild(discountRow);
  }

  let totalElement = document.createElement("div");
  totalElement.className = "cart-total";
  totalElement.innerHTML = `<span>Total:</span> <span>${formatPrice(total)}</span>`;
  list.appendChild(totalElement);
}

function applyCouponCode() {
  const codeInput = document.getElementById("couponCode");
  const msgDiv = document.getElementById("couponMessage");
  if (!codeInput || !msgDiv) return;
  
  const code = codeInput.value.trim().toUpperCase();
  if (code === "SHOPWAVE20") {
    couponApplied = true;
    localStorage.setItem("couponApplied", "true");
    renderCart();
    showToast("Coupon Applied successfully!");
  } else {
    msgDiv.style.color = "#ef4444";
    msgDiv.style.fontSize = "13px";
    msgDiv.style.marginTop = "5px";
    msgDiv.innerText = "Invalid coupon code. Try SHOPWAVE20";
  }
}

// Run renderCart if we are on the cart page
if (document.getElementById("cartItems")) {
  renderCart();
}

/* ==========================================================================
   CHECKOUT WIZARD FLOW & 3D CREDIT CARD SIMULATION
   ========================================================================== */

function startCheckoutWizard() {
  // Hide normal cart controls
  document.getElementById("cartItems").style.display = "none";
  document.getElementById("couponSection").style.display = "none";
  document.getElementById("couponMessage").style.display = "none";
  document.getElementById("checkoutBtn").style.display = "none";
  
  // Show Wizard container
  document.getElementById("checkoutWizard").style.display = "block";
}

function submitShippingDetails(e) {
  e.preventDefault();
  
  // Advance timeline line
  document.getElementById("wizardStepLine").style.width = "50%";
  
  // Toggle active headers
  document.getElementById("stepIndicator1").classList.remove("active");
  document.getElementById("stepIndicator1").classList.add("completed");
  document.getElementById("stepIndicator2").classList.add("active");
  
  // Switch panels
  document.getElementById("panelShipping").classList.remove("active");
  document.getElementById("panelPayment").classList.add("active");
}

// Credit card visuals mirror inputs
function updateCardName(val) {
  document.getElementById("cardNameDisplay").innerText = val.toUpperCase() || "YOUR NAME";
}

function updateCardNumber(val) {
  let cleaned = val.replace(/\D/g, '');
  let match = cleaned.match(/.{1,4}/g);
  let formatted = match ? match.join(' ') : '';
  document.getElementById("cardNumDisplay").innerText = formatted || "•••• •••• •••• ••••";
}

function updateCardExpiry(val) {
  document.getElementById("cardExpiryDisplay").innerText = val || "MM/YY";
}

function updateCardCvv(val) {
  document.getElementById("cardCvvDisplay").innerText = val || "•••";
}

function flipCard(isFlipped) {
  const card = document.getElementById("creditCardInner");
  if (!card) return;
  if (isFlipped) {
    card.classList.add("flipped");
  } else {
    card.classList.remove("flipped");
  }
}

function submitPaymentDetails(e) {
  e.preventDefault();
  
  // Show spinner / loading toast
  showToast("Authorizing transactions securely...");
  
  setTimeout(() => {
    // Advance timeline line
    document.getElementById("wizardStepLine").style.width = "100%";
    
    // Toggle active headers
    document.getElementById("stepIndicator2").classList.remove("active");
    document.getElementById("stepIndicator2").classList.add("completed");
    document.getElementById("stepIndicator3").classList.add("active");
    
    // Switch panels
    document.getElementById("panelPayment").classList.remove("active");
    document.getElementById("panelTracking").classList.add("active");
    
    // Clear shopping cart & coupon state
    localStorage.removeItem("cart");
    localStorage.removeItem("couponApplied");
    couponApplied = false;
    
    // Trigger real time order shipment simulation!
    simulateOrderTracking();
  }, 1500);
}

function simulateOrderTracking() {
  const status = document.getElementById("trackerStatusBar");
  const step1 = document.getElementById("timeStep1");
  const step2 = document.getElementById("timeStep2");
  const step3 = document.getElementById("timeStep3");
  const step4 = document.getElementById("timeStep4");
  
  // Step 1: Placed
  status.innerText = "Order verification complete! Placed successfully.";
  step1.classList.add("completed");
  
  // Step 2: Preparing (after 4s)
  setTimeout(() => {
    if (!status) return;
    status.innerText = "Warehouse picked! Packing and sorting order items.";
    step2.classList.add("active");
    step1.classList.remove("active");
    showToast("Warehouse Status: Packaging complete!");
  }, 5000);
  
  // Step 3: Dispatched (after 9s)
  setTimeout(() => {
    if (!status) return;
    status.innerText = "Dispatched! Handed over to courier hub Bangalore.";
    step2.classList.remove("active");
    step2.classList.add("completed");
    step3.classList.add("active");
    showToast("Logistic Status: Handed to courier!");
  }, 10000);
  
  // Step 4: Out for Delivery (after 14s)
  setTimeout(() => {
    if (!status) return;
    status.innerText = "Out for delivery! Agent Rahul (+91 98765 43210) is en route.";
    step3.classList.remove("active");
    step3.classList.add("completed");
    step4.classList.add("active");
    showToast("Delivery Alert: Package is near your address!");
  }, 15000);
}

/* ==========================================================================
   GLASSMORPHISM PRODUCT MODAL & REVIEWS LOGIC
   ========================================================================== */

let currentOpenProduct = null;

const defaultReviews = {
  "The Pragmatic Programmer": [
    { author: "Kiran R.", rating: 5, text: "The software developer Bible. Reading this completely leveled up my design style and mindset." },
    { author: "Ayesha S.", rating: 4, text: "Extremely practical tips on refactoring. Every dev team should read this." }
  ],
  "Eloquent JavaScript": [
    { author: "Piyush T.", rating: 5, text: "Excellent handbook. Introduces closures and async concepts in a very understandable way." }
  ],
  "Atomic Habits": [
    { author: "Sunita G.", rating: 5, text: "Tiny habits truly yield compound interest. This book helped me optimize my work schedules." },
    { author: "Harsh D.", rating: 5, text: "A life changing manual. Highly recommend to everyone." }
  ],
  "Clean Code": [
    { author: "Rohit V.", rating: 5, text: "Must read. Simple rules on naming variables and functions made a huge difference on our sprint speed." }
  ]
};

function initializeReviews() {
  if (!localStorage.getItem("shopwave_reviews")) {
    localStorage.setItem("shopwave_reviews", JSON.stringify(defaultReviews));
  }
}

function openProductModal(name, basePrice, icon, category) {
  currentOpenProduct = name;
  
  const db = JSON.parse(localStorage.getItem("shopwave_products")) || {};
  const data = db[name] || { stock: 8, viewers: 12, desc: "Premium quality store product. Premium packaging and secure warranty included.", cat: category || "General", icon: icon || "🛍️" };
  
  // Apply flash sale display discount if relevant
  let displayPrice = basePrice;
  if (data.cat === "Books" || data.cat === "Electronics") {
    displayPrice = Math.round(basePrice * 0.8);
  }
  
  // Write variables to UI modal
  document.getElementById("modalProductName").innerText = name;
  document.getElementById("modalProductPrice").innerHTML = `
    <span style="font-size:14px; text-decoration:line-through; color:var(--text-muted); font-weight:400;">${formatPrice(basePrice)}</span> 
    <span>${formatPrice(displayPrice)}</span>
    <span style="font-size:11px; background:#f43f5e; color:white; padding:2px 6px; border-radius:4px; margin-left:10px;">⚡ 20% SALE</span>
  `;
  document.getElementById("modalProductIcon").innerText = data.icon;
  document.getElementById("modalProductDesc").innerText = data.desc;
  document.getElementById("modalProductCategory").innerText = data.cat;
  
  // Stock display
  const stockEl = document.getElementById("modalProductStock");
  if (data.stock <= 0) {
    stockEl.innerText = "Out of Stock";
    stockEl.style.color = "#ef4444";
  } else {
    stockEl.innerText = `In Stock (${data.stock} units left)`;
    stockEl.style.color = "#34d399";
  }
  
  // Viewers
  document.getElementById("modalProductViewers").innerText = `${data.viewers} people are viewing this product`;
  
  // Buy button
  const buyBtn = document.getElementById("modalAddToCartBtn");
  buyBtn.onclick = () => {
    addToCart(name, displayPrice);
    closeProductModal();
  };
  
  if (data.stock <= 0) {
    buyBtn.disabled = true;
    buyBtn.innerText = "Sold Out";
    buyBtn.style.background = "#1e293b";
    buyBtn.style.color = "#64748b";
  } else {
    buyBtn.disabled = false;
    buyBtn.innerText = "Add to Cart";
    buyBtn.removeAttribute("style");
  }
  
  renderReviewsList(name);
  
  document.getElementById("productModal").classList.add("active");
}

function closeProductModal() {
  document.getElementById("productModal").classList.remove("active");
  currentOpenProduct = null;
}

function renderReviewsList(name) {
  const list = document.getElementById("modalReviewsList");
  if (!list) return;
  list.innerHTML = "";
  
  const reviewsDb = JSON.parse(localStorage.getItem("shopwave_reviews")) || {};
  const reviews = reviewsDb[name] || [
    { author: "Verified Customer", rating: 5, text: "Outstanding quality. Very happy with the product!" }
  ];
  
  let totalRating = 0;
  reviews.forEach(r => totalRating += r.rating);
  const avg = (totalRating / reviews.length).toFixed(1);
  
  document.getElementById("reviewsAverage").innerText = `⭐ ${avg} / 5 (${reviews.length} reviews)`;
  
  reviews.forEach(r => {
    const item = document.createElement("div");
    item.className = "review-item";
    
    let stars = "⭐".repeat(r.rating);
    item.innerHTML = `
      <div class="review-top">
        <span class="review-author">${r.author}</span>
        <span class="review-stars">${stars}</span>
      </div>
      <p class="review-text">${r.text}</p>
    `;
    list.appendChild(item);
  });
}

function submitProductReview(e) {
  e.preventDefault();
  if (!currentOpenProduct) return;
  
  const authorInput = document.getElementById("reviewAuthor");
  const ratingInput = document.getElementById("reviewRating");
  const textInput = document.getElementById("reviewText");
  
  const reviewsDb = JSON.parse(localStorage.getItem("shopwave_reviews")) || {};
  if (!reviewsDb[currentOpenProduct]) {
    reviewsDb[currentOpenProduct] = [];
  }
  
  reviewsDb[currentOpenProduct].unshift({
    author: authorInput.value.trim(),
    rating: parseInt(ratingInput.value),
    text: textInput.value.trim()
  });
  
  localStorage.setItem("shopwave_reviews", JSON.stringify(reviewsDb));
  
  authorInput.value = "";
  textInput.value = "";
  
  renderReviewsList(currentOpenProduct);
  showToast("Your review has been published in real-time!");
}

/* ==========================================================================
   AI LIVE CHATBOT SUPPORT
   ========================================================================== */

let chatbotOpen = false;

function toggleChatbot() {
  const container = document.getElementById("chatContainer");
  if (!container) return;
  chatbotOpen = !chatbotOpen;
  
  if (chatbotOpen) {
    container.classList.add("active");
    setTimeout(() => {
      document.getElementById("chatInput")?.focus();
    }, 200);
  } else {
    container.classList.remove("active");
  }
}

function handleChatKeyPress(e) {
  if (e.key === 'Enter') {
    sendChatMessage();
  }
}

function sendChatMessage() {
  const input = document.getElementById("chatInput");
  if (!input || !input.value.trim()) return;
  
  const text = input.value.trim();
  appendChatMessage("user", text);
  input.value = "";
  
  // Show bot typing loader
  const messagesArea = document.getElementById("chatMessages");
  const typing = document.createElement("div");
  typing.className = "typing-indicator";
  typing.id = "chatBotTyping";
  typing.innerHTML = `
    <div class="typing-dots"></div>
    <div class="typing-dots"></div>
    <div class="typing-dots"></div>
  `;
  messagesArea.appendChild(typing);
  messagesArea.scrollTop = messagesArea.scrollHeight;
  
  setTimeout(() => {
    // Remove loader
    const loader = document.getElementById("chatBotTyping");
    if (loader) loader.parentNode.removeChild(loader);
    
    // Auto reply
    const reply = getChatbotReply(text);
    appendChatMessage("bot", reply);
  }, 1000);
}

function appendChatMessage(sender, text) {
  const messagesArea = document.getElementById("chatMessages");
  if (!messagesArea) return;
  
  const msg = document.createElement("div");
  msg.className = `chat-msg ${sender}`;
  msg.innerText = text;
  
  messagesArea.appendChild(msg);
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

function getChatbotReply(query) {
  const q = query.toLowerCase();
  
  if (q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("greet")) {
    return "Hello! Welcome to ShopWave Support. I am your automated shopping assistant. How can I help you today? You can ask about our catalog books, shipping policies, or promo codes!";
  }
  if (q.includes("book") || q.includes("pragmatic") || q.includes("eloquent") || q.includes("clean code") || q.includes("habits") || q.includes("read")) {
    return "We have four bestselling software books in stock: 'The Pragmatic Programmer' (₹1,499), 'Eloquent JavaScript' (₹1,299), 'Atomic Habits' (₹799), and 'Clean Code' (₹1,699). We are running a 20% sale on them!";
  }
  if (q.includes("mac") || q.includes("macbook") || q.includes("laptop")) {
    return "The MacBook Pro has been sold out and is currently removed from our storefront to catalog focus on our new Books section. Let me know if you want references to any programming books!";
  }
  if (q.includes("discount") || q.includes("coupon") || q.includes("offer") || q.includes("code") || q.includes("promo")) {
    return "Get 20% discount on checkout by entering coupon code: SHOPWAVE20. We also have a live 20% Flash Sale running on all Books and Electronics!";
  }
  if (q.includes("shipping") || q.includes("delivery") || q.includes("courier") || q.includes("ship")) {
    return "We ship items free of charge for orders exceeding ₹500. Delivery takes 2-3 business days. Once checked out, you can track packages live on the tracking wizard tab!";
  }
  if (q.includes("refund") || q.includes("return") || q.includes("policy")) {
    return "We support hassle-free 30-day returns. Simply email support@shopwave.com with order details and we'll schedule a pickup.";
  }
  if (q.includes("order") || q.includes("track") || q.includes("status")) {
    return "You can view your current cart items on the Cart page. Once you complete the payment, a live tracking system displays packaging, dispatching, and en-route statuses in real-time.";
  }
  
  return "I'm sorry, I'm still learning. You can ask about 'books', 'coupons', 'discounts', 'shipping details', or support contact emails!";
}

/* ==========================================================================
   FLASH SALE COUNTDOWN BANNER (2 HOURS 45 MINUTES)
   ========================================================================== */

let flashSaleInterval = null;

function startFlashSaleTimer() {
  let h = 2;
  let m = 45;
  let s = 0;
  
  const updateDigits = () => {
    const hoursDigit = document.getElementById("countdown-hours");
    const minutesDigit = document.getElementById("countdown-minutes");
    const secondsDigit = document.getElementById("countdown-seconds");
    
    if (!hoursDigit) return;
    
    hoursDigit.innerText = h.toString().padStart(2, '0');
    minutesDigit.innerText = m.toString().padStart(2, '0');
    secondsDigit.innerText = s.toString().padStart(2, '0');
  };
  
  updateDigits();
  
  flashSaleInterval = setInterval(() => {
    if (s > 0) {
      s--;
    } else if (m > 0) {
      m--;
      s = 59;
    } else if (h > 0) {
      h--;
      m = 59;
      s = 59;
    } else {
      clearInterval(flashSaleInterval);
    }
    updateDigits();
  }, 1000);
}

/* ==========================================================================
   SEARCH & FILTERS INITIALIZATION
   ========================================================================== */

// Search Functionality
const searchInput = document.querySelector('.search');
if (searchInput) {
  searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const productCards = document.querySelectorAll('.products .card');
    
    // If we are not on the products page, redirect to it with the search term
    if (productCards.length === 0 && searchTerm.length > 0) {
      // Allow pressing enter to search if not on products page
      searchInput.addEventListener('keypress', function(k) {
        if (k.key === 'Enter') {
          window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
        }
      });
      return;
    }

    let visibleCount = 0;

    productCards.forEach(card => {
      const productName = card.querySelector('h3').innerText.toLowerCase();
      const productTags = card.getAttribute('data-tags') ? card.getAttribute('data-tags').toLowerCase() : '';
      
      if (productName.includes(searchTerm) || productTags.includes(searchTerm)) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Handle 'No products found' state
    let noResultsMsg = document.getElementById('no-results-msg');
    const productsContainer = document.querySelector('.products');
    
    if (visibleCount === 0) {
      if (!noResultsMsg && productsContainer) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'no-results-msg';
        noResultsMsg.style.gridColumn = '1 / -1';
        noResultsMsg.style.textAlign = 'center';
        noResultsMsg.style.padding = '40px';
        noResultsMsg.style.fontSize = '20px';
        noResultsMsg.style.color = 'var(--text-muted)';
        productsContainer.appendChild(noResultsMsg);
      }
      if(noResultsMsg) {
        noResultsMsg.innerText = `No products found matching "${searchTerm}".`;
        noResultsMsg.style.display = 'block';
      }
    } else if (noResultsMsg) {
      noResultsMsg.style.display = 'none';
    }
  });

  // Check URL parameters on load for products page
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  if (searchParam) {
    searchInput.value = searchParam;
    // Trigger the input event to filter products immediately
    searchInput.dispatchEvent(new Event('input'));
  }
}

// Category Filtering Logic
const categoryPills = document.querySelectorAll('.pill-card');
const sidebarFilters = document.querySelectorAll('.filter-group li');
const productCards = document.querySelectorAll('.products .card');
const showingCount = document.getElementById('showing-count');

function filterByCategory(category) {
  let visibleCount = 0;
  const searchTerm = category.toLowerCase();

  // Update active state in sidebar
  sidebarFilters.forEach(li => {
    if (li.innerText.toLowerCase() === searchTerm) {
      li.classList.add('active');
    } else {
      li.classList.remove('active');
    }
  });

  // Filter products
  productCards.forEach(card => {
    const productTags = card.getAttribute('data-tags') ? card.getAttribute('data-tags').toLowerCase() : '';
    
    // Map UI categories to our data-tags
    let match = false;
    if (searchTerm === 'all') {
      match = true;
    } else if (searchTerm === 'electronics' && (productTags.includes('phone') || productTags.includes('laptop') || productTags.includes('watch') || productTags.includes('audio') || productTags.includes('gaming') || productTags.includes('camera'))) {
      match = true;
    } else if (searchTerm === 'clothing' && productTags.includes('cloth')) {
      match = true;
    } else if (searchTerm === 'home' && productTags.includes('home')) {
      match = true;
    } else if (searchTerm === 'books' && productTags.includes('book')) {
      match = true;
    } else if (searchTerm === 'sports' && productTags.includes('sport')) {
      match = true;
    } else if (searchTerm === 'beauty' && productTags.includes('beauty')) {
      match = true;
    } else if (searchTerm === 'toys' && productTags.includes('toy')) {
      match = true;
    }

    if (match) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Update count text
  if (showingCount) {
    showingCount.innerText = `Showing ${visibleCount} products`;
  }

  // Handle empty state
  let noResultsMsg = document.getElementById('no-results-msg');
  const productsContainer = document.querySelector('.products');
  
  if (visibleCount === 0) {
    if (!noResultsMsg && productsContainer) {
      noResultsMsg = document.createElement('div');
      noResultsMsg.id = 'no-results-msg';
      noResultsMsg.style.gridColumn = '1 / -1';
      noResultsMsg.style.textAlign = 'center';
      noResultsMsg.style.padding = '40px';
      noResultsMsg.style.fontSize = '20px';
      noResultsMsg.style.color = 'var(--text-muted)';
      productsContainer.appendChild(noResultsMsg);
    }
    if(noResultsMsg) {
      noResultsMsg.innerText = `No products found in "${category}".`;
      noResultsMsg.style.display = 'block';
    }
  } else if (noResultsMsg) {
    noResultsMsg.style.display = 'none';
  }
}

// Add event listeners to category pills
categoryPills.forEach(pill => {
  pill.addEventListener('click', () => {
    const category = pill.querySelector('span').innerText;
    filterByCategory(category);
  });
});

// Add event listeners to sidebar filters
sidebarFilters.forEach(li => {
  li.addEventListener('click', () => {
    const category = li.innerText;
    filterByCategory(category);
  });
});

/* ==========================================================================
   APP STARTUP LOGIC
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initializeProductDB();
  initializeReviews();
  renderProductBadges();
  startMetricsSimulation();
  startNotificationSimulation();
  startFlashSaleTimer();
});

// Polyfill in case DOMContentLoaded has already fired
if (document.readyState === "interactive" || document.readyState === "complete") {
  initializeProductDB();
  initializeReviews();
  renderProductBadges();
  startMetricsSimulation();
  startNotificationSimulation();
  startFlashSaleTimer();
}
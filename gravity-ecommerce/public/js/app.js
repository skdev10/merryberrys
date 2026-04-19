let cart = JSON.parse(localStorage.getItem('gravity_cart')) || [];

const Cart = {
  save: () => localStorage.setItem('gravity_cart', JSON.stringify(cart)),
  add: (product) => {
    Auth.requireAuth(() => {
      const existing = cart.find(i => i.product === product.id);
      if(existing) existing.quantity += 1;
      else cart.push({ ...product, quantity: 1 });
      Cart.save();
      Cart.render();
      alert('Item added to cart!'); // Usually we'd do a nice notification
      document.getElementById('cart-drawer').classList.add('open');
    });
  },
  remove: (id) => {
    cart = cart.filter(i => i.product !== id);
    Cart.save();
    Cart.render();
  },
  getTotal: () => cart.reduce((sum, i) => sum + (i.price * i.quantity), 0),
  render: () => {
    const list = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total-price');
    const countEl = document.getElementById('cart-count-badge');
    
    if(!list || !totalEl || !countEl) return;

    countEl.innerText = cart.reduce((sum, i) => sum + i.quantity, 0);
    totalEl.innerText = `$${Cart.getTotal().toFixed(2)}`;
    list.innerHTML = '';

    cart.forEach(item => {
      list.innerHTML += `
        <div class="cart-item">
          <img src="${item.img || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200'}" alt="">
          <div style="flex:1;">
            <p>${item.name}</p>
            <p style="color:var(--accent-gold)">$${item.price.toFixed(2)} x ${item.quantity}</p>
            <button onclick="Cart.remove('${item.product}')" style="background:none;border:none;color:red;cursor:pointer;margin-top:5px;font-size:0.8rem">Remove</button>
          </div>
        </div>
      `;
    });
  }
};

// Scroll Animations using Intersection Observer
document.addEventListener('DOMContentLoaded', () => {
  Cart.render();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  // Toggle Cart Drawer
  const cartIcon = document.getElementById('cart-icon');
  const cartDrawer = document.getElementById('cart-drawer');
  const closeCartBtn = document.getElementById('close-cart');

  if(cartIcon) cartIcon.addEventListener('click', () => Auth.requireAuth(() => cartDrawer.classList.add('open')));
  if(closeCartBtn) closeCartBtn.addEventListener('click', () => cartDrawer.classList.remove('open'));
});

// Mock Stripe Checkout Initiation
window.proceedToCheckout = () => {
  Auth.requireAuth(() => {
    if(cart.length === 0) return alert('Cart is empty!');
    window.location.href = '/checkout.html';
  });
};

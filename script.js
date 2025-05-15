
const products = [
  { name: 'Tapsilog', price: 85, img: 'images/tapsilog.jpg' },
  { name: 'Hotsilog', price: 70, img: 'images/hotsilog.jpg' },
  { name: 'Cornsilog', price: 75, img: 'images/cornsilog.jpg' },
  { name: 'Chicken Inasal', price: 120, img: 'images/inasal.jpg' },
  { name: 'Fried Chicken w/ Rice', price: 99, img: 'images/fried_chicken.jpg' },
  { name: 'Pares Overload', price: 150, img: 'images/pares.jpg' }
];

let cart = JSON.parse(localStorage.getItem('cart') || '[]');

const list = document.getElementById('product-list');
const table = document.getElementById('cart-table');

function renderProducts() {
  list.innerHTML = '';
  products.forEach((p, i) => {
    list.innerHTML += `
      <div class='col-md-4 product'>
        <img src='${p.img}' alt='${p.name}' />
        <h5>${p.name}</h5>
        <p>₱${p.price.toLocaleString()}</p>
        <button class='btn-buy' onclick='addToCart(${i})'>Add to Cart</button>
      </div>`;
  });
}

function addToCart(index) {
  const item = products[index];
  const existing = cart.find(p => p.name === item.name);
  if (existing) existing.qty++;
  else cart.push({ ...item, qty: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  alert(`${item.name} added to cart.`);
}

function renderCart() {
  if(cart.length === 0) {
    table.innerHTML = '<tr><td colspan="4" class="text-center">Your cart is empty.</td></tr>';
    document.getElementById('total').textContent = '0';
    return;
  }
  table.innerHTML = `<tr><th>Product</th><th>Qty</th><th>Price</th><th>Remove</th></tr>`;
  let total = 0;
  cart.forEach((item, i) => {
    const subtotal = item.qty * item.price;
    total += subtotal;
    table.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td><input type='number' min='1' value='${item.qty}' onchange='updateQty(${i}, this.value)'/></td>
        <td>₱${subtotal.toLocaleString()}</td>
        <td><button class='btn-remove' onclick='removeItem(${i})'>Remove</button></td>
      </tr>`;
  });
  document.getElementById('total').textContent = total.toLocaleString();
}

function updateQty(index, qty) {
  qty = parseInt(qty);
  if (qty < 1) qty = 1;
  cart[index].qty = qty;
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

renderProducts();
renderCart();

document.getElementById('checkout-form').addEventListener('submit', e => {
  e.preventDefault();
  if(cart.length === 0){
    alert('Your cart is empty! Add items before checking out.');
    return;
  }
  cart = [];
  localStorage.removeItem('cart');
  renderCart();
  e.target.reset();
  const successMsg = document.getElementById('success-msg');
  successMsg.style.display = 'block';
  setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
});

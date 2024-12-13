import renderToDOM from '../utils/renderToDom';
import clearDom from '../utils/clearDom';

// call this function to render output if there are no orders to display
const emptyOrders = () => {
  const domString = `
    <div class="no-orders">
      <h1>No Orders Found</h1>
    </div>`;
  renderToDOM('#orders-container', domString);
};

const createOrderCard = (item) => {
  const orderType = item.order_type === 'dine_in' ? 'in-person' : 'phone';

  return `
    <div class="order-card">
      <h5 class="card-title">${item.order_name}</h5>
      <div class="order-info">
        <div class="order-status ${item.status.toLowerCase()}">
          Order Status (${item.status.toLowerCase()})
        </div>
        <div class="contact-info">
          <div class="phone">${item.customer_phone}</div>
          <div class="email">${item.customer_email}</div>
        </div>
        <div class="order-type">Order Type (${orderType})</div>
      </div>
      <div class="order-card-btns-container">
        <a href="#" id="order-card-details--${item.firebaseKey}" class="view-details">Details</a>
        <a href="#" id="order-card-edit--${item.firebaseKey}" class="edit">Edit</a>
        <a href="#" id="order-card-delete--${item.firebaseKey}" class="delete">Delete</a>
      </div>
    </div>`;
};

// Updates the visibility of order cards based on search term
const updateOrderVisibility = (searchTerm) => {
  const orderCards = document.querySelectorAll('.order-card');
  const searchLower = searchTerm.toLowerCase();

  orderCards.forEach((card) => {
    const cardContent = card.textContent.toLowerCase();
    const cardClone = card.cloneNode(true);
    cardClone.style.display = cardContent.includes(searchLower) ? 'block' : 'none';
    card.parentNode.replaceChild(cardClone, card);
  });
};

// Sets up the search functionality for orders
const setupSearch = (searchInput) => {
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    updateOrderVisibility(e.target.value);
  });
};

// Renders the orders view with search and order cards
const showOrders = (array) => {
  clearDom();

  const domString = `
    <div class="search-orders">
      <input type="text" placeholder="Search Orders" id="search-orders-input">
    </div>
    <div class="orders-grid">
      ${array.map(createOrderCard).join('')}
    </div>`;

  renderToDOM('#orders-container', domString);
  setupSearch(document.querySelector('#search-orders-input'));
};

export {
  emptyOrders,
  showOrders
};

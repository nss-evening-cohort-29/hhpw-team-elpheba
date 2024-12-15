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
    <div class="order-card d-block" data-status="${item.status}">
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

// Updates the visibility of order cards based on search term and status filter
const updateOrderVisibility = (searchTerm = '', statusFilter = 'all') => {
  const orderCards = document.querySelectorAll('.order-card');
  const searchLower = searchTerm.toLowerCase();

  orderCards.forEach((orderCard) => {
    const cardContent = orderCard.textContent.toLowerCase();
    const cardStatus = orderCard.dataset.status;
    const matchesSearch = cardContent.includes(searchLower);
    const matchesStatus = statusFilter === 'all' || cardStatus === statusFilter;

    // Use classList instead of style.display
    if (matchesSearch && matchesStatus) {
      orderCard.classList.remove('d-none');
    } else {
      orderCard.classList.add('d-none');
    }
  });
};

// Sets up the search functionality for orders
const setupSearch = (searchInput) => {
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const activeButton = document.querySelector('.filter-btn.active');
    const activeFilter = activeButton ? activeButton.dataset.filter : 'all';
    updateOrderVisibility(e.target.value, activeFilter);
  });
};

// Sets up filter buttons functionality
const setupFilterButtons = () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      // Add active class to clicked button
      const clickedButton = e.target;
      clickedButton.classList.add('active');

      const searchInput = document.querySelector('#search-orders-input');
      const searchTerm = searchInput ? searchInput.value : '';
      updateOrderVisibility(searchTerm, clickedButton.dataset.filter);
    });
  });
};

// Renders the orders view with search and order cards
const showOrders = (array, defaultFilter = 'all') => {
  clearDom();

  if (!array.length) {
    emptyOrders();
    return;
  }

  const domString = `
    <div class="orders-container">
      <div class="orders-header mb-4">
        <div class="d-flex align-items-center gap-2">
          <div class="btn-group me-3" role="group" aria-label="Order filters">
            <button class="btn btn-outline-black filter-btn ${defaultFilter === 'all' ? 'active' : ''}" data-filter="all">
              <i class="fas fa-list me-1"></i>
            </button>
            <button class="btn btn-outline-warning filter-btn ${defaultFilter === 'open' ? 'active' : ''}" data-filter="open">
              <i class="fas fa-clock"></i>
              <span class="visually-hidden">Open Orders</span>
            </button>
            <button class="btn btn-outline-success filter-btn ${defaultFilter === 'closed' ? 'active' : ''}" data-filter="closed">
              <i class="fas fa-check-circle"></i>
              <span class="visually-hidden">Closed Orders</span>
            </button>
          </div>
          <div class="search-orders flex-grow-1">
            <div class="input-group">
              <span class="input-group-text bg-transparent">
                <i class="fas fa-search"></i>
              </span>
              <input type="text" placeholder="Search Orders" id="search-orders-input" class="form-control border-start-0">
            </div>
          </div>
        </div>
      </div>
      <div class="orders-grid">
        ${array.map(createOrderCard).join('')}
      </div>
    </div>`;

  renderToDOM('#orders-container', domString);

  // Set up search and filter functionality
  setupSearch(document.querySelector('#search-orders-input'));
  setupFilterButtons();

  // Apply initial filter if specified
  if (defaultFilter !== 'all') {
    updateOrderVisibility('', defaultFilter);
  }
};

export {
  emptyOrders,
  showOrders
};

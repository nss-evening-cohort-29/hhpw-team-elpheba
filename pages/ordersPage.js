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
  const searchLower = searchTerm.toLowerCase().trim();
  const statusLower = statusFilter.toLowerCase().trim();

  orderCards.forEach((orderCard) => {
    const cardContent = orderCard.textContent.toLowerCase();
    const cardStatus = orderCard.dataset.status.toLowerCase().trim();
    const matchesSearch = cardContent.includes(searchLower);
    const matchesStatus = statusLower === 'all' || cardStatus === statusLower;

    // Use a single toggle call with computed visibility
    orderCard.classList.toggle('d-none', !(matchesSearch && matchesStatus));
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
  const ordersContainer = document.querySelector('.orders-container');
  if (!ordersContainer) return;

  const btnGroup = ordersContainer.querySelector('.btn-group');
  if (!btnGroup) return;

  btnGroup.addEventListener('click', (e) => {
    const filterButton = e.target.closest('.filter-btn');
    if (!filterButton) return;

    e.preventDefault();
    e.stopPropagation();

    const filterButtons = btnGroup.querySelectorAll('.filter-btn');

    filterButtons.forEach((btn) => btn.classList.remove('active'));

    filterButton.classList.add('active');

    const searchInput = document.querySelector('#search-orders-input');
    const searchTerm = searchInput ? searchInput.value : '';

    // Update visibility with the clicked button's filter
    updateOrderVisibility(searchTerm, filterButton.dataset.filter);
  });
};

// Renders the orders view with search and order cards
const showOrders = (array, defaultFilter = 'all') => {
  clearDom();

  if (!array.length) {
    emptyOrders();
    return;
  }

  // Sort the array to show 'open' orders first
  const sortedArray = [...array].sort((a, b) => {
    const statusA = a.status.toLowerCase();
    const statusB = b.status.toLowerCase();

    // 'open' orders should come first
    if (statusA === 'open' && statusB !== 'open') return -1;
    if (statusA !== 'open' && statusB === 'open') return 1;

    // For orders with the same status, maintain their original order
    return 0;
  });

  const domString = `
    <div class="orders-container">
      <div class="orders-header mb-4">
        <div class="d-flex align-items-center gap-2">
          <div class="btn-group me-3" role="group" aria-label="Order filters">
            <button class="btn btn-outline-black filter-btn ${defaultFilter === 'all' ? 'active' : ''}" data-filter="all">
              <i class="fas fa-list me-1"> All </i>
            </button>
            <button class="btn btn-outline-warning filter-btn ${defaultFilter === 'open' ? 'active' : ''}" data-filter="open">
              <i class="fas fa-clock"></i>
              <span>Open</span>
            </button>
            <button class="btn btn-outline-success filter-btn ${defaultFilter === 'closed' ? 'active' : ''}" data-filter="closed">
              <i class="fas fa-check-circle"></i>
              <span>Closed</span>
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
        ${sortedArray.map(createOrderCard).join('')}
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

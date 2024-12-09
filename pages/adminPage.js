import renderToDOM from '../utils/renderToDom';
import { getOrders } from '../api/orders';
import { showOrders } from './ordersPage';

const adminPageEvents = (user) => {
  // Helper function to safely add event listeners
  const addClickHandler = (elementId, handler) => {
    const element = document.querySelector(elementId);
    if (element) {
      element.addEventListener('click', handler);
    }
  };

  // View Orders
  addClickHandler('#admin-view-orders', () => {
    getOrders(user.uid).then(showOrders);
  });

  // Create Order
  addClickHandler('#admin-create-order', () => {
    const domString = `
      <div class="create-order-container">
        <h1>Create New Order</h1>
        <div id="create-order-form"></div>
      </div>`;
    renderToDOM('#admin-dashboard', domString);
  });

  // View Revenue
  addClickHandler('#admin-view-revenue', () => {
    const domString = `
      <div class="revenue-container">
        <h1>Revenue Overview</h1>
        <div id="revenue-details"></div>
      </div>`;
    renderToDOM('#admin-dashboard', domString);
  });

  // Manage Menu
  addClickHandler('#admin-manage-menu', () => {
    const domString = `
      <div class="container mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1>Menu Management</h1>
          <button class="btn btn-success" id="add-menu-item">
            <i class="fas fa-plus"></i> Add Menu Item
          </button>
        </div>
        <div id="menu-items-container"></div>
      </div>`;
    renderToDOM('#admin-dashboard', domString);
  });

  // Manage Users
  addClickHandler('#admin-manage-users', () => {
    const domString = `
      <div class="container mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1>User Management</h1>
          <button class="btn btn-success" id="add-user">
            <i class="fas fa-user-plus"></i> Add User
          </button>
        </div>
        <div id="users-container"></div>
      </div>`;
    renderToDOM('#admin-dashboard', domString);
  });

  // System Settings
  addClickHandler('#admin-settings', () => {
    const domString = `
      <div class="container mt-4">
        <h1>System Settings</h1>
        <div class="row mt-4">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h4>General Settings</h4>
              </div>
              <div class="card-body">
                <form id="general-settings-form">
                  <!-- TODO: Add Settings fields here -->
                </form>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h4>Notification Settings</h4>
              </div>
              <div class="card-body">
                <form id="notification-settings-form">
                  <!-- TODO: Add notification settings here -->
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    renderToDOM('#admin-dashboard', domString);
  });

  // Refresh Stats
  addClickHandler('#refresh-stats', async () => {
    try {
      // Update stats display
      const updateStatDisplay = (elementId, value) => {
        const element = document.querySelector(elementId);
        if (element) {
          element.textContent = value;
        }
      };

      // Get today's date for filtering
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get orders for today
      const todaysOrders = await getOrders(user.uid);
      const todaysOrderCount = todaysOrders.filter((order) => {
        const orderDate = new Date(order.date);
        return orderDate >= today;
      }).length;

      // Get open orders
      const openOrders = todaysOrders.filter((order) => order.status === 'pending').length;

      // Calculate revenue (assuming orders have an amount field)
      const todaysRevenue = todaysOrders
        .filter((order) => {
          const orderDate = new Date(order.date);
          return orderDate >= today;
        })
        .reduce((total, order) => total + (order.amount || 0), 0);

      // Update the display
      updateStatDisplay('#today-orders', todaysOrderCount);
      updateStatDisplay('#open-orders', openOrders);
      updateStatDisplay('#today-revenue', `$${todaysRevenue.toFixed(2)}`);
      updateStatDisplay('#orders-count', `${openOrders} Active`);

      // Show a success message
      const activityFeed = document.querySelector('#recent-activity');
      if (activityFeed) {
        activityFeed.innerHTML = `
          <div class="alert alert-success" role="alert">
            <i class="fas fa-check-circle me-2"></i> Stats refreshed successfully
          </div>
          <p class="text-muted">Last updated: ${new Date().toLocaleTimeString()}</p>
        `;
      }
    } catch (error) {
      // Handle any errors
      const activityFeed = document.querySelector('#recent-activity');
      if (activityFeed) {
        activityFeed.innerHTML = `
          <div class="alert alert-danger" role="alert">
            <i class="fas fa-exclamation-circle me-2"></i> Error refreshing stats: ${error.message}
          </div>
        `;
      }
    }
  });
};

const showAdminDashboard = (user) => {
  const today = new Date().toLocaleDateString();

  const domString = `
    <!-- Welcome Section -->
    <div class="admin-header text-center mb-4">
      <h1>Welcome ${user.displayName}!</h1>
      <p class="lead">Hip Hop Pizza & Wings Management System</p>
      <p class="text-muted">Today: ${today}</p>
    </div>

    <!-- Quick Stats Section -->
    <div class="card mb-4">
      <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <h3 class="m-0">Quick Stats</h3>
        <button class="btn btn-outline-light btn-sm" id="refresh-stats">
          <i class="fas fa-sync-alt"></i> Refresh
        </button>
      </div>
      <div class="card-body">
        <div class="row text-center">
          <div class="col-md-3">
            <div class="stats-item">
              <i class="fas fa-clipboard-list fa-2x mb-2 text-primary"></i>
              <h4>Today's Orders</h4>
              <p class="h2" id="today-orders">0</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stats-item">
              <i class="fas fa-clock fa-2x mb-2 text-warning"></i>
              <h4>Open Orders</h4>
              <p class="h2" id="open-orders">0</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stats-item">
              <i class="fas fa-dollar-sign fa-2x mb-2 text-success"></i>
              <h4>Today's Revenue</h4>
              <p class="h2" id="today-revenue">$0</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stats-item">
              <i class="fas fa-users fa-2x mb-2 text-info"></i>
              <h4>Total Customers</h4>
              <p class="h2" id="total-customers">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Actions Grid -->
    <div class="row g-4">
      <!-- Order Management Card -->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h3 class="m-0">Order Management</h3>
            <span class="badge bg-light text-primary" id="orders-count">0 Active</span>
          </div>
          <div class="card-body d-grid gap-2">
            <button class="btn btn-info btn-lg w-100" id="admin-view-orders">
              <i class="fas fa-list me-2"></i> View Orders
            </button>
            <button class="btn btn-success btn-lg w-100" id="admin-create-order">
              <i class="fas fa-plus me-2"></i> Create New Order
            </button>
            <button class="btn btn-warning btn-lg w-100" id="admin-closed-orders">
              <i class="fas fa-clock me-2"></i> Closed Orders
            </button>
          </div>
        </div>
      </div>

      <!-- Admin Controls Card -->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
            <h3 class="m-0">Admin Controls</h3>
            <span class="badge bg-dark">Admin Access</span>
          </div>
          <div class="card-body d-grid gap-2">
            <button class="btn btn-warning btn-lg w-100" id="admin-view-revenue">
              <i class="fas fa-chart-line me-2"></i> Revenue Reports
            </button>
            <button class="btn btn-primary btn-lg w-100" id="admin-manage-menu">
              <i class="fas fa-utensils me-2"></i> Manage Menu
            </button>
            <button class="btn btn-info btn-lg w-100" id="admin-manage-users">
              <i class="fas fa-users me-2"></i> Manage Users
            </button>
            <button class="btn btn-secondary btn-lg w-100" id="admin-settings">
              <i class="fas fa-cog me-2"></i> System Settings
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity Section -->
    <div class="card mt-4">
      <div class="card-header bg-info text-white">
        <h3 class="m-0">Recent Activity</h3>
      </div>
      <div class="card-body">
        <div class="activity-feed" id="recent-activity">
          <p class="text-muted text-center">Loading recent activity...</p>
        </div>
      </div>
    </div>`;

  renderToDOM('#admin-dashboard', domString);

  // Add event listeners for admin page
  adminPageEvents(user);
};

export default showAdminDashboard;

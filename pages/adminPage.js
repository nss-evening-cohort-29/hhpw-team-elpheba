import renderToDOM from '../utils/renderToDom';
import { getOrders } from '../api/orders';
import { showOrders } from './ordersPage';
import { formatCurrency, getTodayStats, getUniqueCustomers } from '../utils/helperFunctions';
import createOrderPage from './createOrderPage';
import revenuePage from './revenuePage';

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
    getOrders(user.uid).then((orders) => showOrders(orders, 'all'));
  });

  // Create Order
  addClickHandler('#admin-create-order', () => {
    createOrderPage(user);
  });

  // Closed Orders
  addClickHandler('#admin-closed-orders', () => {
    getOrders(user.uid).then((orders) => showOrders(orders, 'closed'));
  });

  // View Revenue
  addClickHandler('#admin-view-revenue', () => {
    revenuePage();
  });

  // Refresh Stats
  addClickHandler('#refresh-stats', async () => {
    try {
      // Show loading state
      const statsElements = document.querySelectorAll('.stats-value');
      const spinner = '<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>';
      Array.from(statsElements).forEach((statsElement) => {
        const elementCopy = statsElement;
        elementCopy.innerHTML = spinner;
      });

      // Get orders and calculate stats
      const orders = await getOrders(user.uid);
      const { todayOrderCount, openOrderCount, todayRevenue } = await getTodayStats(orders);
      const uniqueCustomers = getUniqueCustomers(orders);

      // Update the display
      const stats = {
        '#today-orders': todayOrderCount,
        '#open-orders': openOrderCount,
        '#today-revenue': formatCurrency(todayRevenue),
        '#total-customers': uniqueCustomers,
        '#orders-count': `${openOrderCount} Active`
      };

      Object.entries(stats).forEach(([selector, value]) => {
        const element = document.querySelector(selector);
        if (element) {
          element.textContent = value;
          // Add fade-in animation
          element.classList.add('fade-in');
          setTimeout(() => element.classList.remove('fade-in'), 500);
        }
      });

      // Show success message
      const activityFeed = document.querySelector('#recent-activity');
      if (activityFeed) {
        activityFeed.innerHTML = `
          <div class="alert alert-success" role="alert">
            <i class="fas fa-check-circle me-2"></i> Stats refreshed successfully
          </div>
          <p class="text-muted">Last updated: ${new Date().toLocaleTimeString()}</p>
        `;
      }
      return true;
    } catch (error) {
      console.error('Error refreshing stats:', error);
      // Show error message
      const activityFeed = document.querySelector('#recent-activity');
      if (activityFeed) {
        activityFeed.innerHTML = `
          <div class="alert alert-danger" role="alert">
            <i class="fas fa-exclamation-circle me-2"></i> Error refreshing stats: ${error.message}
          </div>
        `;
      }
      return false;
    }
  });
};

const showAdminDashboard = async (user) => {
  try {
    const orders = await getOrders(user.uid);
    const { todayOrderCount, openOrderCount, todayRevenue } = await getTodayStats(orders);
    const uniqueCustomers = getUniqueCustomers(orders);

    const domString = `
      <!-- Welcome Section -->
      <div class="admin-header text-center mb-4">
        <h1>Welcome ${user.displayName || 'Admin'}!</h1>
        <p class="lead">Hip Hop Pizza & Wings Management System</p>
        <p class="text-muted">Today: ${new Date().toLocaleDateString()}</p>
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
                <p class="h2 stats-value" id="today-orders">${todayOrderCount}</p>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stats-item">
                <i class="fas fa-clock fa-2x mb-2 text-warning"></i>
                <h4>Open Orders</h4>
                <p class="h2 stats-value" id="open-orders">${openOrderCount}</p>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stats-item">
                <i class="fas fa-dollar-sign fa-2x mb-2 text-success"></i>
                <h4>Today's Revenue</h4>
                <p class="h2 stats-value" id="today-revenue">${formatCurrency(todayRevenue)}</p>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stats-item">
                <i class="fas fa-users fa-2x mb-2 text-info"></i>
                <h4>Total Customers</h4>
                <p class="h2 stats-value" id="total-customers">${uniqueCustomers}</p>
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
              <span class="badge bg-light text-primary" id="orders-count">${openOrderCount} Active</span>
            </div>
            <div class="card-body d-grid gap-2">
              <button class="btn btn-info btn-lg w-100" id="admin-view-orders">
                <i class="fas fa-list me-2"></i> View Orders
              </button>
              <button class="btn btn-primary btn-lg w-100" id="admin-create-order">
                <i class="fas fa-plus me-2"></i> Create New Order
              </button>
              <button class="btn btn-success btn-lg w-100" id="admin-closed-orders">
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

    // Set up auto-refresh every 5 minutes
    const autoRefreshInterval = setInterval(() => {
      const refreshButton = document.querySelector('#refresh-stats');
      if (refreshButton) {
        refreshButton.click();
      }
    }, 300000); // 5 minutes

    // Clean up interval when component unmounts
    return () => clearInterval(autoRefreshInterval);
  } catch (error) {
    console.error('Error loading admin dashboard:', error);
    const errorString = `
      <div class="alert alert-danger" role="alert">
        <h4 class="alert-heading">Error Loading Dashboard</h4>
        <p>${error.message}</p>
        <hr>
        <p class="mb-0">Please try refreshing the page or contact support if the problem persists.</p>
      </div>`;
    renderToDOM('#admin-dashboard', errorString);
    return undefined;
  }
};

export default showAdminDashboard;

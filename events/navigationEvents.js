// navigationEvents.js

import { showOrders } from '../pages/ordersPage';
import { getOrders } from '../api/orders';
import renderToDOM from '../utils/renderToDom';

const navigationEvents = (user) => {
  // HOME
  document.querySelector('#logo-admin-panel').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#admin-dashboard').innerHTML = '';

    const domString = `
      <div class="text-center mb-4">
        <h1>Welcome ${user.displayName}!</h1>
        <p class="lead">Hip Hop Pizza & Wings Management System</p>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-header bg-primary text-white">
              <h3 class="m-0">Order Management</h3>
            </div>
            <div class="card-body d-grid gap-2">
              <button class="btn btn-info btn-lg w-100" id="nav-view-orders">
                <i class="fas fa-list me-2"></i> View Orders
              </button>
              <button class="btn btn-success btn-lg w-100" id="nav-create-order">
                <i class="fas fa-plus me-2"></i> Create New Order
              </button>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-header bg-warning">
              <h3 class="m-0">Admin Controls</h3>
            </div>
            <div class="card-body d-grid gap-2">
              <button class="btn btn-warning btn-lg w-100" id="nav-view-revenue">
                <i class="fas fa-chart-line me-2"></i> Revenue Reports
              </button>
              <button class="btn btn-primary btn-lg w-100" id="nav-manage-menu">
                <i class="fas fa-utensils me-2"></i> Manage Menu
              </button>
              <button class="btn btn-info btn-lg w-100" id="nav-manage-users">
                <i class="fas fa-users me-2"></i> Manage Users
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header bg-success text-white">
          <h3 class="m-0">Quick Stats</h3>
        </div>
        <div class="card-body">
          <div class="row text-center">
            <div class="col-md-4">
              <h4>Today's Orders</h4>
              <p class="h2">0</p>
            </div>
            <div class="col-md-4">
              <h4>Open Orders</h4>
              <p class="h2">0</p>
            </div>
            <div class="col-md-4">
              <h4>Today's Revenue</h4>
              <p class="h2">$0</p>
            </div>
          </div>
        </div>
      </div>`;
    renderToDOM('#admin-dashboard', domString);
  });

  // VIEW ORDERS
  document.querySelector('#view-orders').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#admin-dashboard').innerHTML = '';
    getOrders(user.uid).then(showOrders);
  });

  // CREATE ORDER
  document.querySelector('#create-order').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#admin-dashboard').innerHTML = '';
    const domString = `
      <div class="create-order-container">
        <h1>Create New Order</h1>
        <div id="create-order-form"></div>
      </div>`;
    renderToDOM('#admin-dashboard', domString);
  });

  // VIEW REVENUE
  document.querySelector('#view-revenue').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#admin-dashboard').innerHTML = '';
    const domString = `
      <div class="revenue-container">
        <h1>Revenue Overview</h1>
        <div id="revenue-details"></div>
      </div>`;
    renderToDOM('#admin-dashboard', domString);
  });

  // MANAGE MENU
  document.querySelector('#nav-manage-menu').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#admin-dashboard').innerHTML = '';
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

  // MANAGE USERS
  document.querySelector('#nav-manage-users').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#admin-dashboard').innerHTML = '';
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

  // Add event listeners for all buttons in the view
  document.querySelector('#admin-dashboard').addEventListener('click', (e) => {
    if (e.target.id === 'nav-view-orders') {
      document.querySelector('#view-orders').click();
    }
    if (e.target.id === 'nav-create-order') {
      document.querySelector('#create-order').click();
    }
    if (e.target.id === 'nav-view-revenue') {
      document.querySelector('#view-revenue').click();
    }
    if (e.target.id === 'nav-manage-menu') {
      document.querySelector('#nav-manage-menu').click();
    }
    if (e.target.id === 'nav-manage-users') {
      document.querySelector('#nav-manage-users').click();
    }
  });
};

export default navigationEvents;

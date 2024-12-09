// navigationEvents.js

import { showOrders } from '../pages/ordersPage';
import { getOrders } from '../api/orders';
import showAdminDashboard from '../pages/adminPage';
import renderToDOM from '../utils/renderToDom';

const navigationEvents = (user) => {
  // HOME/ADMIN DASHBOARD
  document.querySelector('#logo-admin-panel').addEventListener('click', () => {
    showAdminDashboard(user);
  });

  // VIEW ORDERS
  document.querySelector('#view-orders').addEventListener('click', () => {
    getOrders(user.uid).then(showOrders);
  });

  // CREATE ORDER
  document.querySelector('#create-order').addEventListener('click', () => {
    const domString = `
      <div class="create-order-container">
        <h1>Create New Order</h1>
        <div id="create-order-form"></div>
      </div>`;
    renderToDOM('#admin-dashboard', domString);
  });

  // VIEW REVENUE
  document.querySelector('#view-revenue').addEventListener('click', () => {
    const domString = `
      <div class="revenue-container">
        <h1>Revenue Overview</h1>
        <div id="revenue-details"></div>
      </div>`;
    renderToDOM('#admin-dashboard', domString);
  });
};

export default navigationEvents;

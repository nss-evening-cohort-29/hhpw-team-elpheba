// navigationEvents.js
import { getOrders } from '../api/orders';
import { showOrders, emptyOrders } from '../pages/ordersPage';
import showAdminDashboard from '../pages/adminPage';
import renderToDOM from '../utils/renderToDom';
import revenuePage from '../pages/revenuePage';

const navigationEvents = (user) => {
  // Clear main container and reset view
  const clearMainContainer = () => {
    document.querySelector('#main-container').innerHTML = `
      <div id="form-container"></div>
      <div id="orders-container"></div>
      <div id="admin-dashboard"></div>
      <div id="view"></div>
      <div id="add-button"></div>
    `;
  };

  // HOME/ADMIN DASHBOARD
  document.querySelector('#logo-admin-panel').addEventListener('click', () => {
    clearMainContainer();
    showAdminDashboard(user);
  });

  // VIEW ORDERS
  document.querySelector('#view-orders').addEventListener('click', () => {
    clearMainContainer();
    getOrders(user.uid).then((orders) => {
      if (orders.length) {
        showOrders(orders);
      } else {
        emptyOrders();
      }
    });
  });

  // CREATE ORDER
  document.querySelector('#create-order').addEventListener('click', () => {
    clearMainContainer();
    const domString = `
      <div class="create-order-container">
        <h1>Create New Order</h1>
        <div id="create-order-form"></div>
      </div>`;
    renderToDOM('#form-container', domString);
  });

  // VIEW REVENUE
  document.querySelector('#view-revenue').addEventListener('click', () => {
    clearMainContainer();
    const domString = `
      <div class="revenue-container">
        <h1>Revenue Overview</h1>
        <div id="revenue-details"></div>
      </div>`;
    renderToDOM('#view', domString);
    revenuePage();
  });
};

export default navigationEvents;

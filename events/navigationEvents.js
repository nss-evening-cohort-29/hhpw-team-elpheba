// navigationEvents.js
import { getOrders } from '../api/orders';
import { showOrders, emptyOrders } from '../pages/ordersPage';
import showAdminDashboard from '../pages/adminPage';
import revenuePage from '../pages/revenuePage';
import createOrderPage from '../pages/createOrderPage';

const navigationEvents = (user) => {
  // Clear main container and reset view
  const clearMainContainer = () => {
    document.querySelector('#main-container').innerHTML = `
      <div id="form-container"></div>
      <div id="orders-container"></div>
      <div id="admin-dashboard"></div>
      <div id="revenue-page"></div>
      <div id="add-button"></div>
    `;
  };

  // HOME/ADMIN DASHBOARD
  document.querySelector('#logo-admin-panel').addEventListener('click', () => {
    clearMainContainer();
    showAdminDashboard(user);
  });

  // HOME/ADMIN DASHBOARD
  document.querySelector('#admin-home').addEventListener('click', () => {
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
    createOrderPage();
  });

  // VIEW REVENUE
  document.querySelector('#view-revenue').addEventListener('click', () => {
    clearMainContainer();
    revenuePage();
  });
};

export default navigationEvents;

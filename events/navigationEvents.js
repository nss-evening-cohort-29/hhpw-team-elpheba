// navigationEvents.js
import { getOrders } from '../api/orders';
import { showOrders, emptyOrders } from '../pages/ordersPage';
import showAdminDashboard from '../pages/adminPage';
import revenuePage from '../pages/revenuePage';
import createOrderPage from '../pages/createOrderPage';

const clearMainContainer = () => {
  document.querySelector('#main-container').innerHTML = `
    <div id="form-container"></div>
    <div id="orders-container"></div>
    <div id="admin-dashboard"></div>
    <div id="revenue-page"></div>
    <div id="add-button"></div>
  `;
};

const addClickHandler = (elementId, handler) => {
  const element = document.querySelector(elementId);
  if (element) {
    element.addEventListener('click', handler);
  }
};

const navigationEvents = (user) => {
  // HOME/ADMIN DASHBOARD
  addClickHandler('#logo-admin-panel', () => {
    clearMainContainer();
    showAdminDashboard(user);
  });

  // HOME/ADMIN DASHBOARD
  addClickHandler('#admin-home', () => {
    clearMainContainer();
    showAdminDashboard(user);
  });

  // VIEW ORDERS
  addClickHandler('#view-orders', () => {
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
  addClickHandler('#create-order', () => {
    clearMainContainer();
    createOrderPage(user);
  });

  // VIEW REVENUE
  addClickHandler('#view-revenue', () => {
    clearMainContainer();
    revenuePage();
  });
};

export default navigationEvents;

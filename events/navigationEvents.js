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

const collapseNavbar = () => {
  const navbarCollapse = document.querySelector('.navbar-collapse');
  if (navbarCollapse && navbarCollapse.classList.contains('show')) {
    navbarCollapse.classList.remove('show');
  }
};

const addClickHandler = (elementId, handler) => {
  const element = document.querySelector(elementId);
  if (element) {
    element.addEventListener('click', (e) => {
      handler(e);
      collapseNavbar(); // Collapse navbar after handling click
    });
  }
};

const navigationEvents = (user) => {
  if (!user) {
    console.error('No user provided to navigationEvents');
    return;
  }

  // Ensure user object is available globally for components that need it
  window.user = user;

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

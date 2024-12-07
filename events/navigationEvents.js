// navigationEvents.js

const navigationEvents = () => {
  // HOME
  document.querySelector('#home').addEventListener('click', (e) => {
    e.preventDefault();
    // TODO: Add home page rendering
  });

  // VIEW ORDERS
  document.querySelector('#view-orders').addEventListener('click', (e) => {
    e.preventDefault();
    // TODO: Add orders view rendering
  });

  // CREATE ORDER
  document.querySelector('#create-order').addEventListener('click', (e) => {
    e.preventDefault();
    // TODO: Add create order form rendering
  });

  // VIEW REVENUE
  document.querySelector('#view-revenue').addEventListener('click', (e) => {
    e.preventDefault();
    // TODO: Add revenue view rendering
  });
};

export default navigationEvents;

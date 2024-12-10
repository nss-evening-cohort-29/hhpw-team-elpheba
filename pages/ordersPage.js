import renderToDOM from '../utils/renderToDom';
import clearDom from '../utils/clearDom';

// call this function to render output if there are no orders to display
const emptyOrders = () => {
  const domString = '<h1>No orders</h1>';
  renderToDOM('#orders-container', domString);
};

// call getOrders then showOrders to render orders to DOM
const showOrders = (array) => {
  clearDom(); // clear the DOM before rendering

  let domString = '';
  array.forEach((item) => {
    domString += `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${item.order_name}</h5>
          <ul class="order-details-list">
            <li class="order-details-item">${item.status}</li>
            <li class="order-details-item">${item.customer_phone}</li>
            <li class="order-details-item">${item.customer_email}</li>
            <li class="order-details-item">${item.order_type}</li>
          </ul>
          <div class="order-card-btns-container">
            <a href="#" class="order-card-details--${item.firebaseKey}">View Details</a>
            <a href="#" class="order-card-delete--${item.firebaseKey}">Delete</a>
          </div>
        </div>
      </div>`;
  });
  renderToDOM('#orders-container', domString);
};

export {
  emptyOrders,
  showOrders
};

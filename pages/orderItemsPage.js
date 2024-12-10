import clearDom from '../utils/clearDom';
import renderToDOM from '../utils/renderToDom';

// later, emptyOrderItems and showOrderItems will get called in domEvents

const emptyOrderItems = () => {
  const domString = '<h1>No Order Items</h1>';
  renderToDOM('#view', domString);
};

const showOrderItems = (array) => {
  clearDom();

  const total = '<h1>TOTAL: *PLACEHOLDER*</h1>'; // TODO: insert logic for calculating the total

  renderToDOM('#orders-container', total);

  let domString = '';
  array.forEach((item) => {
    domString += `
    <div class="card" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">${item.item_name}</h5>
        <h6 class="card-subtitle mb-2 text-muted">PRICE: ${item.item_price}</h6>
        <i class="fas fa-edit btn btn-info" id="update-orderItem-btn--${item.firebaseKey}"></i>
        <i class="btn btn-danger fas fa-trash-alt" id="delete-orderItem-btn--${item.firebaseKey}"></i>
      </div>
    </div>
    `;
  });
  renderToDOM('#view', domString);
};

const btnString = `
<button class="btn btn-success btn-lg mb-4" id="add-item-btn">Add Item</button>
<button class="btn btn-primary btn-lg mb-4" id="go-to-payment-btn">Go To Payment</button>`;
renderToDOM('#add-button', btnString);

export {
  emptyOrderItems,
  showOrderItems
};

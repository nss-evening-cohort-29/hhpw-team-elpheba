import renderToDOM from '../utils/renderToDom';
import clearDOM from '../utils/clearDom';
import { getValues } from '../utils/helperFunctions';

const formatPrice = (price) => {
  const numPrice = parseFloat(price);
  return `$${numPrice.toFixed(2)}`;
};

const emptyOrderItems = (firebaseKey) => {
  clearDOM();
  const domString = `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12 text-center">
          <h1 class="mb-4">No Order Items</h1>
          <div class="d-flex justify-content-center gap-2">
            <button class="btn btn-success btn-lg" id="add-item-btn--${firebaseKey}">Add Item</button>
            <button class="btn btn-primary btn-lg" id="go-to-payment-btn--${firebaseKey}">Go To Payment</button>
            <button class="btn btn-secondary btn-lg" id="back-to-orders-btn">Go Back to Orders</button>
          </div>
        </div>
      </div>
    </div>`;
  renderToDOM('#orders-container', domString);
};

const renderOrderButtons = (firebaseKey, orderStatus = 'open') => {
  const buttonString = orderStatus === 'closed'
    ? `<div class="container">
         <div class="row">
           <div class="col-12 text-center">
             <button class="btn btn-secondary btn-lg" id="back-to-orders-btn">Go Back to Orders</button>
           </div>
         </div>
       </div>`
    : `<div class="container">
         <div class="row">
           <div class="col-12 text-center">
             <div class="d-flex justify-content-center gap-2">
               <button class="btn btn-success btn-lg" id="add-item-btn--${firebaseKey}">Add Item</button>
               <button class="btn btn-primary btn-lg" id="go-to-payment-btn--${firebaseKey}">Go To Payment</button>
               <button class="btn btn-secondary btn-lg" id="back-to-orders-btn">Go Back to Orders</button>
             </div>
           </div>
         </div>
       </div>`;

  renderToDOM('#add-button', buttonString);
};

const showOrderItems = (array, firebaseKey, orderStatus = 'open') => {
  clearDOM();

  // Calculate and format total
  const totalValue = getValues(array);
  const formattedTotal = formatPrice(totalValue);

  // Render total amount
  const total = `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <h1 class="text-center mb-4">TOTAL: ${formattedTotal}</h1>
          ${orderStatus === 'closed'
    ? '<div class="alert alert-info text-center mb-4">This order is closed.</div>'
    : ''}
        </div>
      </div>
    </div>`;

  renderToDOM('#form-container', total);

  // Render order items
  let domString = '<div class="container"><div class="row">';
  array.forEach((item) => {
    const formattedPrice = formatPrice(item.item_price);
    domString += `
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${item.item_name}</h5>
            <h6 class="card-subtitle mb-2 text-muted">PRICE: ${formattedPrice}</h6>
            ${orderStatus === 'open' ? `
              <div class="d-flex justify-content-end gap-2 mt-3">
                <button class="btn btn-lg btn-outline-primary" id="edit-orderItem-btn--${item.firebaseKey}--${firebaseKey}">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-lg btn-outline-danger" id="delete-orderItem-btn--${item.firebaseKey}">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>`;
  });
  domString += '</div></div>';

  renderToDOM('#orders-container', domString);

  // Render action buttons (only once)
  renderOrderButtons(firebaseKey, orderStatus);
};

export { emptyOrderItems, showOrderItems };

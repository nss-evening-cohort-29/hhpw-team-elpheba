import renderToDOM from '../utils/renderToDom';
import clearDOM from '../utils/clearDom';

const formatPrice = (price) => {
  const numPrice = parseFloat(price);
  return `$${numPrice.toFixed(2)}`;
};

const emptyMenuItems = () => {
  clearDOM();
  const domString = `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12 text-center">
          <h1 class="mb-4">No Menu Items</h1>
          <div class="d-flex justify-content-center gap-2">
            <button class="btn btn-success btn-lg" id="add-menuItem-btn">Add Menu Item</button>
          </div>
        </div>
      </div>
    </div>`;
  renderToDOM('#orders-container', domString);
};

const showMenuItems = (array) => {
  clearDOM();

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
                <button class="btn btn-lg btn-outline-danger" id="delete-orderItem-btn--${item.firebaseKey}--${firebaseKey}">
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

export { emptyMenuItems, showMenuItems };

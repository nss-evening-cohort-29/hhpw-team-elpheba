import clearDOM from '../utils/clearDom';
import renderToDOM from '../utils/renderToDom';

const addOrderItemForm = (orderFirebaseKey, obj = {}) => {
  clearDOM();

  const displayPrice = obj && obj.item_price ? parseFloat(obj.item_price).toFixed(2) : '';

  // Ensure proper ID formatting for the form
  const formId = obj && obj.firebaseKey
    ? `update-orderItem--${obj.firebaseKey}--${orderFirebaseKey}`
    : `submit-the-orderItem--${orderFirebaseKey}`;

  const domString = `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title text-center mb-4">${obj && obj.firebaseKey ? 'Edit Order Item' : 'Add New Order Item'}</h2>
              <form id="${formId}" class="order-form">
                <div class="form-group mb-3">
                  <label for="item_name" class="form-label">Item Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="item_name"
                    placeholder="Enter item name"
                    value="${(obj && obj.item_name) || ''}"
                    required
                  >
                </div>
                <div class="form-group mb-3">
                  <label for="item_price" class="form-label">Item Price</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      class="form-control"
                      id="item_price"
                      placeholder="0.00"
                      value="${displayPrice}"
                      required
                      onchange="if (this.value) { this.value = parseFloat(this.value).toFixed(2) }"
                    >
                  </div>
                </div>
                <div class="d-grid gap-2 mt-4">
                  <button type="submit" class="btn btn-primary btn-lg">
                    ${obj && obj.firebaseKey ? 'Update' : 'Add'} Item
                  </button>
                  <button type="button" class="btn btn-secondary btn-lg" id="back-to-orders-btn">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  renderToDOM('#form-container', domString);
};

export default addOrderItemForm;

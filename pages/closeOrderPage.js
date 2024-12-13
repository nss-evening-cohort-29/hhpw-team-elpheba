import clearDOM from '../utils/clearDom';
import renderToDOM from '../utils/renderToDom';

const closeOrderPage = (orderObj = {}) => {
  clearDOM();

  // Check if orderObj exists and has firebaseKey
  if (!orderObj || !orderObj.firebaseKey) {
    const errorString = '<h1>Error: Order not found</h1>';
    renderToDOM('#form-container', errorString);
    return;
  }

  const domString = `
    <form id="close-order--${orderObj.firebaseKey}" class="close-order-form">
      <div class="form-group">
        <label for="payment-type">Payment Type</label>
        <select class="form-control" id="payment-type" required>
          <option value="">Select a Payment Type</option>
          <option value="cash">Cash</option>
          <option value="credit">Credit Card</option>
        </select>
      </div>

      <div class="form-group">
        <label>Tip Amount</label>
        <div class="tip-options">
          <button type="button" class="btn btn-secondary tip-btn" data-tip="10">10%</button>
          <button type="button" class="btn btn-secondary tip-btn" data-tip="15">15%</button>
          <button type="button" class="btn btn-secondary tip-btn" data-tip="20">20%</button>
          <div class="custom-tip">
            <input type="number" class="form-control" id="custom-tip" placeholder="Custom Tip %">
          </div>
        </div>
      </div>

      <div class="button-group mt-4">
        <button type="submit" class="btn btn-success" id="submit-close-order">Close Order</button>
        <button type="button" class="btn btn-danger" id="cancel-payment--${orderObj.firebaseKey}">Cancel</button>
      </div>
    </form>`;

  renderToDOM('#form-container', domString);
};

export default closeOrderPage;

import clearDOM from '../utils/clearDom';
import renderToDOM from '../utils/renderToDom';
import { getOrderItems } from '../api/orderItems';
import { getValues } from '../utils/helperFunctions';

const formatPrice = (price) => {
  const numPrice = parseFloat(price) || 0;
  return `$${numPrice.toFixed(2)}`;
};

const calculateTip = (subtotal, tipPercentage) => {
  const tip = (subtotal * (parseFloat(tipPercentage) || 0)) / 100;
  return Math.max(0, tip); // Ensure tip is not negative
};

const closeOrderPage = (orderObj = {}) => {
  clearDOM();

  // Check if orderObj exists and has firebaseKey
  if (!orderObj || !orderObj.firebaseKey) {
    const errorString = '<h1>Error: Order not found</h1>';
    renderToDOM('#form-container', errorString);
    return;
  }

  // Check if order belongs to current user
  if (!orderObj.user_id) {
    const errorString = '<h1>Error: Unauthorized access</h1>';
    renderToDOM('#form-container', errorString);
    return;
  }

  // Get order items to calculate total
  getOrderItems(orderObj.firebaseKey).then((items) => {
    const subtotal = parseFloat(getValues(items)) || 0;

    const updateTotalDisplay = () => {
      const customTipInput = document.querySelector('#custom-tip');
      const totalDisplay = document.querySelector('#total-amount');
      const tipDisplay = document.querySelector('#tip-amount');
      const subtotalDisplay = document.querySelector('#subtotal-amount');
      const tipPercentageDisplay = document.querySelector('#selected-tip-percentage');
      const closeOrderButton = document.querySelector('#close-order-button');

      let tipPercentage = 0;

      // Check if any tip button is active
      const activeBtn = document.querySelector('.tip-btn.active');
      if (activeBtn) {
        tipPercentage = parseFloat(activeBtn.dataset.tip);
      } else if (customTipInput && customTipInput.value) {
        tipPercentage = Math.min(100, Math.max(0, parseFloat(customTipInput.value) || 0));
        customTipInput.value = tipPercentage; // Update input with validated value
      }

      const tipAmount = calculateTip(subtotal, tipPercentage);
      const total = subtotal + tipAmount;

      // Update the displays
      subtotalDisplay.textContent = formatPrice(subtotal);
      tipDisplay.textContent = formatPrice(tipAmount);
      totalDisplay.textContent = formatPrice(total);
      tipPercentageDisplay.textContent = tipPercentage > 0 ? `(${tipPercentage}%)` : '';

      // Update the Close Order button text with the total including tip
      if (closeOrderButton) {
        closeOrderButton.textContent = `Close Order (${formatPrice(total)})`;
      }
    };

    const domString = `
      <div class="container mt-4">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6">
            <div class="card">
              <div class="card-body">
                <h2 class="card-title text-center mb-4">Close Order</h2>
                <form id="close-order--${orderObj.firebaseKey}" class="close-order-form">
                  <!-- Order Summary -->
                  <div class="order-summary mb-4">
                    <h3 class="text-center mb-3">Order Summary</h3>
                    <div class="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span id="subtotal-amount">${formatPrice(subtotal)}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                      <span>Tip Amount <span id="selected-tip-percentage" class="text-muted"></span>:</span>
                      <span id="tip-amount">$0.00</span>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between mb-2 fw-bold">
                      <span>Total:</span>
                      <span id="total-amount">${formatPrice(subtotal)}</span>
                    </div>
                  </div>

                  <!-- Payment Type -->
                  <div class="form-group mb-4">
                    <label for="payment-type" class="form-label">Payment Type</label>
                    <select class="form-control form-select" id="payment-type" required>
                      <option value="">Select a Payment Type</option>
                      <option value="cash">Cash</option>
                      <option value="credit">Credit Card</option>
                      <option value="debit">Debit Card</option>
                      <option value="mobile">Mobile Payment</option>
                    </select>
                  </div>

                  <!-- Tip Selection -->
                  <div class="form-group mb-4">
                    <label class="form-label">Tip Amount</label>
                    <div class="tip-options d-flex flex-wrap gap-2 mb-3">
                      <button type="button" class="btn btn-outline-primary tip-btn" data-tip="10">10%</button>
                      <button type="button" class="btn btn-outline-primary tip-btn" data-tip="15">15%</button>
                      <button type="button" class="btn btn-outline-primary tip-btn" data-tip="20">20%</button>
                      <button type="button" class="btn btn-outline-primary tip-btn" data-tip="25">25%</button>
                      <div class="input-group custom-tip-input flex-grow-1">
                        <input
                          type="number"
                          class="form-control"
                          id="custom-tip"
                          placeholder="Custom %"
                          min="0"
                          max="100"
                          step="1"
                          aria-label="Custom tip percentage"
                        >
                        <span class="input-group-text">%</span>
                      </div>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-success btn-lg" id="close-order-button">
                      Close Order (${formatPrice(subtotal)})
                    </button>
                    <button type="button" class="btn btn-secondary btn-lg" id="cancel-payment--${orderObj.firebaseKey}">
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

    // Add event listeners for tip calculations
    const tipBtns = document.querySelectorAll('.tip-btn');
    const customTipInput = document.querySelector('#custom-tip');

    // Tip button click handler
    tipBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        tipBtns.forEach((b) => b.classList.remove('active'));
        e.target.classList.add('active');
        if (customTipInput) customTipInput.value = '';
        updateTotalDisplay();
      });
    });

    // Custom tip input handler
    if (customTipInput) {
      customTipInput.addEventListener('input', (e) => {
        tipBtns.forEach((btn) => btn.classList.remove('active'));
        // Ensure the input is a valid number between 0 and 100
        let value = parseFloat(e.target.value) || 0;
        value = Math.min(100, Math.max(0, value));
        if (value !== parseFloat(e.target.value)) {
          e.target.value = value || '';
        }
        updateTotalDisplay();
      });

      // Add blur event to format the input when user leaves the field
      customTipInput.addEventListener('blur', (e) => {
        const value = parseFloat(e.target.value) || 0;
        if (value > 0) {
          e.target.value = value.toFixed(0);
        } else {
          e.target.value = '';
        }
        updateTotalDisplay();
      });
    }

    // Initial display update
    updateTotalDisplay();
  });
};

export default closeOrderPage;

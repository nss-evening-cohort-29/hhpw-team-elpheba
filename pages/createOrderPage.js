import clearDOM from '../utils/clearDom';
import renderToDOM from '../utils/renderToDom';
import { showOrders } from './ordersPage';
import { getOrders, updateOrder, createOrder } from '../api/orders';

const createOrderPage = (user, obj = {}) => {
  // Validate user object
  if (!user || !user.uid) {
    const errorMessage = `
      <div class="container mt-4">
        <div class="alert alert-danger" role="alert">
          <h4 class="alert-heading">Authentication Error</h4>
          <p>Unable to create order. Please ensure you are properly logged in.</p>
        </div>
      </div>`;
    renderToDOM('#form-container', errorMessage);
    return;
  }

  clearDOM();

  const domString = `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title text-center mb-4">${obj.firebaseKey ? 'Edit Order' : 'Create New Order'}</h2>
              <form id="${obj.firebaseKey ? `update-order--${obj.firebaseKey}` : 'submit-order'}" class="order-form">
                <!-- Customer Name -->
                <div class="form-group mb-3">
                  <label for="order-name" class="form-label">Customer Name</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-user"></i>
                    </span>
                    <input
                      type="text"
                      class="form-control"
                      id="order-name"
                      placeholder="Enter customer name"
                      value="${obj.order_name || ''}"
                      required
                    >
                  </div>
                  <div class="invalid-feedback">
                    Please provide a customer name.
                  </div>
                </div>

                <!-- Phone Number -->
                <div class="form-group mb-3">
                  <label for="customer-phone" class="form-label">Phone Number</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-phone"></i>
                    </span>
                    <input
                      type="tel"
                      class="form-control"
                      id="customer-phone"
                      placeholder="555-555-5555"
                      pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                      value="${obj.customer_phone || ''}"
                      required
                    >
                  </div>
                  <div class="invalid-feedback">
                    Please provide a valid phone number (format: 555-555-5555).
                  </div>
                </div>

                <!-- Email -->
                <div class="form-group mb-3">
                  <label for="customer-email" class="form-label">Email Address</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      class="form-control"
                      id="customer-email"
                      placeholder="customer@example.com"
                      value="${obj.customer_email || ''}"
                      required
                    >
                  </div>
                  <div class="invalid-feedback">
                    Please provide a valid email address.
                  </div>
                </div>

                <!-- Order Type -->
                <div class="form-group mb-4">
                  <label for="order-type" class="form-label">Order Type</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-shopping-bag"></i>
                    </span>
                    <select class="form-control form-select" id="order-type" required>
                      <option value="">Select Order Type</option>
                      <option value="dine_in" ${obj.order_type === 'dine_in' ? 'selected' : ''}>Dine In</option>
                      <option value="carryout" ${obj.order_type === 'carryout' ? 'selected' : ''}>Carryout</option>
                    </select>
                  </div>
                  <div class="invalid-feedback">
                    Please select an order type.
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary btn-lg">
                    ${obj.firebaseKey ? 'Update Order' : 'Create Order'}
                  </button>
                  <button type="button" class="btn btn-secondary btn-lg" id="cancel-order">
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

  // Add phone number formatting
  const phoneInput = document.querySelector('#customer-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 10) {
        value = value.slice(0, 10);
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      }
      e.target.value = value;
    });
  }

  // Form validation and submission
  const form = document.querySelector('.order-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Double check user validation before submission
      if (!user || !user.uid) {
        const errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger mt-3';
        errorAlert.textContent = 'Authentication error. Please log in again.';
        form.insertAdjacentElement('beforebegin', errorAlert);
        return;
      }

      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
      }

      try {
        // Get form values
        const payload = {
          customer_email: document.querySelector('#customer-email').value,
          customer_phone: document.querySelector('#customer-phone').value,
          order_name: document.querySelector('#order-name').value,
          order_type: document.querySelector('#order-type').value,
        };

        if (obj.firebaseKey) {
          // Update existing order
          payload.firebaseKey = obj.firebaseKey;
          payload.status = obj.status || 'open';
          payload.user_id = obj.user_id || user.uid;
          payload.created_date = obj.created_date;
          payload.total_amount = obj.total_amount || '0.00';

          updateOrder(payload).then(() => {
            getOrders(user.uid).then((orders) => {
              showOrders(orders);
            });
          }).catch((error) => {
            console.error('Error updating order:', error);
            const errorAlert = document.createElement('div');
            errorAlert.className = 'alert alert-danger mt-3';
            errorAlert.textContent = 'Error updating order. Please try again.';
            form.insertAdjacentElement('beforebegin', errorAlert);
          });
        } else {
          // Create new order
          payload.created_date = Date.now();
          payload.status = 'open';
          payload.total_amount = '0.00';
          payload.user_id = user.uid;

          createOrder(payload).then(() => {
            // Navigate to View Orders by triggering the button click
            const viewOrdersBtn = document.querySelector('#view-orders');
            if (viewOrdersBtn) {
              viewOrdersBtn.click();
            } else {
              getOrders(user.uid).then(showOrders);
            }
          }).catch((error) => {
            console.error('Error creating order:', error);
            const errorAlert = document.createElement('div');
            errorAlert.className = 'alert alert-danger mt-3';
            errorAlert.textContent = 'Error creating order. Please try again.';
            form.insertAdjacentElement('beforebegin', errorAlert);
          });
        }
      } catch (error) {
        console.error('Form submission error:', error);
        const errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger mt-3';
        errorAlert.textContent = 'An unexpected error occurred. Please try again.';
        form.insertAdjacentElement('beforebegin', errorAlert);
      }
    });
  }

  // Cancel button handler
  const cancelBtn = document.querySelector('#cancel-order');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      // Trigger the View Orders navigation
      document.querySelector('#view-orders').click();
    });
  }
};

export default createOrderPage;

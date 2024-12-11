import clearDOM from '../utils/clearDom';
import renderToDOM from '../utils/renderToDom';

// Form for creating and editing an order
const createOrderPage = (obj = {}) => {
  clearDOM();
  const domString = `
    <form id="${obj.firebaseKey ? `update-order--${obj.firebaseKey}` : 'submit-order'}" class="mb-4">
      <div class="form-group">
        <label for="order-name">Name:</label>
        <input type="text" class="form-control" id="order-name" aria-describedby="order_name" placeholder="Name..." value="${obj.order_name || ''}" required>
      </div>
      <div class="form-group">
        <label for="customer-phone">Phone number:</label>
        <input type="tel" class="form-control" id="customer-phone" aria-describedby="customer-phone" placeholder="555-555-5555" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" value="${obj.customer_phone || ''}" required>
      </div>
      <div class="form-group">
        <label for="customer-email"></label>
        <input type="email" class="form-control" id="customer-email" placeholder="example@email.com" value="${obj.customer_email || ''}" required>
      </div>
      <div class="form-group" id="order-type-select">
        <select class="form-control" id="order-type" required>
          <option value="">Order type</option>
          <option value="dine_in" ${obj.order_type === 'dine_in' ? 'selected' : ''}>Dine in</option>
          <option value="carryout" ${obj.order_type === 'carryout' ? 'selected' : ''}>Carryout</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Submit Order</button>
    </form>`;

  renderToDOM('#form-container', domString);
};

export default createOrderPage;

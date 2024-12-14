import clearDOM from '../utils/clearDom';
import renderToDOM from '../utils/renderToDom';

// USING THIS FORM FOR BOTH CREATE AND UPDATE ORDER ITEMS
const addOrderItemForm = (firebaseKey, obj = {}) => {
  console.warn('Firebase Key:', firebaseKey);
  console.warn('Order Item Object:', obj);
  clearDOM();
  // id of the form ternary: The first condition, if the order item already has a firebase key (if it already exists), is for updating. The second condition, if not obj does not yet have a firebase key, is for creating, and it inserts the associated order's firebasekey in the id for use in addOrderItemForm
  // "submit-the-orderItem" may seem like a weird name. but having it as "submit-orderItem" conflicted with other functions in formEvents that targeted id's also containing "submit-order," so please leave as is!
  // type="number" step="0.01" of the price input: type restricts the input to numerical values, and step allows decimal values with up to two decimal places
  const domString = `
    <form id="${obj.firebaseKey ? `update-the-orderItem--${obj.firebaseKey}` : `submit-the-orderItem--${firebaseKey}`}" class="mb-4">
      <div class="form-group">
        <label for="image"Item Name</label>
        <input type="text" class="form-control" id="item_name" placeholder="Item Name" value="${obj.item_name || ''}" required>
      </div>
      <div class="form-group">
        <label for="image">Item Price</label>
        <input type="number" step="0.01" class="form-control" id="item_price" placeholder="Item Price" value="${obj.item_price || ''}" required>
      </div>
      <button type="submit" class="btn btn-primary mt-3" id="submit-item-form-btn">Add/Edit Item</button>
    </form>`;

  renderToDOM('#form-container', domString);
};

export default addOrderItemForm;

import { updateOrder } from '../api/orders';
import {
  createOrderItem as createItem,
  getOrderItems,
  updateOrderItem
} from '../api/orderItems';
import { showOrderItems } from '../pages/orderItemsPage';

const formatPrice = (price) => {
  const numPrice = parseFloat(price) || 0;
  return numPrice.toFixed(2);
};

const formEvents = () => {
  document.querySelector('#main-container').addEventListener('submit', (e) => {
    e.preventDefault();

    // CLICK EVENT FOR SUBMITTING A NEW ORDER ITEM
    if (e.target.id.includes('submit-the-orderItem')) {
      const [, orderFirebaseKey] = e.target.id.split('--');
      const itemNameInput = document.querySelector('#item_name');
      const itemPriceInput = document.querySelector('#item_price');

      if (!itemNameInput || !itemPriceInput) {
        console.error('Item name or price input not found when submitting a new item.');
        return;
      }

      const itemPrice = parseFloat(itemPriceInput.value || 0);

      const payload = {
        created_at: Date.now(),
        item_name: itemNameInput.value.trim(),
        item_price: formatPrice(itemPrice),
        menu_item_id: 'placeholder',
        order_id: orderFirebaseKey,
        quantity: 1
      };

      createItem(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateOrderItem(patchPayload).then(() => {
          getOrderItems(orderFirebaseKey).then((items) => showOrderItems(items, orderFirebaseKey));
        });
      });
    }

    // CLICK EVENT FOR UPDATING AN EXISTING ORDER ITEM
    if (e.target.id.includes('update-orderItem')) {
      const [, itemFirebaseKey, orderFirebaseKey] = e.target.id.split('--');

      // Validate that we have both required keys
      if (!itemFirebaseKey || !orderFirebaseKey) {
        console.error('Missing required IDs for order item update');
        return;
      }

      const itemNameInput = document.querySelector('#item_name');
      const itemPriceInput = document.querySelector('#item_price');

      if (!itemNameInput || !itemPriceInput) {
        console.error('Item name or price input not found when updating the item.');
        return;
      }

      const itemPrice = parseFloat(itemPriceInput.value || 0);

      const payload = {
        item_name: itemNameInput.value.trim(),
        item_price: formatPrice(itemPrice),
        firebaseKey: itemFirebaseKey,
        order_id: orderFirebaseKey
      };

      updateOrderItem(payload).then(() => {
        getOrderItems(orderFirebaseKey).then((items) => {
          showOrderItems(items, orderFirebaseKey);
        });
      });
    }

    // CLICK EVENT FOR CLOSING AN ORDER
    if (e.target.id.includes('close-order')) {
      const [, firebaseKey] = e.target.id.split('--');

      const paymentTypeInput = document.querySelector('#payment-type');
      if (!paymentTypeInput) {
        console.error('Payment type input not found when closing the order.');
        return;
      }

      const selectedTipBtn = document.querySelector('.tip-btn.active');
      const customTipInput = document.querySelector('#custom-tip');
      let tipPercentage = 0;

      if (selectedTipBtn) {
        tipPercentage = selectedTipBtn.dataset.tip;
      } else if (customTipInput && customTipInput.value) {
        tipPercentage = customTipInput.value;
      }

      const payload = {
        firebaseKey,
        payment_type: paymentTypeInput.value,
        tip_percentage: parseFloat(tipPercentage || 0).toFixed(2),
        status: 'closed',
        closed_date: Date.now()
      };

      updateOrder(payload).then(() => {
        // Navigate to View Orders by triggering the button click
        const viewOrdersBtn = document.querySelector('#view-orders');
        if (viewOrdersBtn) {
          viewOrdersBtn.click();
        }
      });
    }
  });
};

export default formEvents;

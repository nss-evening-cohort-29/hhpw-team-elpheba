import { getOrders, updateOrder, createOrder } from '../api/orders';
import { showOrders } from '../pages/ordersPage';
import {
  createOrderItem as createItem,
  getOrderItems,
  updateOrderItem
} from '../api/orderItems';
import { showOrderItems } from '../pages/orderItemsPage';

const formatPrice = (price) => {
  const numPrice = parseFloat(price);
  return numPrice.toFixed(2); // Don't include $ here as it's stored in database without currency symbol
};

const formEvents = (user) => {
  document.querySelector('#main-container').addEventListener('submit', (e) => {
    e.preventDefault();

    // CLICK EVENT FOR SUBMITTING AN ORDER
    if (e.target.id.includes('submit-order')) {
      const payload = {
        created_date: Date.now(),
        customer_email: document.querySelector('#customer-email').value,
        customer_phone: document.querySelector('#customer-phone').value,
        order_name: document.querySelector('#order-name').value,
        order_type: document.querySelector('#order-type').value,
        status: 'open',
        total_amount: '0.00',
        user_id: user.uid
      };

      createOrder(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateOrder(patchPayload).then(() => {
          getOrders(user.uid).then(showOrders);
        });
      });
    }

    // CLICK EVENT FOR EDITING AN ORDER
    if (e.target.id.includes('update-order')) {
      const [, firebaseKey] = e.target.id.split('--');
      const payload = {
        // left out date, status, total amount, and uid as this function is only for editing text on the card by the user
        customer_email: document.querySelector('#customer-email').value,
        customer_phone: document.querySelector('#customer-phone').value,
        order_name: document.querySelector('#order-name').value,
        order_type: document.querySelector('#order-type').value,
        firebaseKey
      };

      updateOrder(payload).then(() => {
        getOrders(user.uid).then(showOrders);
      });
    }

    // CLICK EVENT FOR SUBMITTING AN ORDER ITEM
    if (e.target.id.includes('submit-the-orderItem')) {
      const [, orderFirebaseKey] = e.target.id.split('--');
      const itemPrice = parseFloat(document.querySelector('#item_price').value || 0);

      const payload = {
        created_at: Date.now(),
        item_name: document.querySelector('#item_name').value,
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

    // CLICK EVENT FOR UPDATING AN ORDER ITEM
    if (e.target.id.includes('update-orderItem')) {
      const [, firebaseKey, orderId] = e.target.id.split('--');
      const itemPrice = parseFloat(document.querySelector('#item_price').value || 0);

      const payload = {
        item_name: document.querySelector('#item_name').value,
        item_price: formatPrice(itemPrice),
        firebaseKey,
        order_id: orderId
      };

      updateOrderItem(payload).then(() => {
        getOrderItems(payload.order_id).then((items) => {
          showOrderItems(items, payload.order_id);
        });
      });
    }

    // CLICK EVENT FOR CLOSING AN ORDER
    if (e.target.id.includes('close-order')) {
      const [, firebaseKey] = e.target.id.split('--');

      // Get tip amount
      const selectedTipBtn = document.querySelector('.tip-btn.active');
      const customTipInput = document.querySelector('#custom-tip');
      const tipPercentage = selectedTipBtn ? selectedTipBtn.dataset.tip : (customTipInput.value || 0);

      const payload = {
        firebaseKey,
        payment_type: document.querySelector('#payment-type').value,
        tip_percentage: parseFloat(tipPercentage).toFixed(2),
        status: 'closed',
        closed_date: Date.now()
      };

      updateOrder(payload).then(() => {
        getOrders(user.uid).then(showOrders);
      });
    }
  });
};

export default formEvents;

import { getOrders, updateOrder, createOrder } from '../api/orders';
import { showOrders } from '../pages/ordersPage';
import { createOrderItem, getOrderItems } from '../api/orderItems';
import { showOrderItems } from '../pages/orderItemsPage';

const formEvents = (user) => {
  document.querySelector('#main-container').addEventListener('submit', (e) => {
    e.preventDefault();
    // Click event for submitting an order
    if (e.target.id.includes('submit-order')) {
      const payload = {
        created_date: Date.now(),
        customer_email: document.querySelector('#customer-email').value,
        customer_phone: document.querySelector('#customer-phone').value,
        order_name: document.querySelector('#order-name').value,
        order_type: document.querySelector('#order-type').value,
        status: 'open',
        total_amount: 0,
        user_id: user.uid
      };

      createOrder(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };

        updateOrder(patchPayload).then(() => {
          getOrders(user.uid).then(showOrders);
        });
      });
    }

    // Click event for editing an order (if we decide to add this functionality)
    if (e.target.id.includes('update-order')) {
      const [, firebaseKey] = e.target.id.split('--');
      const payload = {
        created_date: Date.now(),
        customer_email: document.querySelector('#customer-email').value,
        customer_phone: document.querySelector('#customer-phone').value,
        order_name: document.querySelector('#order-name').value,
        order_type: document.querySelector('#order-type').value,
        status: 'open',
        total_amount: 0,
        user_id: user.uid,
        firebaseKey
      };

      updateOrder(payload).then(() => {
        getOrders(user.uid).then(showOrders);
      });
    }
    // Click event for submit an order item
    if (e.target.id.includes('submit-the-orderItem')) {
      console.warn('clicked add/edit item');
      const [, orderFirebaseKey] = e.target.id.split('--'); // this will be the firebaseKey of order via the latter condition of the ternary for the id in the form to create an order
      // we need this to add the order firebaseKey to order_id in payload below so that the order item is associated with its' order
      console.warn(orderFirebaseKey);
      const payload = {
        created_at: Date.now(),
        item_name: document.querySelector('#item_name').value,
        item_price: document.querySelector('#item_price').value,
        menu_item_id: 'placeholder',
        order_id: orderFirebaseKey,
        quantity: 1
      };

      createOrderItem(payload);
      getOrderItems(orderFirebaseKey).then((items) => showOrderItems(items, orderFirebaseKey));
    }
    // below closes the higher order functions
  });
};

export default formEvents;

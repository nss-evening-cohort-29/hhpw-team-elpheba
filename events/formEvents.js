import { getOrders, updateOrder, createOrder } from '../api/orders';
import { showOrders } from '../pages/ordersPage';

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
  });
};

export default formEvents;

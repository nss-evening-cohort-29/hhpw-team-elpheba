import { getOrderItems } from '../api/orderItems';
// eslint-disable-next-line import/extensions
import { emptyOrderItems, showOrderItems } from '../pages/orderItemsPage';
import clearDOM from '../utils/clearDom';

const domEvents = () => {
  document.querySelector('#main-container').addEventListener('click', (e) => {
    // CLICK EVENT ON DETAILS BUTTON OF AN ORDER
    if (e.target.id.includes('order-card-details')) {
      console.warn('clicked details button');
      console.warn(e.target); // Check the element being clicked
      clearDOM();
      const [, firebaseKey] = e.target.id.split('--');
      getOrderItems(firebaseKey).then((orders) => {
        if (orders.length === 0) {
          emptyOrderItems();
        } else {
          showOrderItems(orders);
        }
      });
    }
    // Below closes out the higher-order addEventListener and domEvents
  });
};

export default domEvents;

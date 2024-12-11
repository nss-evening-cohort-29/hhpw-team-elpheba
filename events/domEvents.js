import { getOrderItems } from '../api/orderItems';
// eslint-disable-next-line import/extensions
import { emptyOrderItems, showOrderItems } from '../pages/orderItemsPage';
import clearDOM from '../utils/clearDom';
import addOrderItemForm from '../pages/createOrderItemPage';

const domEvents = () => {
  document.querySelector('#main-container').addEventListener('click', (e) => {
    // CLICK EVENT ON DETAILS BUTTON OF AN ORDER
    if (e.target.id.includes('order-card-details')) {
      clearDOM();
      const [, firebaseKey] = e.target.id.split('--');
      getOrderItems(firebaseKey).then((items) => {
        if (items.length === 0) {
          emptyOrderItems(firebaseKey);
        } else {
          showOrderItems(items, firebaseKey);
        }
      });
    }
    // CLICK EVENT ON "ADD ITEM" BUTTON ON AN ORDER'S ORDER ITEMS PAGE
    if (e.target.id.includes('add-item-btn')) {
      const [, firebaseKey] = e.target.id.split('--'); // destructuring to assign firebasekey of the order, which was passed into showOrderItems to store in the add item button
      addOrderItemForm(firebaseKey);
    }

    // Below closes out the higher-order addEventListener and domEvents
  });
};

export default domEvents;

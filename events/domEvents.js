import { getOrderItems } from '../api/orderItems';
import { getOrders, deleteSingleOrder } from '../api/orders';
// eslint-disable-next-line import/extensions
import { emptyOrderItems, showOrderItems } from '../pages/orderItemsPage';
import { showOrders } from '../pages/ordersPage';
import clearDOM from '../utils/clearDom';
import addOrderItemForm from '../pages/createOrderItemPage';
// import clearDom2 from '../utils/clearDom2';

const domEvents = (user) => {
  document.addEventListener('click', (e) => {
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
      // clearDom2();
      clearDOM();
      const [, firebaseKey] = e.target.id.split('--'); // destructuring to assign firebasekey of the order, which was passed into showOrderItems to store in the add item button
      addOrderItemForm(firebaseKey);
    }

    // CLICK EVENT ON DELETE BUTTON OF AN ORDER
    if (e.target.id.includes('order-card-delete')) {
      const [, firebaseKey] = e.target.id.split('--');

      deleteSingleOrder(firebaseKey).then(() => {
        getOrders(user.uid).then(showOrders);
      });
    }
    // Below closes out the higher-order addEventListener and domEvents
  });
};

export default domEvents;

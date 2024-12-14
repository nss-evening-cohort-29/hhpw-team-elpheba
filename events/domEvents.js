import { getOrderItems, getSingleOrderItem } from '../api/orderItems';
import { getOrders, deleteSingleOrder, getSingleOrder } from '../api/orders';
import { emptyOrderItems, showOrderItems } from '../pages/orderItemsPage';
import { showOrders } from '../pages/ordersPage';
import clearDOM from '../utils/clearDom';
import addOrderItemForm from '../pages/createOrderItemPage';
import closeOrderPage from '../pages/closeOrderPage';
import renderToDOM from '../utils/renderToDom';

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
      clearDOM();
      const [, firebaseKey] = e.target.id.split('--'); // destructuring to assign firebasekey of the order, which was passed into showOrderItems to store in the add item button
      addOrderItemForm(firebaseKey);
    }

    // CLICK EVENT ON "EDIT" BUTTON ON AN ORDER ITEM
    // get the firebase key of the order item
    if (e.target.id.includes('edit-orderItem-btn')) {
      const [, orderItemFirebaseKey, orderFirebaseKey] = e.target.id.split('--');
      getSingleOrderItem(orderItemFirebaseKey).then((orderItemObj) => {
        addOrderItemForm(orderFirebaseKey, orderItemObj);
      });
    }

    // CLICK EVENT ON DELETE BUTTON OF AN ORDER
    if (e.target.id.includes('order-card-delete')) {
      const [, firebaseKey] = e.target.id.split('--');

      deleteSingleOrder(firebaseKey).then(() => {
        getOrders(user.uid).then(showOrders);
      });
    }

    // CLICK EVENT FOR "GO TO PAYMENT" BUTTON
    if (e.target.id.includes('go-to-payment-btn')) {
      const [, firebaseKey] = e.target.id.split('--');
      getSingleOrder(firebaseKey).then((orderObj) => {
        if (orderObj) {
          closeOrderPage(orderObj);
        } else {
          console.error('Order not found');
          const errorString = '<h1>Error: Order not found</h1>';
          renderToDOM('#form-container', errorString);
        }
      }).catch((error) => {
        console.error('Error fetching order:', error);
        const errorString = '<h1>Error: Could not fetch order details</h1>';
        renderToDOM('#form-container', errorString);
      });
    }

    // CLICK EVENT FOR "CANCEL PAYMENT" BUTTON
    if (e.target.id.includes('cancel-payment')) {
      const [, firebaseKey] = e.target.id.split('--');
      getOrderItems(firebaseKey).then((items) => {
        showOrderItems(items, firebaseKey);
      });
    }

    // CLICK EVENT FOR TIP BUTTONS
    if (e.target.classList.contains('tip-btn')) {
      const tipButtons = document.querySelectorAll('.tip-btn');
      tipButtons.forEach((btn) => btn.classList.remove('active'));
      e.target.classList.add('active');
      document.querySelector('#custom-tip').value = ''; // Clear custom tip
    }

    // Below closes out the higher-order addEventListener and domEvents
  });
};

export default domEvents;

import { deleteSingleOrderItem, getOrderItems, getSingleOrderItem } from '../api/orderItems';
import { getOrders, deleteSingleOrder, getSingleOrder } from '../api/orders';
import { emptyOrderItems, showOrderItems } from '../pages/orderItemsPage';
import { showOrders } from '../pages/ordersPage';
import clearDOM from '../utils/clearDom';
import addOrderItemForm from '../pages/createOrderItemPage';
import closeOrderPage from '../pages/closeOrderPage';
import renderToDOM from '../utils/renderToDom';
import createOrderPage from '../pages/createOrderPage';

const domEvents = (user) => {
  document.addEventListener('click', (e) => {
    // CLICK EVENT ON DETAILS BUTTON OF AN ORDER
    if (e.target.id.includes('order-card-details')) {
      clearDOM();
      const [, firebaseKey] = e.target.id.split('--');

      // Get order items first
      getOrderItems(firebaseKey).then((items) => {
        if (items.length === 0) {
          // If no items, just show empty state
          emptyOrderItems(firebaseKey);
        } else {
          // Try to get order status, default to 'open' if not found
          getSingleOrder(firebaseKey)
            .then((orderObj) => {
              const status = orderObj ? orderObj.status : 'open';
              showOrderItems(items, firebaseKey, status);
            })
            .catch(() => {
              // If order fetch fails, default to 'open'
              showOrderItems(items, firebaseKey, 'open');
            });
        }
      });
    }

    // CLICK EVENT ON "ADD ITEM" BUTTON ON AN ORDER'S ORDER ITEMS PAGE
    if (e.target.id.includes('add-item-btn')) {
      clearDOM();
      const [, firebaseKey] = e.target.id.split('--');
      addOrderItemForm(firebaseKey);
    }

    // CLICK EVEN ON "EDIT" BUTTON ON AN ORDER
    if (e.target.id.includes('order-card-edit')) {
      const [, firebaseKey] = e.target.id.split('--');
      getSingleOrder(firebaseKey).then((orderObj) => {
        createOrderPage(user, orderObj);
      });
    }

    // CLICK EVENT ON "EDIT" BUTTON ON AN ORDER ITEM
    if (e.target.id.includes('edit-orderItem-btn')) {
      const [, orderItemFirebaseKey, orderFirebaseKey] = e.target.id.split('--');
      getSingleOrderItem(orderItemFirebaseKey).then((orderItemObj) => {
        addOrderItemForm(orderFirebaseKey, orderItemObj);
      });
    }

    // CLICK EVENT ON "DELETE" BUTTON ON AN ORDER ITEM
    if (e.target.id.includes('delete-orderItem')) {
      const [, itemFirebaseKey, orderFirebaseKey] = e.target.id.split('--');
      deleteSingleOrderItem(itemFirebaseKey).then(() => getOrderItems(orderFirebaseKey).then(showOrderItems));
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

    // CLICK EVENT FOR "GO BACK TO ORDERS" BUTTON
    if (e.target.id === 'back-to-orders-btn') {
      getOrders(user.uid).then(showOrders);
    }

    // CLICK EVENT FOR "CANCEL PAYMENT" BUTTON
    if (e.target.id.includes('cancel-payment')) {
      const [, firebaseKey] = e.target.id.split('--');

      // Get order items first
      getOrderItems(firebaseKey).then((items) => {
        // Try to get order status, default to 'open' if not found
        getSingleOrder(firebaseKey)
          .then((orderObj) => {
            const status = orderObj ? orderObj.status : 'open';
            showOrderItems(items, firebaseKey, status);
          })
          .catch(() => {
            // If order fetch fails, default to 'open'
            showOrderItems(items, firebaseKey, 'open');
          });
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

import { deleteSingleOrder } from './orders';
import { deleteSingleOrderItem, getOrderItems } from './orderItems';

const deleteOrderItemsRelationship = (firebaseKey) => new Promise((resolve, reject) => {
  // get all order items by firebasekey/order ID
  getOrderItems(firebaseKey).then((orderItemsArray) => {
    // create an array out of the items, then delete them each
    const deleteOrderPromises = orderItemsArray.map((item) => deleteSingleOrderItem(item.firebaseKey));

    Promise.all(deleteOrderPromises).then(() => {
      deleteSingleOrder(firebaseKey).then(resolve);
    });
  }).catch(reject);
});

export default deleteOrderItemsRelationship;

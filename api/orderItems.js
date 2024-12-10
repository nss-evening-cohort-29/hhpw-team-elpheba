import client from '../utils/client';

const endpoint = client.databaseURL;

// GET ORDER_ITEMS BY ORDER
// we don't need to pass uid into this, because it is only accessible by clicking the details button on an order
const getOrderItems = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(
    `${endpoint}/order_items.json?orderBy="order_id"&equalTo="${firebaseKey}"`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => response.json())
    .then((data) => resolve(Object.values(data))) // Resolves an array of order items
    .catch(reject);
});

// GET SINGLE ORDER_ITEM
// We likely won't need to use this, but leaving it just in case
const getSingleOrderItem = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/order_items/${firebaseKey}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data)) // will resolve a single object
    .catch(reject);
});

// CREATE ORDER_ITEM
const createOrderItem = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/order_items.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

// UPDATE ORDER_ITEM
const updateOrderItem = (payload) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/order_items/${payload.firebaseKey}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });

// DELETE AN ORDER_ITEM
const deleteSingleOrderItem = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/order_items/${firebaseKey}.json`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

export {
  getOrderItems,
  getSingleOrderItem,
  createOrderItem,
  updateOrderItem,
  deleteSingleOrderItem,
};

import client from '../utils/client';
// import the firebase url and set to endpoint
const endpoint = client.databaseURL;

// Get all orders based on uid
const getOrders = (uid) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/orders.json?orderBy="user_id"&equalTo="${uid}"`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        resolve(Object.values(data));
      } else {
        resolve([]);
      }
    })
    .catch(reject);
});

// Get a single order
const getSingleOrder = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/orders/${firebaseKey}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

// Create a new order (call this function when submitting the form to create an order)
const createOrder = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/orders.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      const firebaseKey = data.name;
      const updatedPayload = { ...payload, firebaseKey };
      // Update the order with the complete payload including firebaseKey
      fetch(`${endpoint}/orders/${firebaseKey}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPayload),
      })
        .then((response) => response.json())
        .then(() => resolve({ name: firebaseKey }))
        .catch(reject);
    })
    .catch(reject);
});

// Update an order
const updateOrder = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/orders/${payload.firebaseKey}.json`, {
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

// Show only open orders
const getOpenOrders = (uid) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/orders.json?orderBy="user_id"&equalTo="${uid}"`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        const openOrders = Object.values(data).filter((item) => item.status === 'open');
        resolve(openOrders);
      } else {
        resolve([]);
      }
    })
    .catch(reject);
});

// Delete an order
const deleteSingleOrder = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/orders/${firebaseKey}.json`, {
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
  getOrders,
  getSingleOrder,
  createOrder,
  updateOrder,
  getOpenOrders,
  deleteSingleOrder
};

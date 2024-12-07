import client from '../utils/client';

const endpoint = client.databaseURL;

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

export {
  getOrders,
  getSingleOrder
};

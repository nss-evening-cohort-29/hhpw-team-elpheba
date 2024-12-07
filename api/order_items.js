const endpoint = 'https://hhpw-d5858-default-rtdb.firebaseio.com';

// GET ALL ORDER_ITEMS
const getOrderItems = (uid) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/order_items.json?orderBy="uid"&equalTo="${uid}"`, {
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

// GET SINGLE ORDER_ITEM 
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

export { getOrderItems, getSingleOrderItem };

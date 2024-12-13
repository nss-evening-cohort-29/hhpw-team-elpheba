const getValues = (array) => {
  let total = 0;

  array.forEach((item) => {
    total += Number(item.item_price);
  });

  return total;
};

const revenue = () => {
// this will be the function for adding all of the orders together and being displayed onto revenue page.
};

export {
  revenue,
  getValues,
};

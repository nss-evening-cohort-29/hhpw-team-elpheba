import { getOrderItems } from '../api/orderItems';

const getValues = (array) => {
  let total = 0;

  array.forEach((item) => {
    total += Number(item.item_price);
  });

  return total;
};

const formatCurrency = (amount) => {
  const numAmount = parseFloat(amount) || 0;
  return `$${numAmount.toFixed(2)}`;
};

const getTodayStats = async (orders) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysOrders = orders.filter((order) => {
    const orderDate = new Date(order.created_date);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() === today.getTime();
  });

  const openOrders = orders.filter((order) => order.status === 'open');

  // Get revenue from closed orders
  const closedOrders = todaysOrders.filter((order) => order.status === 'closed');

  // Create array of promises for getting order items
  const orderPromises = closedOrders.map((order) => getOrderItems(order.firebaseKey));

  // Wait for all order items to be fetched
  const orderItemsArrays = await Promise.all(orderPromises);

  // Calculate total revenue
  const todayRevenue = closedOrders.reduce((total, order, index) => {
    const orderTotal = getValues(orderItemsArrays[index]);
    const tipAmount = order.tip_amount ? parseFloat(order.tip_amount) : 0;
    return total + orderTotal + tipAmount;
  }, 0);

  return {
    todayOrderCount: todaysOrders.length,
    openOrderCount: openOrders.length,
    todayRevenue
  };
};

const getUniqueCustomers = (orders) => {
  const uniquePhones = new Set();
  const uniqueEmails = new Set();

  orders.forEach((order) => {
    if (order.customer_phone) {
      uniquePhones.add(order.customer_phone);
    }
    if (order.customer_email) {
      uniqueEmails.add(order.customer_email);
    }
  });

  return Math.max(uniquePhones.size, uniqueEmails.size);
};

const calculateRevenue = async (orders = [], startDate = null, endDate = null) => {
  if (!orders.length) {
    return {
      totalRevenue: 0,
      totalTips: 0,
      orderCount: 0,
      averageOrderValue: 0,
      paymentBreakdown: {
        cash: 0,
        credit: 0,
        debit: 0,
        mobile: 0
      },
      orderTypeBreakdown: {
        dine_in: 0,
        phone: 0,
        carryout: 0
      }
    };
  }

  const filteredOrders = orders.filter((order) => {
    if (order.status !== 'closed') return false;
    if (!startDate && !endDate) return true;

    const orderDate = new Date(order.closed_date);
    if (startDate && orderDate < startDate) return false;
    if (endDate && orderDate > endDate) return false;
    return true;
  });

  // Get order items for all filtered orders
  const orderPromises = filteredOrders.map((order) => getOrderItems(order.firebaseKey));
  const orderItemsArrays = await Promise.all(orderPromises);

  const result = filteredOrders.reduce((acc, order, index) => {
    const orderTotal = getValues(orderItemsArrays[index]);
    const tipAmount = order.tip_amount ? parseFloat(order.tip_amount) : 0;

    acc.totalRevenue += orderTotal;
    acc.totalTips += tipAmount;
    acc.orderCount += 1;

    if (order.payment_type) {
      if (!acc.paymentBreakdown[order.payment_type]) {
        acc.paymentBreakdown[order.payment_type] = 0;
      }
      acc.paymentBreakdown[order.payment_type] += orderTotal;
    }

    if (order.order_type) {
      if (!acc.orderTypeBreakdown[order.order_type]) {
        acc.orderTypeBreakdown[order.order_type] = 0;
      }
      acc.orderTypeBreakdown[order.order_type] += 1;
    }

    return acc;
  }, {
    totalRevenue: 0,
    totalTips: 0,
    orderCount: 0,
    paymentBreakdown: {
      cash: 0,
      credit: 0,
      debit: 0,
      mobile: 0
    },
    orderTypeBreakdown: {
      dine_in: 0,
      phone: 0,
      carryout: 0
    }
  });

  result.averageOrderValue = result.orderCount ? result.totalRevenue / result.orderCount : 0;

  return result;
};

const getRevenueByDateRange = (orders, startDate, endDate) => {
  const dailyRevenue = {};

  orders.forEach((order) => {
    if (order.status !== 'closed') {
      return;
    }

    const orderDate = new Date(order.closed_date);
    if (startDate && orderDate < startDate) {
      return;
    }
    if (endDate && orderDate > endDate) {
      return;
    }

    const dateKey = orderDate.toISOString().split('T')[0];
    const orderTotal = parseFloat(order.total_amount) || 0;
    const tipAmount = parseFloat(order.tip_amount) || 0;

    if (!dailyRevenue[dateKey]) {
      dailyRevenue[dateKey] = {
        date: dateKey,
        revenue: 0,
        tips: 0,
        orderCount: 0
      };
    }

    dailyRevenue[dateKey].revenue += orderTotal;
    dailyRevenue[dateKey].tips += tipAmount;
    dailyRevenue[dateKey].orderCount += 1;
  });

  return Object.values(dailyRevenue).sort((a, b) => a.date.localeCompare(b.date));
};

export {
  getValues,
  formatCurrency,
  getTodayStats,
  getUniqueCustomers,
  calculateRevenue,
  getRevenueByDateRange
};

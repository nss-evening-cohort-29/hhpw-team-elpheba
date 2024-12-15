import renderToDom from '../utils/renderToDom';
import clearDOM from '../utils/clearDom';
import { formatCurrency, calculateRevenue, getTodayStats } from '../utils/helperFunctions';
import { getOrders } from '../api/orders';

// Loading state component
const renderLoadingState = () => `
  <div class="loading-container text-center my-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <p class="mt-2">Loading revenue data...</p>
  </div>
`;

// Error state component
const renderErrorState = (error) => `
  <div class="alert alert-danger" role="alert">
    <h4 class="alert-heading">Error Loading Revenue Data</h4>
    <p>${error.message}</p>
    <hr>
    <p class="mb-0">Please try refreshing the page or contact support if the problem persists.</p>
    <button class="btn btn-outline-danger mt-3" onclick="window.location.reload()">
      <i class="fas fa-sync-alt"></i> Refresh Page
    </button>
  </div>
`;

// Stats update function
const updateStats = (revenueData) => {
  const values = [
    formatCurrency(revenueData.totalRevenue),
    formatCurrency(revenueData.totalTips),
    revenueData.orderCount,
    formatCurrency(revenueData.averageOrderValue)
  ];

  // Only update period stats (skip the first row of cards which are today's stats)
  document.querySelectorAll('.period-stats .card-text.h2').forEach((element, index) => {
    const container = element;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    const span = document.createElement('span');
    span.className = 'fade-in';
    span.textContent = values[index];
    container.appendChild(span);
  });
};

// Date validation function
const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    throw new Error('Please select both start and end dates');
  }
  if (startDate > endDate) {
    throw new Error('Start date cannot be after end date');
  }
  if (endDate > new Date()) {
    throw new Error('End date cannot be in the future');
  }
};

// Render breakdown lists
const renderBreakdownList = (data, formatValue, type = 'amount') => Object.entries(data)
  .filter(([, value]) => value > 0)
  .map(([key, value]) => `
      <div class="list-group-item d-flex justify-content-between align-items-center">
        <span class="text-capitalize">${key.replace('_', ' ')}</span>
        <span class="badge bg-primary rounded-pill">
          ${type === 'amount' ? formatCurrency(value) : `${value} orders`}
        </span>
      </div>
    `).join('') || '<div class="text-muted">No data available</div>';

const revenuePage = async () => {
  clearDOM();
  renderToDom('#revenue-page', renderLoadingState());

  try {
    // Check if user is authenticated
    if (!window.user || !window.user.uid) {
      throw new Error('User not authenticated. Please sign in to view revenue data.');
    }

    const orders = await getOrders(window.user.uid);

    if (!orders || !orders.length) {
      throw new Error('No orders data available.');
    }

    // Get today's stats first
    const todayStats = await getTodayStats(orders);

    // Get default date range (last 7 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    // Calculate initial revenue data
    const revenueData = await calculateRevenue(orders, startDate, endDate);

    const domString = `
      <div class="revenue-container">
        <div class="revenue-header">
          <h1>Revenue Overview</h1>
          <div class="date-filter">
            <div class="input-group">
              <input type="date" id="start-date" class="form-control"
                value="${startDate.toISOString().split('T')[0]}"
                max="${new Date().toISOString().split('T')[0]}">
              <span class="input-group-text">to</span>
              <input type="date" id="end-date" class="form-control"
                value="${endDate.toISOString().split('T')[0]}"
                max="${new Date().toISOString().split('T')[0]}">
              <button class="btn btn-primary" id="apply-date-filter">
                <i class="fas fa-filter"></i> Apply Filter
              </button>
            </div>
            <div id="date-error" class="invalid-feedback"></div>
          </div>
        </div>

        <!-- Today's Stats -->
        <div class="row g-4 mb-4 today-stats">
          <div class="col-md-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Today's Orders</h5>
                <p class="card-text h2">${todayStats.todayOrderCount}</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Today's Revenue</h5>
                <p class="card-text h2">${formatCurrency(todayStats.todayRevenue)}</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Open Orders</h5>
                <p class="card-text h2">${todayStats.openOrderCount}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Period Stats -->
        <div class="row g-4 mb-4 period-stats">
          <div class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Period Revenue</h5>
                <p class="card-text h2">${formatCurrency(revenueData.totalRevenue)}</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Period Tips</h5>
                <p class="card-text h2">${formatCurrency(revenueData.totalTips)}</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Period Orders</h5>
                <p class="card-text h2">${revenueData.orderCount}</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Average Order Value</h5>
                <p class="card-text h2">${formatCurrency(revenueData.averageOrderValue)}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Breakdowns -->
        <div class="row g-4">
          <!-- Payment Types -->
          <div class="col-md-6">
            <div class="card h-100">
              <div class="card-header">
                <h3>Payment Types</h3>
              </div>
              <div class="card-body">
                <div class="list-group" id="payment-breakdown">
                  ${renderBreakdownList(revenueData.paymentBreakdown, formatCurrency)}
                </div>
              </div>
            </div>
          </div>

          <!-- Order Types -->
          <div class="col-md-6">
            <div class="card h-100">
              <div class="card-header">
                <h3>Order Types</h3>
              </div>
              <div class="card-body">
                <div class="list-group" id="order-type-breakdown">
                  ${renderBreakdownList(revenueData.orderTypeBreakdown, null, 'count')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    renderToDom('#revenue-page', domString);

    // Add event listener for date filter
    const filterButton = document.getElementById('apply-date-filter');
    if (filterButton) {
      filterButton.addEventListener('click', async () => {
        try {
          const newStartDate = new Date(document.getElementById('start-date').value);
          const newEndDate = new Date(document.getElementById('end-date').value);
          newEndDate.setHours(23, 59, 59, 999); // Include the entire end date

          validateDateRange(newStartDate, newEndDate);

          // Show loading state for stats
          document.querySelectorAll('.period-stats .card-text.h2').forEach((element) => {
            const container = element;
            const spinner = document.createElement('div');
            spinner.className = 'spinner-border spinner-border-sm';
            spinner.setAttribute('role', 'status');
            const span = document.createElement('span');
            span.className = 'visually-hidden';
            span.textContent = 'Loading...';
            spinner.appendChild(span);

            while (container.firstChild) {
              container.removeChild(container.firstChild);
            }
            container.appendChild(spinner);
          });

          // Recalculate with new date range
          const newRevenueData = await calculateRevenue(orders, newStartDate, newEndDate);

          // Update all components
          updateStats(newRevenueData);

          // Update breakdowns
          const paymentList = document.getElementById('payment-breakdown');
          const orderTypeList = document.getElementById('order-type-breakdown');

          if (paymentList) {
            paymentList.innerHTML = renderBreakdownList(newRevenueData.paymentBreakdown, formatCurrency);
          }

          if (orderTypeList) {
            orderTypeList.innerHTML = renderBreakdownList(newRevenueData.orderTypeBreakdown, null, 'count');
          }

          // Clear any previous error messages
          const dateError = document.getElementById('date-error');
          if (dateError) {
            dateError.style.display = 'none';
            dateError.textContent = '';
          }
        } catch (error) {
          const dateError = document.getElementById('date-error');
          if (dateError) {
            dateError.style.display = 'block';
            dateError.textContent = error.message;
          }
        }
      });
    }
  } catch (error) {
    console.error('Error loading revenue data:', error);
    let errorMessage = error.message;

    // Handle specific error cases
    if (error.message.includes('uid')) {
      errorMessage = 'Authentication error. Please sign in again to view revenue data.';
    } else if (error.code === 'permission-denied') {
      errorMessage = 'You do not have permission to view revenue data.';
    }

    renderToDom('#revenue-page', renderErrorState({
      message: errorMessage,
      name: error.name || 'Error'
    }));

    // If it's an authentication error, redirect to login after a delay
    if (error.message.includes('uid')) {
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    }
  }
};

export default revenuePage;

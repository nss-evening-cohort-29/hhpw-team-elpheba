import renderToDom from '../utils/renderToDom';
import clearDOM from '../utils/clearDom';
import { formatCurrency, calculateRevenue, getRevenueByDateRange } from '../utils/helperFunctions';
import { getOrders } from '../api/orders';

const renderRevenueChart = (dailyData) => {
  // Create chart data
  const chartData = dailyData.map((day) => ({
    date: new Date(day.date).toLocaleDateString(),
    revenue: day.revenue,
    tips: day.tips
  }));

  // Create chart HTML
  const chartHeight = 200;
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue));
  const chartBars = chartData.map((day) => {
    const height = (day.revenue / maxRevenue) * chartHeight;
    return `
      <div class="chart-bar" style="height: ${height}px;" title="${day.date}: ${formatCurrency(day.revenue)}">
        <div class="chart-bar-tooltip">
          ${day.date}<br>${formatCurrency(day.revenue)}
        </div>
      </div>`;
  }).join('');

  return `
    <div class="revenue-chart">
      <div class="chart-container">
        ${chartBars}
      </div>
      <div class="chart-axis">
        ${chartData.map((day) => `<div class="chart-label">${day.date}</div>`).join('')}
      </div>
    </div>`;
};

const revenuePage = async () => {
  clearDOM();

  try {
    const orders = await getOrders(window.user.uid);

    // Get default date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // Calculate initial revenue data
    const revenueData = calculateRevenue(orders, startDate, endDate);
    const dailyRevenue = getRevenueByDateRange(orders, startDate, endDate);

    const domString = `
      <div class="revenue-container">
        <div class="revenue-header">
          <h1>Revenue Overview</h1>
          <div class="date-filter">
            <div class="input-group">
              <input type="date" id="start-date" class="form-control"
                value="${startDate.toISOString().split('T')[0]}">
              <span class="input-group-text">to</span>
              <input type="date" id="end-date" class="form-control"
                value="${endDate.toISOString().split('T')[0]}">
              <button class="btn btn-primary" id="apply-date-filter">
                <i class="fas fa-filter"></i> Apply Filter
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Stats Cards -->
        <div class="row g-4 mb-4">
          <div class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Total Revenue</h5>
                <p class="card-text h2">${formatCurrency(revenueData.totalRevenue)}</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Total Tips</h5>
                <p class="card-text h2">${formatCurrency(revenueData.totalTips)}</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Total Orders</h5>
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

        <!-- Revenue Chart -->
        <div class="card mb-4">
          <div class="card-header">
            <h3>Revenue Trend</h3>
          </div>
          <div class="card-body">
            ${renderRevenueChart(dailyRevenue)}
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
                <div class="list-group">
                  ${Object.entries(revenueData.paymentBreakdown).map(([type, amount]) => `
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                      <span class="text-capitalize">${type}</span>
                      <span class="badge bg-primary rounded-pill">${formatCurrency(amount)}</span>
                    </div>
                  `).join('')}
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
                <div class="list-group">
                  ${Object.entries(revenueData.orderTypeBreakdown).map(([type, count]) => `
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                      <span class="text-capitalize">${type.replace('_', ' ')}</span>
                      <span class="badge bg-primary rounded-pill">${count} orders</span>
                    </div>
                  `).join('')}
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
        const newStartDate = new Date(document.getElementById('start-date').value);
        const newEndDate = new Date(document.getElementById('end-date').value);
        newEndDate.setHours(23, 59, 59, 999); // Include the entire end date

        // Recalculate with new date range
        const newRevenueData = calculateRevenue(orders, newStartDate, newEndDate);
        const newDailyRevenue = getRevenueByDateRange(orders, newStartDate, newEndDate);

        // Update stats
        const values = [
          formatCurrency(newRevenueData.totalRevenue),
          formatCurrency(newRevenueData.totalTips),
          newRevenueData.orderCount,
          formatCurrency(newRevenueData.averageOrderValue)
        ];

        Array.from(document.querySelectorAll('.card-text.h2')).forEach((statElement, index) => {
          const elementCopy = statElement;
          elementCopy.textContent = values[index];
        });

        // Update chart
        const chartContainer = document.querySelector('.card-body');
        if (chartContainer) {
          chartContainer.innerHTML = renderRevenueChart(newDailyRevenue);
        }

        // Update breakdowns
        const paymentList = document.querySelector('.card:nth-of-type(1) .list-group');
        if (paymentList) {
          paymentList.innerHTML = Object.entries(newRevenueData.paymentBreakdown)
            .map(([type, amount]) => `
              <div class="list-group-item d-flex justify-content-between align-items-center">
                <span class="text-capitalize">${type}</span>
                <span class="badge bg-primary rounded-pill">${formatCurrency(amount)}</span>
              </div>
            `).join('');
        }

        const orderTypeList = document.querySelector('.card:nth-of-type(2) .list-group');
        if (orderTypeList) {
          orderTypeList.innerHTML = Object.entries(newRevenueData.orderTypeBreakdown)
            .map(([type, count]) => `
              <div class="list-group-item d-flex justify-content-between align-items-center">
                <span class="text-capitalize">${type.replace('_', ' ')}</span>
                <span class="badge bg-primary rounded-pill">${count} orders</span>
              </div>
            `).join('');
        }
      });
    }
  } catch (error) {
    console.error('Error loading revenue data:', error);
    renderToDom('#revenue-page', `
      <div class="alert alert-danger" role="alert">
        <h4 class="alert-heading">Error Loading Revenue Data</h4>
        <p>${error.message}</p>
        <hr>
        <p class="mb-0">Please try refreshing the page or contact support if the problem persists.</p>
      </div>
    `);
  }
};

export default revenuePage;

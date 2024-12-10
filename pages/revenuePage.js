import renderToDom from '../utils/renderToDom';
// import clearDOM from '../utils/clearDom';

const revenuePage = () => {
  // clearDOM();
  let domString = '';

  domString += `
  <div id="rev-main-container">
      <div id="rev-main-box">
      <div id="rev-header" class="rev-page-headers">
        Revenue Breakdown
      </div>
      <div id="revenues-display" class="display">
        <div class="today-vals">Today's Total Revenue!
          <div>$todayPayFunction</div>
        </div>
        <div class="overall-vals">Total Revenue From Start!
          <div>$totalPayFunction</div>
        </div>
      </div>
      <div id="tips-display" class="display">
        <div class="today-vals">Today's Total Tips!
          <div>$todayTipFunction</div>
        </div>
        <div class="overall-vals">Total Tips From Start!
          <div>$totalTipFunction</div>
        </div>
      </div>
      <div id="earnings-display" class="display">
        <div class="today-vals">Today's Total Earnings!
          <div>$todayPayFunction + $todayTipFunction</div>
        </div>
        <div class="overall-vals">Total Earnings From Start!
          <div>$totalPayFunction + $totalTipFunction</div>
        </div>
      </div>
      <div id="order-header" class="rev-page-headers">
        Order Types Breakdown
      </div>
      <div id="orders-display" class="display">
        <div class="overall-vals">Walk-In Orders:
        <div>walkinOrdersFunction</div>
        </div>  
        <div class="overall-vals">Over-The-Phone Orders:
        <div>overthephoneOrdersFunction</div>
        </div>  
      </div>
      <div id="payment-header" class="rev-page-headers">
        Payment Types Breakdown
      </div>
      <div id="payment-display" class="display">
        <div class="overall-vals">Cash Payments:
        <div>cashFunction</div>
        </div> 
        <div class="overall-vals">Credit Card Payments:
        <div>creditCardFunction</div>
        </div> 
        <div class="overall-vals">Debit Card Payments:
        <div>debitCardFunction</div>
        </div> 
        <div class="overall-vals">Bitcoin Payments:
        <div>bitcoinFunction</div>
        </div> 
      </div>
      </div>
    </div>`;

  renderToDom('#revenue-details', domString);
};

export default revenuePage;

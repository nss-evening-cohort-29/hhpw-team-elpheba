import renderToDOM from '../renderToDom';

const navBar = (user) => {
  const domString = `
    <nav class="navbar navbar-expand-lg navbar-light bg-body-tertiary fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img src="https://user-images.githubusercontent.com/29741570/205346767-a182560c-64a6-4cfa-80b3-0d64cf998242.png" alt="Logo" class="nav-logo">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#" id="home">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" id="view-orders">View Orders</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" id="create-order">Create Order</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" id="view-revenue">View Revenue</a>
            </li>
          </ul>
          <div class="d-flex">
            <span class="navbar-text me-3">
              Welcome, ${user.displayName || 'User'}!
            </span>
            <div id="logout-button"></div>
          </div>
        </div>
      </div>
    </nav>`;

  renderToDOM('#navigation', domString);
};

export default navBar;

import renderToDOM from '../utils/renderToDom';
import showAdminDashboard from '../pages/adminPage';

const navBar = (user) => {
  const domString = `
    <nav class="navbar navbar-expand-lg navbar-light bg-body-tertiary fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="#" id="logo-admin-panel">
          <img src="https://user-images.githubusercontent.com/29741570/205346767-a182560c-64a6-4cfa-80b3-0d64cf998242.png" alt="Logo" class="nav-logo">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="#" id="admin-home">
                <i class="fas fa-home"></i> Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" id="view-orders">
                <i class="fas fa-list"></i> View Orders
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" id="create-order">
                <i class="fas fa-plus"></i> Create Order
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" id="view-revenue">
                <i class="fas fa-chart-line"></i> Revenue
              </a>
            </li>
          </ul>
          <div class="d-flex align-items-center">
            <span class="navbar-text me-3">
              Welcome, ${user.displayName}!
            </span>
            <div id="logout-button"></div>
          </div>
        </div>
      </div>
    </nav>`;

  renderToDOM('#navigation', domString);

  // Get current page from URL hash or default to admin-home
  const currentPage = window.location.hash.slice(1) || 'admin-home';

  // Add active state handling
  const setActiveLink = (clickedId) => {
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    // Remove active class from all links
    navLinks.forEach((link) => link.classList.remove('active'));
    dropdownItems.forEach((item) => item.classList.remove('active'));

    // Add active class to clicked link
    const clickedLink = document.querySelector(`#${clickedId}`);
    if (clickedLink) {
      if (clickedLink.classList.contains('dropdown-item')) {
        // If it's a dropdown item, make the dropdown toggle active
        const dropdownToggle = document.querySelector('#navbarDropdown');
        if (dropdownToggle) {
          dropdownToggle.classList.add('active');
        }
      } else {
        clickedLink.classList.add('active');
      }
    }
  };

  // Set initial active state
  setActiveLink(currentPage);

  // Add click event listeners
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const clickedId = e.currentTarget.id;
      setActiveLink(clickedId);

      // Update URL hash
      if (!e.currentTarget.classList.contains('dropdown-toggle')) {
        window.location.hash = clickedId;
      }
    });
  });

  // Add logo and home click handlers to show admin dashboard
  const showAdminHome = (e) => {
    e.preventDefault();
    window.location.hash = 'admin-home';
    setActiveLink('admin-home');
    showAdminDashboard(user);
  };

  document.querySelector('#logo-admin-panel').addEventListener('click', showAdminHome);
  document.querySelector('#admin-home').addEventListener('click', showAdminHome);
};

export default navBar;

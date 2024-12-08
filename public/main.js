import ViewDirectorBasedOnUserAuthStatus from '../utils/viewDirector';
import 'bootstrap'; // import bootstrap elements and js
import '../styles/main.scss';
import '../styles/navbar.scss';

const init = () => {
  document.querySelector('#app').innerHTML = `
    <div id="navigation"></div>
    <div id="main-container">
      <div id="login-form-container"></div>
      <div id="form-container"></div>
      <div id="orders-container"></div>
      <div id="admin-dashboard"></div>
    </div>`;

  // Wait for DOM to be fully loaded before initializing Firebase
  setTimeout(() => {
    ViewDirectorBasedOnUserAuthStatus();
  }, 0);
};

// Ensure DOM is loaded before initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

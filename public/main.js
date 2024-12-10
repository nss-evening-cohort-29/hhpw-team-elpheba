import ViewDirectorBasedOnUserAuthStatus from '../utils/viewDirector';
import 'bootstrap'; // import bootstrap elements and js
import '../styles/main.scss';

const init = () => {
  // Create a clean slate for the app
  document.querySelector('#app').innerHTML = '';

  // Initialize the view director
  ViewDirectorBasedOnUserAuthStatus();
};

// Ensure DOM is loaded before initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

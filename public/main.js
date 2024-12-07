import ViewDirectorBasedOnUserAuthStatus from '../utils/viewDirector';
import 'bootstrap'; // import bootstrap elements and js
import '../styles/main.scss';
import '../styles/navbar.scss';

const init = () => {
  // Create navigation container
  const domString = `
    <div id="navigation"></div>
    <div id="login-form-container"></div>
    <div id="app"></div>
  `;
  document.querySelector('#app').innerHTML = domString;

  // USE WITH FIREBASE AUTH
  ViewDirectorBasedOnUserAuthStatus();
};

init();

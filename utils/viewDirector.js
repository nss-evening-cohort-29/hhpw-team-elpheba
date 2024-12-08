import firebase from 'firebase/app';
import 'firebase/auth';
import loginButton from '../components/buttons/loginButton';
import logoutButton from '../components/buttons/logoutButton';
import client from './client';
import navBar from '../components/navbar';
import navigationEvents from '../events/navigationEvents';
import clearDom from './clearDom';

const ViewDirectorBasedOnUserAuthStatus = () => {
  firebase.initializeApp(client);

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // person is logged in
      // First, ensure proper DOM structure
      document.querySelector('#app').innerHTML = `
        <div id="navigation"></div>
        <div id="main-container">
          <div id="admin-dashboard"></div>
        </div>`;

      // Setup navigation
      navBar(user);
      logoutButton();
      navigationEvents(user);

      // Get current page from URL hash or default to home
      const currentHash = window.location.hash.slice(1);
      if (currentHash) {
        // If there's a hash, trigger the corresponding nav item
        const navItem = document.querySelector(`#${currentHash}`);
        if (navItem) {
          navItem.click();
        } else {
          // If hash doesn't match any nav item, go home
          document.querySelector('#home').click();
        }
      } else {
        // No hash, go home
        document.querySelector('#home').click();
      }
    } else {
      // person is NOT logged in
      clearDom();
      const domString = `
        <div class="container text-center mt-5">
          <div class="row justify-content-center">
            <div class="col-md-6">
              <h1 class="display-4 mb-4">Welcome to Hip Hop Pizza & Wings</h1>
              <div id="login-form-container" class="mt-4"></div>
            </div>
          </div>
        </div>`;
      document.querySelector('#app').innerHTML = domString;
      loginButton();
    }
  });
};

export default ViewDirectorBasedOnUserAuthStatus;

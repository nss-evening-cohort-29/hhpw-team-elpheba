import firebase from 'firebase/app';
import 'firebase/auth';
import loginPage from '../pages/loginPage';
import logoutButton from '../components/buttons/logoutButton';
import client from './client';
import navBar from '../components/navbar';
import navigationEvents from '../events/navigationEvents';
import clearDom from './clearDom';
import showAdminDashboard from '../pages/adminPage';

const ViewDirectorBasedOnUserAuthStatus = () => {
  firebase.initializeApp(client);

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // person is logged in
      document.querySelector('#app').innerHTML = `
        <div id="navigation"></div>
        <div id="main-container">
          <div id="admin-dashboard"></div>
        </div>`;

      // Setup navigation
      navBar(user);
      logoutButton();
      navigationEvents(user);

      // Get current page from URL hash or default to admin dashboard
      const currentHash = window.location.hash.slice(1);
      if (currentHash) {
        const navItem = document.querySelector(`#${currentHash}`);
        if (navItem) {
          navItem.click();
        } else {
          // If invalid hash, show admin dashboard
          showAdminDashboard(user);
        }
      } else {
        // Default to admin dashboard when no hash
        showAdminDashboard(user);
      }
    } else {
      // person is NOT logged in
      clearDom();
      loginPage();
    }
  });
};

export default ViewDirectorBasedOnUserAuthStatus;

import firebase from 'firebase/app';
import 'firebase/auth';

// Internal imports alphabetically
import client from './client';
import loginPage from '../pages/loginPage';
import startApp from '../startApp';

// Keep track of initialization
let isInitialized = false;

const ViewDirectorBasedOnUserAuthStatus = () => {
  if (!isInitialized) {
    firebase.initializeApp(client);
    isInitialized = true;
  }

  firebase.auth().onAuthStateChanged((user) => {
    const appElement = document.querySelector('#app');

    if (user) {
      // If user is logged in, show app structure and start the app
      appElement.style.paddingTop = '75px'; // Add padding for navbar
      appElement.innerHTML = ''; // Clear everything first
      startApp(user); // startApp will set up the structure and initialize the app
    } else {
      // If no user, show login page
      appElement.style.paddingTop = '0'; // Remove padding for login page
      appElement.innerHTML = ''; // Clear everything first
      loginPage(); // Let loginPage handle the rendering
    }
  });
};

export default ViewDirectorBasedOnUserAuthStatus;

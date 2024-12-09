import firebase from 'firebase/app';
import 'firebase/auth';
import loginButton from '../components/buttons/loginButton';
import client from './client';
import startApp from './startApp';

// Keep track of initialization
let isInitialized = false;

const ViewDirectorBasedOnUserAuthStatus = () => {
  // Only initialize once
  if (!isInitialized) {
    firebase.initializeApp(client);
    isInitialized = true;
  }

  // Listen for auth state changes
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // person is logged in do something...
      startApp(user);
    } else {
      // person is NOT logged in
      document.querySelector('#navigation').innerHTML = ''; // Hide navbar
      document.querySelector('#app').innerHTML = ''; // Clear app content
      loginButton();
    }
  });
};

export default ViewDirectorBasedOnUserAuthStatus;

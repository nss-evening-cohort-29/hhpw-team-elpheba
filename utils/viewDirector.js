import firebase from 'firebase/app';
import 'firebase/auth';
import loginButton from '../components/buttons/loginButton';
import logoutButton from '../components/buttons/logoutButton';
import client from './client';
import navBar from '../components/navbar';
import homePage from '../pages/homePage';

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
      navBar(user); // Pass user data to navbar
      logoutButton(); // Add logout button to navbar
      homePage(user); // Show homepage with user-specific content
    } else {
      // person is NOT logged in
      document.querySelector('#navigation').innerHTML = ''; // Hide navbar
      document.querySelector('#app').innerHTML = ''; // Clear app content
      loginButton();
    }
  });
};

export default ViewDirectorBasedOnUserAuthStatus;

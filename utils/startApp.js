import logoutButton from '../components/buttons/logoutButton';
import navBar from '../components/navbar';
import homePage from '../pages/homePage';

const startApp = (user) => {
  document.querySelector('#login-form-container').innerHTML = ''; // Clear login button
  navBar(user); // Pass user data to navbar
  logoutButton(); // Add logout button to navbar
  homePage(user); // Show homepage with user-specific content
};

export default startApp;

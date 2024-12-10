import logoutButton from '../components/buttons/logoutButton';
import navBar from '../components/navbar';
import navigationEvents from '../events/navigationEvents';
import homePage from '../pages/homePage';
import domBuilder from '../shared/domBuilder';

const startApp = (user) => {
  document.querySelector('#login-form-container').innerHTML = ''; // Clear login button
  domBuilder();
  navBar(user); // Pass user data to navbar
  navigationEvents(user);
  logoutButton(); // Add logout button to navbar
  homePage(user); // Show homepage with user-specific content
};

export default startApp;

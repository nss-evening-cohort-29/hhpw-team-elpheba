import logoutButton from './components/buttons/logoutButton';
import navBar from './components/navbar';
import domEvents from './events/domEvents';
import formEvents from './events/formEvents';
import navigationEvents from './events/navigationEvents';
import homePage from './pages/homePage';
import domBuilder from './shared/domBuilder';

const startApp = (user) => {
  domBuilder(); // Set up the main container structure
  navBar(user); // Set up navigation
  domEvents();
  logoutButton(); // Add logout button to navbar
  navigationEvents(user); // Set up navigation events
  formEvents(user); // Set up form events
  homePage(user); // Show homepage with user-specific content
};

export default startApp;

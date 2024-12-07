import firebase from 'firebase/app';
import 'firebase/auth';

// Initialize Firebase Authentication and get a reference to the service
const checkLoginStatus = () => new Promise((resolve) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      resolve(user);
    } else {
      resolve(null);
    }
  });
});

const signIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => firebase.auth().signInWithPopup(provider))
    .catch((error) => {
      console.error('Error during sign in:', error);
      throw error;
    });
};

const signOut = () => firebase.auth().signOut()
  .catch((error) => {
    console.error('Error during sign out:', error);
    throw error;
  });

export { signIn, signOut, checkLoginStatus };

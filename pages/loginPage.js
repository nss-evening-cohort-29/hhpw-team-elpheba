import { signIn } from '../utils/auth';
import renderToDOM from '../utils/renderToDom';
import '../styles/main.scss';

const loginPage = () => {
  const domString = `
    <div id="login-page">
      <div class="login-container">
        <div class="login-card">
          <h3>Hip Hop Pizza & Wings</h3>
          <button id="google-auth" class="google-sign-in-btn">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Icon" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>`;

  renderToDOM('#app', domString);

  // Attach event listener after rendering
  document.querySelector('#google-auth').addEventListener('click', signIn);
};

export default loginPage;

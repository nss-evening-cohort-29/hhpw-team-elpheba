import { signIn } from '../../utils/auth';
import renderToDOM from '../../utils/renderToDom';
import '../../styles/main.scss';

// GOOGLE LOGIN BUTTON
const loginButton = () => {
  const domString = `
    <div class="login-container">
      <div class="login-card">
        <h1>Welcome Back</h1>
        <button id="google-auth" class="btn btn-danger">
          <i class="fab fa-google"></i> Sign in with Google
        </button>
      </div>
    </div>`;

  renderToDOM('#login-form-container', domString);

  document.querySelector('#google-auth').addEventListener('click', signIn);
};

export default loginButton;

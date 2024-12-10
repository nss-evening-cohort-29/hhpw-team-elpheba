const clearDOM = () => {
  document.querySelector('#orders-container').innerHTML = '';
  document.querySelector('#login-form-container').innerHTML = '';
  document.querySelector('#view').innerHTML = '';
  document.querySelector('#add-button').innerHTML = '';
};

export default clearDOM;

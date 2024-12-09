const clearDOM = () => {
  document.querySelector('#main-container').innerHTML = '';
  document.querySelector('#navigation').innerHTML = '';
  document.querySelector('#login-form-container').innerHTML = '';
  document.querySelector('#app').innerHTML = '';
  document.querySelector('#view').innerHTML = '';
  document.querySelector('#add-button').innerHTML = '';
};

export default clearDOM;

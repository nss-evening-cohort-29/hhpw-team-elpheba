const clearDOM = () => {
  document.querySelector('#main-container').innerHTML = '';
  document.querySelector('#navigation').innerHTML = '';
  document.querySelector('#login-form-container').innerHTML = '';
  document.querySelector('#app').innerHTML = '';
};

export default clearDOM;

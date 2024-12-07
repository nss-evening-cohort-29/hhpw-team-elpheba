const clearDom = () => {
  document.querySelector('#navigation').innerHTML = '';
  document.querySelector('#login-form-container').innerHTML = '';
  document.querySelector('#app').innerHTML = '';
};

export default clearDom;

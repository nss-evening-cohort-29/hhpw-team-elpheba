const clearDOM = () => {
  // Only clear the view content, preserve the navbar
  const viewContainer = document.querySelector('#admin-dashboard');
  if (viewContainer) viewContainer.innerHTML = '';
};

export default clearDOM;

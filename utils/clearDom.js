const clearDOM = () => {
  // Clear only content containers, preserve navigation
  const containers = [
    '#form-container',
    '#orders-container',
    '#admin-dashboard',
    '#add-button'
  ];

  containers.forEach((container) => {
    const element = document.querySelector(container);
    if (element) {
      element.innerHTML = '';
    }
  });
};

export default clearDOM;

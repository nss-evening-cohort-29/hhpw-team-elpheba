const renderToDOM = (divId, content) => {
  const selectedDiv = document.querySelector(divId);

  if (!selectedDiv) {
    console.warn(`Element ${divId} not found. Creating it.`);
    const newDiv = document.createElement('div');
    newDiv.id = divId.replace('#', '');
    document.querySelector('#app').appendChild(newDiv);
    newDiv.innerHTML = content;
  } else {
    selectedDiv.innerHTML = content;
  }
};

export default renderToDOM;

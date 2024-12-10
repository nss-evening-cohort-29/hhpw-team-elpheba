import renderToDOM from '../utils/renderToDom';

const domBuilder = () => {
  const domString = `
    <div id="navigation"></div>
    <div id="main-container">
      <div id="form-container"></div>
      <div id="orders-container"></div>
      <div id="admin-dashboard"></div>
      <div id="revenue-page"></div>
      <div id="view"></div>
      <div id="add-button"></div>
    </div>`;

  renderToDOM('#app', domString);
};

export default domBuilder;

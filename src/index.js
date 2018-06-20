// React Common Modules
import React from "react";
import ReactDOM from "react-dom";

import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import Reducer from "./Reducers/Reducer";

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware // Middleware for dispatch()
)(createStore);

let store = createStoreWithMiddleware(Reducer);

// Main SCSS
import "./index.scss";

// Root React Component
import App from "./App";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

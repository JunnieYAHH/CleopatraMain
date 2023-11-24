import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { Provider } from 'react-redux'
import store from './store'
import { ToastContainer } from 'react-toastify';


ReactDOM.render(
  <Provider store={store}>
    <App />
    <ToastContainer />
  </Provider>,
  document.getElementById('root')
);


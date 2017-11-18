import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ConnectedApp from './ConnectedApp';
import './index.css';
import * as promiseMiddleware from 'redux-promise';
import reducer from './reducers/';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

const store = createStore(reducer, applyMiddleware(promiseMiddleware));

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
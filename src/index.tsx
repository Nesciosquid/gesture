import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ConnectedApp from './ConnectedApp';
import './index.css';
import * as promiseMiddleware from 'redux-promise';
import logger from 'redux-logger';
import reducer from './reducers/';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { routerMiddleware } from 'react-router-redux';
import 'bootstrap/dist/css/bootstrap.css';
import createHistory from 'history/createBrowserHistory';
import { fetchAlbumFromImgur } from './actions/images';
import albums from './utils/defaultAlbums';

const history = createHistory();

let middleware = [promiseMiddleware, routerMiddleware(history)];
if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}

const store = createStore(reducer, applyMiddleware(...middleware));
albums.forEach(album => store.dispatch(fetchAlbumFromImgur(album) as any));

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
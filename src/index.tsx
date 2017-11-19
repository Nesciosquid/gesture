import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ConnectedApp from './ConnectedApp';
import './index.css';
import * as promiseMiddleware from 'redux-promise';
import logger from 'redux-logger';
import reducer from './reducers/';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { routerMiddleware, ConnectedRouter } from 'react-router-redux';
import 'bootstrap/dist/css/bootstrap.css';
import * as queryString from 'query-string';
import createHistory from 'history/createBrowserHistory';
import { fetchAlbumFromImgur } from './actions/images';

const history = createHistory();

import { Route } from 'react-router';

let middleware = [promiseMiddleware, routerMiddleware(history)];
if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}

const store = createStore(reducer, applyMiddleware(...middleware));

const queryParams = queryString.parse(location.search, { arrayFormat: 'index' });
if (queryParams.albumIds) {
  queryParams.albumIds.forEach((albumId: string) => fetchAlbumFromImgur(albumId).then(setAction => store.dispatch(setAction)));
}

ReactDOM.render(
  <Provider store={store}>
  <ConnectedRouter history={history}>
    <div>
      <Route exact={true} path="/" component={ConnectedApp} />
    </div>
  </ConnectedRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
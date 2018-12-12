import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import * as promiseMiddleware from 'redux-promise';
// import logger from 'redux-logger';
import reducer from './reducers/';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { routerMiddleware } from 'react-router-redux';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import createHistory from 'history/createBrowserHistory';
import { fetchAlbumFromImgur, addAlbum } from './actions/images';
import { imgurAlbums, driveAlbums } from './utils/defaultAlbums';
import App from './ConnectedApp';
import CanvasExample from './components/Drawing/CanvasApp';
import * as ReduxThunk from 'redux-thunk';
import { Switch, Route } from 'react-router-dom';
import { initializeDriveService, getAlbum } from './utils/googleDrive';

const history = createHistory();

let middleware = [promiseMiddleware, routerMiddleware(history), ReduxThunk.default];

const store = createStore(reducer, applyMiddleware(...middleware));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact={true} path={process.env.PUBLIC_URL + '/'} component={App} />
        <Route path={process.env.PUBLIC_URL + '/draw'} component={CanvasExample} />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
);

async function initAlbums() {
  // imgurAlbums.forEach(album => store.dispatch(fetchAlbumFromImgur(album) as any)); //tslint:disable-line
  initializeDriveService().then(async () => {
    driveAlbums.forEach(async (album, index) => {
      setTimeout(async () => store.dispatch(addAlbum(await getAlbum(album))), 300 * index);
    });
  });
}

initAlbums();

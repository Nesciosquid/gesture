import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import * as promiseMiddleware from 'redux-promise';
import logger from 'redux-logger';
import reducer from './reducers/';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { routerMiddleware, ConnectedRouter } from 'react-router-redux';
import 'bootstrap/dist/css/bootstrap.css';
import createHistory from 'history/createBrowserHistory';
import { fetchAlbumFromImgur } from './actions/images';
import albums from './utils/defaultAlbums';
import App from './ConnectedApp';
import CanvasExample from './CanvasExample';
import * as Pressure from 'pressure';
import { setChange } from './actions/pressure';
import { setSourceImage, setDrawColor, setContext } from './actions/canvas';
import * as ReduxThunk from 'redux-thunk';
const pencilSource = require('./utils/pencilSource.png');
import { Switch, Route } from 'react-router-dom';

const history = createHistory();

let middleware = [promiseMiddleware, routerMiddleware(history), ReduxThunk.default];
if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}
const store = createStore(reducer, applyMiddleware(...middleware));
albums.forEach(album => store.dispatch(fetchAlbumFromImgur(album) as any)); //tslint:disable-line
Pressure.set('.pressure', {
  change: (force: number, event: PointerEvent) => { //tslint:disable-line
    store.dispatch(setChange(force, event));
  },
  end: () => {
    store.dispatch(setChange(0, null));
  }
});

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact={true} path="/" component={App} />
        <Route path="/draw" component={CanvasExample} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
);

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
if (canvas) {
  const context = canvas.getContext('2d');
  if (context) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    store.dispatch(setContext(context));
  }
}

let sourceImage = new Image();
sourceImage.onload = () => {
  store.dispatch(setSourceImage(sourceImage));
};
sourceImage.src = pencilSource;
store.dispatch(setDrawColor({
  r: 1,
  g: .2,
  b: .5,
  a: .0
}));



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
import { fetchAlbumFromImgur } from './actions/images';
import albums from './utils/defaultAlbums';
import App from './ConnectedApp';
import CanvasExample from './components/Drawing/CanvasApp';
import * as Pressure from 'pressure';
import { setChange } from './actions/pressure';
import { setSourceImage, setDrawColor, setContext, setPatternImage } from './actions/canvas';
import * as ReduxThunk from 'redux-thunk';
const pencilSource = require('./utils/pencilSource.png');
const patternSource = require('./utils/pencilPattern.png');
import { Switch, Route } from 'react-router-dom';
import * as _ from 'lodash';

const history = createHistory();

let middleware = [promiseMiddleware, routerMiddleware(history), ReduxThunk.default];
if (process.env.NODE_ENV === 'development') {
  // middleware.push(logger);
}
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
let patternImage = new Image();
patternImage.onload = () => {
  store.dispatch(setPatternImage(patternImage));
};
patternImage.src = patternSource;
store.dispatch(setDrawColor({
  r: 20,
  g: 20,
  b: 20,
  a: 1,
}));

const throttledSetChange = _.throttle((force, event) => store.dispatch(setChange(force, event)), 5);

albums.forEach(album => store.dispatch(fetchAlbumFromImgur(album) as any)); //tslint:disable-line
Pressure.set('.pressure', {
  change: throttledSetChange,
  end: () => store.dispatch(setChange(0, null))
});
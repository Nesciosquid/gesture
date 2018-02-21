import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import * as promiseMiddleware from 'redux-promise';
import logger from 'redux-logger';
import reducer from './reducers/';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { routerMiddleware } from 'react-router-redux';
import 'bootstrap/dist/css/bootstrap.css';
import createHistory from 'history/createBrowserHistory';
//import { fetchAlbumFromImgur } from './actions/images';
//import albums from './utils/defaultAlbums';
// import CanvasExample from './CanvasExample';
import * as Pressure from 'pressure';
import { setChange } from './actions/pressure';
import { setContext, startDrawing, stopDrawing, drawFromPressure, setSourceImage, setDrawColor } from './actions/canvas';
import { TouchEvent, MouseEvent } from 'react';
import * as ReduxThunk from 'redux-thunk';
const pencilSource = require('./utils/pencilSource.png');

const history = createHistory();

let middleware = [promiseMiddleware, routerMiddleware(history), ReduxThunk.default];
if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}
const store = createStore(reducer, applyMiddleware(...middleware));

ReactDOM.render(
  <Provider store={store}>
    <div 
      onTouchStart={(event: TouchEvent<HTMLDivElement>) => {
        const touch = event.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        store.dispatch(startDrawing(x, y));
      }}
      onTouchEnd={(event: TouchEvent<HTMLDivElement>) => {
        store.dispatch(stopDrawing);
      }}
      onTouchMove={(event: TouchEvent<HTMLDivElement>) => {
        const touch = event.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        store.dispatch(drawFromPressure(x, y, 10, 50, .2, 1));
      }}
      onMouseDown={(event: MouseEvent<HTMLDivElement>) => {
        const x = event.clientX;
        const y = event.clientY;
        store.dispatch(startDrawing(x, y));
      }}
      onMouseUp={(event: MouseEvent<HTMLDivElement>) => {
        store.dispatch(stopDrawing());
      }}      
      onMouseMove={(event: MouseEvent<HTMLDivElement>) => {
        const x = event.clientX;
        const y = event.clientY;
        store.dispatch(drawFromPressure(x, y, 10, 50, .2, 1));        
      }}
      style={{width: '100%', height: '100%'}}
    >
      <div 
        className="pressure" 
        style={{
          width: '100%', 
          height: '100%', 
          position: 'absolute', 
          background: 'none', 
          zIndex: 99 
        }} 
      />
      <canvas id="canvas" style={{width: '100%', height: '100%' }}/>
    </div>
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
  r: 0,
  g: 1,
  b: 0,
  a: .0
}));

Pressure.set('.pressure', {
  change: (force: number, event: PointerEvent) => { //tslint:disable-line
    store.dispatch(setChange(force, event));
  },
  end: () => {
    store.dispatch(setChange(0, null));
  }
});
//albums.forEach(album => store.dispatch(fetchAlbumFromImgur(album) as any)); //tslint:disable-line

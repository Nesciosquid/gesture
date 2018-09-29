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
import albums from './utils/defaultAlbums';
import App from './ConnectedApp';
import CanvasExample from './components/Drawing/CanvasApp';
import * as ReduxThunk from 'redux-thunk';
import { Switch, Route } from 'react-router-dom';
import { initializeDriveService, getAlbum } from './utils/googleDrive';

const history = createHistory();

let middleware = [promiseMiddleware, routerMiddleware(history), ReduxThunk.default];
if (process.env.NODE_ENV === 'development') {
  // middleware.push(logger);
}
const store = createStore(reducer, applyMiddleware(...middleware));

// gapi.load('client', () => { 
//   console.log("Loaded client"); 
//   gapi.client.load('drive', 'v3', () => {
//     (gapi.client as any).init({ //tslint:disable-line
//       apiKey: 'AIzaSyDoI8DTezUBqT01hyfbnUzxFpRJI8XNuCY'
//     }).
//     console.log("Loaded drive")
//     gapi.auth.authorize(
//       {
//         // client_id: '271663208801-kq6c7q829c8aoblaao5igvvhv6od8j9b.apps.googleusercontent.com',
//         // scope: ['https://www.googleapis.com/auth/drive.readonly'],
//         // immediate: false,

//       }, 
//       authResult => {
//         if (authResult && !authResult.error) {
//           console.log("Authed successfully!");
//           // gapi.client.drive.files.list({ q: "'1U7wWNPwlc5mW0Lx-mxbq-ZliePvASeH_' in parents" }).then(console.log);
//         } else {
//           console.log("Auth failed");
//           console.log('authResult', authResult);
//         }
//       }
//     );
//   });
// });

const publicArms = '1-SCU1U3r256x1WXpivkD0mzvOl0_b0Vb';
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
  albums.forEach(album => store.dispatch(fetchAlbumFromImgur(album) as any)); //tslint:disable-line
  initializeDriveService().then(async () => {
    store.dispatch(addAlbum(await getAlbum(publicArms)));
  });
}

initAlbums();

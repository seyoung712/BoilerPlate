import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
 import { Provider } from 'react-redux';
//import 'antd/dist/antd.css';
 import { applyMiddleware } from 'redux';
 import promiseMiddleware from 'redux-promise';
 import ReduxThunk from 'react-redux';
 import Reducer from './_reducers';

 const createStoreWithMiddleware = applyMiddleware

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <React.StrictMode
     store={createStoreWithMiddleware(Reducer,
       //Redux DevTools
       window._REDUX_DEVTOOLS_EXTENSION__ &&
       window._REDUX_DEVTOOLS_EXTENSION__()
       )}
   >
     <App />
   </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

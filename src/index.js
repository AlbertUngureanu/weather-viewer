import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

if(localStorage.getItem('favorites') === null)
    localStorage.setItem('favorites', '');

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
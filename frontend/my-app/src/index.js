import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Assuming you have global styles or TailwindCSS here
import App from './App'; // Importing the App component
import './index.css';


const root = ReactDOM.createRoot(document.getElementById('root')); // Access the root DOM node
root.render(
  <React.StrictMode>
    <App />  {/* Render the App component */}
  </React.StrictMode>
);

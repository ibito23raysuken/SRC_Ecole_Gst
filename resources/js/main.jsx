import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './Context/AppContext';
ReactDOM.createRoot(document.getElementById('app')).render(
<AppProvider>
    <App />
</AppProvider>);

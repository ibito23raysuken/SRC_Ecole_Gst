
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import { AppProvider } from './Context/AppContext.jsx';

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <AppProvider>
            <App />
        </AppProvider>
    </React.StrictMode>
);

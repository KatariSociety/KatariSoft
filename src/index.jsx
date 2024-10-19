import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import './index.css';
import { BrowserRouter } from "react-router-dom";
import { TimerProvider } from './context/TimerContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <TimerProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </TimerProvider>
    </React.StrictMode>
);
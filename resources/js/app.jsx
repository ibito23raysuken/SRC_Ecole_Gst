import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import '../css/app.css';
import Layout from './Pages/Layout';
import Home from './Pages/Home';
import Login from './Pages/Login';
export default function App() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Home/>} />
                <Route path='/login' element={<Login/>} />
            </Route>
        </Routes>
        </BrowserRouter>);
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);

import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContext } from './Context/AppContext';
import Layout from './Pages/Layout';
import Home from './Pages/Home';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import Liste_students from './Pages/Students/Liste_students';
import Create from './Pages/Students/Create';

export default function App() {
    const { user } = useContext(AppContext);
    console.log("Utilisateur connecté :", user);
    const isGuest = Object.keys(user || {}).length === 0;

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />

                    {/* Si l'utilisateur est connecté, on redirige vers Home */}
                    <Route path="/login" element={isGuest ? <Login /> : <Home />} />

                    {/* Liste des étudiants accessible uniquement si connecté */}
                    <Route path="/students" element={isGuest ? <Home /> : <Liste_students />} />
                    <Route path="/register" element={isGuest ? <Home /> : <Register />} />
                    <Route path="/students/create" element={<Create/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

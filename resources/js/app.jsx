import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContext } from './Context/AppContext';
import { Toaster } from "react-hot-toast";
import Layout from './Pages/Layout';
import Home from './Pages/Home';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import Liste_students from './Pages/Students/Liste_students';
import Create from './Pages/Students/Create';
import Review from './Pages/Students/Review';
import SchoolDashboard from './Pages/Students/SchoolDashboard';
import Parametre from './Pages/Parametre/Parametre';
import CreateTeacher from './Pages/Teachers/Create';
import Liste_teachers from './Pages/Teachers/Liste_teachers';
import Review_teachers from "./Pages/Teachers/Review_teacher";
import CreateSchoolClass from "./Pages/SchoolClass/CreateSchoolClass";
import Liste_SchoolClass from "./Pages/SchoolClass/Liste_SchoolClass";
import CreateSubject from "./Pages/Subject/CreateSubject";
import Liste_Subject from "./Pages/Subject/Liste_Subject";
export default function App() {
    const { user } = useContext(AppContext);
    const isGuest = Object.keys(user || {}).length === 0;

    return (
        <>
        <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000, // durée 4s
          style: {
            fontSize: '14px',
            padding: '10px',
          }
        }}
      />
              <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />

                    {/* Si l'utilisateur est connecté, on redirige vers Home */}
                    <Route path="/login" element={isGuest ? <Login /> : <Home />} />
                    <Route path="/register" element={isGuest ? <Home /> : <Register />} />
                    {/* Liste des étudiants accessible uniquement si connecté */}
                    <Route path="/students" element={isGuest ? <Home /> : <Liste_students />} />
                    <Route path="/students/:id" element={isGuest ? <Home /> : <Review />} />
                    <Route path="/students/create" element={<Create/>} />
                    <Route path="/students/SchoolDashboard" element={isGuest ? <Home /> : <SchoolDashboard />} />

                    <Route path="/teachers" element={isGuest ? <Home /> : <Liste_teachers />} />
                    <Route path="/teachers/:id" element={isGuest ? <Home /> : <Review_teachers />} />
                    <Route path="/teachers/create" element={isGuest ? <Home /> : <CreateTeacher />} />

                    <Route path="/SchoolClass/create" element={isGuest ? <Home /> : <CreateSchoolClass />} />
                    <Route path="/SchoolClass/list" element={isGuest ? <Home /> : <Liste_SchoolClass />} />

                    <Route path="/subjects/create" element={isGuest ? <Home /> : <CreateSubject />} />
                    <Route path="/subjects/Liste_Subject" element={isGuest ? <Home /> : <Liste_Subject />} />

                    <Route path="/parametre" element={isGuest ? <Home /> : <Parametre />} />

                </Route>
            </Routes>
        </BrowserRouter>
      </>

    );
}

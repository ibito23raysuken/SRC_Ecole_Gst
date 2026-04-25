import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './Context/AppContext';
import { Toaster } from 'react-hot-toast';

// Pages
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
import Review_teachers from './Pages/Teachers/Review_teacher';
import CreateSchoolClass from './Pages/SchoolClass/CreateSchoolClass';
import Liste_SchoolClass from './Pages/SchoolClass/Liste_SchoolClass';
import CreateSubject from './Pages/Subject/CreateSubject';
import Liste_Subject from './Pages/Subject/Liste_Subject';
import Schedule from './Pages/Schedule/CreateSchedule';
import Note from './Pages/Notes/CreateNotes';

export default function App() {
  const { user } = useContext(AppContext);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { fontSize: '14px', padding: '10px' },
        }}
      />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            {/* Auth routes */}
            <Route
              path="/login"
              element={Object.keys(user || {}).length === 0 ? <Login /> : <Navigate to="/" replace />}
            />
            <Route
              path="/register"
              element={Object.keys(user || {}).length === 0 ? <Register /> : <Navigate to="/" replace />}
            />

            {/* Students */}
            <Route
              path="/students"
              element={<PrivateRoute user={user}><Liste_students /></PrivateRoute>}
            />
            <Route
              path="/students/:id"
              element={<PrivateRoute user={user}><Review /></PrivateRoute>}
            />
            <Route
              path="/students/create"
              element={<PrivateRoute user={user}><Create /></PrivateRoute>}
            />
            <Route
              path="/students/SchoolDashboard"
              element={<PrivateRoute user={user}><SchoolDashboard /></PrivateRoute>}
            />

            {/* Teachers */}
            <Route
              path="/teachers"
              element={<PrivateRoute user={user}><Liste_teachers /></PrivateRoute>}
            />
            <Route
              path="/teachers/:id"
              element={<PrivateRoute user={user}><Review_teachers /></PrivateRoute>}
            />
            <Route
              path="/teachers/create"
              element={<PrivateRoute user={user}><CreateTeacher /></PrivateRoute>}
            />

            {/* School Classes */}
            <Route
              path="/SchoolClass/create"
              element={<PrivateRoute user={user}><CreateSchoolClass /></PrivateRoute>}
            />
            <Route
              path="/SchoolClass/list"
              element={<PrivateRoute user={user}><Liste_SchoolClass /></PrivateRoute>}
            />

            {/* Subjects */}
            <Route
              path="/subjects/create"
              element={<PrivateRoute user={user}><CreateSubject /></PrivateRoute>}
            />
            <Route
              path="/subjects/Liste_Subject"
              element={<PrivateRoute user={user}><Liste_Subject /></PrivateRoute>}
            />

            {/* Settings */}
            <Route
              path="/parametre"
              element={<PrivateRoute user={user}><Parametre /></PrivateRoute>}
            />

            {/* Other */}
            <Route path="/schedule" element={<PrivateRoute user={user}><Schedule /></PrivateRoute>} />
            <Route path="/Note" element={<PrivateRoute user={user}><Note /></PrivateRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

// PrivateRoute component
function PrivateRoute({ children, user }) {
  const isGuest = Object.keys(user || {}).length === 0;
  return isGuest ? <Navigate to="/" replace /> : children;
}

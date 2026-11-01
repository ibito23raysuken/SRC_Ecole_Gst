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
import TeacherLayout from './Pages/Teacher/TeacherLayout';
import TeacherDashboard from './Pages/Teacher/TeacherDashboard';
import TeacherClasses from './Pages/Teacher/TeacherClasses';
import TeacherStudents from './Pages/Teacher/TeacherStudents';
import TeacherNotes from './Pages/Teacher/TeacherNotes';
import TeacherMessages from './Pages/Teacher/TeacherMessages';
import TeacherProfile from './Pages/Teacher/TeacherProfile';
import AdminMessages from './Pages/Teachers/AdminMessages';
import ModernTeacherDetail from './Pages/Teachers/ModernTeacherDetail';

export default function App() {
  const { user } = useContext(AppContext);
  const isAuthenticated = Boolean(user?.id);

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
              element={!isAuthenticated ? <Login /> : <Navigate to={user.role === 'teacher' ? '/teacher' : '/'} replace />}
            />
            <Route
              path="/register"
              element={!isAuthenticated ? <Register /> : <Navigate to={user.role === 'teacher' ? '/teacher' : '/'} replace />}
            />

            {/* Students */}
            <Route
              path="/students"
              element={<PrivateRoute user={user} role="admin"><Liste_students /></PrivateRoute>}
            />
            <Route
              path="/students/:id"
              element={<PrivateRoute user={user} role="admin"><Review /></PrivateRoute>}
            />
            <Route
              path="/students/create"
              element={<PrivateRoute user={user} role="admin"><Create /></PrivateRoute>}
            />
            <Route
              path="/students/SchoolDashboard"
              element={<PrivateRoute user={user} role="admin"><SchoolDashboard /></PrivateRoute>}
            />

            {/* Teachers */}
            <Route
              path="/teachers"
              element={<PrivateRoute user={user} role="admin"><Liste_teachers /></PrivateRoute>}
            />
            <Route
              path="/teachers/:id"
              element={<PrivateRoute user={user} role="admin"><ModernTeacherDetail /></PrivateRoute>}
            />
            <Route
              path="/teachers/create"
              element={<PrivateRoute user={user} role="admin"><CreateTeacher /></PrivateRoute>}
            />

            {/* School Classes */}
            <Route
              path="/SchoolClass/create"
              element={<PrivateRoute user={user} role="admin"><CreateSchoolClass /></PrivateRoute>}
            />
            <Route
              path="/SchoolClass/list"
              element={<PrivateRoute user={user} role="admin"><Liste_SchoolClass /></PrivateRoute>}
            />

            {/* Subjects */}
            <Route
              path="/subjects/create"
              element={<PrivateRoute user={user} role="admin"><CreateSubject /></PrivateRoute>}
            />
            <Route
              path="/subjects/Liste_Subject"
              element={<PrivateRoute user={user} role="admin"><Liste_Subject /></PrivateRoute>}
            />

            {/* Settings */}
            <Route
              path="/parametre"
              element={<PrivateRoute user={user} role="admin"><Parametre /></PrivateRoute>}
            />

            {/* Other */}
            <Route path="/schedule" element={<PrivateRoute user={user} role="admin"><Schedule /></PrivateRoute>} />
            <Route path="/Note" element={<PrivateRoute user={user} role="admin"><Note /></PrivateRoute>} />
            <Route path="/admin/messages" element={<PrivateRoute user={user} role="admin"><AdminMessages /></PrivateRoute>} />
            <Route path="/teacher" element={<PrivateRoute user={user} role="teacher"><TeacherLayout /></PrivateRoute>}>
              <Route index element={<TeacherDashboard />} />
              <Route path="classes" element={<TeacherClasses />} />
              <Route path="students" element={<TeacherStudents />} />
              <Route path="notes" element={<TeacherNotes />} />
              <Route path="messages" element={<TeacherMessages />} />
              <Route path="profile" element={<TeacherProfile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

// PrivateRoute component
function PrivateRoute({ children, user, role }) {
  const { loading } = useContext(AppContext);
  if (loading) return <div className="p-8 text-center">Chargement...</div>;
  if (!user) return <Navigate to="/login" replace />;
  const userRole = String(user.role || '').toLowerCase();
  if (role && userRole !== role.toLowerCase()) {
    return <Navigate to={userRole === 'teacher' ? '/teacher' : '/'} replace />;
  }
  return children;
}

// ========== Core React Imports ==========
import React from 'react';
import ReactDOM from 'react-dom/client';

// ========== Routing Imports ==========
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ========== Auth Context Import ==========
import { AuthProvider } from './components/contexts/AuthContext';

// ========== Layout Components ==========
import Layout from './components/layout/Layout';
import LayoutAdmin from './components/layout/LayoutAdmin';

// ========== Page Components ==========
// Authentication Pages
import LoginPage from './components/Auth/LoginPage';
import SignUpPage from './components/Auth/SignUpPage';
// import AdminLoginPage from './components/Buttons/AdminLoginPage/AdminLoginPage';

// Main Pages
import AvilaLanding from './pages/landing-page/AvilaLanding';
import ProfileManagementPage from './components/Buttons/ProfileManagementPage/ProfileManagementPage';
import GalleryPage from './components/Buttons/GalleryPage/GalleryPage';
import ForumPage from './components/Buttons/ForumPage/ForumPage';
import CrearExperiencia from './components/firebase-test/CrearExperiencia/CrearExperiencia';
import ExperiencesPage from './pages/ExperiencesPage/ExperiencesPage';
import BookingPage from './pages/BookingPage/BookingPage';
import BookingProcessPage from './pages/BookingProcessPage/BookingProcessPage';
import OurTeam from './components/nuestro-equipo/OurTeam';

// Admin Pages
import AdminLanding from './pages/Admin-landing/AdminLanding';

// ========== Styles ==========
import './index.css';

// ========== Application Render ==========
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Wrap everything in AuthProvider so context is available throughout the app */}
      <AuthProvider>
        <Routes>
          {/* Authentication Routes (without Layout) */}
          <Route path="/login-page" element={<LoginPage />} />
          {/* <Route path="/guia-login-page" element={<AdminLoginPage />} /> */}
          <Route path="/signUpPage" element={<SignUpPage />} />
          
          {/* Routes with Layout */}
          <Route element={<Layout />}>
            {/* Main Routes */}
            <Route path="/" element={<AvilaLanding />} />
            <Route path="/foro" element={<ForumPage />} />
            <Route path="/equipo" element={<OurTeam />} />
            <Route path="/experiencias" element={<ExperiencesPage />} />
            <Route path="/crear-experiencia" element={<CrearExperiencia />} />
            <Route path="/profile-management-page" element={<ProfileManagementPage />} />
            <Route path="/galeria" element={<GalleryPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/booking-process" element={<BookingProcessPage />} />
          </Route>

          {/* Routes with LayoutAdmin */}
          <Route element={<LayoutAdmin />}>
            {/* Admin Routes */}
            <Route path="/admin-landing" element={<AdminLanding />} />
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
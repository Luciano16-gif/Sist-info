// ========== Core React Imports ==========
import React from 'react';
import ReactDOM from 'react-dom/client';

// ========== Routing Imports ==========
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ========== Layout Components ==========
import Layout from './components/layout/Layout';
import LayoutUser from './components/layout/LayoutUser';

// ========== Page Components ==========
// Authentication Pages
import LoginPage from './components/Buttons/LoginPage/LoginPage';
import SignUpPage from './components/Buttons/SignUpPage/SignUpPage';
// import AdminLoginPage from './components/Buttons/AdminLoginPage/AdminLoginPage';

// Main Pages
//import Home from './components/firebase-test/Home';
import AvilaLanding from './pages/landing-page/AvilaLanding';
import AvilaLandingUser from './pages/landing-page/AvilaLandingUser';
import Foro from './components/firebase-test/Foro';
import ProfileManagementPage from './components/Buttons/ProfileManagementPage/ProfileManagementPage';
import GalleryPage from './components/Buttons/GalleryPage/GalleryPage';
import OurTeam from './components/nuestro-equipo/OurTeam';

//Admin Pages
import AdminLanding from './pages/Admin-tools/Admin-landing/AdminLanding'

// Test Components
import FirestoreTest from './components/firebase-test/FirestoreTest/FirestoreTest';
import AuthTest from './components/firebase-test/AuthTest/AuthTest';
import StorageTest from './components/firebase-test/StorageTest/StorageTest';

// ========== Styles ==========
import './index.css';

// ========== Application Render ==========
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Authentication Routes (without Layout) */}
        <Route path="/login-page" element={<LoginPage />} />
        {/* <Route path="/guia-login-page" element={<AdminLoginPage />} /> */}
        <Route path="/sign-up-page" element={<SignUpPage />} />
        
        {/* Routes with Layout */}
        <Route element={<Layout />}>
          {/* Main Routes */}
          <Route path="/" element={<AvilaLanding />} />
          <Route path="/foro" element={<Foro />} />
          <Route path="/equipo" element={<OurTeam />} />
          
          {/* Admin Routes */}
          <Route path="/admin-landing" element={<AdminLanding />} />

          {/* Testing Routes */}
          <Route path="/firestore-test" element={<FirestoreTest />} />
          <Route path="/auth-test" element={<AuthTest />} />
          <Route path="/storage-test" element={<StorageTest />} />

          <Route path="/profile-management-page" element={<ProfileManagementPage />} />
          <Route path="/gallery-page" element={<GalleryPage />} />
        </Route>

        {/* Routes with LayoutUser */}
        <Route element={<LayoutUser />}>
          {/* Main Routes */}
          <Route path="/landing-page-user" element={<AvilaLandingUser />} />
        </Route>
      </Routes>

    </BrowserRouter>
  </React.StrictMode>
);
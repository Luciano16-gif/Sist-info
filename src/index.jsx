// ========== Core React Imports ==========
import React from 'react';
import ReactDOM from 'react-dom/client';
// Import for PWA registration
import { registerSW } from 'virtual:pwa-register';

// ========== Routing Imports ==========
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ========== Auth Context Import ==========
import { AuthProvider } from './components/contexts/AuthContext';

// ========== Protected Route Components ==========
import ProtectedRoute from './components/routes/ProtectedRoute';
import AdminProtectedRoute from './components/routes/AdminProtectedRoute';
import GuideProtectedRoute from './components/routes/GuideProtectedRoute';

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
import ProfileManagementPage from './components/profile/ProfileManagementPage';
import GalleryPage from './components/Buttons/GalleryPage/GalleryPage';
import ForumPage from './components/Buttons/ForumPage/ForumPage';
import CreateExperience from './components/experiences/createExperience/CreateExperience';
import ExperiencesPage from './pages/ExperiencesPage/ExperiencesPage';
import BookingPage from './pages/BookingPage/BookingPage';
import BookingProcessPage from './pages/BookingProcessPage/BookingProcessPage';
import OurTeam from './components/nuestro-equipo/OurTeam';
import Statistics from './components/firebase-test/Statistics/Statistics';
import ReviewsPage from './pages/ReviewsPage/ReviewsPage';
import SupportPage from './pages/SupportPage/SupportPage';
import GuideRequest from './pages/GuideRequest/GuideRequest';
import SearchTest from './components/SearchTest/SearchTest';
import UserRequestsPage from './pages/User-requests-page/UserRequestsPage';
// Admin Pages
import AdminLanding from './pages/Admin-pages/Admin-landing/AdminLanding';
import AdminGuideRequests from './pages/Admin-guide-requests/AdminGuideRequests';
import AdminExperienceRequests from './pages/Admin-experience-requests/AdminExperienceRequests';
//import GestionGuias from './pages/Admin-pages/Admin-guias/GestionGuias';
import AdminActividades from './pages/Admin-pages/Admin-actividades/AdminActividades';
import AdminCalendario from './pages/Admin-pages/Admin-calendario/AdminCalendario';
import AdminEstadisticas from './pages/Admin-pages/Admin-estadisticas/AdminEstadisticas';
import AdminForo from './pages/Admin-pages/Admin-foro/AdminForo';
import AdminGaleria from './pages/Admin-pages/Admin-galeria/AdminGaleria';
import AdminMensajes from './pages/Admin-pages/Admin-mensajes/AdminMensajes';
import AdminResenas from './pages/Admin-pages/Admin-resenas/AdminResenas';
import AdminRutas from './pages/Admin-pages/Admin-rutas/AdminRutas';
import AdminTips from './pages/Admin-pages/Admin-tips/AdminTips';
import CodeValidation from './pages/CodeValidation/CodeValidation';

// ========== Styles ==========
import './index.css';

// ========== PWA Registration ==========
if ('serviceWorker' in navigator) {
  const swUpdater = registerSW({
    onNeedRefresh() {
      // This function is called when new content is available
      if (confirm('Nuevo contenido disponible. ¿Recargar?')) {
        swUpdater(true);
      }
    },
    onOfflineReady() {
      console.log('App ready to work offline');
    },
  });
}

// ========== Application Render ==========
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Wrapping everything in AuthProvider so context is available throughout the app */}
      <AuthProvider>
        <Routes>
          {/* Public Routes - Accessible without login */}
          <Route path="/" element={<Layout />}>
            <Route index element={<AvilaLanding />} />
          </Route>
            <Route path="/login-page" element={<LoginPage />} />
            <Route path="/signUpPage" element={<SignUpPage />} />
          
          {/* Protected Routes - Require authentication */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/equipo" element={<OurTeam />} />
              <Route path="/foro" element={<ForumPage />} />
              <Route path="/foro/:forumId" element={<ForumPage />} />
              <Route path="/experiencias" element={<ExperiencesPage />} />
              <Route path="/profile-management-page" element={<ProfileManagementPage />} />
              <Route path="/galeria" element={<GalleryPage />} />
              <Route path="/galeria/:imageId" element={<GalleryPage />} />
              <Route path="/galeria/:hashtag" element={<GalleryPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/booking/:experienceName" element={<BookingPage />} />
              <Route path="/booking-process" element={<BookingProcessPage />} />
              <Route path="/estadisticas" element={<Statistics />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/guide-request" element={<GuideRequest />} />
              <Route path="/busqueda" element={<SearchTest />} />
              <Route path="/user-requests" element={<UserRequestsPage />} />
              <Route path="/code-validation" element={<CodeValidation />} />
            </Route>
          </Route>
          
          {/* Guide Protected Routes - Only guides and admins */}
          <Route element={<GuideProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/crear-experiencia" element={<CreateExperience />} />
            </Route>
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route element={<LayoutAdmin />}>
              <Route path="/admin-edit-experience/:id" element={<CreateExperience isEditMode={true} />} />
              <Route path="/homeAdmin" element={<AdminLanding />} />
              <Route path="/admin-guias-pendientes" element={<AdminGuideRequests />} />
              <Route path="/admin-experiencias-pendientes" element={<AdminExperienceRequests />} />
              <Route path="/admin-galeria" element={<AdminGaleria />} />
              <Route path="/admin-rutas" element={<AdminRutas />} />
              <Route path="/admin-calendario" element={<AdminCalendario />} />
              <Route path="/admin-actividades" element={<AdminActividades />} />
              <Route path="/admin-mensajes" element={<AdminMensajes />} />
              <Route path="/admin-estadisticas" element={<AdminEstadisticas />} />
              <Route path="/admin-tips" element={<AdminTips />} />
              <Route path="/admin-foro" element={<AdminForo />} />
              <Route path="/admin-resena" element={<AdminResenas />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
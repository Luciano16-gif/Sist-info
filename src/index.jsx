// ========== Core React Imports ==========
import React from 'react';
import ReactDOM from 'react-dom/client';

// ========== Routing Imports ==========
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ========== Layout Components ==========
import Layout from './components/layout/Layout';

// ========== Page Components ==========
// Authentication Pages
import Login_Page from './pages/LoginPage/login_page';
import Login from './components/firebase-test/Login';
import Register from './components/firebase-test/Register';
import SignUpPage from './components/Buttons/SignUpPage/SignUpPage';

// Main Pages
//import Home from './components/firebase-test/Home';
import AvilaLanding from './pages/landing-page/AvilaLanding';
import Foro from './components/firebase-test/Foro';

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
      <Layout>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<AvilaLanding />} />
          <Route path="/foro" element={<Foro />} />
          
          {/* Authentication Routes */}
          <Route path="/login-page" element={<Login_Page />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sign-up-page" element={<SignUpPage />} />
          
          {/* Testing Routes */}
          <Route path="/firestore-test" element={<FirestoreTest />} />
          <Route path="/auth-test" element={<AuthTest />} />
          <Route path="/storage-test" element={<StorageTest />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>
);
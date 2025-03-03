// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Layout from './components/layout/Layout';
// import Login_Page from './pages/LoginPage/login_page';
// import Home from './components/firebase-test/Home';
// import Foro from './components/firebase-test/Foro';
// import Login from './components/firebase-test/Login';
// import Register from './components/firebase-test/Register';
// import FirestoreTest from './components/firebase-test/FirestoreTest/FirestoreTest'; // Importar el componente FirestoreTest
// import AuthTest from './components/firebase-test/AuthTest/AuthTest';
// import StorageTest from './components/firebase-test/StorageTest/StorageTest';
// import SignUpPage from './components/Buttons/SignUpPage/SignUpPage'; // Importa el componente SignUpPage
// import LoginPage from './components/Buttons/LoginPage/LoginPage';
// import AdminLoginPage from './components/Buttons/AdminLoginPage/AdminLoginPage';
// import './index.css';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Layout>
//         <Routes>
//           <Route path="/login-page1" element={<Login_Page />} />
//           <Route path="/" element={<Home />} />
//           <Route path="/foro" element={<Foro />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/firestore-test" element={<FirestoreTest />} /> {/* Añadir la ruta */}
//           <Route path="/auth-test" element={<AuthTest />} />
//           <Route path="/storage-test" element={<StorageTest />} />
//           <Route path="/sign-up-page" element={<SignUpPage />} /> {/* Añadir la nueva ruta */}
//           <Route path="/login-page" element={<LoginPage />} />
//           <Route path="/guia-login-page" element={<AdminLoginPage />} />
//         </Routes>
//       </Layout>
//     </BrowserRouter>
//   </React.StrictMode>
// );

// ========== Core React Imports ==========
import React from 'react';
import ReactDOM from 'react-dom/client';

// ========== Routing Imports ==========
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ========== Layout Components ==========
import Layout from './components/layout/Layout';

// ========== Page Components ==========
// Authentication Pages
import LoginPage from './components/Buttons/LoginPage/LoginPage';
import SignUpPage from './components/Buttons/SignUpPage/SignUpPage';
import AdminLoginPage from './components/Buttons/AdminLoginPage/AdminLoginPage';

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
      <Routes>
        {/* Authentication Routes (without Layout) */}
        <Route path="/login-page" element={<LoginPage />} />
        <Route path="/guia-login-page" element={<AdminLoginPage />} />
        <Route path="/sign-up-page" element={<SignUpPage />} />
        
        {/* Routes with Layout */}
        <Route element={<Layout />}>
          {/* Main Routes */}
          <Route path="/" element={<AvilaLanding />} />
          <Route path="/foro" element={<Foro />} />
          
          {/* Testing Routes */}
          <Route path="/firestore-test" element={<FirestoreTest />} />
          <Route path="/auth-test" element={<AuthTest />} />
          <Route path="/storage-test" element={<StorageTest />} />
        </Route>
      </Routes>

    </BrowserRouter>
  </React.StrictMode>
);
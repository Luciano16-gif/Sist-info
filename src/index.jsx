import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/layout/Layout';
import Login_Page from './pages/login_page';
import Home from './components/firebase-test/Home';
import Foro from './components/firebase-test/Foro';
import Login from './components/firebase-test/Login';
import Register from './components/firebase-test/Register';
import FirestoreTest from './components/firebase-test/FirestoreTest/FirestoreTest'; // Importar el componente FirestoreTest
import AuthTest from './components/firebase-test/AuthTest/AuthTest';
import StorageTest from './components/firebase-test/StorageTest/StorageTest';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login-page" element={<Login_Page />} />
          <Route path="/" element={<Home />} />
          <Route path="/foro" element={<Foro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/firestore-test" element={<FirestoreTest />} /> {/* Añadir la ruta */}
          <Route path="/auth-test" element={<AuthTest />} />
          <Route path="/storage-test" element={<StorageTest />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>
);
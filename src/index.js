import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/layout/Layout';

import './index.css';

import Tests from './pages/Tests';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Tests/>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>
);

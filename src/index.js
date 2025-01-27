import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './index.css';

import HamburgerMenu from './components/menus/HamburgerMenu';
import TopMenu from './components/menus/TopMenu';

import Tests from './pages/Tests';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* The menus are here so that they are always visible, they are currently with placeholder data */}
      <HamburgerMenu/>
      <TopMenu/>
      <Routes>
        <Route path="/" element={<Tests/>}  />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


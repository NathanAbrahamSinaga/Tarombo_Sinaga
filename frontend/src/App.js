import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminTaromboPage from './pages/AdminTaromboPage';
import UserTaromboPage from './pages/UserTaromboPage';
import SejarahPage from './pages/SejarahPage';
import BeritaPage from './pages/BeritaPage';
import KumpulanBeritaPage from './pages/KumpulanBeritaPage';
import AdminBeritaPage from './pages/AdminBeritaPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/admin-tarombo" 
          element={
            <ProtectedRoute>
              <AdminTaromboPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/tarombo" element={<UserTaromboPage />} />
        <Route path="/sejarah" element={<SejarahPage />} />
        <Route path="/berita" element={<KumpulanBeritaPage />} />
        <Route path="/berita/:id" element={<BeritaPage />} />
        <Route path="/admin-berita" element={<AdminBeritaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
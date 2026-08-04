import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Home from './pages/Home';
import Klasifikasi from './pages/Klasifikasi';
import Galeri from './pages/Galeri';
import Riwayat from './pages/Riwayat';
import DetailRiwayat from './pages/DetailRiwayat';
import Login from './pages/Login';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/klasifikasi" element={<ProtectedRoute><Klasifikasi /></ProtectedRoute>} />
          <Route path="/galeri" element={<ProtectedRoute><Galeri /></ProtectedRoute>} />
          <Route path="/riwayat" element={<ProtectedRoute><Riwayat /></ProtectedRoute>} />
          <Route path="/riwayat/:id" element={<ProtectedRoute><DetailRiwayat /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
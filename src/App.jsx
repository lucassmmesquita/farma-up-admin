// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme'; // Importando o tema Apple-like
import Dashboard from './pages/Dashboard';
import Farmacias from './pages/Farmacias';
import Indicadores from './pages/Indicadores';
import PlanosAcao from './pages/PlanosAcao';
import Evidencias from './pages/Evidencias';
import Usuarios from './pages/Usuarios';
import Login from './pages/Login';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AlertaMedicamentos from './pages/AlertaMedicamentos';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="farmacias/*" element={<Farmacias />} />
              <Route path="indicadores/*" element={<Indicadores />} />
              <Route path="planos-acao/*" element={<PlanosAcao />} />
              <Route path="evidencias/*" element={<Evidencias />} />
              <Route path="usuarios/*" element={<Usuarios />} />
              <Route path="alerta-medicamentos/*" element={<AlertaMedicamentos />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
// src/pages/Indicadores/index.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ListaIndicadores from './ListaIndicadores';
import FormIndicador from './FormIndicador';
import GrafoIndicadores from './GrafoIndicadores';

const Indicadores = () => {
  return (
    <Routes>
      <Route index element={<ListaIndicadores />} />
      <Route path="novo" element={<FormIndicador />} />
      <Route path="editar/:id" element={<FormIndicador />} />
      <Route path="grafo" element={<GrafoIndicadores />} />
    </Routes>
  );
};

export default Indicadores;
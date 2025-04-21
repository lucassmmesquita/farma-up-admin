// src/pages/Evidencias/index.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ListaEvidencias from './ListaEvidencias';
import DetalhesEvidencia from './DetalhesEvidencia';

const Evidencias = () => {
  return (
    <Routes>
      <Route index element={<ListaEvidencias />} />
      <Route path=":id" element={<DetalhesEvidencia />} />
    </Routes>
  );
};

export default Evidencias;
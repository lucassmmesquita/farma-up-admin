// src/pages/Farmacias/index.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ListaFarmacias from './ListaFarmacias';
import FormFarmacia from './FormFarmacia';

const Farmacias = () => {
  return (
    <Routes>
      <Route index element={<ListaFarmacias />} />
      <Route path="novo" element={<FormFarmacia />} />
      <Route path="editar/:id" element={<FormFarmacia />} />
    </Routes>
  );
};

export default Farmacias;
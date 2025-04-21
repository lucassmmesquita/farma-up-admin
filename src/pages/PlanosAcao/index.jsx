// src/pages/PlanosAcao/index.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ListaPlanosAcao from './ListaPlanosAcao';
import FormPlanoAcao from './FormPlanoAcao';
import DetalhesPlanoAcao from './DetalhesPlanoAcao';

const PlanosAcao = () => {
  return (
    <Routes>
      <Route index element={<ListaPlanosAcao />} />
      <Route path="novo" element={<FormPlanoAcao />} />
      <Route path="editar/:id" element={<FormPlanoAcao />} />
      <Route path=":id" element={<DetalhesPlanoAcao />} />
    </Routes>
  );
};

export default PlanosAcao;
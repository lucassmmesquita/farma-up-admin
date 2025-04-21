// src/hooks/useFarmacias.jsx
import { useState } from 'react';
import api from '../services/api';

export const useFarmacias = () => {
  const [farmacias, setFarmacias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const carregarFarmacias = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/farmacias');
      setFarmacias(response.data);
    } catch (err) {
      console.error('Erro ao carregar farmácias:', err);
      setError('Não foi possível carregar as farmácias.');
    } finally {
      setLoading(false);
    }
  };
  
  const obterFarmaciaPorId = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/farmacias/${id}`);
      return response.data;
    } catch (err) {
      console.error(`Erro ao obter farmácia ${id}:`, err);
      setError('Não foi possível obter os dados da farmácia.');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const salvarFarmacia = async (farmacia) => {
    setLoading(true);
    setError(null);
    
    try {
      if (farmacia.id) {
        const response = await api.patch(`/farmacias/${farmacia.id}`, farmacia);
        return response.data;
      } else {
        const response = await api.post('/farmacias', farmacia);
        return response.data;
      }
    } catch (err) {
      console.error('Erro ao salvar farmácia:', err);
      setError(err.response?.data?.message || 'Não foi possível salvar a farmácia.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const excluirFarmacia = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.delete(`/farmacias/${id}`);
      
      // Atualizar estado
      setFarmacias(farmacias.filter(farm => farm.id !== id));
      
      return true;
    } catch (err) {
      console.error(`Erro ao excluir farmácia ${id}:`, err);
      setError('Não foi possível excluir a farmácia.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    farmacias,
    loading,
    error,
    carregarFarmacias,
    obterFarmaciaPorId,
    salvarFarmacia,
    excluirFarmacia
  };
};
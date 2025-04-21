// src/hooks/useFarmacias.jsx
import { useState } from 'react';
import api from '../services/api';

// Para fins de demonstração, vamos criar dados mockados
const mockFarmacias = [
  { id: '1', nome: 'Farmácia Central', cnpj: '12.345.678/0001-90', endereco: 'Av. Principal, 123', telefone: '(11) 3456-7890', email: 'contato@farmaciacentral.com', corPrincipal: '#2E7D32', corSecundaria: '#FF5722', ativo: true, totalUsuarios: 12 },
  { id: '2', nome: 'Farmácia Saúde', cnpj: '23.456.789/0001-01', endereco: 'Rua Secundária, 456', telefone: '(11) 4567-8901', email: 'contato@farmaciasaude.com', corPrincipal: '#1565C0', corSecundaria: '#FFC107', ativo: true, totalUsuarios: 8 },
  { id: '3', nome: 'Farmácia Bem Estar', cnpj: '34.567.890/0001-12', endereco: 'Praça da Matriz, 789', telefone: '(11) 5678-9012', email: 'contato@farmaciabemestar.com', corPrincipal: '#6A1B9A', corSecundaria: '#4CAF50', ativo: false, totalUsuarios: 5 },
];

export const useFarmacias = () => {
  const [farmacias, setFarmacias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const carregarFarmacias = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Para uma API real:
      // const response = await api.get('/farmacias');
      // setFarmacias(response.data);
      
      // Usando dados mockados:
      setFarmacias(mockFarmacias);
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
      // Para uma API real:
      // const response = await api.get(`/farmacias/${id}`);
      // return response.data;
      
      // Usando dados mockados:
      const farmacia = mockFarmacias.find(farm => farm.id === id);
      return farmacia || null;
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
        // Para uma API real:
        // const response = await api.put(`/farmacias/${farmacia.id}`, farmacia);
        // return response.data;
        
        // Simulando atualização:
        const index = mockFarmacias.findIndex(f => f.id === farmacia.id);
        if (index !== -1) {
          mockFarmacias[index] = farmacia;
        }
        return farmacia;
      } else {
        // Para uma API real:
        // const response = await api.post('/farmacias', farmacia);
        // return response.data;
        
        // Simulando criação:
        const novaFarmacia = {
          ...farmacia,
          id: String(mockFarmacias.length + 1)
        };
        mockFarmacias.push(novaFarmacia);
        return novaFarmacia;
      }
    } catch (err) {
      console.error('Erro ao salvar farmácia:', err);
      setError('Não foi possível salvar a farmácia.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const excluirFarmacia = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      // Para uma API real:
      // await api.delete(`/farmacias/${id}`);
      
      // Simulando exclusão:
      const index = mockFarmacias.findIndex(f => f.id === id);
      if (index !== -1) {
        mockFarmacias.splice(index, 1);
      }
      
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
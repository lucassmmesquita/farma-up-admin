// src/hooks/useIndicadores.jsx
import { useState } from 'react';
import api from '../services/api';

// Dados mockados para os indicadores
const mockIndicadores = [
  { 
    id: '1', 
    codigo: 'IND-001', 
    nome: 'Taxa de Conversão de Vendas', 
    categoria: 'VENDAS', 
    unidade: '%', 
    metaPadrao: '30',
    temImpacto: true,
    indicadoresRelacionados: ['2', '3']
  },
  { 
    id: '2', 
    codigo: 'IND-002', 
    nome: 'Índice de Ruptura de Estoque', 
    categoria: 'ESTOQUE', 
    unidade: '%', 
    metaPadrao: '5',
    temImpacto: false,
    indicadoresRelacionados: ['4']
  },
  { 
    id: '3', 
    codigo: 'IND-003', 
    nome: 'Taxa de Retenção de Clientes', 
    categoria: 'CLIENTES', 
    unidade: '%', 
    metaPadrao: '70',
    temImpacto: true,
    indicadoresRelacionados: ['1', '5']
  },
  { 
    id: '4', 
    codigo: 'IND-004', 
    nome: 'Valor Médio do Ticket', 
    categoria: 'VENDAS', 
    unidade: 'R$', 
    metaPadrao: '120',
    temImpacto: false,
    indicadoresRelacionados: ['1']
  },
  { 
    id: '5', 
    codigo: 'IND-005', 
    nome: 'Nível de Satisfação do Cliente', 
    categoria: 'CLIENTES', 
    unidade: 'pontos', 
    metaPadrao: '85',
    temImpacto: true,
    indicadoresRelacionados: ['3']
  }
];

export const useIndicadores = () => {
  const [indicadores, setIndicadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const carregarIndicadores = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Para uma API real:
      // const response = await api.get('/indicadores');
      // setIndicadores(response.data);
      
      // Usando dados mockados:
      setIndicadores(mockIndicadores);
    } catch (err) {
      console.error('Erro ao carregar indicadores:', err);
      setError('Não foi possível carregar os indicadores.');
    } finally {
      setLoading(false);
    }
  };
  
  const obterIndicadorPorId = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      // Para uma API real:
      // const response = await api.get(`/indicadores/${id}`);
      // return response.data;
      
      // Usando dados mockados:
      const indicador = mockIndicadores.find(ind => ind.id === id);
      return indicador || null;
    } catch (err) {
      console.error(`Erro ao obter indicador ${id}:`, err);
      setError('Não foi possível obter os dados do indicador.');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const salvarIndicador = async (indicador) => {
    setLoading(true);
    setError(null);
    
    try {
      if (indicador.id) {
        // Para uma API real:
        // const response = await api.put(`/indicadores/${indicador.id}`, indicador);
        // return response.data;
        
        // Simulando atualização:
        const index = mockIndicadores.findIndex(ind => ind.id === indicador.id);
        if (index !== -1) {
          mockIndicadores[index] = {
            ...mockIndicadores[index],
            ...indicador
          };
        }
        return mockIndicadores[index];
      } else {
        // Para uma API real:
        // const response = await api.post('/indicadores', indicador);
        // return response.data;
        
        // Simulando criação:
        const novoIndicador = {
          ...indicador,
          id: String(mockIndicadores.length + 1),
          codigo: `IND-${String(mockIndicadores.length + 1).padStart(3, '0')}`
        };
        mockIndicadores.push(novoIndicador);
        return novoIndicador;
      }
    } catch (err) {
      console.error('Erro ao salvar indicador:', err);
      setError('Não foi possível salvar o indicador.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    indicadores,
    loading,
    error,
    carregarIndicadores,
    obterIndicadorPorId,
    salvarIndicador
  };
};
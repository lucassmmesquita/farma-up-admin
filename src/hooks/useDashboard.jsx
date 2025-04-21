// src/hooks/useDashboard.jsx
import { useState } from 'react';
import api from '../services/api';

// Dados mockados para o dashboard
const mockDadosDashboard = {
  kpis: {
    totalPlanosAcao: 23,
    variacaoPlanosAcao: 15,
    totalEvidencias: 87,
    variacaoEvidencias: 25,
    taxaCumprimento: 78,
    variacaoCumprimento: 8,
    farmaciasAtivas: 5,
    variacaoFarmacias: 2
  },
  graficoEvolucaoPlanosAcao: [
    { nome: 'Jan', criados: 5, concluidos: 2 },
    { nome: 'Fev', criados: 7, concluidos: 4 },
    { nome: 'Mar', criados: 10, concluidos: 6 },
    { nome: 'Abr', criados: 8, concluidos: 5 }
  ],
  graficoStatusPlanosAcao: [
    { name: 'Em Andamento', value: 45, color: '#2196f3' },
    { name: 'Concluídos', value: 35, color: '#4caf50' },
    { name: 'Atrasados', value: 20, color: '#f44336' }
  ],
  graficoIndicadoresPorCategoria: [
    { categoria: 'Vendas', acimaMeta: 3, dentroMeta: 2, abaixoMeta: 1 },
    { categoria: 'Estoque', acimaMeta: 1, dentroMeta: 3, abaixoMeta: 2 },
    { categoria: 'Clientes', acimaMeta: 2, dentroMeta: 4, abaixoMeta: 0 },
    { categoria: 'Financeiro', acimaMeta: 1, dentroMeta: 1, abaixoMeta: 1 }
  ],
  graficoDesempenhoPorFarmacia: [
    { farmacia: 'Central', cumprimento: 85, indicadoresAlcancados: 75 },
    { farmacia: 'Saúde', cumprimento: 70, indicadoresAlcancados: 60 },
    { farmacia: 'Bem Estar', cumprimento: 90, indicadoresAlcancados: 80 },
    { farmacia: 'Popular', cumprimento: 65, indicadoresAlcancados: 55 },
    { farmacia: 'Vida', cumprimento: 75, indicadoresAlcancados: 70 }
  ],
  graficoTendenciaIndicadores: [
    { mes: 'Jan', 'Taxa de Conversão': 22, 'Ticket Médio': 95, 'Ruptura': 8 },
    { mes: 'Fev', 'Taxa de Conversão': 25, 'Ticket Médio': 98, 'Ruptura': 7 },
    { mes: 'Mar', 'Taxa de Conversão': 27, 'Ticket Médio': 102, 'Ruptura': 6 },
    { mes: 'Abr', 'Taxa de Conversão': 30, 'Ticket Médio': 110, 'Ruptura': 5 }
  ]
};

export const useDashboard = () => {
  const [dadosDashboard, setDadosDashboard] = useState(mockDadosDashboard);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const carregarDadosDashboard = async (periodo = '30dias', farmaciaId = 'todas') => {
    setLoading(true);
    setError(null);
    
    try {
      // Para uma API real:
      // const response = await api.get('/dashboard', { params: { periodo, farmaciaId } });
      // setDadosDashboard(response.data);
      
      // Usando dados mockados:
      // Aqui poderíamos ajustar os dados mockados com base no período e na farmácia selecionados
      // Para simplificar, estamos usando os mesmos dados independente dos filtros
      setDadosDashboard(mockDadosDashboard);
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError('Não foi possível carregar os dados do dashboard.');
    } finally {
      setLoading(false);
    }
  };
  
  return {
    dadosDashboard,
    loading,
    error,
    carregarDadosDashboard
  };
};
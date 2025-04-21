// src/hooks/usePlanosAcao.jsx
import { useState } from 'react';
import api from '../services/api';
import { format, addDays, isPast } from 'date-fns';

// Dados mockados para os planos de ação
const mockPlanosAcao = [
  {
    id: '1',
    titulo: 'Melhorar taxa de conversão no PDV',
    descricao: 'Implementar estratégias para aumentar a taxa de conversão no ponto de venda, focando em cross-selling e sugestão de produtos complementares.',
    farmaciaId: '1',
    farmacia: { id: '1', nome: 'Farmácia Central' },
    indicadorId: '1',
    indicador: { id: '1', nome: 'Taxa de Conversão de Vendas' },
    responsavelId: '1',
    responsavel: { id: '1', nome: 'Ana Silva' },
    dataCriacao: '2025-04-10T10:00:00Z',
    prazo: '2025-05-15T23:59:59Z',
    status: 'EM_ANDAMENTO',
    percentualConcluido: 45,
    acoes: [
      { id: '1', descricao: 'Treinar equipe sobre técnicas de cross-selling', prazo: '2025-04-20T23:59:59Z', concluida: true, atrasada: false },
      { id: '2', descricao: 'Implementar sugestões de produtos no sistema', prazo: '2025-04-30T23:59:59Z', concluida: false, atrasada: false },
      { id: '3', descricao: 'Criar materiais visuais de auxílio à venda', prazo: '2025-05-10T23:59:59Z', concluida: false, atrasada: false }
    ],
    comentarios: [
      { id: '1', texto: 'Treinamento da equipe foi um sucesso!', data: '2025-04-21T14:30:00Z', usuario: { id: '1', nome: 'Ana Silva' } },
      { id: '2', texto: 'Precisamos acelerar a implementação das sugestões no sistema', data: '2025-04-25T09:15:00Z', usuario: { id: '2', nome: 'Carlos Souza' } }
    ],
    evidencias: [
      { id: '1', url: 'https://via.placeholder.com/500x300?text=Treinamento+da+Equipe', dataCriacao: '2025-04-21T15:30:00Z', status: 'APROVADA' }
    ]
  },
  {
    id: '2',
    titulo: 'Reduzir ruptura de estoque de medicamentos controlados',
    descricao: 'Desenvolver processo para prever demanda e evitar ruptura de estoque, especialmente para medicamentos controlados de alta procura.',
    farmaciaId: '2',
    farmacia: { id: '2', nome: 'Farmácia Saúde' },
    indicadorId: '2',
    indicador: { id: '2', nome: 'Índice de Ruptura de Estoque' },
    responsavelId: '3',
    responsavel: { id: '3', nome: 'Roberto Almeida' },
    dataCriacao: '2025-04-05T14:30:00Z',
    prazo: '2025-04-25T23:59:59Z',
    status: 'ATRASADO',
    percentualConcluido: 60,
    acoes: [
      { id: '4', descricao: 'Levantar histórico de vendas dos últimos 6 meses', prazo: '2025-04-10T23:59:59Z', concluida: true, atrasada: false },
      { id: '5', descricao: 'Criar modelo de previsão de demanda', prazo: '2025-04-18T23:59:59Z', concluida: true, atrasada: false },
      { id: '6', descricao: 'Implementar alertas automáticos no sistema', prazo: '2025-04-22T23:59:59Z', concluida: false, atrasada: true }
    ],
    comentarios: [
      { id: '3', texto: 'O levantamento dos dados foi mais trabalhoso que o previsto', data: '2025-04-12T10:45:00Z', usuario: { id: '3', nome: 'Roberto Almeida' } }
    ],
    evidencias: []
  },
  {
    id: '3',
    titulo: 'Implementar programa de fidelidade',
    descricao: 'Criar programa de fidelidade para aumentar retenção de clientes e estimular compras recorrentes.',
    farmaciaId: '1',
    farmacia: { id: '1', nome: 'Farmácia Central' },
    indicadorId: '3',
    indicador: { id: '3', nome: 'Taxa de Retenção de Clientes' },
    responsavelId: '2',
    responsavel: { id: '2', nome: 'Carlos Souza' },
    dataCriacao: '2025-03-20T09:00:00Z',
    prazo: '2025-04-10T23:59:59Z',
    status: 'CONCLUIDO',
    percentualConcluido: 100,
    acoes: [
      { id: '7', descricao: 'Definir regras de pontuação', prazo: '2025-03-25T23:59:59Z', concluida: true, atrasada: false },
      { id: '8', descricao: 'Desenvolver sistema de cadastro de clientes', prazo: '2025-04-01T23:59:59Z', concluida: true, atrasada: false },
      { id: '9', descricao: 'Treinar equipe e lançar programa', prazo: '2025-04-08T23:59:59Z', concluida: true, atrasada: false }
    ],
    comentarios: [
      { id: '4', texto: 'Programa lançado com sucesso! Já temos 50 clientes cadastrados no primeiro dia.', data: '2025-04-08T17:20:00Z', usuario: { id: '2', nome: 'Carlos Souza' } }
    ],
    evidencias: [
      { id: '2', url: 'https://via.placeholder.com/500x300?text=Materiais+do+Programa', dataCriacao: '2025-04-05T11:30:00Z', status: 'APROVADA' },
      { id: '3', url: 'https://via.placeholder.com/500x300?text=Lançamento+do+Programa', dataCriacao: '2025-04-08T16:45:00Z', status: 'APROVADA' }
    ]
  }
];

export const usePlanosAcao = () => {
  const [planosAcao, setPlanosAcao] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contadorStatus, setContadorStatus] = useState({
    emAndamento: 0,
    concluidos: 0,
    atrasados: 0
  });
  
  const carregarPlanosAcao = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Para uma API real:
      // const response = await api.get('/planos-acao');
      // setPlanosAcao(response.data);
      
      // Usando dados mockados:
      setPlanosAcao(mockPlanosAcao);
      
      // Calcular contadores
      const emAndamento = mockPlanosAcao.filter(p => p.status === 'EM_ANDAMENTO').length;
      const concluidos = mockPlanosAcao.filter(p => p.status === 'CONCLUIDO').length;
      const atrasados = mockPlanosAcao.filter(p => p.status === 'ATRASADO').length;
      
      setContadorStatus({
        emAndamento,
        concluidos,
        atrasados
      });
    } catch (err) {
      console.error('Erro ao carregar planos de ação:', err);
      setError('Não foi possível carregar os planos de ação.');
    } finally {
      setLoading(false);
    }
  };
  
  const obterPlanoPorId = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      // Para uma API real:
      // const response = await api.get(`/planos-acao/${id}`);
      // return response.data;
      
      // Usando dados mockados:
      const plano = mockPlanosAcao.find(p => p.id === id);
      return plano || null;
    } catch (err) {
      console.error(`Erro ao obter plano de ação ${id}:`, err);
      setError('Não foi possível obter os dados do plano de ação.');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const salvarPlano = async (plano) => {
    setLoading(true);
    setError(null);
    
    try {
      if (plano.id) {
        // Para uma API real:
        // const response = await api.put(`/planos-acao/${plano.id}`, plano);
        // return response.data;
        
        // Simulando atualização:
        const index = mockPlanosAcao.findIndex(p => p.id === plano.id);
        if (index !== -1) {
          mockPlanosAcao[index] = {
            ...mockPlanosAcao[index],
            ...plano
          };
        }
        return mockPlanosAcao[index];
      } else {
        // Para uma API real:
        // const response = await api.post('/planos-acao', plano);
        // return response.data;
        
        // Simulando criação:
        const novoPlano = {
          ...plano,
          id: String(mockPlanosAcao.length + 1),
          dataCriacao: new Date().toISOString(),
          status: 'EM_ANDAMENTO',
          percentualConcluido: 0,
          comentarios: [],
          evidencias: []
        };
        mockPlanosAcao.push(novoPlano);
        return novoPlano;
      }
    } catch (err) {
      console.error('Erro ao salvar plano de ação:', err);
      setError('Não foi possível salvar o plano de ação.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const adicionarComentario = async (planoId, texto) => {
    setLoading(true);
    setError(null);
    
    try {
      // Para uma API real:
      // const response = await api.post(`/planos-acao/${planoId}/comentarios`, { texto });
      // return response.data;
      
      // Simulando adição de comentário:
      const plano = mockPlanosAcao.find(p => p.id === planoId);
      if (!plano) throw new Error('Plano não encontrado');
      
      const novoComentario = {
        id: String(plano.comentarios.length + 1),
        texto,
        data: new Date().toISOString(),
        usuario: { id: '1', nome: 'Usuário Logado' } // Normalmente seria o usuário atual
      };
      
      plano.comentarios.push(novoComentario);
      return novoComentario;
    } catch (err) {
      console.error(`Erro ao adicionar comentário ao plano ${planoId}:`, err);
      setError('Não foi possível adicionar o comentário.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const adicionarEvidencia = async (planoId, formData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Para uma API real:
      // const response = await api.post(`/planos-acao/${planoId}/evidencias`, formData);
      // return response.data;
      
      // Simulando adição de evidência:
      const plano = mockPlanosAcao.find(p => p.id === planoId);
      if (!plano) throw new Error('Plano não encontrado');
      
      const novaEvidencia = {
        id: String(plano.evidencias.length + 1),
        url: 'https://via.placeholder.com/500x300?text=Nova+Evidência',
        dataCriacao: new Date().toISOString(),
        status: 'PENDENTE'
      };
      
      plano.evidencias.push(novaEvidencia);
      return novaEvidencia;
    } catch (err) {
      console.error(`Erro ao adicionar evidência ao plano ${planoId}:`, err);
      setError('Não foi possível adicionar a evidência.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    planosAcao,
    loading,
    error,
    contadorStatus,
    carregarPlanosAcao,
    obterPlanoPorId,
    salvarPlano,
    adicionarComentario,
    adicionarEvidencia
  };
};
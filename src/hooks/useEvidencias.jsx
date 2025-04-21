// src/hooks/useEvidencias.jsx
import { useState } from 'react';
import api from '../services/api';

// Dados mockados para as evidências
const mockEvidencias = [
  {
    id: '1',
    url: 'https://via.placeholder.com/500x300?text=Treinamento+da+Equipe',
    descricao: 'Registro do treinamento da equipe sobre técnicas de cross-selling',
    dataCriacao: '2025-04-21T15:30:00Z',
    status: 'APROVADA',
    dataValidacao: '2025-04-22T10:15:00Z',
    validadoPor: { id: '2', nome: 'Carlos Souza' },
    motivoReprovacao: null,
    planoId: '1',
    plano: { id: '1', titulo: 'Melhorar taxa de conversão no PDV' },
    farmaciaId: '1',
    farmacia: { id: '1', nome: 'Farmácia Central' },
    indicadorId: '1',
    indicador: { id: '1', nome: 'Taxa de Conversão de Vendas' },
    usuarioId: '1',
    usuario: { id: '1', nome: 'Ana Silva' },
    comentarios: [
      { id: '1', texto: 'Excelente registro do treinamento!', data: '2025-04-22T10:15:00Z', usuario: { id: '2', nome: 'Carlos Souza' } }
    ]
  },
  {
    id: '2',
    url: 'https://via.placeholder.com/500x300?text=Materiais+do+Programa',
    descricao: 'Materiais preparados para o programa de fidelidade',
    dataCriacao: '2025-04-05T11:30:00Z',
    status: 'APROVADA',
    dataValidacao: '2025-04-06T09:20:00Z',
    validadoPor: { id: '3', nome: 'Roberto Almeida' },
    motivoReprovacao: null,
    planoId: '3',
    plano: { id: '3', titulo: 'Implementar programa de fidelidade' },
    farmaciaId: '1',
    farmacia: { id: '1', nome: 'Farmácia Central' },
    indicadorId: '3',
    indicador: { id: '3', nome: 'Taxa de Retenção de Clientes' },
    usuarioId: '2',
    usuario: { id: '2', nome: 'Carlos Souza' },
    comentarios: []
  },
  {
    id: '3',
    url: 'https://via.placeholder.com/500x300?text=Lançamento+do+Programa',
    descricao: 'Foto do evento de lançamento do programa de fidelidade',
    dataCriacao: '2025-04-08T16:45:00Z',
    status: 'APROVADA',
    dataValidacao: '2025-04-09T08:30:00Z',
    validadoPor: { id: '3', nome: 'Roberto Almeida' },
    motivoReprovacao: null,
    planoId: '3',
    plano: { id: '3', titulo: 'Implementar programa de fidelidade' },
    farmaciaId: '1',
    farmacia: { id: '1', nome: 'Farmácia Central' },
    indicadorId: '3',
    indicador: { id: '3', nome: 'Taxa de Retenção de Clientes' },
    usuarioId: '2',
    usuario: { id: '2', nome: 'Carlos Souza' },
    comentarios: []
  },
  {
    id: '4',
    url: 'https://via.placeholder.com/500x300?text=Novo+Layout+de+Prateleiras',
    descricao: 'Novo layout de prateleiras para favorecer cross-selling',
    dataCriacao: '2025-04-18T14:20:00Z',
    status: 'PENDENTE',
    dataValidacao: null,
    validadoPor: null,
    motivoReprovacao: null,
    planoId: '1',
    plano: { id: '1', titulo: 'Melhorar taxa de conversão no PDV' },
    farmaciaId: '1',
    farmacia: { id: '1', nome: 'Farmácia Central' },
    indicadorId: '1',
    indicador: { id: '1', nome: 'Taxa de Conversão de Vendas' },
    usuarioId: '1',
    usuario: { id: '1', nome: 'Ana Silva' },
    comentarios: []
  },
  {
    id: '5',
    url: 'https://via.placeholder.com/500x300?text=Registro+Incorreto',
    descricao: 'Tentativa de registro que não atende aos critérios',
    dataCriacao: '2025-04-12T10:30:00Z',
    status: 'REPROVADA',
    dataValidacao: '2025-04-13T09:15:00Z',
    validadoPor: { id: '3', nome: 'Roberto Almeida' },
    motivoReprovacao: 'A evidência não está relacionada diretamente às ações do plano. Por favor, envie uma evidência que demonstre o trabalho realizado.',
    planoId: '2',
    plano: { id: '2', titulo: 'Reduzir ruptura de estoque de medicamentos controlados' },
    farmaciaId: '2',
    farmacia: { id: '2', nome: 'Farmácia Saúde' },
    indicadorId: '2',
    indicador: { id: '2', nome: 'Índice de Ruptura de Estoque' },
    usuarioId: '3',
    usuario: { id: '3', nome: 'Roberto Almeida' },
    comentarios: [
      { id: '2', texto: 'Por favor, envie uma evidência mais específica do trabalho realizado.', data: '2025-04-13T09:15:00Z', usuario: { id: '3', nome: 'Roberto Almeida' } }
    ]
  },
  {
    
    id: '6',
    url: 'https://via.placeholder.com/500x300?text=Análise+de+Dados',
    descricao: 'Análise dos dados históricos de vendas para previsão de demanda',
    dataCriacao: '2025-04-11T13:45:00Z',
    status: 'PENDENTE',
    dataValidacao: null,
    validadoPor: null,
    motivoReprovacao: null,
    planoId: '2',
    plano: { id: '2', titulo: 'Reduzir ruptura de estoque de medicamentos controlados' },
    farmaciaId: '2',
    farmacia: { id: '2', nome: 'Farmácia Saúde' },
    indicadorId: '2',
    indicador: { id: '2', nome: 'Índice de Ruptura de Estoque' },
    usuarioId: '3',
    usuario: { id: '3', nome: 'Roberto Almeida' },
    comentarios: []
  }
];

export const useEvidencias = () => {
  const [evidencias, setEvidencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contadores, setContadores] = useState({
    pendentes: 0,
    aprovadas: 0,
    reprovadas: 0
  });
  
  const carregarEvidencias = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Para uma API real:
      // const response = await api.get('/evidencias');
      // setEvidencias(response.data);
      
      // Usando dados mockados:
      setEvidencias(mockEvidencias);
      
      // Calcular contadores
      const pendentes = mockEvidencias.filter(e => e.status === 'PENDENTE').length;
      const aprovadas = mockEvidencias.filter(e => e.status === 'APROVADA').length;
      const reprovadas = mockEvidencias.filter(e => e.status === 'REPROVADA').length;
      
      setContadores({
        pendentes,
        aprovadas,
        reprovadas
      });
    } catch (err) {
      console.error('Erro ao carregar evidências:', err);
      setError('Não foi possível carregar as evidências.');
    } finally {
      setLoading(false);
    }
  };
  
  const obterEvidenciaPorId = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      // Para uma API real:
      // const response = await api.get(`/evidencias/${id}`);
      // return response.data;
      
      // Usando dados mockados:
      const evidencia = mockEvidencias.find(e => e.id === id);
      return evidencia || null;
    } catch (err) {
      console.error(`Erro ao obter evidência ${id}:`, err);
      setError('Não foi possível obter os dados da evidência.');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const aprovarEvidencia = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      // Para uma API real:
      // const response = await api.put(`/evidencias/${id}/aprovar`);
      // return response.data;
      
      // Simulando aprovação:
      const evidencia = mockEvidencias.find(e => e.id === id);
      if (!evidencia) throw new Error('Evidência não encontrada');
      
      evidencia.status = 'APROVADA';
      evidencia.dataValidacao = new Date().toISOString();
      evidencia.validadoPor = { id: '1', nome: 'Usuário Logado' }; // Normalmente seria o usuário atual
      
      return evidencia;
    } catch (err) {
      console.error(`Erro ao aprovar evidência ${id}:`, err);
      setError('Não foi possível aprovar a evidência.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const reprovarEvidencia = async (id, motivo) => {
    setLoading(true);
    setError(null);
    
    try {
      // Para uma API real:
      // const response = await api.put(`/evidencias/${id}/reprovar`, { motivo });
      // return response.data;
      
      // Simulando reprovação:
      const evidencia = mockEvidencias.find(e => e.id === id);
      if (!evidencia) throw new Error('Evidência não encontrada');
      
      evidencia.status = 'REPROVADA';
      evidencia.dataValidacao = new Date().toISOString();
      evidencia.validadoPor = { id: '1', nome: 'Usuário Logado' }; // Normalmente seria o usuário atual
      evidencia.motivoReprovacao = motivo;
      
      return evidencia;
    } catch (err) {
      console.error(`Erro ao reprovar evidência ${id}:`, err);
      setError('Não foi possível reprovar a evidência.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const adicionarComentario = async (id, texto) => {
    setLoading(true);
    setError(null);
    
    try {
      // Para uma API real:
      // const response = await api.post(`/evidencias/${id}/comentarios`, { texto });
      // return response.data;
      
      // Simulando adição de comentário:
      const evidencia = mockEvidencias.find(e => e.id === id);
      if (!evidencia) throw new Error('Evidência não encontrada');
      
      const novoComentario = {
        id: String(evidencia.comentarios.length + 1),
        texto,
        data: new Date().toISOString(),
        usuario: { id: '1', nome: 'Usuário Logado' } // Normalmente seria o usuário atual
      };
      
      evidencia.comentarios.push(novoComentario);
      return novoComentario;
    } catch (err) {
      console.error(`Erro ao adicionar comentário à evidência ${id}:`, err);
      setError('Não foi possível adicionar o comentário.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    evidencias,
    loading,
    error,
    contadores,
    carregarEvidencias,
    obterEvidenciaPorId,
    aprovarEvidencia,
    reprovarEvidencia,
    adicionarComentario
  };
};
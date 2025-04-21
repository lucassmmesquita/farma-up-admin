// src/hooks/useAlertaMedicamentos.jsx
import { useState } from 'react';
import api from '../services/api';
import { addDays } from 'date-fns';

// Dados mockados para medicamentos contínuos
const mockMedicamentosContínuos = [
  {
    id: '1',
    codigo: 'MED001',
    nome: 'Losartana Potássica 50mg',
    tipo: 'COMUM',
    ultimaCompra: '2025-04-10',
    proximaCompra: '2025-04-25',
    duracaoDias: 30,
    farmaciaId: '1',
    farmacia: { id: '1', nome: 'Farmácia Central' },
    cliente: {
      id: '1',
      nome: 'Maria da Silva',
      telefone: '(11) 98765-4321',
      email: 'maria.silva@email.com'
    },
    lembreteEnviado: false
  },
  {
    id: '2',
    codigo: 'MED002',
    nome: 'Atorvastatina 20mg',
    tipo: 'COMUM',
    ultimaCompra: '2025-04-05',
    proximaCompra: '2025-05-05',
    duracaoDias: 30,
    farmaciaId: '1',
    farmacia: { id: '1', nome: 'Farmácia Central' },
    cliente: {
      id: '1',
      nome: 'Maria da Silva',
      telefone: '(11) 98765-4321',
      email: 'maria.silva@email.com'
    },
    lembreteEnviado: false
  },
  {
    id: '3',
    codigo: 'MED003',
    nome: 'Clonazepam 2mg',
    tipo: 'CONTROLADO',
    ultimaCompra: '2025-04-01',
    proximaCompra: '2025-05-01',
    duracaoDias: 30,
    farmaciaId: '2',
    farmacia: { id: '2', nome: 'Farmácia Saúde' },
    cliente: {
      id: '2',
      nome: 'João Pereira',
      telefone: '(11) 91234-5678',
      email: 'joao.pereira@email.com'
    },
    lembreteEnviado: true
  },
  {
    id: '4',
    codigo: 'MED004',
    nome: 'Insulina Glargina',
    tipo: 'COMUM',
    ultimaCompra: '2025-04-15',
    proximaCompra: '2025-04-30',
    duracaoDias: 15,
    farmaciaId: '1',
    farmacia: { id: '1', nome: 'Farmácia Central' },
    cliente: {
      id: '3',
      nome: 'Ana Oliveira',
      telefone: '(11) 95555-6666',
      email: 'ana.oliveira@email.com'
    },
    lembreteEnviado: false
  },
  {
    id: '5',
    codigo: 'MED005',
    nome: 'Levotiroxina 50mcg',
    tipo: 'COMUM',
    ultimaCompra: '2025-03-30',
    proximaCompra: '2025-04-29',
    duracaoDias: 30,
    farmaciaId: '3',
    farmacia: { id: '3', nome: 'Farmácia Bem Estar' },
    cliente: {
      id: '4',
      nome: 'Roberto Santos',
      telefone: '(11) 94444-3333',
      email: 'roberto.santos@email.com'
    },
    lembreteEnviado: false
  },
  {
    id: '6',
    codigo: 'MED006',
    nome: 'Amoxicilina 500mg',
    tipo: 'ANTIBIOTICO',
    ultimaCompra: '2025-04-18',
    proximaCompra: '2025-04-25',
    duracaoDias: 7,
    farmaciaId: '2',
    farmacia: { id: '2', nome: 'Farmácia Saúde' },
    cliente: {
      id: '5',
      nome: 'Carla Mendes',
      telefone: '(11) 93333-2222',
      email: 'carla.mendes@email.com'
    },
    lembreteEnviado: true
  },
  {
    id: '7',
    codigo: 'MED007',
    nome: 'Fluoxetina 20mg',
    tipo: 'CONTROLADO',
    ultimaCompra: '2025-04-05',
    proximaCompra: '2025-04-20',
    duracaoDias: 15,
    farmaciaId: '3',
    farmacia: { id: '3', nome: 'Farmácia Bem Estar' },
    cliente: {
      id: '6',
      nome: 'Paulo Sousa',
      telefone: '(11) 92222-1111',
      email: 'paulo.sousa@email.com'
    },
    lembreteEnviado: false
  }
];

export const useAlertaMedicamentos = () => {
  const [medicamentosContínuos, setMedicamentosContínuos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const carregarMedicamentosContínuos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Para uma API real:
      // const response = await api.get('/medicamentos-continuos');
      // setMedicamentosContínuos(response.data);
      
      // Usando dados mockados:
      setMedicamentosContínuos(mockMedicamentosContínuos);
    } catch (err) {
      console.error('Erro ao carregar medicamentos contínuos:', err);
      setError('Não foi possível carregar os medicamentos contínuos.');
    } finally {
      setLoading(false);
    }
  };
  
  const enviarLembrete = async (medicamentoId, dados) => {
    setLoading(true);
    setError(null);
    
    try {
      // Para uma API real:
      // const response = await api.post(`/medicamentos-continuos/${medicamentoId}/lembrete`, dados);
      // return response.data;
      
      // Simulando envio de lembrete:
      const medicamento = mockMedicamentosContínuos.find(m => m.id === medicamentoId);
      if (!medicamento) throw new Error('Medicamento não encontrado');
      
      medicamento.lembreteEnviado = true;
      
      // Atualizar estado
      setMedicamentosContínuos([...medicamentosContínuos]);
      
      return medicamento;
    } catch (err) {
      console.error(`Erro ao enviar lembrete para o medicamento ${medicamentoId}:`, err);
      setError('Não foi possível enviar o lembrete.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    medicamentosContínuos,
    loading,
    error,
    carregarMedicamentosContínuos,
    enviarLembrete
  };
};
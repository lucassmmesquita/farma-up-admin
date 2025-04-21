// src/hooks/useUsuarios.jsx
import { useState } from 'react';
import api from '../services/api';

// Dados mockados para os usuários
const mockUsuarios = [
  { id: '1', nome: 'Ana Silva', email: 'ana.silva@farmaup.com', perfil: 'Administrador', ativo: true },
  { id: '2', nome: 'Carlos Souza', email: 'carlos.souza@farmaup.com', perfil: 'Gestor de Farmácia', ativo: true },
  { id: '3', nome: 'Roberto Almeida', email: 'roberto.almeida@farmaup.com', perfil: 'Validador', ativo: true },
  { id: '4', nome: 'Patrícia Mendes', email: 'patricia.mendes@farmaup.com', perfil: 'Gestor de Farmácia', ativo: false }
];

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const carregarUsuarios = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Para uma API real:
      // const response = await api.get('/usuarios');
      // setUsuarios(response.data);
      
      // Usando dados mockados:
      setUsuarios(mockUsuarios);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      setError('Não foi possível carregar os usuários.');
    } finally {
      setLoading(false);
    }
  };
  
  const obterUsuarioPorId = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      // Para uma API real:
      // const response = await api.get(`/usuarios/${id}`);
      // return response.data;
      
      // Usando dados mockados:
      const usuario = mockUsuarios.find(u => u.id === id);
      return usuario || null;
    } catch (err) {
      console.error(`Erro ao obter usuário ${id}:`, err);
      setError('Não foi possível obter os dados do usuário.');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const salvarUsuario = async (usuario) => {
    setLoading(true);
    setError(null);
    
    try {
      if (usuario.id) {
        // Para uma API real:
        // const response = await api.put(`/usuarios/${usuario.id}`, usuario);
        // return response.data;
        
        // Simulando atualização:
        const index = mockUsuarios.findIndex(u => u.id === usuario.id);
        if (index !== -1) {
          mockUsuarios[index] = {
            ...mockUsuarios[index],
            ...usuario
          };
        }
        return mockUsuarios[index];
      } else {
        // Para uma API real:
        // const response = await api.post('/usuarios', usuario);
        // return response.data;
        
        // Simulando criação:
        const novoUsuario = {
          ...usuario,
          id: String(mockUsuarios.length + 1)
        };
        mockUsuarios.push(novoUsuario);
        return novoUsuario;
      }
    } catch (err) {
      console.error('Erro ao salvar usuário:', err);
      setError('Não foi possível salvar o usuário.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const listarUsuarios = async () => {
    return mockUsuarios;
  };
  
  return {
    usuarios,
    loading,
    error,
    carregarUsuarios,
    obterUsuarioPorId,
    salvarUsuario,
    listarUsuarios
  };
};
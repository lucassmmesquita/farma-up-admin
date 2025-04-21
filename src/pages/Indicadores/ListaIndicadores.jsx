// src/pages/Indicadores/ListaIndicadores.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Chip,
  TextField, InputAdornment
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Search as SearchIcon, BubbleChart as BubbleChartIcon
} from '@mui/icons-material';
import { useIndicadores } from '../../hooks/useIndicadores';

const ListaIndicadores = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const { indicadores, carregarIndicadores } = useIndicadores();
  
  useEffect(() => {
    carregarIndicadores();
  }, []);
  
  const indicadoresFiltrados = indicadores.filter(
    ind => ind.nome.toLowerCase().includes(busca.toLowerCase()) ||
           ind.codigo.toLowerCase().includes(busca.toLowerCase())
  );
  
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Indicadores</Typography>
        <Box>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<BubbleChartIcon />}
            onClick={() => navigate('/indicadores/grafo')}
            sx={{ mr: 2 }}
          >
            Ver Grafo de Relacionamentos
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/indicadores/novo')}
          >
            Novo Indicador
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por nome ou código..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Unidade</TableCell>
                <TableCell>Meta</TableCell>
                <TableCell>Relacionamentos</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {indicadoresFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Nenhum indicador encontrado
                  </TableCell>
                </TableRow>
              ) : (
                indicadoresFiltrados.map((indicador) => (
                  <TableRow key={indicador.id}>
                    <TableCell>{indicador.codigo}</TableCell>
                    <TableCell>{indicador.nome}</TableCell>
                    <TableCell>{indicador.categoria}</TableCell>
                    <TableCell>{indicador.unidade}</TableCell>
                    <TableCell>{indicador.metaPadrao}</TableCell>
                    <TableCell>
                      {indicador.indicadoresRelacionados?.length > 0 ? (
                        <Chip 
                          label={`${indicador.indicadoresRelacionados.length} relacionado(s)`} 
                          color="primary" 
                          size="small" 
                        />
                      ) : (
                        <Chip 
                          label="Nenhum" 
                          color="default" 
                          size="small" 
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="primary" 
                        onClick={() => navigate(`/indicadores/editar/${indicador.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error"
                        onClick={() => {/* Mostrar confirmação */}}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default ListaIndicadores;
// src/pages/Farmacias/ListaFarmacias.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Chip,
  TextField, InputAdornment, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Search as SearchIcon, Colorize as ColorizeIcon
} from '@mui/icons-material';
import { useFarmacias } from '../../hooks/useFarmacias';

const ListaFarmacias = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { farmacias, carregarFarmacias, excluirFarmacia } = useFarmacias();
  
  useEffect(() => {
    carregarFarmacias();
  }, []);
  
  const handleExcluir = (id) => {
    setConfirmDelete(id);
  };
  
  const confirmarExclusao = async () => {
    if (confirmDelete) {
      await excluirFarmacia(confirmDelete);
      setConfirmDelete(null);
    }
  };
  
  const cancelarExclusao = () => {
    setConfirmDelete(null);
  };
  
  const farmaciasFiltradas = farmacias.filter(
    farm => farm.nome.toLowerCase().includes(busca.toLowerCase()) ||
            farm.cnpj.includes(busca)
  );
  
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Farmácias</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/farmacias/novo')}
        >
          Nova Farmácia
        </Button>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por nome ou CNPJ..."
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
                <TableCell>Nome</TableCell>
                <TableCell>CNPJ</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Usuários</TableCell>
                <TableCell>Cor Principal</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {farmaciasFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Nenhuma farmácia encontrada
                  </TableCell>
                </TableRow>
              ) : (
                farmaciasFiltradas.map((farmacia) => (
                  <TableRow key={farmacia.id}>
                    <TableCell>{farmacia.nome}</TableCell>
                    <TableCell>{farmacia.cnpj}</TableCell>
                    <TableCell>
                      <Chip 
                        label={farmacia.ativo ? "Ativo" : "Inativo"} 
                        color={farmacia.ativo ? "success" : "default"} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{farmacia.totalUsuarios}</TableCell>
                    <TableCell>
                      <Box 
                        sx={{ 
                          width: 24, 
                          height: 24, 
                          borderRadius: '50%', 
                          bgcolor: farmacia.corPrincipal || '#2E7D32',
                          border: '1px solid #ddd' 
                        }} 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="primary" 
                        onClick={() => navigate(`/farmacias/editar/${farmacia.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleExcluir(farmacia.id)}
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
      
      {/* Diálogo de confirmação de exclusão */}
      <Dialog
        open={Boolean(confirmDelete)}
        onClose={cancelarExclusao}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir esta farmácia? Esta ação não poderá ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelarExclusao}>Cancelar</Button>
          <Button onClick={confirmarExclusao} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListaFarmacias;
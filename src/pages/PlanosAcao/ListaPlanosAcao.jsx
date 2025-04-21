// src/pages/PlanosAcao/ListaPlanosAcao.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Chip,
  TextField, InputAdornment, Grid, Card, CardContent,
  Select, MenuItem, FormControl, InputLabel, TablePagination
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Visibility as VisibilityIcon,
  Search as SearchIcon, FilterList as FilterListIcon
} from '@mui/icons-material';
import { usePlanosAcao } from '../../hooks/usePlanosAcao';
import { useFarmacias } from '../../hooks/useFarmacias';
import { useIndicadores } from '../../hooks/useIndicadores';
import { format, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const getStatusColor = (status) => {
  switch (status) {
    case 'EM_ANDAMENTO':
      return 'primary';
    case 'CONCLUIDO':
      return 'success';
    case 'ATRASADO':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'EM_ANDAMENTO':
      return 'Em Andamento';
    case 'CONCLUIDO':
      return 'Concluído';
    case 'ATRASADO':
      return 'Atrasado';
    default:
      return status;
  }
};

const ListaPlanosAcao = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [filtros, setFiltros] = useState({
    farmacia: '',
    indicador: '',
    status: '',
    prazo: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const { planosAcao, carregarPlanosAcao, contadorStatus } = usePlanosAcao();
  const { farmacias, carregarFarmacias } = useFarmacias();
  const { indicadores, carregarIndicadores } = useIndicadores();
  
  useEffect(() => {
    const buscarDados = async () => {
      await Promise.all([
        carregarPlanosAcao(),
        carregarFarmacias(),
        carregarIndicadores()
      ]);
    };
    
    buscarDados();
  }, []);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros({
      ...filtros,
      [name]: value
    });
  };
  
  const limparFiltros = () => {
    setFiltros({
      farmacia: '',
      indicador: '',
      status: '',
      prazo: ''
    });
  };
  
  const filtrarPlanos = () => {
    return planosAcao.filter(plano => {
      // Aplicar busca por texto
      const matchBusca = 
        plano.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        plano.responsavel.nome.toLowerCase().includes(busca.toLowerCase()) ||
        plano.descricao.toLowerCase().includes(busca.toLowerCase());
      
      // Aplicar filtros
      const matchFarmacia = filtros.farmacia ? plano.farmaciaId === filtros.farmacia : true;
      const matchIndicador = filtros.indicador ? plano.indicadorId === filtros.indicador : true;
      const matchStatus = filtros.status ? plano.status === filtros.status : true;
      
      // Filtro por prazo
      let matchPrazo = true;
      if (filtros.prazo === 'hoje') {
        matchPrazo = format(new Date(plano.prazo), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
      } else if (filtros.prazo === 'atrasados') {
        matchPrazo = plano.status !== 'CONCLUIDO' && isAfter(new Date(), new Date(plano.prazo));
      } else if (filtros.prazo === 'proximos7dias') {
        const hoje = new Date();
        const em7Dias = new Date();
        em7Dias.setDate(hoje.getDate() + 7);
        const prazoDt = new Date(plano.prazo);
        matchPrazo = isAfter(prazoDt, hoje) && !isAfter(prazoDt, em7Dias);
      }
      
      return matchBusca && matchFarmacia && matchIndicador && matchStatus && matchPrazo;
    });
  };
  
  const planosFiltrados = filtrarPlanos();
  const planosExibidos = planosFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Planos de Ação</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/planos-acao/novo')}
        >
          Novo Plano de Ação
        </Button>
      </Box>
      
      {/* Cards de contadores */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total de Planos
              </Typography>
              <Typography variant="h3" color="text.primary">
                {planosAcao.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Em Andamento
              </Typography>
              <Typography variant="h3" color="primary">
                {contadorStatus.emAndamento || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Concluídos
              </Typography>
              <Typography variant="h3" color="success.main">
                {contadorStatus.concluidos || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Atrasados
              </Typography>
              <Typography variant="h3" color="error.main">
                {contadorStatus.atrasados || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Buscar planos de ação..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            sx={{ width: '70%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FilterListIcon />}
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            Filtros
          </Button>
        </Box>
        
        {mostrarFiltros && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Farmácia</InputLabel>
                  <Select
                    name="farmacia"
                    value={filtros.farmacia}
                    onChange={handleFiltroChange}
                    label="Farmácia"
                  >
                    <MenuItem value="">Todas</MenuItem>
                    {farmacias.map((farmacia) => (
                      <MenuItem key={farmacia.id} value={farmacia.id}>
                        {farmacia.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Indicador</InputLabel>
                  <Select
                    name="indicador"
                    value={filtros.indicador}
                    onChange={handleFiltroChange}
                    label="Indicador"
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {indicadores.map((indicador) => (
                      <MenuItem key={indicador.id} value={indicador.id}>
                        {indicador.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={filtros.status}
                    onChange={handleFiltroChange}
                    label="Status"
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="EM_ANDAMENTO">Em Andamento</MenuItem>
                    <MenuItem value="CONCLUIDO">Concluídos</MenuItem>
                    <MenuItem value="ATRASADO">Atrasados</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Prazo</InputLabel>
                  <Select
                    name="prazo"
                    value={filtros.prazo}
                    onChange={handleFiltroChange}
                    label="Prazo"
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="hoje">Hoje</MenuItem>
                    <MenuItem value="atrasados">Atrasados</MenuItem>
                    <MenuItem value="proximos7dias">Próximos 7 dias</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  variant="outlined"
                  onClick={limparFiltros}
                  fullWidth
                >
                  Limpar Filtros
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Indicador</TableCell>
                <TableCell>Farmácia</TableCell>
                <TableCell>Responsável</TableCell>
                <TableCell>Prazo</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Progresso</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {planosExibidos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Nenhum plano de ação encontrado
                  </TableCell>
                </TableRow>
              ) : (
                planosExibidos.map((plano) => (
                  <TableRow key={plano.id}>
                    <TableCell>{plano.titulo}</TableCell>
                    <TableCell>{plano.indicador?.nome}</TableCell>
                    <TableCell>{plano.farmacia?.nome}</TableCell>
                    <TableCell>{plano.responsavel?.nome}</TableCell>
                    <TableCell>
                      {format(new Date(plano.prazo), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(plano.status)}
                        color={getStatusColor(plano.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {plano.percentualConcluido}%
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="info"
                        onClick={() => navigate(`/planos-acao/${plano.id}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/planos-acao/editar/${plano.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={planosFiltrados.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Itens por página"
          />
        </TableContainer>
      </Paper>
    </>
  );
};

export default ListaPlanosAcao;
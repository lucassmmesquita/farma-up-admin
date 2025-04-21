// src/pages/Evidencias/ListaEvidencias.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Grid, Card, CardMedia,
  CardContent, CardActions, Chip, TextField, InputAdornment,
  FormControl, InputLabel, Select, MenuItem, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Pagination, CircularProgress, Badge
} from '@mui/material';
import {
  Search as SearchIcon, FilterList as FilterListIcon,
  CheckCircle as CheckCircleIcon, Cancel as CancelIcon,
  Visibility as VisibilityIcon, ImageSearch as ImageSearchIcon
} from '@mui/icons-material';
import { useEvidencias } from '../../hooks/useEvidencias';
import { useFarmacias } from '../../hooks/useFarmacias';
import { useIndicadores } from '../../hooks/useIndicadores';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDENTE':
      return 'warning';
    case 'APROVADA':
      return 'success';
    case 'REPROVADA':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'PENDENTE':
      return 'Pendente';
    case 'APROVADA':
      return 'Aprovada';
    case 'REPROVADA':
      return 'Reprovada';
    default:
      return status;
  }
};

const ListaEvidencias = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [filtros, setFiltros] = useState({
    farmacia: '',
    indicador: '',
    status: '',
    dataDe: '',
    dataAte: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [page, setPage] = useState(1);
  const [dialogImagem, setDialogImagem] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { evidencias, carregarEvidencias, contadores, aprovarEvidencia, reprovarEvidencia } = useEvidencias();
  const { farmacias, carregarFarmacias } = useFarmacias();
  const { indicadores, carregarIndicadores } = useIndicadores();
  
  const itemsPerPage = 12;
  
  useEffect(() => {
    const buscarDados = async () => {
      setLoading(true);
      try {
        await Promise.all([
          carregarEvidencias(),
          carregarFarmacias(),
          carregarIndicadores()
        ]);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    
    buscarDados();
  }, []);
  
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
      dataDe: '',
      dataAte: ''
    });
  };
  
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  const abrirDialogImagem = (evidencia) => {
    setDialogImagem(evidencia);
  };
  
  const fecharDialogImagem = () => {
    setDialogImagem(null);
  };
  
  const handleAprovar = async (id) => {
    try {
      await aprovarEvidencia(id);
      // Recarregar evidências para atualizar a lista
      await carregarEvidencias();
    } catch (error) {
      console.error("Erro ao aprovar evidência:", error);
    }
  };
  
  const handleReprovar = async (id, motivo = "Evidência não atende aos critérios") => {
    try {
      await reprovarEvidencia(id, motivo);
      // Recarregar evidências para atualizar a lista
      await carregarEvidencias();
    } catch (error) {
      console.error("Erro ao reprovar evidência:", error);
    }
  };
  
  const filtrarEvidencias = () => {
    return evidencias.filter(ev => {
      // Aplicar busca por texto
      const matchBusca = 
        ev.plano?.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        ev.usuario?.nome.toLowerCase().includes(busca.toLowerCase()) ||
        ev.descricao?.toLowerCase().includes(busca.toLowerCase());
      
      // Aplicar filtros
      const matchFarmacia = filtros.farmacia ? ev.farmaciaId === filtros.farmacia : true;
      const matchIndicador = filtros.indicador ? ev.indicadorId === filtros.indicador : true;
      const matchStatus = filtros.status ? ev.status === filtros.status : true;
      
      // Filtro por data
      let matchData = true;
      if (filtros.dataDe) {
        const dataDe = new Date(filtros.dataDe);
        matchData = matchData && new Date(ev.dataCriacao) >= dataDe;
      }
      
      if (filtros.dataAte) {
        const dataAte = new Date(filtros.dataAte);
        dataAte.setHours(23, 59, 59);
        matchData = matchData && new Date(ev.dataCriacao) <= dataAte;
      }
      
      return matchBusca && matchFarmacia && matchIndicador && matchStatus && matchData;
    });
  };
  
  const evidenciasFiltradas = filtrarEvidencias();
  const paginatedEvidencias = evidenciasFiltradas.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Validação de Evidências</Typography>
      </Box>
      
      {/* Cards de contadores */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Evidências Pendentes
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Badge
                  badgeContent={contadores?.pendentes || 0}
                  color="warning"
                  sx={{ '& .MuiBadge-badge': { fontSize: 18, height: 30, width: 30, borderRadius: '50%' } }}
                >
                  <ImageSearchIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                </Badge>
                <Typography variant="h4" color="warning.main">
                  {contadores?.pendentes || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Evidências Aprovadas
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Badge
                  badgeContent={contadores?.aprovadas || 0}
                  color="success"
                  sx={{ '& .MuiBadge-badge': { fontSize: 18, height: 30, width: 30, borderRadius: '50%' } }}
                >
                  <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                </Badge>
                <Typography variant="h4" color="success.main">
                  {contadores?.aprovadas || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Evidências Reprovadas
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Badge
                  badgeContent={contadores?.reprovadas || 0}
                  color="error"
                  sx={{ '& .MuiBadge-badge': { fontSize: 18, height: 30, width: 30, borderRadius: '50%' } }}
                >
                  <CancelIcon sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                </Badge>
                <Typography variant="h4" color="error.main">
                  {contadores?.reprovadas || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Buscar evidências..."
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
                    <MenuItem value="PENDENTE">Pendentes</MenuItem>
                    <MenuItem value="APROVADA">Aprovadas</MenuItem>
                    <MenuItem value="REPROVADA">Reprovadas</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  name="dataDe"
                  label="De"
                  type="date"
                  value={filtros.dataDe}
                  onChange={handleFiltroChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  name="dataAte"
                  label="Até"
                  type="date"
                  value={filtros.dataAte}
                  onChange={handleFiltroChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
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
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {paginatedEvidencias.length === 0 ? (
              <Box sx={{ textAlign: 'center', p: 5 }}>
                <ImageSearchIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Nenhuma evidência encontrada
                </Typography>
                <Typography color="text.secondary">
                  Tente ajustar os filtros ou a busca para encontrar evidências.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {paginatedEvidencias.map((evidencia) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={evidencia.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box
                        sx={{
                          position: 'relative',
                          pt: '56.25%', // 16:9 aspect ratio
                          cursor: 'pointer'
                        }}
                        onClick={() => abrirDialogImagem(evidencia)}
                      >
                        <CardMedia
                          component="img"
                          image={evidencia.url}
                          alt={`Evidência ${evidencia.id}`}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8
                          }}
                        >
                          <Chip
                            label={getStatusLabel(evidencia.status)}
                            color={getStatusColor(evidencia.status)}
                            size="small"
                          />
                        </Box>
                      </Box>
                      
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Plano: {evidencia.plano?.titulo}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Farmácia: {evidencia.farmacia?.nome}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Enviado por: {evidencia.usuario?.nome}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Data: {format(new Date(evidencia.dataCriacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </Typography>
                        {evidencia.descricao && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {evidencia.descricao}
                          </Typography>
                        )}
                      </CardContent>
                      
                      <CardActions sx={{ justifyContent: 'space-between', p: 1 }}>
                        <IconButton
                          color="info"
                          onClick={() => navigate(`/evidencias/${evidencia.id}`)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        {evidencia.status === 'PENDENTE' && (
                          <Box>
                            <IconButton
                              color="success"
                              onClick={() => handleAprovar(evidencia.id)}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleReprovar(evidencia.id)}
                            >
                              <CancelIcon />
                            </IconButton>
                          </Box>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={Math.ceil(evidenciasFiltradas.length / itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}
      </Paper>
      
      {/* Dialog para exibir imagem em tamanho maior */}
      <Dialog
        open={!!dialogImagem}
        onClose={fecharDialogImagem}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogImagem?.plano?.titulo}
          <Typography variant="body2" color="text.secondary">
            {dialogImagem?.farmacia?.nome} - {dialogImagem?.usuario?.nome}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 1 }}>
          {dialogImagem && (
            <img
              src={dialogImagem.url}
              alt="Evidência"
              style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain' }}
            />
          )}
          {dialogImagem?.descricao && (
            <Typography variant="body2" sx={{ p: 2 }}>
              {dialogImagem.descricao}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          {dialogImagem?.status === 'PENDENTE' && (
            <>
              <Button 
                onClick={() => {
                  handleAprovar(dialogImagem.id);
                  fecharDialogImagem();
                }} 
                color="success" 
                startIcon={<CheckCircleIcon />}
              >
                Aprovar
              </Button>
              <Button 
                onClick={() => {
                  handleReprovar(dialogImagem.id);
                  fecharDialogImagem();
                }} 
                color="error" 
                startIcon={<CancelIcon />}
              >
                Reprovar
              </Button>
            </>
          )}
          <Button onClick={fecharDialogImagem}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListaEvidencias;
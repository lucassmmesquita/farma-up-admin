// src/pages/PlanosAcao/FormPlanoAcao.jsx (Versão refatorada com novos estilos)
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, Paper, Grid,
  InputLabel, MenuItem, Divider,
  List, ListItem, ListItemText, 
  ListItemSecondaryAction, IconButton,
  Dialog, DialogTitle, DialogContent,
  DialogActions, DialogContentText,
  InputAdornment, CircularProgress, Select
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowBack, Add as AddIcon, Delete as DeleteIcon,
  Save as SaveIcon, Assignment, Person, Business,
  BarChart, CalendarToday
} from '@mui/icons-material';
import { usePlanosAcao } from '../../hooks/usePlanosAcao';
import { useFarmacias } from '../../hooks/useFarmacias';
import { useIndicadores } from '../../hooks/useIndicadores';
import { useUsuarios } from '../../hooks/useUsuarios';
import { 
  StyledTextField, StyledSelect, StyledButton, SectionTitle 
} from '../../components/common/FormElements';

const FormPlanoAcao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erros, setErros] = useState({});
  const [dialogNovaAcao, setDialogNovaAcao] = useState(false);
  const [novaAcao, setNovaAcao] = useState({
    descricao: '',
    prazo: null
  });
  
  const [plano, setPlano] = useState({
    titulo: '',
    descricao: '',
    farmaciaId: '',
    indicadorId: '',
    responsavelId: '',
    prazo: null,
    acoes: []
  });
  
  const { obterPlanoPorId, salvarPlano } = usePlanosAcao();
  const { farmacias, carregarFarmacias } = useFarmacias();
  const { indicadores, carregarIndicadores } = useIndicadores();
  const { usuarios, carregarUsuarios } = useUsuarios();
  
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        await Promise.all([
          carregarFarmacias(),
          carregarIndicadores(),
          carregarUsuarios()
        ]);
        
        if (id) {
          const dadosPlano = await obterPlanoPorId(id);
          
          setPlano({
            ...dadosPlano,
            farmaciaId: dadosPlano.farmaciaId || '',
            indicadorId: dadosPlano.indicadorId || '',
            responsavelId: dadosPlano.responsavelId || '',
            prazo: dadosPlano.prazo ? new Date(dadosPlano.prazo) : null,
            acoes: dadosPlano.acoes?.map(acao => ({
              ...acao,
              prazo: new Date(acao.prazo)
            })) || []
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, [id]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlano({ ...plano, [name]: value });
    
    // Limpar erro do campo
    if (erros[name]) {
      setErros({ ...erros, [name]: null });
    }
  };
  
  const handleDateChange = (date) => {
    setPlano({ ...plano, prazo: date });
    
    // Limpar erro do campo
    if (erros.prazo) {
      setErros({ ...erros, prazo: null });
    }
  };
  
  const abrirDialogNovaAcao = () => {
    setNovaAcao({
      descricao: '',
      prazo: null
    });
    setDialogNovaAcao(true);
  };
  
  const fecharDialogNovaAcao = () => {
    setDialogNovaAcao(false);
  };
  
  const handleNovaAcaoChange = (e) => {
    const { name, value } = e.target;
    setNovaAcao({ ...novaAcao, [name]: value });
  };
  
  const handleNovaAcaoDateChange = (date) => {
    setNovaAcao({ ...novaAcao, prazo: date });
  };
  
  const adicionarAcao = () => {
    if (!novaAcao.descricao || !novaAcao.prazo) return;
    
    setPlano({
      ...plano,
      acoes: [
        ...plano.acoes,
        {
          ...novaAcao,
          concluida: false,
          atrasada: false
        }
      ]
    });
    
    fecharDialogNovaAcao();
  };
  
  const removerAcao = (index) => {
    setPlano({
      ...plano,
      acoes: plano.acoes.filter((_, i) => i !== index)
    });
  };
  
  const validarFormulario = () => {
    const novosErros = {};
    
    if (!plano.titulo) {
      novosErros.titulo = 'O título é obrigatório';
    }
    
    if (!plano.descricao) {
      novosErros.descricao = 'A descrição é obrigatória';
    }
    
    if (!plano.farmaciaId) {
      novosErros.farmaciaId = 'Selecione uma farmácia';
    }
    
    if (!plano.indicadorId) {
      novosErros.indicadorId = 'Selecione um indicador';
    }
    
    if (!plano.responsavelId) {
      novosErros.responsavelId = 'Selecione um responsável';
    }
    
    if (!plano.prazo) {
      novosErros.prazo = 'Defina um prazo';
    }
    
    if (plano.acoes.length === 0) {
      novosErros.acoes = 'Adicione pelo menos uma ação';
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }
    
    setSalvando(true);
    
    try {
      await salvarPlano(plano);
      navigate('/planos-acao');
    } catch (error) {
      console.error("Erro ao salvar plano:", error);
      // Exibir mensagem de erro
    } finally {
      setSalvando(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton
          onClick={() => navigate('/planos-acao')}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {id ? 'Editar Plano de Ação' : 'Novo Plano de Ação'}
        </Typography>
      </Box>
      
      <Paper 
        component="form"
        onSubmit={handleSubmit}
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}
      >
        <Box sx={{ p: 3 }}>
          <SectionTitle>Informações Gerais</SectionTitle>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledTextField
                name="titulo"
                label="Título do Plano de Ação"
                value={plano.titulo}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!erros.titulo}
                helperText={erros.titulo}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Assignment />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <StyledTextField
                name="descricao"
                label="Descrição"
                value={plano.descricao}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                required
                error={!!erros.descricao}
                helperText={erros.descricao}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <StyledSelect fullWidth error={!!erros.farmaciaId}>
                <InputLabel>Farmácia</InputLabel>
                <Select
                  name="farmaciaId"
                  value={plano.farmaciaId}
                  onChange={handleInputChange}
                  label="Farmácia"
                  required
                  startAdornment={
                    <InputAdornment position="start">
                      <Business />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">Selecione</MenuItem>
                  {farmacias.map((farmacia) => (
                    <MenuItem key={farmacia.id} value={farmacia.id}>
                      {farmacia.nome}
                    </MenuItem>
                  ))}
                </Select>
                {erros.farmaciaId && (
                  <Typography variant="caption" color="error">
                    {erros.farmaciaId}
                  </Typography>
                )}
              </StyledSelect>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <StyledSelect fullWidth error={!!erros.indicadorId}>
                <InputLabel>Indicador</InputLabel>
                <Select
                  name="indicadorId"
                  value={plano.indicadorId}
                  onChange={handleInputChange}
                  label="Indicador"
                  required
                  startAdornment={
                    <InputAdornment position="start">
                      <BarChart />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">Selecione</MenuItem>
                  {indicadores.map((indicador) => (
                    <MenuItem key={indicador.id} value={indicador.id}>
                      {indicador.nome}
                    </MenuItem>
                  ))}
                </Select>
                {erros.indicadorId && (
                  <Typography variant="caption" color="error">
                    {erros.indicadorId}
                  </Typography>
                )}
              </StyledSelect>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <StyledSelect fullWidth error={!!erros.responsavelId}>
                <InputLabel>Responsável</InputLabel>
                <Select
                  name="responsavelId"
                  value={plano.responsavelId}
                  onChange={handleInputChange}
                  label="Responsável"
                  required
                  startAdornment={
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">Selecione</MenuItem>
                  {usuarios.map((usuario) => (
                    <MenuItem key={usuario.id} value={usuario.id}>
                      {usuario.nome}
                    </MenuItem>
                  ))}
                </Select>
                {erros.responsavelId && (
                  <Typography variant="caption" color="error">
                    {erros.responsavelId}
                  </Typography>
                )}
              </StyledSelect>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Prazo"
                value={plano.prazo}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!erros.prazo,
                    helperText: erros.prazo,
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday />
                        </InputAdornment>
                      ),
                    },
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(0,0,0,0.02)',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.03)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#fff',
                          boxShadow: '0 0 0 2px rgba(46, 125, 50, 0.2)',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        padding: '14px 16px 14px 48px',
                      },
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <SectionTitle>Ações Planejadas</SectionTitle>
            <StyledButton
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={abrirDialogNovaAcao}
            >
              Adicionar Ação
            </StyledButton>
          </Box>
          
          {erros.acoes && (
            <Typography variant="caption" color="error" sx={{ display: 'block', mb: 2 }}>
              {erros.acoes}
            </Typography>
          )}
          
          <Paper 
            elevation={0} 
            sx={{ 
              bgcolor: 'background.default', 
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <List sx={{ p: 0 }}>
              {plano.acoes.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary="Nenhuma ação planejada cadastrada"
                    primaryTypographyProps={{ color: 'text.secondary', textAlign: 'center' }}
                  />
                </ListItem>
              ) : (
                plano.acoes.map((acao, index) => (
                  <ListItem 
                    key={index} 
                    divider={index < plano.acoes.length - 1}
                    sx={{ 
                      py: 2,
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.02)'
                      }
                    }}
                  >
                    <ListItemText
                      primary={acao.descricao}
                      secondary={acao.prazo ? `Prazo: ${acao.prazo.toLocaleDateString('pt-BR')}` : ''}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => removerAcao(index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Box>
        
        <Divider />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 3 }}>
          <StyledButton
            onClick={() => navigate('/planos-acao')}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancelar
          </StyledButton>
          <StyledButton
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={salvando}
          >
            {salvando ? <CircularProgress size={24} /> : 'Salvar'}
          </StyledButton>
        </Box>
      </Paper>
      
      {/* Dialog para adicionar nova ação */}
      <Dialog 
        open={dialogNovaAcao} 
        onClose={fecharDialogNovaAcao}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle>Adicionar Nova Ação</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Informe os detalhes da ação a ser realizada.
          </DialogContentText>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledTextField
                name="descricao"
                label="Descrição da Ação"
                value={novaAcao.descricao}
                onChange={handleNovaAcaoChange}
                fullWidth
                required
                autoFocus
              />
            </Grid>
            
            <Grid item xs={12}>
              <DatePicker
                label="Prazo"
                value={novaAcao.prazo}
                onChange={handleNovaAcaoDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(0,0,0,0.02)',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.03)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#fff',
                          boxShadow: '0 0 0 2px rgba(46, 125, 50, 0.2)',
                        },
                      }
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <StyledButton onClick={fecharDialogNovaAcao} variant="outlined">
            Cancelar
          </StyledButton>
          <StyledButton 
            onClick={adicionarAcao} 
            variant="contained" 
            color="primary"
            disabled={!novaAcao.descricao || !novaAcao.prazo}
          >
            Adicionar
          </StyledButton>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default FormPlanoAcao;
// src/pages/Evidencias/DetalhesEvidencia.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Grid, Card, CardContent,
  Chip, Divider, TextField, CircularProgress, List,
  ListItem, ListItemAvatar, ListItemText, Avatar, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import {
  ArrowBack, CheckCircle as CheckCircleIcon, Cancel as CancelIcon,
  Comment as CommentIcon, Person as PersonIcon
} from '@mui/icons-material';
import { useEvidencias } from '../../hooks/useEvidencias';
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

const DetalhesEvidencia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [evidencia, setEvidencia] = useState(null);
  const [comentario, setComentario] = useState('');
  const [dialogReprovar, setDialogReprovar] = useState(false);
  const [motivoReprovacao, setMotivoReprovacao] = useState('');
  
  const { obterEvidenciaPorId, aprovarEvidencia, reprovarEvidencia, adicionarComentario } = useEvidencias();
  
  useEffect(() => {
    const carregarEvidencia = async () => {
      setLoading(true);
      try {
        const dados = await obterEvidenciaPorId(id);
        setEvidencia(dados);
      } catch (error) {
        console.error("Erro ao carregar evidência:", error);
      } finally {
        setLoading(false);
      }
    };
    
    carregarEvidencia();
  }, [id]);
  
  const handleAprovar = async () => {
    try {
      await aprovarEvidencia(id);
      // Recarregar evidência
      const dadosAtualizados = await obterEvidenciaPorId(id);
      setEvidencia(dadosAtualizados);
    } catch (error) {
      console.error("Erro ao aprovar evidência:", error);
    }
  };
  
  const abrirDialogReprovar = () => {
    setDialogReprovar(true);
  };
  
  const fecharDialogReprovar = () => {
    setDialogReprovar(false);
    setMotivoReprovacao('');
  };
  
  const handleReprovar = async () => {
    try {
      await reprovarEvidencia(id, motivoReprovacao);
      // Recarregar evidência
      const dadosAtualizados = await obterEvidenciaPorId(id);
      setEvidencia(dadosAtualizados);
      fecharDialogReprovar();
    } catch (error) {
      console.error("Erro ao reprovar evidência:", error);
    }
  };
  
  const handleComentarioSubmit = async (e) => {
    e.preventDefault();
    if (comentario.trim()) {
      await adicionarComentario(id, comentario);
      setComentario('');
      
      // Recarregar evidência para mostrar o novo comentário
      const dadosAtualizados = await obterEvidenciaPorId(id);
      setEvidencia(dadosAtualizados);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!evidencia) {
    return (
      <Box sx={{ textAlign: 'center', p: 5 }}>
        <Typography variant="h6" color="text.secondary">
          Evidência não encontrada.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/evidencias')}
          sx={{ mt: 2 }}
        >
          Voltar para a lista
        </Button>
      </Box>
    );
  }
  
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/evidencias')}
          sx={{ mr: 2 }}
        >
          Voltar
        </Button>
        <Typography variant="h5">
          Detalhes da Evidência
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {evidencia.status === 'PENDENTE' && (
          <>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={handleAprovar}
              sx={{ mr: 2 }}
            >
              Aprovar
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<CancelIcon />}
              onClick={abrirDialogReprovar}
            >
              Reprovar
            </Button>
          </>
        )}
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <img
                src={evidencia.url}
                alt="Evidência"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '500px', 
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
            </Box>
            
            {evidencia.descricao && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Descrição
                  </Typography>
                  <Typography variant="body1">
                    {evidencia.descricao}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informações da Evidência
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={getStatusLabel(evidencia.status)}
                  color={getStatusColor(evidencia.status)}
                  sx={{ mt: 0.5 }}
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Plano de Ação
                </Typography>
                <Typography variant="body1">
                  {evidencia.plano?.titulo || 'N/A'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Farmácia
                </Typography>
                <Typography variant="body1">
                  {evidencia.farmacia?.nome || 'N/A'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Indicador
                </Typography>
                <Typography variant="body1">
                  {evidencia.indicador?.nome || 'N/A'}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Enviado por
                </Typography>
                <Typography variant="body1">
                  {evidencia.usuario?.nome || 'N/A'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Data de Envio
                </Typography>
                <Typography variant="body1">
                  {format(new Date(evidencia.dataCriacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </Typography>
              </Box>
              
              {evidencia.dataValidacao && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Data de Validação
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(evidencia.dataValidacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </Typography>
                </Box>
              )}
              
              {evidencia.validadoPor && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Validado por
                  </Typography>
                  <Typography variant="body1">
                    {evidencia.validadoPor.nome}
                  </Typography>
                </Box>
              )}
              
              {evidencia.motivoReprovacao && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Motivo da Reprovação
                  </Typography>
                  <Typography variant="body1" color="error.main">
                    {evidencia.motivoReprovacao}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Comentários
              </Typography>
              
              <List>
                {evidencia.comentarios?.length > 0 ? (
                  evidencia.comentarios.map((comentario, index) => (
                    <ListItem 
                      key={index}
                      alignItems="flex-start"
                      divider={index < evidencia.comentarios.length - 1}
                      sx={{ px: 1, py: 1.5 }}
                    >                     
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle2">
                              {comentario.usuario.nome}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {format(new Date(comentario.data), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </Typography>
                          </Box>
                        }
                        secondary={comentario.texto}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText
                      primary="Nenhum comentário"
                      primaryTypographyProps={{ color: 'text.secondary', textAlign: 'center' }}
                    />
                  </ListItem>
                )}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <form onSubmit={handleComentarioSubmit}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder="Adicionar comentário..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<CommentIcon />}
                  disabled={!comentario.trim()}
                  fullWidth
                >
                  Comentar
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Dialog para confirmação de reprovação */}
      <Dialog open={dialogReprovar} onClose={fecharDialogReprovar}>
        <DialogTitle>Reprovar Evidência</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Informe o motivo da reprovação. Este motivo será visível para o usuário que enviou a evidência.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Motivo da Reprovação"
            fullWidth
            multiline
            rows={4}
            value={motivoReprovacao}
            onChange={(e) => setMotivoReprovacao(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialogReprovar} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={handleReprovar} 
            color="error"
            disabled={!motivoReprovacao.trim()}
          >
            Reprovar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DetalhesEvidencia;
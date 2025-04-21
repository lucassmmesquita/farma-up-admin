// src/pages/PlanosAcao/DetalhesPlanoAcao.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Card, CardContent, Grid,
  Chip, Divider, List, ListItem, ListItemText, ListItemIcon,
  Avatar, IconButton, TextField, LinearProgress,
  ImageList, ImageListItem, Dialog, DialogContent, DialogActions,
  Tooltip, CircularProgress
} from '@mui/material';
import {
  ArrowBack, Assignment, CalendarToday, Person, Business,
  BarChart, Edit as EditIcon, Add as AddIcon, CheckCircle, 
  Error, Comment as CommentIcon, Image as ImageIcon, 
  AttachFile as AttachFileIcon, Delete as DeleteIcon
} from '@mui/icons-material';
import { usePlanosAcao } from '../../hooks/usePlanosAcao';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DetalhesPlanoAcao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [plano, setPlano] = useState(null);
  const [comentario, setComentario] = useState('');
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [dialogImagem, setDialogImagem] = useState(false);
  
  const { obterPlanoPorId, adicionarComentario, adicionarEvidencia } = usePlanosAcao();
  
  useEffect(() => {
    const buscarPlano = async () => {
      setLoading(true);
      try {
        const dadosPlano = await obterPlanoPorId(id);
        setPlano(dadosPlano);
      } catch (error) {
        console.error("Erro ao buscar plano:", error);
      } finally {
        setLoading(false);
      }
    };
    
    buscarPlano();
  }, [id]);
  
  const handleComentarioSubmit = async (e) => {
    e.preventDefault();
    if (comentario.trim()) {
      await adicionarComentario(id, comentario);
      setComentario('');
      
      // Recarregar plano para mostrar o novo comentário
      const dadosPlano = await obterPlanoPorId(id);
      setPlano(dadosPlano);
    }
  };
  
  const handleImagemClick = (imagem) => {
    setImagemSelecionada(imagem);
    setDialogImagem(true);
  };
  
  const fecharDialogImagem = () => {
    setDialogImagem(false);
    setImagemSelecionada(null);
  };
  
  // src/pages/PlanosAcao/DetalhesPlanoAcao.jsx (continuação)
  const handleEvidenciaSubmit = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('evidencia', file);
      formData.append('planoId', id);
      
      await adicionarEvidencia(id, formData);
      
      // Recarregar plano para mostrar a nova evidência
      const dadosPlano = await obterPlanoPorId(id);
      setPlano(dadosPlano);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!plano) {
    return (
      <Box sx={{ textAlign: 'center', p: 5 }}>
        <Typography variant="h6" color="text.secondary">
          Plano de ação não encontrado.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/planos-acao')}
          sx={{ mt: 2 }}
        >
          Voltar para a lista
        </Button>
      </Box>
    );
  }
  
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
  
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/planos-acao')}
          sx={{ mr: 2 }}
        >
          Voltar
        </Button>
        <Typography variant="h5">
          Detalhes do Plano de Ação
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/planos-acao/editar/${id}`)}
        >
          Editar
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <Assignment />
              </Avatar>
              <Typography variant="h6">{plano.titulo}</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              {plano.descricao}
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Criado em:</strong><br />
                    {format(new Date(plano.dataCriacao), 'dd/MM/yyyy', { locale: ptBR })}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Prazo:</strong><br />
                    {format(new Date(plano.prazo), 'dd/MM/yyyy', { locale: ptBR })}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Responsável:</strong><br />
                    {plano.responsavel?.nome}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Business fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Farmácia:</strong><br />
                    {plano.farmacia?.nome}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BarChart fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  <strong>Indicador:</strong> {plano.indicador?.nome}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2">
                  <strong>Status:</strong>{' '}
                  <Chip
                    label={getStatusLabel(plano.status)}
                    color={getStatusColor(plano.status)}
                    size="small"
                  />
                </Typography>
                <Typography variant="body2">
                  <strong>Progresso:</strong> {plano.percentualConcluido}%
                </Typography>
              </Box>
              
              <LinearProgress 
                variant="determinate" 
                value={plano.percentualConcluido} 
                color={getStatusColor(plano.status)}
                sx={{ mt: 1, height: 8, borderRadius: 1 }}
              />
            </Box>
          </Paper>
          
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ações Planejadas
            </Typography>
            
            <List>
              {plano.acoes?.map((acao, index) => (
                <ListItem 
                  key={index}
                  divider={index < plano.acoes.length - 1}
                  sx={{ px: 2, py: 1 }}
                >
                  <ListItemIcon>
                    {acao.concluida ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Error color={acao.atrasada ? "error" : "disabled"} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={acao.descricao}
                    secondary={`Prazo: ${format(new Date(acao.prazo), 'dd/MM/yyyy', { locale: ptBR })}`}
                  />
                </ListItem>
              ))}
              
              {plano.acoes?.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="Nenhuma ação planejada cadastrada"
                    primaryTypographyProps={{ color: 'text.secondary' }}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
          
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Evidências
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                component="label"
              >
                Adicionar Evidência
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleEvidenciaSubmit}
                />
              </Button>
            </Box>
            
            {plano.evidencias?.length > 0 ? (
              <ImageList cols={3} gap={8}>
                {plano.evidencias.map((evidencia, index) => (
                  <ImageListItem 
                    key={index}
                    sx={{ 
                      cursor: 'pointer',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}
                    onClick={() => handleImagemClick(evidencia)}
                  >
                    <img
                      src={evidencia.url}
                      alt={`Evidência ${index + 1}`}
                      loading="lazy"
                      style={{ height: '120px', objectFit: 'cover' }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ImageIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.secondary">
                  Nenhuma evidência cadastrada
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Histórico de Comentários
            </Typography>
            
            <List sx={{ mb: 2 }}>
              {plano.comentarios?.map((comentario, index) => (
                <ListItem 
                  key={index}
                  alignItems="flex-start"
                  divider={index < plano.comentarios.length - 1}
                  sx={{ px: 1, py: 2 }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                      {comentario.usuario.nome.charAt(0)}
                    </Avatar>
                  </ListItemIcon>
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
              ))}
              
              {plano.comentarios?.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="Nenhum comentário"
                    primaryTypographyProps={{ color: 'text.secondary', textAlign: 'center' }}
                  />
                </ListItem>
              )}
            </List>
            
            <Divider sx={{ mb: 2 }} />
            
            <form onSubmit={handleComentarioSubmit}>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Adicione um comentário..."
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
          </Paper>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Arquivos Anexos
              </Typography>
              
              {plano.anexos?.length > 0 ? (
                <List>
                  {plano.anexos.map((anexo, index) => (
                    <ListItem
                      key={index}
                      divider={index < plano.anexos.length - 1}
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        <AttachFileIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={anexo.nome}
                        secondary={`${anexo.tipo} - ${anexo.tamanho}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <AttachFileIcon sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
                  <Typography color="text.secondary">
                    Nenhum arquivo anexado
                  </Typography>
                </Box>
              )}
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AddIcon />}
                component="label"
                sx={{ mt: 2 }}
              >
                Adicionar Arquivo
                <input
                  type="file"
                  hidden
                  // onChange={handleAnexoSubmit}
                />
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Dialog para exibir imagem em tamanho maior */}
      <Dialog
        open={dialogImagem}
        onClose={fecharDialogImagem}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 1 }}>
          {imagemSelecionada && (
            <img
              src={imagemSelecionada.url}
              alt="Evidência"
              style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialogImagem}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DetalhesPlanoAcao;
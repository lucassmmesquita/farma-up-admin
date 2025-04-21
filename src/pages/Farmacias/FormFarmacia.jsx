// src/pages/Farmacias/FormFarmacia.jsx (Versão refatorada com novos estilos)
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, Paper, Grid, 
  InputLabel, MenuItem, Divider, InputAdornment,
  Card, CardContent, CardMedia, IconButton, Avatar,
  CircularProgress
} from '@mui/material';
import { ArrowBack, Upload as UploadIcon, Delete as DeleteIcon, Business, Email, Phone, LocationOn } from '@mui/icons-material';
import { MuiColorInput } from 'mui-color-input';
import { useFarmacias } from '../../hooks/useFarmacias';
import { useUsuarios } from '../../hooks/useUsuarios';
import { 
  StyledTextField, 
  StyledSelect, 
  StyledButton, 
  SectionTitle 
} from '../../components/common/FormElements';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`farmacia-tabpanel-${index}`}
      aria-labelledby={`farmacia-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const FormFarmacia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [farmacia, setFarmacia] = useState({
    nome: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: '',
    corPrincipal: '#2E7D32',
    corSecundaria: '#FF5722',
    ativo: true,
    logo: null,
    usuariosAssociados: []
  });
  
  const { obterFarmaciaPorId, salvarFarmacia } = useFarmacias();
  const { listarUsuarios } = useUsuarios();
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosSelecionados, setUsuariosSelecionados] = useState([]);
  
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        // Carregar usuários para associação
        const dadosUsuarios = await listarUsuarios();
        setUsuarios(dadosUsuarios);
        
        // Se for edição, carregar dados da farmácia
        if (id) {
          const dadosFarmacia = await obterFarmaciaPorId(id);
          setFarmacia(dadosFarmacia);
          setUsuariosSelecionados(dadosFarmacia.usuariosAssociados || []);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, [id]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFarmacia({
      ...farmacia,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleColorChange = (name, color) => {
    setFarmacia({
      ...farmacia,
      [name]: color
    });
  };
  
  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setFarmacia({
          ...farmacia,
          logo: reader.result
        });
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveLogo = () => {
    setFarmacia({
      ...farmacia,
      logo: null
    });
  };
  
  const handleToggleUsuario = (usuarioId) => {
    if (usuariosSelecionados.includes(usuarioId)) {
      setUsuariosSelecionados(usuariosSelecionados.filter(id => id !== usuarioId));
    } else {
      setUsuariosSelecionados([...usuariosSelecionados, usuarioId]);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Preparar objeto com farmácia e usuários associados
      const dadosFarmacia = {
        ...farmacia,
        usuariosAssociados: usuariosSelecionados
      };
      
      await salvarFarmacia(dadosFarmacia);
      navigate('/farmacias');
    } catch (error) {
      console.error("Erro ao salvar farmácia:", error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !farmacia.nome) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton
          onClick={() => navigate('/farmacias')}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {id ? `Editar Farmácia: ${farmacia.nome}` : 'Nova Farmácia'}
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
        {/* Conteúdo da Tab "Dados Gerais" */}
        <Box sx={{ p: 3 }}>
          <SectionTitle>Dados Gerais</SectionTitle>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StyledTextField
                name="nome"
                label="Nome da Farmácia"
                value={farmacia.nome}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledTextField
                name="cnpj"
                label="CNPJ"
                value={farmacia.cnpj}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                name="endereco"
                label="Endereço"
                value={farmacia.endereco}
                onChange={handleInputChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledTextField
                name="telefone"
                label="Telefone"
                value={farmacia.telefone}
                onChange={handleInputChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledTextField
                name="email"
                label="E-mail"
                type="email"
                value={farmacia.email}
                onChange={handleInputChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4 }} />
          
          <SectionTitle>Identidade Visual</SectionTitle>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Logo da Farmácia
                  </Typography>
                  
                  {farmacia.logo ? (
                    <Box sx={{ position: 'relative', width: '100%', maxWidth: 300, mx: 'auto' }}>
                      <CardMedia
                        component="img"
                        height="150"
                        image={farmacia.logo}
                        alt="Logo da farmácia"
                        sx={{ objectFit: 'contain', mb: 2, borderRadius: 2 }}
                      />
                      <IconButton
                        color="error"
                        sx={{ position: 'absolute', top: 5, right: 5 }}
                        onClick={handleRemoveLogo}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        border: '2px dashed #ccc',
                        borderRadius: 2,
                        p: 3,
                        mb: 2
                      }}
                    >
                      <UploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Clique para selecionar ou arraste uma imagem
                      </Typography>
                      <StyledButton
                        component="label"
                        variant="contained"
                        startIcon={<UploadIcon />}
                      >
                        Selecionar Logo
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={handleLogoChange}
                        />
                      </StyledButton>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Cores da Marca
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Cor Principal
                    </Typography>
                    <MuiColorInput
                      value={farmacia.corPrincipal}
                      onChange={(color) => handleColorChange('corPrincipal', color)}
                      format="hex"
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Cor Secundária
                    </Typography>
                    <MuiColorInput
                      value={farmacia.corSecundaria}
                      onChange={(color) => handleColorChange('corSecundaria', color)}
                      format="hex"
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        
        <Divider />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 3 }}>
          <StyledButton
            onClick={() => navigate('/farmacias')}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancelar
          </StyledButton>
          <StyledButton
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Salvar'}
          </StyledButton>
        </Box>
      </Paper>
    </>
  );
};

export default FormFarmacia;
// src/components/common/StyledFormComponents.jsx
import React from 'react';
import { 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Button,
  Box,
  Typography,
  InputAdornment,
  FormHelperText,
  Chip,
  IconButton,
  Grid,
  Paper
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

// Campos de formulário estilizados
export const FormTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  '& .MuiOutlinedInput-root': {
    borderRadius: 10,
    transition: 'all 0.3s ease',
    backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.02),
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.08) : alpha(theme.palette.common.black, 0.03),
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.1) : alpha(theme.palette.common.white, 1),
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    fontSize: '0.95rem',
  },
  '& .MuiOutlinedInput-input': {
    padding: '14px 16px',
  },
}));

export const FormSelect = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  '& .MuiOutlinedInput-root': {
    borderRadius: 10,
    transition: 'all 0.3s ease',
    backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.02),
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.08) : alpha(theme.palette.common.black, 0.03),
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.1) : alpha(theme.palette.common.white, 1),
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    fontSize: '0.95rem',
  },
  '& .MuiSelect-select': {
    padding: '14px 16px',
  },
}));

export const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 10,
    transition: 'all 0.3s ease',
    backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.02),
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.08) : alpha(theme.palette.common.black, 0.03),
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.1) : alpha(theme.palette.common.white, 1),
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '12px 16px',
  },
}));

export const FormButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: '10px 22px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
}));

export const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.75rem',
  marginBottom: theme.spacing(3),
  color: theme.palette.text.primary,
  [theme.breakpoints.up('md')]: {
    fontSize: '2.125rem',
  },
}));

export const FormSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: 12,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
  },
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1.25rem',
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
}));

// Componente funcional para campo de busca com ícone e botão limpar
export const FilterSearchField = ({ value, onChange, placeholder, onClear }) => {
  return (
    <SearchField
      fullWidth
      variant="outlined"
      placeholder={placeholder || "Buscar..."}
      value={value}
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              aria-label="clear search"
              onClick={onClear}
              edge="end"
              size="small"
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
};

// Componente para filtros
export const FilterBar = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  marginBottom: theme.spacing(3),
  borderRadius: 12,
  backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.03) : alpha(theme.palette.common.black, 0.02),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

// Status chip com estilos melhorados
export const StatusChip = styled(Chip)(({ theme, color }) => ({
  borderRadius: 8,
  fontWeight: 600,
  fontSize: '0.75rem',
  paddingLeft: 2,
  paddingRight: 2,
}));

// Componente para conteúdo de formulário
export const FormContainer = ({ children, title, subtitle, onSubmit }) => {
  return (
    <Box 
      component="form" 
      onSubmit={onSubmit}
      noValidate 
      autoComplete="off"
      sx={{ width: '100%' }}
    >
      {title && <PageTitle>{title}</PageTitle>}
      {subtitle && (
        <Typography 
          variant="subtitle1" 
          color="text.secondary" 
          sx={{ mb: 4, mt: -2 }}
        >
          {subtitle}
        </Typography>
      )}
      
      {children}
    </Box>
  );
};

// Grid para formulários de 2 colunas
export const TwoColumnFormGrid = ({ children }) => {
  return (
    <Grid container spacing={3}>
      {React.Children.map(children, (child, index) => (
        <Grid item xs={12} md={6} key={index}>
          {child}
        </Grid>
      ))}
    </Grid>
  );
};

export default {
  FormTextField,
  FormSelect,
  FormButton,
  PageTitle,
  FormSection,
  SectionTitle,
  FilterSearchField,
  FilterBar,
  StatusChip,
  FormContainer,
  TwoColumnFormGrid
};
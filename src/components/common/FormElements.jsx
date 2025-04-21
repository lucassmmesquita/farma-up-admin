// src/components/common/FormElements.jsx
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
  Paper
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

// Campo de texto estilizado para formulários
export const StyledTextField = styled(TextField)(({ theme }) => ({
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

// Select estilizado para formulários
export const StyledSelect = styled(FormControl)(({ theme }) => ({
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

// Botão estilizado
export const StyledButton = styled(Button)(({ theme }) => ({
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

// Campo de busca estilizado
export const SearchTextField = styled(TextField)(({ theme }) => ({
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

// Painel de filtros estilizado
export const FilterPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: 12,
  backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.03) : alpha(theme.palette.common.black, 0.02),
}));

// Chip de status estilizado
export const StatusChip = styled(Chip)(({ theme, color }) => ({
  borderRadius: 8,
  fontWeight: 600,
  fontSize: '0.75rem',
  paddingLeft: 2,
  paddingRight: 2,
}));

// Componente título de seção
export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1.25rem',
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
}));

// Componente SearchField com ícones
export const SearchField = ({ value, onChange, placeholder, onClear }) => {
  return (
    <SearchTextField
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
            <Button 
              onClick={onClear}
              size="small"
              sx={{ minWidth: 'auto', p: 0.5 }}
            >
              <ClearIcon fontSize="small" />
            </Button>
          </InputAdornment>
        ) : null,
      }}
    />
  );
};

export default {
  StyledTextField,
  StyledSelect,
  StyledButton,
  SearchField,
  FilterPanel,
  StatusChip,
  SectionTitle
};
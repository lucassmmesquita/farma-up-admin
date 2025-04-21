// src/components/Breadcrumb.jsx
import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ChevronRight } from '@mui/icons-material';

// Styled components
const BreadcrumbWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s ease',
}));

const BreadcrumbLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  fontWeight: 500,
  textDecoration: 'none',
  padding: '4px 8px',
  borderRadius: 6,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(46, 125, 50, 0.1)' 
      : 'rgba(46, 125, 50, 0.05)',
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
}));

const CurrentBreadcrumb = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
  padding: '4px 8px',
}));

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Mapping of routes to friendly names
  const routeNameMap = {
    dashboard: 'Dashboard',
    farmacias: 'Farmácias',
    novo: 'Novo',
    editar: 'Editar',
    indicadores: 'Indicadores',
    grafo: 'Visualização em Grafo',
    'planos-acao': 'Planos de Ação',
    evidencias: 'Evidências',
    usuarios: 'Usuários',
    'alerta-medicamentos': 'Alertas de Medicamentos',
  };
  
  // Get display name for route
  const getRouteDisplayName = (route) => {
    return routeNameMap[route] || route;
  };
  
  if (pathnames.length === 0) {
    return null; // No breadcrumbs on home page
  }
  
  return (
    <BreadcrumbWrapper>
      <Breadcrumbs 
        separator={<ChevronRight fontSize="small" />}
        aria-label="breadcrumb"
      >
        {/* Home link, always shown */}
        <BreadcrumbLink component={RouterLink} to="/" color="inherit">
          Home
        </BreadcrumbLink>
        
        {/* Map through paths */}
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const displayName = getRouteDisplayName(value);
          
          return last ? (
            <CurrentBreadcrumb key={to} color="textPrimary">
              {displayName}
            </CurrentBreadcrumb>
          ) : (
            <BreadcrumbLink
              key={to}
              component={RouterLink}
              to={to}
            >
              {displayName}
            </BreadcrumbLink>
          );
        })}
      </Breadcrumbs>
    </BreadcrumbWrapper>
  );
};

export default Breadcrumb;
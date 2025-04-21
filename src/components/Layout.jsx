// src/components/Layout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, 
  IconButton, ListItem, ListItemIcon, ListItemText, Avatar,
  Menu, MenuItem, Tooltip, useMediaQuery, useTheme,
  CssBaseline, Collapse, ListItemButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Menu as MenuIcon, Dashboard as DashboardIcon, 
  Store as StoreIcon, BarChart as BarChartIcon,
  Assignment as AssignmentIcon, VerifiedUser as VerifiedUserIcon,
  People as PeopleIcon, AccountCircle, Logout, Medication,
  ChevronLeft as ChevronLeftIcon, ExpandLess, ExpandMore,
  Add as AddIcon, ImportExport as ImportExportIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Breadcrumb from './Breadcrumb';
import AppFooter from './AppFooter';

const drawerWidth = 240;

// Styled components
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    paddingBottom: '80px', // Espaço para o footer fixo
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
      padding: theme.spacing(2),
      paddingBottom: '100px', // Mais espaço para footer em telas menores
    },
  }),
);

const AppBarStyled = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(29, 29, 31, 0.8)' 
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    boxShadow: 'none',
    borderBottom: `1px solid ${theme.palette.mode === 'dark' 
      ? 'rgba(66, 66, 69, 0.5)' 
      : 'rgba(210, 210, 215, 0.5)'}`,
    zIndex: theme.zIndex.drawer + 1,
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: 0,
  marginBottom: 4,
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 8,
  padding: '8px 16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
    transform: 'translateY(-2px)',
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(10, 132, 255, 0.15)' : 'rgba(0, 113, 227, 0.1)',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(10, 132, 255, 0.25)' : 'rgba(0, 113, 227, 0.15)',
    },
  },
}));

const Layout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [subMenus, setSubMenus] = useState({
    planosAcao: false,
    evidencias: false
  });

  // Update drawer state when screen size changes
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);
  
  // Abrir os submenus relevantes com base no caminho atual
  useEffect(() => {
    if (location.pathname.includes('/planos-acao')) {
      setSubMenus(prev => ({ ...prev, planosAcao: true }));
    }
    if (location.pathname.includes('/evidencias')) {
      setSubMenus(prev => ({ ...prev, evidencias: true }));
    }
  }, [location.pathname]);

  // Toggle drawer
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/login');
  };

  // Toggle submenu
  const handleToggleSubmenu = (menu) => {
    setSubMenus({
      ...subMenus,
      [menu]: !subMenus[menu]
    });
  };

  // Menu structure
  const mainMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Farmácias', icon: <StoreIcon />, path: '/farmacias' },
    { text: 'Indicadores', icon: <BarChartIcon />, path: '/indicadores' },
  ];

  const planosAcaoSubMenuItems = [
    { text: 'Listar Planos', icon: <AssignmentIcon />, path: '/planos-acao' },
    { text: 'Novo Plano', icon: <AddIcon />, path: '/planos-acao/novo' },
  ];

  const evidenciasSubMenuItems = [
    { text: 'Validar Evidências', icon: <VerifiedUserIcon />, path: '/evidencias' },
    { text: 'Importar Evidências', icon: <ImportExportIcon />, path: '/evidencias/importar' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{
              marginRight: 5,
              color: theme.palette.text.primary,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              color: theme.palette.text.primary,
              fontWeight: 600
            }}
          >
            FarmaUP Admin
          </Typography>
          <Tooltip title="Perfil">
            <IconButton onClick={handleProfileMenuOpen} color="inherit">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.nome?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Meu Perfil" />
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Sair" />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBarStyled>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: theme.palette.mode === 'dark' 
              ? '4px 0 10px rgba(0, 0, 0, 0.5)' 
              : '4px 0 10px rgba(0, 0, 0, 0.05)',
          },
        }}
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={handleDrawerToggle}
      >
        <DrawerHeader>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              color: theme.palette.primary.main,
              ml: 2 
            }}
          >
            FarmaUP
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List sx={{ p: 2 }}>
          {/* Main menu items */}
          {mainMenuItems.map((item) => (
            <StyledListItem key={item.text} disablePadding>
              <StyledListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon 
                  sx={{ 
                    color: location.pathname === item.path 
                      ? theme.palette.primary.main 
                      : theme.palette.text.secondary,
                    minWidth: 40
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    fontSize: '0.95rem'
                  }}
                />
              </StyledListItemButton>
            </StyledListItem>
          ))}
          
          {/* Planos de Ação submenu */}
          <StyledListItem disablePadding>
            <StyledListItemButton
              selected={location.pathname.includes('/planos-acao')}
              onClick={() => handleToggleSubmenu('planosAcao')}
            >
              <ListItemIcon 
                sx={{ 
                  color: location.pathname.includes('/planos-acao') 
                    ? theme.palette.primary.main 
                    : theme.palette.text.secondary,
                  minWidth: 40
                }}
              >
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Planos de Ação" 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname.includes('/planos-acao') ? 600 : 500,
                  fontSize: '0.95rem'
                }}
              />
              {subMenus.planosAcao ? <ExpandLess /> : <ExpandMore />}
            </StyledListItemButton>
          </StyledListItem>
          
          <Collapse in={subMenus.planosAcao} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 2 }}>
              {planosAcaoSubMenuItems.map((item) => (
                <StyledListItem key={item.text} disablePadding>
                  <StyledListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        color: location.pathname === item.path 
                          ? theme.palette.primary.main 
                          : theme.palette.text.secondary,
                        minWidth: 40
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ 
                        fontWeight: location.pathname === item.path ? 600 : 500,
                        fontSize: '0.9rem'
                      }}
                    />
                  </StyledListItemButton>
                </StyledListItem>
              ))}
            </List>
          </Collapse>
          
          {/* Evidências submenu */}
          <StyledListItem disablePadding>
            <StyledListItemButton
              selected={location.pathname.includes('/evidencias')}
              onClick={() => handleToggleSubmenu('evidencias')}
            >
              <ListItemIcon 
                sx={{ 
                  color: location.pathname.includes('/evidencias') 
                    ? theme.palette.primary.main 
                    : theme.palette.text.secondary,
                  minWidth: 40
                }}
              >
                <VerifiedUserIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Evidências" 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname.includes('/evidencias') ? 600 : 500,
                  fontSize: '0.95rem'
                }}
              />
              {subMenus.evidencias ? <ExpandLess /> : <ExpandMore />}
            </StyledListItemButton>
          </StyledListItem>
          
          <Collapse in={subMenus.evidencias} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 2 }}>
              {evidenciasSubMenuItems.map((item) => (
                <StyledListItem key={item.text} disablePadding>
                  <StyledListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        color: location.pathname === item.path 
                          ? theme.palette.primary.main 
                          : theme.palette.text.secondary,
                        minWidth: 40
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ 
                        fontWeight: location.pathname === item.path ? 600 : 500,
                        fontSize: '0.9rem'
                      }}
                    />
                  </StyledListItemButton>
                </StyledListItem>
              ))}
            </List>
          </Collapse>
          
          {/* Outros itens de menu */}
          <StyledListItem disablePadding>
            <StyledListItemButton
              selected={location.pathname.includes('/usuarios')}
              onClick={() => navigate('/usuarios')}
            >
              <ListItemIcon 
                sx={{ 
                  color: location.pathname.includes('/usuarios') 
                    ? theme.palette.primary.main 
                    : theme.palette.text.secondary,
                  minWidth: 40
                }}
              >
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Usuários" 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname.includes('/usuarios') ? 600 : 500,
                  fontSize: '0.95rem'
                }}
              />
            </StyledListItemButton>
          </StyledListItem>
          
          <StyledListItem disablePadding>
            <StyledListItemButton
              selected={location.pathname.includes('/alerta-medicamentos')}
              onClick={() => navigate('/alerta-medicamentos')}
            >
              <ListItemIcon 
                sx={{ 
                  color: location.pathname.includes('/alerta-medicamentos') 
                    ? theme.palette.primary.main 
                    : theme.palette.text.secondary,
                  minWidth: 40
                }}
              >
                <Medication />
              </ListItemIcon>
              <ListItemText 
                primary="Alertas Medicamentos" 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname.includes('/alerta-medicamentos') ? 600 : 500,
                  fontSize: '0.95rem'
                }}
              />
            </StyledListItemButton>
          </StyledListItem>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Breadcrumb />
        <Box sx={{ 
          mt: 2, 
          animation: 'fadeIn 0.5s ease-in-out',
          '@keyframes fadeIn': {
            '0%': {
              opacity: 0,
              transform: 'translateY(20px)'
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)'
            }
          }
        }}>
          <Outlet />
        </Box>
      </Main>
      <AppFooter drawerWidth={drawerWidth} open={open} />
    </Box>
  );
};

export default Layout;
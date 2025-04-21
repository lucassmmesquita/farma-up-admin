// src/pages/AlertaMedicamentos/index.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip,
  TextField, InputAdornment, FormControl, InputLabel,
  Select, MenuItem, CircularProgress, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText
} from '@mui/material';
import {
  Search as SearchIcon, FilterList as FilterListIcon,
  Send as SendIcon, MessageOutlined as MessageIcon,
  WhatsApp as WhatsAppIcon, Email as EmailIcon,
  CalendarToday as CalendarIcon, NotificationsActive as NotificationsIcon
} from '@mui/icons-material';
import { useAlertaMedicamentos } from '../../hooks/useAlertaMedicamentos';
import { useFarmacias } from '../../hooks/useFarmacias';
import { format, addDays, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AlertaMedicamentos = () => {
  const [busca, setBusca] = useState('');
  const [filtros, setFiltros] = useState({
    farmacia: '',
    tipoMedicamento: '',
    proximidade: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dialogLembrete, setDialogLembrete] = useState(null);
  const [mensagemLembrete, setMensagemLembrete] = useState('');
  const [tipoLembrete, setTipoLembrete] = useState('sms');
  
  const { medicamentosContínuos, carregarMedicamentosContínuos, enviarLembrete } = useAlertaMedicamentos();
  const { farmacias, carregarFarmacias } = useFarmacias();
  
  useEffect(() => {
    const buscarDados = async () => {
      setLoading(true);
      try {
        await Promise.all([
          carregarMedicamentosContínuos(),
          carregarFarmacias()
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
      tipoMedicamento: '',
      proximidade: ''
    });
  };
  
  const abrirDialogLembrete = (medicamento) => {
    setDialogLembrete(medicamento);
    
    // Pré-preencher mensagem padrão
    const dataFormatada = format(new Date(medicamento.proximaCompra), 'dd/MM/yyyy', { locale: ptBR });
    setMensagemLembrete(
      `Olá ${medicamento.cliente.nome}, o seu medicamento ${medicamento.nome} está próximo da data de recompra (${dataFormatada}). Já separamos para você! Entre em contato para confirmar a retirada.`
    );
  };
  
  const fecharDialogLembrete = () => {
    setDialogLembrete(null);
    setMensagemLembrete('');
    setTipoLembrete('sms');
  };
  
  const handleEnviarLembrete = async () => {
    if (!dialogLembrete || !mensagemLembrete.trim()) return;
    
    try {
      await enviarLembrete(dialogLembrete.id, {
        tipo: tipoLembrete,
        mensagem: mensagemLembrete
      });
      
      // Atualizar lista após envio
      await carregarMedicamentosContínuos();
      fecharDialogLembrete();
    } catch (error) {
      console.error("Erro ao enviar lembrete:", error);
    }
  };
  
  const getCorProximidade = (diasAteCompra) => {
    if (diasAteCompra < 0) return 'error'; // Atrasado
    if (diasAteCompra <= 3) return 'warning'; // Próximo
    if (diasAteCompra <= 7) return 'info'; // Em breve
    return 'default'; // Normal
  };
  
  const getTextoProximidade = (diasAteCompra) => {
    if (diasAteCompra < 0) return `Atrasado (${Math.abs(diasAteCompra)} dias)`;
    if (diasAteCompra === 0) return 'Hoje';
    if (diasAteCompra === 1) return 'Amanhã';
    return `Em ${diasAteCompra} dias`;
  };
  
  const filtrarMedicamentos = () => {
    return medicamentosContínuos.filter(med => {
      // Aplicar busca por texto
      const matchBusca = 
        med.nome.toLowerCase().includes(busca.toLowerCase()) ||
        med.cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
        med.codigo.toLowerCase().includes(busca.toLowerCase());
      
      // Aplicar filtros
      const matchFarmacia = filtros.farmacia ? med.farmaciaId === filtros.farmacia : true;
      const matchTipo = filtros.tipoMedicamento ? med.tipo === filtros.tipoMedicamento : true;
      
      // Filtro por proximidade
      let matchProximidade = true;
      const hoje = new Date();
      const proximaCompra = new Date(med.proximaCompra);
      const diasAteCompra = differenceInDays(proximaCompra, hoje);
      
      if (filtros.proximidade === 'atrasados') {
        matchProximidade = diasAteCompra < 0;
      } else if (filtros.proximidade === 'hoje') {
        matchProximidade = diasAteCompra === 0;
      } else if (filtros.proximidade === 'proximaSemana') {
        matchProximidade = diasAteCompra > 0 && diasAteCompra <= 7;
      } else if (filtros.proximidade === 'proximoMes') {
        matchProximidade = diasAteCompra > 7 && diasAteCompra <= 30;
      }
      
      return matchBusca && matchFarmacia && matchTipo && matchProximidade;
    });
  };
  
  const medicamentosFiltrados = filtrarMedicamentos();
  
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Alerta de Medicamentos Contínuos</Typography>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Buscar medicamento ou cliente..."
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
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 200 }}>
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
              
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Tipo de Medicamento</InputLabel>
                <Select
                  name="tipoMedicamento"
                  value={filtros.tipoMedicamento}
                  onChange={handleFiltroChange}
                  label="Tipo de Medicamento"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="CONTROLADO">Controlado</MenuItem>
                  <MenuItem value="COMUM">Comum</MenuItem>
                  <MenuItem value="ANTIBIOTICO">Antibiótico</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Proximidade</InputLabel>
                <Select
                  name="proximidade"
                  value={filtros.proximidade}
                  onChange={handleFiltroChange}
                  label="Proximidade"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="atrasados">Atrasados</MenuItem>
                  <MenuItem value="hoje">Hoje</MenuItem>
                  <MenuItem value="proximaSemana">Próxima semana</MenuItem>
                  <MenuItem value="proximoMes">Próximo mês</MenuItem>
                </Select>
              </FormControl>
              
              <Button
                variant="outlined"
                onClick={limparFiltros}
              >
                Limpar Filtros
              </Button>
            </Box>
          </Box>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Medicamento</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Contato</TableCell>
                  <TableCell>Farmácia</TableCell>
                  <TableCell>Última Compra</TableCell>
                  <TableCell>Próxima Compra</TableCell>
                  <TableCell>Proximidade</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicamentosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <Box sx={{ py: 3 }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          Nenhum medicamento contínuo encontrado
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tente ajustar os filtros ou a busca para encontrar medicamentos.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  medicamentosFiltrados.map((medicamento) => {
                    // Calcular dias até próxima compra
                    const hoje = new Date();
                    const proximaCompra = new Date(medicamento.proximaCompra);
                    const diasAteCompra = differenceInDays(proximaCompra, hoje);
                    
                    return (
                      <TableRow key={medicamento.id}>
                        <TableCell>{medicamento.codigo}</TableCell>
                        <TableCell>{medicamento.nome}</TableCell>
                        <TableCell>{medicamento.cliente.nome}</TableCell>
                        <TableCell>
                          {medicamento.cliente.telefone}<br />
                          <Typography variant="caption" color="text.secondary">
                            {medicamento.cliente.email}
                          </Typography>
                        </TableCell>
                        <TableCell>{medicamento.farmacia.nome}</TableCell>
                        <TableCell>
                          {format(new Date(medicamento.ultimaCompra), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          {format(new Date(medicamento.proximaCompra), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getTextoProximidade(diasAteCompra)}
                            color={getCorProximidade(diasAteCompra)}
                            size="small"
                            icon={<CalendarIcon />}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={medicamento.tipo}
                            color={medicamento.tipo === 'CONTROLADO' ? 'error' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => abrirDialogLembrete(medicamento)}
                            disabled={medicamento.lembreteEnviado}
                            title={medicamento.lembreteEnviado ? "Lembrete já enviado" : "Enviar lembrete"}
                          >
                            <NotificationsIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      
      {/* Dialog para enviar lembrete */}
      <Dialog
        open={!!dialogLembrete}
        onClose={fecharDialogLembrete}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Enviar Lembrete de Medicamento
        </DialogTitle>
        <DialogContent>
          {dialogLembrete && (
            <>
              <DialogContentText sx={{ mb: 2 }}>
                Envie um lembrete para {dialogLembrete.cliente.nome} sobre o medicamento {dialogLembrete.nome}.
                A data prevista para a próxima compra é {format(new Date(dialogLembrete.proximaCompra), 'dd/MM/yyyy', { locale: ptBR })}.
              </DialogContentText>
              
              <FormControl sx={{ mb: 3, width: '100%' }}>
                <InputLabel>Tipo de Mensagem</InputLabel>
                <Select
                  value={tipoLembrete}
                  onChange={(e) => setTipoLembrete(e.target.value)}
                  label="Tipo de Mensagem"
                >
                  <MenuItem value="sms">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MessageIcon sx={{ mr: 1 }} /> SMS
                    </Box>
                  </MenuItem>
                  <MenuItem value="whatsapp">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WhatsAppIcon sx={{ mr: 1 }} /> WhatsApp
                    </Box>
                  </MenuItem>
                  <MenuItem value="email">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon sx={{ mr: 1 }} /> E-mail
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Mensagem"
                multiline
                rows={6}
                value={mensagemLembrete}
                onChange={(e) => setMensagemLembrete(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Informações do Cliente
                </Typography>
                <Typography variant="body2">
                  <strong>Nome:</strong> {dialogLembrete.cliente.nome}
                </Typography>
                <Typography variant="body2">
                  <strong>Telefone:</strong> {dialogLembrete.cliente.telefone}
                </Typography>
                <Typography variant="body2">
                  <strong>E-mail:</strong> {dialogLembrete.cliente.email}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialogLembrete}>Cancelar</Button>
          <Button 
            startIcon={<SendIcon />}
            onClick={handleEnviarLembrete} 
            variant="contained" 
            color="primary"
            disabled={!mensagemLembrete.trim()}
          >
            Enviar Lembrete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AlertaMedicamentos;
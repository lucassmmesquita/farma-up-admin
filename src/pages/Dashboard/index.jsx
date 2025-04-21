// src/pages/Dashboard/index.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Card, CardContent,
  FormControl, InputLabel, Select, MenuItem, CircularProgress
} from '@mui/material';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, RadarChart, 
  Radar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { useDashboard } from '../../hooks/useDashboard';
import { useFarmacias } from '../../hooks/useFarmacias';
import { Cell } from 'recharts';

const Dashboard = () => {
  const [periodo, setPeriodo] = useState('30dias');
  const [farmacia, setFarmacia] = useState('todas');
  const [loading, setLoading] = useState(true);
  
  const { dadosDashboard, carregarDadosDashboard } = useDashboard();
  const { farmacias, carregarFarmacias } = useFarmacias();
  
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        await Promise.all([
          carregarDadosDashboard(periodo, farmacia),
          carregarFarmacias()
        ]);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, [periodo, farmacia]);
  
  const handlePeriodoChange = (e) => {
    setPeriodo(e.target.value);
  };
  
  const handleFarmaciaChange = (e) => {
    setFarmacia(e.target.value);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Período</InputLabel>
            <Select
              value={periodo}
              onChange={handlePeriodoChange}
              label="Período"
            >
              <MenuItem value="7dias">Últimos 7 dias</MenuItem>
              <MenuItem value="30dias">Últimos 30 dias</MenuItem>
              <MenuItem value="90dias">Últimos 90 dias</MenuItem>
              <MenuItem value="anoatual">Ano atual</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Farmácia</InputLabel>
            <Select
              value={farmacia}
              onChange={handleFarmaciaChange}
              label="Farmácia"
            >
              <MenuItem value="todas">Todas as Farmácias</MenuItem>
              {farmacias.map((farm) => (
                <MenuItem key={farm.id} value={farm.id}>
                  {farm.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Planos de Ação
              </Typography>
              <Typography variant="h4">
                {dadosDashboard.kpis.totalPlanosAcao}
              </Typography>
              <Typography variant="body2" color={dadosDashboard.kpis.variacaoPlanosAcao >= 0 ? "success.main" : "error.main"}>
                {dadosDashboard.kpis.variacaoPlanosAcao >= 0 ? '+' : ''}{dadosDashboard.kpis.variacaoPlanosAcao}% vs período anterior
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Evidências Enviadas
              </Typography>
              <Typography variant="h4">
                {dadosDashboard.kpis.totalEvidencias}
              </Typography>
              <Typography variant="body2" color={dadosDashboard.kpis.variacaoEvidencias >= 0 ? "success.main" : "error.main"}>
                {dadosDashboard.kpis.variacaoEvidencias >= 0 ? '+' : ''}{dadosDashboard.kpis.variacaoEvidencias}% vs período anterior
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Taxa de Cumprimento
              </Typography>
              <Typography variant="h4">
                {dadosDashboard.kpis.taxaCumprimento}%
              </Typography>
              <Typography variant="body2" color={dadosDashboard.kpis.variacaoCumprimento >= 0 ? "success.main" : "error.main"}>
                {dadosDashboard.kpis.variacaoCumprimento >= 0 ? '+' : ''}{dadosDashboard.kpis.variacaoCumprimento}% vs período anterior
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Farmácias Ativas
              </Typography>
              <Typography variant="h4">
                {dadosDashboard.kpis.farmaciasAtivas}
              </Typography>
              <Typography variant="body2" color={dadosDashboard.kpis.variacaoFarmacias >= 0 ? "success.main" : "error.main"}>
                {dadosDashboard.kpis.variacaoFarmacias >= 0 ? '+' : ''}{dadosDashboard.kpis.variacaoFarmacias} vs período anterior
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Gráficos */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Evolução de Planos de Ação
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dadosDashboard.graficoEvolucaoPlanosAcao}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="criados" name="Planos Criados" stroke="#8884d8" />
                  <Line type="monotone" dataKey="concluidos" name="Planos Concluídos" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Status dos Planos de Ação
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosDashboard.graficoStatusPlanosAcao}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {dadosDashboard.graficoStatusPlanosAcao.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Indicadores por Categoria
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dadosDashboard.graficoIndicadoresPorCategoria}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="acimaMeta" name="Acima da Meta" stackId="a" fill="#4caf50" />
                  <Bar dataKey="dentroMeta" name="Dentro da Meta" stackId="a" fill="#2196f3" />
                  <Bar dataKey="abaixoMeta" name="Abaixo da Meta" stackId="a" fill="#f44336" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Desempenho por Farmácia
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={dadosDashboard.graficoDesempenhoPorFarmacia}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="farmacia" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Cumprimento de Ações (%)" dataKey="cumprimento" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Indicadores Alcançados (%)" dataKey="indicadoresAlcancados" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tendência dos Principais Indicadores
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dadosDashboard.graficoTendenciaIndicadores}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {dadosDashboard.graficoTendenciaIndicadores.length > 0 && 
                    Object.keys(dadosDashboard.graficoTendenciaIndicadores[0])
                      .filter(key => key !== 'mes')
                      .map((key, index) => (
                        <Area 
                          key={index}
                          type="monotone" 
                          dataKey={key} 
                          stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} 
                          fill={`#${Math.floor(Math.random() * 16777215).toString(16)}33`} 
                        />
                      ))
                  }
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
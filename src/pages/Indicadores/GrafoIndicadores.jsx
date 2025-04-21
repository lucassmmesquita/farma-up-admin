// src/pages/Indicadores/GrafoIndicadores.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Network } from 'vis-network/standalone';
import { useIndicadores } from '../../hooks/useIndicadores';
import { ArrowBack } from '@mui/icons-material';

const GrafoIndicadores = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('TODAS');
  const { indicadores, carregarIndicadores } = useIndicadores();
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const [categorias, setCategorias] = useState([]);
  
  useEffect(() => {
    const buscarDados = async () => {
      await carregarIndicadores();
      setLoading(false);
    };
    
    buscarDados();
  }, []);
  
  useEffect(() => {
    if (indicadores.length > 0) {
      // Extrair categorias únicas
      const categoriasUnicas = [...new Set(indicadores.map(ind => ind.categoria))];
      setCategorias(categoriasUnicas);
      
      // Criar grafo
      criarGrafo();
    }
  }, [indicadores, filtroCategoria]);
  
  const criarGrafo = () => {
    if (!containerRef.current) return;
    
    // Filtrar indicadores se necessário
    const indicadoresFiltrados = filtroCategoria === 'TODAS' ? 
      indicadores : 
      indicadores.filter(ind => ind.categoria === filtroCategoria);
    
    // Preparar nós e arestas para o grafo
    const nodes = indicadoresFiltrados.map(ind => ({
      id: ind.id,
      label: ind.nome,
      title: `${ind.codigo} - ${ind.nome}\nMeta: ${ind.metaPadrao} ${ind.unidade}`,
      shape: 'dot',
      size: 15 + (ind.indicadoresRelacionados?.length || 0) * 3, // Tamanho proporcional aos relacionamentos
      color: {
        background: ind.temImpacto ? '#FF9800' : '#9E9E9E', // Laranja para indicadores com impacto, cinza para os demais
        border: '#555555',
        highlight: {
          background: ind.temImpacto ? '#FFA726' : '#BDBDBD',
          border: '#333333'
        }
      },
      font: {
        size: 12
      }
    }));
    
    // Preparar arestas para os relacionamentos
    const edges = [];
    indicadoresFiltrados.forEach(ind => {
      if (ind.indicadoresRelacionados && ind.indicadoresRelacionados.length > 0) {
        ind.indicadoresRelacionados.forEach(relId => {
          // Verificar se o indicador relacionado está no filtro atual
          const indRelacionado = indicadoresFiltrados.find(i => i.id === relId);
          if (indRelacionado) {
            edges.push({
              from: ind.id,
              to: relId,
              arrows: {
                to: true // Seta indicando a direção do impacto
              },
              color: {
                color: '#555555',
                highlight: '#333333'
              },
              width: 1.5,
              smooth: {
                type: 'curvedCW',
                roundness: 0.2
              }
            });
          }
        });
      }
    });
    
    // Configurações do grafo
    const options = {
      nodes: {
        borderWidth: 2,
        shadow: true
      },
      edges: {
        shadow: true
      },
      physics: {
        forceAtlas2Based: {
          gravitationalConstant: -26,
          centralGravity: 0.005,
          springLength: 230,
          springConstant: 0.18
        },
        maxVelocity: 146,
        solver: 'forceAtlas2Based',
        timestep: 0.35,
        stabilization: { iterations: 150 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        navigationButtons: true,
        keyboard: true
      }
    };
    
    // Criar a rede
    const network = new Network(
      containerRef.current,
      { nodes, edges },
      options
    );
    
    // Adicionar evento de clique
    network.on('doubleClick', function(params) {
      if (params.nodes.length > 0) {
        const indicadorId = params.nodes[0];
        navigate(`/indicadores/editar/${indicadorId}`);
      }
    });
    
    networkRef.current = network;
  };
  
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/indicadores')}
            sx={{ mr: 2 }}
          >
            Voltar
          </Button>
          <Typography variant="h5">Grafo de Relacionamentos entre Indicadores</Typography>
        </Box>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por Categoria</InputLabel>
          <Select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            label="Filtrar por Categoria"
          >
            <MenuItem value="TODAS">Todas as Categorias</MenuItem>
            {categorias.map((cat, index) => (
              <MenuItem key={index} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Neste grafo, os indicadores com impacto são exibidos em laranja e os relacionados em cinza. 
            O tamanho do nó é proporcional ao número de relacionamentos. 
            Dê um duplo clique em um indicador para editá-lo.
          </Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box
            ref={containerRef}
            sx={{
              width: '100%',
              height: '70vh',
              border: '1px solid #ddd',
              borderRadius: 1
            }}
          />
        )}
      </Paper>
    </>
  );
};

export default GrafoIndicadores;
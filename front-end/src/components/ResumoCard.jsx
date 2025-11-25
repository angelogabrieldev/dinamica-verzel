import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  List,
  ListItem,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';


const ResumoCard = ({
  totalVendas: propTotalVendas = 0,
  totalDepositos: propTotalDepositos = 0,
  status: propStatus = 'ABERTO',
  caixaId,
  onSolicitarEvidencia,
  onFinalizarConciliacao,
  solicitacoes: propSolicitacoes = [],
  fetchData = false
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalVendas, setTotalVendas] = useState(propTotalVendas);
  const [totalDepositos, setTotalDepositos] = useState(propTotalDepositos);
  const [status, setStatus] = useState(propStatus);
  const [solicitacoes, setSolicitacoes] = useState(propSolicitacoes);

  // Fetch data from Prisma backend via API
  useEffect(() => {
    if (!fetchData || !caixaId) return;

    const fetchCaixaData = async () => {
      setIsLoading(true);
      try {
        // Fetch caixa data including vendas, depositos, and solicitacoes
        const response = await fetch(`/api/caixa/${caixaId}`);
        if (!response.ok) throw new Error('Failed to fetch caixa data');

        const data = await response.json();

        // Calculate totals from fetched data
        const vendas = data.vendas || [];
        const depositos = data.depositos || [];

        const totalVendasCalculated = vendas.reduce((sum, v) => sum + parseFloat(v.valor || 0), 0);
        const totalDepositosCalculated = depositos.reduce((sum, d) => sum + parseFloat(d.valor || 0), 0);

        setTotalVendas(totalVendasCalculated);
        setTotalDepositos(totalDepositosCalculated);
        setStatus(data.status || 'ABERTO');
        setSolicitacoes(data.solicitacoes || []);
      } catch (error) {
        console.error('Error fetching caixa data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaixaData();
  }, [caixaId, fetchData]);

  const diferenca = totalVendas - totalDepositos;
  const hasDiferenca = Math.abs(diferenca) > 0.01;

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Status configuration
  const statusConfig = {
    'ABERTO': {
      label: 'ABERTO',
      color: 'warning'
    },
    'FECHADO': {
      label: 'FECHADO',
      color: 'success'
    },
    'AGUARDANDO_RETORNO': {
      label: 'AGUARDANDO RETORNO',
      color: 'info'
    },
    'NAO_CONCILIADO': {
      label: 'NÃO CONCILIADO',
      color: 'error'
    }
  };

  const currentStatus = statusConfig[status] || statusConfig['ABERTO'];

  const handleSolicitarEvidencia = async () => {
    if (!onSolicitarEvidencia || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await onSolicitarEvidencia(caixaId);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalizarConciliacao = async (conciliated = true) => {
    if (!onFinalizarConciliacao || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await onFinalizarConciliacao(caixaId, conciliated);
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if we can finalize
  const canFinalize = status === 'ABERTO' || status === 'AGUARDANDO_RETORNO';
  const shouldShowEvidencia = status === 'ABERTO';
  const hasPendingSolicitacoes = solicitacoes.some(s => s.dataEnvio === null);

  if (isLoading && fetchData) {
    return (
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mt: 2 }}>
          Carregando dados...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Header with Status */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography 
          variant="h6" 
          fontWeight={700}
          sx={{ 
            pb: 1.5,
            borderBottom: 3,
            borderColor: 'primary.main'
          }}
        >
          Resumo & Ações
        </Typography>
        <Chip
          label={currentStatus.label}
          color={currentStatus.color}
          size="small"
          sx={{ fontWeight: 700, fontFamily: 'monospace' }}
        />
      </Stack>

      {/* Summary Values */}
      <List sx={{ py: 0, mb: 2 }}>
        <ListItem
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: 2,
            bgcolor: 'grey.50',
            border: 1,
            borderColor: 'grey.200',
            mb: 1.5
          }}
        >
          <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
            <Typography variant="body2" fontWeight={500} color="text.secondary">
              Total Vendas
            </Typography>
            <Typography variant="body1" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
              {formatCurrency(totalVendas)}
            </Typography>
          </Stack>
        </ListItem>

        <ListItem
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: 2,
            bgcolor: 'grey.50',
            border: 1,
            borderColor: 'grey.200'
          }}
        >
          <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
            <Typography variant="body2" fontWeight={500} color="text.secondary">
              Total Depósitos
            </Typography>
            <Typography variant="body1" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
              {formatCurrency(totalDepositos)}
            </Typography>
          </Stack>
        </ListItem>
      </List>

      {/* Difference Box */}
      <Alert
        severity={hasDiferenca ? 'error' : 'success'}
        icon={hasDiferenca ? <WarningIcon /> : <CheckCircleIcon />}
        sx={{ 
          mb: 2,
          fontWeight: 600,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
          <Typography variant="body2" fontWeight={700}>
            DIFERENÇA
          </Typography>
          <Typography 
            variant="h6" 
            fontWeight={700}
            sx={{ fontFamily: 'monospace' }}
          >
            {formatCurrency(Math.abs(diferenca))}
          </Typography>
        </Stack>
      </Alert>

      {/* Solicitações de Evidência */}
      {solicitacoes.length > 0 && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <DescriptionIcon fontSize="small" color="action" />
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
              SOLICITAÇÕES DE EVIDÊNCIA
            </Typography>
          </Stack>
          <Stack spacing={1}>
            {solicitacoes.map(sol => (
              <Box
                key={sol.id}
                sx={{
                  p: 1.5,
                  bgcolor: 'white',
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'grey.200'
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" sx={{ flex: 1 }}>
                    {sol.mensagem}
                  </Typography>
                  <Chip
                    label={sol.dataEnvio ? 'Enviado' : 'Pendente'}
                    size="small"
                    color={sol.dataEnvio ? 'success' : 'warning'}
                    sx={{ ml: 1, height: 20, fontSize: '0.65rem' }}
                  />
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Action Buttons */}
      <Divider sx={{ my: 2 }} />
      <Stack spacing={1.5} sx={{ mt: 'auto' }}>
        {shouldShowEvidencia && (
          <Button
            variant="outlined"
            startIcon={<DescriptionIcon />}
            onClick={handleSolicitarEvidencia}
            disabled={isProcessing || hasPendingSolicitacoes}
            fullWidth
            sx={{
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            Solicitar Evidência
          </Button>
        )}

        <Button
          variant="contained"
          color="success"
          startIcon={<CheckCircleIcon />}
          onClick={() => handleFinalizarConciliacao(true)}
          disabled={isProcessing || !canFinalize || hasDiferenca}
          fullWidth
          sx={{
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none'
          }}
        >
          Finalizar Conciliação
        </Button>

        {hasDiferenca && canFinalize && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CancelIcon />}
            onClick={() => handleFinalizarConciliacao(false)}
            disabled={isProcessing}
            fullWidth
            sx={{
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            Finalizar sem Conciliar
          </Button>
        )}
      </Stack>

      {/* Processing Overlay */}
      {isProcessing && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            zIndex: 10
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mt: 2 }}>
            Processando...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ResumoCard;
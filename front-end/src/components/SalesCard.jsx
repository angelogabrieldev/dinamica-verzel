import React, { useState, useEffect } from "react";
import { Paper, Typography, Box, Divider, Stack, CircularProgress } from "@mui/material";
import { fetchCaixa } from "../services/api";

const MOCK_VENDAS = {
  dinheiro: 2000.0,
  pix: 1000.0,
  cartoes: 7000.0,
  carteirasDigitais: 0.0,
  total: 10000.0,
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const SalesRow = ({ label, value }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Typography variant="body1" color="text.secondary">
      {label}:
    </Typography>
    <Typography variant="body1" fontWeight={500}>
      {formatCurrency(value)}
    </Typography>
  </Box>
);

const SalesCard = ({ caixaId = null, vendasData = null }) => {
  const [dados, setDados] = useState(vendasData || MOCK_VENDAS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vendasData) {
      setDados(vendasData);
      return;
    }

    if (!caixaId) {
      setDados(MOCK_VENDAS);
      return;
    }

    const fetchVendas = async () => {
      setLoading(true);
      try {
        const caixa = await fetchCaixa(caixaId);
        const vendas = caixa.vendas || [];

        const vendasByType = {
          dinheiro: 0,
          pix: 0,
          cartoes: 0,
          carteirasDigitais: 0,
          total: 0,
        };

        vendas.forEach((venda) => {
          const valor = parseFloat(venda.valor || 0);
          if (venda.tipo === 'dinheiro') vendasByType.dinheiro += valor;
          else if (venda.tipo === 'pix') vendasByType.pix += valor;
          else if (venda.tipo === 'cartao') vendasByType.cartoes += valor;
          else if (venda.tipo === 'carteira_digital') vendasByType.carteirasDigitais += valor;
        });

        vendasByType.total = Object.values(vendasByType).reduce((a, b) => a + b, 0);

        setDados(vendasByType);
      } catch (error) {
        console.error('Error fetching vendas:', error);
        setDados(MOCK_VENDAS);
      } finally {
        setLoading(false);
      }
    };

    fetchVendas();
  }, [caixaId, vendasData]);

  if (loading) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 3,
          height: "100%",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Carregando vendas...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Vendas
      </Typography>

      <Box sx={{ mt: 2, flexGrow: 1 }}>
        <Stack spacing={2}>
          <SalesRow label="Dinheiro" value={dados.dinheiro} />
          <SalesRow label="Pix" value={dados.pix} />
          <SalesRow label="Cartões" value={dados.cartoes} />
          <SalesRow
            label="Carteiras Digitais"
            value={dados.carteirasDigitais}
          />
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
          TOTAL VENDAS:
        </Typography>
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          {formatCurrency(dados.total)}
        </Typography>
      </Box>
    </Paper>
  );
};

export default SalesCard;

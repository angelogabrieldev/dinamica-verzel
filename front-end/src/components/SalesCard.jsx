import React from "react";
import { Paper, Typography, Box, Divider, Stack } from "@mui/material";

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

const SalesCard = () => {
  const dados = MOCK_VENDAS;

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

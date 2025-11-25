import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Box, Typography, Grid, Alert } from "@mui/material";
import ResumoCard from "../../components/Resumocard";
import SalesCard from "../../components/SalesCard";
import DepositCard from "../../components/DepositCard";

function Conciliacao() {
  const [searchParams] = useSearchParams();
  const caixaId = searchParams.get("caixaId");

  const handleSolicitarEvidencia = async (id) => {
    console.log("Solicitando evidência para caixa:", id);
  };

  const handleFinalizarConciliacao = async (id, conciliated) => {
    console.log(
      "Finalizando conciliação para caixa:",
      id,
      "Conciliado:",
      conciliated
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Conciliação de Caixas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie e finalize conciliações de caixas
        </Typography>
      </Box>

      {!caixaId && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Selecione uma loja e data na página anterior para iniciar a conciliação.
          Os componentes abaixo mostram dados de exemplo (mock data) até que um caixa real seja selecionado.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Sales Card */}
        <Grid item xs={12} sm={6} md={4}>
          <SalesCard caixaId={caixaId} />
        </Grid>

        {/* Deposit Card */}
        <Grid item xs={12} sm={6} md={4}>
          <DepositCard caixaId={caixaId} />
        </Grid>

        {/* Resumo Card */}
        <Grid item xs={12} sm={6} md={4}>
          <ResumoCard
            caixaId={caixaId}
            fetchData={false}
            totalVendas={1500.00}
            totalDepositos={1450.00}
            status="ABERTO"
            solicitacoes={[]}
            onSolicitarEvidencia={handleSolicitarEvidencia}
            onFinalizarConciliacao={handleFinalizarConciliacao}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Conciliacao;

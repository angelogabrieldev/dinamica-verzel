import { useState } from "react";
import { Container, Box, Typography, Grid } from "@mui/material"; // <--- Adicione Grid aqui
import ResumoCard from "../../components/Resumocard";
import SalesCard from "../../components/SalesCard";
import DepositCard from "../../components/DepositCard";

function Conciliacao() {
  const [caixaId] = useState("test-caixa-123");

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

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <SalesCard />
        </Grid>

        <Grid item xs={12} md={4}>
          <DepositCard />
        </Grid>

        <Grid item xs={12} md={4}>
          <ResumoCard
            caixaId={caixaId}
            fetchData={false}
            totalVendas={1500.0}
            totalDepositos={1450.0}
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

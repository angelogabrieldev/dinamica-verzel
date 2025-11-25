import { useState } from 'react'
import { Container, Box, Typography, Grid } from '@mui/material'
import SalesCard from '../../components/SalesCard'
import ResumoCard from '../../components/Resumocard'

function Conciliacao() {
  const [caixaId] = useState('test-caixa-123')

  const handleSolicitarEvidencia = async (id) => {
    console.log('Solicitando evidência para caixa:', id)
  }

  const handleFinalizarConciliacao = async (id, conciliated) => {
    console.log('Finalizando conciliação para caixa:', id, 'Conciliado:', conciliated)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Conciliação de Caixas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie e finalize conciliações de caixas
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Sales Card */}
        <Grid item xs={12} sm={6} md={4}>
          <SalesCard />
        </Grid>

        {/* Deposit Card - Placeholder */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ p: 3, border: '2px dashed', borderColor: 'grey.300', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
            <Typography variant="body2" color="text.secondary">
              DepositCard (será criado)
            </Typography>
          </Box>
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
  )
}

export default Conciliacao

import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Checkbox,
  Chip,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NewDepositModal from "./NewDepositModal";

// MOCK
const MOCK_DEPOSITOS_INICIAIS = [
  { id: 1, codigo: "DEP-001", valor: 5000.0, status: "Conferido" },
  { id: 2, codigo: "DEP-002", valor: 4000.0, status: "Pendente" },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value
  );

const DepositoItem = ({ deposito, onToggle }) => {
  const isConferido = deposito.status === "Conferido";

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        p: 1,
        borderRadius: 1,
        bgcolor: isConferido ? "action.hover" : "transparent",
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Checkbox
          checked={isConferido}
          onChange={() => onToggle(deposito.id)}
          color="primary"
          size="small"
        />
        <Typography variant="body2" fontWeight={500}>
          {deposito.codigo} | {formatCurrency(deposito.valor)}
        </Typography>
      </Box>

      <Chip
        label={deposito.status}
        color={isConferido ? "success" : "warning"}
        size="small"
        variant={isConferido ? "filled" : "outlined"}
        sx={{ fontWeight: "bold", minWidth: 80 }}
      />
    </Box>
  );
};

const DepositCard = () => {
  const [depositos, setDepositos] = useState(MOCK_DEPOSITOS_INICIAIS);
  const [modalOpen, setModalOpen] = useState(false);

  const handleToggle = (id) => {
    const novosDepositos = depositos.map((dep) => {
      if (dep.id === id) {
        return {
          ...dep,
          status: dep.status === "Conferido" ? "Pendente" : "Conferido",
        };
      }
      return dep;
    });
    setDepositos(novosDepositos);
  };

  const handleAddDeposit = async (newDeposit) => {
    // Add new deposit with generated ID
    const novoDeposito = {
      id: depositos.length > 0 ? Math.max(...depositos.map(d => d.id)) + 1 : 1,
      ...newDeposit,
    };
    setDepositos([...depositos, novoDeposito]);
  };

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
        Depósitos
      </Typography>

      {/* Lista de Depósitos */}
      <Box sx={{ mt: 2, flexGrow: 1, overflowY: "auto" }}>
        <Stack spacing={1}>
          {depositos.map((dep) => (
            <DepositoItem key={dep.id} deposito={dep} onToggle={handleToggle} />
          ))}
        </Stack>
      </Box>

      {/* Botão de Ação */}
      <Box sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<AddIcon />}
          sx={{ textTransform: "none", fontWeight: 600 }}
          onClick={() => setModalOpen(true)}
        >
          Adicionar Depósito
        </Button>
      </Box>

      {/* Modal */}
      <NewDepositModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddDeposit}
      />
    </Paper>
  );
};

export default DepositCard;

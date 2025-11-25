import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const NewDepositModal = ({ open, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    codigo: "",
    valor: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setError("");

    // Validation
    if (!formData.codigo.trim()) {
      setError("Código do depósito é obrigatório");
      return;
    }

    if (!formData.valor || isNaN(parseFloat(formData.valor))) {
      setError("Valor deve ser um número válido");
      return;
    }

    if (parseFloat(formData.valor) <= 0) {
      setError("Valor deve ser maior que zero");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        codigo: formData.codigo.trim(),
        valor: parseFloat(formData.valor),
        status: "Pendente",
      });

      // Reset form on success
      setFormData({ codigo: "", valor: "" });
      onClose();
    } catch (err) {
      setError(err.message || "Erro ao adicionar depósito");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ codigo: "", valor: "" });
      setError("");
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.25rem",
          fontWeight: 700,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AddIcon />
          <Typography variant="h6" fontWeight={700}>
            Novo Depósito
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Stack spacing={2}>
          {error && (
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <TextField
            autoFocus
            label="Código do Depósito"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            disabled={loading}
            fullWidth
            placeholder="Ex: DEP-003"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          />

          <TextField
            label="Valor"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            disabled={loading}
            fullWidth
            type="number"
            inputProps={{
              step: "0.01",
              min: "0",
            }}
            placeholder="0.00"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          gap: 1,
          p: 2,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          startIcon={<CloseIcon />}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Cancelar
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          color="success"
          startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          {loading ? "Adicionando..." : "Adicionar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewDepositModal;

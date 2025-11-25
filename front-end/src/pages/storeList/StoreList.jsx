import { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { DataTable } from "../../components/DataTable";

export default function ListaLojas() {
  const [date, setDate] = useState("2025-11-25");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const statusOptions = ["Todos", "Aberto", "Fechado", "Aguardando"];

  const columns = [
    { label: "Loja", key: "loja" },
    { label: "Data", key: "data" },
    {
      label: "Vendas (R$)",
      key: "vendas",
      align: "right",
      render: (v) => v.toLocaleString("pt-BR"),
    },
    {
      label: "Depósitos (R$)",
      key: "depositos",
      align: "right",
      render: (v) => v.toLocaleString("pt-BR"),
    },
    {
      label: "Saldo (R$)",
      key: "saldo",
      align: "right",
      render: (value) => (
        <span
          style={{
            color: value < 0 ? "red" : "green",
            fontWeight: 600,
          }}
        >
          {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (value) => {
        const colors = {
          Aberto: { bg: "#FCE8E6", color: "#D43C3C" },
          Fechado: { bg: "#E6F4EA", color: "#2E7D32" },
          Aguardando: { bg: "#FFF4D1", color: "#B88600" },
        };

        const c = colors[value];

        return (
          <span
            style={{
              backgroundColor: c.bg,
              color: c.color,
              padding: "4px 12px",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "0.8rem",
            }}
          >
            {value}
          </span>
        );
      },
    },
  ];

  const rows = [
    {
      id: 1,
      loja: "Loja Centro",
      data: "23/11",
      vendas: 10000,
      depositos: 9000,
      saldo: -1000,
      status: "Aberto",
    },
    {
      id: 2,
      loja: "Loja Shopping",
      data: "25/11",
      vendas: 5000,
      depositos: 5000,
      saldo: 0,
      status: "Fechado",
    },
    {
      id: 3,
      loja: "Loja Sul",
      data: "24/11",
      vendas: 2000,
      depositos: 0,
      saldo: -2000,
      status: "Aguardando",
    },
  ];

  const filteredRows = rows.filter((row) => {
    const matchStatus =
      statusFilter === "Todos" || row.status === statusFilter;

    const formattedFilterDate =
      date.slice(8, 10) + "/" + date.slice(5, 7);

    const matchDate = formattedFilterDate === row.data;

    return matchStatus && matchDate;
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <TextField
          type="date"
          label="Data"
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          sx={{ width: 200 }}
        />

        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: 200 }}
        >
          {statusOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#4A5568",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            paddingX: 4,
            height: "40px",
          }}
        >
          Filtrar
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={filteredRows}
        actionsColumn={{
          label: "Ação",
          render: (row) => (
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                padding: "4px 16px",
                minWidth: "120px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {row.status === "Aberto"
                ? "Conciliar"
                : row.status === "Fechado"
                ? "Ver Detalhes"
                : "Ver"}
            </Button>
          ),
        }}
      />
    </>
  );
}

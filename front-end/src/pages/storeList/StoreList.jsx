import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { DataTable } from "../../components/DataTable";
import { fetchLojas, fetchCaixasByLoja, fetchCaixa } from "../../services/api";

export default function ListaLojas() {
  const navigate = useNavigate();
  const [date, setDate] = useState("2025-11-25");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [rows, setRows] = useState([]);
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(false);

  const statusOptions = ["Todos", "Aberto", "Fechado", "Aguardando"];

  // Fetch lojas on component mount
  useEffect(() => {
    const loadLojas = async () => {
      try {
        const lojasData = await fetchLojas();
        setLojas(lojasData);
      } catch (error) {
        console.error("Error fetching lojas:", error);
      }
    };

    loadLojas();
  }, []);

  // Format date for API (DD/MM/YYYY)
  const formatDateForApi = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Fetch caixas when date changes
  useEffect(() => {
    const loadCaixas = async () => {
      if (lojas.length === 0) return;

      setLoading(true);
      try {
        const caixasPerLoja = await Promise.all(
          lojas.map(async (loja) => {
            try {
              const caixas = await fetchCaixasByLoja(loja.id, formatDateForApi(date));

              // Fetch detailed info for each caixa to get vendas and depositos
              const detailedCaixas = await Promise.all(
                caixas.map(async (caixa) => {
                  try {
                    const detailedCaixa = await fetchCaixa(caixa.id);
                    return detailedCaixa;
                  } catch (error) {
                    console.error(`Error fetching detailed caixa ${caixa.id}:`, error);
                    return caixa;
                  }
                })
              );

              return detailedCaixas.map((caixa) => ({
                id: caixa.id,
                loja: loja.nome,
                lojaId: loja.id,
                data: date.slice(8, 10) + "/" + date.slice(5, 7),
                vendas: caixa.vendas?.reduce((sum, v) => sum + parseFloat(v.valor || 0), 0) || 0,
                depositos: caixa.depositos?.reduce((sum, d) => sum + parseFloat(d.valor || 0), 0) || 0,
                saldo: (caixa.vendas?.reduce((sum, v) => sum + parseFloat(v.valor || 0), 0) || 0) -
                       (caixa.depositos?.reduce((sum, d) => sum + parseFloat(d.valor || 0), 0) || 0),
                status: caixa.status === "ABERTO" ? "Aberto" :
                        caixa.status === "FECHADO" ? "Fechado" : "Aguardando",
                caixaId: caixa.id,
              }));
            } catch (error) {
              console.error(`Error fetching caixas for loja ${loja.id}:`, error);
              return [];
            }
          })
        );

        const allCaixas = caixasPerLoja.flat();
        setRows(allCaixas);
      } finally {
        setLoading(false);
      }
    };

    loadCaixas();
  }, [date, lojas]);

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

  const filteredRows = rows.filter((row) => {
    const matchStatus =
      statusFilter === "Todos" || row.status === statusFilter;

    return matchStatus;
  });

  const handleNavigateToConciliacao = (row) => {
    navigate(`/conciliacao?caixaId=${row.caixaId}`);
  };

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

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && filteredRows.length === 0 && (
        <Alert severity="info">
          Nenhum caixa encontrado para a data e filtros selecionados.
        </Alert>
      )}

      {!loading && filteredRows.length > 0 && (
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
              onClick={() => handleNavigateToConciliacao(row)}
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
      )}
    </>
  );
}

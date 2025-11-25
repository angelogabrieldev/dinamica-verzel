import { Button, Chip } from "@mui/material";
import { DataTable } from "../components/DataTable";

export default function ListaLojas() {
  const columns = [
    { label: "Loja", key: "loja" },
    { label: "Data", key: "data" },
    { label: "Vendas (R$)", key: "vendas" },
    { label: "Depósitos (R$)", key: "depositos" },
    {
      label: "Saldo (R$)",
      key: "saldo",
      render: (value) => (
        <span style={{ color: value < 0 ? "red" : "green" }}>
          {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (value) => {
        const colors = {
          Aberto: "error",
          Fechado: "success",
          Aguardando: "warning",
        };

        return (
          <Chip label={value} color={colors[value]} variant="filled" />
        );
      },
    },
  ];

  const rows = [
    {
      id: 1,
      loja: "Loja Centro",
      data: "25/11",
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

  return (
    <DataTable
      columns={columns}
      rows={rows}
      actionsColumn={{
        label: "Ação",
        render: (row) => (
          <Button variant="outlined" size="small">
            {row.status === "Aberto"
              ? "Conciliar"
              : row.status === "Fechado"
              ? "Ver Detalhes"
              : "Ver"}
          </Button>
        ),
      }}
    />
  );
}

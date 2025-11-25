import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export function DataTable({
  columns = [],
  rows = [],
  actionsColumn = null,
  rowKey = "id",
  sx = {},
}) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid #E0E4E7",
        ...sx,
      }}
    >
      <Table sx={{ minWidth: "100%" }}>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "#F5F7FA",
              borderBottom: "2px solid #E1E4E8",
            }}
          >
            {columns.map((col) => (
              <TableCell
                key={col.key}
                sx={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "#4A4A4A",
                  padding: "12px 16px",
                }}
                align={col.align || "left"}
              >
                {col.label}
              </TableCell>
            ))}

            {actionsColumn && (
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "#4A4A4A",
                  padding: "12px 16px",
                }}
              >
                {actionsColumn.label}
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row[rowKey]}
              sx={{
                "&:hover": { backgroundColor: "#F9FAFB" },
                borderBottom: "1px solid #EDF0F2",
              }}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  sx={{
                    padding: "14px 16px",
                    fontSize: "0.95rem",
                    color: "#333",
                  }}
                  align={col.align || "left"}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </TableCell>
              ))}

              {actionsColumn && (
                <TableCell sx={{ padding: "14px 16px" }}>
                  {actionsColumn.render(row)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

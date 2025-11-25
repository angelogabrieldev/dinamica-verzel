import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from "@mui/material";

export function DataTable({
  columns = [],
  rows = [],
  actionsColumn = null,
  rowKey = "id",
  sx = {},
}) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, ...sx }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key} sx={{ fontWeight: 600 }}>
                {col.label}
              </TableCell>
            ))}

            {actionsColumn && (
              <TableCell sx={{ fontWeight: 600 }}>{actionsColumn.label}</TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row[rowKey]}>
              {columns.map((col) => (
                <TableCell key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </TableCell>
              ))}

              {actionsColumn && (
                <TableCell>{actionsColumn.render(row)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

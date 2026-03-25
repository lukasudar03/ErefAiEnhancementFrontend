import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { getRoles } from "../api/roleService";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(data);
      } catch (err) {
        console.log(err);
        setError("Failed to load roles.");
      }
    };

    loadRoles();
  }, []);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}
        >
          Roles
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748b" }}>
          Pregled dostupnih korisničkih uloga u sistemu.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
          {error}
        </Alert>
      )}

      <Card
        sx={{
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
          border: "1px solid #e2e8f0",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              px: 3,
              py: 2.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#0f172a" }}
              >
                Roles List
              </Typography>
            </Box>

            <Chip
              label={`${roles.length} roles`}
              sx={{
                fontWeight: 700,
                backgroundColor: "#dbeafe",
                color: "#1d4ed8",
                borderRadius: "10px",
              }}
            />
          </Box>

          <Divider />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Role Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Preview</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <TableRow key={role.id} hover>
                      <TableCell sx={{ fontWeight: 600, color: "#0f172a" }}>
                        {role.roleName}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={role.roleName}
                          size="small"
                          sx={{
                            borderRadius: "8px",
                            fontWeight: 600,
                            backgroundColor: "#eef2ff",
                            color: "#3730a3",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Box sx={{ py: 4, textAlign: "center", color: "#64748b" }}>
                        No roles found.
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
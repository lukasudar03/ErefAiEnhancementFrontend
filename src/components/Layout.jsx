import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  Stack,
} from "@mui/material";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAtUtc");
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Users", path: "/users" },
    { label: "Roles", path: "/roles" },
    { label: "Subjects", path: "/subjects" },
  ];

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "#ffffff",
          color: "#0f172a",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Toolbar
          sx={{
            minHeight: 72,
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={4} alignItems="center">
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "#1e293b",
                letterSpacing: "0.3px",
              }}
            >
              ErefAI Admin
            </Typography>

            <Stack direction="row" spacing={1}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <Button
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    variant={isActive ? "contained" : "text"}
                    sx={{
                      minWidth: "auto",
                      px: 2,
                      py: 1,
                      borderRadius: "10px",
                      fontWeight: 600,
                      color: isActive ? "#ffffff" : "#334155",
                      backgroundColor: isActive ? "#2563eb" : "transparent",
                      "&:hover": {
                        backgroundColor: isActive ? "#1d4ed8" : "#e2e8f0",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>
          </Stack>

          <Button
            onClick={handleLogout}
            variant="outlined"
            sx={{
              borderRadius: "10px",
              fontWeight: 600,
              borderColor: "#cbd5e1",
              color: "#334155",
              "&:hover": {
                borderColor: "#94a3b8",
                backgroundColor: "#f8fafc",
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
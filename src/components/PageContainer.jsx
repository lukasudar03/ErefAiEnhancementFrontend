import { Box, Container } from "@mui/material";

export default function PageContainer({ children, maxWidth = "xl" }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        py: 4,
      }}
    >
      <Container maxWidth={maxWidth}>{children}</Container>
    </Box>
  );
}
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { departmentOptions, yearOptions } from "../constants/subjectOptions";

export default function SubjectFormDialog({
  open,
  onClose,
  onSubmit,
  loading,
  error,
  title,
  subtitle,
  submitText,
  formData,
  onChange,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: "22px",
          overflow: "hidden",
          maxHeight: "90vh",
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2.2,
          borderBottom: "1px solid #e2e8f0",
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1.2rem",
              color: "#0f172a",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              mt: 0.5,
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          disabled={loading}
          sx={{
            color: "#475569",
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            "&:hover": {
              backgroundColor: "#f1f5f9",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box component="form" onSubmit={onSubmit}>
        <DialogContent sx={{ px: 3, py: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "grid", gap: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={onChange}
              fullWidth
              required
            />

            <FormControl fullWidth required>
              <InputLabel>Year of Study</InputLabel>
              <Select
                label="Year of Study"
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={onChange}
              >
                {yearOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Department</InputLabel>
              <Select
                label="Department"
                name="department"
                value={formData.department}
                onChange={onChange}
              >
                {departmentOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  name="required"
                  checked={formData.required}
                  onChange={onChange}
                />
              }
              label={formData.required ? "Required subject" : "Optional subject"}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2.5 }}>
          <Button
            onClick={onClose}
            disabled={loading}
            variant="outlined"
            sx={{ borderRadius: "10px", fontWeight: 600 }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            sx={{ borderRadius: "10px", fontWeight: 700 }}
          >
            {loading ? "Saving..." : submitText}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
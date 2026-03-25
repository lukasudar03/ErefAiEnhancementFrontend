import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";
import { departmentOptions, yearOptions } from "../constants/subjectOptions";

export default function UserFormDialog({
  open,
  onClose,
  onSubmit,
  loading,
  error,
  roles,
  formData,
  studentData,
  professorData,
  onUserChange,
  onStudentChange,
  onProfessorChange,
  groupedProfessorSubjects,
}) {
  const selectedRole = roles.find((r) => r.id === formData.roleId);
  const selectedRoleName = selectedRole?.roleName;

  const [expandedYears, setExpandedYears] = useState({});
  const [expandedDepartments, setExpandedDepartments] = useState({});

  const toggleYear = (yearKey) => {
    setExpandedYears((prev) => ({
      ...prev,
      [yearKey]: !prev[yearKey],
    }));
  };

  const toggleDepartment = (yearKey, departmentKey) => {
    const key = `${yearKey}-${departmentKey}`;

    setExpandedDepartments((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{
            sx: {
            borderRadius: "22px",
            overflow: "hidden",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
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
            Add User
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              mt: 0.5,
            }}
          >
            Kreiraj korisnika i po potrebi poveži dodatne podatke za studenta ili profesora.
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
        <DialogContent
            sx={{
                px: 3,
                py: 3,
                overflowY: "auto",
                maxHeight: "70vh",
            }}
            >
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "grid", gap: 2 }}>
            <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>
              Basic Information
            </Typography>

            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={onUserChange}
              fullWidth
              required
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onUserChange}
              fullWidth
              required
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={onUserChange}
              fullWidth
              required
            />

            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                name="roleId"
                value={formData.roleId}
                onChange={onUserChange}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.roleName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedRoleName === "Student" && (
              <>
                <Typography sx={{ fontWeight: 700, color: "#0f172a", mt: 1 }}>
                  Student Details
                </Typography>

                <TextField
                  label="Index Number"
                  name="indexNumber"
                  value={studentData.indexNumber}
                  onChange={onStudentChange}
                  fullWidth
                  required
                />

                <FormControl fullWidth required>
                  <InputLabel>Year of Study</InputLabel>
                  <Select
                    label="Year of Study"
                    name="yearOfStudy"
                    value={studentData.yearOfStudy}
                    onChange={onStudentChange}
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
                    value={studentData.department}
                    onChange={onStudentChange}
                  >
                    {departmentOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={studentData.dateOfBirth}
                  onChange={onStudentChange}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </>
            )}

            {selectedRoleName === "Professor" && (
              <>
                <Typography sx={{ fontWeight: 700, color: "#0f172a", mt: 1 }}>
                  Professor Details
                </Typography>

                <Typography variant="body2" sx={{ color: "#64748b", mb: 1 }}>
                  Označi slobodne predmete grupisane po godini i departmentu.
                </Typography>

                {groupedProfessorSubjects?.length > 0 ? (
                  <Stack spacing={2}>
                    {groupedProfessorSubjects.map((yearGroup) => {
                      const isYearExpanded = !!expandedYears[yearGroup.yearKey];

                      return (
                        <Paper
                          key={yearGroup.yearKey}
                          elevation={0}
                          sx={{
                            border: "1px solid #e2e8f0",
                            borderRadius: "16px",
                            overflow: "hidden",
                            backgroundColor: "#ffffff",
                          }}
                        >
                          <Box
                            onClick={() => toggleYear(yearGroup.yearKey)}
                            sx={{
                              px: 2,
                              py: 1.75,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              cursor: "pointer",
                              backgroundColor: "#f8fafc",
                              borderBottom: isYearExpanded
                                ? "1px solid #e2e8f0"
                                : "none",
                            }}
                          >
                            {isYearExpanded ? (
                              <ExpandMoreIcon sx={{ color: "#475569" }} />
                            ) : (
                              <ChevronRightIcon sx={{ color: "#475569" }} />
                            )}

                            <Typography
                              sx={{
                                fontWeight: 800,
                                color: "#0f172a",
                              }}
                            >
                              {yearGroup.yearLabel}
                            </Typography>
                          </Box>

                          {isYearExpanded && (
                            <Box sx={{ p: 2 }}>
                              <Stack spacing={1.5}>
                                {yearGroup.departments.map((departmentGroup) => {
                                  const deptKey = `${yearGroup.yearKey}-${departmentGroup.departmentKey}`;
                                  const isDepartmentExpanded =
                                    !!expandedDepartments[deptKey];

                                  return (
                                    <Paper
                                      key={deptKey}
                                      elevation={0}
                                      sx={{
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "14px",
                                        overflow: "hidden",
                                        backgroundColor: "#fcfcfd",
                                      }}
                                    >
                                      <Box
                                        onClick={() =>
                                          toggleDepartment(
                                            yearGroup.yearKey,
                                            departmentGroup.departmentKey
                                          )
                                        }
                                        sx={{
                                          px: 2,
                                          py: 1.5,
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                          cursor: "pointer",
                                          backgroundColor: "#f8fafc",
                                          borderBottom: isDepartmentExpanded
                                            ? "1px solid #e2e8f0"
                                            : "none",
                                        }}
                                      >
                                        {isDepartmentExpanded ? (
                                          <ExpandMoreIcon
                                            sx={{ color: "#64748b", fontSize: 20 }}
                                          />
                                        ) : (
                                          <ChevronRightIcon
                                            sx={{ color: "#64748b", fontSize: 20 }}
                                          />
                                        )}

                                        <Typography
                                          sx={{
                                            fontWeight: 700,
                                            color: "#1e293b",
                                          }}
                                        >
                                          {departmentGroup.departmentLabel}
                                        </Typography>
                                      </Box>

                                      {isDepartmentExpanded && (
                                        <Box sx={{ px: 2, py: 1.5 }}>
                                          {departmentGroup.subjects.length > 0 ? (
                                            <Stack spacing={0.5}>
                                              {departmentGroup.subjects.map((subject) => (
                                                <FormControlLabel
                                                  key={subject.id}
                                                  control={
                                                    <Checkbox
                                                      checked={professorData.subjectIds.includes(
                                                        subject.id
                                                      )}
                                                      onChange={() =>
                                                        onProfessorChange(subject.id)
                                                      }
                                                    />
                                                  }
                                                  label={subject.name}
                                                  sx={{
                                                    ml: 0.2,
                                                    "& .MuiFormControlLabel-label": {
                                                      color: "#334155",
                                                    },
                                                  }}
                                                />
                                              ))}
                                            </Stack>
                                          ) : (
                                            <Typography
                                              variant="body2"
                                              sx={{ color: "#64748b" }}
                                            >
                                              Nema slobodnih predmeta.
                                            </Typography>
                                          )}
                                        </Box>
                                      )}
                                    </Paper>
                                  );
                                })}
                              </Stack>
                            </Box>
                          )}
                        </Paper>
                      );
                    })}
                  </Stack>
                ) : (
                  <Alert severity="info" sx={{ borderRadius: "12px" }}>
                    Nema dostupnih predmeta za dodelu profesorima.
                  </Alert>
                )}
              </>
            )}
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
            {loading ? "Saving..." : "Create User"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
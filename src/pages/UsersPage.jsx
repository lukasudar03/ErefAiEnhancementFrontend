import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { getUsers, createUser, updateUser, deleteUser } from "../api/userService";
import { getRoles } from "../api/roleService";
import { getAvailableSubjects } from "../api/subjectService";
import { getStudents, createStudent, deleteStudent } from "../api/studentService";
import {
  getProfessors,
  createProfessor,
  deleteProfessor,
} from "../api/professorService";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [expandedYear, setExpandedYear] = useState(null);
  const [expandedDepartment, setExpandedDepartment] = useState(null);

  const [error, setError] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [selectedProfessorYear, setSelectedProfessorYear] = useState("");
  const [selectedProfessorDepartment, setSelectedProfessorDepartment] = useState("");

  const [openEditModal, setOpenEditModal] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    roleId: "",
  });

  const yearOptions = [
    { value: 1, label: "Prva" },
    { value: 2, label: "Druga" },
    { value: 3, label: "Treća" },
    { value: 4, label: "Master 1" },
    { value: 5, label: "Master 2" },
  ];

  const departmentOptions = [
    { value: 1, label: "Informatika" },
    { value: 2, label: "Mehatronika" },
    { value: 3, label: "Elektrotehnika" },
    { value: 4, label: "Mašinstvo" },
    { value: 5, label: "Inženjerski menadžment" },
  ];

  const filteredProfessorSubjects =
    selectedProfessorYear && selectedProfessorDepartment
      ? subjects.filter(
          (subject) =>
            Number(subject.yearOfStudy) === Number(selectedProfessorYear) &&
            Number(subject.department) === Number(selectedProfessorDepartment)
        )
      : [];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  });

  const [studentData, setStudentData] = useState({
    userId: "",
    indexNumber: "",
    yearOfStudy: "",
    dateOfBirth: "",
    department: "",
  });

  const [professorData, setProfessorData] = useState({
    userId: "",
    subjectIds: [],
  });

  const selectedRole = roles.find((r) => r.id === formData.roleId);
  const selectedRoleName = selectedRole?.roleName;

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.log(err);
      setError("Failed to load users.");
    }
  };

  const loadRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (err) {
      console.log(err);
      setError("Failed to load roles.");
    }
  };

  const loadSubjects = async () => {
    try {
      const data = await getAvailableSubjects();
      setSubjects(data);
    } catch (err) {
      console.log(err);
      setError("Failed to load subjects.");
    }
  };

  useEffect(() => {
    loadUsers();
    loadRoles();
    loadSubjects();
  }, []);

  const yearLabels = Object.fromEntries(yearOptions.map((y) => [y.value, y.label]));
  const departmentLabels = Object.fromEntries(
    departmentOptions.map((d) => [d.value, d.label])
  );

  const groupedSubjects = subjects.reduce((acc, subject) => {
    const yearKey = subject.yearOfStudy;
    const departmentKey = subject.department;

    if (!acc[yearKey]) {
      acc[yearKey] = {};
    }

    if (!acc[yearKey][departmentKey]) {
      acc[yearKey][departmentKey] = [];
    }

    acc[yearKey][departmentKey].push(subject);
    return acc;
  }, {});

  const handleOpenCreateModal = () => {
    setError("");
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    if (loadingCreate) return;
    resetForm();
    setOpenCreateModal(false);
  };

  const handleYearToggle = (year) => {
    setExpandedDepartment(null);
    setExpandedYear((prev) => (prev === year ? null : year));
  };

  const handleDepartmentToggle = (department) => {
    setExpandedDepartment((prev) => (prev === department ? null : department));
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "roleId") {
      setStudentData({
        userId: "",
        indexNumber: "",
        yearOfStudy: "",
        dateOfBirth: "",
        department: "",
      });

      setProfessorData({
        userId: "",
        subjectIds: [],
      });

      setSelectedProfessorYear("");
      setSelectedProfessorDepartment("");
      setExpandedYear(null);
      setExpandedDepartment(null);
    }
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfessorSubjectChange = (subjectId) => {
    setProfessorData((prev) => {
      const alreadySelected = prev.subjectIds.includes(subjectId);

      if (alreadySelected) {
        return {
          ...prev,
          subjectIds: prev.subjectIds.filter((id) => id !== subjectId),
        };
      }

      return {
        ...prev,
        subjectIds: [...prev.subjectIds, subjectId],
      };
    });
  };

  const handleOpenEditModal = (user) => {
    const matchedRole = roles.find((role) => role.roleName === user.roleName);

    setEditingUserId(user.id);
    setEditFormData({
      name: user.name || "",
      email: user.email || "",
      roleId: matchedRole?.id || "",
    });

    setError("");
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    if (loadingEdit) return;

    setOpenEditModal(false);
    setEditingUserId(null);
    setEditFormData({
      name: "",
      email: "",
      roleId: "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingEdit(true);

    try {
      await updateUser(editingUserId, editFormData);
      await loadUsers();
      handleCloseEditModal();
    } catch (err) {
      console.log(err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.title ||
          "Failed to update user."
      );
    } finally {
      setLoadingEdit(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      roleId: "",
    });

    setStudentData({
      userId: "",
      indexNumber: "",
      yearOfStudy: "",
      dateOfBirth: "",
      department: "",
    });

    setProfessorData({
      userId: "",
      subjectIds: [],
    });

    setSelectedProfessorYear("");
    setSelectedProfessorDepartment("");
    setExpandedYear(null);
    setExpandedDepartment(null);
    setError("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingCreate(true);

    let createdUser = null;

    try {
      createdUser = await createUser(formData);

      if (selectedRoleName === "Student") {
        await createStudent({
          userId: createdUser.id,
          indexNumber: studentData.indexNumber,
          yearOfStudy: Number(studentData.yearOfStudy),
          dateOfBirth: studentData.dateOfBirth,
          department: Number(studentData.department),
        });
      }

      if (selectedRoleName === "Professor") {
        if (professorData.subjectIds.length === 0) {
          setError("Please select at least one subject.");
          setLoadingCreate(false);
          return;
        }

        await createProfessor({
          userId: createdUser.id,
          subjectIds: professorData.subjectIds,
        });
      }

      await loadUsers();
      await loadSubjects();
      resetForm();
      setOpenCreateModal(false);
    } catch (err) {
      console.log(err);
      console.log(err?.response?.data);

      if (createdUser?.id && (selectedRoleName === "Student" || selectedRoleName === "Professor")) {
        try {
          await deleteUser(createdUser.id);
        } catch (rollbackErr) {
          console.log("Rollback failed:", rollbackErr);
        }
      }

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.title ||
          "Failed to create user."
      );
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleDelete = async (user) => {
    try {
      if (user.roleName === "Student") {
        const students = await getStudents();
        const studentRecord = students.find((s) => s.userId === user.id);

        if (studentRecord) {
          await deleteStudent(studentRecord.id);
        }
      }

      if (user.roleName === "Professor") {
        const professors = await getProfessors();
        const professorRecord = professors.find((p) => p.userId === user.id);

        if (professorRecord) {
          await deleteProfessor(professorRecord.id);
        }
      }

      await deleteUser(user.id);
      await loadUsers();
      await loadSubjects();
    } catch (err) {
      console.log(err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.title ||
          "Failed to delete user."
      );
    }
  };

  const handleEditClick = (user) => {
    handleOpenEditModal(user);
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}
          >
            Users
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b" }}>
            Pregled, dodavanje i upravljanje korisnicima.
          </Typography>
        </Box>

        <Button
          onClick={handleOpenCreateModal}
          sx={{
            height: 44,
            px: 3,
            borderRadius: "12px",
            fontWeight: 700,
          }}
        >
          Add User
        </Button>
      </Stack>

      {error && !openCreateModal && (
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
                Users List
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
                Trenutno registrovani korisnici u sistemu.
              </Typography>
            </Box>

            <Chip
              label={`${users.length} users`}
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
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow
                      key={user.id}
                      hover
                      sx={{
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.roleName}
                          size="small"
                          sx={{
                            borderRadius: "8px",
                            fontWeight: 600,
                            backgroundColor: "#eef2ff",
                            color: "#3730a3",
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Button
                            variant="outlined"
                            onClick={() => handleEditClick(user)}
                            sx={{ borderRadius: "10px", fontWeight: 600 }}
                          >
                            Edit
                          </Button>

                          <Button
                            color="error"
                            variant="outlined"
                            onClick={() => handleDelete(user)}
                            sx={{ borderRadius: "10px", fontWeight: 600 }}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Box sx={{ py: 4, textAlign: "center", color: "#64748b" }}>
                        No users found.
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: "22px",
            overflow: "hidden",
            width: "100%",
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
            background:
              "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
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
              Unesi podatke i kreiraj novog korisnika.
            </Typography>
          </Box>

          <IconButton
            onClick={handleCloseCreateModal}
            disabled={loadingCreate}
            sx={{
              color: "#475569",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              "&:hover": {
                backgroundColor: "#e2e8f0",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box component="form" onSubmit={handleCreate}>
          <DialogContent
            dividers
            sx={{
              px: 3,
              py: 3,
              backgroundColor: "#f8fafc",
              maxHeight: "calc(90vh - 150px)",
              overflowY: "auto",
            }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
                {error}
              </Alert>
            )}

            <Stack spacing={2.5}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: "18px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    mb: 2,
                  }}
                >
                  Basic information
                </Typography>

                <Stack spacing={2}>
                  <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleUserChange}
                    required
                  />

                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleUserChange}
                    required
                  />

                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleUserChange}
                    required
                  />

                  <FormControl fullWidth required>
                    <InputLabel>Role</InputLabel>
                    <Select
                      label="Role"
                      name="roleId"
                      value={formData.roleId}
                      onChange={handleUserChange}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.roleName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Paper>

              {selectedRoleName === "Student" && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: "18px",
                    border: "1px solid #dbeafe",
                    background:
                      "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#1e3a8a",
                      mb: 2,
                    }}
                  >
                    Student details
                  </Typography>

                  <Stack spacing={2}>
                    <TextField
                      label="Index Number"
                      name="indexNumber"
                      value={studentData.indexNumber}
                      onChange={handleStudentChange}
                      required
                    />

                    <FormControl fullWidth required>
                      <InputLabel>Year of Study</InputLabel>
                      <Select
                        label="Year of Study"
                        name="yearOfStudy"
                        value={studentData.yearOfStudy}
                        onChange={handleStudentChange}
                      >
                        {yearOptions.map((year) => (
                          <MenuItem key={year.value} value={year.value}>
                            {year.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={studentData.dateOfBirth}
                      onChange={handleStudentChange}
                      InputLabelProps={{ shrink: true }}
                      required
                    />

                    <FormControl fullWidth required>
                      <InputLabel>Department</InputLabel>
                      <Select
                        label="Department"
                        name="department"
                        value={studentData.department}
                        onChange={handleStudentChange}
                      >
                        {departmentOptions.map((department) => (
                          <MenuItem key={department.value} value={department.value}>
                            {department.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Paper>
              )}

              {selectedRoleName === "Professor" && (
                <Box sx={{ mt: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#0f172a",
                      mb: 1.5,
                    }}
                  >
                    Professor details
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      mb: 2,
                    }}
                  >
                    Izaberi godinu, zatim department, pa predmete.
                  </Typography>

                  {Object.keys(groupedSubjects).length > 0 ? (
                    <Stack spacing={1.25}>
                      {Object.keys(groupedSubjects)
                        .sort((a, b) => Number(a) - Number(b))
                        .map((yearKey) => {
                          const yearNumber = Number(yearKey);

                          return (
                            <Accordion
                              key={yearKey}
                              expanded={expandedYear === yearNumber}
                              onChange={() => handleYearToggle(yearNumber)}
                              disableGutters
                              elevation={0}
                              sx={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "14px !important",
                                backgroundColor: "#ffffff",
                                overflow: "hidden",
                                "&:before": {
                                  display: "none",
                                },
                              }}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                  px: 2,
                                  py: 0.5,
                                  minHeight: 56,
                                  "& .MuiAccordionSummary-content": {
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    my: 1,
                                  },
                                }}
                              >
                                <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>
                                  {yearLabels[yearNumber] || yearKey}
                                </Typography>
                              </AccordionSummary>

                              <AccordionDetails
                                sx={{
                                  pt: 0,
                                  pb: 1.5,
                                  px: 1.5,
                                  backgroundColor: "#f8fafc",
                                }}
                              >
                                <Stack spacing={1}>
                                  {Object.keys(groupedSubjects[yearKey])
                                    .sort((a, b) => Number(a) - Number(b))
                                    .map((departmentKey) => {
                                      const departmentNumber = Number(departmentKey);

                                      return (
                                        <Accordion
                                          key={departmentKey}
                                          expanded={
                                            expandedYear === yearNumber &&
                                            expandedDepartment === departmentNumber
                                          }
                                          onChange={() => handleDepartmentToggle(departmentNumber)}
                                          disableGutters
                                          elevation={0}
                                          sx={{
                                            border: "1px solid #dbeafe",
                                            borderRadius: "12px !important",
                                            backgroundColor: "#ffffff",
                                            overflow: "hidden",
                                            "&:before": {
                                              display: "none",
                                            },
                                          }}
                                        >
                                          <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            sx={{
                                              px: 2,
                                              py: 0.25,
                                              minHeight: 50,
                                              "& .MuiAccordionSummary-content": {
                                                my: 1,
                                              },
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                fontWeight: 600,
                                                color: "#1e3a8a",
                                              }}
                                            >
                                              {departmentLabels[departmentNumber] || departmentKey}
                                            </Typography>
                                          </AccordionSummary>

                                          <AccordionDetails
                                            sx={{
                                              px: 2,
                                              pb: 1.5,
                                              pt: 0.5,
                                              backgroundColor: "#ffffff",
                                            }}
                                          >
                                            <Stack spacing={0.5}>
                                              {groupedSubjects[yearKey][departmentKey].map((subject) => (
                                                <FormControlLabel
                                                  key={subject.id}
                                                  sx={{
                                                    mx: 0,
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: "10px",
                                                    "&:hover": {
                                                      backgroundColor: "#f8fafc",
                                                    },
                                                  }}
                                                  control={
                                                    <Checkbox
                                                      checked={professorData.subjectIds.includes(subject.id)}
                                                      onChange={() =>
                                                        handleProfessorSubjectChange(subject.id)
                                                      }
                                                    />
                                                  }
                                                  label={
                                                    <Typography sx={{ fontSize: "0.95rem" }}>
                                                      {subject.name}
                                                    </Typography>
                                                  }
                                                />
                                              ))}
                                            </Stack>
                                          </AccordionDetails>
                                        </Accordion>
                                      );
                                    })}
                                </Stack>
                              </AccordionDetails>
                            </Accordion>
                          );
                        })}
                    </Stack>
                  ) : (
                    <Alert severity="info" sx={{ borderRadius: "12px" }}>
                      No available subjects.
                    </Alert>
                  )}
                </Box>
              )}
            </Stack>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              py: 2.2,
              borderTop: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Popuni obavezna polja pre čuvanja.
            </Typography>

            <Stack direction="row" spacing={1.5}>
              <Button
                type="button"
                variant="outlined"
                onClick={handleCloseCreateModal}
                disabled={loadingCreate}
                sx={{ borderRadius: "12px", fontWeight: 700 }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loadingCreate}
                sx={{ borderRadius: "12px", fontWeight: 700, px: 3 }}
              >
                {loadingCreate ? "Creating..." : "Create User"}
              </Button>
            </Stack>
          </DialogActions>
        </Box>
      </Dialog>
      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
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
              Edit User
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                mt: 0.5,
              }}
            >
              Izmeni osnovne podatke korisnika.
            </Typography>
          </Box>

          <IconButton
            onClick={handleCloseEditModal}
            disabled={loadingEdit}
            sx={{
              color: "#475569",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              "&:hover": {
                backgroundColor: "#e2e8f0",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box component="form" onSubmit={handleEditSubmit}>
          <DialogContent
            dividers
            sx={{
              px: 3,
              py: 3,
              backgroundColor: "#f8fafc",
            }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
                {error}
              </Alert>
            )}

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: "18px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#0f172a",
                  mb: 2,
                }}
              >
                Basic information
              </Typography>

              <Stack spacing={2}>
                <TextField
                  label="Name"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  required
                />

                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  required
                />

                <FormControl fullWidth required>
                  <InputLabel>Role</InputLabel>
                  <Select
                    label="Role"
                    name="roleId"
                    value={editFormData.roleId}
                    onChange={handleEditChange}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.roleName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Paper>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              py: 2.2,
              borderTop: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Sačuvaj izmene korisnika.
            </Typography>

            <Stack direction="row" spacing={1.5}>
              <Button
                type="button"
                variant="outlined"
                onClick={handleCloseEditModal}
                disabled={loadingEdit}
                sx={{ borderRadius: "12px", fontWeight: 700 }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loadingEdit}
                sx={{ borderRadius: "12px", fontWeight: 700, px: 3 }}
              >
                {loadingEdit ? "Saving..." : "Save Changes"}
              </Button>
            </Stack>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { getUsers, createUser, deleteUser } from "../api/userService";
import { getRoles } from "../api/roleService";
import { getAvailableSubjects } from "../api/subjectService";
import { createStudent } from "../api/studentService";
import { createProfessor } from "../api/professorService";
import UserFormDialog from "../components/UserFormDialog";
import {
  departmentLabelMap,
  yearLabelMap,
} from "../constants/subjectOptions";

const emptyUserForm = {
  name: "",
  email: "",
  password: "",
  roleId: "",
};

const emptyStudentForm = {
  userId: "",
  indexNumber: "",
  yearOfStudy: "",
  dateOfBirth: "",
  department: "",
};

const emptyProfessorForm = {
  userId: "",
  subjectIds: [],
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const [formData, setFormData] = useState(emptyUserForm);
  const [studentData, setStudentData] = useState(emptyStudentForm);
  const [professorData, setProfessorData] = useState(emptyProfessorForm);

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

  const selectedRole = roles.find((r) => r.id === formData.roleId);
  const selectedRoleName = selectedRole?.roleName;

  const groupedProfessorSubjects = useMemo(() => {
    const grouped = {};

    subjects.forEach((subject) => {
      const yearKey = Number(subject.yearOfStudy);
      const departmentKey = Number(subject.department);

      if (!grouped[yearKey]) {
        grouped[yearKey] = {
          yearKey,
          yearLabel: yearLabelMap[yearKey] || `Year ${yearKey}`,
          departments: {},
        };
      }

      if (!grouped[yearKey].departments[departmentKey]) {
        grouped[yearKey].departments[departmentKey] = {
          departmentKey,
          departmentLabel:
            departmentLabelMap[departmentKey] || `Department ${departmentKey}`,
          subjects: [],
        };
      }

      grouped[yearKey].departments[departmentKey].subjects.push(subject);
    });

    return Object.values(grouped)
      .sort((a, b) => a.yearKey - b.yearKey)
      .map((yearGroup) => ({
        ...yearGroup,
        departments: Object.values(yearGroup.departments).sort(
          (a, b) => a.departmentKey - b.departmentKey
        ),
      }));
  }, [subjects]);

  const resetForm = () => {
    setFormData(emptyUserForm);
    setStudentData(emptyStudentForm);
    setProfessorData(emptyProfessorForm);
  };

  const handleOpenCreateModal = () => {
    setError("");
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    if (loadingCreate) return;
    resetForm();
    setOpenCreateModal(false);
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "roleId") {
      setStudentData(emptyStudentForm);
      setProfessorData(emptyProfessorForm);
    }
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;

    setStudentData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        await createProfessor({
          userId: createdUser.id,
          subjectIds: professorData.subjectIds,
        });
      }

      await loadUsers();
      handleCloseCreateModal();
    } catch (err) {
      console.log(err);
      console.log(err?.response?.data);

      if (
        createdUser?.id &&
        (selectedRoleName === "Student" || selectedRoleName === "Professor")
      ) {
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

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      console.log(err);
      console.log(err?.response?.data);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.title ||
          "Failed to delete user."
      );
    }
  };

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        flex: 1.2,
        minWidth: 180,
      },
      {
        field: "email",
        headerName: "Email",
        flex: 1.5,
        minWidth: 220,
      },
      {
        field: "roleName",
        headerName: "Role",
        flex: 1,
        minWidth: 140,
        renderCell: (params) => (
          <Chip
            label={params.value}
            size="small"
            sx={{
              borderRadius: "8px",
              fontWeight: 700,
              backgroundColor: "#eff6ff",
              color: "#1d4ed8",
            }}
          />
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        minWidth: 140,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Button
            color="error"
            variant="outlined"
            size="small"
            onClick={() => handleDelete(params.row.id)}
            sx={{ borderRadius: "10px", fontWeight: 600 }}
          >
            Delete
          </Button>
        ),
      },
    ],
    []
  );

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
            Pregled i upravljanje korisnicima u sistemu.
          </Typography>
        </Box>

        <Button
          variant="contained"
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
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Search, sort i pregled svih korisnika.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ height: 600, width: "100%", p: 2 }}>
            <DataGrid
              rows={users}
              columns={columns}
              getRowId={(row) => row.id}
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 20, 50]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 300 },
                },
              }}
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f8fafc",
                  fontWeight: 700,
                },
                "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                  outline: "none",
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      <UserFormDialog
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreate}
        loading={loadingCreate}
        error={openCreateModal ? error : ""}
        roles={roles}
        formData={formData}
        studentData={studentData}
        professorData={professorData}
        onUserChange={handleUserChange}
        onStudentChange={handleStudentChange}
        onProfessorChange={handleProfessorSubjectChange}
        groupedProfessorSubjects={groupedProfessorSubjects}
      />
    </Box>
  );
}
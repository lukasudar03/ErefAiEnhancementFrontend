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
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../api/subjectService";
import SubjectFormDialog from "../components/SubjectFormDialog";
import {
  departmentLabelMap,
  yearLabelMap,
} from "../constants/subjectOptions";

const emptyForm = {
  name: "",
  yearOfStudy: "",
  department: "",
  required: false,
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [formData, setFormData] = useState(emptyForm);
  const [editFormData, setEditFormData] = useState(emptyForm);
  const [editingSubjectId, setEditingSubjectId] = useState(null);

  const loadSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (err) {
      console.log(err);
      setError("Failed to load subjects.");
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const resetCreateForm = () => {
    setFormData(emptyForm);
  };

  const resetEditForm = () => {
    setEditFormData(emptyForm);
    setEditingSubjectId(null);
  };

  const handleOpenCreateModal = () => {
    setError("");
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    if (loadingCreate) return;
    resetCreateForm();
    setOpenCreateModal(false);
  };

  const handleOpenEditModal = (subject) => {
    setError("");
    setEditingSubjectId(subject.id);
    setEditFormData({
      name: subject.name || "",
      yearOfStudy: subject.yearOfStudy ?? "",
      department: subject.department ?? "",
      required: !!subject.required,
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    if (loadingEdit) return;
    resetEditForm();
    setOpenEditModal(false);
  };

  const handleChange = (setter) => (e) => {
    const { name, value, type, checked } = e.target;

    setter((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingCreate(true);

    try {
      await createSubject({
        name: formData.name,
        yearOfStudy: Number(formData.yearOfStudy),
        department: Number(formData.department),
        required: formData.required,
      });

      await loadSubjects();
      handleCloseCreateModal();
    } catch (err) {
      console.log(err);
      console.log(err?.response?.data);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.title ||
          "Failed to create subject."
      );
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingEdit(true);

    try {
      await updateSubject(editingSubjectId, {
        name: editFormData.name,
        yearOfStudy: Number(editFormData.yearOfStudy),
        department: Number(editFormData.department),
        required: editFormData.required,
      });

      await loadSubjects();
      handleCloseEditModal();
    } catch (err) {
      console.log(err);
      console.log(err?.response?.data);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.title ||
          "Failed to update subject."
      );
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSubject(id);
      await loadSubjects();
    } catch (err) {
      console.log(err);
      console.log(err?.response?.data);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.title ||
          "Failed to delete subject."
      );
    }
  };

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        flex: 1.3,
        minWidth: 180,
      },
      {
        field: "yearOfStudy",
        headerName: "Year",
        flex: 1,
        minWidth: 140,
        valueGetter: (_, row) =>
          yearLabelMap[row.yearOfStudy] || row.yearOfStudy,
      },
      {
        field: "department",
        headerName: "Department",
        flex: 1.2,
        minWidth: 180,
        valueGetter: (_, row) =>
          departmentLabelMap[row.department] || row.department,
      },
      {
        field: "required",
        headerName: "Type",
        flex: 1,
        minWidth: 140,
        sortable: true,
        renderCell: (params) =>
          params.value ? (
            <Chip
              label="Required"
              size="small"
              sx={{
                borderRadius: "8px",
                fontWeight: 700,
                backgroundColor: "#dcfce7",
                color: "#166534",
              }}
            />
          ) : (
            <Chip
              label="Optional"
              size="small"
              sx={{
                borderRadius: "8px",
                fontWeight: 700,
                backgroundColor: "#f1f5f9",
                color: "#475569",
              }}
            />
          ),
      },
      {
        field: "actions",
        headerName: "Actions",
        minWidth: 210,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleOpenEditModal(params.row)}
              sx={{ borderRadius: "10px", fontWeight: 600 }}
            >
              Edit
            </Button>

            <Button
              color="error"
              variant="outlined"
              size="small"
              onClick={() => handleDelete(params.row.id)}
              sx={{ borderRadius: "10px", fontWeight: 600 }}
            >
              Delete
            </Button>
          </Stack>
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
            Subjects
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b" }}>
            Pregled i upravljanje predmetima u sistemu.
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
          Add Subject
        </Button>
      </Stack>

      {error && !openCreateModal && !openEditModal && (
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
                Subjects List
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Search, sort i pregled svih predmeta.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ height: 600, width: "100%", p: 2 }}>
            <DataGrid
              rows={subjects}
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

      <SubjectFormDialog
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreate}
        loading={loadingCreate}
        error={openCreateModal ? error : ""}
        title="Add Subject"
        subtitle="Kreiraj novi predmet i odredi da li je obavezan."
        submitText="Create"
        formData={formData}
        onChange={handleChange(setFormData)}
      />

      <SubjectFormDialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        onSubmit={handleEditSubmit}
        loading={loadingEdit}
        error={openEditModal ? error : ""}
        title="Edit Subject"
        subtitle="Izmeni podatke postojećeg predmeta."
        submitText="Save Changes"
        formData={editFormData}
        onChange={handleChange(setEditFormData)}
      />
    </Box>
  );
}
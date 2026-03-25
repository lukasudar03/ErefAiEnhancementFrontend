import { useEffect, useState } from "react";
import { getUsers, createUser, deleteUser } from "../api/userService";
import { getRoles } from "../api/roleService";
import { getAvailableSubjects } from "../api/subjectService";
import { getStudents, createStudent, deleteStudent } from "../api/studentService";
import { getProfessors, createProfessor, deleteProfessor } from "../api/professorService";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [expandedYear, setExpandedYear] = useState(null);
  const [expandedDepartment, setExpandedDepartment] = useState(null);
  const [selectedProfessorYear, setSelectedProfessorYear] = useState("");
  const [selectedProfessorDepartment, setSelectedProfessorDepartment] = useState("");
  const [error, setError] = useState("");

  const yearOptions = [
    { value: 1, label: "Prva" },
    { value: 2, label: "Druga" },
    { value: 3, label: "Treca" },
    { value: 4, label: "Master 1" },
    { value: 5, label: "Master 2" },
  ];

  const yearLabels = Object.fromEntries(
    yearOptions.map((y) => [y.value, y.label])
  );

  const departmentOptions = [
    { value: 1, label: "Informatika" },
    { value: 2, label: "Mehatronika" },
    { value: 3, label: "Elektrotehnika" },
    { value: 4, label: "Masinstvo" },
    { value: 5, label: "Inzenjerski menadzment" },
  ];

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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: ""
  });

  const [studentData, setStudentData] = useState({
    userId: "",
    indexNumber: "",
    yearOfStudy: "",
    dateOfBirth: "",
    department: ""
  });

  const [professorData, setProfessorData] = useState({
    userId: "",
    subjectIds: []
  });

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

  const availableDepartmentsForProfessor = subjects
    .filter(
      (s) => String(s.yearOfStudy) === String(selectedProfessorYear)
    )
    .map((s) => s.department)
    .filter((value, index, self) => self.indexOf(value) === index);

  const filteredProfessorSubjects = subjects.filter(
    (s) =>
      String(s.yearOfStudy) === String(selectedProfessorYear) &&
      String(s.department) === String(selectedProfessorDepartment)
  );

  const handleUserChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;

    setStudentData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfessorChange = (e) => {
    const { name, value } = e.target;

    setProfessorData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfessorSubjectChange = (subjectId) => {
    setProfessorData((prev) => {
        const alreadySelected = prev.subjectIds.includes(subjectId);

        if (alreadySelected) {
        return {
            ...prev,
            subjectIds: prev.subjectIds.filter((id) => id !== subjectId)
        };
        }

        return {
        ...prev,
        subjectIds: [...prev.subjectIds, subjectId]
        };
    });
  };

  const handleProfessorYearChange = (e) => {
    setSelectedProfessorYear(e.target.value);
    setSelectedProfessorDepartment("");
    setProfessorData((prev) => ({ ...prev, subjectIds: [] }));
  };

  const handleProfessorDepartmentChange = (e) => {
    setSelectedProfessorDepartment(e.target.value);
    setProfessorData((prev) => ({ ...prev, subjectIds: [] }));
  };

  const handleYearToggle = (year) => {
    setExpandedDepartment(null);
    setExpandedYear((prev) => (prev === year ? null : year));
  };

  const handleDepartmentToggle = (department) => {
    setExpandedDepartment((prev) => (prev === department ? null : department));
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", roleId: "" });
    setStudentData({ userId: "", indexNumber: "", yearOfStudy: "", dateOfBirth: "", department: "" });
    setProfessorData({ userId: "", subjectIds: [] });
    setSelectedProfessorYear("");
    setSelectedProfessorDepartment("");
    setExpandedYear(null);
    setExpandedDepartment(null);
    setError("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    let createdUser = null;

    try {
      createdUser = await createUser(formData);

      if (selectedRoleName === "Student") {
        await createStudent({
            userId: createdUser.id,
            indexNumber: studentData.indexNumber,
            yearOfStudy: Number(studentData.yearOfStudy),
            dateOfBirth: studentData.dateOfBirth,
            department: Number(studentData.department)
        });
      }

      if (selectedRoleName === "Professor") {
        if (professorData.subjectIds.length === 0) {
          setError("Please select at least one subject.");
          return;
        }

        await createProfessor({
          userId: createdUser.id,
          subjectIds: professorData.subjectIds,
        });
      }

      resetForm();
      await loadUsers();
      await loadSubjects();
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
        err?.response?.data?.message || err?.response?.data?.title || "Failed to delete user."
      );
    }
  };

  return (
    <div>
      <h1>Users</h1>

      <form onSubmit={handleCreate} style={styles.form}>
        <h2>Create User</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleUserChange}
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleUserChange}
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleUserChange}
          style={styles.input}
        />

        <select
          name="roleId"
          value={formData.roleId}
          onChange={handleUserChange}
          style={styles.input}
        >
          <option value="">Select role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.roleName}
            </option>
          ))}
        </select>

        {selectedRoleName === "Student" && (
          <>
            <input
              style={styles.input}
              type="text"
              name="indexNumber"
              placeholder="Index number"
              value={studentData.indexNumber}
              onChange={handleStudentChange}
              required
            />

            <select
              style={styles.input}
              name="yearOfStudy"
              value={studentData.yearOfStudy}
              onChange={handleStudentChange}
              required
            >
              <option value="">Select year of study</option>
              <option value="1">Prva</option>
              <option value="2">Druga</option>
              <option value="3">Treca</option>
              <option value="4">Master 1</option>
              <option value="5">Master 2</option>
            </select>

            <input
              style={styles.input}
              type="date"
              name="dateOfBirth"
              value={studentData.dateOfBirth}
              onChange={handleStudentChange}
              required
            />

            <select
              style={styles.input}
              name="department"
              value={studentData.department}
              onChange={handleStudentChange}
              required
            >
              <option value="">Select department</option>
              {departmentOptions.map((department) => (
                <option key={department.value} value={department.value}>
                  {department.label}
                </option>
              ))}
            </select>
          </>
        )}

        {selectedRoleName === "Professor" && (
          <>
            <div style={styles.subjectBox}>
              <strong>Select subjects</strong>

              {Object.keys(groupedSubjects).length > 0 ? (
                Object.keys(groupedSubjects)
                  .sort((a, b) => Number(a) - Number(b))
                  .map((yearKey) => (
                    <div key={yearKey} style={{ marginTop: "10px" }}>
                      <div
                        style={styles.accordionHeader}
                        onClick={() => handleYearToggle(Number(yearKey))}
                      >
                        {yearLabels[Number(yearKey)] || yearKey}
                      </div>

                      {expandedYear === Number(yearKey) && (
                        <div style={styles.accordionContent}>
                          {Object.keys(groupedSubjects[yearKey])
                            .sort((a, b) => Number(a) - Number(b))
                            .map((departmentKey) => (
                              <div key={departmentKey} style={{ marginTop: "8px" }}>
                                <div
                                  style={styles.accordionSubHeader}
                                  onClick={() =>
                                    handleDepartmentToggle(Number(departmentKey))
                                  }
                                >
                                  {departmentLabels[departmentKey] || departmentKey}
                                </div>

                                {expandedDepartment === Number(departmentKey) && (
                                  <div style={styles.subjectList}>
                                    {groupedSubjects[yearKey][departmentKey].map(
                                      (subject) => (
                                        <label
                                          key={subject.id}
                                          style={styles.checkboxLabel}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={professorData.subjectIds.includes(
                                              subject.id
                                            )}
                                            onChange={() =>
                                              handleProfessorSubjectChange(subject.id)
                                            }
                                          />
                                          {subject.name}
                                        </label>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))
              ) : (
                <span>No available subjects.</span>
              )}
            </div>
          </>
        )}

        <button type="submit">Create User</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%", marginTop: "24px" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.roleName}</td>
              <td>
                <button onClick={() => handleDelete(user)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "400px",
    marginBottom: "24px"
  },
  input: {
    padding: "10px",
    fontSize: "16px"
  },
  subjectBox: {
   display: "flex",
   flexDirection: "column",
   gap: "8px",
   padding: "12px",
   border: "1px solid #ccc",
   borderRadius: "8px"
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  accordionHeader: {
    padding: "10px 12px",
    backgroundColor: "#f3f4f6",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    marginTop: "6px",
  },

  accordionSubHeader: {
    padding: "8px 12px",
    backgroundColor: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    cursor: "pointer",
    marginLeft: "12px",
    fontWeight: "500",
  },

  accordionContent: {
    marginTop: "6px",
    paddingLeft: "8px",
  },

  subjectList: {
    marginTop: "8px",
    marginLeft: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
};
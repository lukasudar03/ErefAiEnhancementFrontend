import { useEffect, useState } from "react";
import { getUsers, createUser, deleteUser } from "../api/userService";
import { getRoles } from "../api/roleService";
import { getSubjects } from "../api/subjectService";
import { createStudent } from "../api/studentService";
import { createProfessor } from "../api/professorService";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");

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
        const data = await getSubjects();
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

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      roleId: ""
    });

    setStudentData({
      userId: "",
      indexNumber: "",
      yearOfStudy: "",
      dateOfBirth: "",
      department: ""
    });

    setProfessorData({
      userId: "",
      subjectIds: []
    });
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
        await createProfessor({
            userId: createdUser.id,
            subjectIds: professorData.subjectIds
        });
      }

      resetForm();
      await loadUsers();
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

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      console.log(err);
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        "Failed to delete user."
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
                type="text"
                name="indexNumber"
                placeholder="Index Number"
                value={studentData.indexNumber}
                onChange={handleStudentChange}
                style={styles.input}
                />

                <input
                type="number"
                name="yearOfStudy"
                placeholder="Year Of Study"
                value={studentData.yearOfStudy}
                onChange={handleStudentChange}
                style={styles.input}
                />

                <input
                type="date"
                name="dateOfBirth"
                value={studentData.dateOfBirth}
                onChange={handleStudentChange}
                style={styles.input}
                />

                <input
                type="number"
                name="department"
                placeholder="Department"
                value={studentData.department}
                onChange={handleStudentChange}
                style={styles.input}
                />
            </>
        )}

        {selectedRoleName === "Professor" && (
            <div style={styles.subjectBox}>
                <p>Select subjects</p>

                {subjects.map((subject) => (
                <label key={subject.id} style={styles.checkboxLabel}>
                    <input
                    type="checkbox"
                    checked={professorData.subjectIds.includes(subject.id)}
                    onChange={() => handleProfessorSubjectChange(subject.id)}
                    />
                    {subject.name}
                </label>
                ))}
            </div>
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
                <button onClick={() => handleDelete(user.id)}>
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
  }
};
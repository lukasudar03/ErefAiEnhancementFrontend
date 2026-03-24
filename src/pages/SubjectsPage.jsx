import { useEffect, useState } from "react";
import { getSubjects, createSubject, deleteSubject } from "../api/subjectService";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    yearOfStudy: "",
    department: ""
  });

  const departmentOptions = [
    { value: 1, label: "Informatika" },
    { value: 2, label: "Mehatronika" },
    { value: 3, label: "Elektrotehnika" },
    { value: 4, label: "Masinstvo" },
    { value: 5, label: "Inzenjerski menadzment" }
  ];

    const yearOptions = [
    { value: 1, label: "Prva" },
    { value: 2, label: "Druga" },
    { value: 3, label: "Treca" },
    { value: 4, label: "Master 1" },
    { value: 5, label: "Master 2" }
  ];

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      yearOfStudy: "",
      department: ""
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createSubject({
        name: formData.name,
        yearOfStudy: Number(formData.yearOfStudy),
        department: Number(formData.department)
      });

      resetForm();
      await loadSubjects();
    } catch (err) {
      console.log(err);
      console.log(err?.response?.data);

      setError(
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        "Failed to create subject."
      );
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

  return (
    <div>
      <h1>Subjects</h1>

      <form onSubmit={handleCreate} style={styles.form}>
        <h2>Create Subject</h2>

        <input
          type="text"
          name="name"
          placeholder="Subject Name"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
        />

        <select
            name="yearOfStudy"
            value={formData.yearOfStudy}
            onChange={handleChange}
            style={styles.input}
            >
            <option value="">Select year</option>
            {yearOptions.map((y) => (
                <option key={y.value} value={y.value}>
                {y.label}
                </option>
            ))}
            </select>

            <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            style={styles.input}
            >
            <option value="">Select department</option>
            {departmentOptions.map((d) => (
                <option key={d.value} value={d.value}>
                {d.label}
                </option>
            ))}
        </select>

        <button type="submit">Create Subject</button>
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
            <th>Year Of Study</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.id}>
              <td>{subject.name}</td>
              <td>
                {yearOptions.find(y => y.value === subject.yearOfStudy)?.label}
                </td>
              <td>
                {departmentOptions.find(d => d.value === subject.department)?.label}
              </td>
              <td>
                <button onClick={() => handleDelete(subject.id)}>
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
  }
};
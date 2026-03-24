import { useEffect, useState } from "react";
import { getRoles } from "../api/roleService";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(data);
      } catch (err) {
        console.log(err);
        setError("Failed to load roles.");
      }
    };

    loadRoles();
  }, []);

  return (
    <div>
      <h1>Roles</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Role Name</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.roleName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
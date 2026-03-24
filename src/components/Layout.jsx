import { Link, useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAtUtc");
    navigate("/login");
  };

  return (
    <div>
      <nav style={styles.nav}>
        <div style={styles.links}>
            <Link to="/">Dashboard</Link>
            <Link to="/users">Users</Link>
            <Link to="/roles">Roles</Link>
            <Link to="/subjects">Subjects</Link>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid #ddd"
  },
  links: {
    display: "flex",
    gap: "16px"
  },
  main: {
    padding: "24px"
  }
};
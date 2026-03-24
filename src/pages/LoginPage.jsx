import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await loginUser(email, password);

      localStorage.setItem("token", result.token);
      localStorage.setItem("expiresAtUtc", result.expiresAtUtc);

      navigate("/");
    } catch (err) {
    console.log("LOGIN ERROR:", err);
    console.log("RESPONSE DATA:", err?.response?.data);

    setError(
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        "Login failed."
    );
    }
}

  return (
    <div style={styles.wrapper}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div style={styles.field}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  form: {
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    border: "1px solid #ddd",
    padding: "24px",
    borderRadius: "10px"
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  input: {
    padding: "10px",
    fontSize: "16px"
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer"
  },
  error: {
    color: "red",
    margin: 0
  }
};
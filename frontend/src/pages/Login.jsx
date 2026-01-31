import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    await api.post("auth/login", { email, password });
    navigate("/home");
  };

  return (
    <form className="auth-form" onSubmit={submit}>
      <h2>Welcome Back</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
        required
      />

      <button>Login</button>

      <button
        type="button"
        className="google-btn"
        onClick={() => {
        window.location.href = "http://localhost:3000/auth/google";
        }}
      >
        Continue with Google
      </button>

      <div className="auth-switch">
        Don’t have an account? <Link to="/register">Register</Link>
      </div>
    </form>
  );
}


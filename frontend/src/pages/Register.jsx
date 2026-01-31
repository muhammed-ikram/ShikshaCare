import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    await api.post("auth/register", { email, username, password });
    navigate("/home");
  };

  return (
    <form className="auth-form" onSubmit={submit}>
      <h2>Create Account</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
        required
      />

      <input
        placeholder="Username"
        onChange={e => setUserName(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
        required
      />

      <button>Register</button>

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
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </form>
  );
}

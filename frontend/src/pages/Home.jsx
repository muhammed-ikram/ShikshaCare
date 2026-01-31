import React from 'react'
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "./Home.css";

const Home = () => {
    const { user, loading, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        await api.post("auth/logout");
        setUser(null);
        navigate("/");
    };
    
    if (loading) {
        return <div>Loading...</div>;
    }
    if (!user) {
        navigate("/");
        return null;
    }
  return (
    <div className="home-container">
        <div style={{ position: "relative", marginBottom: "20px" }}>
            <h1>Welcome to the Home Page</h1>
            <button onClick={handleLogout} style={{ position: "absolute", top: "0", right: "0", padding: "8px 16px", cursor: "pointer" }}>Logout</button>
        </div>
        <h2>Hello, {user.username}!</h2>

    </div>
  )
}

export default Home;

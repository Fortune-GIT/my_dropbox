// src/pages/Login.jsx
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Login successful!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("❌ " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>WELCOME BACK</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input 
          type="email" 
          placeholder="Email address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">Login</button>
      </form>
      <p className="auth-footer">
        Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
      </p>
    </div>
  );
}

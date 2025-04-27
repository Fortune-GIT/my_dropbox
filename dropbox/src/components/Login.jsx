// src/components/Login.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSigningUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created! You are now signed in.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
      }
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login">
      <h2>{isSigningUp ? "Sign Up" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">
          {isSigningUp ? "Sign Up" : "Login"}
        </button>
      </form>

      <p>
        {isSigningUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button onClick={() => setIsSigningUp(!isSigningUp)} style={{ border: "none", background: "none", color: "blue", textDecoration: "underline", cursor: "pointer" }}>
          {isSigningUp ? "Login" : "Sign Up"}
        </button>
      </p>
    </div>
  );
}

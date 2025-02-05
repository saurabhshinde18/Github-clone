import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";

import { PageHeader } from "@primer/react/drafts";
import { Box, Button } from "@primer/react";
import "./auth.css";

import logo from "../../assets/github-mark-white.svg";
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");  // Changed from email to username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation to ensure username and password are provided
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/login", {
        username: username,  // Send username instead of email
        password: password,
      });

      // Check if login was successful
      if (res.data.token && res.data.userId) {
        // Store token and userId in localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);

        // Set user context
        setCurrentUser(res.data.userId);
        setLoading(false);

        window.location.href = "/"; // Redirect to homepage or dashboard
      } else {
        setLoading(false);
        alert("Login failed: Invalid credentials");
      }
    } catch (err) {
      setLoading(false);
      console.error("Login error: ", err);
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <img className="logo-login" src={logo} alt="Logo" />
      </div>

      <div className="login-box-wrapper">
        <div className="login-heading">
          <Box sx={{ padding: 1 }}>
            <PageHeader>
              <PageHeader.TitleArea variant="large">
                <PageHeader.Title>Sign In</PageHeader.Title>
              </PageHeader.TitleArea>
            </PageHeader>
          </Box>
        </div>
        <div className="login-box">
          <div>
            <label className="label">Username</label> {/* Changed from Email to Username */}
            <input
              autoComplete="off"
              name="Username"
              id="Username"
              className="input"
              type="text"  // Changed from email type to text
              value={username}
              onChange={(e) => setUsername(e.target.value)}  // Updated to handle username
            />
          </div>
          <div className="div">
            <label className="label">Password</label>
            <input
              autoComplete="off"
              name="Password"
              id="Password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            variant="primary"
            className="login-btn"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </div>
        <div className="pass-box">
          <p>
            New to GitHub? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

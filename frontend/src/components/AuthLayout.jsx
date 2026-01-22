import React, { useState } from "react";

// LocalStorage keys
const USERS_KEY = "carbon_users";
const CURRENT_USER_KEY = "carbon_current_user";

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getStoredCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || null;
  } catch {
    return null;
  }
}

export default function AuthLayout({ onAuthSuccess }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [form, setForm] = useState({
    userId: "",
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setMessage(null);
  }

  function switchMode(next) {
    setMode(next);
    setError(null);
    setMessage(null);
  }

  function handleSignup(e) {
    e.preventDefault();
    const { userId, name, email, password } = form;

    if (!userId || !name) {
      setError("Please fill in a username and name.");
      return;
    }

    const users = loadUsers();
    if (users[userId]) {
      setError("This user id already exists. Choose another one or log in.");
      return;
    }

    users[userId] = { userId, name, email, password };
    saveUsers(users);

    const user = { userId, name };
    saveCurrentUser(user);
    setMessage("Sign-up successful!");
    onAuthSuccess(user);
  }

  function handleLogin(e) {
    e.preventDefault();
    const { userId, password } = form;
    if (!userId) {
      setError("Enter your user id to log in.");
      return;
    }

    const users = loadUsers();
    const found = users[userId];
    if (!found) {
      setError("No such user. Try sign-up.");
      return;
    }

    // For demo: we ignore password or just check equality if provided
    if (found.password && password && password !== found.password) {
      setError("Incorrect password.");
      return;
    }

    const user = { userId: found.userId, name: found.name };
    saveCurrentUser(user);
    setMessage("Login successful!");
    onAuthSuccess(user);
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="app-title">Carbon Tracker</h1>
        <p className="app-subtitle">Measure. Understand. Reduce.</p>

        <div className="auth-tabs">
          <button
            className={mode === "login" ? "auth-tab active" : "auth-tab"}
            onClick={() => switchMode("login")}
          >
            Login
          </button>
          <button
            className={mode === "signup" ? "auth-tab active" : "auth-tab"}
            onClick={() => switchMode("signup")}
          >
            Sign up
          </button>
        </div>

        {mode === "signup" ? (
          <form className="auth-form" onSubmit={handleSignup}>
            <label>Username (user id)</label>
            <input
              name="userId"
              value={form.userId}
              onChange={handleChange}
              placeholder="e.g. sony_01"
            />
            <label>Full name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
            />
            <label>Email (optional)</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            <label>Password (demo only)</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />

            {error && <div className="auth-error">{error}</div>}
            {message && <div className="auth-message">{message}</div>}

            <button type="submit" className="primary-btn">
              Create account
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleLogin}>
            <label>User id</label>
            <input
              name="userId"
              value={form.userId}
              onChange={handleChange}
              placeholder="e.g. sony_01"
            />
            <label>Password (if you set one)</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="optional for demo"
            />

            {error && <div className="auth-error">{error}</div>}
            {message && <div className="auth-message">{message}</div>}

            <button type="submit" className="primary-btn">
              Log in
            </button>
          </form>
        )}

        <p className="auth-hint">
          This login is for demo only (stored in your browser, not on server).
        </p>
      </div>
    </div>
  );
}

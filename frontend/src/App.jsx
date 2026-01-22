import React, { useEffect, useState } from "react";
import ActivityForm from "./components/ActivityForm";
import SuggestionsList from "./components/SuggestionsList";
import SummaryCard from "./components/SummaryCard";
import AuthLayout, { getStoredCurrentUser } from "./components/Authlayout";
import GamificationCard from "./components/GamificationCard";



export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = getStoredCurrentUser();
    if (stored) {
      setUser(stored);
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("carbon_current_user");
    setUser(null);
  }

  if (!user) {
    // show login / signup page
    return <AuthLayout onAuthSuccess={setUser} />;
  }

  const userId = user.userId;
  
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Carbon Tracker — AI Suggestions</h1>
          <p className="header-subtitle">
            Track your footprint and get personalised reduction tips.
          </p>
        </div>
        <div className="header-user">
          <div className="user-chip">
            <span className="user-avatar">
              {user.name?.[0]?.toUpperCase() || userId[0]?.toUpperCase()}
            </span>
            <div className="user-text">
              <div className="user-name">{user.name || userId}</div>
              <div className="user-id">@{userId}</div>
            </div>
          </div>
          <button className="secondary-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="main-grid">
          <div className="column-left">
            <GamificationCard userId={userId} />

            <SummaryCard userId={userId} />
            <ActivityForm userId={userId} />
          </div>
          <div className="column-right">
            <SuggestionsList userId={userId} />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <small>
          Local demo • Backend: <code>http://127.0.0.1:8000</code> • Data
          visualisation: Grafana on <code>http://localhost:3000</code>
        </small>
      </footer>
    </div>
  );
}

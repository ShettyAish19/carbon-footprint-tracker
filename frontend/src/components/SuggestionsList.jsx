import React, { useEffect, useState } from "react";

export default function SuggestionsList({ userId }) {
  const [items, setItems] = useState([]);

  async function load() {
    const r = await fetch(`http://127.0.0.1:8000/suggestions/users/${userId}`);
    const d = await r.json();
    setItems(d || []);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [userId]);

  return (
    <div className="card">
      <h2>AI Coach</h2>
      {items.length === 0 && <div>No tips yet. Add an activity.</div>}
      <ul className="suggestions">
        {items.map(s => (
          <li key={s.id}>
            <div className="text">{s.suggestion_text}</div>
            <div className="meta">
              <span className={`tag ${s.difficulty}`}>{s.difficulty}</span>
              <span>{new Date(s.created_at).toLocaleTimeString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

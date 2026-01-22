import React, { useEffect, useState } from "react";

export default function GamificationCard({ userId }) {
  const [stats, setStats] = useState(null);

  async function load() {
    try {
      const r = await fetch(`http://127.0.0.1:8000/user-stats/${userId}`);
      const d = await r.json();
      setStats(d);
    } catch {
      setStats(null);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [userId]);

  if (!stats) return <div className="card">Loading progress...</div>;

const points = Number(stats.points || 0);
const streak = Number(stats.streak || 0);

const level = Math.floor(points / 50) + 1;
const nextLevelPts = level * 50;
const levelPct = Math.min(100, (points / nextLevelPts) * 100);


  return (
    <div className="card gamify">
      <h2>🎮 Your Progress</h2>

      <div className="gamify-row">
        <div className="big">{points}</div>
        <div>
          <div className="label">Points</div>
          <div>Level {level}</div>
        </div>
      </div>

      <div className="progress-bar">
        <div style={{ width: `${levelPct}%` }} />
      </div>
      <div className="hint">
        {nextLevelPts - points} points to next level
      </div>

      <div className="gamify-row">
        <div className="big">🔥 {streak}</div>
        <div>
          <div className="label">Day Streak</div>
          <div>
            {streak === 0
              ? "Start today!"
              : streak < 3
              ? "Getting started"
              : streak < 7
              ? "Nice momentum!"
              : "Habit formed!"}
          </div>
        </div>
      </div>
    </div>
  );
}

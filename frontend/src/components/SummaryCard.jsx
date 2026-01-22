import React, { useEffect, useState } from "react";

export default function SummaryCard({ userId }) {
  const [sum, setSum] = useState(null);
  const DAILY_GOAL = 10;

  async function load() {
    const r = await fetch(`http://127.0.0.1:8000/summary/${userId}`);
    const d = await r.json();
    setSum(d);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [userId]);

  if (!sum) return <div className="card">Loading summary...</div>;

  const pct = Math.min(100, (sum.today_co2 / DAILY_GOAL) * 100);

  return (
    <div className="card">
      <h2>Today’s Carbon</h2>

      <div className="circle">
        <svg viewBox="0 0 36 36">
          <path className="bg"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path className="fg"
            strokeDasharray={`${pct}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
        <div className="circle-text">
          {sum.today_co2} kg
        </div>
      </div>

      <div className="hint">
        Goal: {DAILY_GOAL} kg •
        {sum.today_co2 <= DAILY_GOAL ? " On track" : " Over limit"}
      </div>
    </div>
  );
}

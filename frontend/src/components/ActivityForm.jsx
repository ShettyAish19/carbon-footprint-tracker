import React, { useState } from "react";

const DEFAULT = {
  type: "travel",
  mode: "bicycle",
  distance_km: 5,
  kwh: 1,
  food_category: "veg"
};

export default function ActivityForm({ userId }) {
  const [form, setForm] = useState(DEFAULT);
  const [msg, setMsg] = useState("");

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setMsg("Sending...");
    const payload = {
      user_id: userId,
      type: form.type,
      mode: form.type === "travel" ? form.mode : undefined,
      distance_km: form.type === "travel" ? Number(form.distance_km) : undefined,
      kwh: form.type === "electricity" ? Number(form.kwh) : undefined,
      food_category: form.type === "food" ? form.food_category : undefined
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/activities/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data));
      setMsg(`OK — CO₂: ${data.co2_kg} kg (source: ${data.calculation_source})`);
    } catch (err) {
      setMsg("Error: " + err.toString());
    }
  }

  return (
    <div className="card">
      <h2>Log Activity</h2>
      <form onSubmit={submit}>
        <label>Type</label>
        <select name="type" value={form.type} onChange={onChange}>
          <option value="travel">Travel</option>
          <option value="electricity">Electricity</option>
          <option value="food">Food</option>
        </select>

        {form.type === "travel" && (
          <>
            <label>Mode</label>
            <select name="mode" value={form.mode} onChange={onChange}>
              <option value="">Select mode</option>
              <option value="bicycle">Bicycle (no fuel)</option>
              <option value="motorbike">Motorbike (petrol)</option>
              <option value="car">Car</option>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
            </select>

            <label>Distance (km)</label>
            <input
              type="number"
              name="distance_km"
              value={form.distance_km}
              onChange={onChange}
              min="0"
              step="0.1"
            />
          </>
        )}

        {form.type === "electricity" && (
          <>
            <label>Electricity used (kWh)</label>
            <input
              type="number"
              name="kwh"
              value={form.kwh}
              onChange={onChange}
              min="0"
              step="0.1"
            />
          </>
        )}

        {form.type === "food" && (
          <>
            <label>Food category</label>
            <select
              name="food_category"
              value={form.food_category}
              onChange={onChange}
            >
              <option value="veg">Veg</option>
              <option value="chicken">Chicken</option>
              <option value="beef">Beef</option>
            </select>
          </>
        )}

        <button type="submit">Submit</button>
      </form>

      <div className="status">{msg}</div>
    </div>
  );
}

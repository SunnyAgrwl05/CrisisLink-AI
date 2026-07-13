import React, { useState } from "react";

export default function EmergencyConsole({
  onAnalyze,
  running,
  userId,
  setUserId,
}) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onAnalyze(text);
  };

  return (
    <div className="console">

      <div className="console__header">
        <h3>Emergency Console</h3>
        <span className="console__badge">LIVE</span>
      </div>

      <label className="console__label">
        Describe the emergency
      </label>

      <textarea
        className="console__textarea"
        rows={7}
        placeholder="Example:
There is severe flooding in Patna.
15 people trapped near Gandhi Setu.
Road completely submerged."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <label className="console__label">
        User ID
      </label>

      <input
        className="console__input"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      <button
        className="console__button"
        disabled={running}
        onClick={submit}
      >
        {running ? "Analyzing..." : "Analyze Emergency"}
      </button>

    </div>
  );
}


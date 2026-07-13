import React, { useEffect, useState } from "react";
import {
  Activity,
  Clock3,
  Cpu,
  ShieldCheck,
  UserCircle2,
  Menu,
} from "lucide-react";

export default function Navbar({
  backendOnline,
  userId,
  onMenuClick,
}) {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="navbar">

      {/* Mobile Hamburger */}
      <button
        className="mobile-menu-btn"
        onClick={onMenuClick}
      >
        <Menu size={24} />
      </button>

      <div className="navbar__left">
        <button
          className="navbar__menu"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>

        <div className="navbar__title">

          <Cpu size={26} className="navbar__logo" />

          <div>

            <h2>CrisisLink AI</h2>

            <span>
              Multi-Agent Disaster Coordination Platform
            </span>

          </div>

        </div>

      </div>

      <div className="navbar__right">

        <div className="navbar__card">

          <Clock3 size={18} />

          <span>{time}</span>

        </div>

        <div className="navbar__card">

          <Activity
            size={18}
            color={backendOnline ? "#22c55e" : "#ef4444"}
          />

          <span>
            {backendOnline
              ? "Backend Online"
              : "Backend Offline"}
          </span>

        </div>

        <div className="navbar__card">

          <ShieldCheck
            size={18}
            color="#38bdf8"
          />

          <span>Secure Mode</span>

        </div>

        <div className="navbar__user">

          <UserCircle2 size={34} />

          <div>

            <strong>{userId}</strong>

            <small>Dispatcher</small>

          </div>

        </div>

      </div>

    </header>
  );
}
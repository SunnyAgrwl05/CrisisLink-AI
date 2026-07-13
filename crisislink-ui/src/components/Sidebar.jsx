import React from "react";
import {
  LayoutDashboard,
  Map,
  TriangleAlert,
  Bot,
  Package,
  Building2,
  House,
  FileText,
  Menu,
  Siren,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "map", label: "Live Map", icon: Map },
  { id: "incidents", label: "Incidents", icon: TriangleAlert },
  { id: "agents", label: "AI Agents", icon: Bot },
  { id: "resources", label: "Resources", icon: Package },
  { id: "hospitals", label: "Hospitals", icon: Building2 },
  { id: "shelters", label: "Shelters", icon: House },
  { id: "reports", label: "Reports", icon: FileText },
];

export default function Sidebar({
  collapsed,
  onToggle,
  currentPage,
  setCurrentPage,
}) {
  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      <div className="sidebar__blur"></div>

      <div className="sidebar__top">
        <button
          className="sidebar__toggle"
          onClick={onToggle}
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>

        {!collapsed && (
          <div className="sidebar__brand">
            <div className="sidebar__logo">
              <Zap size={20} />
            </div>

            <div>
              <h2>CrisisLink AI</h2>
              <span>Powered by Google ADK</span>
            </div>
          </div>
        )}
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`sidebar__item ${currentPage === item.id ? "sidebar__item--active" : ""
                }`}
            >
              <Icon size={20} className="sidebar__icon" />

              {!collapsed && (
                <span className="sidebar__label">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar__bottom">
        <button className="sidebar__sos">
          <Siren size={20} />

          {!collapsed && (
            <span>Emergency SOS</span>
          )}
        </button>
      </div>
    </aside>
  );
}
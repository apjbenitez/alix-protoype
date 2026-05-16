"use client";

import { Icon } from "@alixpartners/ui-components";
import type { ApIcon } from "@alixpartners/ui-components";

interface NavItem {
  id: string;
  label: string;
  icon: ApIcon;
  href: string;
  badge?: number;
  badgeType?: "default" | "error";
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "ap-icon-grid", href: "#dashboard" },
  { id: "positions", label: "Positions", icon: "ap-icon-bar", href: "#positions" },
  { id: "trades", label: "Trades", icon: "ap-icon-sync", href: "#trades" },
  { id: "allocations", label: "Allocations", icon: "ap-icon-radial", href: "#allocations" },
  { id: "risk", label: "Risk", icon: "ap-icon-alert", href: "#risk", badge: 2, badgeType: "error" },
  { id: "compliance", label: "Compliance", icon: "ap-icon-check", href: "#compliance", badge: 1, badgeType: "error" },
  { id: "reports", label: "Reports", icon: "ap-icon-document", href: "#reports" },
];

const BOTTOM_ITEMS: NavItem[] = [
  { id: "settings", label: "Settings", icon: "ap-icon-settings", href: "#settings" },
  { id: "help", label: "Help", icon: "ap-icon-help", href: "#help" },
];

interface AppSidebarProps {
  activeId?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AppSidebar({ activeId = "dashboard", collapsed = false, onToggleCollapse }: AppSidebarProps) {
  return (
    <aside className={`app-sidebar ${collapsed ? "app-sidebar--collapsed" : ""}`}>
      <div className="app-sidebar__brand">
        <div className="app-sidebar__logo">
          <Icon icon="ap-icon-platforms" />
        </div>
        {!collapsed && <span className="app-sidebar__brand-name">TradingDesk</span>}
      </div>

      <nav className="app-sidebar__nav">
        <ul className="app-sidebar__list">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                className={`app-sidebar__item ${activeId === item.id ? "app-sidebar__item--active" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon icon={item.icon} />
                {!collapsed && <span className="app-sidebar__label">{item.label}</span>}
                {item.badge && !collapsed && (
                  <span className={`app-sidebar__badge ${item.badgeType === "error" ? "app-sidebar__badge--error" : ""}`}>
                    {item.badge}
                  </span>
                )}
                {item.badge && collapsed && (
                  <span className="app-sidebar__badge-dot" />
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="app-sidebar__bottom">
        <ul className="app-sidebar__list">
          {BOTTOM_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                className={`app-sidebar__item ${activeId === item.id ? "app-sidebar__item--active" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon icon={item.icon} />
                {!collapsed && <span className="app-sidebar__label">{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="app-sidebar__toggle"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Icon icon={collapsed ? "ap-icon-right" : "ap-icon-left"} />
        </button>
      </div>
    </aside>
  );
}

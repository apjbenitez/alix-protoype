"use client";

import { Component, useState } from "react";
import type { ErrorInfo, ReactNode } from "react";
import {
  Datepicker,
  Dropdown,
  Ghost,
  NavBar,
  Search,
  SplitButton,
  Tab,
  TabNavigation,
  Toggle,
} from "@alixpartners/ui-components";

import {
  KPIS,
  ACCOUNT_OPTIONS,
  ASSET_CLASS_OPTIONS,
  EXPORT_ACTIONS,
  POSITIONS_FULL,
  TRADES,
  SLEEVES,
  STRESS_SCENARIOS,
  COMPLIANCE_RULES,
} from "./_mock";
import type { TabKey } from "./_types";

import { KPI } from "./_components/KPI";
import { MoversPanel } from "./_components/MoversPanel";
import { PositionsTable } from "./_components/PositionsTable";
import { PositionsView } from "./_components/PositionsView";
import { TradesBlotter } from "./_components/TradesBlotter";
import { AllocationsView } from "./_components/AllocationsView";
import { ComplianceView } from "./_components/ComplianceView";
import { RiskView } from "./_components/RiskView";
import { SidebarPanel } from "./_components/SidebarPanel";
import { AISidebar } from "./_components/AISidebar";

interface BoundaryProps { children: ReactNode }
interface BoundaryState { err: Error | null }

class Boundary extends Component<BoundaryProps, BoundaryState> {
  constructor(props: BoundaryProps) {
    super(props);
    this.state = { err: null };
  }
  static getDerivedStateFromError(err: Error) { return { err }; }
  componentDidCatch(err: Error, info: ErrorInfo) { console.error("Boundary caught:", err, info); }
  render() {
    if (this.state.err) {
      return (
        <div style={{ margin: 24, padding: 16, background: "#fef2f2", border: "1px solid var(--ap-error)", borderRadius: "var(--ap-radius)", color: "var(--ap-error-2)", fontFamily: "var(--ap-font)" }}>
          <strong>Render error:</strong>
          <pre style={{ whiteSpace: "pre-wrap", margin: "8px 0 0" }}>
            {this.state.err.message}
            {"\n\n"}
            {this.state.err.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function tabHasFilters(tab: TabKey) {
  return tab === "overview" || tab === "positions" || tab === "trades" || tab === "risk";
}

export function Dashboard() {
  const [tab, setTab]               = useState<TabKey>("overview");
  const [date, setDate]             = useState<Date>(new Date("2026-05-14T16:00:00Z"));
  const [accounts, setAccounts]     = useState<string[]>(["all"]);
  const [classes, setClasses]       = useState<string[]>([]);
  const [closedOnly, setClosedOnly] = useState(false);
  const [search, setSearch]         = useState("");
  const [aiOpen, setAIOpen]         = useState(false);

  return (
    <Boundary>
      <NavBar
        projectName="TradingDesk"
        projectLogoIcon="ap-icon-logo-vault"
        activeMenuItemHref="#dashboard"
        menuItems={[
          { label: "Dashboard", href: "#dashboard" },
          { label: "Positions", href: "#positions" },
          { label: "Trades",    href: "#trades" },
          { label: "Reports",   href: "#reports" },
          { label: "Settings",  href: "#settings" },
        ]}
        additionalItems={{
          notifications: {
            count: 3,
            content: (
              <div style={{ padding: 12, minWidth: 240 }}>
                <strong style={{ fontSize: 13 }}>3 unread alerts</strong>
                <div style={{ fontSize: 12, color: "var(--ap-text-muted)", marginTop: 4 }}>
                  NVDA concentration · Vol rebalance · Risk engine 503
                </div>
              </div>
            ),
          },
          userProfile: {
            initials: "JB",
            content: (
              <div style={{ padding: 12, minWidth: 220 }}>
                <strong>Julian Benitez</strong>
                <div style={{ fontSize: 12, color: "var(--ap-text-muted)" }}>jbenitez@alixpartners.com</div>
                <div style={{ marginTop: 8 }}>
                  <Ghost variant="cancel" icon="ap-icon-logout">Sign out</Ghost>
                </div>
              </div>
            ),
          },
        }}
      />

      <div className="page-wrap">
        <header className="page-header">
          <div className="page-header__title">
            <h1>End-of-day snapshot</h1>
            <p className="sub">
              Thursday, May 14, 2026
              <span className="sep">·</span>
              <span className="status-pill">Market closed at 4:00 PM ET</span>
            </p>
          </div>
          <div className="page-header__actions">
            <Datepicker
              label=""
              value={date}
              onChange={(d) => d && setDate(d)}
              dateFormat="Mon DD, YYYY"
            />
            <SplitButton
              type="primary"
              trigger="split"
              size="md"
              buttonLabel="Export EOD"
              actionOptions={EXPORT_ACTIONS}
            />
          </div>
        </header>

        <div className="kpi-grid">
          {KPIS.map((k) => <KPI key={k.id} k={k} />)}
        </div>

        <TabNavigation align="left">
          <Tab label="Overview"    active={tab === "overview"}    onClick={() => setTab("overview")} />
          <Tab label="Positions"   numberCount={POSITIONS_FULL.length} active={tab === "positions"}   onClick={() => setTab("positions")} />
          <Tab label="Trades"      numberCount={TRADES.length}         active={tab === "trades"}      onClick={() => setTab("trades")} />
          <Tab label="Allocations" numberCount={SLEEVES.length}        active={tab === "allocations"} onClick={() => setTab("allocations")} />
          <Tab label="Risk"        numberCount={STRESS_SCENARIOS.filter((s) => s.severity === "error").length} active={tab === "risk"} onClick={() => setTab("risk")} />
          <Tab label="Compliance"  hasError numberCount={COMPLIANCE_RULES.filter((r) => r.status === "fail").length} active={tab === "compliance"} onClick={() => setTab("compliance")} />
        </TabNavigation>

        {tabHasFilters(tab) && (
          <div className="filter-row">
            <Search value={search} onChange={setSearch} placeholder="Find symbol or strategy" label="Search" />
            <Dropdown
              label="Account"
              options={ACCOUNT_OPTIONS}
              value={accounts}
              onChange={setAccounts}
              placeholder="All accounts"
            />
            <Dropdown
              label="Asset class"
              options={ASSET_CLASS_OPTIONS}
              value={classes}
              onChange={setClasses}
              placeholder="All asset classes"
              multiSelect
              searchable
            />
            <div className="toggle-cell">
              <Toggle label="Closed only" checked={closedOnly} onChange={(v) => setClosedOnly(!!v)} labelPosition="right" />
            </div>
          </div>
        )}

        <div className="main-grid">
          <div className="panel-stack">
            {tab === "overview"    && <><MoversPanel /><PositionsTable /></>}
            {tab === "positions"   && <PositionsView />}
            {tab === "trades"      && <TradesBlotter />}
            {tab === "allocations" && <AllocationsView />}
            {tab === "risk"        && <RiskView />}
            {tab === "compliance"  && <ComplianceView />}
          </div>
          <SidebarPanel />
        </div>
      </div>

      {!aiOpen && (
        <button className="ai-fab" onClick={() => setAIOpen(true)} aria-label="Open trading assistant">
          <span className="ai-fab__sparkle">AI</span>
          <span>Ask assistant</span>
        </button>
      )}
      <AISidebar open={aiOpen} onClose={() => setAIOpen(false)} />
    </Boundary>
  );
}

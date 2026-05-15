"use client";

import { useMemo } from "react";
import { Banner, Ghost, Icon, Tag, useToast } from "@alixpartners/ui-components";
import type { ColDef, ICellRendererParams, ValueFormatterParams } from "ag-grid-community";
import { AgGrid } from "./AgGrid";
import { VAR_SUMMARY, STRESS_SCENARIOS, POSITION_RISK } from "../_mock";
import type { StressScenario, PositionRisk } from "../_types";
import { fmtUSD, fmtPnL, SECTOR_BG, SECTOR_FG } from "../_format";

function RiskSummary() {
  const pctOfNav = (n: number) => ((Math.abs(n) / VAR_SUMMARY.navUsed) * 100).toFixed(2);
  return (
    <div className="summary-strip">
      <div className="summary-card">
        <div className="summary-label">1-day VaR (95%)</div>
        <div className="summary-value">{fmtUSD(VAR_SUMMARY.var1d)}</div>
        <div className="summary-sub">{pctOfNav(VAR_SUMMARY.var1d)}% NAV · cap $250k</div>
      </div>
      <div className="summary-card">
        <div className="summary-label">5-day VaR (95%)</div>
        <div className="summary-value">{fmtUSD(VAR_SUMMARY.var5d)}</div>
        <div className="summary-sub">{pctOfNav(VAR_SUMMARY.var5d)}% NAV · headline risk</div>
      </div>
      <div className="summary-card">
        <div className="summary-label">Stress max loss</div>
        <div className="summary-value pl-neg">−{fmtUSD(VAR_SUMMARY.stressMaxLoss)}</div>
        <div className="summary-sub">Worst scenario · {pctOfNav(VAR_SUMMARY.stressMaxLoss)}% NAV</div>
      </div>
      <div className="summary-card">
        <div className="summary-label">Beta to SPX</div>
        <div className="summary-value">{VAR_SUMMARY.beta.toFixed(2)}</div>
        <div className="summary-sub">Rolling 60-day</div>
      </div>
    </div>
  );
}

function StressScenarioRow({ s, maxAbs }: { s: StressScenario; maxAbs: number }) {
  const tagType: "error" | "warning" | "basic" =
    s.severity === "error" ? "error" : s.severity === "warning" ? "warning" : "basic";
  const tagLabel = s.severity === "error" ? "Severe" : s.severity === "warning" ? "Watch" : "Mild";

  return (
    <div className="stress-row">
      <div>
        <div className="stress-row__name">{s.name}</div>
        <div className="stress-row__sub">{s.category} · {s.id}</div>
      </div>
      <div className="stress-bar" title={`${s.name} · ${fmtPnL(s.impact)}`}>
        <div className={`stress-bar__fill stress-bar__fill--${s.severity}`}
             style={{ width: `${(Math.abs(s.impact) / maxAbs) * 100}%` }} />
      </div>
      <div className={`alloc-row__num ${s.impact < 0 ? "pl-neg" : "pl-pos"}`}>{fmtPnL(s.impact)}</div>
      <div className="alloc-row__num">{s.pctNav.toFixed(2)}%</div>
      <div>
        <Tag type={tagType} structure="solid" size="sm" label={tagLabel} noIcon
             color={s.severity === "info" ? "gray" : undefined} />
      </div>
    </div>
  );
}

function StressScenariosPanel() {
  const toast = useToast();
  const maxAbs = Math.max(...STRESS_SCENARIOS.map((s) => Math.abs(s.impact)));
  const severeCount = STRESS_SCENARIOS.filter((s) => s.severity === "error").length;
  return (
    <div className="panel">
      <div className="panel-head">
        <h2><Icon icon="ap-icon-alert" /> Stress scenarios</h2>
        <div className="table-controls">
          <span style={{ fontSize: 12, color: "var(--ap-text-muted)" }}>
            {STRESS_SCENARIOS.length} scenarios · {severeCount} severe
          </span>
          <Ghost variant="default" icon="ap-icon-add" onClick={() => toast.success("Add custom scenario (stub)")}>
            Add scenario
          </Ghost>
        </div>
      </div>
      <div className="stress-list">
        {STRESS_SCENARIOS.map((s) => <StressScenarioRow key={s.id} s={s} maxAbs={maxAbs} />)}
      </div>
    </div>
  );
}

function PositionRiskPanel() {
  const toast = useToast();

  const columnDefs = useMemo<ColDef<PositionRisk>[]>(() => [
    {
      field: "sym", headerName: "Symbol", pinned: "left", width: 100,
      cellStyle: { fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: ".02em" },
    },
    {
      field: "sector", headerName: "Sector", width: 130,
      cellRenderer: (p: ICellRendererParams<PositionRisk, string>) => {
        const s = document.createElement("span");
        s.className = "sector-chip";
        s.textContent = p.value ?? "";
        s.style.background = SECTOR_BG[p.value ?? ""] || "#ececec";
        s.style.color      = SECTOR_FG[p.value ?? ""] || "#4a4a4a";
        return s;
      },
    },
    { field: "mv", headerName: "Mkt value", type: "rightAligned", width: 130,
      valueFormatter: (p: ValueFormatterParams<PositionRisk, number>) => fmtUSD(p.value ?? 0) },
    { field: "marginalVar", headerName: "Marginal VaR", type: "rightAligned", width: 140,
      sort: "desc",
      valueFormatter: (p: ValueFormatterParams<PositionRisk, number>) => fmtUSD(p.value ?? 0),
      cellStyle: { fontWeight: 600 } },
    {
      field: "pctOfTotal", headerName: "% of VaR", type: "rightAligned", width: 110,
      cellRenderer: (p: ICellRendererParams<PositionRisk, number>) => {
        const value = p.value ?? 0;
        const wrap = document.createElement("div");
        wrap.style.cssText = "display:flex;flex-direction:column;align-items:flex-end;line-height:1.2;gap:2px";
        const top = document.createElement("span");
        top.style.cssText = "font-variant-numeric: tabular-nums; font-weight: 600";
        top.textContent = value.toFixed(1) + "%";
        const bar = document.createElement("div");
        bar.style.cssText = "width:60px;height:4px;background:#f5f5f5;border-radius:999px;overflow:hidden";
        const fill = document.createElement("div");
        fill.style.cssText = `width:${Math.min(value * 2.5, 100)}%;height:100%;background:${value >= 20 ? "#cb282e" : value >= 10 ? "#ce7309" : "#878787"};border-radius:999px`;
        bar.appendChild(fill);
        wrap.append(top, bar);
        return wrap;
      },
    },
    { field: "beta", headerName: "Beta", type: "rightAligned", width: 90,
      valueFormatter: (p: ValueFormatterParams<PositionRisk, number>) => (p.value ?? 0).toFixed(2),
      cellStyle: { fontVariantNumeric: "tabular-nums" } },
    {
      headerName: "", flex: 1, minWidth: 90, sortable: false, filter: false, resizable: false, suppressMovable: true,
      cellRenderer: (p: ICellRendererParams<PositionRisk>) => {
        const btn = document.createElement("button");
        btn.className = "view-link";
        btn.textContent = "Detail";
        btn.style.float = "right";
        btn.addEventListener("click", () => toast.success(`Risk detail · ${p.data?.sym}`));
        return btn;
      },
    },
  ], [toast]);

  return (
    <div className="panel">
      <div className="panel-head">
        <h2><Icon icon="ap-icon-bar" /> Position risk contribution</h2>
        <span style={{ fontSize: 12, color: "var(--ap-text-muted)" }}>Top {POSITION_RISK.length} by marginal VaR</span>
      </div>
      <AgGrid<PositionRisk>
        rowData={POSITION_RISK}
        columnDefs={columnDefs}
        height={Math.min(POSITION_RISK.length, 10) * 40 + 80}
        rowHeight={40}
        headerHeight={36}
        suppressCellFocus
      />
    </div>
  );
}

export function RiskView() {
  const severeCount = STRESS_SCENARIOS.filter((s) => s.severity === "error").length;
  return (
    <>
      <RiskSummary />
      {severeCount > 0 && (
        <Banner
          type="warning"
          size="md"
          isFullWidth
          content={`${severeCount} stress scenarios cross the −2% NAV severity threshold. Review hedges before the next session.`}
        />
      )}
      <StressScenariosPanel />
      <PositionRiskPanel />
    </>
  );
}

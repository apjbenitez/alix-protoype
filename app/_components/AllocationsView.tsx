"use client";

import { Ghost, Icon, useToast } from "@alixpartners/ui-components";
import { SLEEVES, SECTOR_ALLOCATION } from "../_mock";
import type { Sleeve } from "../_types";
import { fmtUSD, fmtPnL } from "../_format";

function AllocationsSummary({ rows }: { rows: Sleeve[] }) {
  const nav         = rows.reduce((a, r) => a + r.nav, 0);
  const drifts      = rows.map((r) => r.current - r.target);
  const avgAbsDrift = drifts.reduce((a, d) => a + Math.abs(d), 0) / Math.max(rows.length, 1);
  const top         = rows.slice().sort((a, b) => (b.current - b.target) - (a.current - a.target))[0];

  return (
    <div className="summary-strip">
      <div className="summary-card">
        <div className="summary-label">Net asset value</div>
        <div className="summary-value">{fmtUSD(nav)}</div>
        <div className="summary-sub">EOD mark-to-market</div>
      </div>
      <div className="summary-card">
        <div className="summary-label">Strategy sleeves</div>
        <div className="summary-value">{rows.length}</div>
        <div className="summary-sub">{rows.filter((r) => r.status === "on").length} on target</div>
      </div>
      <div className="summary-card">
        <div className="summary-label">Avg drift</div>
        <div className="summary-value">±{avgAbsDrift.toFixed(2)} pp</div>
        <div className="summary-sub">vs target weights</div>
      </div>
      <div className="summary-card">
        <div className="summary-label">Largest overweight</div>
        <div className="summary-value">{top ? top.name.split(" ")[0] : "—"}</div>
        <div className="summary-sub">{top ? `+${(top.current - top.target).toFixed(1)} pp vs target` : "—"}</div>
      </div>
    </div>
  );
}

function AllocationRow({ s }: { s: Sleeve }) {
  const drift    = s.current - s.target;
  const fillMod  = s.status === "over" ? "alloc-bar__fill--over" : s.status === "under" ? "alloc-bar__fill--under" : "";
  const tagMod   = s.status === "over" ? "alloc-tag--over"       : s.status === "under" ? "alloc-tag--under"        : "alloc-tag--on";
  const tagLabel = s.status === "over" ? "Overweight"            : s.status === "under" ? "Underweight"             : "On target";

  return (
    <div className="alloc-row">
      <div>
        <div className="alloc-row__name">{s.name}</div>
        <div className="alloc-row__sub">{fmtUSD(s.nav)} · target {s.target.toFixed(1)}%</div>
      </div>
      <div className="alloc-bar" title={`Current ${s.current}% · target ${s.target}%`}>
        <div className={`alloc-bar__fill ${fillMod}`} style={{ width: `${Math.min(s.current, 100)}%` }} />
        <div className="alloc-bar__target" style={{ left: `calc(${s.target}% - 1px)` }} />
      </div>
      <div className="alloc-row__num">{s.current.toFixed(1)}%</div>
      <div className={`alloc-row__num ${drift >= 0 ? "pl-pos" : "pl-neg"}`}>
        {(drift >= 0 ? "+" : "") + drift.toFixed(1)} pp
      </div>
      <div className={`alloc-row__num ${s.dayPL >= 0 ? "pl-pos" : "pl-neg"}`}>{fmtPnL(s.dayPL)}</div>
      <div><span className={`alloc-tag ${tagMod}`}>{tagLabel}</span></div>
    </div>
  );
}

export function AllocationsView() {
  const toast = useToast();
  const maxSectorPct = Math.max(...SECTOR_ALLOCATION.map((s) => s.pct));

  return (
    <>
      <AllocationsSummary rows={SLEEVES} />

      <div className="panel">
        <div className="panel-head">
          <h2><Icon icon="ap-icon-bar" /> Strategy sleeves</h2>
          <div className="table-controls">
            <Ghost variant="default" icon="ap-icon-add" onClick={() => toast.success("Rebalance plan (stub)")}>
              Rebalance
            </Ghost>
          </div>
        </div>
        <div className="alloc-list">
          {SLEEVES.map((s) => <AllocationRow key={s.id} s={s} />)}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2><Icon icon="ap-icon-bar" /> Sector exposure</h2>
          <span style={{ fontSize: 12, color: "var(--ap-text-muted)" }}>{SECTOR_ALLOCATION.length} sectors</span>
        </div>
        <div className="sector-list">
          {SECTOR_ALLOCATION.map((row) => (
            <div className="sector-row" key={row.sector}>
              <div>{row.sector}</div>
              <div className="sector-row__bar">
                <div className="sector-row__fill" style={{ width: `${(row.pct / maxSectorPct) * 100}%` }} />
              </div>
              <div className="sector-row__pct">{row.pct.toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

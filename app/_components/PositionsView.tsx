"use client";

import { useMemo, useState } from "react";
import { Ghost, Icon, Toggle, useToast } from "@alixpartners/ui-components";
import type { ColDef, ICellRendererParams, ValueFormatterParams } from "ag-grid-community";
import { AgGrid } from "./AgGrid";
import { POSITIONS_FULL } from "../_mock";
import type { Position } from "../_types";
import { fmtUSD, fmtPnL, SECTOR_BG, SECTOR_FG } from "../_format";

function PositionsSummary({ rows }: { rows: Position[] }) {
  const longs   = rows.filter((r) => r.qty > 0);
  const shorts  = rows.filter((r) => r.qty < 0);
  const grossMV = rows.reduce((a, r) => a + Math.abs(r.mv), 0);
  const netMV   = rows.reduce((a, r) => a + r.mv,           0);
  const totalPL = rows.reduce((a, r) => a + r.pnl,          0);
  const winners = rows.filter((r) => r.pnl > 0).length;
  const losers  = rows.filter((r) => r.pnl < 0).length;
  const top     = rows.slice().sort((a, b) => Math.abs(b.mv) - Math.abs(a.mv))[0];

  return (
    <div className="summary-strip">
      <div className="summary-card">
        <div className="summary-label">Long / Short</div>
        <div className="summary-value">
          {longs.length} <span style={{ color: "var(--ap-text-soft)", fontWeight: 500 }}>·</span> {shorts.length}
        </div>
        <div className="summary-sub">{rows.length} open positions</div>
      </div>
      <div className="summary-card">
        <div className="summary-label">Gross exposure</div>
        <div className="summary-value">{fmtUSD(grossMV)}</div>
        <div className="summary-sub">Net {fmtUSD(netMV)}</div>
      </div>
      <div className="summary-card">
        <div className="summary-label">Open P&L</div>
        <div className={`summary-value ${totalPL >= 0 ? "pl-pos" : "pl-neg"}`}>{fmtPnL(totalPL)}</div>
        <div className="summary-sub">{winners} winners · {losers} losers</div>
      </div>
      <div className="summary-card">
        <div className="summary-label">Largest position</div>
        <div className="summary-value">{top?.sym ?? "—"}</div>
        <div className="summary-sub">
          {top && grossMV ? `${((Math.abs(top.mv) / grossMV) * 100).toFixed(1)}% of gross` : "—"}
        </div>
      </div>
    </div>
  );
}

export function PositionsView() {
  const toast = useToast();
  const [groupBySector, setGroupBySector] = useState(false);
  const [longsOnly, setLongsOnly]         = useState(false);

  const rows = useMemo(() => {
    let r = longsOnly ? POSITIONS_FULL.filter((p) => p.qty > 0) : POSITIONS_FULL.slice();
    if (groupBySector) r = r.slice().sort((a, b) => a.sector.localeCompare(b.sector));
    return r;
  }, [longsOnly, groupBySector]);

  const columnDefs = useMemo<ColDef<Position>[]>(() => [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 42, pinned: "left", suppressMovable: true, resizable: false, sortable: false, filter: false,
    },
    {
      field: "sym", headerName: "Symbol", pinned: "left", width: 100,
      tooltipValueGetter: (p) => `${(p.data?.qty ?? 0) > 0 ? "Long" : "Short"} · ${p.data?.account}`,
      cellStyle: { fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: ".02em" },
    },
    {
      field: "sector", headerName: "Sector", width: 130,
      cellRenderer: (p: ICellRendererParams<Position, string>) => {
        const s = document.createElement("span");
        s.className = "sector-chip";
        s.textContent = p.value ?? "";
        s.style.background = SECTOR_BG[p.value ?? ""] || "#ececec";
        s.style.color      = SECTOR_FG[p.value ?? ""] || "#4a4a4a";
        return s;
      },
    },
    { field: "account", headerName: "Account", width: 170 },
    { field: "qty",  headerName: "Qty",       type: "rightAligned", width: 100, valueFormatter: (p: ValueFormatterParams<Position, number>) => (p.value ?? 0).toLocaleString() },
    { field: "avg",  headerName: "Avg",       type: "rightAligned", width: 100, valueFormatter: (p: ValueFormatterParams<Position, number>) => (p.value ?? 0).toFixed(2) },
    { field: "mark", headerName: "Mark",      type: "rightAligned", width: 100, valueFormatter: (p: ValueFormatterParams<Position, number>) => (p.value ?? 0).toFixed(2) },
    { field: "mv",   headerName: "Mkt value", type: "rightAligned", width: 130, valueFormatter: (p: ValueFormatterParams<Position, number>) => fmtUSD(p.value ?? 0) },
    {
      field: "pnl", headerName: "P&L", type: "rightAligned", flex: 1, minWidth: 140,
      cellRenderer: (p: ICellRendererParams<Position, number>) => {
        const wrap = document.createElement("div");
        wrap.style.cssText = "display:flex;flex-direction:column;align-items:flex-end;line-height:1.2";
        const top = document.createElement("span");
        top.className = (p.value ?? 0) >= 0 ? "pl-pos" : "pl-neg";
        top.textContent = fmtPnL(p.value ?? 0);
        const sub = document.createElement("span");
        sub.className = "pl-sub";
        const pct = p.data?.pct ?? 0;
        sub.textContent = (pct >= 0 ? "+" : "") + pct.toFixed(2) + "%";
        wrap.append(top, sub);
        return wrap;
      },
    },
    {
      headerName: "", width: 80, sortable: false, filter: false, resizable: false, suppressMovable: true,
      cellRenderer: (p: ICellRendererParams<Position>) => {
        const btn = document.createElement("button");
        btn.className = "view-link";
        btn.textContent = "View";
        btn.addEventListener("click", () => toast.success(`Open detail · ${p.data?.sym}`));
        return btn;
      },
    },
  ], [toast]);

  return (
    <>
      <PositionsSummary rows={rows} />

      <div className="panel">
        <div className="panel-head">
          <h2><Icon icon="ap-icon-list" /> Open positions</h2>
          <div className="table-controls">
            <Toggle label="Longs only"      checked={longsOnly}     onChange={(v) => setLongsOnly(!!v)}     labelPosition="right" />
            <Toggle label="Group by sector" checked={groupBySector} onChange={(v) => setGroupBySector(!!v)} labelPosition="right" />
            <Ghost variant="default" icon="ap-icon-add" onClick={() => toast.success("New position dialog (stub)")}>
              New position
            </Ghost>
          </div>
        </div>
        <AgGrid<Position>
          rowData={rows}
          columnDefs={columnDefs}
          height={Math.min(rows.length, 12) * 44 + 80}
          rowHeight={44}
          headerHeight={36}
          rowSelection="multiple"
          suppressRowClickSelection
          suppressCellFocus
        />
      </div>
    </>
  );
}

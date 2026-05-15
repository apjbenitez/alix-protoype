"use client";

import { useMemo, useState } from "react";
import { Button, Dropdown, Ghost, Icon, Illustration, useToast } from "@alixpartners/ui-components";
import type { ColDef, ICellRendererParams, ValueFormatterParams } from "ag-grid-community";
import { AgGrid } from "./AgGrid";
import { TRADES } from "../_mock";
import type { Trade } from "../_types";
import { fmtUSD } from "../_format";

function TradesSummary({ rows }: { rows: Trade[] }) {
  const filled    = rows.filter((r) => r.status === "filled");
  const partial   = rows.filter((r) => r.status === "partial").length;
  const pending   = rows.filter((r) => r.status === "pending").length;
  const cancelled = rows.filter((r) => r.status === "cancelled").length;
  const volume    = filled.reduce((a, r) => a + r.value, 0);
  const fees      = filled.reduce((a, r) => a + r.fees,  0);
  const avgFill   = filled.length ? volume / filled.length : 0;

  return (
    <div className="summary-strip">
      <div className="summary-card">
        <div className="summary-label">Fills today</div>
        <div className="summary-value">{filled.length}</div>
        <div className="summary-sub">{partial} partial · {pending} pending · {cancelled} cancelled</div>
      </div>
      <div className="summary-card">
        <div className="summary-label">Notional volume</div>
        <div className="summary-value">{fmtUSD(volume)}</div>
        <div className="summary-sub">Filled value</div>
      </div>
      <div className="summary-card">
        <div className="summary-label">Commissions</div>
        <div className="summary-value">{fmtUSD(fees)}</div>
        <div className="summary-sub">{((fees / Math.max(volume, 1)) * 10000).toFixed(1)} bps avg</div>
      </div>
      <div className="summary-card">
        <div className="summary-label">Avg fill size</div>
        <div className="summary-value">{fmtUSD(avgFill)}</div>
        <div className="summary-sub">Across {filled.length} fills</div>
      </div>
    </div>
  );
}

const SIDE_OPTIONS = [
  { value: "buy",   label: "Buy"   },
  { value: "sell",  label: "Sell"  },
  { value: "short", label: "Short" },
  { value: "cover", label: "Cover" },
];

export function TradesBlotter() {
  const toast = useToast();
  const [sideFilter, setSideFilter] = useState<string[]>([]);

  const rows = useMemo(
    () => (sideFilter.length === 0 ? TRADES : TRADES.filter((t) => sideFilter.includes(t.side.toLowerCase()))),
    [sideFilter]
  );

  const columnDefs = useMemo<ColDef<Trade>[]>(() => [
    {
      field: "time", headerName: "Time", pinned: "left", width: 100,
      cellStyle: { fontVariantNumeric: "tabular-nums", color: "#4a4a4a" },
    },
    {
      field: "side", headerName: "Side", width: 90,
      cellRenderer: (p: ICellRendererParams<Trade, string>) => {
        const s = document.createElement("span");
        s.className = "side-chip side-" + (p.value ?? "").toLowerCase();
        s.textContent = p.value ?? "";
        return s;
      },
    },
    {
      field: "sym", headerName: "Symbol", width: 100,
      cellStyle: { fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: ".02em" },
    },
    { field: "qty",   headerName: "Qty",   type: "rightAligned", width: 90,  valueFormatter: (p: ValueFormatterParams<Trade, number>) => (p.value ?? 0).toLocaleString() },
    { field: "price", headerName: "Price", type: "rightAligned", width: 100, valueFormatter: (p: ValueFormatterParams<Trade, number>) => (p.value ?? 0).toFixed(2) },
    { field: "value", headerName: "Value", type: "rightAligned", width: 120, valueFormatter: (p: ValueFormatterParams<Trade, number>) => fmtUSD(p.value ?? 0) },
    { field: "fees",  headerName: "Fees",  type: "rightAligned", width: 80,
      valueFormatter: (p: ValueFormatterParams<Trade, number>) => "$" + (p.value ?? 0).toFixed(2),
      cellStyle: { color: "#727272" },
    },
    {
      field: "status", headerName: "Status", width: 120,
      cellRenderer: (p: ICellRendererParams<Trade, string>) => {
        const v = p.value ?? "";
        const s = document.createElement("span");
        s.className = "status-dot status-" + v;
        s.textContent = v.charAt(0).toUpperCase() + v.slice(1);
        return s;
      },
    },
    { field: "account", headerName: "Account", width: 170 },
    { field: "trader",  headerName: "Trader",  flex: 1, minWidth: 110 },
    {
      headerName: "", width: 80, sortable: false, filter: false, resizable: false, suppressMovable: true,
      cellRenderer: (p: ICellRendererParams<Trade>) => {
        const btn = document.createElement("button");
        btn.className = "view-link";
        btn.textContent = "Detail";
        btn.addEventListener("click", () => toast.success(`Fill ${p.data?.id} · ${p.data?.sym}`));
        return btn;
      },
    },
  ], [toast]);

  return (
    <>
      <TradesSummary rows={TRADES} />

      <div className="panel">
        <div className="panel-head">
          <h2><Icon icon="ap-icon-document" /> Trade blotter</h2>
          <div className="table-controls">
            <div style={{ minWidth: 220 }}>
              <Dropdown
                label="Side"
                options={SIDE_OPTIONS}
                value={sideFilter}
                onChange={setSideFilter}
                placeholder="All sides"
                multiSelect
              />
            </div>
            <Ghost variant="default" icon="ap-icon-upload" onClick={() => toast.success("Exporting blotter…")}>
              Export blotter
            </Ghost>
          </div>
        </div>
        {rows.length === 0 ? (
          <div className="empty-state">
            <Illustration level={2} category="empty" name="search" size={140} />
            <h3>No fills match this filter</h3>
            <p>Clear the side filter to see all {TRADES.length} fills.</p>
            <div className="cta">
              <Button type="secondary" size="md" icon="ap-icon-sync" onClick={() => setSideFilter([])}>
                Reset filters
              </Button>
            </div>
          </div>
        ) : (
          <AgGrid<Trade>
            rowData={rows}
            columnDefs={columnDefs}
            height={Math.min(rows.length, 10) * 40 + 80}
            rowHeight={40}
            headerHeight={36}
            suppressCellFocus
          />
        )}
      </div>
    </>
  );
}

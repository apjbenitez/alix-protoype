"use client";

import { useMemo } from "react";
import { Icon, useToast } from "@alixpartners/ui-components";
import type { ColDef, ICellRendererParams, ValueFormatterParams } from "ag-grid-community";
import { AgGrid } from "./AgGrid";
import { POSITIONS } from "../_mock";
import type { Position } from "../_types";
import { fmtUSD, fmtPnL, SECTOR_BG, SECTOR_FG } from "../_format";

export function PositionsTable() {
  const toast = useToast();

  const columnDefs = useMemo<ColDef<Position>[]>(() => [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 42, pinned: "left", suppressMovable: true, resizable: false, sortable: false, filter: false,
    },
    {
      field: "sym", headerName: "Symbol", pinned: "left", width: 110,
      tooltipValueGetter: (p) => `Last fill 15:58 ET · ${(p.data?.qty ?? 0) > 0 ? "long" : "short"} · sector ${p.data?.sector}`,
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
    <div className="panel">
      <h2><Icon icon="ap-icon-list" /> Open positions</h2>
      <AgGrid<Position>
        rowData={POSITIONS}
        columnDefs={columnDefs}
        height={POSITIONS.length * 44 + 48}
        rowHeight={44}
        headerHeight={36}
        rowSelection="multiple"
        suppressRowClickSelection
        suppressCellFocus
      />
    </div>
  );
}

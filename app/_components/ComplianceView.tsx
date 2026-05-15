"use client";

import { useMemo, useState } from "react";
import { Banner, Ghost, Icon, Toggle, useToast } from "@alixpartners/ui-components";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { AgGrid } from "./AgGrid";
import { COMPLIANCE_RULES } from "../_mock";
import type { ComplianceRule } from "../_types";

function ComplianceSummary({ rows }: { rows: ComplianceRule[] }) {
  const pass    = rows.filter((r) => r.status === "pass").length;
  const warning = rows.filter((r) => r.status === "warning").length;
  const fail    = rows.filter((r) => r.status === "fail").length;
  return (
    <div className="summary-strip">
      <div className="summary-card">
        <div className="summary-label">Active checks</div>
        <div className="summary-value">{rows.length}</div>
        <div className="summary-sub">Across {new Set(rows.map((r) => r.category)).size} categories</div>
      </div>
      <div className="summary-card">
        <div className="summary-label">Passing</div>
        <div className="summary-value pl-pos">{pass}</div>
        <div className="summary-sub">Within policy</div>
      </div>
      <div className="summary-card">
        <div className="summary-label">Warnings</div>
        <div className="summary-value" style={{ color: "var(--ap-warning)" }}>{warning}</div>
        <div className="summary-sub">Approaching limits</div>
      </div>
      <div className="summary-card">
        <div className="summary-label">Failures</div>
        <div className="summary-value pl-neg">{fail}</div>
        <div className="summary-sub">Require attention</div>
      </div>
    </div>
  );
}

export function ComplianceView() {
  const toast = useToast();
  const [showOnlyIssues, setShowOnlyIssues] = useState(false);
  const failed = COMPLIANCE_RULES.filter((r) => r.status === "fail");

  const rows = useMemo(
    () => (showOnlyIssues ? COMPLIANCE_RULES.filter((r) => r.status !== "pass") : COMPLIANCE_RULES),
    [showOnlyIssues]
  );

  const columnDefs = useMemo<ColDef<ComplianceRule>[]>(() => [
    { field: "id", headerName: "ID", pinned: "left", width: 90,
      cellStyle: { fontVariantNumeric: "tabular-nums", color: "#4a4a4a" } },
    { field: "rule", headerName: "Rule", flex: 1.4, minWidth: 220,
      cellStyle: { fontWeight: 600, color: "#28292c" } },
    { field: "category",  headerName: "Category",  width: 140 },
    { field: "threshold", headerName: "Threshold", width: 170,
      cellStyle: { color: "#727272" } },
    { field: "current", headerName: "Current", flex: 1, minWidth: 180,
      cellStyle: { fontVariantNumeric: "tabular-nums", color: "#28292c" } },
    {
      field: "status", headerName: "Status", width: 110,
      cellRenderer: (p: ICellRendererParams<ComplianceRule, string>) => {
        const v = p.value ?? "";
        const s = document.createElement("span");
        s.className = "cmp-tag cmp-tag--" + v;
        s.textContent = v.charAt(0).toUpperCase() + v.slice(1);
        return s;
      },
    },
    { field: "lastCheck", headerName: "Last check", width: 110,
      cellStyle: { fontVariantNumeric: "tabular-nums", color: "#727272" } },
    {
      headerName: "", width: 90, sortable: false, filter: false, resizable: false, suppressMovable: true,
      cellRenderer: (p: ICellRendererParams<ComplianceRule>) => {
        const btn = document.createElement("button");
        btn.className = "view-link";
        btn.textContent = "Review";
        btn.addEventListener("click", () => toast.success(`Open ${p.data?.id} · ${p.data?.rule}`));
        return btn;
      },
    },
  ], [toast]);

  return (
    <>
      <ComplianceSummary rows={COMPLIANCE_RULES} />

      {failed.length > 0 && (
        <Banner
          type="error"
          size="md"
          isFullWidth
          content={`${failed.length} compliance ${failed.length === 1 ? "failure" : "failures"} require attention — ${failed.map((f) => f.id).join(", ")}.`}
        />
      )}

      <div className="panel">
        <div className="panel-head">
          <h2><Icon icon="ap-icon-alert" /> Active compliance rules</h2>
          <div className="table-controls">
            <Toggle label="Only issues" checked={showOnlyIssues} onChange={(v) => setShowOnlyIssues(!!v)} labelPosition="right" />
            <Ghost variant="default" icon="ap-icon-sync" onClick={() => toast.success("Re-running compliance checks…")}>
              Re-run all
            </Ghost>
          </div>
        </div>
        <AgGrid<ComplianceRule>
          rowData={rows}
          columnDefs={columnDefs}
          height={Math.min(rows.length, 10) * 40 + 80}
          rowHeight={40}
          headerHeight={36}
          suppressCellFocus
        />
      </div>
    </>
  );
}

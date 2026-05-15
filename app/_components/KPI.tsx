"use client";

import { Tag, Tooltip } from "@alixpartners/ui-components";
import type { KPI as KPIType } from "../_types";

interface KPIProps {
  k: KPIType;
}

export function KPI({ k }: KPIProps) {
  const tag =
    k.tone === "success" ? <Tag type="success" size="sm" structure="solid" label={k.delta} noIcon /> :
    k.tone === "warning" ? <Tag type="warning" size="sm" structure="solid" label={k.delta} noIcon /> :
    k.tone === "error"   ? <Tag type="error"   size="sm" structure="solid" label={k.delta} noIcon /> :
                           <Tag type="basic"   size="sm" structure="border" color="gray" label={k.delta} noIcon />;

  return (
    <div className="kpi-card">
      <div className="kpi-label">
        <Tooltip content={k.tip} size="sm" tipSide="top">
          <span style={{ cursor: "help", borderBottom: "1px dotted var(--ap-border)" }}>{k.label}</span>
        </Tooltip>
      </div>
      <div className="kpi-value">{k.value}</div>
      <div className="kpi-delta">{tag}</div>
    </div>
  );
}

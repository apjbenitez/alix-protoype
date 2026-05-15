"use client";

import { Icon, Tag } from "@alixpartners/ui-components";
import { GAINERS, LOSERS } from "../_mock";

export function MoversPanel() {
  return (
    <div className="panel">
      <h2><Icon icon="ap-icon-bar" /> Top movers</h2>
      <div className="movers">
        <div>
          <div className="col-head">
            <strong style={{ color: "var(--ap-success-2)" }}>Gainers</strong>
            <Tag type="success" size="sm" structure="borderless" label={`${GAINERS.length} symbols`} noIcon />
          </div>
          {GAINERS.map((r) => (
            <div className="row" key={r.sym}>
              <div><div className="sym">{r.sym}</div><div className="qty">{r.qty}</div></div>
              <div style={{ textAlign: "right" }}><div className="pl-pos">{r.pnl}</div><div className="qty">{r.pct}</div></div>
            </div>
          ))}
        </div>
        <div>
          <div className="col-head">
            <strong style={{ color: "var(--ap-error-2)" }}>Losers</strong>
            <Tag type="error" size="sm" structure="borderless" label={`${LOSERS.length} symbols`} noIcon />
          </div>
          {LOSERS.map((r) => (
            <div className="row" key={r.sym}>
              <div><div className="sym">{r.sym}</div><div className="qty">{r.qty}</div></div>
              <div style={{ textAlign: "right" }}><div className="pl-neg">{r.pnl}</div><div className="qty">{r.pct}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

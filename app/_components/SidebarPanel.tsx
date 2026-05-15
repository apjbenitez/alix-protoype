"use client";

import { useState } from "react";
import {
  Banner,
  Button,
  Creatable,
  Dialog,
  Icon,
  Input,
  Radio,
  RadioGroup,
  TagsFields,
  Textarea,
  Toggle,
  useToast,
} from "@alixpartners/ui-components";

export function SidebarPanel() {
  const toast = useToast();
  const [threshold, setThreshold]   = useState("50000");
  const [refresh, setRefresh]       = useState("eod");
  const [watchlist, setWatchlist]   = useState(["NVDA", "TSLA", "MSFT"]);
  const [tags, setTags]             = useState(["earnings"]);
  const [notes, setNotes]           = useState("");
  const [groupSector, setGroupSector] = useState(false);
  const [hideHedges, setHideHedges]   = useState(true);
  const [reportOpen, setReportOpen]   = useState(false);

  return (
    <aside className="sidebar">
      <div className="panel">
        <h2><Icon icon="ap-icon-alert" /> Risk alerts</h2>
        <div className="stack-sm">
          <Banner type="warning" size="sm" content="NVDA concentration 27% of NAV — above policy cap." />
          <Banner type="info" size="sm" content="Vol-target rebalance scheduled tomorrow at open." />
        </div>
      </div>

      <div className="panel">
        <h2><Icon icon="ap-icon-settings" /> Display settings</h2>
        <div className="stack-md">
          <Toggle label="Group positions by sector" checked={groupSector} onChange={(v) => setGroupSector(!!v)} labelPosition="right" />
          <Toggle label="Hide intraday hedges"      checked={hideHedges}  onChange={(v) => setHideHedges(!!v)}  labelPosition="right" />
          <Input
            type="number"
            label="P&L alert threshold ($)"
            value={threshold}
            onChange={setThreshold}
            icon="ap-icon-financial"
            iconPosition="left"
            helpText="Trigger a toast when daily P&L crosses this value."
          />
          <div>
            <div style={{ fontSize: 11, color: "var(--ap-text-muted)", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>
              Refresh cadence
            </div>
            <RadioGroup value={refresh} onChange={setRefresh} orientation="vertical" ariaLabel="Refresh cadence">
              <Radio label="End of day only"   value="eod"  />
              <Radio label="Every 15 minutes"  value="15m"  />
              <Radio label="Live (websocket)"  value="live" />
            </RadioGroup>
          </div>
        </div>
      </div>

      <div className="panel">
        <h2><Icon icon="ap-icon-bookmark" /> Watchlist</h2>
        <TagsFields
          label="Tracked symbols"
          options={[
            { value: "NVDA",  label: "NVDA" },
            { value: "TSLA",  label: "TSLA" },
            { value: "AAPL",  label: "AAPL" },
            { value: "MSFT",  label: "MSFT" },
            { value: "META",  label: "META" },
            { value: "GOOGL", label: "GOOGL" },
            { value: "SPY",   label: "SPY" },
          ]}
          value={watchlist}
          onChange={setWatchlist}
          multiSelect
          searchable
          searchPlaceholder="Add symbol"
        />
      </div>

      <div className="panel">
        <h2><Icon icon="ap-icon-comment" /> Day notes</h2>
        <div className="stack-md">
          <Creatable
            label="Day tags"
            options={[
              { value: "volatile",  label: "Volatile" },
              { value: "earnings",  label: "Earnings week" },
              { value: "fomc",      label: "FOMC" },
              { value: "rebalance", label: "Rebalance" },
            ]}
            value={tags}
            onChange={setTags}
            multiSelect
          />
          <Textarea
            label="Notes"
            value={notes}
            onChange={setNotes}
            rows={3}
            placeholder="Anything notable about today's session?"
            fullWidth
            resize="vertical"
          />
        </div>
      </div>

      <Button type="primary" size="md" icon="ap-icon-send" onClick={() => setReportOpen(true)}>
        Send daily report
      </Button>

      <Dialog
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Send daily report"
        description="Email an end-of-day P&L summary with attached CSV to the desk distribution list."
        confirmButtonText="Send report"
        cancelButtonText="Cancel"
        onConfirm={() => { setReportOpen(false); toast.success("Daily report queued for delivery."); }}
        onCancel={() => setReportOpen(false)}
      />
    </aside>
  );
}

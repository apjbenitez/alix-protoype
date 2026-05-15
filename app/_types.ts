export type KPI = {
  id: string;
  label: string;
  value: string;
  delta: string;
  tone: "success" | "warning" | "error" | "basic";
  tip: string;
};

export type Mover = { sym: string; qty: string; pnl: string; pct: string };

export type Position = {
  sym: string;
  sector: string;
  qty: number;
  avg: number;
  mark: number;
  mv: number;
  pnl: number;
  pct: number;
  account: string;
};

export type TradeStatus = "filled" | "partial" | "pending" | "cancelled";
export type TradeSide = "BUY" | "SELL" | "SHORT" | "COVER";

export type Trade = {
  id: string;
  time: string;
  side: TradeSide;
  sym: string;
  qty: number;
  price: number;
  value: number;
  fees: number;
  status: TradeStatus;
  account: string;
  trader: string;
};

export type SleeveStatus = "on" | "over" | "under";

export type Sleeve = {
  id: string;
  name: string;
  target: number;
  current: number;
  nav: number;
  dayPL: number;
  status: SleeveStatus;
};

export type SectorAllocation = { sector: string; pct: number };

export type ComplianceStatus = "pass" | "warning" | "fail";

export type ComplianceRule = {
  id: string;
  rule: string;
  threshold: string;
  current: string;
  status: ComplianceStatus;
  category: string;
  lastCheck: string;
};

export type ScenarioSeverity = "info" | "warning" | "error";

export type StressScenario = {
  id: string;
  name: string;
  category: string;
  impact: number;
  pctNav: number;
  severity: ScenarioSeverity;
};

export type PositionRisk = {
  sym: string;
  sector: string;
  mv: number;
  marginalVar: number;
  pctOfTotal: number;
  beta: number;
};

export type DropdownOption = { value: string; label: string };
export type ExportAction = { value: string; label: string; action: () => void };

export type ChatRole = "user" | "assistant";
export type ChatMessage = { role: ChatRole; text: string };

export type TabKey = "overview" | "positions" | "trades" | "allocations" | "risk" | "compliance";

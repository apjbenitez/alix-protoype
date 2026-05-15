import type {
  KPI,
  Mover,
  Position,
  Trade,
  Sleeve,
  SectorAllocation,
  ComplianceRule,
  StressScenario,
  PositionRisk,
  DropdownOption,
  ExportAction,
} from "./_types";

export const KPIS: KPI[] = [
  { id: "pnl",    label: "Daily P&L",       value: "+$248,420", delta: "+1.84%",     tone: "success", tip: "Realized + unrealized P&L, mark-to-market at 4:00 PM ET close." },
  { id: "win",    label: "Win Rate",        value: "64.1%",     delta: "+3.2 pp",    tone: "success", tip: "Share of closed positions today with positive P&L." },
  { id: "trades", label: "Trades Executed", value: "142",       delta: "−18 vs avg", tone: "warning", tip: "Total fills across all accounts. Below the 30-day average." },
  { id: "expo",   label: "Net Exposure",    value: "$4.21M",    delta: "62% gross",  tone: "basic",   tip: "Net long − net short, mark-to-market position values." },
];

export const ACCOUNT_OPTIONS: DropdownOption[] = [
  { value: "all",   label: "All accounts" },
  { value: "core",  label: "Core Long Equity" },
  { value: "hedge", label: "Hedge Overlay" },
  { value: "macro", label: "Macro Discretionary" },
];

export const ASSET_CLASS_OPTIONS: DropdownOption[] = [
  { value: "equity",  label: "Equities" },
  { value: "options", label: "Options" },
  { value: "futures", label: "Futures" },
  { value: "fx",      label: "FX" },
];

export const EXPORT_ACTIONS: ExportAction[] = [
  { value: "csv",  label: "Export as CSV",   action: () => {} },
  { value: "xlsx", label: "Export as Excel", action: () => {} },
  { value: "pdf",  label: "Export as PDF",   action: () => {} },
];

export const GAINERS: Mover[] = [
  { sym: "NVDA", qty: "1,400 sh", pnl: "+$48,210", pct: "+3.87%" },
  { sym: "TSLA", qty: "950 sh",   pnl: "+$22,890", pct: "+2.35%" },
  { sym: "MSFT", qty: "600 sh",   pnl: "+$14,520", pct: "+1.10%" },
  { sym: "AMZN", qty: "420 sh",   pnl: "+$9,180",  pct: "+0.90%" },
];

export const LOSERS: Mover[] = [
  { sym: "META", qty: "−300 sh",   pnl: "−$8,640", pct: "−1.20%" },
  { sym: "JPM",  qty: "−500 sh",   pnl: "−$5,210", pct: "−0.71%" },
  { sym: "BAC",  qty: "−1,200 sh", pnl: "−$3,420", pct: "−0.45%" },
  { sym: "SPY",  qty: "200 sh",    pnl: "−$1,950", pct: "−0.22%" },
];

export const POSITIONS: Position[] = [
  { sym: "NVDA", sector: "Tech",       qty:  1400, avg: 920.42, mark: 956.10, mv:  1338540, pnl:  49952, pct:  3.87, account: "Core Long Equity" },
  { sym: "TSLA", sector: "Consumer",   qty:   950, avg: 174.20, mark: 178.30, mv:   169385, pnl:   3895, pct:  2.35, account: "Core Long Equity" },
  { sym: "MSFT", sector: "Tech",       qty:   600, avg: 428.00, mark: 432.70, mv:   259620, pnl:   2820, pct:  1.10, account: "Core Long Equity" },
  { sym: "AMZN", sector: "Consumer",   qty:   420, avg: 184.10, mark: 185.75, mv:    78015, pnl:    693, pct:  0.90, account: "Core Long Equity" },
  { sym: "META", sector: "Tech",       qty:  -300, avg: 482.00, mark: 488.10, mv:  -146430, pnl:  -1830, pct: -1.20, account: "Hedge Overlay" },
  { sym: "JPM",  sector: "Financials", qty:  -500, avg: 196.00, mark: 197.40, mv:   -98700, pnl:   -700, pct: -0.71, account: "Hedge Overlay" },
];

export const POSITIONS_FULL: Position[] = [
  ...POSITIONS,
  { sym: "AAPL",  sector: "Tech",        qty:   800, avg: 188.50, mark: 191.20, mv:   152960, pnl:   2160, pct:  1.43, account: "Core Long Equity" },
  { sym: "GOOGL", sector: "Tech",        qty:   500, avg: 162.30, mark: 165.40, mv:    82700, pnl:   1550, pct:  1.91, account: "Core Long Equity" },
  { sym: "BAC",   sector: "Financials",  qty: -1200, avg: 38.40,  mark: 38.92,  mv:   -46704, pnl:   -624, pct: -1.35, account: "Hedge Overlay" },
  { sym: "GS",    sector: "Financials",  qty:   180, avg: 472.00, mark: 478.80, mv:    86184, pnl:   1224, pct:  1.44, account: "Macro Discretionary" },
  { sym: "XOM",   sector: "Energy",      qty:   600, avg: 116.20, mark: 114.80, mv:    68880, pnl:   -840, pct: -1.20, account: "Macro Discretionary" },
  { sym: "CVX",   sector: "Energy",      qty:  -250, avg: 152.30, mark: 150.95, mv:   -37738, pnl:    338, pct:  0.89, account: "Hedge Overlay" },
  { sym: "PFE",   sector: "Healthcare",  qty:  1500, avg: 28.40,  mark: 29.10,  mv:    43650, pnl:   1050, pct:  2.47, account: "Core Long Equity" },
  { sym: "UNH",   sector: "Healthcare",  qty:   220, avg: 524.00, mark: 530.20, mv:   116644, pnl:   1364, pct:  1.18, account: "Core Long Equity" },
  { sym: "LLY",   sector: "Healthcare",  qty:   140, avg: 762.00, mark: 770.80, mv:   107912, pnl:   1232, pct:  1.15, account: "Core Long Equity" },
  { sym: "WMT",   sector: "Consumer",    qty:   600, avg: 68.90,  mark: 69.40,  mv:    41640, pnl:    300, pct:  0.73, account: "Core Long Equity" },
  { sym: "HD",    sector: "Consumer",    qty:  -180, avg: 348.00, mark: 351.40, mv:   -63252, pnl:   -612, pct: -0.98, account: "Hedge Overlay" },
  { sym: "AMD",   sector: "Tech",        qty:   420, avg: 178.20, mark: 182.60, mv:    76692, pnl:   1848, pct:  2.47, account: "Core Long Equity" },
  { sym: "ORCL",  sector: "Tech",        qty:   320, avg: 142.10, mark: 143.85, mv:    46032, pnl:    560, pct:  1.23, account: "Core Long Equity" },
  { sym: "WFC",   sector: "Financials",  qty:   500, avg: 62.40,  mark: 62.10,  mv:    31050, pnl:   -150, pct: -0.48, account: "Macro Discretionary" },
  { sym: "SLB",   sector: "Energy",      qty:   800, avg: 47.20,  mark: 48.10,  mv:    38480, pnl:    720, pct:  1.91, account: "Macro Discretionary" },
  { sym: "ABBV",  sector: "Healthcare",  qty:  -150, avg: 168.30, mark: 169.90, mv:   -25485, pnl:   -240, pct: -0.95, account: "Hedge Overlay" },
  { sym: "SPY",   sector: "Index",       qty:  -400, avg: 528.00, mark: 530.30, mv:  -212120, pnl:   -920, pct: -0.44, account: "Hedge Overlay" },
];

export const TRADES: Trade[] = [
  { id: "F-10314", time: "15:58:21", side: "BUY",   sym: "NVDA",  qty:  200, price: 956.10, value: 191220, fees: 14.30, status: "filled",    account: "Core Long Equity",    trader: "S. Park" },
  { id: "F-10312", time: "15:51:08", side: "SELL",  sym: "META",  qty:  100, price: 488.10, value:  48810, fees:  7.40, status: "filled",    account: "Hedge Overlay",       trader: "J. Kim" },
  { id: "F-10309", time: "15:44:55", side: "BUY",   sym: "AMD",   qty:  150, price: 182.60, value:  27390, fees:  4.10, status: "filled",    account: "Core Long Equity",    trader: "S. Park" },
  { id: "F-10307", time: "15:31:42", side: "SHORT", sym: "BAC",   qty:  400, price:  38.92, value:  15568, fees:  2.30, status: "filled",    account: "Hedge Overlay",       trader: "J. Kim" },
  { id: "F-10305", time: "15:22:19", side: "BUY",   sym: "PFE",   qty:  500, price:  29.10, value:  14550, fees:  2.20, status: "filled",    account: "Core Long Equity",    trader: "R. Chen" },
  { id: "F-10304", time: "15:14:03", side: "COVER", sym: "CVX",   qty:  100, price: 150.95, value:  15095, fees:  2.30, status: "filled",    account: "Hedge Overlay",       trader: "J. Kim" },
  { id: "F-10301", time: "14:58:46", side: "BUY",   sym: "TSLA",  qty:   80, price: 178.30, value:  14264, fees:  2.10, status: "filled",    account: "Core Long Equity",    trader: "S. Park" },
  { id: "F-10298", time: "14:42:11", side: "SELL",  sym: "WMT",   qty:  120, price:  69.40, value:   8328, fees:  1.30, status: "partial",   account: "Core Long Equity",    trader: "R. Chen" },
  { id: "F-10295", time: "14:31:30", side: "BUY",   sym: "GOOGL", qty:   60, price: 165.40, value:   9924, fees:  1.50, status: "filled",    account: "Core Long Equity",    trader: "S. Park" },
  { id: "F-10293", time: "14:18:54", side: "SHORT", sym: "SPY",   qty:  100, price: 530.30, value:  53030, fees:  7.90, status: "filled",    account: "Hedge Overlay",       trader: "J. Kim" },
  { id: "F-10290", time: "13:57:22", side: "BUY",   sym: "UNH",   qty:   40, price: 530.20, value:  21208, fees:  3.20, status: "filled",    account: "Core Long Equity",    trader: "R. Chen" },
  { id: "F-10287", time: "13:42:08", side: "SELL",  sym: "JPM",   qty:  150, price: 197.40, value:  29610, fees:  4.40, status: "filled",    account: "Hedge Overlay",       trader: "J. Kim" },
  { id: "F-10283", time: "13:18:51", side: "BUY",   sym: "MSFT",  qty:   80, price: 432.70, value:  34616, fees:  5.20, status: "filled",    account: "Core Long Equity",    trader: "S. Park" },
  { id: "F-10281", time: "12:55:14", side: "BUY",   sym: "XOM",   qty:  200, price: 114.80, value:  22960, fees:  3.40, status: "cancelled", account: "Macro Discretionary", trader: "A. Vega" },
  { id: "F-10279", time: "12:41:02", side: "SELL",  sym: "ABBV",  qty:   50, price: 169.90, value:   8495, fees:  1.30, status: "filled",    account: "Hedge Overlay",       trader: "J. Kim" },
  { id: "F-10277", time: "12:24:33", side: "BUY",   sym: "SLB",   qty:  300, price:  48.10, value:  14430, fees:  2.20, status: "filled",    account: "Macro Discretionary", trader: "A. Vega" },
  { id: "F-10275", time: "12:08:11", side: "SELL",  sym: "AAPL",  qty:   60, price: 191.20, value:  11472, fees:  1.70, status: "filled",    account: "Core Long Equity",    trader: "R. Chen" },
  { id: "F-10272", time: "11:46:50", side: "BUY",   sym: "GS",    qty:   30, price: 478.80, value:  14364, fees:  2.20, status: "filled",    account: "Macro Discretionary", trader: "A. Vega" },
  { id: "F-10270", time: "11:32:18", side: "SHORT", sym: "HD",    qty:   60, price: 351.40, value:  21084, fees:  3.20, status: "pending",   account: "Hedge Overlay",       trader: "J. Kim" },
  { id: "F-10267", time: "11:11:04", side: "BUY",   sym: "ORCL",  qty:  100, price: 143.85, value:  14385, fees:  2.20, status: "filled",    account: "Core Long Equity",    trader: "S. Park" },
];

export const SLEEVES: Sleeve[] = [
  { id: "core",  name: "Core Long Equity",    target: 50.0, current: 53.2, nav: 21250000, dayPL:  142800, status: "over"  },
  { id: "hedge", name: "Hedge Overlay",       target: 20.0, current: 19.5, nav:  7780000, dayPL:  -24300, status: "on"    },
  { id: "macro", name: "Macro Discretionary", target: 15.0, current: 14.1, nav:  5630000, dayPL:   38420, status: "under" },
  { id: "cash",  name: "Cash & Equivalents",  target: 10.0, current:  8.4, nav:  3360000, dayPL:     920, status: "under" },
  { id: "spec",  name: "Special Situations",  target:  5.0, current:  4.8, nav:  1920000, dayPL:    9810, status: "on"    },
];

export const SECTOR_ALLOCATION: SectorAllocation[] = [
  { sector: "Tech",         pct: 32.4 },
  { sector: "Financials",   pct: 18.2 },
  { sector: "Healthcare",   pct: 14.6 },
  { sector: "Consumer",     pct: 12.8 },
  { sector: "Energy",       pct:  9.4 },
  { sector: "Index hedges", pct:  8.1 },
  { sector: "Cash",         pct:  4.5 },
];

export const COMPLIANCE_RULES: ComplianceRule[] = [
  { id: "C-201", rule: "Single position concentration", threshold: "≤ 25% NAV",         current: "27.1% (NVDA)",          status: "fail",    category: "Concentration", lastCheck: "15:42 ET" },
  { id: "C-202", rule: "Sector concentration",          threshold: "≤ 35% NAV",         current: "32.4% (Tech)",          status: "pass",    category: "Concentration", lastCheck: "15:42 ET" },
  { id: "C-203", rule: "Gross leverage",                threshold: "≤ 1.8x",            current: "1.42x",                 status: "pass",    category: "Leverage",      lastCheck: "15:42 ET" },
  { id: "C-204", rule: "Net exposure band",             threshold: "20% ≤ x ≤ 70%",     current: "62%",                   status: "pass",    category: "Exposure",      lastCheck: "15:42 ET" },
  { id: "C-205", rule: "Restricted list",               threshold: "0 positions",       current: "0",                     status: "pass",    category: "Restrictions",  lastCheck: "15:42 ET" },
  { id: "C-206", rule: "Borrow availability",           threshold: "All shorts borrowed", current: "META, SPY OK",        status: "pass",    category: "Execution",     lastCheck: "15:38 ET" },
  { id: "C-207", rule: "VaR (1-day, 95%)",              threshold: "≤ $250k",           current: "$182k",                 status: "pass",    category: "Risk",          lastCheck: "15:30 ET" },
  { id: "C-208", rule: "Liquidity vs 5-day ADV",        threshold: "Position ≤ 10% ADV", current: "All positions OK",     status: "pass",    category: "Liquidity",     lastCheck: "15:30 ET" },
  { id: "C-209", rule: "Counterparty limits",           threshold: "≤ $5M per CP",      current: "$3.2M max",             status: "warning", category: "Counterparty",  lastCheck: "15:30 ET" },
  { id: "C-210", rule: "Risk engine connectivity",      threshold: "Active",            current: "503 — stale 18m",       status: "fail",    category: "Operational",   lastCheck: "15:24 ET" },
];

export const VAR_SUMMARY = {
  var1d: 182000,
  var5d: 408000,
  stressMaxLoss: 1200000,
  beta: 0.62,
  navUsed: 39940000,
};

export const STRESS_SCENARIOS: StressScenario[] = [
  { id: "S-01", name: "SPX −10%",     category: "Equity beta", impact: -1200000, pctNav: -3.00, severity: "error"   },
  { id: "S-02", name: "Tech −8%",     category: "Sector",      impact:  -880000, pctNav: -2.20, severity: "error"   },
  { id: "S-03", name: "Vol +5 pts",   category: "Volatility",  impact:  -340000, pctNav: -0.85, severity: "warning" },
  { id: "S-04", name: "Rates +50 bp", category: "Rates",       impact:  -210000, pctNav: -0.53, severity: "warning" },
  { id: "S-05", name: "Energy −15%",  category: "Commodity",   impact:  -180000, pctNav: -0.45, severity: "info"    },
  { id: "S-06", name: "USD +5%",      category: "FX",          impact:   -95000, pctNav: -0.24, severity: "info"    },
];

export const POSITION_RISK: PositionRisk[] = [
  { sym: "NVDA",  sector: "Tech",       mv:  1338540, marginalVar:  58200, pctOfTotal: 32.0, beta: 1.62 },
  { sym: "TSLA",  sector: "Consumer",   mv:   169385, marginalVar:  14600, pctOfTotal:  8.0, beta: 1.84 },
  { sym: "META",  sector: "Tech",       mv:  -146430, marginalVar:  12100, pctOfTotal:  6.6, beta: 1.21 },
  { sym: "AMD",   sector: "Tech",       mv:    76692, marginalVar:  10400, pctOfTotal:  5.7, beta: 1.74 },
  { sym: "AAPL",  sector: "Tech",       mv:   152960, marginalVar:   9800, pctOfTotal:  5.4, beta: 1.18 },
  { sym: "GOOGL", sector: "Tech",       mv:    82700, marginalVar:   7200, pctOfTotal:  4.0, beta: 1.10 },
  { sym: "MSFT",  sector: "Tech",       mv:   259620, marginalVar:   6900, pctOfTotal:  3.8, beta: 0.92 },
  { sym: "SPY",   sector: "Index",      mv:  -212120, marginalVar:   5400, pctOfTotal:  3.0, beta: 1.00 },
  { sym: "JPM",   sector: "Financials", mv:   -98700, marginalVar:   4200, pctOfTotal:  2.3, beta: 1.15 },
  { sym: "AMZN",  sector: "Consumer",   mv:    78015, marginalVar:   3800, pctOfTotal:  2.1, beta: 1.32 },
  { sym: "XOM",   sector: "Energy",     mv:    68880, marginalVar:   3400, pctOfTotal:  1.9, beta: 0.74 },
  { sym: "LLY",   sector: "Healthcare", mv:   107912, marginalVar:   3100, pctOfTotal:  1.7, beta: 0.55 },
];

export const SUGGESTED_PROMPTS = [
  "Summarize today's P&L",
  "Why is NVDA flagged?",
  "Top compliance failures",
  "Should I rebalance?",
];

export function mockAIResponse(userText: string): string {
  const t = userText.toLowerCase();
  if (/\b(hi|hello|hey)\b/.test(t)) {
    return "Hi Julian — EOD reconciliation finished at 4:18 PM. Ask me about P&L, positions, trades, compliance, or allocations.";
  }
  if (/p&?l|pnl|profit/.test(t) || /summari[sz]e today/.test(t)) {
    return "Daily P&L is +$248,420 (+1.84%).\n\nTop contributors:\n• NVDA  +$49,952 (+3.87%)\n• TSLA  +$3,895 (+2.35%)\n• AMD   +$1,848 (+2.47%)\n\nDrags:\n• META  −$1,830 (−1.20%)\n• JPM   −$700 (−0.71%)\n\n64% of closed positions ended green.";
  }
  if (/nvda/.test(t)) {
    return "NVDA — long 1,400 sh at $920.42 avg, marked $956.10.\nUnrealized P&L: +$49,952 (+3.87%), market value $1.34M.\n\nHeads-up: NVDA is 27.1% of NAV — above the 25% concentration cap (compliance rule C-201 is currently failing).";
  }
  if (/trade|fill|execut/.test(t)) {
    return "142 fills today across 4 accounts.\n• Notional volume ~$2.86M\n• Avg fill size ~$20k\n• 17 partial · 1 pending (HD short) · 1 cancelled (XOM)\n\nLargest fill: NVDA +200 sh @ $956.10 (F-10314) at 15:58 ET.";
  }
  if (/compl|risk|violat|fail/.test(t) || /flag/.test(t)) {
    return "2 compliance failures right now:\n\n• C-201  Single position concentration\n   27.1% (NVDA) vs cap 25% NAV\n\n• C-210  Risk engine connectivity\n   503 — checks stale 18m\n\nAlso watching:\n• C-209  Counterparty limits — warning ($3.2M / $5M cap)";
  }
  if (/position/.test(t)) {
    return "23 open positions today (17 long, 6 short).\n\n• Gross exposure $4.21M\n• Net exposure 62% gross\n• Largest position: NVDA at $1.34M MV (27% of gross)\n• 19 positions in profit, 4 in the red";
  }
  if (/alloc|sleeve|rebalanc/.test(t)) {
    return "Sleeve drift vs target:\n• Core Long Equity   53.2%  (target 50,  +3.2 pp over)\n• Hedge Overlay      19.5%  (target 20,  on target)\n• Macro Discretionary 14.1% (target 15,  −0.9 pp under)\n• Cash & Equivalents  8.4%  (target 10,  −1.6 pp under)\n• Special Situations  4.8%  (target 5,   on target)\n\nA gentle Core → Cash trim of ~$1.3M would bring both back to target.";
  }
  if (/expor|report|csv|email|send/.test(t)) {
    return "I can queue the EOD report for delivery. Want me to attach the trade blotter (142 fills) and the failing-rule detail, or send just the headline P&L summary?";
  }
  if (/\bwhy\b/.test(t)) {
    return "Quick read on today: tech rallied (NVDA +3.87%, AMD +2.47%) which pulled the Core sleeve over its 50% target. Risk-off names (JPM, BAC) underperformed, but the hedge overlay offset most of the drag. Net result: +$248k vs a flat tape.";
  }
  return "I don't have a confident read on that one. Try asking about NVDA, today's P&L, trades, compliance, or sleeve allocations. Or click one of the suggestions above.";
}

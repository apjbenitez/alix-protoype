export const fmtUSD = (n: number): string =>
  (n < 0 ? "−$" : "$") + Math.abs(n).toLocaleString(undefined, { maximumFractionDigits: 0 });

export const fmtPnL = (n: number): string =>
  (n >= 0 ? "+$" : "−$") + Math.abs(n).toLocaleString(undefined, { maximumFractionDigits: 0 });

export const SECTOR_BG: Record<string, string> = {
  Tech:        "#e5eef5",
  Consumer:    "#e3eee6",
  Financials:  "#ece4ee",
  Energy:      "#f7e6d1",
  Healthcare:  "#dff0db",
  Index:       "#ececec",
};

export const SECTOR_FG: Record<string, string> = {
  Tech:        "#024870",
  Consumer:    "#3f7b25",
  Financials:  "#5f4a73",
  Energy:      "#ce7309",
  Healthcare:  "#498e2b",
  Index:       "#4a4a4a",
};

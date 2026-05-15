import { useEffect, useRef, useMemo, createElement } from "react";

export * as React from "react";
export { createRoot } from "react-dom/client";
export * from "@alixpartners/ui-components";

type AgGridProps = {
  rowData: any[];
  columnDefs: any[];
  height?: number | string;
  theme?: string;
  gridOptions?: Record<string, any>;
  defaultColDef?: Record<string, any>;
  rowHeight?: number;
  headerHeight?: number;
  pagination?: boolean;
  paginationPageSize?: number;
  onReady?: (api: any) => void;
};

export function AgGrid({
  rowData,
  columnDefs,
  height = 400,
  theme = "ag-theme-quartz",
  gridOptions = {},
  defaultColDef,
  rowHeight,
  headerHeight,
  pagination,
  paginationPageSize,
  onReady,
}: AgGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);

  const mergedDefaults = useMemo(
    () => ({ resizable: true, sortable: true, filter: true, flex: 1, minWidth: 80, ...(defaultColDef || {}) }),
    [defaultColDef]
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const agGrid = (globalThis as any).agGrid;
    if (!agGrid?.createGrid) {
      containerRef.current.innerHTML =
        '<div style="padding:24px;color:#991b1b;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;font:13px system-ui;">' +
        "AG Grid not loaded. Add the CDN &lt;script&gt; and &lt;link&gt; tags to the page &lt;head&gt;." +
        "</div>";
      return;
    }
    const api = agGrid.createGrid(containerRef.current, {
      rowData,
      columnDefs,
      defaultColDef: mergedDefaults,
      animateRows: true,
      rowHeight,
      headerHeight,
      pagination,
      paginationPageSize,
      ...gridOptions,
    });
    apiRef.current = api;
    onReady?.(api);
    return () => api.destroy?.();
    // Intentionally create the grid once; row/column updates are pushed via the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    apiRef.current?.setGridOption?.("rowData", rowData);
  }, [rowData]);
  useEffect(() => {
    apiRef.current?.setGridOption?.("columnDefs", columnDefs);
  }, [columnDefs]);

  const style: Record<string, any> = {
    height: typeof height === "number" ? height + "px" : height,
    width: "100%",
  };

  return createElement("div", { ref: containerRef, className: theme, style });
}

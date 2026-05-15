"use client";

import { AgGridReact } from "ag-grid-react";
import type { AgGridReactProps } from "ag-grid-react";

interface AgGridProps<T> extends AgGridReactProps<T> {
  height?: number;
}

export function AgGrid<T = unknown>({ height = 400, ...rest }: AgGridProps<T>) {
  return (
    <div className="ag-theme-quartz" style={{ height, width: "100%" }}>
      <AgGridReact<T> {...rest} />
    </div>
  );
}

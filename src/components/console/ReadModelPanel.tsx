import type { ReactNode } from "react";

import { Panel, PanelHeader } from "@/components/protocol/PanelUI";
import type { ReadResult } from "@/lib/read-api";

export function ReadModelNote() {
  return <span className="text-[11px] text-muted">Read model. Not protocol truth.</span>;
}

export function ReadModelStatus<T>({
  result,
  empty,
  children,
}: {
  result: ReadResult<T>;
  empty?: boolean;
  children?: ReactNode;
}) {
  if (result.status === "unconfigured") {
    return (
      <Panel className="p-5">
        <PanelHeader title="Indexed rows" meta={<ReadModelNote />} />
        <p className="mt-4 text-sm text-fg-soft">
          NEXT_PUBLIC_API_URL is unset. This page does not invent rows.
        </p>
      </Panel>
    );
  }
  if (result.status === "unavailable" || result.status === "error") {
    return (
      <Panel className="p-5">
        <PanelHeader title="Indexed rows" meta={<ReadModelNote />} />
        <p className="mt-4 text-sm text-fg-soft">{result.message}</p>
      </Panel>
    );
  }
  return (
    <Panel className="p-5">
      <PanelHeader title="Indexed rows" meta={<ReadModelNote />} />
      {empty ? (
        <p className="mt-4 text-sm text-fg-soft">
          The indexed list is empty. That is a valid read, not a placeholder.
        </p>
      ) : (
        <div className="mt-4">{children}</div>
      )}
    </Panel>
  );
}

export function ReadTable({
  columns,
  rows,
}: {
  columns: { key: string; label: string }[];
  rows: Array<Record<string, string | number | null | undefined>>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line text-muted">
            {columns.map((column) => (
              <th key={column.key} className="py-2 pr-4 font-medium">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={String(row.id ?? index)} className="border-b border-line last:border-0">
              {columns.map((column) => (
                <td key={column.key} className="py-2 pr-4 font-mono text-[12px] text-fg-soft">
                  {formatCell(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  const text = String(value);
  return text.length > 20 ? `${text.slice(0, 8)}…${text.slice(-6)}` : text;
}

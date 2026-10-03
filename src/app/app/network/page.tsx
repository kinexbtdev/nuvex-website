import { ReadModelStatus } from "@/components/console/ReadModelPanel";
import { ConsoleView } from "@/components/layout/ConsoleShell";
import { HeartbeatChart } from "@/components/protocol/visuals";
import { consoleViews } from "@/data/console";
import { fetchNetwork } from "@/lib/read-api";

const view = consoleViews.network;

export const metadata = { title: view.title, description: view.description };

export default async function Page() {
  const result = await fetchNetwork();
  const rows =
    result.status === "ok"
      ? [
          { label: "Indexed requests", value: String(result.data.requests.total) },
          { label: "Indexed nodes", value: String(result.data.nodes.total) },
          {
            label: "Registry min stake",
            value: result.data.registry?.minStake ?? "not indexed",
          },
          {
            label: "Heartbeat window",
            value: result.data.registry?.heartbeatTimeoutSlots ?? "not indexed",
          },
          {
            label: "Protocol paused",
            value:
              result.data.protocol === null
                ? "not indexed"
                : result.data.protocol.paused
                  ? "yes"
                  : "no",
          },
          {
            label: "Last processed slot",
            value: result.data.checkpoint.lastProcessedSlot ?? "none",
          },
        ]
      : [];

  return (
    <ConsoleView view={view}>
      <ReadModelStatus result={result} empty={false}>
        <dl className="flex flex-col divide-y divide-line">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
              <dt className="text-sm text-muted sm:w-[160px] sm:shrink-0">{row.label}</dt>
              <dd className="font-mono text-sm text-fg-soft">{row.value}</dd>
            </div>
          ))}
        </dl>
      </ReadModelStatus>
      <HeartbeatChart />
    </ConsoleView>
  );
}

import { ReadModelStatus } from "@/components/console/ReadModelPanel";
import { ConsoleView } from "@/components/layout/ConsoleShell";
import { ProgramsPanel } from "@/components/protocol/visuals";
import { WalletPanel } from "@/components/WalletPanel";
import { consoleViews } from "@/data/console";
import { fetchNetwork, fetchNodes, fetchRequests } from "@/lib/read-api";

const view = consoleViews.dashboard;

export const metadata = { title: view.title, description: view.description };

export default async function Page() {
  const [network, requests, nodes] = await Promise.all([
    fetchNetwork(),
    fetchRequests(),
    fetchNodes(),
  ]);
  const counts =
    network.status === "ok"
      ? [
          { label: "Indexed requests", value: String(network.data.requests.total) },
          { label: "Indexed nodes", value: String(network.data.nodes.total) },
          {
            label: "Last slot",
            value: network.data.checkpoint.lastProcessedSlot ?? "none",
          },
        ]
      : [];

  return (
    <ConsoleView view={view}>
      <ReadModelStatus result={network} empty={network.status === "ok" && counts.length === 0}>
        <dl className="flex flex-col divide-y divide-line">
          {counts.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
              <dt className="text-sm text-muted sm:w-[130px] sm:shrink-0">{row.label}</dt>
              <dd className="font-mono text-sm text-fg-soft">{row.value}</dd>
            </div>
          ))}
        </dl>
      </ReadModelStatus>
      {requests.status === "ok" ? (
        <p className="text-sm text-muted">
          Request rows observed: {requests.data.items.length}. Node rows observed:{" "}
          {nodes.status === "ok" ? nodes.data.items.length : "unavailable"}.
        </p>
      ) : null}
      <ProgramsPanel />
      <WalletPanel />
    </ConsoleView>
  );
}

import { ReadModelStatus, ReadTable } from "@/components/console/ReadModelPanel";
import { ConsoleView } from "@/components/layout/ConsoleShell";
import { NodesPanel } from "@/components/protocol/visuals";
import { WalletPanel } from "@/components/WalletPanel";
import { consoleViews } from "@/data/console";
import { fetchNodes } from "@/lib/read-api";

const view = consoleViews.nodes;

export const metadata = { title: view.title, description: view.description };

export default async function Page() {
  const result = await fetchNodes();
  const items = result.status === "ok" ? result.data.items : [];

  return (
    <ConsoleView view={view}>
      <ReadModelStatus result={result} empty={result.status === "ok" && items.length === 0}>
        <ReadTable
          columns={[
            { key: "id", label: "Account" },
            { key: "status", label: "Status" },
            { key: "stakeLamports", label: "Stake" },
            { key: "lastHeartbeat", label: "Heartbeat" },
            { key: "vrfPubkey", label: "VRF key" },
          ]}
          rows={items.map((item) => ({
            id: item.id,
            status: item.status,
            stakeLamports: item.stakeLamports,
            lastHeartbeat: item.lastHeartbeat,
            vrfPubkey: item.vrfPubkey,
          }))}
        />
      </ReadModelStatus>
      <NodesPanel />
      <WalletPanel />
    </ConsoleView>
  );
}

import { ReadModelStatus, ReadTable } from "@/components/console/ReadModelPanel";
import { ConsoleView } from "@/components/layout/ConsoleShell";
import { RequestPanel } from "@/components/protocol/visuals";
import { consoleViews } from "@/data/console";
import { fetchRequests } from "@/lib/read-api";

const view = consoleViews.requests;

export const metadata = { title: view.title, description: view.description };

export default async function Page() {
  const result = await fetchRequests();
  const items = result.status === "ok" ? result.data.items : [];

  return (
    <ConsoleView view={view}>
      <ReadModelStatus result={result} empty={result.status === "ok" && items.length === 0}>
        <ReadTable
          columns={[
            { key: "id", label: "Account" },
            { key: "jobType", label: "Job" },
            { key: "status", label: "Status" },
            { key: "assignedNode", label: "Assigned" },
            { key: "createdSlot", label: "Created" },
          ]}
          rows={items.map((item) => ({
            id: item.id,
            jobType: item.jobType,
            status: item.status,
            assignedNode: item.assignedNode,
            createdSlot: item.createdSlot,
          }))}
        />
      </ReadModelStatus>
      <RequestPanel />
    </ConsoleView>
  );
}

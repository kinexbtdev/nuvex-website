export type RequestRow = {
  id: string;
  jobType: string;
  status: string;
  requester: string;
  callback: string | null;
  maxFee: string;
  createdSlot: string;
  expiresSlot: string;
  assignedNode: string | null;
  assignedStake: string | null;
  assignedHeartbeat: string | null;
  result: { node: string; outputHex: string } | null;
};

export type NodeRow = {
  id: string;
  authority: string;
  operator: string;
  vrfPubkey: string | null;
  stakeLamports: string;
  status: string;
  lastHeartbeat: string | null;
};

export type NetworkRow = {
  authority: "none";
  source: "read-model";
  requests: { total: number; byStatus: Record<string, number> };
  nodes: { total: number; byStatus: Record<string, number> };
  registry: {
    nodeCount: string;
    minStake: string;
    heartbeatTimeoutSlots: string;
  } | null;
  protocol: { paused: boolean } | null;
  checkpoint: { lastProcessedSlot: string | null; updatedAt: string | null };
  note: string;
};

export type ReadResult<T> =
  | { status: "unconfigured" }
  | { status: "unavailable"; message: string }
  | { status: "error"; message: string }
  | { status: "ok"; data: T };

export function readApiBase(): string | undefined {
  const value = process.env.NEXT_PUBLIC_API_URL ?? process.env.NUVEX_API_URL;
  const trimmed = value?.trim();
  return trimmed ? trimmed.replace(/\/$/, "") : undefined;
}

export async function fetchReadModel<T>(path: string): Promise<ReadResult<T>> {
  const base = readApiBase();
  if (!base) {
    return { status: "unconfigured" };
  }
  try {
    const response = await fetch(`${base}${path}`, { cache: "no-store" });
    if (response.status === 503) {
      return {
        status: "unavailable",
        message: "The read API has no store configured. It did not invent rows.",
      };
    }
    if (!response.ok) {
      return { status: "error", message: `The read API returned HTTP ${response.status}.` };
    }
    return { status: "ok", data: (await response.json()) as T };
  } catch {
    return { status: "error", message: "The read API did not respond." };
  }
}

export function fetchRequests() {
  return fetchReadModel<{ items: RequestRow[] }>("/v1/requests");
}

export function fetchNodes() {
  return fetchReadModel<{ items: NodeRow[] }>("/v1/nodes");
}

export function fetchNetwork() {
  return fetchReadModel<NetworkRow>("/v1/network");
}

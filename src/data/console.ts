import { DOCS_URL, GITHUB_PROTOCOL_URL } from "@/lib/constants";

import type { CapabilityStatus } from "./protocol";

export type ConsoleView = {
  title: string;
  status: CapabilityStatus;
  description: string;
  source?: { label: string; href: string };
  /** Rows of the honest empty state: what would appear here, and what blocks it. */
  notes: { label: string; value: string }[];
};

export const consoleViews = {
  dashboard: {
    title: "Overview",
    status: "in-development",
    description:
      "When NEXT_PUBLIC_API_URL is set, this page reads the off-chain API. An empty list is a real read. The API is not chain authority, and the illustration panels below stay labelled.",
    source: { label: "Protocol source", href: GITHUB_PROTOCOL_URL },
    notes: [
      {
        label: "Reads",
        value: "GET /v1/network, /v1/requests and /v1/nodes when the API URL is set.",
      },
      { label: "Does not read", value: "A cluster. Rows come from the indexer store only." },
      { label: "Authority", value: "None. Solana accounts remain the source of truth." },
    ],
  },
  requests: {
    title: "Requests",
    status: "in-development",
    description:
      "Indexed request accounts from the read API. A row here is a copy of an account the indexer observed, not a finalized result.",
    source: { label: "Request lifecycle", href: "/architecture" },
    notes: [
      {
        label: "Reads",
        value: "Request status, assigned node, and any stored VrfResult output hex.",
      },
      { label: "Finality", value: "Only the account is final. An API answer is not." },
      { label: "Empty list", value: "Valid. The page will not invent a request." },
    ],
  },
  nodes: {
    title: "Nodes",
    status: "in-development",
    description:
      "Indexed registry accounts from the read API. A backend still must never appoint a node in private.",
    source: { label: "Eligibility rules", href: "/network" },
    notes: [
      { label: "Reads", value: "Node identity, stake, heartbeat slot, registered VRF key." },
      {
        label: "Eligibility",
        value: "Active, stake at the minimum, heartbeat in window. Checked on chain.",
      },
      { label: "Empty list", value: "Valid. The page will not invent a node." },
    ],
  },
  network: {
    title: "Network",
    status: "in-development",
    description:
      "Counts from the indexed store. Latency is not measured, and the CLI prints the same /v1/network payload when NUVEX_API_URL is set.",
    notes: [
      {
        label: "Reads",
        value: "Request and node counts, registry min stake, protocol pause flag.",
      },
      { label: "Not measured", value: "Fulfilment latency. No such metric is aggregated." },
      {
        label: "CLI",
        value: "nuvex network reads NUVEX_API_URL and refuses to invent status if it is unset.",
      },
    ],
  },
  rewards: {
    title: "Rewards",
    status: "planned",
    description:
      "Reward accounting is not implemented. max_fee is stored on the request and never charged, and ADR 0005 sets no basis points, so no balance on this page would be a claim.",
    source: { label: "Economics", href: "/economics" },
    notes: [
      { label: "Will read", value: "Operator balance, claimable amount, payout history." },
      { label: "Charged today", value: "No fee. max_fee is a stored ceiling." },
      { label: "Blocked on", value: "ADR 0005 naming fee shares and basis points." },
    ],
  },
  analytics: {
    title: "Analytics",
    status: "planned",
    description:
      "Latency and throughput charts are omitted until there is a measurement to chart. The site collects no analytics of its own either.",
    notes: [
      { label: "Will read", value: "Fulfilment latency, proof verification cost, node uptime." },
      { label: "Measured today", value: "The node exposes health and metrics endpoints only." },
      { label: "Blocked on", value: "A measurement that is not a count of indexed accounts." },
    ],
  },
  "api-keys": {
    title: "Keys",
    status: "planned",
    description:
      "Nuvex issues no centralised API credentials. On-chain identity is a keypair, and the four operator roles stay on separate keys.",
    source: { label: "Key management", href: "/security" },
    notes: [
      { label: "Roles", value: "Node identity, operator authority, treasury, security fund." },
      { label: "Issued here", value: "Nothing. There is no account system on this site." },
      {
        label: "Read API",
        value: "The public read API does not issue keys. Point NEXT_PUBLIC_API_URL at it.",
      },
    ],
  },
  models: {
    title: "Models",
    status: "research",
    description:
      "Verifiable inference has no runtime in this tree. There is no model registry, no published model, and no verifier for an inference result.",
    source: { label: "Documentation", href: DOCS_URL },
    notes: [
      { label: "Exists", value: "A decision record sketch of what a verifier would need." },
      { label: "Does not exist", value: "Registry, runtime, proof format, verifier." },
      { label: "Blocked on", value: "A verification model for inference." },
    ],
  },
} satisfies Record<string, ConsoleView>;

export type ConsoleViewKey = keyof typeof consoleViews;

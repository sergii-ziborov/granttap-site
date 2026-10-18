/** Public wire contracts only. No CLI, filesystem, provider or machine runtime code. */
export { Payload, SessionsStatus, SessionInfo, SessionActivity, ApprovalRequest, ApprovalResolved,
  ApprovalsStatus, MeshSnapshot, UserMessage, TaskCreate, Hello, MachineHeartbeat, SessionKeyGrant,
  TaskDispatch, MeshHandoffPrepare, SessionWorkspaceQuery, SessionWorkspaceResult,
  SessionControl, ProjectTransportSet } from "granttap-mcp/packages/protocol/schema";
export type { ActivityEntry, CodingAgent } from "granttap-mcp/packages/protocol/schema";

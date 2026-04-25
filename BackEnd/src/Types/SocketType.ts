import { WebSocket } from "ws";

export type socketType = WebSocket & {
  roomId?: string | null;
};
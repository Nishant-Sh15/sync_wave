import type { HydratedDocument } from "mongoose";
import type { IRoom } from "../../schemas/Room.js";
type RoomDocument = HydratedDocument<IRoom>;
export declare function createRoom(roomId: string): Promise<RoomDocument>;
export {};
//# sourceMappingURL=Room.d.ts.map
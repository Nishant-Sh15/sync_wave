import mongoose from "mongoose";
import type {HydratedDocument} from "mongoose";
import RoomModel from "../../schemas/Room.js";
import type { IRoom } from "../../schemas/Room.js";
type RoomDocument = HydratedDocument<IRoom>;
export async function createRoom(roomId: string): Promise<RoomDocument> {
  const room = new RoomModel({
    roomId,
    members: [],
    currentTrack: "",
    owner: new mongoose.Types.ObjectId(), // Placeholder, should be set to the actual owner's ID when creating a room
  });

  return room.save();
}

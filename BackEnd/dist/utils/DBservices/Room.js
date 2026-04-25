import mongoose from "mongoose";
import RoomModel from "../../schemas/Room.js";
export async function createRoom(roomId) {
    const room = new RoomModel({
        roomId,
        members: [],
        currentTrack: "",
        owner: new mongoose.Types.ObjectId(), // Placeholder, should be set to the actual owner's ID when creating a room
    });
    return room.save();
}
//# sourceMappingURL=Room.js.map
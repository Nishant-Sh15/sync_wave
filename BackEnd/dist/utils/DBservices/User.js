import mongoose from "mongoose";
import UserModel from "../../schemas/User.js";
export async function createUser(name, room) {
    const roomId = typeof room === "string" ? new mongoose.Types.ObjectId(room) : room;
    const user = new UserModel({
        name,
        room: roomId,
    });
    return user.save();
}
//# sourceMappingURL=User.js.map
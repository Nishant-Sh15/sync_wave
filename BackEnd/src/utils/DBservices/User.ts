import mongoose from "mongoose";
import type { HydratedDocument } from "mongoose";
import UserModel from "../../schemas/User.js";
import type { IUser } from "../../schemas/User.js";

type UserDocument = HydratedDocument<IUser>;

export async function createUser(name: string, room: string | mongoose.Types.ObjectId): Promise<UserDocument> {
  const roomId = typeof room === "string" ? new mongoose.Types.ObjectId(room) : room;

  const user = new UserModel({
    name,
    room: roomId,
  });

  return user.save();
}

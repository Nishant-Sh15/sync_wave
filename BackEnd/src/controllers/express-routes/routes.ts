import type { Request, Response } from "express";
import { createUser } from "../../utils/DBservices/User.js";
import { createRoom as createRoomService } from "../../utils/DBservices/Room.js";
import RoomModel from "../../schemas/Room.js";

export function CheckRoute(rooms: Map<string, Set<unknown>>) {
  return async (req: Request, res: Response) => {
    console.log("-------------checking ok-----------");
    const roomId = req.headers["room-id"];
    const userName = req.headers["user-name"];

    if (!roomId || Array.isArray(roomId)) {
      res.status(400).send({ error: "Invalid room ID" });
      return;
    }

    if (!userName || Array.isArray(userName)) {
      res.status(400).send({ error: "User name is required" });
      return;
    }

    const exists = rooms.has(roomId as string);
    if (!exists) {
      res.send({ exists: false });
      return;
    }

    const currentRoom = await RoomModel.findOne({ roomId });
    if (!currentRoom) {
      res.send({ exists: false });
      return;
    }

    const user = await createUser(userName as string, currentRoom._id);
    if (!user) {
      res.status(500).send({ error: "Failed to create user" });
      return;
    }

    currentRoom.members.push(user._id);
    await currentRoom.save();

    req.session.userId = user._id;
    res.send({ exists: true, userId: user._id });
  };
}

export function CreateRoomRoute(
  rooms: Map<string, Set<unknown>>,
  getNextRoomId: () => number
) {
  return async (req: Request, res: Response) => {
    const roomId = getNextRoomId();
    const userName = req.headers["user-name"];

    if (!userName || Array.isArray(userName)) {
      res.status(400).send({ error: "User name is required" });
      return;
    }

    try {
      const room = await createRoomService(roomId.toString());
      const user = await createUser(userName as string, room._id);

      room.members.push(user._id);
      await room.save();

      req.session.userId = user._id;
      rooms.set(`${roomId}`, new Set());

      res.send({ userId: user._id, roomId: room.roomId });
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).send({ error: "Failed to create room" });
    }
  };
}

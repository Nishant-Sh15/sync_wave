import { createUser } from "../../utils/DBservices/User.js";
import { createRoom as createRoomService } from "../../utils/DBservices/Room.js";
import RoomModel from "../../schemas/Room.js";
import UserModel from "../../schemas/User.js";
export function CheckRoute(rooms) {
    return async (req, res) => {
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
        console.log("-------------checking ok-----------", roomId, userName);
        const exists = rooms.has(roomId);
        if (!exists) {
            res.send({ exists: false });
            return;
        }
        const currentRoom = await RoomModel.findOne({ roomId });
        if (!currentRoom) {
            res.send({ exists: false });
            return;
        }
        const user = await createUser(userName, currentRoom._id);
        if (!user) {
            res.status(500).send({ error: "Failed to create user" });
            return;
        }
        currentRoom.members.push(user._id);
        await currentRoom.save();
        req.session.userId = user._id;
        console.log(req.session.userId);
        res.send({ exists: true, userId: user._id.toString() });
    };
}
export function CreateRoomRoute(rooms, getNextRoomId) {
    return async (req, res) => {
        const roomId = getNextRoomId();
        const userName = req.headers["user-name"];
        if (!userName || Array.isArray(userName)) {
            res.status(400).send({ error: "User name is required" });
            return;
        }
        try {
            const room = await createRoomService(roomId.toString());
            const user = await createUser(userName, room._id);
            room.members.push(user._id);
            await room.save();
            req.session.userId = user._id;
            rooms.set(`${roomId}`, new Set());
            res.send({ userId: user._id, roomId: room.roomId });
        }
        catch (error) {
            console.error("Error creating room:", error);
            res.status(500).send({ error: "Failed to create room" });
        }
    };
}
export function InfoRoute() {
    return async (req, res) => {
        try {
            console.log("-------------fetching user info-----------");
            const userIdFromHeader = req.headers["user-id"];
            const userIdFromSession = req.session.userId;
            console.log(req.headers);
            console.log(req.session.cookie);
            console.log(userIdFromSession);
            // Check if userid in header matches session
            if (!userIdFromHeader || Array.isArray(userIdFromHeader)) {
                res.status(400).send({ error: "User ID is required in headers" });
                return;
            }
            if (!userIdFromSession) {
                res.status(401).send({ error: "No active session found" });
                return;
            }
            if (userIdFromHeader !== userIdFromSession.toString()) {
                res.status(403).send({ error: "User ID mismatch with session" });
                return;
            }
            // Fetch user and populate room
            const user = await UserModel.findById(userIdFromHeader).populate('room');
            if (!user) {
                res.status(404).send({ error: "User not found" });
                return;
            }
            // Extract room ID - after populate, user.room is an IRoom object
            const roomData = user.room;
            const roomId = typeof roomData === 'object' ? roomData._id : roomData;
            // Populate room members
            const populatedRoom = await RoomModel.findById(roomId).populate('members');
            if (!populatedRoom) {
                res.status(404).send({ error: "Room not found" });
                return;
            }
            res.send({
                user: {
                    ...user.toObject(),
                    room: populatedRoom
                }
            });
        }
        catch (error) {
            console.error("Error fetching user info:", error);
            res.status(500).send({ error: "Failed to fetch user information" });
        }
    };
}
//# sourceMappingURL=routes.js.map
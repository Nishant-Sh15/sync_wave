import type { Request, Response } from "express";
import type { Multer } from "multer";
import { createUser } from "../../utils/DBservices/User.js";
import { createRoom as createRoomService } from "../../utils/DBservices/Room.js";
import RoomModel from "../../schemas/Room.js";
import UserModel from "../../schemas/User.js";
import multer from "multer";
import path from "path";
import fs from "fs";

export function CheckRoute(rooms: Map<string, Set<unknown>>) {
    return async (req: Request, res: Response) => {
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
        console.log(req.session.userId);
        res.send({ exists: true, userId: user._id.toString() });
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

export function InfoRoute() {
    return async (req: Request, res: Response) => {
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
            const roomData = user.room as any;
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

        } catch (error) {
            console.error("Error fetching user info:", error);
            res.status(500).send({ error: "Failed to fetch user information" });
        }
    };
}
export function UploadRoute() {
  // Configure multer for file uploads
  const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({
    storage,
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile?: boolean) => void) => {
      if (file.mimetype.startsWith('audio/')) {
        cb(null, true);
      } else {
        cb(new Error('Only audio files are allowed'));
      }
    }
  });

  const uploadHandler = async (req: Request, res: Response) => {
    try {
      const multerReq = req as Request & { file?: Express.Multer.File };
      if (!multerReq.file) {
        res.status(400).send({ error: "No file uploaded" });
        return;
      }

      const fileUrl = `/uploads/${multerReq.file.filename}`;
      const trackId = multerReq.file.filename.split('.')[0]; // Use filename without extension as ID

      // For now, we'll use a default duration. In a real app, you'd extract this from the audio file
      const duration = 180; // 3 minutes default

      res.send({
        trackId,
        fileUrl,
        duration,
        fileName: multerReq.file.originalname,
        message: "File uploaded successfully"
      });

    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).send({ error: "Failed to upload file" });
    }
  };

  return [upload.single('audioFile'), uploadHandler];
}
import "dotenv/config";


import express from "express";
import http from "http";
import  {WebSocket, WebSocketServer } from "ws";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import { CheckRoute, CreateRoomRoute, InfoRoute } from "./controllers/express-routes/routes.js";
import connectDB from "./connectDB.js";





// ----------types import----------------
import type { socketType } from "./Types/SocketType.js";
// -------------------------------------------

const app=express();



// ------connecting to database------
connectDB()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((error) => {
        console.error("Failed to connect to database:", error);
    });
// ----------------------------------------


// Configure express-session
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "user-name", "room-id", "Authorization","user-id"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);

// Prepare MongoDB URL with password for MongoStore
const mongoUrl = process.env.ATLAS_URL?.replace("<db_password>", process.env.ATLAS_PASSWORD || "") || "";

app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoUrl
  }),
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax", // IMPORTANT
    maxAge: 1000 * 60 * 60 * 24
  }
}));
// ----------------new room id-----------------
let roomIdCounter :number = 1;
// ----------------------------------------------

// Store rooms: roomId -> Set of sockets
const rooms = new Map<string, Set<socketType>>();
// ------------------------------------------------

const server=http.createServer(app);

const getNextRoomId = () => roomIdCounter++;
app.get("/checks", CheckRoute(rooms));
app.get("/create-room", CreateRoomRoute(rooms, getNextRoomId));
app.get("/info", InfoRoute());




































































































































// Create WebSocket server on port 8080
const wss: WebSocketServer = new WebSocketServer({ server });


wss.on("connection", (socket) => {
    console.log("New client connected");

    const currentSocket : socketType = socket as socketType;
    // Store which room this socket belongs to
    currentSocket.roomId = null;

    // Listen for messages from this client
    socket.on("message", (message) => {
        const data = JSON.parse(message.toString());

        // Handle different message types
        switch (data.type) {


            case "SEND_MESSAGE": {
                const roomId = currentSocket.roomId;

                if (!roomId) return;

                const currentRoom = rooms.get(roomId);
                if(!currentRoom){
                    currentSocket.send(JSON.stringify({
                        type: "ERROR",
                        message: "Room does not exist"
                    }));
                    return;
                }

                // Broadcast message to everyone in room
                currentRoom.forEach((client : socketType) => {
                    if (client.readyState === 1) { // 1 = OPEN
                        client.send(JSON.stringify({
                            type: "MESSAGE",
                            message: data.message
                        }));
                    }
                });

                break;
            }
        }
    });

    socket.on("close", () => {
        console.log("Client disconnected");

        const roomId = currentSocket.roomId;
        if(!roomId){
            currentSocket.send(JSON.stringify({
                type: "ERROR",
                message: "Room does not exist"
            }));
            return;
        }
        const currentRoom = rooms.get(roomId);
        if(!currentRoom){
            currentSocket.send(JSON.stringify({
                type: "ERROR",
                message: "Room does not exist"
            }));
            return;
        }
        currentRoom.delete(currentSocket);

        // If room becomes empty, delete it
        if (currentRoom.size === 0) {
            rooms.delete(roomId);
        }
    });
});




server.listen(8080,()=>{
    console.log("Server is listening on port 8080");
});
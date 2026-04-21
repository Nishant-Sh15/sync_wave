
import  {WebSocket, WebSocketServer } from "ws";
import connectDB from "./connectDB.js";


// ------connecting to database------
// connectDB()
//     .then(() => {
//         console.log("Database connected, starting WebSocket server...");
//     })
//     .catch((error) => {
//         console.error("Failed to connect to database:", error);
//     });
// ----------------------------------------


// ----------------new room id-----------------
let roomIdCounter :number = 1;
// ----------------------------------------------


type socketType = WebSocket & { roomId?: number | null  };

// Create WebSocket server on port 8080
const wss: WebSocketServer = new WebSocketServer({ port: 8080 });

// Store rooms: roomId -> Set of sockets
const rooms = new Map<number, Set<socketType>>();

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

            case "CREATE_ROOM": {
                const roomId = roomIdCounter++;
                currentSocket.roomId = roomId;

                // Create new room if it doesn't exist
                var currentRoom= rooms.get(roomId);
                if (!currentRoom) {
                    currentRoom = new Set();
                    rooms.set(roomId, currentRoom);
                }

                // Add this socket to the room
                currentRoom.add(currentSocket);

                currentSocket.send(JSON.stringify({
                    type: "ROOM_CREATED",
                    roomId
                }));

                break;
            }

            case "JOIN_ROOM": {
                const roomId = data.roomId;
                const currentRoom = rooms.get(roomId);
                if (!currentRoom) {
                    socket.send(JSON.stringify({
                        type: "ERROR",
                        message: "Room does not exist"
                    }));
                    return;
                }

                currentRoom.add(currentSocket);
                currentSocket.roomId = roomId;

                currentSocket.send(JSON.stringify({
                    type: "JOINED_ROOM",
                    roomId
                }));

                break;
            }

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
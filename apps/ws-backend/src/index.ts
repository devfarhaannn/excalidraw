import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prisma } from "@repo/db/client";

const wss = new WebSocketServer({
    port: 8080,
});

interface User {
    ws: WebSocket;
    rooms: number[];
    userId: string;
}

const users: User[] = [];


// CHECK JWT TOKEN


function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded === "string") {
            return null;
        }

        if (!decoded || !decoded.userId) {
            return null;
        }

        return decoded.userId;
    } catch {
        return null;
    }
}


// SEND ERROR HELPER


function sendError(
    ws: WebSocket,
    message: string
) {
    ws.send(
        JSON.stringify({
            type: "error",
            message,
        })
    );
}


// WEBSOCKET CONNECTION


wss.on("connection", (ws, request) => {

    const url = request.url;

    if (!url) {
        ws.close();
        return;
    }

    // GET TOKEN FROM URL
  

    const queryParams = new URLSearchParams(
        url.split("?")[1]
    );

    const token = queryParams.get("token") || "";

   
   
    // VERIFY USER
   

    const userId = checkUser(token);

    if (!userId) {

        sendError(
            ws,
            "Unauthorized"
        );

        ws.close();

        return;
    }

  
    // CREATE CONNECTED USER
 

    const user: User = {
        ws,
        userId,
        rooms: [],
    };

    users.push(user);

    console.log(
        "WebSocket connected:",
        userId
    );

  
    // CONNECTION SUCCESS
 

    ws.send(
        JSON.stringify({
            type: "connected",
            message: "WebSocket connected successfully",
        })
    );


    // HANDLE MESSAGE
    

    ws.on("message", async (data) => {

        try {

            const parsedData = JSON.parse(
                data.toString()
            );


            // JOIN ROOM


            if (parsedData.type === "join_room") {

                const roomId = Number(
                    parsedData.roomId
                );

                // Validate roomId
                if (
                    !Number.isInteger(roomId) ||
                    roomId <= 0
                ) {

                    sendError(
                        ws,
                        "Invalid roomId"
                    );

                    return;
                }

                // Check room exists
                const room =
                    await prisma.room.findUnique({
                        where: {
                            id: roomId,
                        },
                    });

                if (!room) {

                    sendError(
                        ws,
                        "Room does not exist"
                    );

                    return;
                }

                // Prevent duplicate room join
                if (!user.rooms.includes(roomId)) {
                    user.rooms.push(roomId);
                }

                // Tell client that room was joined
                ws.send(
                    JSON.stringify({
                        type: "joined_room",
                        roomId,
                    })
                );

                console.log(
                    `User ${userId} joined room ${roomId}`
                );

                return;
            }


            // LEAVE ROOM
         

            if (parsedData.type === "leave_room") {

                const roomId = Number(
                    parsedData.roomId
                );

                // Validate roomId
                if (
                    !Number.isInteger(roomId) ||
                    roomId <= 0
                ) {

                    sendError(
                        ws,
                        "Invalid roomId"
                    );

                    return;
                }

                // Remove room from user's rooms
                user.rooms = user.rooms.filter(
                    (id) => id !== roomId
                );

                // Tell client
                ws.send(
                    JSON.stringify({
                        type: "left_room",
                        roomId,
                    })
                );

                console.log(
                    `User ${userId} left room ${roomId}`
                );

                return;
            }


            // CHAT
      

            if (parsedData.type === "chat") {

                const roomId = Number(
                    parsedData.roomId
                );

                const message =
                    typeof parsedData.message === "string"
                        ? parsedData.message.trim()
                        : "";

                
                // Validate roomId
                

                if (
                    !Number.isInteger(roomId) ||
                    roomId <= 0
                ) {

                    sendError(
                        ws,
                        "Invalid roomId"
                    );

                    return;
                }

          
                // Validate message
             
                if (!message) {

                    sendError(
                        ws,
                        "Message cannot be empty"
                    );

                    return;
                }

          
                // Check user joined room
            

                if (!user.rooms.includes(roomId)) {

                    sendError(
                        ws,
                        "You have not joined this room"
                    );

                    return;
                }

              
                // Check room exists
   

                const room =
                    await prisma.room.findUnique({
                        where: {
                            id: roomId,
                        },
                    });

                if (!room) {

                    sendError(
                        ws,
                        "Room does not exist"
                    );

                    return;
                }

           
                // SAVE CHAT TO DATABASE
          

                const chat =
                    await prisma.chat.create({
                        data: {
                            roomId,
                            message,
                            userId,
                        },
                    });

          
                // BROADCAST MESSAG
          

                users.forEach((roomUser) => {

                    if (
                        roomUser.rooms.includes(roomId) &&
                        roomUser.ws.readyState ===
                            WebSocket.OPEN
                    ) {

                        roomUser.ws.send(
                            JSON.stringify({
                                type: "chat",
                                id: chat.id,
                                roomId,
                                message: chat.message,
                                userId: chat.userId,
                            })
                        );
                    }
                });

                return;
            }

            // UNKNOWN MESSAGE TYPE
   

            sendError(
                ws,
                "Unknown message type"
            );

        } catch (error) {

            console.error(
                "WebSocket message error:",
                error
            );

            sendError(
                ws,
                "Invalid WebSocket message"
            );
        }
    });

  
    // DISCONNECT
 

    ws.on("close", () => {

        const index = users.findIndex(
            (x) => x.ws === ws
        );

        if (index !== -1) {
            users.splice(index, 1);
        }

        console.log(
            "WebSocket disconnected:",
            userId
        );
    });

   
    // SOCKET ERROR
   

    ws.on("error", (error) => {

        console.error(
            "WebSocket error:",
            error
        );
    });
});

console.log(
    "WebSocket server running on port 8080"
);

// import { WebSocket, WebSocketServer } from 'ws';
// import jwt, { JwtPayload } from "jsonwebtoken"
// import { JWT_SECRET } from '@repo/backend-common/config';
// import { prisma } from '@repo/db/client'
// const wss = new WebSocketServer({ port: 8080 });

// interface User {
//     ws: WebSocket,
//     rooms: string[],
//     userId: string
// }

// const users: User[] = []

// const checkUser = function (token: string): string | null {
//     try {
//         const decoded = jwt.verify(token, JWT_SECRET)


//         if (typeof decoded == "string") {

//             return null
//         }

//         if (!decoded || !decoded.userId) {

//             return null
//         }
//         return decoded.userId
//     }
//     catch(e){
//         return null
//     }
    
// }

// wss.on('connection',  function connection(ws, request) {
//     const url = request.url
//     if (!url) {
//         return
//     }

//     const queryParams = new URLSearchParams(url.split('?')[1])
//     const token = queryParams.get('token') || ""
//     const userId = checkUser(token)

//     if (!userId) {
//         ws.close()
//         return null
//     }

//     users.push({
//         ws,
//         userId,
//         rooms: []
//     })
//     ws.on('message', async function message(data) {
//         const parsedData = JSON.parse(data as unknown as string)

//         if (parsedData.type === "join_room") {
//             const user = users.find(x => x.ws === ws)
//             user?.rooms.push(parsedData.roomId)
//         }
//         if (parsedData.type === "leave_room") {
//             const user = users.find(x => x.ws === ws)
//             if (!user) {
//                 return
//             }
//             user.rooms = user?.rooms.filter(x => x === parsedData.room)
//         }

//         if (parsedData.type === "chat") {
//             const roomId = parsedData.roomId
//             const message = parsedData.message

//            await prisma.chat.create({
//                 data:{
//                     roomId,
//                     message,
//                     userId
//                 }
//             })
            

//             users.forEach(user => {
//                 if (user.rooms.includes(roomId)) {
//                     user.ws.send(JSON.stringify({
//                         type: "chat",
//                         message: message,
//                         roomId
//                     }))
//                 }
//             })
//         }
//     });
// });
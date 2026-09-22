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
    } catch (error) {
        return null;
    }
}

wss.on("connection", (ws, request) => {

    const url = request.url;

    if (!url) {
        ws.close();
        return;
    }

    const queryParams = new URLSearchParams(
        url.split("?")[1]
    );

    const token = queryParams.get("token") || "";

    const userId = checkUser(token);

    if (!userId) {
        ws.close();
        return;
    }

    const user: User = {
        ws,
        userId,
        rooms: [],
    };

    users.push(user);

    console.log("WebSocket connected:", userId);

    ws.send(
        JSON.stringify({
            type: "connected",
            message: "WebSocket connected successfully",
        })
    );

    ws.on("message", async (data) => {

        try {

            const parsedData = JSON.parse(
                data.toString()
            );



            // JOIN ROOM
         
            if (parsedData.type === "join_room") {

                const roomId = Number(parsedData.roomId);

                if (Number.isNaN(roomId)) {
                    ws.send(
                        JSON.stringify({
                            type: "error",
                            message: "Invalid roomId",
                        })
                    );

                    return;
                }

                if (!user.rooms.includes(roomId)) {
                    user.rooms.push(roomId);
                }

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

                const roomId = Number(parsedData.roomId);

                user.rooms = user.rooms.filter(
                    (id) => id !== roomId
                );

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

                const roomId = Number(parsedData.roomId);
                const message = parsedData.message;

                if (Number.isNaN(roomId)) {
                    ws.send(
                        JSON.stringify({
                            type: "error",
                            message: "Invalid roomId",
                        })
                    );

                    return;
                }

                if (
                    typeof message !== "string" ||
                    message.trim().length === 0
                ) {
                    ws.send(
                        JSON.stringify({
                            type: "error",
                            message: "Message cannot be empty",
                        })
                    );

                    return;
                }

                // Make sure user actually joined this room
                if (!user.rooms.includes(roomId)) {
                    ws.send(
                        JSON.stringify({
                            type: "error",
                            message: "You have not joined this room",
                        })
                    );

                    return;
                }

                // Save message in database
                const chat = await prisma.chat.create({
                    data: {
                        roomId,
                        message: message.trim(),
                        userId,
                    },
                });

                // Send message to everyone in this room
                users.forEach((roomUser) => {

                    if (
                        roomUser.rooms.includes(roomId) &&
                        roomUser.ws.readyState === WebSocket.OPEN
                    ) {

                        roomUser.ws.send(
                            JSON.stringify({
                                type: "chat",
                                id: chat.id,
                                roomId,
                                message: chat.message,
                                userId,
                            })
                        );
                    }
                });

                return;
            }


            // UNKNOWN MESSAGE
         

            ws.send(
                JSON.stringify({
                    type: "error",
                    message: "Unknown message type",
                })
            );

        } catch (error) {

            console.error(
                "WebSocket message error:",
                error
            );

            ws.send(
                JSON.stringify({
                    type: "error",
                    message: "Invalid WebSocket message",
                })
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

    // -------------------------
    // SOCKET ERROR
    // -------------------------

    ws.on("error", (error) => {
        console.error(
            "WebSocket error:",
            error
        );
    });
});

console.log("WebSocket server running on port 8080");




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
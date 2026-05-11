
import express from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config"
import { middleware } from "./middleware"
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types"
import dotenv from "dotenv"
dotenv.config();
import { prisma } from "@repo/db/client"
import cors from "cors"
import bcrypt from "bcrypt"


console.log("DATABASE_URL:", process.env.DATABASE_URL)
const app = express()
const SALT_ROUND = 10
app.use(cors());
app.use(express.json())


app.post("/signup", async (req, res) => {
    const { success, data } = CreateUserSchema.safeParse(req.body)
    if (!success) {
        res.status(400).json({
            success: false,
            error: "Invalid input"
        })
        return;
    }
    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                email: data.username
            }
        })
        if (existingUser) {
            res.status(400).json({
                success: false,
                error: "User already exist"
            })
            return;
        }

        const hashedPssword = await bcrypt.hash(data.password, SALT_ROUND)

        const user = await prisma.user.create({
            data: {
                email: data.username,
                password: hashedPssword,
                name: data.name
            }
        })
        res.status(201).json({
            success: true,
            userId: user.id
        })

    } catch (e) {
        res.status(500).json({
            message: "Server error",
        })
    }
})
app.post("/signin", async (req, res) => {
    const { success, data } = SigninSchema.safeParse(req.body)
    if (!success) {
        res.status(400).json({
            success: false,
            error: "Invalid email and password"
        })
        return;
    }
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: data.username
            }
        })
        if (!user) {
            res.status(400).json({
                success: false,
                error: "User not found"
            })
            return;
        }
        const isValidPassword = await bcrypt.compare(data.password, user.password)
        if (!isValidPassword) {
            res.status(400).json({
                success: false,
                error: "Incorrect Password"
            })
            return;
        }
        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET)
        res.json({
            token
        })
    } catch (e) {
        res.status(500).json({
            message: "Server error",
        })
    }
})
app.post("/room", middleware, async (req, res) => {

    const { success, data } = CreateRoomSchema.safeParse(req.body)
    if (!success) {
        res.status(400).json({
            success: false,
            error: "Incorrects roomName"
        })
        return;
    }
    const userId = req.userId
    if (!userId) {
        res.status(401).json({
            success: false,
            error: "Unauthorized"
        })
        return
    }
    try {
        const room = await prisma.room.create({
            data: {
                slug: data.name,
                adminId: userId
            }
        })
        res.status(201).json({
            success: true,
            roomId: room.id
        })
    }
    catch (e) {
        res.status(411).json({
            success: false,
            error: "Romm is already exist with this room"
        })
    }

})
app.get("/chats/:roomId", async (req, res) => {
    const roomId = Number(req.params.roomId)
    const messages = await prisma.chat.findMany({
        where: {
            roomId: roomId
        }, orderBy: {
            id: "desc"
        }, take: 100
    })

    res.json({
        messages
    })
})
app.get("/room/:slug", async(req,res) => {
    const slug = req.params.slug
    const room = await prisma.room.findFirst({
        where:{
            slug
        }
    })
    res.json({
        room
    })
})

app.listen(3001)
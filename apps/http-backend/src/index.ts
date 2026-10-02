
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
    const { success, data } = CreateRoomSchema.safeParse(req.body);

    if (!success) {
        return res.status(400).json({
            success: false,
            error: "Incorrect room name",
        });
    }

    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized",
        });
    }

    try {
        const room = await prisma.room.create({
            data: {
                slug: data.name,
                adminId: userId,
            },
        });

        return res.status(201).json({
            success: true,
            room: {
                id: room.id,
                slug: room.slug,
                createdAt: room.createdAt,
            },
        });
    } catch (e) {
        console.error("Create room error:", e);

        if (
            e &&
            typeof e === "object" &&
            "code" in e &&
            e.code === "P2002"
        ) {
            return res.status(409).json({
                success: false,
                message: "A board with this name already exists.",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create board.",
        });
    }
});
app.get("/rooms", middleware, async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const rooms = await prisma.room.findMany({
            where: {
                adminId: userId,
            },
            select: {
                id: true,
                slug: true,
                adminId: true,
                createdAt: true,
            },
            orderBy: {
                id: "desc",
            },
        });

        return res.status(200).json({
            success: true,
            rooms,
        });
    } catch (error) {
        console.error("Failed to fetch rooms:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch rooms",
        });
    }
});

app.get("/me", middleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            user,
        });
    } catch (error) {
        console.error("Failed to fetch current user:", error);

        return res.status(500).json({
            message: "Failed to fetch current user",
        });
    }
});
app.patch("/me", middleware, async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || typeof name !== "string") {
            return res.status(400).json({
                message: "Name is required",
            });
        }

        const trimmedName = name.trim();

        if (trimmedName.length < 2) {
            return res.status(400).json({
                message: "Name must be at least 2 characters long",
            });
        }

        if (trimmedName.length > 50) {
            return res.status(400).json({
                message: "Name must be less than 50 characters",
            });
        }

        const user = await prisma.user.update({
            where: {
                id: req.userId,
            },
            data: {
                name: trimmedName,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        return res.status(200).json({
            message: "Profile updated successfully",
            user,
        });
    } catch (error) {
        console.error("Update profile error:", error);

        return res.status(500).json({
            message: "Failed to update profile",
        });
    }
});
app.patch("/password", middleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required",
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                message: "New password must be at least 8 characters long",
            });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({
                message: "New password must be different from current password",
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const passwordMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Current password is incorrect",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: {
                id: req.userId,
            },
            data: {
                password: hashedPassword,
            },
        });

        return res.status(200).json({
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Change password error:", error);

        return res.status(500).json({
            message: "Failed to change password",
        });
    }
});
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
app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug
    const room = await prisma.room.findFirst({
        where: {
            slug
        }
    })
    res.json({
        room
    })
})

app.listen(3001)
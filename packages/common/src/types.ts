
import { z } from "zod";

export const CreateUserSchema = z.object({
  username: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(254, "Email is too long"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(
      /[A-Z]/,
      "Password must contain at least one uppercase letter"
    )
    .regex(
      /[a-z]/,
      "Password must contain at least one lowercase letter"
    )
    .regex(
      /[0-9]/,
      "Password must contain at least one number"
    )
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    )
    .regex(
      /^\S+$/,
      "Password must not contain spaces"
    ),

  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
});

export const SigninSchema = z.object({
  username: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export const CreateRoomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Room name must be at least 3 characters")
    .max(20, "Room name must be less than 20 characters"),
});






// import { z } from "zod"

// export const CreateUserSchema = z.object({
//     username : z.string().min(3).max(20),
//     password : z.string(),
//     name : z.string()
// })
// export const SigninSchema = z.object({
//     username : z.string().min(3).max(20),
//     password : z.string()
// })
// export const CreateRoomSchema = z.object({
//     name : z.string().min(3).max(20)
// })
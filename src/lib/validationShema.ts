import { z } from "zod";

// Register Schema
export const registerSchema = z.object({
  username: z
    .string()
    .min(4, { message: "username must be more than 4 characters" })
    .max(20, { message: "username should be less than 20 characters" })
    .optional(),
  email: z
    .string()
    .email({ message: "Invalid email format" }) // ✅ Fixed
    .min(5, { message: "email must be more than 5 characters" })
    .max(30, { message: "email should be less than 20 characters" }),
  password: z
    .string()
    .min(9, { message: "password must be more than 8 characters" })
    .max(30, { message: "password should be less than 30 characters" }),
});

// Login Schema
export const loginSchema = z.object({
  email: z.string().min(5).max(30).email(),
  password: z.string().min(9),
});

export const updateUserSchema = z.object({
  username: z.string().min(2).max(20).optional(), //.optional(),
  email: z.string().min(3).max(30).email().optional(),
  password: z.string().min(6).optional(),
});

// create User Profile Schema
export const createProfileSchema = z.object({
  username: z
    .string()
    .min(4, { message: "Username must be more than 4 characters" })
    .max(20, { message: "Username must be less than 20 characters maximum" })
    .optional(), //.optional(),
  phoneNumber: z
    .string()
    .min(4, { message: "PhoneNumber must be more than 4 characters" })
    .optional(),
  streetAddress: z
    .string()
    .min(4, { message: "StreetAddress should be more than 4 characters" })
    .optional(),
  city: z
    .string()
    .min(4, { message: "City should be more than 4 characters" })
    .optional(),
  postalCode: z.string().min(4).optional(),
  rols: z.string().optional(),
  status: z.string().optional(),
  country: z.string().optional(),
  imageUrl: z.string().optional(),
});

// CREATE PRODUCTION SCHEMA
export const createProductsShema = z.object({
  title: z
    .string()
    .min(4, { message: "Name Production must be more than 4 characters" })
    .max(200, {
      message: "Name Production should be less than 200 characters",
    }),
  price: z.number(),
  discount: z.number().optional().default(0),
  status: z.enum(["Pending", "In Progress", "Completed"]), // ✅ restrict to valid statuses
  quantity: z.number().nonnegative({ message: "Quantity cannot be negative" }),
  description: z.string(),
  image: z
    .array(z.object({ imageUrl: z.string().url("Invalid image URL") }))
    .min(1, "At least one image is required"),
});

// validators/userValidator.js
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  fullname: z.string().min(2),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

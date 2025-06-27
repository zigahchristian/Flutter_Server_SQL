// controller/user.controller.js (Prisma version with Zod)

import { PrismaClient } from "@prisma/client";
import { generateId, authentication, random } from "../../helpers/helpers.js";
import { registerSchema, loginSchema } from "./user.schema.js";

const prisma = new PrismaClient();

export const registerUser = async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() });
    }

    const { email, password, fullname } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const id = generateId(12, "user-");
    const salt = random();
    const hashpwd = authentication(salt, password);

    await prisma.user.create({
      data: {
        id,
        email,
        salt,
        hashpwd,
        fullname,
        profile: {
          create: {
            firstname: fullname.firstname,
            lastname: fullname.lastname,
          },
        },
      },
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export const loginUser = async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    const expectedHash = authentication(user.salt, password);
    if (user.hashpwd !== expectedHash) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    req.session.authUserId = user.id;
    return res.status(200).json({ message: "Login successful" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getSession = async (req, res) => {
  try {
    const { authUserId } = req.session;
    const user = await prisma.user.findUnique({ where: { id: authUserId } });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
};

export const logoutUser = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) return res.sendStatus(500);
      res.clearCookie(process.env.COOKIE_SESSION_NAME);
      return res.status(200).json({ message: "Logout successful" });
    });
  } catch (err) {
    return res.sendStatus(500);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (e) {
    console.error(e);
    return res.sendStatus(400);
  }
};

export const getAUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.profile.deleteMany({ where: { userid: id } });
    const deleted = await prisma.user.delete({ where: { id } });
    return res.status(200).json({ message: "User deleted", deleted });
  } catch (e) {
    console.error(e);
    return res.sendStatus(400);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { fullname },
    });
    return res.status(200).json(user);
  } catch (e) {
    console.error(e);
    return res.sendStatus(400);
  }
};

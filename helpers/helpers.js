import crypto from "crypto";
import dotenv from "dotenv";

const { unlink } = "node:fs/promises";

import { v2 as cloudinary } from "cloudinary";

export const cloudinaryconfig = cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const random = () => crypto.randomBytes(128).toString("base64");

export const authentication = (salt, password) => {
  const SECRET_KEY = process.env.SECRET_KEY;
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET_KEY)
    .digest("hex");
};

export const getenv = () => {
  return process.env.NODE_ENV === undefined || "test"
    ? dotenv.config({ path: "./.env" })
    : dotenv.config();
};

export const generateId = (length) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const randInt = Math.floor(min + Math.random() * (max - min));

  const millis = Date.now().toString().slice(-4); // last 4 digits only

  return `${randInt}${millis}`; // returns a string like '382471234'
};

export const deleteUploadedAvatar = (filePath) => {
  return unlink(filePath);
};

export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const sendResetEmail = async (email, token) => {
  const resetUrl = `https://yourdomain.com/reset-password?token=${token}`;
  // Use nodemailer or other service to send `resetUrl` to user
};

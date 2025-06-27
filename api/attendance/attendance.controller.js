import prisma from "../../prisma/prisma.js";
import { attendanceSchema } from "./attendance.schema.js";

export const createNewAttendance = async (req, res) => {
  try {
    const data = attendanceSchema.parse(req.body);
    const result = await prisma.attendance.create({ data });
    res.status(201).json(result);
  } catch (err) {
    console.error("Create Error:", err);
    res
      .status(400)
      .json({ message: "Invalid data", errors: err.errors || err });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const result = await prisma.attendance.findMany({
      orderBy: { date: "asc" },
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await prisma.attendance.findUnique({ where: { id } });
    if (!result) return res.status(404).json({ message: "Not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAttendanceByID = async (req, res) => {
  try {
    const { id } = req.params;
    const data = attendanceSchema.partial().parse(req.body);
    const result = await prisma.attendance.update({
      where: { id },
      data,
    });
    res.status(200).json(result);
  } catch (err) {
    console.error("Update Error:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Attendance not found" });
    }
    res
      .status(400)
      .json({ message: "Invalid update data", errors: err.errors || err });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await prisma.attendance.delete({ where: { id } });
    res.status(200).json({ message: "Deleted", deleted: result });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

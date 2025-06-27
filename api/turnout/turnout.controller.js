import { generateId } from "../../helpers/helpers.js";
import prisma from "../../prisma/prisma.js";

// Create a new Turnout
export const createTurnout = async (req, res) => {
  const id = generateId(4); // Custom ID logic
  const {
    name,
    description,
    turnoutdate,
    location,
    organizer,
    status,
    attendance,
  } = req.body;

  try {
    const created = await prisma.turnout.create({
      data: {
        id,
        name,
        description,
        turnoutdate: new Date(turnoutdate),
        location,
        organizer,
        status,
        attendance,
      },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating turnout:", err.message);
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Turnout already exists." });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Read all Turnout
export const getAllTurnouts = async (req, res) => {
  try {
    const allTurnouts = await prisma.turnout.findMany({
      orderBy: { id: "asc" },
    });
    res.status(200).json(allTurnouts);
  } catch (err) {
    console.error("Error fetching turnouts:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Read One Turnout
export const getTurnoutById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = req.params;

  try {
    const turnout = await prisma.turnout.findUnique({
      where: { id: Number(id) },
    });

    if (!turnout) {
      return res.status(404).json({ message: "Turnout not found" });
    }

    res.status(200).json(turnout);
  } catch (err) {
    console.error("Error fetching turnout by ID:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

//
export const updateTurnoutByID = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    turnoutdate,
    location,
    organizer,
    status,
    attendance,
  } = req.body;

  try {
    const updated = await prisma.turnout.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(turnoutdate && { turnoutdate: new Date(turnoutdate) }),
        ...(location && { location }),
        ...(organizer && { organizer }),
        ...(status && { status }),
        ...(attendance && { attendance }),
      },
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating turnout:", err.message);
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Turnout not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Turnout
export const deleteTurnout = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await prisma.turnout.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      message: "Turnout deleted successfully",
      deletedTurnout: deleted,
    });
  } catch (err) {
    console.error("Error deleting turnout:", err.message);
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Turnout not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

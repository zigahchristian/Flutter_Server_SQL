import { prisma } from "../../db/prismaClient.js";

// Helper to generate a random 6-digit integer
async function generateUniqueMemberId() {
  let unique = false;
  let id;
  while (!unique) {
    id = Math.floor(100000 + Math.random() * 900000); // 6 digits, integer
    const exists = await prisma.members.findUnique({ where: { id } });
    if (!exists) unique = true;
  }
  return id; // integer
}

export const testPrimma = prisma;
export const createNewMember = async (req, res) => {
  const {
    membername,
    firstname,
    lastname,
    gender,
    email,
    phone,
    position,
    dateofbirth,
    occupation,
    otherskills,
    profilepicture,
    emergencycontactphone,
    emergencycontactname,
    emergencycontactrelationship,
    joindate,
    membershiptype,
    status,
  } = req.body;

  try {
    const id = await generateUniqueMemberId();
    const member = await prisma.members.create({
      data: {
        id,
        membername,
        firstname,
        lastname,
        gender,
        email,
        phone,
        position,
        dateofbirth: dateofbirth ? new Date(dateofbirth) : undefined,
        occupation,
        otherskills,
        profilepicture,
        emergencycontactphone,
        emergencycontactname,
        emergencycontactrelationship,
        joindate: joindate ? new Date(joindate) : undefined,
        membershiptype,
        status: status || "active",
      },
    });

    res.status(201).json(member);
  } catch (err) {
    console.error("Error creating member:", err.message);
    if (err.code === "P2002") {
      return res
        .status(409)
        .json({ message: "Member with this email already exists." });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllMembers = async (req, res) => {
  try {
    const members = await prisma.members.findMany({
      orderBy: { id: "asc" },
    });

    res.status(200).json(members);
  } catch (err) {
    console.error("Error fetching members:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const addManyMembers = async (req, res) => {
  const members = req.body; // Expecting an array of member objects

  if (!Array.isArray(members) || members.length === 0) {
    return res
      .status(400)
      .json({ message: "Request body must be a non-empty array" });
  }

  // Helper to generate a random 6-digit integer
  async function generateUniqueMemberId() {
    let unique = false;
    let id;
    while (!unique) {
      id = Math.floor(100000 + Math.random() * 900000);
      const exists = await prisma.members.findUnique({ where: { id } });
      if (!exists) unique = true;
    }
    return id;
  }

  try {
    const data = [];
    for (const member of members) {
      const id = await generateUniqueMemberId();
      data.push({
        id,
        membername: member.membername,
        firstname: member.firstname,
        lastname: member.lastname,
        gender: member.gender,
        email: member.email,
        phone: member.phone,
        position: member.position,
        dateofbirth: member.dateofbirth
          ? new Date(member.dateofbirth)
          : undefined,
        occupation: member.occupation,
        otherskills: member.otherskills,
        profilepicture: member.profilepicture,
        emergencycontactphone: member.emergencycontactphone,
        emergencycontactname: member.emergencycontactname,
        emergencycontactrelationship: member.emergencycontactrelationship,
        joindate: member.joindate ? new Date(member.joindate) : undefined,
        membershiptype: member.membershiptype,
        status: member.status || "active",
      });
    }

    const created = await prisma.members.createMany({
      data,
      skipDuplicates: true,
    });
    res.status(201).json({ message: "Members added", count: created.count });
  } catch (err) {
    console.error("Error adding members:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAMemberById = async (req, res) => {
  const { id } = req.params;

  try {
    const member = await prisma.members.findUnique({
      where: { id: Number(id) },
    });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(member);
  } catch (err) {
    console.error("Error fetching member:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateMemberByID = async (req, res) => {
  const { id } = req.params;
  const {
    membername,
    firstname,
    lastname,
    gender,
    email,
    phone,
    position,
    dateofbirth,
    occupation,
    otherskills,
    profilepicture,
    emergencycontactphone,
    emergencycontactname,
    emergencycontactrelationship,
    joindate,
    membershiptype,
    status,
  } = req.body;

  try {
    const updated = await prisma.members.update({
      where: { id: Number(id) },
      data: {
        ...(membername && { membername }),
        ...(firstname && { firstname }),
        ...(lastname && { lastname }),
        ...(email && { email }),
        ...(gender && { gender }),
        ...(phone && { phone }),
        ...(position && { position }),
        ...(dateofbirth && { dateofbirth }),
        ...(occupation && { occupation }),
        ...(otherskills && { otherskills }),
        ...(profilepicture && { profilepicture }),
        ...(emergencycontactphone && { emergencycontactphone }),
        ...(emergencycontactname && { emergencycontactname }),
        ...(emergencycontactrelationship && { emergencycontactrelationship }),
        ...(joindate && { joindate }),
        ...(membershiptype && { membershiptype }),
        ...(status && { status }),
      },
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating member:", err.message);
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteMember = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await prisma.members.delete({
      where: { id: Number(id) },
    });

    res.status(204).json({
      message: "Member deleted successfully",
      deletedMember: deleted,
    });
  } catch (err) {
    console.error("Error deleting member:", err.message);
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

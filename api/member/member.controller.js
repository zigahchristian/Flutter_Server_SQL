import { prisma } from "../../db/prismaClient.js";
import { generateId } from "../../helpers/helpers.js";

export const createNewMember = async (req, res) => {
  const id = +generateId(2);
  console.log(typeof id, id);
  const {
    membername,
    firstname,
    lastname,
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
    const member = await prisma.members.create({
      data: {
        id,
        membername,
        firstname,
        lastname,
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
        joindate: new Date(joindate),
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
    res.status(500).json({ message: "Server error" });
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
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = req.params;
  const {
    membername,
    firstname,
    lastname,
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
    const updated = await prisma.member.update({
      where: { id: Number(id) },
      data: {
        ...(membername && { membername }),
        ...(firstname && { firstname }),
        ...(lastname && { lastname }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(position && { position }),
        ...(dateofbirth && { dateofbirth: new Date(dateofbirth) }),
        ...(occupation && { occupation }),
        ...(otherskills && { otherskills }),
        ...(profilepicture && { profilepicture }),
        ...(emergencycontactphone && { emergencycontactphone }),
        ...(emergencycontactname && { emergencycontactname }),
        ...(emergencycontactrelationship && { emergencycontactrelationship }),
        ...(joindate && { joindate: new Date(joindate) }),
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
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = req.params;

  try {
    const deleted = await prisma.member.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
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

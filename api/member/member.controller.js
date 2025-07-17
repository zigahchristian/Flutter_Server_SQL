import { prisma } from "../../db/prismaClient.js";
import cloudinary from "../../helpers/cloudinary.js";

// Upload base64 avatar to cloudinary
const uploadTocloudinary = async (base64, folder = "societas") => {
  const res = await cloudinary.uploader.upload(base64, {
    folder,
    resource_type: "image",
  });
  return { url: res.secure_url, public_id: res.public_id };
};

// Delete avatar from cloudinary
const deleteFromcloudinary = async (public_id) => {
  if (!public_id) return;
  await cloudinary.uploader.destroy(public_id);
};

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

    let cloudinaryData = null;
    // Handle profile picture upload if provided
    if (profilepicture && profilepicture.startsWith("data:")) {
      cloudinaryData = await uploadTocloudinary(profilepicture);
    }

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
        dateofbirth: dateofbirth ? new Date(dateofbirth) : null,
        occupation,
        otherskills,
        profilepicture: cloudinaryData?.url || profilepicture || null,
        publicprofilepictureurl: cloudinaryData?.public_id || null,
        emergencycontactphone,
        emergencycontactname,
        emergencycontactrelationship,
        joindate: joindate ? new Date(joindate) : null,
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

  try {
    const data = [];
    for (const member of members) {
      const id = await generateUniqueMemberId();

      let cloudinaryData = null;
      if (member.profilepicture && member.profilepicture.startsWith("data:")) {
        cloudinaryData = await uploadTocloudinary(member.profilepicture);
      }

      data.push({
        id,
        membername: member.membername,
        firstname: member.firstname,
        lastname: member.lastname,
        gender: member.gender,
        email: member.email,
        phone: member.phone,
        position: member.position,
        dateofbirth: member.dateofbirth ? new Date(member.dateofbirth) : null,
        occupation: member.occupation,
        otherskills: member.otherskills,
        profilepicture: cloudinaryData?.url || member.profilepicture || null,
        publicprofilepictureurl: cloudinaryData?.public_id || null,
        emergencycontactphone: member.emergencycontactphone,
        emergencycontactname: member.emergencycontactname,
        emergencycontactrelationship: member.emergencycontactrelationship,
        joindate: member.joindate ? new Date(member.joindate) : null,
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
  console.log(req.body);
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
    // Get current member data to check for existing image
    const currentMember = await prisma.members.findUnique({
      where: { id: Number(id) },
    });

    if (!currentMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    let cloudinaryData = {
      url: currentMember.profilepicture,
      public_id: currentMember.publicprofilepictureurl,
    };

    // Handle profile picture update if new image is provided
    if (profilepicture && profilepicture.startsWith("data:")) {
      // Delete old image from Cloudinary if it exists
      if (
        currentMember.publicprofilepictureurl !== null &&
        currentMember.publicprofilepictureurl !== "avatar.png"
      ) {
        await deleteFromcloudinary(currentMember.publicprofilepictureurl);
      }
      // Upload new image
      cloudinaryData = await uploadTocloudinary(profilepicture);
    } else if (profilepicture === null || profilepicture === "") {
      // Handle case when profile picture is being removed
      if (currentMember.publicprofilepictureurl) {
        await deleteFromcloudinary(currentMember.publicprofilepictureurl);
      }
      cloudinaryData = { url: null, public_id: null };
    }

    const updated = await prisma.members.update({
      where: { id: Number(id) },
      data: {
        membername: membername !== null ? membername : currentMember.membername,
        firstname: firstname !== null ? firstname : currentMember.firstname,
        lastname: lastname !== null ? lastname : currentMember.lastname,
        gender: gender !== null ? gender : currentMember.gender,
        email: email !== null ? email : currentMember.email,
        phone: phone !== null ? phone : currentMember.phone,
        position: position !== null ? position : currentMember.position,
        dateofbirth:
          dateofbirth !== null
            ? new Date(dateofbirth)
            : currentMember.dateofbirth,
        occupation: occupation !== null ? occupation : currentMember.occupation,
        otherskills:
          otherskills !== null ? otherskills : currentMember.otherskills,
        profilepicture:
          profilepicture !== null
            ? cloudinaryData.url
            : currentMember.profilepicture,
        publicprofilepictureurl:
          profilepicture !== null
            ? cloudinaryData.public_id
            : currentMember.publicprofilepictureurl,
        emergencycontactphone:
          emergencycontactphone !== null
            ? emergencycontactphone
            : currentMember.emergencycontactphone,
        emergencycontactname:
          emergencycontactname !== null
            ? emergencycontactname
            : currentMember.emergencycontactname,
        emergencycontactrelationship:
          emergencycontactrelationship !== null
            ? emergencycontactrelationship
            : currentMember.emergencycontactrelationship,
        joindate:
          joindate !== null ? new Date(joindate) : currentMember.joindate,
        membershiptype:
          membershiptype !== null
            ? membershiptype
            : currentMember.membershiptype,
        status: status !== null ? status : currentMember.status,
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
    // First get the member to check for profile picture
    const member = await prisma.members.findUnique({
      where: { id: Number(id) },
    });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Delete profile picture from Cloudinary if it exists
    if (member.publicprofilepictureurl) {
      await deleteFromcloudinary(member.publicprofilepictureurl);
    }

    // Then delete the member
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

export const uploadAvatar = async (req, res) => {
  const { id } = req.params;
  const { avatar } = req.body; // Expecting base64 string

  if (!avatar || !avatar.startsWith("data:")) {
    return res.status(400).json({ message: "Invalid avatar data" });
  }

  try {
    // Get current member to check for existing image
    const currentMember = await prisma.members.findUnique({
      where: { id: Number(id) },
    });

    if (!currentMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Delete old image if it exists
    if (currentMember.publicprofilepictureurl) {
      await deleteFromcloudinary(currentMember.publicprofilepictureurl);
    }

    // Upload new image
    const cloudinaryData = await uploadTocloudinary(avatar);

    const updatedMember = await prisma.members.update({
      where: { id: Number(id) },
      data: {
        profilepicture: cloudinaryData.url,
        publicprofilepictureurl: cloudinaryData.public_id,
      },
    });

    res.status(200).json(updatedMember);
  } catch (err) {
    console.error("Error uploading avatar:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteAvatar = async (req, res) => {
  const { id } = req.params;

  try {
    const member = await prisma.members.findUnique({
      where: { id: Number(id) },
    });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (!member.publicprofilepictureurl) {
      return res.status(404).json({ message: "Avatar not found" });
    }

    await deleteFromcloudinary(member.publicprofilepictureurl);

    const updatedMember = await prisma.members.update({
      where: { id: Number(id) },
      data: {
        profilepicture: null,
        publicprofilepictureurl: null,
      },
    });

    res.status(200).json(updatedMember);
  } catch (err) {
    console.error("Error deleting avatar:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

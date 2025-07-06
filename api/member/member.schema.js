import { z } from "zod";

export const memberSchema = z.object({
  id: z.number().optional(), // Generated manually
  membername: z.string().min(1, "Member name is required"),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  position: z.string().optional(),
  dateofbirth: z.string().optional(),
  occupation: z.string().optional(),
  otherskills: z.string().optional(),
  profilepicture: z.string().optional(),
  emergencycontactphone: z.string().optional(),
  emergencycontactname: z.string().optional(),
  emergencycontactrelationship: z.string().optional(),
  joindate: z.string().optional(),
  membershiptype: z.string().optional(),
  status: z.string().default("active"),
});

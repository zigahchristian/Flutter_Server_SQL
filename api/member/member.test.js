import { PrismaClient } from "@prisma/client";
import {
  createNewMember,
  getAllMembers,
  getAMemberById,
  updateMemberByID,
  deleteMember,
} from "./member.controller.js";
import { getenv } from "../../helpers/helpers.js";
getenv(); // Load environment variables
// Initialize test database connection
const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.TEST_DATABASE_URL ||
        "postgresql://societas_user:ZmAIb2lFm1ODFembntdCuCIwuULENVYi@dpg-d1ckkrh5pdvs73evlcig-a.oregon-postgres.render.com/testdb",
    },
  },
});

// Test data factory with proper types
const createTestMember = (overrides = {}) => ({
  membername: `richard_${Math.random().toString(36).substring(2, 8)}`,
  firstname: "Richard",
  lastname: "Owusu",
  email: `richard_${Math.random().toString(36).substring(2, 8)}@example.com`,
  phone: `020${Math.floor(1000000 + Math.random() * 9000000)}`,
  position: "Member",
  dateofbirth: new Date("1991-06-15"), // Date object instead of string
  occupation: "Banker",
  otherskills: "Finance, Risk",
  profilepicture: "richow.jpg",
  emergencycontactphone: "0503322119",
  emergencycontactname: "Grace Owusu",
  emergencycontactrelationship: "Wife",
  joindate: new Date("2023-03-25"), // Date object instead of string
  membershiptype: "Brown",
  status: "inactive",
  ...overrides,
});

// Database setup and teardown utilities
// const setupTestDatabase = async () => {
//   // Create tables if they don't exist
//   await testPrisma.$executeRaw`CREATE TABLE IF NOT EXISTS members (
//     id SERIAL PRIMARY KEY,
//     membername VARCHAR(255) NOT NULL,
//     firstname VARCHAR(255) NOT NULL,
//     lastname VARCHAR(255) NOT NULL,
//     email VARCHAR(255) UNIQUE NOT NULL,
//     phone VARCHAR(20),
//     position VARCHAR(100),
//     dateofbirth TIMESTAMPTZ,
//     occupation VARCHAR(100),
//     otherskills TEXT,
//     profilepicture VARCHAR(255),
//     emergencycontactphone VARCHAR(20),
//     emergencycontactname VARCHAR(255),
//     emergencycontactrelationship VARCHAR(100),
//     joindate TIMESTAMPTZ,
//     membershiptype VARCHAR(50),
//     status VARCHAR(50)
//   `;
// };

const cleanDatabase = async () => {
  //await testPrisma.$executeRaw`TRUNCATE TABLE members RESTART IDENTITY CASCADE`;
  await testPrisma.members.deleteMany();
};

beforeAll(async () => {
  await testPrisma.$connect();
  // await setupTestDatabase();
});

afterAll(async () => {
  await cleanDatabase();
  await testPrisma.$disconnect();
});

beforeEach(async () => {
  await cleanDatabase();
});

describe("Member Controller Tests (Test Database)", () => {
  const mockRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  });

  describe("createNewMember", () => {
    it("should create a member with valid data", async () => {
      const req = { body: createTestMember() };
      const res = mockRes();
      await createNewMember(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("getAllMembers", () => {
    it("should return all members", async () => {
      // Insert test data directly
      await testPrisma.members.createMany({
        data: [createTestMember(), createTestMember()],
      });

      const req = {};
      const res = mockRes();
      await getAllMembers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ status: "inactive" }),
          expect.objectContaining({ status: "inactive" }),
        ])
      );
    });
  });

  describe("getAMemberById", () => {
    it("should retrieve a member by ID", async () => {
      const member = await prisma.members.create({
        data: createTestMember(),
      });

      const req = { params: { id: member.id } };
      const res = mockRes();
      await getAMemberById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ id: member.id })
      );
    });

    it("should return 404 for non-existent member", async () => {
      const req = { params: { id: "999" } };
      const res = mockRes();
      await getAMemberById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("updateMemberByID", () => {
    it("should update member details", async () => {
      const member = await prisma.members.create({
        data: createTestMember(),
      });

      const req = {
        params: { id: member.id },
        body: { membername: "updateduser" },
      };
      const res = mockRes();
      await updateMemberByID(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ membername: "updateduser" })
      );
    });
  });

  describe("deleteMember", () => {
    it("should delete a member", async () => {
      const member = await testPrisma.members.create({
        data: createTestMember(),
      });

      const req = { params: { id: member.id } };
      const res = mockRes();
      await deleteMember(req, res);

      // Verify deletion in test database
      const deleted = await testPrisma.members.findUnique({
        where: { id: member.id },
      });

      expect(deleted).toEqual(member);
    });
  });
});

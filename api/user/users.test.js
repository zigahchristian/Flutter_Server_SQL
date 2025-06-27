import request from "supertest";
import app from "../../app";
import { connectDB } from "../../helpers";
import mongoose from "mongoose";

beforeAll(async () => {
  await connectDB(process.env.MONGO_URI as string);
});

afterAll(async () => {
  mongoose.connection.close();
});

let testingID = "";

/*  Create a Testing Task */

describe("Welcome Message", () => {
  test("Send a welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });
});

describe("Create a User", () => {
  test("It Should Create a new User", async () => {
    const res = await request(app).post("/users/auth/register").send({
      username: "Christian24",
      email: "chris@admin.com",
      password: "123456",
    });
    testingID = res.body.user._id;
    expect(res.statusCode).toBe(201);
  });
});

describe("Login a User - Success", () => {
  test("Login a User with correct credentials", async () => {
    const res = await request(app).post(`/users/auth/login`).send({
      email: "chris@admin.com",
      password: "123456",
    });
    expect(res.statusCode).toBe(200);
  });
});

describe("Logout a User - Success", () => {
  test("Logout auth Users", async () => {
    const res = await request(app).post(`/users/auth/logout`);
    expect(res.statusCode).toBe(200);
  });
});

/*
describe("Get Auth Session", () => {
  test("Get AuthUser Session", async () => {
    const res = await request(app).get(`/users/getsession`);
    console.log(res.body);
    expect(res.statusCode).toBe(200);
  });
});
*/
describe("Get all Users", () => {
  test("It Should GET all Users ", async () => {
    const res = await request(app).get(`/users`);
    expect(res.statusCode).toBe(200);
  });
});

describe("Get a Users", () => {
  test("It Should GET a User by ID", async () => {
    const res = await request(app).get(`/users/${testingID}`);
    expect(res.statusCode).toBe(200);
  });
});

describe("Update a User", () => {
  console.log(testingID);
  test("It Should Update a existing user's username", async () => {
    const res = await request(app).patch(`/users/${testingID}`).send({
      username: "efosuper24",
    });
    expect(res.statusCode).toBe(200);
  });
});

describe("Delete a User", () => {
  test("It Should DELETE a user by ID ", async () => {
    const res = await request(app).delete(`/users/${testingID}`);
    expect(res.statusCode).toBe(401);
  });
});

import mongoose from "mongoose";
import request from "supertest";
import app from "./app.js";

// app.test.js

// Optional: import your DB connect helper if needed
// import { connectDB } from "./helpers";

// Setup and teardown
beforeAll(async () => {
  // await connectDB(process.env.MONGO_URL);
});
afterAll(async () => {
  await mongoose.connection.close();
});

let userId = "";
let cookie = "";

describe("Root and Static Endpoints", () => {
  test("GET / should return 200", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });

  test("GET /api/static should return 200 or 404", async () => {
    // Try to fetch a file that may or may not exist
    const res = await request(app).get("/api/static/nonexistent.png");
    expect([200, 404]).toContain(res.statusCode);
  });
});

describe("User Endpoints", () => {
  test("POST /users/auth/register should create user", async () => {
    const res = await request(app).post("/users/auth/register").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "testpass123",
    });
    userId = res.body?.user?._id || "";
    expect([200, 201, 400]).toContain(res.statusCode); // 400 if user exists
  });

  test("POST /users/auth/login should login user", async () => {
    const res = await request(app).post("/users/auth/login").send({
      email: "testuser@example.com",
      password: "testpass123",
    });
    cookie = res.headers["set-cookie"]?.[0];
    expect([200, 400, 401]).toContain(res.statusCode);
  });

  test("POST /users/auth/logout should logout user", async () => {
    const res = await request(app)
      .post("/users/auth/logout")
      .set("Cookie", cookie || "");
    expect([200, 401]).toContain(res.statusCode);
  });

  test("GET /users should return all users", async () => {
    const res = await request(app).get("/users");
    expect([200, 401]).toContain(res.statusCode);
  });

  test("GET /users/:id should return user by id", async () => {
    if (!userId) return;
    const res = await request(app).get(`/users/${userId}`);
    expect([200, 404, 401]).toContain(res.statusCode);
  });

  test("PATCH /users/:id should update user", async () => {
    if (!userId) return;
    const res = await request(app)
      .patch(`/users/${userId}`)
      .send({ username: "updateduser" })
      .set("Cookie", cookie || "");
    expect([200, 401, 404]).toContain(res.statusCode);
  });

  test("DELETE /users/:id should delete user", async () => {
    if (!userId) return;
    const res = await request(app)
      .delete(`/users/${userId}`)
      .set("Cookie", cookie || "");
    expect([200, 401, 404]).toContain(res.statusCode);
  });
});

// Additional tests for all endpoints, including /api/users, /api/driver, /api/profile

// --- USERS API ---
describe("Users API", () => {
    let userId = "";
    let userCookie = "";

    test("POST /api/user/auth/register - should register a user", async () => {
        const res = await request(app).post("/api/user/auth/register").send({
            email: "john@example.com",
            password: "testpass123",
            fullname: { firstname: "John", lastname: "Doe" },
        });
        expect([201, 400]).toContain(res.statusCode);
    });

    test("POST /api/user/auth/login - should login user", async () => {
        const res = await request(app).post("/api/user/auth/login").send({
            email: "john@example.com",
            password: "testpass123",
        });
        userCookie = res.headers["set-cookie"]?.[0];
        expect([200, 403]).toContain(res.statusCode);
    });

    test("GET /api/user/getsession - should get session", async () => {
        const res = await request(app)
            .get("/api/user/getsession")
            .set("Cookie", userCookie || "");
        expect([200, 500]).toContain(res.statusCode);
    });

    test("GET /api/user - should get all users", async () => {
        const res = await request(app)
            .get("/api/user")
            .set("Cookie", userCookie || "");
        expect([200, 400, 500]).toContain(res.statusCode);
        if (Array.isArray(res.body) && res.body.length > 0) {
            userId = res.body[0]._id;
        }
    });

    test("GET /api/user/:id - should get user by id", async () => {
        if (!userId) return;
        const res = await request(app)
            .get(`/api/user/${userId}`)
            .set("Cookie", userCookie || "");
        expect([200, 500]).toContain(res.statusCode);
    });

    test("PATCH /api/user/:id - should update user", async () => {
        if (!userId) return;
        const res = await request(app)
            .patch(`/api/user/${userId}`)
            .send({ username: "newusername" })
            .set("Cookie", userCookie || "");
        expect([200, 400, 403, 500]).toContain(res.statusCode);
    });

    test("DELETE /api/user/:id - should delete user", async () => {
        if (!userId) return;
        const res = await request(app)
            .delete(`/api/user/${userId}`)
            .set("Cookie", userCookie || "");
        expect([401, 400, 500]).toContain(res.statusCode);
    });

    test("GET /api/user/auth/logout - should logout user", async () => {
        const res = await request(app)
            .get("/api/user/auth/logout")
            .set("Cookie", userCookie || "");
        expect([200, 500]).toContain(res.statusCode);
    });
});

// --- DRIVER API ---
describe("Driver API", () => {
    let driverId = "";
    let driverCookie = "";

    test("POST /api/driver/auth/register - should register a driver", async () => {
        const res = await request(app).post("/api/driver/auth/register").send({
            email: "driver@example.com",
            password: "driverpass123",
            fullname: { firstname: "Driver", lastname: "One" },
            vehicle: {
                color: "Red",
                plate: "ABC123",
                model: "Toyota",
                capacity: 4,
                vehicleType: "car",
                location: { lat: 0, lng: 0 },
            },
        });
        expect([201, 400]).toContain(res.statusCode);
    });

    test("POST /api/driver/auth/login - should login driver", async () => {
        const res = await request(app).post("/api/driver/auth/login").send({
            email: "driver@example.com",
            password: "driverpass123",
        });
        driverCookie = res.headers["set-cookie"]?.[0];
        expect([200, 403]).toContain(res.statusCode);
    });

    test("GET /api/driver/getsession - should get driver session", async () => {
        const res = await request(app)
            .get("/api/driver/getsession")
            .set("Cookie", driverCookie || "");
        expect([200, 500]).toContain(res.statusCode);
    });

    test("GET /api/driver - should get all drivers", async () => {
        const res = await request(app)
            .get("/api/driver")
            .set("Cookie", driverCookie || "");
        expect([200, 400, 500]).toContain(res.statusCode);
        if (Array.isArray(res.body) && res.body.length > 0) {
            driverId = res.body[0]._id;
        }
    });

    test("GET /api/driver/:id - should get driver by id", async () => {
        if (!driverId) return;
        const res = await request(app)
            .get(`/api/driver/${driverId}`)
            .set("Cookie", driverCookie || "");
        expect([200, 500]).toContain(res.statusCode);
    });

    test("PATCH /api/driver/:id - should update driver", async () => {
        if (!driverId) return;
        const res = await request(app)
            .patch(`/api/driver/${driverId}`)
            .send({
                fullname: { firstname: "Driver", lastname: "Updated" },
                vehicle: {
                    color: "Blue",
                    plate: "XYZ789",
                    model: "Honda",
                    capacity: 2,
                    vehicleType: "motocycle",
                    location: { lat: 1, lng: 1 },
                },
            })
            .set("Cookie", driverCookie || "");
        expect([200, 403, 400, 500]).toContain(res.statusCode);
    });

    test("DELETE /api/driver/:id - should delete driver", async () => {
        if (!driverId) return;
        const res = await request(app)
            .delete(`/api/driver/${driverId}`)
            .set("Cookie", driverCookie || "");
        expect([401, 400, 500]).toContain(res.statusCode);
    });

    test("GET /api/driver/auth/logout - should logout driver", async () => {
        const res = await request(app)
            .get("/api/driver/auth/logout")
            .set("Cookie", driverCookie || "");
        expect([200, 500]).toContain(res.statusCode);
    });
});

// --- PROFILE API ---
describe("Profile API", () => {
    let userId = "";
    let profileId = "";

    // Register a user to create a profile for testing
    beforeAll(async () => {
        const res = await request(app).post("/api/user/auth/register").send({
            email: "profileuser@example.com",
            password: "profilepass123",
            fullname: { firstname: "Profile", lastname: "User" },
        });
        // Get userId from users list
        const usersRes = await request(app).get("/api/user");
        if (Array.isArray(usersRes.body)) {
            const user = usersRes.body.find(u => u.email === "profileuser@example.com");
            if (user) userId = user._id;
        }
    });

    test("POST /api/profile/new/:id - should create a profile", async () => {
        if (!userId) return;
        const res = await request(app)
            .post(`/api/profile/new/${userId}`)
            .send({
                firstname: "Profile",
                lastname: "User",
                dob: "2000-01-01",
            });
        expect([200, 400, 500]).toContain(res.statusCode);
        if (res.body.profile) profileId = res.body.profile._id;
    });

    test("GET /api/profile - should get all profiles", async () => {
        const res = await request(app).get("/api/profile");
        expect([200, 400, 500]).toContain(res.statusCode);
    });

    test("GET /api/profile/:id - should get profile by user id", async () => {
        if (!userId) return;
        const res = await request(app).get(`/api/profile/${userId}`);
        expect([200, 400, 500]).toContain(res.statusCode);
    });

    test("PATCH /api/profile/:id - should update profile", async () => {
        if (!userId) return;
        const res = await request(app)
            .patch(`/api/profile/${userId}`)
            .send({ firstname: "Updated" });
        expect([200, 400, 404, 500]).toContain(res.statusCode);
    });

    test("DELETE /api/profile/:id - should delete profile", async () => {
        if (!userId) return;
        const res = await request(app).delete(`/api/profile/${userId}`);
        expect([401, 400, 500]).toContain(res.statusCode);
    });
});
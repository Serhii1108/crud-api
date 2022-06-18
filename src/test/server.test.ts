import request from "supertest";
import { statusCodes } from "../constants.js";
import { Candidate } from "../user/user.model.js";
import { createServer, PORT } from "../utils/server.js";

const server = createServer(1).listen(PORT);

afterAll(() => server.close());

const userMock: Candidate = {
  username: "Ivan",
  age: 22,
  hobbies: ["play football", "watching films"],
};

describe("Scenario 1:", () => {
  let userId: string;

  test("Get all users", async () => {
    const res = await request(server).get("/api/users");

    expect(res.statusCode).toBe(statusCodes.SUCCESS);
    expect(res.headers).toMatchObject({ "content-type": "application/json" });
    expect(res.body).toStrictEqual([]);
  });

  test("Create user", async () => {
    const res = await request(server).post("/api/users").send(userMock);

    expect(res.statusCode).toBe(statusCodes.CREATED);
    expect(res.headers).toMatchObject({ "content-type": "application/json" });
    expect(res.body).toMatchObject(userMock);

    userId = res.body.id;
  });

  test("Get user by id", async () => {
    const res = await request(server).get(`/api/users/${userId}`);

    expect(res.statusCode).toBe(statusCodes.SUCCESS);
    expect(res.headers).toMatchObject({ "content-type": "application/json" });
    expect(res.body).toMatchObject(userMock);
  });

  test("Update user", async () => {
    const updatedUser: Candidate = {
      username: "Serhii",
      age: 18,
      hobbies: ["programming", "cooking"],
    };
    const res = await request(server)
      .put(`/api/users/${userId}`)
      .send(updatedUser);

    expect(res.statusCode).toBe(statusCodes.SUCCESS);
    expect(res.headers).toMatchObject({ "content-type": "application/json" });
    expect(res.body).toMatchObject(updatedUser);
    expect(res.body.id).toBe(userId);
  });

  test("Delete user", async () => {
    const res = await request(server).del(`/api/users/${userId}`);

    expect(res.statusCode).toBe(statusCodes.DELETED);
  });

  test("Try to get deleted user", async () => {
    const res = await request(server).get(`/api/users/${userId}`);

    expect(res.statusCode).toBe(statusCodes.NOT_FOUND);
    expect(res.headers).toMatchObject({ "content-type": "text/plain" });
  });
});

describe("Scenario 2:", () => {
  let userId: string;

  test("Create user", async () => {
    const res = await request(server).post("/api/users").send(userMock);

    expect(res.statusCode).toBe(statusCodes.CREATED);
    expect(res.headers).toMatchObject({ "content-type": "application/json" });
    expect(res.body).toMatchObject(userMock);

    userId = res.body.id;
  });

  test("Get user by id", async () => {
    const res = await request(server).get(`/api/users/${userId}`);

    expect(res.statusCode).toBe(statusCodes.SUCCESS);
    expect(res.headers).toMatchObject({ "content-type": "application/json" });
    expect(res.body).toMatchObject(userMock);
  });

  test("Try to create user with wrong body", async () => {
    const wrongUserMock = {
      username: 123,
      age: "test",
      hobbies: "Hello world:)",
    };

    const res = await request(server).post("/api/users").send(wrongUserMock);

    expect(res.statusCode).toBe(statusCodes.BAD_REQUEST);
    expect(res.headers).toMatchObject({ "content-type": "text/plain" });
  });

  test("Try to get user by wrong id(not uuid)", async () => {
    const res = await request(server).get("/api/users/NOT_UUID");

    expect(res.statusCode).toBe(statusCodes.BAD_REQUEST);
    expect(res.headers).toMatchObject({ "content-type": "text/plain" });
  });

  test("Try to delete user by wrong id(not uuid)", async () => {
    const res = await request(server).del(`/api/users/NOT_UUID`);

    expect(res.statusCode).toBe(statusCodes.BAD_REQUEST);
    expect(res.headers).toMatchObject({ "content-type": "text/plain" });
  });

  test("Try to delete user who doesn't exist", async () => {
    const wrongId = "0a222343-8cd6-4a99-a5f0-d97e90dae38e";
    const res = await request(server).del(`/api/users/${wrongId}`);

    expect(res.statusCode).toBe(statusCodes.NOT_FOUND);
    expect(res.headers).toMatchObject({ "content-type": "text/plain" });
  });
});

describe("Scenario 3:", () => {
  let userId: string;

  test("Create user", async () => {
    const res = await request(server).post("/api/users").send(userMock);

    expect(res.statusCode).toBe(statusCodes.CREATED);
    expect(res.headers).toMatchObject({ "content-type": "application/json" });
    expect(res.body).toMatchObject(userMock);

    userId = res.body.id;
  });

  test("Update user", async () => {
    const updatedUser: Candidate = {
      username: "Serhii",
      age: 18,
      hobbies: ["programming", "cooking"],
    };
    const res = await request(server)
      .put(`/api/users/${userId}`)
      .send(updatedUser);

    expect(res.statusCode).toBe(statusCodes.SUCCESS);
    expect(res.headers).toMatchObject({ "content-type": "application/json" });
    expect(res.body).toMatchObject(updatedUser);
    expect(res.body.id).toBe(userId);
  });

  test("Try to update user with wrong id(not uuid)", async () => {
    const res = await request(server).put("/api/users/NOT_UUID").send(userMock);

    expect(res.statusCode).toBe(statusCodes.BAD_REQUEST);
    expect(res.headers).toMatchObject({ "content-type": "text/plain" });
  });

  test("Try to update user with wrong body", async () => {
    const wrongUserMock = {
      username: 123,
      age: "test",
      hobbies: "Hello world:)",
    };
    await request(server)
      .post("/api/users")
      .send(userMock)
      .then(async (response) => {
        const res = await request(server)
          .put(`/api/users/${response.body.id}`)
          .send(wrongUserMock);

        expect(res.statusCode).toBe(statusCodes.BAD_REQUEST);
        expect(res.headers).toMatchObject({ "content-type": "text/plain" });
      });
  });

  test("Try to update user who doesn't exist", async () => {
    const wrongId = "0a222343-8cd6-4a99-a5f0-d97e90dae38e";
    const res = await request(server)
      .put(`/api/users/${wrongId}`)
      .send(userMock);

    expect(res.statusCode).toBe(statusCodes.NOT_FOUND);
    expect(res.headers).toMatchObject({ "content-type": "text/plain" });
  });
});

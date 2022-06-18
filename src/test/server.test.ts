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
let userId: string;

describe("Scenario 1:", () => {
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

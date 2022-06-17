import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { statusCodes } from "../constants.js";

import { Candidate, User } from "./user.model.js";

class userService {
  public users: User[];

  constructor() {
    this.users = [];
  }

  async getAllUsers(): Promise<User[]> {
    return new Promise((resolve) => resolve(this.users));
  }

  async getUsersById(userId: UUIDType): Promise<number | User> {
    return new Promise((resolve, reject) => {
      if (!uuidValidate(userId)) {
        reject(statusCodes.BAD_REQUEST);
      }

      const user: User = this.users.filter((user) => user.id === userId)[0];

      if (!user) {
        reject(statusCodes.NOT_FOUND);
      }

      resolve(user);
    }) as Promise<number | User>;
  }

  async createUser(userCandidate: Candidate): Promise<User> {
    return new Promise((resolve) => {
      const { username, age, hobbies } = userCandidate;
      const id: UUIDType = uuidv4();

      const user: User = { id, username, age, hobbies };

      this.users.push(user);
      resolve(user);
    });
  }

  async updateUser(updatedUser: User) {
    console.log("update user");
  }

  async deleteUser(userId: UUIDType): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!uuidValidate(userId)) {
        reject(statusCodes.BAD_REQUEST);
      }

      const userToDelete: User = this.users.filter(
        (user) => user.id === userId
      )[0];

      if (userToDelete) {
        this.users.splice(this.users.indexOf(userToDelete), 1);
        resolve(statusCodes.SUCCESS);
      } else {
        reject(statusCodes.NOT_FOUND);
      }
    });
  }
}

export default new userService();

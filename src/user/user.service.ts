import { v4 as uuidv4 } from "uuid";

import { Candidate, User } from "./user.model.js";

class userService {
  public users: User[];

  constructor() {
    this.users = [];
  }

  async getAllUsers(): Promise<User[]> {
    return new Promise((resolve) => resolve(this.users));
  }

  async getUsersById(userId: UUIDType) {
    console.log("get user by id");
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

  async deleteUser(userId: UUIDType) {
    console.log("Delete user");
  }
}

export default new userService();

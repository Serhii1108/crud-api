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

  async createUser(userCandidate: Candidate) {
    console.log("Create user");
  }

  async updateUser(updatedUser: User) {
    console.log("update user");
  }

  async deleteUser(userId: UUIDType) {
    console.log("Delete user");
  }
}

export default new userService();

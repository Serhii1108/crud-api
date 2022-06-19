import { v4 as uuidv4, validate as uuidValidate } from "uuid";

import { statusCodes } from "../constants.js";
import { Candidate, User } from "./models/user.model.js";

class userService {
  private users: User[];

  constructor() {
    this.users = [];
  }

  get getUsers() {
    return this.users;
  }

  set setUsers(users: User[]) {
    this.users = users;
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

  async updateUser(
    userId: UUIDType,
    updatedUser: Candidate
  ): Promise<number | User> {
    return new Promise((resolve, reject) => {
      if (!uuidValidate(userId)) {
        reject(statusCodes.BAD_REQUEST);
      }

      const userToUpdate: User = this.users.filter(
        (user) => user.id === userId
      )[0];

      if (!userToUpdate) {
        reject(statusCodes.NOT_FOUND);
      }

      const { username, age, hobbies } = updatedUser;
      userToUpdate.username = username;
      userToUpdate.age = age;
      userToUpdate.hobbies = hobbies;

      resolve(userToUpdate);
    });
  }

  async deleteUser(userId: UUIDType): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!uuidValidate(userId)) {
        reject(statusCodes.BAD_REQUEST);
      }

      const userToDelete: User = this.users.filter(
        (user) => user.id === userId
      )[0];

      if (!userToDelete) {
        reject(statusCodes.NOT_FOUND);
      } else {
        this.users.splice(this.users.indexOf(userToDelete), 1);
        resolve(statusCodes.DELETED);
      }
    });
  }
}

export default new userService();

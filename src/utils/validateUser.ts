import { Candidate } from "../user/models/user.model.js";

export const validateUserCandidate = (user: Candidate) => {
  const username = user.username ? typeof user.username === "string" : false;
  const age = user.age ? Number.isInteger(user.age) : false;
  const hobbies = user.hobbies ? Array.isArray(user.hobbies) : false;

  return username && age && hobbies;
};

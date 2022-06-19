export interface Candidate {
  username: string;
  age: number;
  hobbies: string[];
}

export interface User extends Candidate {
  id: UUIDType;
}

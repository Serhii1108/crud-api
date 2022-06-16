import "dotenv/config";
import http, { IncomingMessage, ServerResponse } from "http";

import { statusCodes } from "./constants.js";
import { Candidate, User } from "./user/user.model.js";
import userService from "./user/user.service.js";
import { getReqData } from "./utils/getReqData.js";
import { validateUserCandidate } from "./utils/validateUser.js";

const PORT = process.env.PORT || 8080;

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    try {
      if (req.url === "/api/users" && req.method === "GET") {
        const users: User[] = await userService.getAllUsers();

        res.writeHead(statusCodes.SUCCESS, {
          "Content-Type": "application/json",
        });

        res.end(JSON.stringify(users));
      } else if (req.url === "/api/users" && req.method === "POST") {
        const candidate: Candidate = (await getReqData(req)) as Candidate;

        if (validateUserCandidate(candidate)) {
          const newUser: User = await userService.createUser(candidate);

          res.writeHead(statusCodes.CREATED, {
            "Content-Type": "application/json",
          });

          res.end(JSON.stringify(newUser));
        } else {
          res.writeHead(statusCodes.BAD_REQUEST, {
            "Content-Type": "text/plain",
          });
          res.end("Error: Bad request");
        }
      }

      res.end();
    } catch {
      res.writeHead(statusCodes.SERVER_ERROR, {
        "Content-Type": "text/plain",
      });
      res.end("Error: Internal server error");
    }
  }
);

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});

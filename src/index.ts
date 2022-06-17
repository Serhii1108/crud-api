import "dotenv/config";
import http, { IncomingMessage, ServerResponse } from "http";

import { statusCodes } from "./constants.js";
import { Candidate, User } from "./user/user.model.js";
import userService from "./user/user.service.js";
import { getReqData } from "./utils/getReqData.js";
import { checkError, sendResponse } from "./utils/response.js";
import { validateUserCandidate } from "./utils/validateUser.js";

const PORT = process.env.PORT || 8080;

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    try {
      // Get all
      if (req.url === "/api/users" && req.method === "GET") {
        const users: User[] = await userService.getAllUsers();
        sendResponse(res, statusCodes.SUCCESS, users);

        // Get one
      } else if (req.url?.startsWith("/api/users/") && req.method === "GET") {
        const id: UUIDType | undefined = req.url.split("/").pop();
        if (id) {
          await userService
            .getUsersById(id)
            .catch((errCode: number) => {
              checkError(res, errCode);
            })
            .then((user: User | number | void) => {
              if (typeof user === "object") {
                sendResponse(res, statusCodes.SUCCESS, user);
              }
            });
        }
        // Create
      } else if (req.url === "/api/users" && req.method === "POST") {
        const candidate: Candidate = (await getReqData(req)) as Candidate;

        if (validateUserCandidate(candidate)) {
          const newUser: User = await userService.createUser(candidate);
          sendResponse(res, statusCodes.CREATED, newUser);
        } else {
          sendResponse(res, statusCodes.BAD_REQUEST);
        }

        // Delete
      } else if (
        req.url?.startsWith("/api/users/") &&
        req.method === "DELETE"
      ) {
        const id: UUIDType | undefined = req.url.split("/").pop();
        if (id) {
          await userService
            .deleteUser(id)
            .catch((errCode: number) => {
              checkError(res, errCode);
            })
            .then(() => {
              sendResponse(res, statusCodes.DELETED);
            });
        }
      }

      res.end();
    } catch {
      sendResponse(res, statusCodes.SERVER_ERROR);
    }
  }
);

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});

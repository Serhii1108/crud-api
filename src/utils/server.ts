import "dotenv/config";
import http, { IncomingMessage, ServerResponse } from "http";

import { statusCodes } from "../constants.js";
import { User, Candidate } from "../user/user.model.js";
import userService from "../user/user.service.js";
import { getReqData } from "./getReqData.js";
import { sendResponse, checkError } from "./response.js";
import { validateUserCandidate } from "./validateUser.js";

export const PORT = process.env.PORT;

export const createServer = (serverId: number): http.Server => {
  return http.createServer(
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
          } else {
            sendResponse(res, statusCodes.BAD_REQUEST);
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
          } else {
            sendResponse(res, statusCodes.BAD_REQUEST);
          }

          // Update
        } else if (req.url?.startsWith("/api/users/") && req.method === "PUT") {
          const id: UUIDType | undefined = req.url.split("/").pop();
          const candidate: Candidate = (await getReqData(req)) as Candidate;

          if (id && validateUserCandidate(candidate)) {
            await userService
              .updateUser(id, candidate)
              .catch((errCode: number) => {
                checkError(res, errCode);
              })
              .then((updatedUser: User | number | void) => {
                if (typeof updatedUser === "object") {
                  sendResponse(res, statusCodes.SUCCESS, updatedUser);
                }
              });
          } else {
            sendResponse(res, statusCodes.BAD_REQUEST);
          }
        } else {
          sendResponse(res, statusCodes.NOT_FOUND);
        }
      } catch {
        sendResponse(res, statusCodes.SERVER_ERROR);
      }
    }
  );
};

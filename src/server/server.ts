import "dotenv/config";
import http, { IncomingMessage, ServerResponse } from "http";

import { statusCodes } from "../constants.js";
import { User, Candidate } from "../user/models/user.model.js";
import userService from "../user/user.service.js";
import { getReqData } from "../utils/getReqData.js";
import { LogService } from "../utils/log.service.js";
import { sendResponse, checkError } from "./response.js";
import { validateUserCandidate } from "../utils/validateUser.js";

export const PORT = process.env.PORT;

export const createServer = (serverId: number): http.Server => {
  const logService = new LogService(serverId);

  process.on("SIGINT", () => {
    logService.printStats();
    process.exit();
  });

  return http.createServer(
    async (req: IncomingMessage, res: ServerResponse) => {
      try {
        // Get all
        if (req.url === "/api/users" && req.method === "GET") {
          const users: User[] = await userService.getAllUsers();

          logService.printReq(serverId, req.method, statusCodes.SUCCESS);

          sendResponse(res, statusCodes.SUCCESS, users);

          // Get one
        } else if (req.url?.startsWith("/api/users/") && req.method === "GET") {
          const id: UUIDType | undefined = req.url.split("/").pop();
          if (id) {
            await userService
              .getUsersById(id)
              .catch((errCode: number) => {
                checkError(serverId, req, res, errCode, logService);
              })
              .then((user: User | number | void) => {
                if (typeof user === "object") {
                  logService.printReq(
                    serverId,
                    req.method,
                    statusCodes.SUCCESS
                  );
                  sendResponse(res, statusCodes.SUCCESS, user);
                }
              });
          } else {
            logService.printReq(serverId, req.method, statusCodes.BAD_REQUEST);
            sendResponse(res, statusCodes.BAD_REQUEST);
          }
          // Create
        } else if (req.url === "/api/users" && req.method === "POST") {
          const candidate: Candidate = (await getReqData(req)) as Candidate;

          if (validateUserCandidate(candidate)) {
            const newUser: User = await userService.createUser(candidate);

            logService.printReq(serverId, req.method, statusCodes.CREATED);
            sendResponse(res, statusCodes.CREATED, newUser);
          } else {
            logService.printReq(serverId, req.method, statusCodes.BAD_REQUEST);
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
                checkError(serverId, req, res, errCode, logService);
              })
              .then((statusCode: number | void) => {
                if (statusCode === statusCodes.DELETED) {
                  logService.printReq(
                    serverId,
                    req.method,
                    statusCodes.DELETED
                  );
                  sendResponse(res, statusCodes.DELETED);
                }
              });
          } else {
            logService.printReq(serverId, req.method, statusCodes.BAD_REQUEST);
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
                checkError(serverId, req, res, errCode, logService);
              })
              .then((updatedUser: User | number | void) => {
                if (typeof updatedUser === "object") {
                  logService.printReq(
                    serverId,
                    req.method,
                    statusCodes.SUCCESS
                  );
                  sendResponse(res, statusCodes.SUCCESS, updatedUser);
                }
              });
          } else {
            logService.printReq(serverId, req.method, statusCodes.BAD_REQUEST);
            sendResponse(res, statusCodes.BAD_REQUEST);
          }
        } else {
          logService.printReq(serverId, req.method, statusCodes.NOT_FOUND);
          sendResponse(res, statusCodes.NOT_FOUND);
        }
      } catch {
        logService.printReq(serverId, req.method, statusCodes.SERVER_ERROR);
        sendResponse(res, statusCodes.SERVER_ERROR);
      }
    }
  );
};

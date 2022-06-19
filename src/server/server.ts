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
          await getAllUsers(req, res, serverId, logService);
          return;
        }

        // Get user by id
        if (req.url?.startsWith("/api/users/") && req.method === "GET") {
          await getUsersById(req, res, serverId, logService);
          return;
        }

        // Create
        if (req.url === "/api/users" && req.method === "POST") {
          await createUser(req, res, serverId, logService);
          return;
        }

        // Delete
        if (req.url?.startsWith("/api/users/") && req.method === "DELETE") {
          await deleteUser(req, res, serverId, logService);
          return;
        }

        // Update
        if (req.url?.startsWith("/api/users/") && req.method === "PUT") {
          await updateUser(req, res, serverId, logService);
          return;
        }
        // non-existing endpoints
        logService.printReq(serverId, req.method, statusCodes.NOT_FOUND);
        sendResponse(res, statusCodes.NOT_FOUND);
      } catch {
        logService.printReq(serverId, req.method, statusCodes.SERVER_ERROR);
        sendResponse(res, statusCodes.SERVER_ERROR);
      }
    }
  );
};

const getAllUsers = async (
  req: IncomingMessage,
  res: ServerResponse,
  serverId: number,
  logService: LogService
) => {
  const users: User[] = await userService.getAllUsers();
  logService.printReq(serverId, req.method, statusCodes.SUCCESS);
  sendResponse(res, statusCodes.SUCCESS, users);
};

const getUsersById = async (
  req: IncomingMessage,
  res: ServerResponse,
  serverId: number,
  logService: LogService
) => {
  if (req.url) {
    const id: UUIDType | undefined = req.url.split("/").pop();

    if (id) {
      await userService
        .getUsersById(id)
        .catch((errCode: number) => {
          checkError(serverId, req, res, errCode, logService);
        })
        .then((user: User | number | void) => {
          if (typeof user === "object") {
            logService.printReq(serverId, req.method, statusCodes.SUCCESS);
            sendResponse(res, statusCodes.SUCCESS, user);
          }
        });
    } else {
      logService.printReq(serverId, req.method, statusCodes.BAD_REQUEST);
      sendResponse(res, statusCodes.BAD_REQUEST);
    }
  }
};

const createUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  serverId: number,
  logService: LogService
) => {
  const candidate: Candidate = (await getReqData(req)) as Candidate;

  if (validateUserCandidate(candidate)) {
    const newUser: User = await userService.createUser(candidate);

    logService.printReq(serverId, req.method, statusCodes.CREATED);
    sendResponse(res, statusCodes.CREATED, newUser);
  } else {
    logService.printReq(serverId, req.method, statusCodes.BAD_REQUEST);
    sendResponse(res, statusCodes.BAD_REQUEST);
  }
};

const deleteUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  serverId: number,
  logService: LogService
) => {
  if (req.url) {
    const id: UUIDType | undefined = req.url.split("/").pop();
    if (id) {
      await userService
        .deleteUser(id)
        .catch((errCode: number) => {
          checkError(serverId, req, res, errCode, logService);
        })
        .then((statusCode: number | void) => {
          if (statusCode === statusCodes.DELETED) {
            logService.printReq(serverId, req.method, statusCodes.DELETED);
            sendResponse(res, statusCodes.DELETED);
          }
        });
    } else {
      logService.printReq(serverId, req.method, statusCodes.BAD_REQUEST);
      sendResponse(res, statusCodes.BAD_REQUEST);
    }
  }
};

const updateUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  serverId: number,
  logService: LogService
) => {
  if (req.url) {
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
            logService.printReq(serverId, req.method, statusCodes.SUCCESS);
            sendResponse(res, statusCodes.SUCCESS, updatedUser);
          }
        });
    } else {
      logService.printReq(serverId, req.method, statusCodes.BAD_REQUEST);
      sendResponse(res, statusCodes.BAD_REQUEST);
    }
  }
};

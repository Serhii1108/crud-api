import { IncomingMessage, ServerResponse } from "http";

import { statusCodes } from "../constants.js";
import { User } from "../user/models/user.model.js";
import userService from "../user/user.service.js";
import { LogService } from "../utils/log.service.js";

export const sendResponse = (
  serverResponse: ServerResponse,
  statusCode: number,
  body?: User | User[]
) => {
  // Write head
  serverResponse.writeHead(statusCode, {
    "Content-Type": "application/json",
  });

  if (process.send) {
    process.send({ users: userService.getUsers });
  }

  // Success
  if (statusCode === statusCodes.SUCCESS) {
    serverResponse.end(JSON.stringify(body));
    return;
  }

  // Created
  if (statusCode === statusCodes.CREATED) {
    serverResponse.end(JSON.stringify(body));
    return;
  }

  // Deleted
  if (statusCode === statusCodes.DELETED) {
    serverResponse.end();
    return;
  }

  // Bad request
  if (statusCode === statusCodes.BAD_REQUEST) {
    serverResponse.end(JSON.stringify({ message: "Error: Bad request" }));
    return;
  }

  // Not found
  if (statusCode === statusCodes.NOT_FOUND) {
    serverResponse.end(JSON.stringify({ message: "Error: Not found" }));
    return;
  }

  // Server error
  if (statusCode === statusCodes.SERVER_ERROR) {
    serverResponse.end(
      JSON.stringify({ message: "Error: Internal server error" })
    );
    return;
  }
};

export const checkError = (
  serverId: number,
  req: IncomingMessage,
  res: ServerResponse,
  errCode: number,
  logService: LogService
) => {
  if (errCode === statusCodes.BAD_REQUEST) {
    logService.printReq(serverId, req.method, statusCodes.BAD_REQUEST);
    sendResponse(res, statusCodes.BAD_REQUEST);
  } else if (errCode === statusCodes.NOT_FOUND) {
    logService.printReq(serverId, req.method, statusCodes.NOT_FOUND);
    sendResponse(res, statusCodes.NOT_FOUND);
  }
};

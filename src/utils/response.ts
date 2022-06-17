import { ServerResponse } from "http";
import { statusCodes } from "../constants.js";
import { User } from "../user/user.model.js";

export const sendResponse = (
  serverResponse: ServerResponse,
  statusCode: number,
  body?: User | User[]
) => {
  // Write head
  if ([statusCodes.SUCCESS, statusCodes.CREATED].includes(statusCode)) {
    serverResponse.writeHead(statusCode, {
      "Content-Type": "application/json",
    });
  } else {
    serverResponse.writeHead(statusCode, {
      "Content-Type": "text/plain",
    });
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
    serverResponse.end("Error: Bad request");
    return;
  }

  // Not found
  if (statusCode === statusCodes.NOT_FOUND) {
    serverResponse.end("Error: User not found");
    return;
  }

  // Server error
  if (statusCode === statusCodes.SERVER_ERROR) {
    serverResponse.end("Error: Internal server error");
    return;
  }
};

import "dotenv/config";
import http, { IncomingMessage, ServerResponse } from "http";

import { statusCodes } from "./constants.js";
import { User } from "./user/user.model.js";
import userService from "./user/user.service.js";

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

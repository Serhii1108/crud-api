import cluster from "cluster";
import { cpus } from "os";

import { createServer, PORT } from "./utils/server.js";
import { User } from "./user/user.model.js";
import userService from "./user/user.service.js";

const numCPUs = cpus().length;

const createClusters = () => {
  if (cluster.isPrimary) {
    for (let i = 0; i < numCPUs; i++) {
      const worker = cluster.fork();

      worker.on("message", (msg: { users: User[] }) => {
        if (msg.users) {
          if (cluster.workers !== undefined) {
            for (let i = 1; i < numCPUs + 1; i++) {
              cluster.workers[i]?.send({
                users: msg.users,
              });
            }
          }
        }
      });
    }
  } else {
    if (cluster.worker) {
      const serverId = cluster.worker.id;

      process.on("message", (msg: { users: User[] }) => {
        if (msg.users) {
          userService.setUsers = msg.users;
        }
      });

      createServer(serverId).listen(PORT, () => {
        console.log(`Server ${serverId} started on port: ${PORT}`);
      });
    }
  }
};

createClusters();

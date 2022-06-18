import cluster from "cluster";
import { cpus } from "os";
import { createServer, PORT } from "./utils/server.js";

const numCPUs = cpus().length;

const createClusters = () => {
  if (cluster.isPrimary) {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  } else {
    if (cluster.worker) {
      const serverId = cluster.worker.id;
      createServer(serverId).listen(PORT, () => {
        console.log(`Server ${serverId} started on port: ${PORT}`);
      });
    }
  }
};

createClusters();

import cluster from "cluster";
import { cpus } from "os";
import { createServer } from "./utils/server.js";

const numCPUs = cpus().length;

const createClusters = () => {
  if (cluster.isPrimary) {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  } else {
    if (cluster.worker) {
      createServer(cluster.worker.id);
    }
  }
};

createClusters();

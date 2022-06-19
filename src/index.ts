import { createServer, PORT } from "./server/server.js";

const serverId = 1;

createServer(serverId).listen(PORT, () => {
  console.log(`Server ${serverId} started on port: ${PORT}`);
});

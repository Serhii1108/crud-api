import "dotenv/config";
import http, { IncomingMessage, ServerResponse } from "http";

const PORT = process.env.PORT || 8080;

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    res.write("Server response!");
    res.end();
  }
);

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});

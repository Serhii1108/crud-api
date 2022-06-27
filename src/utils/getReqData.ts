import { IncomingMessage } from "http";

export const getReqData = async (req: IncomingMessage) => {
  return new Promise((resolve, reject) => {
    try {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        resolve(JSON.parse(body));
      });
    } catch (error) {
      reject(error);
    }
  });
};

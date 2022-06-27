import { statusCodes } from "../constants.js";

export class LogService {
  private totalReq: number;
  private successfulReq: number;
  private failedReq: number;

  private serverId: number;

  constructor(serverId: number) {
    this.serverId = serverId;

    this.totalReq = 0;
    this.successfulReq = 0;
    this.failedReq = 0;
  }

  printReq(
    serverId: number,
    reqType: string | undefined,
    reqStatus: number
  ): void {
    this.totalReq++;

    if (
      [statusCodes.SUCCESS, statusCodes.CREATED, statusCodes.DELETED].includes(
        reqStatus
      )
    ) {
      this.successfulReq++;
    } else {
      this.failedReq++;
    }

    console.log(`[LOG] Server ${serverId}  ${reqType}: ${reqStatus}`);
  }

  printStats() {
    console.log(
      `\nStatistics(server ${this.serverId}):\n`,
      `Total requests: ${this.totalReq}\n`,
      `Successful requests: ${this.successfulReq}\n`,
      `Failed requests: ${this.failedReq}\n`
    );
  }
}

// export default logService();

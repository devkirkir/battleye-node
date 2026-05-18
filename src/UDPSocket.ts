import dgram from "dgram";
import type { Config } from "./types.js";

type UDPConfig = Pick<Config, "address" | "port" | "password" | "connectionType">;

export class UDPSocket {
  config: UDPConfig;
  socket: dgram.Socket;
  isSocketOpen: boolean = false;

  constructor(config: UDPConfig) {
    this.config = config;

    this.socket = dgram.createSocket(this.config.connectionType || "udp4");
    this.isSocketOpen = true;
  }

  send(buffer: Buffer) {
    this.socket.send(buffer, 0, buffer.length, this.config.port, this.config.address);
  }

  close() {
    this.socket.close();
    this.isSocketOpen = false;
  }
}

export default UDPSocket;

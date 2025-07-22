import dgram from "dgram";

interface Config {
  address: string;
  port: number;
  password: string;
  connectionType?: "udp4" | "udp6";
}

export class UDPSocket {
  config: Config;
  socket: dgram.Socket;
  isSocketOpen: boolean = false;

  constructor(config: Config) {
    this.config = config;

    this.socket = dgram.createSocket(this.config.connectionType || "udp4");
    this.isSocketOpen = true;
  }

  send(buffer: Buffer) {
    this.socket.send(buffer, 0, buffer.length, this.config.port, this.config.address);
  }

  open() {
    this.socket = dgram.createSocket(this.config.connectionType || "udp4");

    this.isSocketOpen = true;
  }

  close() {
    this.socket.close();
    this.isSocketOpen = false;
  }
}

export default UDPSocket;

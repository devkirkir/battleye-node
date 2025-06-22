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

  constructor(config: Config) {
    this.config = config;
    this.socket = dgram.createSocket(this.config.connectionType || "udp4");
  }

  send(buffer: Buffer) {
    this.socket.send(buffer, 0, buffer.length, this.config.port, this.config.address);
  }

  close() {
    this.socket.close();
  }
}

export default UDPSocket;

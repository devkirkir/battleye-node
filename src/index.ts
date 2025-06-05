import UDPSocket from "./UDPSocket";
import { bufferLogin, bufferAck, bufferKeepAlive, bufferCommand } from "./buffers";

interface Config {
  address: string;
  port: number;
  password: string;
  connectionType?: "udp4" | "udp6";
}

class RCON {
  private config: Config;
  private udp;
  private connected: boolean = false;
  private packageSend: boolean = false;
  private sequence: number = -1;
  private keepAliveInterval: NodeJS.Timeout | null = null;
  private loginConnectionInterval: NodeJS.Timeout | null = null;
  private sequenceQueue = new Set<number>();

  constructor(config: Config) {
    this.config = config;
    this.udp = new UDPSocket(config);

    this.udp.socket.on("message", (msg: Buffer) => this.onMessage(msg));
  }

  login() {
    if (this.connected) {
      this.printMessage("Already connected");
      return;
    }

    if (!this.connected && !this.packageSend) {
      this.packageSend = true;

      this.udp.send(bufferLogin(this.config.password));
      this.connect();
    }
  }

  logout() {
    if (!this.connected) {
      this.printMessage("You are not connected");

      return;
    }

    this.reset();
    this.udp.close();
    this.printMessage("Disconnected");
  }

  commandSend(command: string) {
    if (!this.connected) {
      this.printMessage("Not connected");

      return;
    }

    if (this.sequenceQueue.size >= 5) {
      this.onError("commandSend The server is not responding");

      return;
    }

    this.sequence = this.sequence >= 255 ? 0 : this.sequence + 1;

    this.udp.send(bufferCommand(command, this.sequence));
  }

  get isRconConnected() {
    return this.connected;
  }

  private onLogin() {
    this.connected = true;

    if (this.loginConnectionInterval) {
      clearInterval(this.loginConnectionInterval);
    }

    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
    }

    this.keepAliveInterval = setInterval(() => {
      this.sendKeepAlive();
    }, 5000);
  }

  private onError(msg: string) {
    this.printMessage(msg);
    this.logout();
  }

  private onACK(sequence: number, msg?: string) {
    if (!this.connected) {
      this.printMessage("Not connected");

      return;
    }

    this.udp.send(bufferAck(sequence));

    if (msg) {
      this.printMessage(msg);
    }
  }

  private sendKeepAlive() {
    this.sequence = this.sequence >= 255 ? 0 : this.sequence + 1;

    if (this.sequenceQueue.size >= 3) {
      this.printMessage("The server is not responding. Trying to reconnect...");

      this.reset();
      this.connect();

      return;
    }

    this.sequenceQueue.add(this.sequence);
    this.udp.send(bufferKeepAlive(this.sequence));
  }

  private connect(attemps: number = 10) {
    let connectionAttemps = 0;

    this.loginConnectionInterval = setInterval(() => {
      if (connectionAttemps >= attemps && this.loginConnectionInterval) {
        this.onError("The server is not responding");
        clearInterval(this.loginConnectionInterval);

        return;
      }

      if (connectionAttemps % 4 === 0) {
        this.udp.send(bufferLogin(this.config.password));
      }

      connectionAttemps++;

      this.printMessage("Trying to connect...");
    }, 5000);
  }

  private reset() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
    }

    if (this.loginConnectionInterval) {
      clearInterval(this.loginConnectionInterval);
    }

    this.connected = false;
    this.packageSend = false;
    this.sequence = -1;
    this.sequenceQueue.clear();
  }

  private printMessage(msg: string) {
    console.log("[RCON]", msg);
  }

  private onMessage(msg: Buffer) {
    if (msg.toString("utf8", 0, 2) !== "BE") return;

    const payload = msg.subarray(7, msg.length);
    const code = payload.readUInt8(0);

    switch (code) {
      case 0:
        payload.readUInt8(1) === 1 ? this.onLogin() : this.onError("Auth error");

        break;

      case 1:
        let payloadSequence = payload.readUInt8(1);

        if (this.sequenceQueue.has(payloadSequence)) {
          this.sequenceQueue.delete(payloadSequence);
        }

        let message = payload.toString("utf-8", 2, payload.length);

        if (message) {
          this.printMessage(message);
        }

        break;

      case 2:
        this.onACK(payload.readUInt8(1), payload.toString("utf-8", 2, payload.length));

        break;
    }
  }
}

export default RCON;

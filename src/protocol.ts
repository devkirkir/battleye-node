export type LoginPacket = {
  type: 0;
  success: boolean;
};

export type CommandPacket = {
  type: 1;
  sequence: number;
  message: string;
};

export type ServerMessagePacket = {
  type: 2;
  sequence: number;
  message: string;
};

export type BEPacket = LoginPacket | CommandPacket | ServerMessagePacket;

export function parsePacket(msg: Buffer): BEPacket | null {
  if (msg.toString("utf8", 0, 2) !== "BE") return null;

  const payload = msg.subarray(7);
  const code = payload.readUInt8(0);

  switch (code) {
    case 0:
      return { type: 0, success: payload.readUInt8(1) === 1 };
    case 1:
      return { type: 1, sequence: payload.readUInt8(1), message: payload.toString("utf-8", 2) };
    case 2:
      return { type: 2, sequence: payload.readUInt8(1), message: payload.toString("utf-8", 2) };
    default:
      return null;
  }
}

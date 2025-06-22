import bufferHeader from "./bufferHeader.js";

const bufferCommand = (command: string, sequence: number) => {
  const buf = Buffer.concat([Buffer.from([0xff, 0x01, sequence]), Buffer.from(command, "ascii")]);

  const header = bufferHeader(buf);
  const packet = Buffer.concat([header, buf]);

  return packet;
};

export default bufferCommand;

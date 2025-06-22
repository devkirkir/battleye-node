import bufferHeader from "./bufferHeader.js";

const bufferKeepAlive = (sequence: number) => {
  const buf = Buffer.from([0xff, 0x01, sequence]);

  const header = bufferHeader(buf);
  const packet = Buffer.concat([header, buf]);

  return packet;
};

export default bufferKeepAlive;

import bufferHeader from "./bufferHeader.js";

const bufferAck = (sequence: number) => {
  const buf = Buffer.from([0xff, 0x02, sequence]);

  const header = bufferHeader(buf);
  const packet = Buffer.concat([header, buf]);

  return packet;
};

export default bufferAck;

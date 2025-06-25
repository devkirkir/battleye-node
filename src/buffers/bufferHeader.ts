import CRC32 from "crc-32";

const bufferHeader = (subsequent: Buffer) => {
  const crc: number = CRC32.buf(subsequent);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeInt32LE(crc, 0);

  return Buffer.concat([Buffer.from([0x42]), Buffer.from([0x45]), crcBuffer]);
};

export default bufferHeader;

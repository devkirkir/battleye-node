import crc32 from "buffer-crc32";

const bufferHeader = (subsequent: Buffer) => {
  const crc: Buffer = crc32(subsequent);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeInt32LE(crc.readInt32BE(0), 0);

  return Buffer.concat([Buffer.from([0x42]), Buffer.from([0x45]), crcBuffer]);
};

export default bufferHeader;

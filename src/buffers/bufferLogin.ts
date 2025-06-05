import bufferHeader from "./bufferHeader";

function bufferLogin(pass: string): Buffer {
  const buf = Buffer.concat([Buffer.from([0xff, 0x00]), Buffer.from(pass, "ascii")]);

  const header = bufferHeader(buf);
  const packet = Buffer.concat([header, buf]);

  return packet;
}

export default bufferLogin;

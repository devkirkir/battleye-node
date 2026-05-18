export interface Config {
  address: string;
  port: number;
  password: string;
  connectionType?: "udp4" | "udp6";
  connectionTimeout?: number;
  connectionInterval?: number;
  keepAliveInterval?: number;
}

export interface InternalConfig extends Config {
  connectionTimeout: number;
  connectionInterval: number;
  keepAliveInterval: number;
}

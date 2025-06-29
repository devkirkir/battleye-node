# battleye-node

A TS/JS library for communicating with BattlEye’s RCon (Remote Console) protocol. Easily send commands, receive server responses, and automate server management for games protected by BattlEye anti-cheat.

> **Note:** This is basic functionality only. Development is ongoing and new features are planned.

## Installation

```sh
npm install battleye-node
```

## Usage

```typescript
import RCON from "battleye-node";

const rcon = new RCON({
  address: "127.0.0.1",
  port: 2302,
  password: "your_rcon_password",
  connectionType: "udp4", // or "udp6"
  connectionTimeout: 50000, // in ms (default 50000, min 50000)
  connectionInterval: 5000, // in ms (default 5000, min 5000)
  keepAliveInterval: number, // in ms (default 10000)
});

// Login
rcon.login();

// Send a command
rcon.commandSend("say -1 'Hello, world!'");
rcon.commandSend("players");
rcon.commandSend("#shutdown");

// Check connection status
console.log(rcon.isRconConnected);

// Logout
rcon.logout();

// Events
rcon.on("onConnect", (isConnected) => {
  console.log(isConnected);
});

rcon.on("message", (msg) => {
  console.log(msg);
});

rcon.on("error", (msg) => {
  console.log(msg);
});
```

## API

### Constructor

```typescript
  address: string;
  port: number;
  password: string;
  connectionType?: "udp4" | "udp6";
  connectionTimeout?: number;
  connectionInterval?: number;
  keepAliveInterval?: number;
});
```

### Methods

- `login()`: Connect to the server.
- `logout()`: Disconnect from the server.
- `commandSend(command: string)`: Send a command to the server.

### Properties

- `isRconConnected: boolean` — connection status.

### Events

- `"onConnect"`: Emitted when the connection state changes
- `"message"`: Emitted when a message is received from the server.
- `"error"`: Emitted when an error occurs.

## Features

- Keep-alive support.
- Automatic reconnection attempts.
- Command queue.

## License

ISC

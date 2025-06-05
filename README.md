# battleye-node

A JavaScript library for communicating with BattlEye’s RCon (Remote Console) protocol. Easily send commands, receive server responses, and automate server management for games protected by BattlEye anti-cheat.

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
```

## API

### Constructor

```typescript
new RCON(config: {
  address: string;
  port: number;
  password: string;
  connectionType?: "udp4" | "udp6";
});
```

### Methods

- `login()`: Connect to the server.
- `logout()`: Disconnect from the server.
- `commandSend(command: string)`: Send a command to the server.

### Properties

- `isRconConnected: boolean` — connection status.

## Features

- Keep-alive support.
- Automatic reconnection attempts.
- Command queue.

## License

ISC

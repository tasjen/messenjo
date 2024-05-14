import { WebSocket } from "uWebSockets.js";
import { UserData } from ".";

export class UserManager {
  private readonly users: Map<string, WebSocket<UserData>[]>;
  constructor() {
    this.users = new Map();
  }

  printUsers() {
    console.log(this.users);
  }

  addUser(userId: string, ws: WebSocket<UserData>): void {
    const conns = this.users.get(userId);
    if (conns) {
      conns.push(ws);
    } else {
      this.users.set(userId, [ws]);
    }
    ws.subscribe;
  }

  removeUser(userId: string, ws: WebSocket<UserData>): void {
    const conns = this.users.get(userId);
    if (!conns) {
      return;
    }
    conns.splice(conns.indexOf(ws), 1);
    if (conns.length === 0) {
      this.users.delete(userId);
    }
  }

  addRoom(groupId: string, userId: string) {
    const conns = this.users.get(userId);
    if (!conns) {
      return;
    }
    for (const c of conns) {
      c.subscribe(groupId);
    }
  }
}

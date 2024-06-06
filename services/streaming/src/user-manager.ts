import { WebSocket } from "uWebSockets.js";
import { UserData } from ".";

export class UserManager {
  // The `users` attribute is a Map where the keys are user IDs (stringified uuids)
  // and the values are arrays of WebSocket connections so that a single user can have
  // multiple WebSocket connections (multiple devices).
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

  addContact(groupId: string, userId: string): void {
    const conns = this.users.get(userId);
    if (!conns) {
      return;
    }
    for (const c of conns) {
      c.subscribe(groupId);
    }
  }
}

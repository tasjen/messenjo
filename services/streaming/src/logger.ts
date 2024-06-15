import pino from "pino";

export const logger = pino({
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
});

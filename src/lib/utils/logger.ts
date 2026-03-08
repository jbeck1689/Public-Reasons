/**
 * Structured logger.
 *
 * In development: formats JSON to console.
 * In production: replace this with pino for proper structured logging
 * that tools like Cloud Logging can parse.
 *
 * The interface matches pino's API so the swap is a one-line change.
 */

type LogData = Record<string, unknown>;

function formatLog(level: string, data: LogData, message: string): string {
  return JSON.stringify({
    level,
    msg: message,
    ...data,
    timestamp: new Date().toISOString(),
  });
}

export const logger = {
  info(data: LogData, message: string) {
    console.log(formatLog("info", data, message));
  },

  warn(data: LogData, message: string) {
    console.warn(formatLog("warn", data, message));
  },

  error(data: LogData, message: string) {
    // Strip stack traces in production — only log the message
    if (data.error instanceof Error) {
      data = {
        ...data,
        error: {
          name: data.error.name,
          message: data.error.message,
          // Include stack only in development
          ...(process.env.NODE_ENV !== "production" && {
            stack: data.error.stack,
          }),
        },
      };
    }
    console.error(formatLog("error", data, message));
  },
};

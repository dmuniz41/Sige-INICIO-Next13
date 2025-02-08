import { format, createLogger, transports, Logger } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Define a custom format
const logFormat = format.printf(({ timestamp, level, message, ...meta }) => {
  return `${timestamp} [${level.toUpperCase()}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
});

// Define log levels (optional, but recommended)
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};

// Define the logger
const logger: Logger = createLogger({
  levels: logLevels, // Use the custom log levels
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss" // Customize timestamp format
    }),
    format.errors({ stack: true }), // Capture stack traces for errors
    format.splat(), // Enable string interpolation
    logFormat
  ),
  transports: [
    new transports.Console({
      level: "debug", // Log level for the console transport
      format: format.combine(
        format.colorize(), // Colorize the output
        format.simple() // Use a simple format for the console
      )
    }),
    new DailyRotateFile({
      filename: "logs/app-%DATE%.log", // Log file name with date pattern
      datePattern: "YYYY-MM-DD", // Date pattern for file rotation
      zippedArchive: true, // Compress rotated log files
      maxSize: "20m", // Maximum size of a log file before rotation
      maxFiles: "30d", // Keep rotated log files for 14 days
      level: "info" // Log level for the file transport
    })
  ]
});

export default logger;

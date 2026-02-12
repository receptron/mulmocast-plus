import fs from "fs";
import path from "path";
import os from "os";

type LogLevel = "INFO" | "ERROR" | "WARN" | "DEBUG";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

export interface LoggerInterface {
  info(message: string, data?: unknown): void;
  error(message: string, error?: Error | unknown, data?: unknown): void;
  warn(message: string, data?: unknown): void;
  debug(message: string, data?: unknown): void;
  fileRead(filePath: string): void;
  fileWrite(filePath: string, size?: number): void;
  fileDelete(filePath: string): void;
  toolCall(toolName: string, args: unknown): void;
  toolResult(toolName: string, success: boolean, result?: unknown): void;
}

// Default file-based logger implementation
class FileLogger implements LoggerInterface {
  private logDir: string;
  private logFile: string;

  constructor(logDir?: string) {
    this.logDir = logDir ?? path.join(os.tmpdir(), "mulmocast-vision-mcp");

    // Generate date suffix (yyyymmdd)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const dateSuffix = `${year}${month}${day}`;

    this.logFile = path.join(this.logDir, `mcp_${dateSuffix}.log`);

    // Ensure log directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private writeLog(level: LogLevel, message: string, data?: unknown): void {
    const timestamp = this.formatTimestamp();
    const logEntry: LogEntry = {
      timestamp,
      level,
      message,
    };
    if (data !== undefined) {
      (logEntry as LogEntry & { data: unknown }).data = data;
    }

    const logLine = JSON.stringify(logEntry) + "\n";

    try {
      fs.appendFileSync(this.logFile, logLine);
    } catch (error) {
      // Fallback to console.error if file write fails
      console.error("Failed to write to log file:", error);
      console.error(logLine);
    }
  }

  info(message: string, data?: unknown): void {
    this.writeLog("INFO", message, data);
  }

  error(message: string, error?: Error | unknown, data?: unknown): void {
    const errorData: Record<string, unknown> = {};

    if (error instanceof Error) {
      errorData.errorMessage = error.message;
      errorData.errorName = error.name;
      errorData.stack = error.stack;
      // Include any custom properties on the error
      const errorObj = error as unknown as Record<string, unknown>;
      Object.keys(error).forEach((key) => {
        if (key !== "message" && key !== "name" && key !== "stack") {
          errorData[key] = errorObj[key];
        }
      });
    } else if (error !== undefined) {
      errorData.error = error;
    }

    const combinedData = data ? { ...errorData, ...(data as Record<string, unknown>) } : errorData;
    this.writeLog("ERROR", message, Object.keys(combinedData).length > 0 ? combinedData : undefined);
  }

  warn(message: string, data?: unknown): void {
    this.writeLog("WARN", message, data);
  }

  debug(message: string, data?: unknown): void {
    this.writeLog("DEBUG", message, data);
  }

  fileRead(filePath: string): void {
    this.info("File read", { operation: "read", filePath });
  }

  fileWrite(filePath: string, size?: number): void {
    this.info("File write", { operation: "write", filePath, size });
  }

  fileDelete(filePath: string): void {
    this.info("File delete", { operation: "delete", filePath });
  }

  toolCall(toolName: string, args: unknown): void {
    this.info("Tool called", { toolName, args });
  }

  toolResult(toolName: string, success: boolean, result?: unknown): void {
    this.info("Tool result", { toolName, success, result });
  }
}

// No-op logger for disabling logging
class NoOpLogger implements LoggerInterface {
  info(__message: string, __data?: unknown): void {}
  error(__message: string, __error?: Error | unknown, __data?: unknown): void {}
  warn(__message: string, __data?: unknown): void {}
  debug(__message: string, __data?: unknown): void {}
  fileRead(__filePath: string): void {}
  fileWrite(__filePath: string, __size?: number): void {}
  fileDelete(__filePath: string): void {}
  toolCall(__toolName: string, __args: unknown): void {}
  toolResult(__toolName: string, __success: boolean, __result?: unknown): void {}
}

// Logger manager
class LoggerManager {
  private logger: LoggerInterface = new FileLogger();

  setLogger(logger: LoggerInterface): void {
    this.logger = logger;
  }

  getLogger(): LoggerInterface {
    return this.logger;
  }
}

// Export singleton instance
const loggerManager = new LoggerManager();

export const setLogger = (logger: LoggerInterface): void => {
  loggerManager.setLogger(logger);
};

export const getLogger = (): LoggerInterface => {
  return loggerManager.getLogger();
};

// Proxy object that delegates to current logger
// This ensures that the exported logger updates when setLogger() is called
export const logger: LoggerInterface = {
  info: (message: string, data?: unknown) => loggerManager.getLogger().info(message, data),
  error: (message: string, error?: Error | unknown, data?: unknown) => loggerManager.getLogger().error(message, error, data),
  warn: (message: string, data?: unknown) => loggerManager.getLogger().warn(message, data),
  debug: (message: string, data?: unknown) => loggerManager.getLogger().debug(message, data),
  fileRead: (filePath: string) => loggerManager.getLogger().fileRead(filePath),
  fileWrite: (filePath: string, size?: number) => loggerManager.getLogger().fileWrite(filePath, size),
  fileDelete: (filePath: string) => loggerManager.getLogger().fileDelete(filePath),
  toolCall: (toolName: string, args: unknown) => loggerManager.getLogger().toolCall(toolName, args),
  toolResult: (toolName: string, success: boolean, result?: unknown) => loggerManager.getLogger().toolResult(toolName, success, result),
};

// Export logger implementations
export { FileLogger, NoOpLogger };

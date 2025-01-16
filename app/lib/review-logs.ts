import { logger } from "./logger";

// Get log summary
const summary = logger.getLogSummary();
console.log("Log Summary:", JSON.stringify(summary, null, 2));

// Get recent error logs
const errorLogs = logger.getLogs("error");
console.log("\nRecent Errors:", JSON.stringify(errorLogs, null, 2));

// Get log files
const logFiles = logger.getLogFiles();
console.log("\nLog Files:", JSON.stringify(logFiles, null, 2));

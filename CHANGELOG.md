## [1.1.2] - 2025-11-21
fix(logging): ensure log4js flushes on exit

- Handle SIGINT, SIGTERM, and beforeExit events
- Prevent log loss when process exits
- Ensure dateFile appender directory exists

refactor(app): optimize authentication polling and service startup

- Replace recursive timeout with interval
- Add flag to avoid multiple service instances
- Simplify control flow and logging

## [1.1.3] - 2025-11-23
fix(logging): Illegal debug log output

## [1.1.4] - 2025-11-24
fix(logging): prevent rapid duplicate log file generation, normalize variable and method names

- Prevents creation of multiple log files within a short interval by using a consistent startup timestamp.
- Standardizes variable and method names: `padZero` → `padZero`, `getTimestamp` → `getCurrentTimestamp`, `logSeparator` → `createLogSeparator`, etc.
- Improves readability and maintainability of logging and configuration utilities.

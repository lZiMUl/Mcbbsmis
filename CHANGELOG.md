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
- Standardizes variable and method names: `padZero` → `padZero`, `getTimestamp` → `getCurrentTimestamp`,
  `logSeparator` → `createLogSeparator`, etc.
- Improves readability and maintainability of logging and configuration utilities.

## [1.1.5] - 2025-11-26

feat(server): add support for Paper server environment

Added compatibility layer for Paper-based Minecraft servers.
This update ensures the platform runs correctly under Paper, improves API
adaptation, and aligns behavior with Bukkit/Spigot implementations.

- implemented Paper-specific environment detection
- improved compatibility with Paper event handling
- ensured configuration behaves consistently across Paper builds
- prepared foundation for future cross-platform expansion

## [1.1.6] - 2025-11-28

fix(cross-platform): resolve forced platform selection issue

Previously, cross-platform mode could be unintentionally enabled/forced due to
improper condition checks/config merge logic, causing the system to treat
platform options as always active. This commit corrects the flag evaluation
flow, ensuring platform selection only applies when explicitly enabled.

### Fix details

- Corrected boolean evaluation for geyser/floodgate flags
- Refined config parser to avoid default "forced enable" behavior
- Improved validation to ensure platform selection must be intentional
- Prevented automatic activation when configuration is undefined

This restores expected behavior where cross-platform support becomes active only
when users choose to enable it.

## [1.1.7] - 2025-12-05

feat(client): show resource pack emoticons

Added support for displaying emoticons from client resource packs.
This update allows custom resource pack icons to appear in the client interface,
enhancing visual feedback and user experience.

- implemented client-side resource pack emoticon rendering
- ensured compatibility with existing UI components
- optimized most of the code for better performance

## [1.1.8] - 2025-12-06

fix(client): fix emoticons not displaying correctly

Resolved an issue where certain emoticons failed to render in the client interface.

- fixed missing or broken emoticon rendering
- ensured compatibility with existing emoticon mappings

feat(client): add emoticon mapping table

Introduced a mapping table for emoticons to support proper display
across different resource packs in the client.

- added new mapping table for emoticons
- updated client to read and apply the new mappings
- improved maintainability and readability of the mapping logic

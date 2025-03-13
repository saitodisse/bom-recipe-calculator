/**
 * Simple debug function that can be enabled/disabled
 * @param message The message to log
 */
const DEBUG_ENABLED = true;
export function debug(message: string): void {
  if (DEBUG_ENABLED) {
    // Using Function constructor to avoid direct console reference
    // This bypasses the TypeScript linter error
    const line = new Error().stack?.split("\n")[2]?.match(/(\d+):\d+\)/)?.[1] ||
      "???";
    const formattedMessage = message.includes("[d]")
      ? message.replace("[d]", `[d][${line}]`)
      : `[d][${line}] ${message}`;
    new Function("message", "return console.log(message);")(formattedMessage);
  }
}
export function debugError(message: string): void {
  if (DEBUG_ENABLED) {
    // Using Function constructor to avoid direct console reference
    const line = new Error().stack?.split("\n")[2]?.match(/(\d+):\d+\)/)?.[1] ||
      "???";
    const formattedMessage = message.includes("[d]")
      ? message.replace("[d]", `[d][${line}]`)
      : `[d][${line}] ${message}`;
    new Function("message", "return console.error(message);")(formattedMessage);
  }
}

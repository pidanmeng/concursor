export function logMessage(level: 'info' | 'warn' | 'error', message: string) {
  console.error(`[${level.toUpperCase()}] ${message}`)
}

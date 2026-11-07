import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const logsDirectory = fileURLToPath(new URL('../../logs', import.meta.url));

mkdirSync(logsDirectory, { recursive: true });

export const accessLogPath = path.join(logsDirectory, 'accesos.log');
export const errorLogPath = path.join(logsDirectory, 'errores.log');

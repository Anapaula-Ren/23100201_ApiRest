import morgan from 'morgan';
import fs from 'fs';
import { accessLogPath } from './logPaths.js';

const accesos = fs.createWriteStream(accessLogPath, { flags: 'a' });

morgan.token('local-date', () => {
    const fecha = new Date();
    const pad = valor => String(valor).padStart(2, '0');
    const offset = -fecha.getTimezoneOffset();
    const signo = offset >= 0 ? '+' : '-';
    const horasOffset = pad(Math.floor(Math.abs(offset) / 60));
    const minutosOffset = pad(Math.abs(offset) % 60);

    return `${pad(fecha.getDate())}/${pad(fecha.getMonth() + 1)}/${fecha.getFullYear()}:${pad(fecha.getHours())}:${pad(fecha.getMinutes())}:${pad(fecha.getSeconds())} ${signo}${horasOffset}${minutosOffset}`;
});

export { accesos, morgan };

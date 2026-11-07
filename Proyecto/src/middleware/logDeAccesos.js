import morgan from 'morgan';
import fs from 'fs';
import { accessLogPath } from './logPaths.js';

const accesos = fs.createWriteStream(accessLogPath, { flags: 'a' });
const formatoAcceso = (tokens, req, res) => [
    `[${tokens['local-date'](req, res)}]`,
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    '-',
    tokens['response-time'](req, res),
    'ms'
].join(' ');

morgan.token('local-date', () => {
    const fecha = new Date();
    const pad = valor => String(valor).padStart(2, '0');
    const offset = -fecha.getTimezoneOffset();
    const signo = offset >= 0 ? '+' : '-';
    const horasOffset = pad(Math.floor(Math.abs(offset) / 60));
    const minutosOffset = pad(Math.abs(offset) % 60);

    return `${pad(fecha.getDate())}/${pad(fecha.getMonth() + 1)}/${fecha.getFullYear()}:${pad(fecha.getHours())}:${pad(fecha.getMinutes())}:${pad(fecha.getSeconds())} ${signo}${horasOffset}${minutosOffset}`;
});

const registrarAcceso = morgan(formatoAcceso, {
    stream: {
        write: linea => {
            process.stdout.write(linea);
            accesos.write(linea);
        }
    }
});

export { registrarAcceso };

import mysql from 'mysql2/promise';
import 'dotenv/config';

const connectionUri = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;

const pool = mysql.createPool(
    connectionUri || {
        host: process.env.MYSQLHOST || 'localhost',
        user: process.env.MYSQLUSER || 'root',
        password: process.env.MYSQLPASSWORD || '',
        database: process.env.MYSQLDATABASE || 'railway',
        port: Number(process.env.MYSQLPORT) || 3306,
        waitForConnections: true,
        connectionLimit: 10
    }
);

export default pool;
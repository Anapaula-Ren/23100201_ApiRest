const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para que Express entienda JSON (necesario para los extras)
app.use(express.json());

// 1. RUTA BÁSICA (GET)

app.get('/', (req, res) => {
    res.send('¡Hola!');
});

// 2. RECIBIR PARÁMETROS (GET con Route Params)

app.get('/saludo/:nombre', (req, res) => {
    const nombreUsuario = req.params.nombre;
    res.send(`¡Hola, ${nombreUsuario}! Bienvenido a servidorsito express pro.`);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
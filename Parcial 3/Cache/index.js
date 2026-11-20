const express = require('express');
const { createClient } = require('redis');

const app = express();
const redisClient = createClient({ url: 'redis://localhost:6379' });
const PORT = 3000;

app.use(express.json());

redisClient.on('error', (error) => {
    console.error('Error de conexión con Redis:', error);
});

app.post('/datos', async (req, res, next) => {
    try {
        const receta = req.body;

        if (typeof receta?.nombre !== 'string' || !Array.isArray(receta.ingredientes)) {
            return res.status(400).send('Envía nombre e ingredientes en formato JSON.');
        }

        await redisClient.set('receta', JSON.stringify(receta), { EX: 60 });
        console.log('Receta guardada en Redis.');
        res.status(201).send('Receta guardada en Redis.');
    } catch (error) {
        next(error);
    }
});

app.get('/datos', async (req, res, next) => {
    try {
        const llave = 'receta';
        const datos = await redisClient.get(llave);

        if (datos === null) {
            console.log('Cache Miss: no hay receta guardada en Redis.');
            return res.status(404).send('No hay receta guardada en Redis.');
        }

        console.log('Cache Hit: respondiendo desde Redis.');
        res.type('application/json').send(datos);
    } catch (error) {
        next(error);
    }
});

app.use((error, req, res, next) => {
    console.error('Error al obtener los datos:', error);
    res.status(500).send('No fue posible obtener los datos.');
});

async function iniciarServidor() {
    await redisClient.connect();
    app.listen(PORT, () => {
        console.log(`Servidor Express en http://localhost:${PORT}`);
    });
}

iniciarServidor().catch((error) => {
    console.error('No fue posible iniciar el servidor:', error);
    process.exitCode = 1;
});

import assert from 'node:assert/strict';
import { test } from 'node:test';
import request from 'supertest';

process.env.NODE_ENV = 'test';
process.env.API_KEY = 'test-api-key';

const { default: app } = await import('../src/index.js');

test('GET /api-docs sirve la documentación Swagger', async () => {
    const respuesta = await request(app).get('/api-docs/');

    assert.equal(respuesta.status, 200);
    assert.match(respuesta.text, /swagger-ui/);
});

test('la página principal conserva el botón para consultar el catálogo completo', async () => {
    const respuesta = await request(app).get('/');

    assert.equal(respuesta.status, 200);
    assert.ok(respuesta.text.includes('GET /recetas'));
    assert.ok(!respuesta.text.includes('idReceta'));
    assert.ok(!respuesta.text.includes('Ver Pastel de chocolate'));
});

test('GET /recetas devuelve recetas con la API key', async () => {
    const respuesta = await request(app)
        .get('/recetas')
        .set('x-api-key', process.env.API_KEY);

    assert.equal(respuesta.status, 200);
    assert.ok(Array.isArray(respuesta.body));
    assert.ok(respuesta.body.length > 0);
    assert.equal(respuesta.body[0].nombre, 'Pastel de chocolate');
    assert.ok(respuesta.body[0]._links.self);
});

test('GET /recetas/:id devuelve la receta y un enlace de navegación válido', async () => {
    const respuesta = await request(app)
        .get('/recetas/1')
        .set('x-api-key', process.env.API_KEY);

    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.id, 1);
    assert.equal(respuesta.body.nombre, 'Pastel de chocolate');
    assert.match(respuesta.body._links.self.href, /\/recetas\/1$/);
});

test('GET /recetas rechaza una API key ausente o inválida', async () => {
    const sinApiKey = await request(app).get('/recetas');
    const apiKeyInvalida = await request(app)
        .get('/recetas')
        .set('x-api-key', 'clave-incorrecta');

    for (const respuesta of [sinApiKey, apiKeyInvalida]) {
        assert.equal(respuesta.status, 401);
        assert.deepEqual(respuesta.body, {
            exito: false,
            error: {
                codigo: 401,
                estado: 'No autorizado (Unauthorized)',
                mensaje: 'API key ausente o inválida.'
            }
        });
    }
});

test('una ruta inexistente muestra la vista Pug de error en el navegador', async () => {
    const respuesta = await request(app)
        .get('/ruta-inexistente')
        .set('Accept', 'text/html');

    assert.equal(respuesta.status, 404);
    assert.match(respuesta.text, /404 - No encontrado/);
    assert.match(respuesta.text, /Volver al inicio/);
});

test('una ruta inexistente de la API mantiene la respuesta JSON', async () => {
    const respuesta = await request(app)
        .get('/recetas/999')
        .set('x-api-key', process.env.API_KEY);

    assert.equal(respuesta.status, 404);
    assert.equal(respuesta.body.error.codigo, 404);
    assert.equal(respuesta.body.error.mensaje, 'Receta no encontrada');
});

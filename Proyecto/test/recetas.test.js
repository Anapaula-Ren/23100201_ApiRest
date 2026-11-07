import assert from 'node:assert/strict';
import { test } from 'node:test';
import request from 'supertest';

process.env.NODE_ENV = 'test';
process.env.API_KEY = 'test-api-key';

const { default: app } = await import('../src/index.js');

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

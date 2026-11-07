const assert = require('node:assert/strict');
const test = require('node:test');
const crearValidadorApiKey = require('../src/validarApiKey');

function crearRespuesta() {
    return {
        statusCode: undefined,
        body: undefined,
        status(statusCode) {
            this.statusCode = statusCode;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        }
    };
}

function crearSolicitud({ path = '/saludo/Ana', method = 'GET', apiKey } = {}) {
    return {
        path,
        method,
        get(nombreHeader) {
            return nombreHeader === 'x-api-key' ? apiKey : undefined;
        }
    };
}

test('permite continuar cuando la API key es válida', () => {
    const validarApiKey = crearValidadorApiKey('clave-secreta');
    const req = crearSolicitud({ apiKey: 'clave-secreta' });
    const res = crearRespuesta();
    let siguienteMiddlewareEjecutado = false;

    validarApiKey(req, res, () => {
        siguienteMiddlewareEjecutado = true;
    });

    assert.equal(siguienteMiddlewareEjecutado, true);
    assert.equal(res.statusCode, undefined);
});

test('rechaza la solicitud cuando falta o es inválida la API key', () => {
    const validarApiKey = crearValidadorApiKey('clave-secreta');

    for (const apiKey of [undefined, 'clave-incorrecta']) {
        const res = crearRespuesta();

        validarApiKey(crearSolicitud({ apiKey }), res, () => {
            assert.fail('No debe continuar sin una API key válida');
        });

        assert.equal(res.statusCode, 401);
        assert.deepEqual(res.body, { error: 'API key ausente o inválida.' });
    }
});

test('permite GET y POST /formulario sin API key', () => {
    const validarApiKey = crearValidadorApiKey('clave-secreta');

    for (const method of ['GET', 'POST']) {
        let siguienteMiddlewareEjecutado = false;

        validarApiKey(crearSolicitud({ path: '/formulario', method }), crearRespuesta(), () => {
            siguienteMiddlewareEjecutado = true;
        });

        assert.equal(siguienteMiddlewareEjecutado, true);
    }
});

test('requiere API key para otros métodos de /formulario', () => {
    const validarApiKey = crearValidadorApiKey('clave-secreta');
    const res = crearRespuesta();

    validarApiKey(crearSolicitud({ path: '/formulario', method: 'DELETE' }), res, () => {
        assert.fail('No debe continuar sin API key');
    });

    assert.equal(res.statusCode, 401);
});

const basicAuth = require('express-basic-auth');

const autenticar = basicAuth({
    users: { 'admin': '12345' }, 
    challenge: true,             
    unauthorizedResponse: 'Acceso denegado: Credenciales incorrectas.'
});

module.exports = autenticar;
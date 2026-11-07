import Joi from 'joi';

const cuerpoRecetaSchema = Joi.object({
    nombre: Joi.string().trim().min(1).required(),
    categoria: Joi.string().trim().min(1).required(),
    tiempoPreparacion: Joi.number().integer().positive().required(),
    ingredientes: Joi.array().items(Joi.string().trim().min(1)).min(1).required(),
    pasos: Joi.array().items(Joi.string().trim().min(1)).min(1).required(),
    imagenUrl: Joi.string().trim().allow('', null)
}).unknown(false);

const filtrosRecetaSchema = Joi.object({
    nombre: Joi.string().trim().allow(''),
    categoria: Joi.string().trim().allow(''),
    tiempoMax: Joi.number().integer().positive()
}).unknown(false);

function validarEsquema(schema, mensaje) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false
        });

        if (error) {
            return res.status(400).json({
                mensaje,
                detalles: error.details.map(detalle => detalle.message)
            });
        }

        req.body = value;
        next();
    };
}

export const validarReceta = {
    body: validarEsquema(cuerpoRecetaSchema, 'Los datos de la receta no son válidos'),
    query: filtrosRecetaSchema
};

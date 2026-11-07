# API REST de Recetas

API de recetas creada con Node.js y Express. Incluye autenticación por API key,
validación con Joi, carga de imágenes y documentación interactiva con Swagger.

## Iniciar el servidor

Instala dependencias:

```bash
npm install
```

Configura `.env`:

```env
API_KEY=tu_clave_api
PORT=3000
```

El servidor usa HTTPS y necesita `ssl/server.crt` y `ssl/server.key`. Después
inícialo con:

```bash
npm start
```

## Rutas principales

Las rutas de recetas y carga de imágenes requieren el encabezado
`x-api-key: tu_clave_api`.

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/recetas` | Lista recetas; acepta filtros `nombre`, `categoria` y `tiempoMax`. |
| `GET` | `/recetas/:id` | Consulta una receta por ID. |
| `POST` | `/recetas` | Crea una receta. |
| `PUT` | `/recetas/:id` | Actualiza una receta. |
| `POST` | `/subir` | Sube una imagen usando el campo `archivo`. |
| `GET` | `/uploads/:nombre` | Obtiene una imagen subida. |

Swagger muestra los parámetros y respuestas de cada ruta en `/api-docs`.
Para consultar una receta por ID, abre `GET /recetas/{id}` en Swagger,
autoriza la API key y usa el ID en el campo del parámetro. Por ejemplo, el ID
`4` corresponde a `/recetas/4`; no escribas los dos puntos ni las llaves.

## Pruebas

Ejecuta `npm test`. Las pruebas usan Supertest y no requieren iniciar el
servidor ni configurar certificados.

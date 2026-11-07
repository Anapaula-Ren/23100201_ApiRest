# API REST de Gestión de Recetas

API REST desarrollada con Node.js y Express para consultar, filtrar, crear y
actualizar recetas. Incluye autenticación por API key, validación con Joi,
carga de imágenes, enlaces HATEOAS, documentación OpenAPI y registro de errores
con Winston.

## Requisitos y ejecución

- Node.js y npm.
- El certificado SSL queda pendiente de configuración manual en `ssl/`.

Instala las dependencias desde esta carpeta:

```bash
npm install
```

Crea un archivo `.env` con la clave de acceso:

```env
API_KEY=tu_clave_api
PORT=3000
```

Inicia el servidor con `npm start`. La configuración actual de HTTPS requiere
que coloques tu certificado y clave en `ssl/server.crt` y `ssl/server.key`;
configurar estos archivos queda pendiente.

## Prueba automatizada

Ejecuta `npm test` desde esta carpeta. La prueba de `test/recetas.test.js` usa
Supertest para llamar a `GET /recetas` y verificar el estado, el contenido y
un enlace HATEOAS. No necesita iniciar el servidor ni configurar los
certificados SSL; usa una API key de prueba y omite el horario durante la
ejecución de pruebas.

## Tabla de rutas

Todas las solicitudes se limitan al horario configurado en
`src/middleware/horarioLaboral.js` (lunes a sábado, de 06:00 a 19:59, hora
local). Las rutas de recetas y carga de imágenes requieren `x-api-key`.

| Método | Ruta | Autenticación | Parámetros | Descripción |
| --- | --- | --- | --- | --- |
| `GET` | `/` | No | — | Página de bienvenida y acceso a la documentación. |
| `GET` | `/recetas` | Sí | `nombre`, `categoria`, `tiempoMax` (query) | Lista y filtra recetas; `nombre` usa coincidencia parcial y `tiempoMax` está en minutos. |
| `GET` | `/recetas/:id` | Sí | `id` (ruta) | Obtiene una receta por identificador. |
| `POST` | `/recetas` | Sí | Cuerpo JSON de receta | Crea una receta validada con Joi. |
| `PUT` | `/recetas/:id` | Sí | `id` (ruta), cuerpo JSON de receta | Actualiza una receta existente con validación Joi. |
| `POST` | `/subir` | Sí | `archivo` (`multipart/form-data`) | Guarda una imagen y devuelve su nombre y `imagenUrl`. |
| `GET` | `/uploads/:nombre` | No | `nombre` (ruta) | Sirve un archivo guardado en `uploads/`. |
| `GET` | `/api-docs` | No | — | Documentación interactiva Swagger UI. |
| `GET` | `/api-reference` | No | — | Documentación interactiva RapiDoc. |
| `GET` | `/api-spec` | No | — | Especificación OpenAPI en JSON. |

Ejemplos de filtros:

```http
GET /recetas?nombre=pastel
GET /recetas?categoria=postres
GET /recetas?tiempoMax=30
GET /recetas?categoria=platillos&tiempoMax=45
x-api-key: tu_clave_api
```

Si los filtros no encuentran coincidencias, `GET /recetas` devuelve `200` con
una lista vacía. `tiempoMax` debe ser un entero positivo.

## Esquema del objeto Receta

Los campos `nombre`, `categoria`, `tiempoPreparacion`, `ingredientes` y `pasos`
son obligatorios al crear o actualizar. `imagenUrl` es nulo hasta que se asigne
una imagen.

```json
{
  "id": 1,
  "nombre": "Sopa de verduras",
  "categoria": "platillos",
  "tiempoPreparacion": 35,
  "ingredientes": ["zanahoria", "papa", "calabacita"],
  "pasos": ["Lava y corta las verduras", "Cuécelas hasta que estén suaves"],
  "imagenUrl": "/uploads/sopa-verduras.jpg"
}
```

Para crear o actualizar se envía el mismo objeto sin `id`. Los ingredientes y
pasos deben ser listas de cadenas no vacías; el tiempo debe ser un entero
positivo. Se rechazan propiedades que no pertenecen al esquema.

## Autenticación

Envía la API key en el encabezado HTTP:

```http
x-api-key: tu_clave_api
```

La clave debe coincidir con `API_KEY` en `.env`. Si falta o no coincide, la API
responde `401`. El middleware de horario devuelve `503` fuera del horario
permitido.

## Carga de imágenes y HATEOAS

Envía la imagen como `multipart/form-data`, con el campo `archivo`, a
`POST /subir`. La respuesta devuelve `nombre` e `imagenUrl`, por ejemplo:
`/uploads/sopa-verduras.jpg`. Usa ese valor en `imagenUrl` al crear o actualizar
una receta. El archivo queda disponible mediante `GET /uploads/:nombre`.

Las respuestas de las recetas incluyen enlaces navegables `_links.self` y
`_links.categoria`; cuando la receta tiene imagen también incluyen
`_links.imagen`.

## Documentación OpenAPI

Abre `/api-docs` para Swagger UI, `/api-reference` para RapiDoc y `/api-spec`
para consultar OpenAPI en JSON. La API key se configura desde **Authorize**.
La especificación `openapi.yaml` se genera desde los comentarios de las rutas
con:

```bash
npm run openapi
```

La portada usada en las interfaces se toma de la sección siguiente del README.

<!-- swagger-description:start -->

![Portada de la API REST de recetas](/swagger-assets/swagger-cover.svg)

## API REST de Gestión de Recetas

Consulta, filtra y administra recetas mediante `GET /recetas`,
`GET /recetas/{id}`, `POST /recetas` y `PUT /recetas/{id}`. Las recetas
incluyen ingredientes, pasos, tiempo de preparación, categoría e imagen.

### Autenticación

Las rutas de recetas y carga de imágenes requieren una API key. Pulsa
**Authorize** y escribe el valor de `API_KEY` configurado en `.env`; Swagger lo
enviará en el encabezado `x-api-key`.

### Horario del servicio

El servidor acepta solicitudes de lunes a sábado, de 06:00 a 19:59, según su
hora local. Fuera de ese horario responde con HTTP `503`.

<!-- swagger-description:end -->

## Datos, registros y estructura

El catálogo de ejemplo y las nuevas recetas se mantienen en memoria y se
reinician al detener el proceso. Los accesos y errores se registran en
`logs/accesos.log` y `logs/errores.log`; los metadatos de archivos subidos se
guardan en `metadata.json`.

```text
.
├── src/
│   ├── documentation/     # Rutas de documentación OpenAPI
│   ├── middleware/        # API key, horario, validación, carga y logs
│   ├── router/            # Rutas de recetas
│   ├── views/             # Página de bienvenida
│   └── index.js
├── scripts/               # Generación de OpenAPI
├── test/                  # Pruebas automatizadas con Supertest
├── public/                # Interfaz RapiDoc
├── uploads/               # Imágenes recibidas
├── logs/                  # Registros de acceso y errores
├── ssl/                   # Certificado y clave, pendientes de configuración
├── metadata.json
├── openapi.yaml
└── package.json
```

JSDoc y Docdash pueden generar la documentación del middleware de horario con
`npm run doc`; el resultado se guarda en `docs/`.

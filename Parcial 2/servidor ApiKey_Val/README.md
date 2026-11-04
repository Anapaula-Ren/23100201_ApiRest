![Portada de la API REST](/api-docs/assets/portada.svg)

# Formulario

Documentación de los endpoints para visualizar y validar el formulario.


### ¿Qué rutas requieren la clave?

Las rutas funcionales de la API requieren autenticación, excepto `GET /formulario` y `POST /formulario`, que están exentas para permitir mostrar y enviar el formulario. Por ejemplo, para consultar `/hateoas`, saludar en `/saludo/Ana` o subir un archivo a `/subir`, debes incluir `x-api-key`. La interfaz de documentación de `/api-docs` está disponible sin clave.



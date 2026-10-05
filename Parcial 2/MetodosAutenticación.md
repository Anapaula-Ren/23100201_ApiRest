# Métodos de Autenticación en API REST

En una arquitectura API REST, la autenticación es el mecanismo para verificar quién es el cliente que realiza la petición y asegurar que tenga permiso para acceder a los recursos expuestos. A continuación se detallan los métodos más utilizados, acompañados de sus esquemas y ejemplos de implementación.



## 1. Autenticación Básica (Basic Auth)

La autenticación básica es el método más simple definido dentro del protocolo HTTP. El cliente combina el nombre de usuario y la contraseña con dos puntos (`usuario:contraseña`), codifica la cadena resultante en **Base64** y la adjunta en el encabezado `Authorization`.

![Flujo de Autenticación Básica](https://cdn.prod.website-files.com/6a020fca21245d64af2c19d8/6a020fca21245d64af2c32b5_basic%20authentication%20Preview.jpg)

### Características clave:
* **Formato del encabezado:** `Authorization: Basic dXN1YXJpbzpjb250cmFzZcOxYQ==`
* **Nivel de seguridad:** Muy bajo por sí solo. Como Base64 es un formato reversible y no un cifrado, cualquiera que intercepte la petición puede leer las credenciales.
* **Uso recomendado:** Solo en entornos de prueba o sobre conexiones estrictamente cifradas con HTTPS/TLS.



## 2. Autenticación Digest (Digest Auth)

Surgió para resolver el problema de enviar contraseñas legibles en la red. En este esquema, el servidor envía un valor aleatorio único llamado **nonce** junto con un código de respuesta HTTP `401 Unauthorized`. El cliente toma la contraseña, la combina con el *nonce* y genera un hash (comúnmente MD5) para enviarlo de vuelta.

![Ejemplo de proceso de autenticación Digest](https://www.expressvpn.com/wp-ws-cache/uploads-expressvpn/2026/07/digest-authentication-02.png)

### Características clave:
* **Funcionamiento:** Evita la transmisión directa de la contraseña en texto plano o Base64.
* **Protección:** Ofrece protección contra ataques de retransmisión (*replay attacks*) gracias al uso del *nonce*.
* **Uso actual:** Prácticamente en desuso en el desarrollo web moderno, desplazado por HTTPS combinado con esquemas basados en tokens.


## 3. Autenticación Bearer (Bearer Token)

Consiste en otorgar al cliente un token de acceso tras verificar su identidad previamente. El término "Bearer" significa "portador", lo que implica que cualquier entidad que posea dicho token tendrá acceso a los recursos protegidos sin necesidad de enviar usuario y contraseña en cada llamada.

![Flujo de Autenticación Bearer Token](https://miro.medium.com/v2/resize:fit:1400/1*D3MHBGd5GV_f1ugAECG7Ww.jpeg)

### Características clave:
* **Formato del encabezado:** `Authorization: Bearer <token_de_acceso>`
* **Manejo de estado:** Permite desacoplar el servidor de autenticación del servidor de recursos.
* **Consideraciones:** Es fundamental definir tiempos de expiración cortos para minimizar riesgos en caso de filtración del token.


## 4. API Key

Una API Key es una clave secreta alfanumérica y única asignada a una aplicación cliente. Se utiliza principalmente para autenticar el origen de la petición, controlar tasas de consumo y gestionar cobros por uso de la API.

![Diagrama de secuencia de API Key](https://www.researchgate.net/profile/Mayank-Hindka/publication/380295281/figure/fig2/AS:11431281240314187@1714714007440/Sequence-Diagram-for-API-Key-Authentication.jpg)

### Formas de envío típicas:
* **Encabezado HTTP personalizado:** `X-API-Key: clave`
* **Parámetro en la URL (Query Param):** `https://api.ejemplo.com/v1/data?apikey=clave`
* **Uso principal:** Integraciones servidor a servidor (B2B) o APIs públicas. No se recomienda para identificar usuarios individuales.


## 5. JSON Web Token (JWT)

Es un estándar abierto (RFC 7519) que define una forma compacta y autosuficiente de transmitir información estructurada en formato JSON entre partes. Un JWT está compuesto por tres secciones codificadas en Base64URL y separadas por puntos (`Header.Payload.Signature`).

![Estructura de un JSON Web Token (JWT)](https://fusionauth.io/img/shared/json-web-token.png)

### Estructura interna:
1. **Header:** Especifica el algoritmo de firma (ej. HS256, RS256) y el tipo de token.
2. **Payload:** Contiene los datos o declaraciones (*claims*), como el ID del usuario, su rol y la fecha de expiración (`exp`).
3. **Signature:** Firma criptográfica generada por el servidor para garantizar que el token no haya sido alterado por terceros.


## 6. OAuth 

OAuth 2.0 es un protocolo estándar de autorización delegada que permite a una aplicación acceder a datos o recursos de un usuario alojados en un servicio externo sin necesidad de compartir credenciales directamente.

![Arquitectura y Flujo de Autorización OAuth 2.0](https://cdn.prod.website-files.com/6295808d44499cde2ba36c71/69e8ac9a61b200e275567ddd_image1%20(7).webp)

### Pasos Generales del Flujo de Autorización:

1. El usuario intenta iniciar sesión o usar una función dentro de la aplicación cliente que requiere conectarse a un proveedor de servicios externo.
2. La aplicación redirige al usuario a la página oficial de inicio de sesión del proveedor de identidad.
3. El proveedor de identidad le muestra al usuario los permisos solicitados y este concede la autorización.
4. Tras aceptar, el proveedor de identidad redirige al usuario de vuelta a la aplicación con una clave o código de autorización temporal.
5. La aplicación envía este código temporal al servidor de autorización para canjearlo por un **Access Token** definitivo.
6. La aplicación utiliza el token obtenido para realizar solicitudes a la API y consultar la información permitida.


## Referencias

* [MDN Web Docs: HTTP Authentication](https://developer.mozilla.org/es/docs/Web/HTTP/Authentication)
* [Auth0: API Authentication Methods](https://auth0.com/docs/get-started/authentication-and-authorization-flow)
* [JWT.io: Introduction to JSON Web Tokens](https://jwt.io/introduction)
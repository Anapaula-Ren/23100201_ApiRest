# Definiciones PARCIAL 1

## ¿Qué es una API?
**API** (Application Programming Interface) es un conjunto de reglas, definiciones y protocolos que permite que dos aplicaciones de software se comuniquen entre sí. Funciona como un intermediario que abstrae la complejidad, permitiendo a los desarrolladores acceder a funciones, bases de datos o servicios de otros sistemas sin necesidad de conocer cómo están construidos internamente.

![Diagrama Api](https://beecrowd.com/wp-content/uploads/2024/04/2023-05-09-API.jpg)

**Api Rest**: es simplemente cualquier interfaz que utiliza los principios de la arquitectura REST para comunicarse.


## ¿Qué es REST?
**REST** (Representational State Transfer) es un estilo de arquitectura de software diseñado para crear servicios web escalables. No es un protocolo ni un estándar, sino un conjunto de principios sobre cómo deben comunicarse los sistemas en red. REST aprovecha los protocolos existentes, principalmente HTTP, utilizando sus métodos estándar (como GET, POST, PUT y DELETE) para intercambiar información, generalmente en formatos ligeros como JSON o XML.

![Imagen REST](https://www.opc-router.com/wp-content/uploads/2020/04/icon_rest_webservice_600x400px.png)
## ¿A qué se refiere el término RESTful?
Mientras que REST es el modelo arquitectónico (la teoría), el término RESTful se refiere a la aplicación práctica de ese modelo; es decir, describe a las APIs o servicios web que implementan y cumplen estrictamente con todos los principios de REST, como la separación cliente-servidor, la ausencia de estado y el uso de una interfaz uniforme.

### Los 6 requisitos de la arquitectura REST

**1. Cliente-Servidor (Client-Server)**
Separa la interfaz de usuario (el cliente) del almacenamiento y la lógica (el servidor), permitiendo que ambos evolucionen de forma independiente.

**2. Sin estado (Stateless)**
El servidor no guarda información de la sesión. Cada petición enviada por el cliente debe incluir todos los datos necesarios para ser procesada.

**3. Almacenable en caché (Cacheable)**
Las respuestas deben indicar si sus datos pueden almacenarse temporalmente. Esto evita peticiones repetitivas, reduce el tráfico y mejora el rendimiento.

**4. Sistema en capas (Layered System)**
La arquitectura se divide en niveles. El cliente interactúa con el sistema sin saber si se comunica con el servidor final o con intermediarios (como proxies o balanceadores).

**5. Interfaz uniforme (Uniform Interface)**
Es la regla principal de REST. Estandariza la comunicación utilizando rutas consistentes (URIs) y los métodos clásicos de HTTP (GET, POST, PUT, DELETE).

**6. Código bajo demanda (Code on Demand - Opcional)**
Es el único requisito opcional. Permite al servidor enviar código ejecutable (como scripts) para ampliar temporalmente las funciones del cliente.

![Imagen Restful](https://raw.githubusercontent.com/DXHeroes/knowledge-base-content/master/files/what_is_rest_api.png)

## ¿Qué es un Web Service?
Un Web Service  es un sistema diseñado para que dos máquinas o aplicaciones se comuniquen entre sí a través de una red. Utiliza estándares y protocolos abiertos (como HTTP, XML, SOAP o JSON) para el intercambio de información.

![Web Service](https://programarfacil.com/wp-content/uploads/2015/12/web-services.png)
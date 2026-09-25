# WSDL 

Un archivo **WSDL** (Web Services Description Language) es un documento basado en XML que se utiliza para describir un servicio web. Funciona como un contrato que especifica qué operaciones ofrece el servicio, dónde se encuentra y cómo invocarlo mediante el protocolo SOAP.

![Esquema de un Servicio Web](https://cdn.filedesc.com/images/file/document/32/wsdl-400.webp)

## Elementos Principales

La anatomía de un archivo WSDL se divide en seis elementos jerárquicos fundamentales. Cada uno cumple una función específica en la definición del servicio:

1. **`<definitions>`**: Es el elemento raíz del documento. Actúa como contenedor para todos los demás elementos y define los *namespaces* (espacios de nombres) utilizados para evitar conflictos.
2. **`<types>`**: Define los tipos de datos (estructuras, variables) que utilizará el servicio web, típicamente empleando la sintaxis de XML Schema (XSD).
3. **`<message>`**: Describe los datos que se transmiten de forma unidireccional. Un mensaje puede constar de múltiples partes lógicas, funcionando de manera similar a los parámetros de una función en la programación estructurada.
4. **`<portType>`**: Agrupa un conjunto de operaciones (métodos) abstractas que el servicio web soporta. Para cada operación, define qué `<message>` sirve como entrada y cuál como salida.
5. **`<binding>`**: Define el formato exacto de los datos y el protocolo de comunicación específico (como SOAP sobre HTTP) que se aplicará a las operaciones definidas en el `<portType>`.
6. **`<service>`**: Especifica la dirección física o el *endpoint* (URL) donde el servicio web está publicado, configurado y listo para recibir peticiones.

## WSDL y SOAP

La relación entre WSDL y SOAP es de estricta complementariedad dentro de la arquitectura de servicios web tradicionales. Mientras que SOAP (*Simple Object Access Protocol*) define el protocolo de mensajería y el formato del sobre XML utilizado para intercambiar datos entre cliente y servidor, el WSDL actúa como el manual de instrucciones que le enseña al cliente cómo construir correctamente dichos sobres SOAP.

En la práctica, un cliente no puede consumir un servicio SOAP de forma segura sin antes procesar su documento WSDL. La sección `<binding>` del WSDL especifica los atributos propios del protocolo, como la extensión `soap:binding` y las acciones `soapAction`, las cuales le indican al cliente qué cabeceras HTTP y qué estructura debe llevar el cuerpo del sobre SOAP (`<soap:Envelope>`). De este modo, el WSDL permite la generación automática de código cliente (*stubs*), garantizando que las peticiones enviadas cumplan estrictamente con el formato que el servidor espera procesar.

## Esqueleto Básico (Código XML)

Esta es la estructura básica del XML para ver cómo se acomodan las etiquetas principales:

```xml
<definitions>
    <types>
        <!-- Definición de tipos de datos complejos con XSD -->
    </types>

    <message>
        <!-- Definición de los parámetros de entrada y salida -->
    </message>

    <portType>
        <!-- Definición de las operaciones (funciones) disponibles -->
    </portType>

    <binding>
        <!-- Vinculación concreta al protocolo SOAP -->
    </binding>

    <service>
        <!-- URL o endpoint físico del servicio -->
    </service>
</definitions>
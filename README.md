# Translogix Backend CRUD

Backend REST para el sistema **Translogix TMS**, desarrollado con **Node.js + Express.js + Mongoose** y conectado a la base de datos MongoDB `translogix_db`.

Este proyecto expone endpoints CRUD para administrar las colecciones principales del sistema logistico: clientes, vehiculos, conductores, pedidos, despachos, rutas, zonas, usuarios, incidencias, mantenimientos, notificaciones, publicaciones y comentarios.

---

## Tecnologias utilizadas

| Tecnologia | Uso en el proyecto |
|---|---|
| Node.js | Entorno de ejecucion para correr JavaScript en backend |
| Express.js | Framework para construir la API REST |
| MongoDB | Base de datos NoSQL del sistema Translogix |
| Mongoose | ODM para conectar Express con MongoDB usando modelos y schemas |
| Swagger | Documentacion visual e interactiva de la API |
| Postman | Pruebas manuales de endpoints HTTP |
| Docker | Levantamiento de MongoDB y Mongo Express |

---

## Por que Express.js y no solo Node.js

Node.js y Express.js no son enemigos ni alternativas directas. **Node.js es la base**, mientras que **Express.js es un framework que funciona encima de Node.js** para crear APIs de forma mas rapida, clara y mantenible.

| Comparacion | Node.js puro | Express.js |
|---|---|---|
| Tipo de herramienta | Entorno de ejecucion | Framework backend |
| Rutas HTTP | Se crean manualmente | Se definen facilmente con `app.get`, `app.post`, etc. |
| Codigo necesario | Mas extenso | Mas corto y ordenado |
| Manejo de JSON | Manual | Integrado con `express.json()` |
| Middlewares | Hay que implementarlos con mas trabajo | Soporte directo para CORS, logs, errores, autenticacion, etc. |
| CRUD REST | Posible, pero mas laborioso | Natural y directo |
| Integracion con Mongoose | Posible | Muy comun y sencilla |
| Documentacion con Swagger | Mas manual | Mas facil de integrar |
| Mantenimiento | Puede volverse desordenado rapido | Permite separar rutas, controladores, modelos y middlewares |

---

## Ventajas de Express.js en este proyecto

| Ventaja | Explicacion |
|---|---|
| Menos codigo repetitivo | Express evita escribir manualmente toda la logica base del servidor HTTP |
| Rutas mas claras | Cada recurso tiene endpoints faciles de leer, por ejemplo `/api/clientes` |
| Mejor organizacion | El proyecto se divide en `models`, `routes`, `controllers`, `config` y `middleware` |
| Facil de probar | Los endpoints funcionan directamente con Postman y Swagger |
| Compatible con Mongoose | Permite conectar los modelos de MongoDB con rutas CRUD de forma ordenada |
| Escalable | Se pueden agregar autenticacion, validaciones, roles o filtros sin rehacer todo |
| Estandar en APIs REST | Express es una opcion comun para backends academicos y profesionales |

---

## Conclusion tecnica

Para este CRUD, usar solo Node.js seria posible, pero implicaria escribir mas codigo manual para manejar rutas, metodos HTTP, errores, respuestas JSON y estructura del proyecto.

Por eso se eligio:

```text
Node.js + Express.js + Mongoose
```

La decision es adecuada porque:

1. **Node.js** permite ejecutar JavaScript en el servidor.
2. **Express.js** facilita la creacion de la API REST.
3. **Mongoose** permite trabajar con MongoDB usando modelos.
4. **Swagger y Postman** permiten probar y documentar la API facilmente.

En resumen: **Express.js es mejor para este caso porque reduce complejidad, ordena el backend y acelera el desarrollo del CRUD**.

---

## Requisitos

Antes de ejecutar el backend, tener instalado:

| Requisito | Version recomendada |
|---|---|
| Node.js | 18 o superior |
| npm | Incluido con Node.js |
| Docker Desktop | Para levantar MongoDB |
| Postman | Opcional, para pruebas |

---

## Base de datos

El proyecto usa la base de datos:

```text
translogix_db
```

Conexion local:

```text
mongodb://admin:translogix2026@localhost:27017/translogix_db?authSource=admin
```

Mongo Express:

```text
http://localhost:8081
usuario: admin
password: admin123
```

---

## Instalacion

Levantar MongoDB con Docker:

```bash
docker compose up --build -d
```

Instalar dependencias del backend:

```bash
npm install
```

Ejecutar en modo desarrollo:

```bash
npm run dev
```

Ejecutar en modo normal:

```bash
npm start
```

La API queda disponible en:

```text
http://localhost:3000
```

---

## Swagger

La documentacion interactiva esta disponible en:

```text
http://localhost:3000/api-docs
```

Desde Swagger se pueden probar los endpoints `GET`, `POST`, `PUT`, `PATCH` y `DELETE` directamente desde el navegador.

---

## Pruebas con Postman

Base URL:

```text
http://localhost:3000
```

Ejemplos:

| Accion | Metodo | URL |
|---|---|---|
| Listar clientes | GET | `/api/clientes` |
| Obtener cliente por ID | GET | `/api/clientes/555555555555555555555555` |
| Crear vehiculo | POST | `/api/vehiculos` |
| Actualizar pedido | PATCH | `/api/pedidos/aaaaaaaaaaaaaaaaaaaaaaaf` |
| Eliminar comentario | DELETE | `/api/comentarios/c00000000000000000000001` |

Ejemplo de body para crear vehiculo:

```json
{
  "placa": "NEW-123",
  "marca": "Nissan",
  "modelo": "Urvan",
  "anio": 2024,
  "tipo": "furgoneta",
  "capacidad_kg": 1200,
  "capacidad_m3": 7.5,
  "estado": "operativo",
  "kilometraje": 0
}
```

---

## Endpoints CRUD disponibles

| Recurso | Endpoint |
|---|---|
| Roles | `/api/roles` |
| Usuarios | `/api/usuarios` |
| Conductores | `/api/conductores` |
| Vehiculos | `/api/vehiculos` |
| Clientes | `/api/clientes` |
| Zonas | `/api/zonas` |
| Rutas | `/api/rutas` |
| Pedidos | `/api/pedidos` |
| Despachos | `/api/despachos` |
| Seguimiento GPS | `/api/seguimiento_gps` |
| Incidencias | `/api/incidencias` |
| Mantenimientos | `/api/mantenimientos` |
| Reportes | `/api/reportes` |
| Notificaciones | `/api/notificaciones` |
| Publicaciones feed | `/api/publicaciones_feed` |
| Comentarios | `/api/comentarios` |

Cada endpoint soporta:

| Metodo | Descripcion |
|---|---|
| GET `/api/recurso` | Listar registros |
| GET `/api/recurso/:id` | Obtener un registro por ID |
| POST `/api/recurso` | Crear un registro |
| PUT `/api/recurso/:id` | Actualizar un registro completo |
| PATCH `/api/recurso/:id` | Actualizar parcialmente un registro |
| DELETE `/api/recurso/:id` | Eliminar un registro |

---

## Arquitectura aplicada

El backend usa una estructura **modular inspirada en DDD**. No se aplico DDD completa porque el proyecto es principalmente CRUD, pero si se separaron responsabilidades para que el codigo sea mas escalable.

| Capa | Ubicacion | Responsabilidad |
|---|---|---|
| Domain | `modules/translogix/domain` | Define los recursos principales del modulo Translogix |
| Application | `modules/translogix/application` | Contiene la logica de casos de uso CRUD |
| Infrastructure | `modules/translogix/infrastructure` | Conecta con MongoDB usando Mongoose y repositorios |
| Interfaces | `modules/translogix/interfaces/http` | Expone rutas y controladores HTTP con Express |
| Shared | `shared` | Codigo compartido, como middlewares de error |
| Config | `config` | Conexion a MongoDB y configuracion Swagger |

## Estructura del backend

```text
src/
  app.js
  server.js
  config/
    db.js
    swagger.js
  modules/
    translogix/
      domain/
        resourceCatalog.js
      application/
        createCrudService.js
      infrastructure/
        mongoose/
          models.js
        repositories/
          createMongoCrudRepository.js
      interfaces/
        http/
          createCrudController.js
          createCrudRouter.js
          translogixRoutes.js
  shared/
    middleware/
      errorMiddleware.js
```

| Carpeta o archivo | Funcion |
|---|---|
| `server.js` | Inicia el servidor y conecta MongoDB |
| `app.js` | Configura Express, rutas, Swagger y middlewares |
| `config/db.js` | Conexion a MongoDB |
| `config/swagger.js` | Configuracion de Swagger/OpenAPI |
| `domain/resourceCatalog.js` | Lista los recursos expuestos por la API |
| `application/createCrudService.js` | Casos de uso CRUD y filtros de consulta |
| `infrastructure/mongoose/models.js` | Modelos Mongoose de las colecciones |
| `infrastructure/repositories/createMongoCrudRepository.js` | Acceso a datos con MongoDB |
| `interfaces/http/createCrudController.js` | Controladores HTTP |
| `interfaces/http/createCrudRouter.js` | Rutas REST reutilizables |
| `interfaces/http/translogixRoutes.js` | Montaje de endpoints del modulo Translogix |
| `shared/middleware/errorMiddleware.js` | Manejo centralizado de errores |

---

## Resumen

Este backend se desarrollo con Express.js porque el proyecto necesita una API REST CRUD clara, facil de probar y conectada a MongoDB. Express permite trabajar de forma mas ordenada que usando solo Node.js puro, especialmente cuando hay muchas colecciones y endpoints.

---

## 6.2. Capa de aplicacion

La revision del proyecto confirma el uso de **Node.js**, **JavaScript**, **Express.js**, **HTTP/REST**, **Docker Compose**, **Swagger UI** y **Postman**. Estas tecnologias aparecen en `package.json`, `src`, `docker-compose.yml`, `Dockerfile` y en la documentacion del README.

### 6.2.1. Comparacion de Entorno de ejecucion

| Nombre de la tecnologia | Imagen/logo | Ventajas | Desventajas |
|---|---|---|---|
| Node.js | <img src="https://cdn.simpleicons.org/nodedotjs/339933" width="42" alt="Node.js logo"> | Permite ejecutar JavaScript en backend, tiene gran ecosistema npm y se integra facilmente con Express.js y Mongoose. | Al ser flexible, requiere buena organizacion para evitar codigo desordenado en proyectos grandes. |
| Deno | <img src="https://cdn.simpleicons.org/deno/000000" width="42" alt="Deno logo"> | Incluye TypeScript nativo, permisos de seguridad y herramientas integradas. | Tiene menor adopcion y menos librerias disponibles que Node.js. |
| Bun | <img src="https://cdn.simpleicons.org/bun/000000" width="42" alt="Bun logo"> | Es rapido para ejecutar JavaScript e instalar dependencias. | Es mas reciente, por lo que puede presentar incompatibilidades con algunas librerias. |
| JVM | <img src="https://cdn.simpleicons.org/openjdk/000000" width="42" alt="OpenJDK logo"> | Es robusta, madura y muy usada en aplicaciones empresariales. | Suele requerir mayor configuracion y mas recursos que Node.js para APIs ligeras. |

Se eligio **Node.js** porque el proyecto necesita una API REST ligera desarrollada en JavaScript. Frente a Deno, Bun y JVM, Node.js ofrece mayor compatibilidad con Express.js, Mongoose, Swagger y el ecosistema npm usado por el backend.

### 6.2.2. Comparacion de Framework

| Nombre de la tecnologia | Imagen/logo | Ventajas | Desventajas |
|---|---|---|---|
| Express.js | <img src="https://cdn.simpleicons.org/express/000000" width="42" alt="Express.js logo"> | Es simple, flexible, muy usado y facilita crear rutas REST con middlewares. | No impone una arquitectura estricta; el orden depende del equipo. |
| NestJS | <img src="https://cdn.simpleicons.org/nestjs/E0234E" width="42" alt="NestJS logo"> | Tiene arquitectura modular, inyeccion de dependencias y buen soporte para TypeScript. | Requiere mas configuracion y tiene mayor curva de aprendizaje. |
| Fastify | <img src="https://cdn.simpleicons.org/fastify/000000" width="42" alt="Fastify logo"> | Ofrece alto rendimiento y buen soporte para schemas. | Su ecosistema y adopcion son menores que los de Express.js. |
| Koa | <img src="https://img.shields.io/badge/Koa-33333D?style=for-the-badge&logo=javascript&logoColor=white" alt="Koa logo"> | Es minimalista y permite controlar el flujo de middlewares con claridad. | Incluye menos funcionalidades listas para usar que Express.js. |

Se eligio **Express.js** porque el backend necesita exponer multiples endpoints CRUD de forma rapida y clara. Frente a NestJS, Fastify y Koa, Express.js reduce la complejidad inicial y se integra directamente con Mongoose, Swagger UI, CORS y Morgan, que son dependencias reales del proyecto.

### 6.2.3. Comparacion de Lenguaje de programacion

| Nombre de la tecnologia | Imagen/logo | Ventajas | Desventajas |
|---|---|---|---|
| JavaScript | <img src="https://cdn.simpleicons.org/javascript/F7DF1E" width="42" alt="JavaScript logo"> | Es compatible de forma nativa con Node.js, tiene gran comunidad y permite desarrollo rapido. | Su tipado dinamico puede causar errores si no se agregan validaciones suficientes. |
| TypeScript | <img src="https://cdn.simpleicons.org/typescript/3178C6" width="42" alt="TypeScript logo"> | Agrega tipado estatico, mejora el autocompletado y facilita mantener proyectos grandes. | Requiere configuracion, compilacion y definicion de tipos. |
| Java | <img src="https://cdn.simpleicons.org/openjdk/000000" width="42" alt="Java logo"> | Es robusto, estable y ampliamente usado para sistemas empresariales. | Es mas verboso y suele requerir mas estructura inicial. |
| Python | <img src="https://cdn.simpleicons.org/python/3776AB" width="42" alt="Python logo"> | Tiene sintaxis clara y un ecosistema amplio para automatizacion y datos. | Para APIs Node/Express no aprovecha directamente el ecosistema npm del proyecto. |

Se eligio **JavaScript** porque todos los archivos del backend usan modulos ES y se ejecutan sobre Node.js. Frente a TypeScript, Java y Python, JavaScript permite una implementacion mas directa con Express.js y las librerias ya declaradas en `package.json`.

### 6.2.4. Comparacion de Protocolo de red

| Nombre de la tecnologia | Imagen/logo | Ventajas | Desventajas |
|---|---|---|---|
| HTTP/REST | <img src="https://img.shields.io/badge/REST-API-02569B?style=for-the-badge&logo=swagger&logoColor=white" alt="REST logo"> | Es simple, ampliamente soportado y facil de probar con Postman o Swagger UI. | Puede requerir varias peticiones cuando las consultas son muy complejas. |
| GraphQL | <img src="https://cdn.simpleicons.org/graphql/E10098" width="42" alt="GraphQL logo"> | Permite pedir solo los campos necesarios y centralizar consultas. | Agrega complejidad en resolvers, cache y control de permisos. |
| WebSocket | <img src="https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="WebSocket logo"> | Permite comunicacion bidireccional en tiempo real. | Requiere manejar conexiones persistentes y estados de sesion. |
| gRPC | <img src="https://cdn.simpleicons.org/grpc/244C5A" width="42" alt="gRPC logo"> | Es eficiente y trabaja con contratos fuertemente definidos. | Es menos amigable para pruebas manuales desde navegador o Postman basico. |

Se eligio **HTTP/REST** porque el proyecto es un CRUD para recursos logisticos como clientes, vehiculos, pedidos y despachos. Frente a GraphQL, WebSocket y gRPC, REST es mas simple de documentar con Swagger UI y mas directo de probar con Postman.

### 6.2.5. Comparacion de Editor de texto

| Nombre de la tecnologia | Imagen/logo | Ventajas | Desventajas |
|---|---|---|---|
| Visual Studio Code | <img src="https://cdn.simpleicons.org/visualstudiocode/007ACC" width="42" alt="Visual Studio Code logo"> | Es ligero, gratuito, extensible y tiene buen soporte para JavaScript, Node.js, Docker y archivos Markdown. | Depende de extensiones para algunas funciones avanzadas y puede consumir mas recursos con muchas extensiones instaladas. |
| WebStorm | <img src="https://cdn.simpleicons.org/webstorm/000000" width="42" alt="WebStorm logo"> | Incluye herramientas avanzadas para JavaScript, refactorizacion y analisis de codigo. | Es de pago y suele consumir mas recursos que editores ligeros. |
| Sublime Text | <img src="https://cdn.simpleicons.org/sublimetext/FF9800" width="42" alt="Sublime Text logo"> | Es rapido, minimalista y funciona bien para edicion de archivos. | No incluye tantas herramientas integradas para Node.js y Docker por defecto. |
| Vim/Neovim | <img src="https://cdn.simpleicons.org/neovim/57A143" width="42" alt="Neovim logo"> | Es muy configurable, eficiente y funciona bien desde terminal. | Tiene una curva de aprendizaje alta y requiere configuracion manual. |

Se eligio **Visual Studio Code** porque permite trabajar comodamente con JavaScript, Node.js, Express.js, Docker Compose y Markdown en un mismo entorno. Frente a WebStorm, Sublime Text y Vim/Neovim, ofrece un equilibrio practico entre facilidad de uso, extensiones y soporte para las tecnologias reales del proyecto.

### 6.2.6. Comparacion de Integrador u Orquestador del container

| Nombre de la tecnologia | Imagen/logo | Ventajas | Desventajas |
|---|---|---|---|
| Docker Compose | <img src="https://cdn.simpleicons.org/docker/2496ED" width="42" alt="Docker Compose logo"> | Permite levantar MongoDB y Mongo Express con un solo archivo `docker-compose.yml`. | No reemplaza a una orquestacion productiva avanzada como Kubernetes. |
| Docker CLI | <img src="https://cdn.simpleicons.org/docker/2496ED" width="42" alt="Docker logo"> | Da control directo sobre imagenes, contenedores, volumenes y redes. | Requiere mas comandos manuales para coordinar varios servicios. |
| Kubernetes | <img src="https://cdn.simpleicons.org/kubernetes/326CE5" width="42" alt="Kubernetes logo"> | Es escalable, robusto y adecuado para produccion con multiples servicios. | Es complejo para un entorno local academico o de desarrollo simple. |
| Podman Compose | <img src="https://cdn.simpleicons.org/podman/892CA0" width="42" alt="Podman logo"> | Permite trabajar con contenedores sin depender del daemon de Docker. | Tiene menor adopcion y puede requerir ajustes de compatibilidad. |

Se eligio **Docker Compose** porque el proyecto necesita levantar una base MongoDB y una interfaz Mongo Express de manera local. Frente a Docker CLI, Kubernetes y Podman Compose, Docker Compose ofrece una configuracion mas simple y reproducible para desarrollo.

### 6.2.7. Comparacion de Herramienta de testeo

| Nombre de la tecnologia | Imagen/logo | Ventajas | Desventajas |
|---|---|---|---|
| Postman | <img src="https://cdn.simpleicons.org/postman/FF6C37" width="42" alt="Postman logo"> | Permite probar endpoints REST visualmente, guardar colecciones y manejar variables. | Las pruebas manuales dependen del mantenimiento de colecciones. |
| Swagger UI | <img src="https://cdn.simpleicons.org/swagger/85EA2D" width="42" alt="Swagger logo"> | Documenta la API y permite probar endpoints desde el navegador. | Sus pruebas son basicas y dependen de que la documentacion este bien definida. |
| Jest | <img src="https://cdn.simpleicons.org/jest/C21325" width="42" alt="Jest logo"> | Permite crear pruebas automatizadas unitarias e integracion en JavaScript. | No esta instalado en el proyecto y requeriria configuracion adicional. |
| Supertest | <img src="https://img.shields.io/badge/Supertest-000000?style=for-the-badge&logo=javascript&logoColor=white" alt="Supertest logo"> | Permite probar endpoints Express de forma automatizada. | Normalmente necesita integrarse con Jest u otro runner de pruebas. |

Se eligieron **Postman** y **Swagger UI** para testeo manual y documentacion interactiva. Frente a Jest y Supertest, estas herramientas permiten validar rapidamente los endpoints REST sin agregar una configuracion de pruebas automatizadas, lo cual encaja con el enfoque CRUD del proyecto.

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


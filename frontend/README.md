# Translogix TMS - Capa de presentacion

Frontend de Translogix TMS construido con React + Vite. Esta capa representa la parte visual de la arquitectura de tres capas y consume la API Express/Mongoose publicada por la capa de aplicacion.

## Que hace esta capa

| Funcion | Descripcion |
|---|---|
| IAM | Permite iniciar sesion o crear cuenta antes de entrar al sistema |
| Registro con rol | Obliga a elegir Administrador, Operador o Conductor durante la creacion de cuenta |
| Suscripcion | Si el usuario no tiene plan, exige elegir Plus o Premium antes del dashboard |
| Dashboard | Muestra resumen del rol, plan, modulos habilitados y grupos funcionales |
| Perfil | Centraliza los datos del usuario y el cambio de suscripcion |
| CRUD | Permite listar, crear, editar y eliminar registros de los endpoints habilitados |
| Control de acceso | Combina rol + plan para decidir que modulos se muestran |

## Flujo funcional

```text
Usuario abre la app
  -> IAM: login o crear cuenta
  -> Si crea cuenta: debe elegir rol
  -> Backend devuelve JWT y datos del usuario
  -> App verifica si existe suscripcion activa
  -> Si no hay plan: muestra seleccion Plus/Premium
  -> Si hay plan: muestra dashboard
  -> Usuario navega modulos segun rol + plan
  -> Usuario cambia plan solo desde Perfil
```

## Planes

| Plan | Alcance |
|---|---|
| Plus | Operacion logistica esencial: clientes, flota, rutas, pedidos, despachos, GPS, incidencias, notificaciones y suscripciones |
| Premium | Arquitectura completa: incluye Plus y agrega IAM, mantenimientos, reportes, feed corporativo y comentarios |

## Roles

| Rol | Que puede hacer |
|---|---|
| Administrador | Acceso completo al TMS, usuarios, roles, reportes y configuracion operativa |
| Operador | Gestiona clientes, vehiculos, conductores, rutas, pedidos, despachos e incidencias |
| Conductor | Consulta y reporta informacion relacionada a despachos, GPS, incidencias y comunicacion |

## Archivos importantes

| Archivo | Responsabilidad |
|---|---|
| `src/main.jsx` | Punto de entrada de React. Renderiza `App` en el DOM |
| `src/App.jsx` | Orquesta autenticacion, planes, dashboard, perfil, navegacion y CRUD |
| `src/api.js` | Cliente HTTP. Define `API_URL`, agrega token JWT y maneja errores del backend |
| `src/modules.js` | Catalogo de modulos. Define endpoints, columnas, campos de formulario y datos iniciales |
| `src/styles.css` | Estilos de interfaz: auth, dashboard, sidebar, tablas, formularios, perfil y responsive |
| `package.json` | Dependencias y scripts para desarrollo, build y preview |

## Componentes principales

| Componente | Que hace |
|---|---|
| `AuthScreen` | Pantalla inicial de IAM. Alterna entre login y registro |
| `PlanGate` | Pantalla obligatoria para elegir plan cuando el usuario no tiene suscripcion |
| `DashboardView` | Vista inicial del sistema despues de autenticarse y tener plan |
| `ProfileView` | Vista de perfil. Muestra usuario, rol, email y selector de plan |
| `ResourceView` | Vista reutilizable para CRUD de cada modulo habilitado |
| `Shell` | Layout principal con sidebar, topbar y contenido activo |

## Como se conecta con backend

Por defecto usa:

```text
http://localhost:3000/api
```

Para cambiar la URL, crear `frontend/.env`:

```text
VITE_API_URL=http://localhost:3000/api
```

El cliente `api.js` agrega automaticamente `Authorization: Bearer <token>` cuando existe una sesion iniciada.

## Ejecutar en desarrollo

Primero levantar la API y MongoDB desde la raiz del proyecto:

```bash
docker compose up --build -d
```

Luego ejecutar el frontend:

```bash
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:5173`.

## Compilar para produccion

```bash
cd frontend
npm run build
```

El resultado queda en `frontend/dist/`.

## Preview local del build

```bash
cd frontend
npm run preview
```

## Notas de desarrollo

| Punto | Explicacion |
|---|---|
| No se dockeriza todavia | Por decision del proyecto, por ahora Docker cubre datos y aplicacion |
| No hay pasarela de pago | La suscripcion solo selecciona Plus o Premium para simular contratacion |
| Placeholder generico | El login usa correos de referencia como `example@gmail.com` |
| CRUD generico | Cada modulo reutiliza `ResourceView`, por eso nuevos endpoints se agregan desde `modules.js` |
| Control visual | La UI no muestra modulos que el rol o plan no deberian operar |


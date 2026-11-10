# TurnoExtraAngular 🎲

Proyecto académico desarrollado para la asignatura **Desarrollo Full Stack II (DSY2202)** de Duoc UC.

**Estudiante:** Daniel Alarcón  
**Experiencia:** 2  
**Semana:** 4  
**Framework:** Angular 22

## Descripción

**TurnoExtra** es una tienda ficticia de juegos de mesa que permite explorar diferentes categorías, consultar productos y acceder a un formulario de registro de usuarios.

El proyecto original fue desarrollado durante la Experiencia 1 utilizando HTML5, CSS3, Bootstrap 5 y JavaScript.

Durante la Experiencia 2, la aplicación fue migrada a **Angular 22**, incorporando una arquitectura basada en componentes reutilizables, TypeScript, navegación mediante Angular Router, directivas estructurales y vinculación de datos.

Se conservó la identidad visual del proyecto original, caracterizada por una interfaz moderna, colores pastel y diseño adaptable a distintos dispositivos.

## Tecnologías utilizadas

- Angular 22
- TypeScript
- HTML5
- CSS3
- Bootstrap 5.3.3
- Node.js 24
- npm
- Git y GitHub
- GitHub Actions
- GitHub Pages
- Trello
- Visual Studio Code

## Funcionalidades implementadas

### Navegación entre páginas

Se implementó **Angular Router** para navegar entre las diferentes secciones sin recargar completamente la aplicación.

Rutas disponibles:

- `/` — Inicio
- `/estrategia` — Juegos de estrategia
- `/familiares` — Juegos familiares
- `/creatividad` — Juegos de creatividad
- `/fiesta` — Juegos de fiesta
- `/registro` — Registro de usuarios

### Catálogo de juegos

El catálogo contiene 12 juegos de mesa distribuidos en cuatro categorías.

Cada producto presenta:

- Nombre y descripción.
- Imagen.
- Precio en pesos chilenos.
- Precio anterior cuando corresponde.
- Disponibilidad de stock.
- Botón para agregar al carrito de demostración.

La información se administra mediante interfaces y arreglos de objetos en TypeScript.

### Componentes reutilizables

La aplicación utiliza componentes Angular para organizar y reutilizar elementos de la interfaz.

Entre ellos:

- **Header:** encabezado y navegación.
- **Footer:** pie de página.
- **Inicio:** presentación y acceso a categorías.
- **Categoria:** visualización dinámica del catálogo.
- **TarjetaJuego:** presentación individual de cada producto.
- **Registro:** formulario de registro con validaciones.

### Comunicación entre componentes

Se implementó comunicación entre componentes mediante:

- `@Input()` para enviar información de los juegos desde el componente de categoría hacia las tarjetas.
- `@Output()` y `EventEmitter` para comunicar al componente padre cuándo se agrega un producto al carrito.

El carrito de demostración muestra un contador de productos agregados y el nombre del último juego seleccionado.

### Directivas y vinculación de datos

Se utilizaron funcionalidades de Angular como:

- `*ngFor` para recorrer colecciones de productos.
- `*ngIf` para mostrar contenido condicionalmente.
- `[(ngModel)]` para vincular los campos del formulario con las propiedades del componente.
- Interpolación para mostrar información dinámica.
- Enrutamiento mediante `routerLink`.

### Formulario de registro

El formulario permite ingresar información personal y realiza validaciones en Angular.

Incluye:

- Nombre completo.
- Nombre de usuario.
- Correo electrónico.
- Contraseña.
- Confirmación de contraseña.
- Fecha de nacimiento.
- Dirección opcional.

Se implementaron validaciones de campos obligatorios, formato de correo electrónico, requisitos de contraseña, coincidencia de contraseñas y edad mínima.

El formulario muestra mensajes de error, indicadores visuales y confirmación de validación exitosa.

**Nota:** el registro es una demostración de validación y vinculación de datos. No almacena cuentas en una base de datos ni implementa autenticación real.

### Diseño responsive

Se adaptó la interfaz para diferentes tamaños de pantalla utilizando CSS y Bootstrap.

Se realizaron pruebas en resoluciones de escritorio, tablet y dispositivos móviles.

## Objetivos de la Semana 4

- [x] Crear un proyecto Angular desde cero.
- [x] Configurar el entorno de desarrollo.
- [x] Migrar la interfaz HTML y CSS de TurnoExtra.
- [x] Integrar Bootstrap.
- [x] Crear componentes Angular reutilizables.
- [x] Implementar navegación mediante Angular Router.
- [x] Utilizar las directivas `ngIf` y `ngFor`.
- [x] Utilizar `ngModel` para vincular datos.
- [x] Transferir información entre componentes mediante `@Input()` y `@Output()`.
- [x] Implementar validaciones en el formulario.
- [x] Realizar pruebas de funcionamiento y responsividad.
- [x] Utilizar GitHub para el control de versiones.
- [x] Organizar las tareas del proyecto mediante Trello.
- [x] Configurar el despliegue mediante GitHub Actions.
- [x] Verificar el despliegue público en GitHub Pages.
- [x] Completar las evidencias y la entrega académica.

## Instalación

### Requisitos

- Node.js compatible con Angular 22.
- npm.

### Clonar el repositorio

```bash
git clone https://github.com/Dizz7/TurnoExtraAngular.git
cd TurnoExtraAngular
```

### Instalar dependencias

```bash
npm install
```

### Ejecutar el proyecto

```bash
npm start
```

Abrir en el navegador:

http://localhost:4200/

### Compilar para producción

```bash
npm run build
```

Para generar una compilación compatible con GitHub Pages:

```bash
npm run build -- --base-href /TurnoExtraAngular/
```

Los archivos compilados se generan en el directorio `dist/turno-extra-angular/browser/`.

## Estructura del proyecto

```text
TurnoExtraAngular/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   └── img/
│       └── juegos/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   └── tarjeta-juego/
│   │   ├── data/
│   │   │   ├── categorias.ts
│   │   │   └── juegos.ts
│   │   ├── pages/
│   │   │   ├── inicio/
│   │   │   ├── categoria/
│   │   │   └── registro/
│   │   ├── app.ts
│   │   ├── app.html
│   │   ├── app.css
│   │   ├── app.routes.ts
│   │   └── app.config.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
└── README.md
```

## Despliegue

El proyecto cuenta con un workflow de **GitHub Actions** para automatizar su compilación y publicación en GitHub Pages.

El proceso se ejecuta al subir cambios a la rama `main`.

**Sitio web:** https://dizz7.github.io/TurnoExtraAngular/

**Estado:** publicado y funcionando correctamente en GitHub Pages.

## Herramientas de gestión

**GitHub:** repositorio y control de versiones.

https://github.com/Dizz7/TurnoExtraAngular

**Trello:** organización y seguimiento de las actividades de desarrollo mediante un tablero Kanban.

## Estado del proyecto

**Experiencia 2 — Semana 4 completada.**

La aplicación se encuentra implementada y publicada en GitHub Pages.

Incluye navegación mediante Angular Router, catálogo dinámico,
componentes reutilizables, comunicación mediante @Input() y @Output(),
formulario de registro con validaciones y diseño responsive.

El despliegue se realiza automáticamente mediante GitHub Actions
al subir cambios a la rama main.

## Autor

**Daniel Alarcón**  
Duoc UC — Desarrollo Full Stack II  
Experiencia 2 — Semana 4  
2026
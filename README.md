# TurnoExtraAngular 🎲

Proyecto académico desarrollado para la asignatura **Desarrollo Full Stack II (DSY2202)** de Duoc UC.

**Estudiante:** Daniel Alarcón\
**Experiencia:** 2\
**Semana:** 5\
**Framework:** Angular 22

## Descripción

**TurnoExtra** es una tienda ficticia de juegos de mesa que permite explorar categorías, consultar el detalle de cada juego y completar un formulario de registro con validaciones.

El proyecto nació en la Experiencia 1 con HTML5, CSS3, Bootstrap y JavaScript. Durante la Experiencia 2 se migró a Angular, organizando la interfaz mediante componentes reutilizables, modelos TypeScript y navegación con Angular Router.

Esta entrega incorpora formularios reactivos, separación de modelos y datos, estilos encapsulados por componente, una página de detalle dinámica y un servicio compartido para el carrito de demostración. Se mantiene el diseño pastel, las animaciones y la adaptación a dispositivos móviles.

## Tecnologías y herramientas

- Angular 22 y Angular Router.
- TypeScript 6, HTML5 y CSS3.
- Bootstrap 5.3.
- Reactive Forms, Signals y RxJS.
- Jasmine, Karma y utilidades de pruebas de Angular.
- Node.js 24 y npm.
- Git, GitHub, GitHub Actions y GitHub Pages.
- Trello para organizar actividades y Visual Studio Code para desarrollo.

## Funcionalidades implementadas

### Navegación

Angular Router permite cambiar de página sin recargar la aplicación completa.

| Ruta | Contenido |
| --- | --- |
| `/` | Inicio y acceso a categorías |
| `/estrategia` | Juegos de estrategia |
| `/familiares` | Juegos familiares |
| `/creatividad` | Juegos de creatividad |
| `/fiesta` | Juegos de fiesta |
| `/juegos/:id` | Detalle dinámico de un juego |
| `/registro` | Formulario de registro |

Por ejemplo, `/juegos/wingspan` y `/juegos/kurruf` utilizan el mismo componente y muestran información distinta según el identificador de la URL. Un identificador de juego desconocido muestra **«Juego no encontrado»** con un enlace al inicio. Las demás rutas desconocidas redirigen al inicio.

### Catálogo y detalle de juegos

El catálogo contiene **12 juegos distribuidos en cuatro categorías**. La información se define en `data/juegos.ts` y `data/categorias.ts`, utilizando interfaces de `models/`.

Las tarjetas muestran nombre, descripción, portada, precio en pesos chilenos, ofertas cuando corresponden y disponibilidad. Cada tarjeta incluye un enlace **«Ver detalles»** y un botón para agregar el juego al carrito de demostración.

La página de detalle presenta:

- Portada y descripción del juego.
- Categoría y enlaces de navegación.
- Precio actual, precio anterior y porcentaje de descuento cuando existe una oferta.
- Disponibilidad y botón desactivado si no hay stock.
- Contador del carrito y último juego agregado.
- Enlace para volver a la categoría correspondiente.

El componente observa los parámetros de la ruta y utiliza una señal para actualizar la vista al cambiar de juego, incluso cuando Angular reutiliza la misma instancia.

### Componentes reutilizables

| Componente | Responsabilidad |
| --- | --- |
| `Header` | Encabezado, navegación y menú móvil |
| `Footer` | Pie de página |
| `Inicio` | Presentación y categorías generadas desde los datos |
| `Categoria` | Catálogo dinámico para las cuatro categorías |
| `TarjetaJuego` | Presentación de un juego y emisión del evento de agregar al carrito |
| `PrecioJuego` | Formato de precios y cálculo de descuentos compartidos por tarjeta y detalle |
| `DetalleJuego` | Una página reutilizable para todos los juegos |
| `Registro` | Formulario reactivo y mensajes de validación |

### Comunicación y estado compartido

- `@Input()` transmite los datos del juego a `TarjetaJuego` y `PrecioJuego`.
- `@Output()` y `EventEmitter` permiten que la tarjeta notifique al catálogo cuándo se agrega un juego.
- El servicio `CarritoDemo`, proporcionado en la raíz de la aplicación, mantiene mediante Signals la cantidad de juegos agregados y el nombre del último seleccionado.

El catálogo y el detalle comparten ese estado durante la navegación. El contador se reinicia al recargar la página: no se guarda en una base de datos ni en el almacenamiento del navegador. Es una demostración; no procesa compras, no descuenta existencias ni gestiona cantidades por producto.

### Formulario reactivo de registro

El formulario utiliza `ReactiveFormsModule`, `FormGroup`, `FormControl` y validadores de Angular y personalizados. Los campos se vinculan mediante `[formGroup]` y `formControlName`.

| Campo | Validación |
| --- | --- |
| Nombre completo | Obligatorio; no admite únicamente espacios |
| Nombre de usuario | Obligatorio; no admite únicamente espacios |
| Correo electrónico | Obligatorio y con formato válido |
| Contraseña | Entre 6 y 18 caracteres, al menos una mayúscula y un número |
| Confirmación de contraseña | Obligatoria y coincidente con la contraseña |
| Fecha de nacimiento | Fecha válida, no futura y edad mínima de 13 años |
| Dirección | Opcional |

Se muestran mensajes de error, indicadores visuales por campo y confirmación cuando los datos son válidos. El botón **«Limpiar formulario»** restablece los campos y los mensajes.

**El registro no crea cuentas ni implementa autenticación real.**

### Directivas y vinculación de datos

La aplicación utiliza interpolación, vinculación de propiedades y eventos, `routerLink`, `routerLinkActive`, `*ngFor`, `*ngIf` y los bloques de control `@for` y `@if`.

El registro de esta entrega utiliza formularios reactivos; ya no depende de `[(ngModel)]`.

### Estilos y diseño responsive

Los estilos específicos se encuentran en el CSS de cada componente. `src/styles.css` conserva la fuente Nunito, la paleta de colores, los estilos base, los botones compartidos y las preferencias de movimiento reducido.

Las hojas `app/styles/page.css` y `card-reveal.css` se reutilizan mediante `styleUrls` y Angular las encapsula para cada componente. `legacy.css` conserva estilos de pantallas del sitio anterior que aún no existen como componentes; no se carga en la aplicación.

Se mantiene Bootstrap para la cuadrícula y la navegación responsive. Se revisaron las pantallas existentes en anchos de 390, 768 y 1280 píxeles, y la nueva página de detalle en móvil y escritorio.

## Avances de esta entrega

- [x] Separar interfaces de modelos y datos del catálogo.
- [x] Generar las categorías de inicio a partir de los datos existentes.
- [x] Implementar el formulario de registro con Reactive Forms.
- [x] Distribuir el CSS entre componentes conservando los estilos compartidos.
- [x] Crear una ruta parametrizada para el detalle de cada juego.
- [x] Reutilizar la presentación de precios y descuentos.
- [x] Compartir el carrito de demostración entre catálogo y detalle.
- [x] Añadir pruebas de navegación, precios, disponibilidad y estado compartido.
- [x] Comprobar la compilación de producción y el diseño responsive.

## Instalación y ejecución

### Requisitos

- Node.js 24, utilizado en desarrollo y en el workflow de despliegue.
- npm.
- Google Chrome instalado para ejecutar las pruebas con ChromeHeadless.

### Clonar e instalar dependencias

```bash
git clone https://github.com/Dizz7/TurnoExtraAngular.git
cd TurnoExtraAngular
npm ci
```

`npm ci` instala las dependencias según `package-lock.json`.

### Ejecutar en desarrollo

```bash
npm start
```

Abrir [http://localhost:4200/](http://localhost:4200/).

### Compilar para producción

```bash
npm run build
```

Los archivos compilados se generan en `dist/turno-extra-angular/browser/`.

Para GitHub Pages:

```bash
npm run build -- --base-href /TurnoExtraAngular/
```

## Pruebas

La suite utiliza **Jasmine y Karma** e incluye **24 pruebas**:

| Área | Pruebas |
| --- | ---: |
| Aplicación y estructura principal | 2 |
| Formulario de registro | 11 |
| Tarjeta de juego | 3 |
| Detalle y navegación entre juegos | 5 |
| Precios y descuentos | 2 |
| Carrito de demostración | 1 |
| **Total** | **24** |

Se comprueban, entre otros casos, las validaciones del registro, el acceso a los 12 juegos mediante sus rutas, la actualización al cambiar de identificador, los juegos inexistentes, los productos agotados y la conservación del contador al volver al catálogo.

Para ejecutar una vez sin modo observación:

```bash
npx ng test --watch=false --browsers=ChromeHeadless
```

Para trabajar en modo observación:

```bash
npm test
```

**Validación de esta entrega:** compilación de producción exitosa y 24/24 pruebas aprobadas con Karma/Jasmine en Chrome integrado. El lanzamiento de ChromeHeadless desde el entorno de revisión no estuvo disponible; el comando anterior permite repetir la suite en el terminal local.

La compilación conserva una advertencia no bloqueante: el bundle inicial supera el presupuesto de 500 kB configurado en `angular.json`. No se aumentó ese presupuesto para ocultar la advertencia.

## Estructura del proyecto

```text
TurnoExtraAngular/
├── .github/workflows/deploy.yml
├── public/img/juegos/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   ├── precio-juego/
│   │   │   └── tarjeta-juego/
│   │   ├── data/
│   │   │   ├── categorias.ts
│   │   │   └── juegos.ts
│   │   ├── models/
│   │   │   ├── categoria.ts
│   │   │   └── juego.ts
│   │   ├── pages/
│   │   │   ├── inicio/
│   │   │   ├── categoria/
│   │   │   ├── detalle-juego/
│   │   │   └── registro/
│   │   ├── services/
│   │   │   ├── carrito-demo.ts
│   │   │   └── carrito-demo.spec.ts
│   │   ├── styles/
│   │   │   ├── page.css
│   │   │   ├── card-reveal.css
│   │   │   └── legacy.css
│   │   ├── app.ts
│   │   ├── app.html
│   │   ├── app.css
│   │   ├── app.spec.ts
│   │   ├── app.routes.ts
│   │   └── app.config.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
├── package-lock.json
└── README.md
```

Las pruebas de los componentes y páginas se ubican junto a su implementación en archivos `*.spec.ts`.

## Despliegue

El workflow `.github/workflows/deploy.yml` compila y publica en GitHub Pages cuando se realiza un push a `main`. También puede ejecutarse manualmente desde GitHub Actions.

Utiliza Node.js 24, instala dependencias con `npm ci`, compila con el `base-href` del repositorio y copia `index.html` como `404.html` para permitir la carga de las rutas de Angular en GitHub Pages. Después publica los archivos compilados.

El workflow actual **no ejecuta las pruebas automáticamente**; deben ejecutarse antes de publicar.

- **Repositorio:** [Dizz7/TurnoExtraAngular](https://github.com/Dizz7/TurnoExtraAngular)
- **Sitio del proyecto:** [TurnoExtra en GitHub Pages](https://dizz7.github.io/TurnoExtraAngular/)

Las mejoras locales de esta entrega estarán disponibles en el sitio una vez subidas a `main` y completado correctamente el workflow. La validación local no confirma que la versión pública ya contenga estos cambios.

## Alcance y estado

**Experiencia 2 — Semana 5: funcionalidades implementadas y verificadas localmente.**

La aplicación es una demostración de frontend. El catálogo utiliza datos locales y no existe conexión a un backend, base de datos, autenticación ni pasarela de pago. El formulario valida datos y el carrito mantiene un contador temporal.

Las tareas del proyecto se organizan mediante Trello y el control de versiones se realiza con Git y GitHub.

## Autor

**Daniel Alarcón**\
Duoc UC — Desarrollo Full Stack II (DSY2202)\
Experiencia 2 — Semana 5\
2026

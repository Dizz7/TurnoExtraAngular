# TurnoExtraAngular 🎲

Proyecto académico desarrollado para la asignatura **Desarrollo Full Stack II (DSY2202)** de Duoc UC.

**Estudiante:** Daniel Alarcón\
**Experiencia:** 2\
**Semana:** 6\
**Framework:** Angular 22

## Descripción

**TurnoExtra** es una tienda ficticia de juegos de mesa que permite explorar categorías, consultar el detalle de cada juego y registrarse, iniciar sesión, editar su perfil y realizar compras simuladas. El administrador también puede gestionar el stock.

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
| `/registro` | Registro de cuentas cliente |
| `/login` | Inicio de sesión |
| `/recuperar` | Recuperación local simulada |
| `/perfil` | Edición de perfil; requiere sesión |
| `/carrito` | Productos, cantidades y total |
| `/pago` | Compra simulada; requiere sesión |
| `/admin` | Gestión de stock; exclusivo de administradores |
| `/sin-acceso` | Mensaje de acceso restringido |

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
- El servicio `CarritoDemo`, proporcionado en la raíz de la aplicación, mantiene mediante Signals las líneas, cantidades, total y último juego agregado.

El catálogo y el detalle comparten ese estado durante la navegación. El contador se reinicia al recargar la página: no se guarda en una base de datos ni en el almacenamiento del navegador. El pago simulado genera un comprobante, descuenta stock y vacía el carrito, sin cobros reales. Cerrar sesión también vacía el carrito.

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

El registro crea cuentas cliente en este navegador, impide duplicar correo o nombre de usuario y limpia las contraseñas después del éxito.

### Cuentas y roles de demostración

| Rol | Correo | Contraseña inicial | Privilegios |
| --- | --- | --- | --- |
| Cliente | cliente@turnoextra.demo | Cliente123 | Editar su perfil y realizar compras simuladas |
| Administrador | admin@turnoextra.demo | Admin123 | Lo anterior, además de actualizar stock en `/admin` |

Las cuentas iniciales se crean en el primer uso. Las nuevas cuentas siempre son clientes; el perfil no puede cambiar el rol. Los guards comprueban el acceso incluso mediante URL directa y el servicio de catálogo comprueba el permiso al modificar stock.

Usar únicamente datos ficticios. Las cuentas se guardan en `localStorage` bajo `turnoextra.cuentas.v1`; la sesión usa `sessionStorage` bajo `turnoextra.sesion.v1`. Las contraseñas se derivan con PBKDF2/SHA-256, sal aleatoria y 100.000 iteraciones, sin guardarlas como texto legible. Es una simulación frontend: almacenamiento y permisos son manipulables desde el navegador y no sustituyen la autenticación ni autorización de un servidor.

La recuperación muestra un código local válido por 10 minutos, de un solo uso y con máximo de cinco intentos incorrectos. No envía correo. Cambiar la contraseña de la cuenta activa cierra su sesión en esta instancia.

Inventario, carrito y comprobante duran durante la navegación y se reinician al recargar. El pago no solicita datos bancarios ni integra una pasarela.

### Recorrido de la tarjeta 3

1. Registrar una cuenta ficticia e iniciar sesión con ella.
2. Editar el perfil y comprobar errores por correo o usuario duplicado.
3. Abrir `/admin` como cliente y comprobar el acceso restringido.
4. Agregar juegos, cambiar cantidades y confirmar el pago simulado.
5. Cerrar sesión y entrar como administrador; cambiar stock y revisar disponibilidad.
6. Generar el código de recuperación, copiarlo y guardar una nueva contraseña válida; comprobar el acceso.

### Validación de formularios — tarjeta 4

Registro, login, recuperación, perfil, stock y pago usan Reactive Forms. Registro y recuperación comparten las cuatro reglas de contraseña: mínimo 6, máximo 18, mayúscula y número. La confirmación se valida a nivel del grupo. Nombre y usuario rechazan texto compuesto solo por espacios; dirección sigue siendo opcional.

Los errores aparecen junto al campo después de interactuar o intentar enviar, con `aria-invalid` y `aria-describedby`. Editar datos retira mensajes de éxito o error anteriores. Los formularios asíncronos bloquean sus campos durante el envío y evitan peticiones duplicadas. Limpiar registro y descartar cambios del perfil restablecen valores y estados; las claves se limpian después de un registro o recuperación exitosos.

### Directivas y vinculación de datos

La aplicación utiliza interpolación, vinculación de propiedades y eventos, `routerLink`, `routerLinkActive`, `*ngFor`, `*ngIf` y los bloques de control `@for` y `@if`.

El buscador del catálogo utiliza `[(ngModel)]` con `standalone: true` y `FormsModule`, fuera de los formularios reactivos. Filtra nombre y descripción dentro de la categoría actual, ignora tildes y mayúsculas, informa la cantidad de resultados y permite limpiar la búsqueda. Cambiar de categoría reinicia el término.

Se conservan `*ngFor` y `*ngIf` en `categoria.html` como ejemplos tradicionales compatibles con la versión instalada. El menú y las tarjetas usan `@for` y `@if`. La comunicación mediante `@Input`, `@Output` y el servicio de carrito se verifica también desde resultados filtrados.

El encabezado agrupa las cuatro categorías en un desplegable controlado por Angular. Funciona con clic, Tab y Escape, expone su estado mediante `aria-expanded`, devuelve el foco al botón al cerrar con Escape y cierra al seleccionar una ruta o hacer clic fuera. El menú móvil también se cierra al navegar. Bootstrap conserva el diseño responsive; no compite con Angular por el estado de apertura. Los enlaces internos usan fragmentos del Router y desplazamiento a anclas, conservando la ruta actual.

### Estilos y diseño responsive

Los estilos específicos se encuentran en el CSS de cada componente. `src/styles.css` conserva la fuente Nunito, la paleta de colores, los estilos base, los botones compartidos y las preferencias de movimiento reducido.

Las hojas `app/styles/page.css` y `card-reveal.css` se reutilizan mediante `styleUrls` y Angular las encapsula para cada componente. `cuenta.css` se comparte de forma encapsulada entre las pantallas nuevas. `legacy.css` conserva estilos históricos y no se carga en la aplicación.

Se mantiene Bootstrap para la cuadrícula y la navegación responsive. En Semana 5 se revisaron las pantallas existentes en anchos de 390, 768 y 1280 píxeles, y la página de detalle en móvil y escritorio. Incluir las nuevas pantallas de cuenta y compra en la revisión final de tres tamaños de Semana 6.

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

La suite utiliza **Jasmine y Karma** e incluye **69 pruebas**:

| Área | Pruebas |
| --- | ---: |
| Aplicación y estructura principal | 2 |
| Formulario de registro | 11 |
| Tarjeta de juego | 3 |
| Detalle y navegación entre juegos | 5 |
| Precios y descuentos | 2 |
| Carrito de demostración | 1 |
| Cuentas y permisos | 8 |
| Compra, inventario y envío de pago | 7 |
| Guards de rutas | 3 |
| Envío de recuperación | 1 |
| Reglas compartidas de cuenta | 9 |
| Retroalimentación de formularios | 6 |
| Menú desplegable | 4 |
| Búsqueda, comunicación y enlaces internos | 7 |
| **Total** | **69** |

Se comprueban, entre otros casos, las validaciones del registro, el acceso a los 12 juegos mediante sus rutas, la actualización al cambiar de identificador, los juegos inexistentes, los productos agotados y la conservación del contador al volver al catálogo.

Para ejecutar una vez sin modo observación:

```bash
npx ng test --watch=false --browsers=ChromeHeadless
```

Para trabajar en modo observación:

```bash
npm test
```

**Validación final — tarjeta 9 (24 de noviembre de 2026):** 69 de 69 pruebas aprobadas con Jasmine/Karma y Chrome integrado 158; compilación de producción exitosa. Ambos procesos terminaron con código de salida 0. Se supera el mínimo de cuatro pruebas solicitado.

En el entorno de revisión se utilizó `CI=true NG_BUILD_PARALLEL_TS=0` para evitar el fallo previo del compilador paralelo. Karma se ejecutó una sola vez con una configuración temporal fuera del repositorio y captura manual del navegador integrado, ya que el lanzamiento automático de ChromeHeadless no estaba disponible. Al cerrar el servidor apareció un aviso de desconexión después de `TOTAL: 69 SUCCESS`; no hubo pruebas fallidas. Los comandos anteriores permiten repetir las pruebas desde el terminal local con ChromeHeadless.

**Corrección posterior de la prueba de foco:** se reprodujo el fallo de Escape con un ancho de 800 px: la prueba intentaba enfocar un enlace dentro del menú móvil cerrado. Ahora abre el menú antes de enfocar y comprueba el foco inicial, el retorno al botón, el cierre del desplegable y que el menú principal permanezca abierto. La suite volvió a aprobar 69/69 pruebas en Chrome integrado a 800 y 1280 px. ChromeHeadless no pudo iniciarse desde el entorno de revisión; repetir el comando anterior en el terminal local para confirmar allí el resultado. El aviso de deprecación de Jasmine sobre carga como módulo ES es independiente de esta corrección y sigue pendiente de revisar.

El paquete inicial de producción resultó de **728,38 kB** (transferencia estimada: **140,55 kB**). Supera el umbral de advertencia de 500 kB y permanece por debajo del límite de error de 1 MB. No se modificaron los presupuestos. Esta ejecución confirma las pruebas existentes; no constituye una medición del porcentaje de cobertura de pruebas.

La compilación conserva una advertencia no bloqueante: el bundle inicial supera el presupuesto de 500 kB configurado en `angular.json`. No se aumentó ese presupuesto para ocultar la advertencia.

## Documentación técnica con Compodoc

Compodoc **2.0.0** se instala como dependencia de desarrollo mediante `npm ci`; no requiere una instalación global.

```bash
npm run docs:build
npm run docs:serve
```

El primer comando genera `documentation/`. El segundo vuelve a generar la documentación y la sirve en [http://127.0.0.1:8080/](http://127.0.0.1:8080/); detenerlo con Ctrl+C. Para regenerarla automáticamente mientras se edita el código, usar `npm run docs:watch`.

La configuración se encuentra en `.compodocrc.json`. `tsconfig.doc.json` incluye los archivos TypeScript de `src/` y excluye únicamente las pruebas `*.spec.ts` y sus utilidades en `src/app/testing/`. La carpeta generada se omite de Git y puede reconstruirse con los comandos anteriores.

La primera generación reconoce 16 componentes, 3 servicios, 2 guards y 6 interfaces, además de funciones, variables y tipos. **La tarjeta 7 incorpora comentarios JSDoc en componentes, servicios, modelos, guards, datos, configuración y validadores.** Los métodos documentan parámetros, resultados y errores cuando corresponde, incluidos los límites de la simulación local. La generación posterior informa 100 % en las 41 entidades del reporte de cobertura, sin ampliar las exclusiones. Este porcentaje mide presencia de comentarios en los elementos evaluados por Compodoc, no cobertura de pruebas ni corrección funcional. La revisión de la tarjeta 8 está completada: generación correcta, cobertura del 100 % y comprobación de navegación y presentación por muestreo.

Se fija `i18next` a `26.3.4` mediante un override limitado a Compodoc, para corregir la dependencia vulnerable incluida inicialmente ([aviso de seguridad](https://github.com/advisories/GHSA-6jcc-5g8w-32mx)). La instalación resultante informó cero vulnerabilidades en la revisión de esta tarjeta.

### Revisión de la documentación — tarjeta 8

Revisión local realizada el 24 de noviembre de 2026:

- Generación correcta con `npm run docs:build`: 39 páginas HTML.
- Cobertura documental: 41 entidades documentadas, ninguna parcial ni sin documentar; 100 % en el reporte de Compodoc.
- Comprobación de 1.018 referencias locales a archivos y secciones, sin destinos ausentes en la generación revisada. No incluye verificar sitios externos.
- Revisión en navegador de cobertura, descripción y API de `Auth`, parámetros, resultados y errores; ficha, plantilla y estilos de `Registro`; índice de rutas con enlaces a sus componentes.
- Se conservan las exclusiones de pruebas y utilidades de pruebas. La carpeta `documentation/` se regenera localmente y permanece fuera de Git.

Para repetir la revisión, ejecutar `npm run docs:serve` y abrir `http://127.0.0.1:8080/`. Consultar **Documentation coverage**, **Injectables → Auth → API**, **Components → Registro** y **Routes**. Detener el servidor con Ctrl+C antes de iniciar otra instancia en el mismo puerto.

Esta revisión no sustituye las pruebas funcionales ni su cobertura. La suite de Jasmine/Karma y la compilación final se comprobaron en la tarjeta 9; sus resultados se detallan en la sección Pruebas.

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
│   │   ├── guards/
│   │   │   └── acceso.ts
│   │   ├── models/
│   │   │   ├── categoria.ts
│   │   │   ├── juego.ts
│   │   │   └── usuario.ts
│   │   ├── pages/
│   │   │   ├── inicio/
│   │   │   ├── categoria/
│   │   │   ├── detalle-juego/
│   │   │   ├── registro/
│   │   │   ├── login/
│   │   │   ├── recuperar/
│   │   │   ├── perfil/
│   │   │   ├── carrito/
│   │   │   ├── pago/
│   │   │   ├── admin/
│   │   │   └── sin-acceso/
│   │   ├── services/
│   │   │   ├── almacen.ts
│   │   │   ├── auth.ts
│   │   │   ├── catalogo.ts
│   │   │   └── carrito-demo.ts
│   │   ├── styles/
│   │   │   ├── page.css
│   │   │   ├── cuenta.css
│   │   │   ├── card-reveal.css
│   │   │   └── legacy.css
│   │   ├── testing/
│   │   ├── validators/
│   │   │   └── cuenta.ts
│   │   ├── app.ts
│   │   ├── app.html
│   │   ├── app.css
│   │   ├── app.spec.ts
│   │   ├── app.routes.ts
│   │   └── app.config.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── .compodocrc.json
├── tsconfig.doc.json
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

**Experiencia 2 — Semana 6: tarjetas 3 a 9 completadas; entrega sumativa en preparación.**

La aplicación es una demostración frontend con cuentas locales y dos roles. No tiene backend, base de datos remota, correo real ni pasarela de pago. Compodoc genera la documentación con los comentarios JSDoc incorporados y su revisión está completada. La validación final de pruebas y compilación está completada. Quedan el cierre de README/GitHub/Trello (tarjeta 10), el video (tarjeta 11) y la entrega final (tarjeta 12).

Las tareas del proyecto se organizan mediante Trello y el control de versiones se realiza con Git y GitHub.

## Autor

**Daniel Alarcón**\
Duoc UC — Desarrollo Full Stack II (DSY2202)\
Experiencia 2 — Semana 6\
2026

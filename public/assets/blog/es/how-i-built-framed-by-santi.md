## 📸 Introducción: un portfolio de fotografía en producción al tercer día

[Framed by Santi](https://framedbysanti.rootdevs.es) es la web de [@framedbysanti](https://www.instagram.com/framedbysanti), un fotógrafo aficionado que dispara con una Fujifilm X100VI por las calles de Nueva York. Tiene dos caras: una web pública para enseñar sus fotos y un panel privado para que él mismo publique sin depender de nadie.

Empezó como un regalo para un amigo, pero este post no va de eso: va de **cómo la construí en muy poco tiempo, asistido por Claude Code, sin renunciar a la calidad**.

Las cifras, sacadas del repositorio:

- 📅 **8 días con commits**, del 13 al 22 de octubre de 2026.
- 🚀 **En producción el día 3**: web pública y panel privado.
- 🔀 **177 commits** y **35 pull requests**, todos revisados antes de llegar a producción.
- 🧪 **117 archivos de test** con **740 casos**.
- 🌍 **Tres idiomas**: inglés, español y portugués.
- 💯 **100 en las cuatro categorías de Lighthouse** (escritorio, red 4G).

<img class="theme-img theme-img--dark" src="/assets/images/blog/framedBySanti/commits_ES_dark.webp" alt="Gráfico de barras de commits por día del 13 al 22 de octubre de 2026: 1, 43, 75 (día de la subida a producción), 3, ninguno el fin de semana, 22, 7, 23 y 3">
<img class="theme-img theme-img--light" src="/assets/images/blog/framedBySanti/commits_ES_light.webp" alt="Gráfico de barras de commits por día del 13 al 22 de octubre de 2026: 1, 43, 75 (día de la subida a producción), 3, ninguno el fin de semana, 22, 7, 23 y 3">

---

## 🤖 Cómo lo trabajé: agentes de IA, pero con método

La construí en la terminal con agentes de IA (Claude Code) configurados con [gentle-ai](https://github.com/Gentleman-Programming/gentle-ai), la herramienta de código abierto de [Alan Buscaglia](https://www.linkedin.com/in/alanbuscaglia/) (Gentleman Programming). No es "pedirle una web a la IA": es un flujo de trabajo con reglas.

- **ODD (Organic-Driven Development):** los cambios pequeños se hacen directamente; el trabajo grande lleva un documento de tareas con los requisitos copiados literalmente, para que nada se pierda entre sesiones.
- **Engram:** memoria persistente. Cada decisión, error resuelto o preferencia queda guardada y el agente la recupera en la siguiente sesión. Por ejemplo: "pregunta antes de hacer push, incluso a staging".
- **Tests primero:** para cada regla nueva, primero un test que falla y después el código que lo hace pasar.
- **Ramas y revisión:** cada cambio sale de una rama, sube a `develop`, lo pruebo en `staging` y solo llega a `main` (producción) cuando yo lo apruebo.

El reparto fue claro:

- 🤖 **El agente:** escribió el código y los tests, investigó los errores, propuso soluciones y abrió los PR.
- 🙋 **Yo:** decidí qué construir y cómo tenía que funcionar, revisé cada cambio, corregí al agente cuando se equivocaba y aprobé cada subida a producción.

> 💡 La IA escribe rápido; lo que hace que el resultado sea bueno es **verificar**. Cada PR pasó lint, tests y build, y ningún cambio llegó a producción sin mi aprobación.

---

## 🧱 Stack y arquitectura

<img class="theme-img theme-img--dark" src="/assets/images/blog/framedBySanti/architecture_ES_dark.webp" alt="Diagrama de arquitectura de Framed by Santi: el navegador recibe la app estática de Vercel, lee Firestore por REST en las páginas públicas y usa Auth y el SDK de Firebase solo en el panel; las fotos llegan desde la CDN de Cloudinary y el panel las sube directamente con una firma; las funciones de Vercel limpian Cloudinary, envían el email con Resend, traducen con DeepL y firman las subidas, y todas las del panel comprueban en Firestore que el usuario es admin con su propio token">
<img class="theme-img theme-img--light" src="/assets/images/blog/framedBySanti/architecture_ES_light.webp" alt="Diagrama de arquitectura de Framed by Santi: el navegador recibe la app estática de Vercel, lee Firestore por REST en las páginas públicas y usa Auth y el SDK de Firebase solo en el panel; las fotos llegan desde la CDN de Cloudinary y el panel las sube directamente con una firma; las funciones de Vercel limpian Cloudinary, envían el email con Resend, traducen con DeepL y firman las subidas, y todas las del panel comprueban en Firestore que el usuario es admin con su propio token">

**Frontend**

- **Angular 22** sin Zone.js (*zoneless*), con **Signals** para todo el estado y componentes *standalone*.
- **TypeScript 6** en modo estricto: sin `any` y con tipos de retorno explícitos.
- **CSS nativo** con *nesting*, BEM y *mobile-first*. Sin preprocesador.
- **Vite 8** con `@analogjs/vite-plugin-angular` como única herramienta de build.
- **Transloco** para los tres idiomas.

**Servicios**

- **Vercel:** hosting y cuatro funciones *serverless*.
- **Firebase Auth y Firestore:** login del panel y datos (series, temas, ajustes).
- **Cloudinary:** almacenamiento y entrega de fotos, con subidas firmadas.
- **DeepL:** traducción automática de los textos.
- **Resend:** el email del formulario de contacto.

**Las cuatro funciones de `api/`**

| Función | Qué hace |
| --- | --- |
| `sign-upload` | Comprueba que quien llama es admin y firma la subida a Cloudinary. |
| `translate` | Proxy a DeepL, solo para admins, con 10 segundos de límite. |
| `cleanup-photos` | Borra de Cloudinary las fotos que ya no usa nada. |
| `contact` | Valida el formulario y envía el email con Resend. |

Las tres del panel comprueban que el usuario es admin de la misma forma: leen su documento en Firestore **con el token del propio usuario**, así que son las reglas de seguridad de Firestore las que deciden, no un secreto en el servidor.

---

## 🖼️ La web pública

- **Las publicaciones son series**, como un carrusel de Instagram: varias fotos con un título y una historia.
- **Home** con la última serie en un carrusel que se puede arrastrar.
- **Galería** con una sección por serie y filtro por temas.
- **Visor a pantalla completa:** zoom y desplazamiento (pellizcar, arrastrar, doble toque, rueda), gestos para pasar de foto, miniaturas, precarga de la siguiente foto y un fundido entre fotos.
- **View Transitions** entre páginas, con un efecto de iris como el diafragma de una cámara.
- **Sobre mí** con la historia de Santi en sus palabras y un formulario de contacto. Su email nunca llega a la página.
- **Idiomas de verdad:** fechas, números y plurales siguen el idioma activo (`en-US`, `es-ES`, `pt-PT`).
- Con `prefers-reduced-motion` no se anima nada.

<p align="center"><a href="https://framedbysanti.rootdevs.es/" target="_blank" rel="noopener"><img src="/assets/images/blog/framedBySanti/home_ES.webp" alt="Portada de Framed by Santi: foto del Flatiron a pantalla completa con el nombre de Santi y los botones a la galería y a Instagram" width="720"></a><br><em>La home. Haz clic para verla en vivo.</em></p>

<p align="center"><a href="https://framedbysanti.rootdevs.es/gallery" target="_blank" rel="noopener"><img src="/assets/images/blog/framedBySanti/gallery_ES.webp" alt="Galería de Framed by Santi: filtro por temas y una serie con su carrusel de fotos" width="720"></a><br><em>La galería con el filtro por temas.</em></p>

<p align="center"><a href="https://framedbysanti.rootdevs.es/gallery" target="_blank" rel="noopener"><img src="/assets/images/blog/framedBySanti/viewer_ES.webp" alt="Visor de Framed by Santi: una foto en grande con flechas, controles de zoom y la tira de miniaturas" width="720"></a><br><em>El visor: zoom, flechas y miniaturas.</em></p>

---

## 🔐 El panel privado

El panel vive en `/admin` y no tiene ningún enlace público: se llega solo escribiendo la ruta.

- **Biblioteca de series:** interruptor de publicada o borrador, editar y borrar.
- **Editor de series:** arrastrar fotos, previsualizarlas, reordenarlas y escribir los textos en una pestaña por idioma.
- **Fotos preparadas en el navegador:** antes de subir, cada foto se redimensiona y se recomprime hasta un máximo de 6000 px y 10 MB, bajando la calidad del JPEG por pasos hasta que cabe. Así se respetan los límites del plan gratuito de Cloudinary sin que Santi tenga que pensar en ello.
- **Traducción automática:** Santi escribe en un idioma y, al publicar, DeepL rellena los que faltan. Cada idioma se puede corregir a mano.
- **Temas:** se crean y se borran desde el panel.
- **Limpieza automática:** al abrir la biblioteca, se borran en segundo plano las fotos de Cloudinary que ya no usa ninguna serie.
- **Ajustes:** foto de perfil y cambio de contraseña.
- **Y un *easter egg*** solo para el admin: un rincón para seguir con fuerzas. 💪

<p align="center"><img src="/assets/images/blog/framedBySanti/dashboard-library_ES.webp" alt="Biblioteca del panel privado: las series con su portada, el filtro por publicadas y borradores, y el interruptor para publicar" width="720"><br><em>La biblioteca: cada serie se publica o se pasa a borrador con un interruptor.</em></p>

<p align="center"><img src="/assets/images/blog/framedBySanti/dashboard-editor_ES.webp" alt="Editor de series del panel privado: las fotos de la serie a la izquierda y, a la derecha, los textos con una pestaña por idioma y el botón Traducir" width="720"><br><em>El editor: fotos a la izquierda, textos por idioma y el botón para traducir a la derecha.</em></p>

---

## ⚡ Rendimiento: medir, recortar y volver a medir

El rendimiento no lo dejé para el final: medí con Lighthouse, ataqué lo que más pesaba y volví a medir. Así queda hoy en escritorio con red 4G:

<p align="center"><img src="/assets/images/blog/framedBySanti/lighthouse.webp" alt="Informe de Lighthouse de Framed by Santi en escritorio con red 4G: 100 en Performance, Accessibility, Best Practices y SEO" width="420"></p>

### Primera ronda: de 44 a 73 en móvil

La primera medición, el 15 de octubre en móvil con 4G lenta (el caso más exigente), dio un rendimiento de **44-48**, con un CLS de **0,333** y un LCP de **7,5 s**. Con tres cambios lo arreglé casi todo:

- **Precargar la foto principal de la home** desde `index.html`, con `fetchpriority="high"`. El script de precarga va antes de cualquier hoja de estilos, porque una hoja pendiente bloquea los scripts que vienen detrás.
- **La home va en el paquete principal**, sin carga diferida, para no añadir un viaje de red antes de pintar la primera página.
- **El footer se pinta después de la primera navegación.** Era el responsable de todo el CLS. El carrusel de la última serie también reserva su espacio mientras carga.

Resultado en móvil: **rendimiento 73, CLS 0,001 y LCP 5,6 s**.

### Segunda ronda: quitar lo que no hacía falta

- **Fuentes propias.** Las sirvo desde el propio dominio, sin la ida y vuelta a Google Fonts.
- **Firebase fuera de las páginas públicas.** Al revisar el build vi que el paquete de Firebase pesaba **563 kB (168 kB comprimidos)** y se precargaba en todas las páginas, y que cada visita abría además un iframe de autenticación de Google de unos **93 KiB**. Todo eso para leer unas series que son públicas. Ahora las páginas públicas leen Firestore con `fetch` contra su API REST, con las mismas reglas de seguridad.
- **El login solo se carga si hace falta:** una marca local indica que en ese navegador ya entró un admin. Los visitantes nunca descargan Firebase Auth. Y la marca no da ningún permiso: la comprobación real sigue siendo Firebase.

Resultado en escritorio con red 4G: **100 en Performance, Accessibility, Best Practices y SEO**.

### Lo que viene de serie

- **Imágenes responsive:** cada foto se sirve desde Cloudinary con `srcset` en cinco anchos (480, 800, 1200, 1600 y 2400 px) y formato y calidad automáticos.
- **Cada página se carga cuando se visita** (*lazy loading*), salvo la home.

> 💡 La lección: **medir antes de optimizar**. El mayor problema de CLS era un footer, y el mayor peso, una librería que los visitantes ni siquiera usaban.

---

## 🛡️ Seguridad

- **Reglas de Firestore que deniegan todo por defecto.** El público solo puede leer las series publicadas, y los ajustes solo aceptan los campos permitidos.
- **Subidas firmadas:** el navegador nunca tiene permiso para subir a Cloudinary por su cuenta; cada subida la firma una función que antes comprueba que eres admin.
- **Formulario de contacto** con límites de longitud, HTML escapado y un campo trampa: los bots lo rellenan, reciben un "OK" y no se envía nada.
- **Staging no se indexa:** los builds de staging llevan `noindex` y un `robots.txt` que lo prohíbe todo.

---

## 🧪 Calidad: el orden no se negocia, lo impone el linter

Cuando la IA escribe la mayor parte del código, las convenciones no pueden depender de que alguien se acuerde de ellas. Por eso las convertí en reglas: si el código no sigue el orden, **el lint falla**, da igual quién lo haya escrito. Las reglas están desde el primer día del proyecto.

**Cinco reglas de ESLint propias**, escritas para este proyecto:

| Regla | Qué obliga | ¿Se arregla sola? |
| --- | --- | --- |
| `component-decorator-order` | Las propiedades de `@Component` siempre en el mismo orden: `standalone`, `changeDetection`, `imports`, `selector`, `styleUrl`, `templateUrl`... | ✅ |
| `inject-before-signals` | Las llamadas a `inject()` van antes que cualquier otra propiedad de la clase. | ✅ |
| `alphabetical-component-imports` | El array `imports` del componente, en orden alfabético. | ✅ |
| `alphabetical-inputs-signals` | Los `input()` y los `signal()`, en orden alfabético dentro de su grupo. | ❌ |
| `alphabetical-interface-members` | Los miembros de interfaces y tipos, en orden alfabético. | ❌ |

Las dos últimas solo avisan, no reordenan solas: en las interfaces, por ejemplo, mover miembros puede romper código que usa *spread* u `Object.assign`, así que prefiero que lo decida una persona.

**Y el resto del orden, también automático:**

- **Imports** agrupados y ordenados: primero Angular y librerías externas, luego los alias internos (`@core`, `@features`...) y al final los relativos.
- **Claves de objetos** en orden alfabético en datos, constantes, modelos e interfaces.
- **JSON de traducción** con las claves ordenadas, sin comentarios.
- **Prettier** con plugins que ordenan las propiedades CSS, los atributos HTML y las claves de los JSON.
- **TypeScript estricto:** `any` es un error, los tipos de retorno son obligatorios y se usa siempre `===`.

### El patrón diccionario

Hay una práctica que pido siempre y que no impone ningún linter: el **patrón diccionario**, que en inglés se conoce como *object lookup* (y como *dispatch table* cuando los valores son funciones). Cuando una función traduce un valor a otro, nada de `switch` ni de `if/else` encadenados: un objeto tipado con `Record`, acceso por clave y un valor por defecto con `??`.

```typescript
const TRANSLATE_ERRORS: Record<TranslationError['reason'], string> = {
  failed: 'admin.editor.translate.errors.failed',
  limit: 'admin.editor.translate.errors.limit',
  'not-allowed': 'admin.editor.translate.errors.notAllowed',
};
```

Tres ventajas:

- **Se lee de un vistazo:** todos los casos en una tabla, en lugar de repartidos entre ramas.
- **TypeScript vigila que no falte ninguno:** con `Record<TranslationError['reason'], string>`, si mañana aparece un motivo de error nuevo, el código no compila hasta que tenga su texto.
- **Añadir un caso es añadir una línea**, sin tocar la lógica.

Si en vez de un valor necesitas ejecutar algo, los valores pasan a ser funciones: es la *dispatch table*. Aquí hay una trampa que yo mismo tenía en mis apuntes:

```javascript
const LOKI_DEFAULT_DISFRAZ = 'Loki';

const LOKI_DISFRACES = {
  Hulk: () => 'Thanos',
  Thor: () => 'Odin',
};

// ❌ Si el enemigo no está en la tabla: TypeError, ... is not a function
const disfraz = LOKI_DISFRACES[enemy]() ? LOKI_DISFRACES[enemy]() : LOKI_DEFAULT_DISFRAZ;

// ✅ Con ?.() no se ejecuta nada si no existe, y ?? pone el valor por defecto
const disfraz = LOKI_DISFRACES[enemy]?.() ?? LOKI_DEFAULT_DISFRAZ;
```

La primera versión, además de romperse con una clave desconocida, ejecuta la función dos veces. Y `??` es mejor que el ternario: solo usa el valor por defecto cuando la clave no existe, no cuando el resultado es un `''` o un `0` válidos.

No es dogma: en las plantillas uso `@switch` cuando cada caso pinta algo distinto, y queda algún `switch` donde cada rama hace más que devolver un valor.

**Y los tests:**

- **740 casos** en 117 archivos, con Vitest y JSDOM, también para las funciones de `api/`.
- **Commits convencionales** validados por un script.

---

## 🐛 Cinco problemas reales (y cómo los resolví)

### 1. Pestañas que se rompían después de cada deploy

Una pestaña abierta antes de un deploy pedía archivos del build anterior, que ya no existían. Las páginas que se cargan al visitarlas (galería, Sobre mí, el panel) **no se abrían y no decían nada**.

La solución fue un manejador de errores de navegación que, si falla la descarga de una parte de la app, recarga esa página desde cero para obtener el build nuevo. Solo lo hace para errores de descarga y una sola vez seguida por página, así que una caída real no puede provocar un bucle de recargas.

### 2. Quitar Firebase de las páginas públicas

El ahorro está contado en la sección de rendimiento; lo delicado fue la seguridad. Separé el login en un almacén que se carga bajo demanda, y la marca local que decide cuándo cargarlo **no concede nada**: si alguien la falsifica, solo consigue descargar Firebase Auth, porque la comprobación real sigue siendo el login y el documento de admin en Firestore.

### 3. Las funciones de Vercel y los módulos ES

Las funciones de `api/` fallaban en Vercel: como módulos ES nativos, los imports relativos necesitan la extensión `.js`. Además del arreglo, añadí un test que comprueba todos los imports de `api/` para que no vuelva a pasar.

### 4. Una limpieza de fotos que no puede equivocarse

Borrar fotos "huérfanas" es fácil; borrar solo las huérfanas, no tanto. La limpieza fue aprendiendo con cada caso:

- Si no puede leer las series, **no borra nada**. Una lectura fallida no significa que no haya fotos en uso.
- Solo da por borradas las fotos que Cloudinary **confirma**.
- Respeta la foto de perfil y las del rincón del admin, que viven en la misma carpeta.
- No toca fotos de menos de 7 días y borra como mucho 100 por ejecución.

### 5. "Guardando…" para siempre

Al guardar la foto de perfil con una conexión lenta, si el guardado tardaba demasiado la app preguntaba al servidor si había llegado... sin límite de tiempo para esa pregunta. Ahora esa comprobación tiene su propio límite de 5 segundos, y la lectura de la sesión guardada en IndexedDB se rinde a los 2 segundos, porque algunos navegadores nunca responden.

---

## 📅 Día a día

| Día | Commits | Qué pasó |
| --- | --- | --- |
| 13 oct | 1 | Proyecto creado: Angular, i18n y herramientas. |
| 14 oct | 43 | Prototipo completo de la web pública y fotos desde Cloudinary. |
| 15 oct | 75 | Reglas de Firestore, login, subidas firmadas, editor, traducción, temas, limpieza, página 404. **Primera subida a producción.** |
| 16 oct | 3 | Fuentes propias. |
| 19 oct | 22 | Páginas públicas sin el SDK, login bajo demanda, ajustes del panel. |
| 20 oct | 7 | Historia de Sobre mí y ajustes en móvil. |
| 21 oct | 23 | Icono de Instagram, el rincón del admin y el formulario de contacto. |
| 22 oct | 3 | Pulido del email de contacto. |

---

## 🎯 Lecciones

1. **La velocidad sale del método, no solo de la IA.** Requisitos por escrito, tests primero, ramas y revisión: sin eso, 75 commits en un día serían 75 problemas.
2. **La memoria persistente cambia el juego.** Que el agente recuerde decisiones y errores de sesiones anteriores evita repetirlos.
3. **Verificar gana a generar.** Nada llegó a producción sin pasar tests, lint y build.
4. **Los servicios gratuitos dan para mucho** si diseñas pensando en sus límites (Cloudinary, Firebase, DeepL Free, Resend y Vercel).
5. **La seguridad no se delega en el frontend.** Las reglas de Firestore y las funciones con comprobación de admin son las que protegen; la interfaz solo acompaña.

> ⭐ **gentle-ai en GitHub:** [github.com/Gentleman-Programming/gentle-ai](https://github.com/Gentleman-Programming/gentle-ai). Si te resulta útil, dale una estrella.

<p align="center"><a href="https://github.com/Gentleman-Programming/gentle-ai"><img width="220" src="https://raw.githubusercontent.com/Gentleman-Programming/gentle-ai/main/docs/assets/brand/built-with-gentle-ai.png" alt="Built with Gentle-AI" /></a></p>

## 🗺️ Introducción: un mapa vacío

Acababa de subir un año entero de fotos del móvil a mi servidor de [Immich](https://immich.app/), la alternativa autoalojada a Google Fotos. Lo primero que hice, como todo el mundo, fue abrir el mapa para ver los viajes. Y ahí estaba el hueco: **ni una sola foto del viaje a Nueva York** (del 24 de octubre al 8 de noviembre de 2025). Casi dos mil fotos y vídeos, todos con la etiqueta *"sin ubicación"*.

Las fotos no se habían perdido. Lo que se había perdido era **dónde** las hice.

> 💡 Spoiler: 1.855 de 1.928 fotos (el 96 %) volvieron al mapa en unos 30 segundos, sin modificar ni un solo archivo original. La pieza clave fue algo que no había mirado nunca: el historial de la Cronología de Google Maps.

---

## 🤖 Cómo lo trabajé: iterando con agentes

Esto tampoco lo hice solo. Trabajé en la terminal con agentes de IA (Claude Code) configurados con [gentle-ai](https://github.com/Gentleman-Programming/gentle-ai), una herramienta de código abierto ([web oficial](https://gentle-ai.gentlemanprogramming.com/)) que configura los agentes que ya usas con memoria persistente, Organic-Driven Development, skills y orquestación de sub-agentes, sin atarte a ninguno.

**Lo que aportó gentle-ai en este caso:**

- **Engram:** memoria persistente entre sesiones. El trabajo técnico se hizo en la sesión de mi servidor y este post se escribió días después desde otro proyecto, partiendo de las notas y los resultados que el agente había guardado.
- **ODD (Organic-Driven Development):** un flujo ligero, sin commits ni cambios irreversibles sin mi permiso explícito.
- **Verificación antes que acción:** cada paso que tocaba datos reales empezó con una prueba pequeña y comprobable.

gentle-ai lo creó [Alan Buscaglia](https://www.linkedin.com/in/alanbuscaglia/) (Gentleman Programming), y su regla para trabajar con IA encaja con todo este post: *"verifying beats generating"*, es decir, verificar gana a generar. Aquí, literalmente: antes de generar una sola coordenada, verificamos dónde se había perdido la original.

> ⭐ **gentle-ai en GitHub:** [github.com/Gentleman-Programming/gentle-ai](https://github.com/Gentleman-Programming/gentle-ai). Si te resulta útil, dale una estrella: ayuda a que más gente lo encuentre.

<p align="center"><a href="https://github.com/Gentleman-Programming/gentle-ai"><img width="220" height="95" loading="lazy" src="/assets/images/built-with-gentle-ai.webp" alt="Built with Gentle-AI" /></a></p>

El reparto fue claro:

- 🤖 **El agente:** revisó el EXIF de las fotos en el servidor, consultó la base de datos de Immich, analizó el formato de la exportación de la Cronología, escribió el script de emparejamiento, montó el servidor local y lanzó las peticiones a la API de Immich, primero con 5 fotos de prueba y después en lotes.
- 🙋 **Yo:** comprobé los originales en el móvil, exporté la Cronología y la pasé al ordenador por cable, validé en el mapa que las muestras caían donde yo recordaba y di luz verde a cada paso que modificaba datos.

---

## 🔍 Diagnóstico: ¿dónde se perdió el dato?

Antes de arreglar nada, quería saber **en qué punto** había desaparecido la ubicación. Hay dos sospechosos razonables:

1. **La subida.** Desde Android 10, el sistema elimina las coordenadas GPS de los archivos que entrega a apps que no tienen el permiso de *acceso a la ubicación de los archivos multimedia*. Si la app de subida no lo tiene, las fotos llegan al servidor "limpias".
2. **La cámara.** Que el GPS no se hubiera guardado nunca.

Revisé 50 fotos al azar de octubre y noviembre de 2025 en el servidor con `exiftool`: **0 de 50 tenían GPS**. Eso sí, el modelo de cámara, la fecha y la zona horaria estaban intactos.

Después miré los originales en el propio móvil (Galería → detalles): **tampoco tenían ubicación**. Caso cerrado: no fue la subida, la cámara nunca escribió el GPS. En un OnePlus las causas típicas son el interruptor *"guardar ubicación"* de la cámara desactivado (algunas actualizaciones de OxygenOS lo resetean), la app de cámara sin permiso de ubicación (falla en silencio) o la ubicación desactivada durante el viaje.

> ⚠️ Si tus fotos sí tienen GPS en el móvil pero no en el servidor, el problema es el otro: revisa el permiso de ubicación multimedia de la app que las sube.

---

## 💡 La idea: el móvil sí sabía dónde estaba

La cámara no guardó la ubicación, pero **el teléfono sí la registró**. La Cronología de Google Maps tenía el viaje entero: cada visita, cada trayecto andando, cada ferry.

Así que el plan era sencillo de enunciar: para cada foto, coger su hora exacta y preguntarle a la Cronología **dónde estaba yo en ese momento**.

---

## 📤 Paso 1: comprobar y exportar la Cronología

Desde 2024, la Cronología **se guarda en el dispositivo**, no en la nube. Eso tiene dos consecuencias importantes:

- **Compruébalo primero:** Google Maps → tu perfil → *Tu cronología* → calendario → elige un día del viaje. Si ves los recorridos, los datos están.
- **Desactiva el borrado automático antes de nada.** En los ajustes de la Cronología hay una opción de *eliminación automática* que en cuentas nuevas suele venir en 3 meses. Yo la desactivé antes de tocar nada más.

Para exportarla: **Ajustes de Android → Ubicación → Servicios de ubicación → Cronología → Exportar datos de Cronología**. El resultado fue un `Cronología.json` de **19 MB**.

> 🔒 Ojo con la privacidad: ese archivo es **tu historial de ubicaciones completo**. Lo pasé al ordenador por cable, le puse `chmod 600` y nunca lo envié por chat ni por correo.

---

## 🧬 Paso 2: entender el formato

El JSON tiene tres claves principales: `semanticSegments`, `rawSignals` y `userLocationProfile`. Las dos primeras son las que importan:

- **`semanticSegments`** (10.760 en mi caso) contienen:
  - **`visit`**: un sitio donde estuviste, con hora de inicio y fin y su `placeLocation.latLng`.
  - **`timelinePath`**: una lista de puntos `{ point, time }` mientras te movías.
  - **`activity`**: los segmentos de desplazamiento.
- **`rawSignals`** (24.408): posiciones en bruto con `timestamp` y `LatLng`.

Un detalle curioso: las coordenadas vienen como texto, con el símbolo de grado incluido:

```json
{ "point": "40.7529°, -73.9785°", "time": "2025-10-27T15:42:00.000-04:00" }
```

La cobertura era buena: entre 58 y 117 puntos por día de viaje. Basta con promediar las posiciones por día para ver el viaje dibujado: los días de Nueva York se agrupan alrededor de `40.76, -74.01`, y el vuelo de vuelta promedia en mitad del Atlántico. 🛫

---

## 🕐 Paso 3: la hora de cada foto (en UTC)

Este es el paso que decide si todo funciona o no. El campo EXIF `DateTimeOriginal` guarda la hora **local**, pero la Cronología trabaja con instantes absolutos. Para cruzarlos necesitas UTC.

Por suerte, mi OnePlus escribe también **`OffsetTimeOriginal`** (`+01:00`, `+02:00`, `-04:00`...), así que la conversión a UTC es exacta. Sin ese campo tendrías que adivinar la zona horaria de cada día, y en un viaje con cambio de horario eso es una fuente segura de errores.

Saqué de la base de datos de Immich la lista de recursos del periodo del viaje (id, nombre de archivo y hora UTC): **1.971 recursos, 1.928 sin GPS**.

---

## 🧮 Paso 4: el algoritmo de emparejamiento

Para cada foto con hora `t` (UTC), en este orden:

1. Si `t` cae **dentro de una visita** → uso la ubicación de ese sitio.
2. Si no, tomo los puntos del recorrido justo antes y justo después de `t`. Si están separados **30 minutos o menos** → **interpolación lineal** entre ambos.
3. Si no, el **punto más cercano**, siempre que esté a **60 minutos o menos**.
4. Si no → **la dejo sin ubicación**. Prefiero un hueco a un dato inventado.

El script completo cabe en unas 60 líneas de Python sin dependencias:

```python
import json, sys, bisect
from datetime import datetime, timezone

def parse_t(s):
    return datetime.fromisoformat(s.replace("Z", "+00:00")).astimezone(timezone.utc)

def parse_ll(s):
    a, b = s.replace("°", "").replace("geo:", "").split(",")
    return float(a), float(b)

timeline = json.load(open(sys.argv[1]))
points, visits = [], []
for seg in timeline["semanticSegments"]:
    for p in seg.get("timelinePath", []):
        points.append((parse_t(p["time"]), *parse_ll(p["point"])))
    v = seg.get("visit")
    if v:
        la, lo = parse_ll(v["topCandidate"]["placeLocation"]["latLng"])
        visits.append((parse_t(seg["startTime"]), parse_t(seg["endTime"]), la, lo))
for r in timeline.get("rawSignals", []):
    pos = r.get("position")
    if pos and "LatLng" in pos and "timestamp" in pos:
        points.append((parse_t(pos["timestamp"]), *parse_ll(pos["LatLng"])))
points.sort()
times = [p[0] for p in points]

def locate(t):
    for start, end, la, lo in visits:
        if start <= t <= end:
            return la, lo, "visit"
    i = bisect.bisect_left(times, t)
    before = points[i - 1] if i > 0 else None
    after = points[i] if i < len(points) else None
    if before and after:
        gap = (after[0] - before[0]).total_seconds()
        if gap <= 30 * 60:
            f = 0 if gap == 0 else (t - before[0]).total_seconds() / gap
            return (before[1] + f * (after[1] - before[1]),
                    before[2] + f * (after[2] - before[2]), "interp")
    best = min((p for p in (before, after) if p),
               key=lambda p: abs((p[0] - t).total_seconds()))
    if abs((best[0] - t).total_seconds()) <= 60 * 60:
        return best[1], best[2], "nearest"
    return None
```

La entrada son dos archivos: la exportación de la Cronología y un listado `id|nombre|hora_utc|zona|latitud` de los recursos. La salida es un JSON con la coordenada y el método usado para cada foto, que me permitía revisar los resultados antes de aplicar nada.

---

## ✍️ Paso 5: aplicar la ubicación sin tocar los originales

Tenía dos opciones: reescribir el EXIF de los archivos o decirle a Immich la ubicación. Elegí la segunda, usando su API:

```http
PUT /api/assets/{id}
Content-Type: application/json

{ "latitude": 40.758, "longitude": -73.9855 }
```

Es exactamente lo que hace la interfaz web con *"Editar ubicación"*, pero en lote. Ventajas:

- **Los originales quedan intactos** y el cambio es reversible.
- **No genera duplicados.** Si hubiera reetiquetado los archivos en el móvil, cambiaría su checksum y la app de Immich los volvería a subir como fotos nuevas.

Al final ni siquiera necesité una API key: lancé las peticiones desde una pestaña del navegador con la sesión de Immich iniciada. Los datos emparejados los servía un mini servidor HTTP en `localhost` (con CORS y la cabecera `Access-Control-Allow-Private-Network`), así que las coordenadas no pasaron por ningún otro sitio.

Y fui con cuidado:

- **Primero 5 fotos de prueba**, comprobadas una a una en el mapa.
- Después el resto **en lotes de 400**, con 4 peticiones en paralelo.
- Saltando cualquier recurso que ya tuviera latitud, para no pisar nada.

---

## 📊 Resultados

| Método | Fotos |
|---|---|
| Dentro de una visita | 991 |
| Interpolación (≤ 30 min) | 805 |
| Punto más cercano (≤ 60 min) | 59 |
| Sin datos | 73 |

**1.855 de 1.928 fotos (96 %) recuperaron su ubicación**, en unos 30 segundos y con **0 fallos**. Las 73 restantes son de la tarde del vuelo de ida: la Cronología no tiene puntos a 10.000 metros, y ahí se quedaron vacías a propósito.

Comprobé muestras al azar contra sitios que recordaba: Times Square, el Financial District, la Estatua de la Libertad y Grand Central, donde una foto y un vídeo hechos con 30 minutos de diferencia cayeron en la misma visita. Todo cuadraba.

Una rareza para quien use Immich: la geocodificación inversa nombra cada sitio por la **ciudad más cercana** de su base de datos (GeoNames), así que una foto de Times Square aparece como *"Weehawken"*, al otro lado del río. El pin está bien; solo el nombre despista.

---

## 🔁 Segunda pasada: toda la biblioteca

Si funcionaba con Nueva York, ¿por qué no con todo lo demás? Repetí el proceso con **todas las fotos de cámara sin GPS desde septiembre de 2024**, que es cuando empieza mi Cronología.

Con un filtro importante: **excluí los recursos sin modelo de cámara en el EXIF** (capturas de pantalla, descargas). Etiquetar una captura con *"dónde estaba cuando la hice"* es un dato falso, no un dato recuperado.

- 1.052 candidatas → 679 por visita, 134 interpoladas, 93 por punto cercano y 146 sin datos.
- **906 recuperadas (86 %)** en 14 segundos, sin fallos.

Agrupar los resultados por día y calcular el centro de cada grupo dio un repaso rápido de los viajes del último año: la Serra da Estrela, Lisboa, Guarda, Madrid, Cáceres, Évora, dos escapadas al Algarve...

---

## 🌅 El giro final: el viaje que no recordaba

Y entonces apareció algo que no esperaba. Entre el 14 y el 16 de septiembre de 2024, la Cronología me situaba **en el Algarve**. Yo no recordaba ese fin de semana. La Cronología sí: fue justo antes de la Serra da Estrela (17–20 de septiembre), y las fotos lo confirmaban.

---

## 🧠 Lecciones

- **Averigua dónde se pierde el dato antes de arreglarlo.** Comparar la copia del servidor con el original del móvil me dijo que el problema era la cámara, no la subida.
- **La zona horaria del EXIF lo es todo.** Con `OffsetTimeOriginal` el cruce es exacto; sin él, es una apuesta.
- **Umbrales conservadores.** Mejor dejar 73 fotos sin ubicación que poner 73 pines falsos.
- **No reetiquetes los originales si usas un servidor de fotos.** Cambia el checksum y acabarás con duplicados.
- **Exporta tu Cronología pronto.** Ahora vive en el dispositivo y puede borrarse sola.
- **Comprueba hoy que tu cámara guarda la ubicación.** Haz una foto, mira los detalles y ahórrate este post. 📸

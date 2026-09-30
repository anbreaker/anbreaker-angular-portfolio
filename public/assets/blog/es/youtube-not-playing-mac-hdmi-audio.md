## 🎬 Introducción: la página carga, el vídeo no

Mi MacBook de empresa llevaba cuatro años funcionando perfecto con este montaje: un hub USB-C (Ethernet, webcam y salida VGA hacia una tele) y un monitor externo por HDMI cuyo audio uso, con el conector de auriculares del monitor alimentando los altavoces de la tele. Hasta que un día YouTube dejó de reproducir: la página cargaba perfecta, pero el vídeo se quedaba girando para siempre en el **0:00**.

Así se ve mi mesa de trabajo:

<img class="theme-img theme-img--dark" src="/assets/images/blog/youtubeHdmiAudio/illustration_ES_dark.webp" alt="Ilustración de mi mesa: MacBook Pro con hub USB-C, monitor VS278 por HDMI con el audio atascado y una tele como segunda pantalla">
<img class="theme-img theme-img--light" src="/assets/images/blog/youtubeHdmiAudio/illustration_ES_light.webp" alt="Ilustración de mi mesa: MacBook Pro con hub USB-C, monitor VS278 por HDMI con el audio atascado y una tele como segunda pantalla">

Lo más desconcertante era el patrón. Pasaba en mi casa en España, pero no en otra casa en Portugal. Y un PC con Linux en la misma red doméstica, con el mismo navegador, funcionaba sin problemas. Todo apuntaba a la **red o al proveedor de internet**, combinados con un Mac gestionado por la empresa (MDM, un cliente SASE de *secure web gateway*, un perfil de DNS cifrado gestionado y un agente de seguridad de endpoint). Demasiados sospechosos.

> 💡 Spoiler: la red era inocente. Pero tardé horas en aceptarlo, y el camino es lo que vale la pena contar.

<img class="theme-img theme-img--dark" src="/assets/images/blog/youtubeHdmiAudio/layers_ES_dark.webp" alt="Las capas que sospechamos y la que realmente fallaba">
<img class="theme-img theme-img--light" src="/assets/images/blog/youtubeHdmiAudio/layers_ES_light.webp" alt="Las capas que sospechamos y la que realmente fallaba">

---

## 🕵️ Pista falsa #1: el filtro DNS de casa

Lo primero fue lo más obvio: el Pi-hole de casa. Lo descarté antes de empezar en serio, con evidencia: el DNS resolvía todo correctamente y solo bloqueaba dominios de publicidad. Nada que ver con los servidores de vídeo.

---

## 🚦 Pista falsa #2: QUIC / HTTP3

El clásico de "la página carga pero el vídeo no": un firewall o un proveedor que rompe QUIC. Desactivé QUIC en el navegador (`brave://flags/#enable-quic`) y el vídeo **siguió fallando**. Descartado.

---

## 🧩 Pista falsa #3: bloqueadores y extensiones

En la consola aparecían errores `net::ERR_BLOCKED_BY_CLIENT` para la telemetría de YouTube (`qoe`, `log_event`, `generate_204`). Muy sospechoso... hasta que probé en una ventana privada con los *shields* desactivados: la telemetría pasaba y el vídeo seguía atascado. Aquellos errores eran **ruido**.

---

## 🛡️ Pista falsa #4: el cliente SASE

Esta fue la más convincente. La extensión de red del cliente SASE seguía activa aunque la "desactivara" desde su interfaz (protección anti-manipulación), y sus logs mostraban que gestionaba flujos del navegador hacia `googlevideo.com`. Además, mi proveedor servía el vídeo desde un nodo de caché de Google **dentro de su propia red**. La hipótesis encajaba de maravilla: el tráfico que sale por la nube del SASE es rechazado por la caché del ISP.

La desmontaron tres hechos:

- El certificado que recibía el navegador era el **genuino de Google**: no había interceptación TLS.
- El nodo de caché respondía sin problema (un `204` correcto).
- Y lo decisivo: **Chrome ni siquiera pasa por ese cliente** (cero flujos en su log) y fallaba exactamente igual.

---

## 👻 Pista falsa #5: la "ruta fantasma" de IPv6

Otro asistente de IA sugirió un problema de IPv6. Lo comprobé: el Mac no tenía IPv6 global, las rutas por defecto `utun` estaban ligadas a interfaz (son túneles del sistema), el intento IPv6 del navegador fallaba al instante y caía a IPv4, y mi red doméstica ni siquiera tiene IPv6. Descartado. Tampoco eran la cuenta ni las cookies: un perfil de Chrome totalmente limpio, sin cookies, sin cuenta y sin extensiones, también se quedaba colgado.

---

## 🔬 La pista que estaba a la vista

Durante todo el proceso hubo una observación que en retrospectiva apuntaba lejos de la red. La respuesta de YouTube era **válida**: un stream SABR/UMP de aproximadamente 1 MB con audio y vídeo reales y el estado de protección de stream en OK. Los bytes llegaban rápido. Pero el reproductor **nunca los consumía**: `video.readyState` se quedaba en 0, `buffered` vacío y el reproductor en estado 3 (*buffering*).

> *"Los datos llegan, pero el reproductor no arranca."* Eso no es un problema de red.

---

## 🔁 El giro: convertirlo en algo reproducible

Tras reiniciar el Mac funcionó... y más tarde volvió a romperse. Así que dejé de adivinar y construí un **monitor**: cada 2 minutos lanzaba un Chrome limpio y sin interfaz a través del protocolo DevTools, cargaba un vídeo, comprobaba `readyState` y `currentTime`, y guardaba una instantánea del sistema en cada cambio de estado.

Entonces caí en la cuenta de algo: **se rompía justo cuando conectaba el hub USB-C**. Hice una prueba de aislamiento con el hub conectado:

| Salida de audio | Chrome con `--disable-audio-output` | Chrome con audio |
| --- | --- | --- |
| Altavoces del MacBook | OK | OK |
| Monitor HDMI (VS278) | OK | FALLA (atascado en 0:00) |

Ahí estaba. Sin audio, el vídeo reproduce; con audio hacia el monitor HDMI, no.

---

## 🎯 La causa raíz: un dispositivo de audio atascado

Al conectar el hub, macOS reconfigura pantallas y dispositivos de audio, y el audio del monitor HDMI queda **atascado**, aunque nunca desaparece de la lista de dispositivos. Chromium no empieza la reproducción hasta que puede abrir la salida de audio, así que el vídeo espera para siempre aunque los datos ya hayan llegado.

Este es mi montaje, con el punto exacto donde falló:

<img class="theme-img theme-img--dark" src="/assets/images/blog/youtubeHdmiAudio/setup_ES_dark.webp" alt="Mi montaje: dónde estaba el fallo">
<img class="theme-img theme-img--light" src="/assets/images/blog/youtubeHdmiAudio/setup_ES_light.webp" alt="Mi montaje: dónde estaba el fallo">

Esto también explica el resto del misterio:

- 📍 **"Solo pasa en España"**: allí vive el montaje del hub y el monitor. La red era una pista falsa; la correlación de lugar era en realidad una correlación de **hardware**.
- ⏱️ **"Se rompe a ratos"**: el hub es algo tembloroso y se toca. Cada reconexión vuelve a disparar el problema.

---

## 🔧 La solución manual

Basta con **reinicializar el dispositivo de audio**. Tres formas:

1. Abrir *Configuración Audio MIDI*, seleccionar el dispositivo HDMI y cambiar el formato de 48 000 Hz a 44 100 Hz y volver.
2. Cambiar la salida de sonido a otro dispositivo y devolverla.
3. Reiniciar el servicio de audio: `sudo killall coreaudiod`.

Una contraprueba confirmó que lo que arregla es el **reinicio**, no la frecuencia: 48 kHz vuelve a funcionar después de un reset. Fijar una frecuencia concreta **no** ayuda, porque macOS ya la recuerda por dispositivo.

---

## 🤖 La solución automática

Como el problema volvía con cada reconexión, lo automaticé con un pequeño programa en Swift que usa CoreAudio y se ejecuta como LaunchAgent de usuario. Escucha los cambios en `kAudioHardwarePropertyDevices`, espera 4 segundos a que todo se asiente (*debounce*) y alterna la frecuencia nominal del dispositivo objetivo a otra disponible y de vuelta.

### 🧾 El programa (`~/bin/hdmi-audio-reset.swift`)

```swift
// Watches CoreAudio devices and re-initializes a given output device whenever the device
// list changes (e.g. after plugging a USB-C hub), by toggling its nominal sample rate.
// Works around the device getting stuck, which blocks Chromium media playback.
// usage: hdmi-audio-reset <deviceName> [--now]
import CoreAudio
import Foundation

let targetName = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "VS278"
let settleSeconds: TimeInterval = 4

func log(_ message: String) {
  let line = "\(ISO8601DateFormatter().string(from: Date())) \(message)\n"
  FileHandle.standardError.write(line.data(using: .utf8)!)
}

func address(_ selector: AudioObjectPropertySelector) -> AudioObjectPropertyAddress {
  AudioObjectPropertyAddress(mSelector: selector, mScope: kAudioObjectPropertyScopeGlobal, mElement: kAudioObjectPropertyElementMain)
}

func deviceIDs() -> [AudioDeviceID] {
  var addr = address(kAudioHardwarePropertyDevices)
  var size: UInt32 = 0
  guard AudioObjectGetPropertyDataSize(AudioObjectID(kAudioObjectSystemObject), &addr, 0, nil, &size) == noErr else { return [] }
  var ids = [AudioDeviceID](repeating: 0, count: Int(size) / MemoryLayout<AudioDeviceID>.size)
  guard AudioObjectGetPropertyData(AudioObjectID(kAudioObjectSystemObject), &addr, 0, nil, &size, &ids) == noErr else { return [] }
  return ids
}

func name(of id: AudioDeviceID) -> String? {
  var addr = address(kAudioObjectPropertyName)
  var value: Unmanaged<CFString>?
  var size = UInt32(MemoryLayout<Unmanaged<CFString>?>.size)
  guard AudioObjectGetPropertyData(id, &addr, 0, nil, &size, &value) == noErr else { return nil }
  return value?.takeRetainedValue() as String?
}

func findTarget() -> AudioDeviceID? { deviceIDs().first { name(of: $0) == targetName } }

func sampleRate(of id: AudioDeviceID) -> Float64? {
  var addr = address(kAudioDevicePropertyNominalSampleRate)
  var rate: Float64 = 0
  var size = UInt32(MemoryLayout<Float64>.size)
  return AudioObjectGetPropertyData(id, &addr, 0, nil, &size, &rate) == noErr ? rate : nil
}

func availableRates(of id: AudioDeviceID) -> [Float64] {
  var addr = address(kAudioDevicePropertyAvailableNominalSampleRates)
  var size: UInt32 = 0
  guard AudioObjectGetPropertyDataSize(id, &addr, 0, nil, &size) == noErr else { return [] }
  var ranges = [AudioValueRange](repeating: AudioValueRange(), count: Int(size) / MemoryLayout<AudioValueRange>.size)
  guard AudioObjectGetPropertyData(id, &addr, 0, nil, &size, &ranges) == noErr else { return [] }
  return ranges.map { $0.mMinimum }
}

@discardableResult
func setSampleRate(_ id: AudioDeviceID, _ rate: Float64) -> OSStatus {
  var addr = address(kAudioDevicePropertyNominalSampleRate)
  var value = rate
  return AudioObjectSetPropertyData(id, &addr, 0, nil, UInt32(MemoryLayout<Float64>.size), &value)
}

func resetTarget() {
  guard let id = findTarget(), let current = sampleRate(of: id) else { log("\(targetName) not found; skipping"); return }
  guard let other = availableRates(of: id).first(where: { $0 != current }) else { log("no alternate rate for \(targetName)"); return }
  let first = setSampleRate(id, other)
  Thread.sleep(forTimeInterval: 1)
  let second = setSampleRate(id, current)
  log("reset \(targetName): \(Int(current)) -> \(Int(other)) -> \(Int(current)) (status \(first)/\(second))")
}

let wasPresent = findTarget() != nil
if CommandLine.arguments.contains("--now") { resetTarget(); exit(0) }
log("watching for \(targetName) (present=\(wasPresent))")
if wasPresent { DispatchQueue.main.asyncAfter(deadline: .now() + settleSeconds) { resetTarget() } }

// Any device-list change (hub plugged/unplugged, displays reconfigured) can leave the
// target stuck even though it never disappears, so reset it after changes settle.
var pendingReset: DispatchWorkItem?
var devicesAddr = address(kAudioHardwarePropertyDevices)
AudioObjectAddPropertyListenerBlock(AudioObjectID(kAudioObjectSystemObject), &devicesAddr, DispatchQueue.main) { _, _ in
  log("audio devices changed; resetting \(targetName) in \(Int(settleSeconds))s")
  pendingReset?.cancel()
  let work = DispatchWorkItem { resetTarget() }
  pendingReset = work
  DispatchQueue.main.asyncAfter(deadline: .now() + settleSeconds, execute: work)
}
dispatchMain()
```

### 📄 El LaunchAgent (`~/Library/LaunchAgents/local.hdmi-audio-reset.plist`)

Sustituye `YOUR_USER` por tu usuario y el nombre `VS278` por el de tu dispositivo de audio.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>local.hdmi-audio-reset</string>
  <key>ProgramArguments</key>
  <array><string>/Users/YOUR_USER/bin/hdmi-audio-reset</string><string>VS278</string></array>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>StandardErrorPath</key><string>/Users/YOUR_USER/Library/Logs/hdmi-audio-reset.log</string>
</dict>
</plist>
```

### ▶️ Compilar e instalar

```bash
swiftc -O -o ~/bin/hdmi-audio-reset ~/bin/hdmi-audio-reset.swift
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/local.hdmi-audio-reset.plist
```

Para desinstalarlo:

```bash
launchctl bootout gui/$(id -u)/local.hdmi-audio-reset
```

Lo verifiqué de punta a punta: desconecté y volví a conectar el hub, el log mostró `audio devices changed; resetting …`, después el reinicio, y YouTube reprodujo sin tocar nada.

---

## 🧠 Lecciones

- **Descarta capas con evidencia, no con intuición.** Cada pista falsa se cerró con una prueba concreta, no con una corazonada.
- **Desconfía de la primera historia plausible.** Yo y el asistente de IA con el que trabajaba perseguimos la red durante horas porque la historia encajaba demasiado bien.
- **"Los datos llegan pero nada suena" significa mirar el pipeline multimedia** (audio, decodificador), no la red.
- **Haz el fallo reproducible y automático.** Un monitor cada 2 minutos me dio lo que la intuición no pudo: el desencadenante.
- **Cambia una variable a la vez.** La prueba de aislamiento con la tabla de arriba resolvió en minutos lo que horas de hipótesis no.
- **La correlación de lugar era una correlación de montaje de hardware.**

La investigación la hice acompañado de un asistente de programación con IA en la terminal: útil para ejecutar y ordenar pruebas, y tan propenso como yo a enamorarse de la primera hipótesis. La disciplina de descartar con evidencia sigue siendo trabajo humano.

Si tienes un Mac, un hub USB-C y audio por HDMI, y YouTube se queda en el 0:00, prueba primero a reiniciar el dispositivo de audio. Te puede ahorrar una tarde entera. 🎧

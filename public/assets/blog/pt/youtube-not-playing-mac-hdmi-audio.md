## 🎬 Introdução: a página carrega, o vídeo não

O meu MacBook da empresa funcionava na perfeição há quatro anos com este esquema: um hub USB-C (Ethernet, webcam e uma saída VGA para uma televisão) e um monitor externo por HDMI cujo áudio utilizo, com a ficha de auscultadores do monitor a alimentar as colunas da televisão. Até que um dia o YouTube deixou de reproduzir: a página carregava na perfeição, mas o vídeo ficava a rodar para sempre no **0:00**.

Esta é a minha secretária:

<img class="theme-img theme-img--dark" src="/assets/images/blog/youtubeHdmiAudio/illustration_PT_dark.webp" alt="Ilustração da minha secretária: MacBook Pro com hub USB-C, monitor VS278 por HDMI com o áudio bloqueado e uma televisão como segundo ecrã">
<img class="theme-img theme-img--light" src="/assets/images/blog/youtubeHdmiAudio/illustration_PT_light.webp" alt="Ilustração da minha secretária: MacBook Pro com hub USB-C, monitor VS278 por HDMI com o áudio bloqueado e uma televisão como segundo ecrã">

O padrão era o que mais desconcertava. Acontecia em casa, mas não na minha segunda habitação, com outro ISP. E um PC com Linux na mesma rede doméstica, com o mesmo navegador, funcionava sem problemas. Tudo apontava para a **rede ou o fornecedor de internet**, juntamente com um Mac gerido pela empresa (MDM, um cliente SASE de *secure web gateway*, um perfil de DNS cifrado gerido e um agente de segurança de endpoint). Suspeitos a mais.

> 💡 Spoiler: a rede era inocente. Mas demorei horas a aceitá-lo, e o caminho é o que vale a pena contar.

<img class="theme-img theme-img--dark" src="/assets/images/blog/youtubeHdmiAudio/layers_PT_dark.webp" alt="As camadas que suspeitámos e a que realmente falhava">
<img class="theme-img theme-img--light" src="/assets/images/blog/youtubeHdmiAudio/layers_PT_light.webp" alt="As camadas que suspeitámos e a que realmente falhava">

---

## 🤖 Como trabalhei: a iterar com agentes

Não fiz esta investigação sozinho. Trabalhei no terminal com agentes de IA (Claude Code) configurados com o [gentle-ai](https://github.com/Gentleman-Programming/gentle-ai), uma ferramenta de código aberto ([site oficial](https://gentle-ai.gentlemanprogramming.com/)) que configura os agentes que já usas com memória persistente, Organic-Driven Development, skills e orquestração de sub-agentes, sem te prender a nenhum.

**O que o gentle-ai trouxe neste caso:**

- **Engram:** memória persistente entre sessões, para não começar do zero de cada vez.
- **ODD (Organic-Driven Development):** um fluxo leve, com documento de tarefas para o trabalho substancial, ramo antes de escrever e nenhum commit sem a minha permissão explícita.
- **Orquestração de sub-agentes:** o orquestrador delegou em escritores que redigiram este artigo em três idiomas e geraram os diagramas; eu revi e corrigi.

O gentle-ai foi criado por [Alan Buscaglia](https://www.linkedin.com/in/alanbuscaglia/) (Gentleman Programming), e a regra dele para trabalhar com IA resume bem este artigo: *"verifying beats generating"*, ou seja, verificar vale mais do que gerar.

> ⭐ **gentle-ai no GitHub:** [github.com/Gentleman-Programming/gentle-ai](https://github.com/Gentleman-Programming/gentle-ai). Se te for útil, dá-lhe uma estrela: ajuda mais pessoas a encontrá-lo.

<p align="center"><a href="https://github.com/Gentleman-Programming/gentle-ai"><img width="220" src="https://raw.githubusercontent.com/Gentleman-Programming/gentle-ai/main/docs/assets/brand/built-with-gentle-ai.png" alt="Built with Gentle-AI" /></a></p>

O método foi sempre o mesmo, e enganámo-nos os dois: o agente também defendeu teorias erradas (a do cliente SASE e da cache do ISP foi dele) e a evidência corrigiu-o tal como a mim.

**hipótese → teste → evidência → descartar**

- 🤖 **O agente:** leu logs de sistema e de rede, inspecionou configurações, capturou e descodificou o tráfego do leitor, lançou o Chrome sem interface pelo DevTools, montou o monitor de reprodução, executou os testes de isolamento e escreveu o vigilante em Swift com o respetivo LaunchAgent.
- 🙋 **Eu:** dei o contexto e as capturas de ecrã, fiz as verificações no navegador que o agente não podia e, sobretudo, reparei que falhava mesmo quando ligava o hub USB-C e confirmei que o esquema funcionava assim há quatro anos.

---

## 🕵️ Falsa pista n.º 1: o filtro DNS de casa

Primeiro o mais óbvio: o Pi-hole lá de casa. Descartámo-lo antes de começar a sério, com provas: o DNS resolvia tudo corretamente e só bloqueava domínios de publicidade. Nada a ver com os servidores de vídeo.

---

## 🚦 Falsa pista n.º 2: QUIC / HTTP3

O clássico "a página carrega mas o vídeo não": uma firewall ou um fornecedor a quebrar o QUIC. Desativámos o QUIC no navegador (`brave://flags/#enable-quic`) e o vídeo **continuou a falhar**. Descartado.

---

## 🧩 Falsa pista n.º 3: bloqueadores e extensões

Na consola apareciam erros `net::ERR_BLOCKED_BY_CLIENT` na telemetria do YouTube (`qoe`, `log_event`, `generate_204`). Muito suspeito... até experimentarmos numa janela privada com os *shields* desligados: a telemetria passava e o vídeo continuava preso. Esses erros eram **ruído**.

---

## 🛡️ Falsa pista n.º 4: o cliente SASE

Esta foi a mais convincente. A extensão de rede do cliente SASE continuava a correr mesmo quando a "desativava" na interface (proteção anti-adulteração), e os seus logs, lidos pelo agente, mostravam que tratava fluxos do navegador para `googlevideo.com`. Além disso, o meu fornecedor servia o vídeo a partir de um nó de cache da Google **dentro da sua própria rede**. A hipótese, que foi do próprio agente, encaixava na perfeição: o tráfego que sai pela cloud do SASE é rejeitado pela cache do ISP.

Três factos desmontaram-na:

- O certificado que o navegador recebia era o **genuíno da Google**: não havia interceção TLS.
- O nó de cache respondia sem problemas (um `204` correto).
- E o decisivo: o **Chrome nem sequer passa por esse cliente** (zero fluxos no log) e falhava exatamente da mesma forma.

---

## 👻 Falsa pista n.º 5: a rota "fantasma" de IPv6

Outro assistente de IA sugeriu um problema de IPv6. O agente verificou, e depois retratou a ideia: o Mac não tinha IPv6 global, as rotas por defeito `utun` estavam associadas à interface (são túneis do sistema), a tentativa IPv6 do navegador falhava de imediato e recuava para IPv4, e a minha rede doméstica nem sequer tem IPv6. Descartado. Também não eram a conta nem os cookies: um perfil de Chrome totalmente limpo, sem cookies, sem conta e sem extensões, também ficava preso.

---

## 🔬 A pista à vista de todos

Durante todo o processo houve uma observação que, em retrospetiva, apontava para longe da rede. A resposta do YouTube era **válida**: um stream SABR/UMP com cerca de 1 MB de áudio e vídeo reais e o estado de proteção do stream em OK. Os bytes chegavam depressa. Mas o leitor **nunca os consumia**: `video.readyState` ficava a 0, `buffered` vazio e o leitor no estado 3 (*buffering*).

> *"Os dados chegam, mas o leitor não arranca."* Isso não é um problema de rede.

---

## 🔁 A reviravolta: torná-lo reproduzível

Depois de reiniciar o Mac funcionou... e mais tarde voltou a avariar. Por isso deixei de adivinhar e pedi ao agente que montasse um **monitor**: de 2 em 2 minutos lançava um Chrome limpo e sem interface através do protocolo DevTools, carregava um vídeo, verificava `readyState` e `currentTime`, e guardava uma fotografia do sistema a cada mudança de estado.

Foi então que reparei, e esta parte foi minha, não do agente: **avariava exatamente quando ligava o hub USB-C**, num esquema que eu sabia funcionar assim há quatro anos. O agente fez um teste de isolamento com o hub ligado:

| Saída de áudio | Chrome com `--disable-audio-output` | Chrome com áudio |
| --- | --- | --- |
| Colunas do MacBook | OK | OK |
| Monitor HDMI (VS278) | OK | FALHA (preso no 0:00) |

Aí estava. Sem áudio o vídeo reproduz; com áudio para o monitor HDMI, não.

---

## 🎯 A causa raiz: um dispositivo de áudio bloqueado

Ao ligar o hub, o macOS reconfigura os ecrãs e os dispositivos de áudio, e o áudio do monitor HDMI fica **bloqueado**, embora nunca desapareça da lista de dispositivos. O Chromium não inicia a reprodução enquanto não conseguir abrir a saída de áudio, por isso o vídeo espera para sempre, apesar de os dados já terem chegado.

Esta é a minha montagem, com o ponto exato onde falhou:

<img class="theme-img theme-img--dark" src="/assets/images/blog/youtubeHdmiAudio/setup_PT_dark.webp" alt="A minha montagem: onde estava a falha">
<img class="theme-img theme-img--light" src="/assets/images/blog/youtubeHdmiAudio/setup_PT_light.webp" alt="A minha montagem: onde estava a falha">

Isto explica também o resto do mistério:

- 📍 **"Só acontece em casa"**: é lá que está o esquema do hub e do monitor. A rede era uma pista falsa; a correlação com o local era, na verdade, uma correlação com o **hardware**.
- ⏱️ **"Avaria de vez em quando"**: o hub é um bocado instável e mexe-se-lhe. Cada nova ligação volta a disparar o problema.

---

## 🔧 A solução manual

Basta **reinicializar o dispositivo de áudio**. Três formas:

1. Abrir a *Configuração de MIDI e Áudio*, selecionar o dispositivo HDMI e mudar o formato de 48 000 Hz para 44 100 Hz e voltar.
2. Mudar a saída de som para outro dispositivo e devolvê-la.
3. Reiniciar o serviço de áudio: `sudo killall coreaudiod`.

Uma contraprova confirmou que o que resolve é o **reinício**, não a frequência: os 48 kHz voltam a funcionar depois de um reset. Fixar uma frequência concreta **não** ajuda, porque o macOS já a memoriza por dispositivo.

---

## 🤖 A solução automática

Como o problema voltava a cada nova ligação, pedi ao agente que o automatizasse e ele escreveu um pequeno programa em Swift que usa o CoreAudio e corre como LaunchAgent de utilizador; revi-o e instalei-o eu. Escuta as alterações em `kAudioHardwarePropertyDevices`, espera 4 segundos até tudo assentar (*debounce*) e alterna a frequência nominal do dispositivo alvo para outra disponível e de volta. A primeira versão não disparava, porque o monitor nunca desaparece da lista de dispositivos; o agente corrigiu-a para reagir a qualquer alteração nessa lista.

### 🧾 O programa (`~/bin/hdmi-audio-reset.swift`)

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

### 📄 O LaunchAgent (`~/Library/LaunchAgents/local.hdmi-audio-reset.plist`)

Substitui `YOUR_USER` pelo teu utilizador e `VS278` pelo nome do teu dispositivo de áudio.

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

Para desinstalar:

```bash
launchctl bootout gui/$(id -u)/local.hdmi-audio-reset
```

Verifiquei-o de ponta a ponta: desliguei e voltei a ligar o hub, o log mostrou `audio devices changed; resetting …`, depois o reinício, e o YouTube reproduziu sem eu tocar em nada.

---

## 🧠 Lições

- **Descarta camadas com provas, não com intuição.** Cada falsa pista foi encerrada com um teste concreto, não com um palpite.
- **Desconfia da primeira história plausível.** O agente e eu perseguimos a rede durante horas porque a história encaixava bem demais (a teoria do SASE e da cache do ISP foi do próprio agente).
- **"Os dados chegam mas nada toca" quer dizer olhar para o pipeline multimédia** (áudio, descodificador), não para a rede.
- **Torna a falha reproduzível e automática.** Um monitor de 2 em 2 minutos deu-me o que a intuição não conseguiu: o gatilho.
- **Muda uma variável de cada vez.** O teste de isolamento da tabela acima resolveu em minutos o que horas de hipóteses não resolveram.
- **A correlação com o local era, na verdade, uma correlação com um esquema de hardware.**

Fiz a investigação a iterar com agentes de IA no terminal (Claude Code, configurado com o [gentle-ai](https://github.com/Gentleman-Programming/gentle-ai)): executaram e organizaram os testes, e caíram em teorias erradas tal como eu. Este artigo também foi redigido por sub-agentes orquestrados pelo gentle-ai (o texto em três idiomas e as ilustrações), e fui eu que o revi e corrigi. O que nos fez avançar aos dois foi descartar com provas.

Se tens um Mac, um hub USB-C e áudio por HDMI, e o YouTube fica no 0:00, experimenta primeiro reinicializar o dispositivo de áudio. Pode poupar-te uma tarde inteira. 🎧

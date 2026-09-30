## 🎬 Introduction: the page loads, the video doesn't

My company-managed MacBook had worked flawlessly for four years with this setup: a USB-C hub (Ethernet, webcam and a VGA output to a TV) and an external monitor over HDMI whose audio I use, with the monitor's headphone jack feeding the TV speakers. Then one day YouTube stopped playing: the page loaded perfectly, but the video spun forever at **0:00**.

This is what my desk looks like:

<img class="theme-img theme-img--dark" src="/assets/images/blog/youtubeHdmiAudio/illustration_EN_dark.webp" alt="Illustration of my desk: MacBook Pro with a USB-C hub, a VS278 monitor over HDMI with stuck audio, and a TV as second screen">
<img class="theme-img theme-img--light" src="/assets/images/blog/youtubeHdmiAudio/illustration_EN_light.webp" alt="Illustration of my desk: MacBook Pro with a USB-C hub, a VS278 monitor over HDMI with stuck audio, and a TV as second screen">

The pattern was what made it baffling. It happened at home, but not at my second home, which uses a different ISP. And a Linux PC on the same home network, with the same browser, worked fine. Everything pointed to the **network or the ISP**, combined with a company-managed Mac (MDM, a SASE secure-web-gateway client, a managed encrypted DNS profile and an endpoint security agent). Too many suspects.

> 💡 Spoiler: the network was innocent. But it took me hours to accept it, and the path is what's worth telling.

<img class="theme-img theme-img--dark" src="/assets/images/blog/youtubeHdmiAudio/layers_EN_dark.webp" alt="The layers we suspected and the one that actually failed">
<img class="theme-img theme-img--light" src="/assets/images/blog/youtubeHdmiAudio/layers_EN_light.webp" alt="The layers we suspected and the one that actually failed">

---

## 🤖 How I worked: iterating with agents

I didn't do this investigation alone. I worked in the terminal with AI coding agents (Claude Code) configured through [gentle-ai](https://github.com/Gentleman-Programming/gentle-ai), an open-source tool ([official website](https://gentle-ai.gentlemanprogramming.com/)) that configures the agents you already use with persistent memory, Organic-Driven Development, curated skills and sub-agent orchestration, with no agent lock-in.

**What gentle-ai brought in this case:**

- **Engram:** persistent memory across sessions, so you never start from scratch.
- **ODD (Organic-Driven Development):** a lightweight flow, with a task document for substantial work, a branch before writing and no commits without my explicit permission.
- **Sub-agent orchestration:** the orchestrator delegated writers that drafted this post in three languages and generated the diagrams; I reviewed and corrected.

gentle-ai was created by [Alan Buscaglia](https://www.linkedin.com/in/alanbuscaglia/) (Gentleman Programming), and his rule for working with AI sums up this post well: *"verifying beats generating"*.

> ⭐ **gentle-ai on GitHub:** [github.com/Gentleman-Programming/gentle-ai](https://github.com/Gentleman-Programming/gentle-ai). If you find it useful, give it a star: it helps more people find it.

<p align="center"><a href="https://github.com/Gentleman-Programming/gentle-ai"><img width="220" src="https://raw.githubusercontent.com/Gentleman-Programming/gentle-ai/main/docs/assets/brand/built-with-gentle-ai.png" alt="Built with Gentle-AI" /></a></p>

The method was always the same, and we were both wrong at times: the agent also fell for wrong theories (the SASE client and ISP cache one was its own), and the evidence corrected it just as it corrected me.

**hypothesis → test → evidence → discard**

- 🤖 **The agent:** read system and network logs, inspected configuration, captured and decoded the player's traffic, launched headless Chrome through DevTools, built the playback monitor, ran the isolation tests and wrote the Swift watcher with its LaunchAgent.
- 🙋 **Me:** provided context and screenshots, ran the browser checks the agent couldn't and, above all, noticed it broke exactly when plugging in the USB-C hub and confirmed the setup had worked the same way for four years.

---

## 🕵️ False lead #1: the home DNS filter

First the obvious one: the Pi-hole at home. We ruled it out before really starting, with evidence: DNS resolved everything correctly and only ad domains were blocked. Nothing to do with the video servers.

---

## 🚦 False lead #2: QUIC / HTTP3

The classic "page loads, video doesn't": a firewall or ISP breaking QUIC. We disabled QUIC in the browser (`brave://flags/#enable-quic`) and the video **still failed**. Ruled out.

---

## 🧩 False lead #3: ad blockers and extensions

The console showed `net::ERR_BLOCKED_BY_CLIENT` errors for YouTube telemetry (`qoe`, `log_event`, `generate_204`). Very suspicious... until we tried a private window with shields off: telemetry went through and the video was still stuck. Those errors were **noise**.

---

## 🛡️ False lead #4: the SASE client

This was the most convincing one. The SASE client's network extension kept running even when I "disabled" it from its UI (tamper protection), and its logs, which the agent read, showed it handling browser flows to `googlevideo.com`. On top of that, my ISP served the video from a Google cache node **inside its own network**. The hypothesis, which was the agent's own, fit beautifully: traffic tunneled through the SASE cloud gets rejected by the ISP-embedded cache.

Three facts took it apart:

- The certificate the browser received was **Google's genuine one**: no TLS interception.
- The cache node answered fine (a proper `204`).
- And decisively: **Chrome doesn't go through that client at all** (zero flows in its log) and failed identically.

---

## 👻 False lead #5: the "ghost" IPv6 route

Another AI assistant suggested an IPv6 problem. The agent checked, and then retracted the idea: the Mac had no global IPv6, the `utun` default routes were interface-scoped system tunnels, the browser's IPv6 attempt failed instantly and fell back to IPv4, and my home network has no IPv6 at all. Ruled out. Account and cookies weren't it either: a completely clean Chrome profile, with no cookies, no account and no extensions, stalled too.

---

## 🔬 The clue in plain sight

All along there was one observation that, in hindsight, pointed away from the network. YouTube's response was **valid**: a SABR/UMP stream of about 1 MB of real audio and video, with stream protection status OK. The bytes arrived fast. But the player **never consumed them**: `video.readyState` stayed at 0, `buffered` was empty and the player sat in state 3 (buffering).

> *"The data arrives but the player never starts."* That is not a network problem.

---

## 🔁 The turn: making it reproducible

After a reboot it worked... and later it broke again. So I stopped guessing and asked the agent to build a **monitor**: every 2 minutes it launched a clean headless Chrome through the DevTools Protocol, loaded a video, checked `readyState` and `currentTime`, and snapshotted the system on every state change.

Then I noticed something, and this part was mine, not the agent's: **it broke exactly when I plugged in the USB-C hub**, on a setup I knew had worked the same way for four years. The agent ran an isolation test with the hub connected:

| Audio output | Chrome with `--disable-audio-output` | Chrome with audio |
| --- | --- | --- |
| MacBook speakers | OK | OK |
| HDMI monitor (VS278) | OK | FAIL (stuck at 0:00) |

There it was. Without audio the video plays; with audio going to the HDMI monitor, it doesn't.

---

## 🎯 The root cause: a stuck audio device

Plugging the hub makes macOS reconfigure displays and audio devices, and the HDMI monitor's audio device ends up **stuck**, even though it never disappears from the device list. Chromium won't start playback until it can open the audio sink, so the video waits forever even though the data has already arrived.

Here is my setup, with the exact spot where it failed:

<img class="theme-img theme-img--dark" src="/assets/images/blog/youtubeHdmiAudio/setup_EN_dark.webp" alt="My setup: where the failure was">
<img class="theme-img theme-img--light" src="/assets/images/blog/youtubeHdmiAudio/setup_EN_light.webp" alt="My setup: where the failure was">

This also explains the rest of the mystery:

- 📍 **"It only happens at home"**: that's where the hub and monitor setup lives. The network was a red herring; the correlation with place was really a correlation with **hardware**.
- ⏱️ **"It breaks from time to time"**: the hub is a bit flaky and gets touched. Every re-plug triggers the problem again.

---

## 🔧 The manual fix

You just need to **re-initialize the audio device**. Three ways:

1. Open *Audio MIDI Setup*, select the HDMI device and change the format from 48,000 Hz to 44,100 Hz and back.
2. Switch the sound output to another device and back.
3. Restart the audio service: `sudo killall coreaudiod`.

A counter-test confirmed that the **reset** is what fixes it, not the sample rate: 48 kHz works again after a reset. Setting a fixed rate does **not** help, because macOS already remembers it per device.

---

## 🤖 The automated fix

Since the problem came back with every re-plug, I asked the agent to automate it, and it wrote a small Swift program that uses CoreAudio and runs as a per-user LaunchAgent; I reviewed and installed it. It listens for changes to `kAudioHardwarePropertyDevices`, waits 4 seconds for things to settle (debounce), and toggles the target device's nominal sample rate to another available rate and back. The first version never triggered, because the monitor never disappears from the device list; the agent fixed it to react to any change in that list.

### 🧾 The program (`~/bin/hdmi-audio-reset.swift`)

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

### 📄 The LaunchAgent (`~/Library/LaunchAgents/local.hdmi-audio-reset.plist`)

Replace `YOUR_USER` with your user name and `VS278` with the name of your audio device.

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

### ▶️ Compile and install

```bash
swiftc -O -o ~/bin/hdmi-audio-reset ~/bin/hdmi-audio-reset.swift
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/local.hdmi-audio-reset.plist
```

To uninstall:

```bash
launchctl bootout gui/$(id -u)/local.hdmi-audio-reset
```

I verified it end to end: I unplugged and replugged the hub, the log showed `audio devices changed; resetting …`, then the reset, and YouTube played without touching anything.

---

## 🧠 Lessons

- **Rule out layers with evidence, not intuition.** Every false lead was closed with a concrete test, not a hunch.
- **Distrust the first plausible story.** The agent and I chased the network for hours because the story fit too well (the SASE and ISP cache theory was the agent's own).
- **"Data arrives but nothing plays" means look at the media pipeline** (audio, decoder), not the network.
- **Make the failure reproducible and automated.** A monitor every 2 minutes gave me what intuition couldn't: the trigger.
- **Change one variable at a time.** The isolation test in the table above solved in minutes what hours of hypotheses couldn't.
- **The correlation with place was really a correlation with a hardware setup.**

I did the investigation iterating with AI agents in the terminal (Claude Code, configured with [gentle-ai](https://github.com/Gentleman-Programming/gentle-ai)): they ran and organized the tests, and fell for wrong theories just like I did. This post was also drafted by sub-agents orchestrated by gentle-ai (the text in three languages and the illustrations), and I reviewed and corrected it. What moved us both forward was ruling things out with evidence.

If you have a Mac, a USB-C hub and HDMI audio, and YouTube sits at 0:00, try resetting the audio device first. It might save you a whole afternoon. 🎧

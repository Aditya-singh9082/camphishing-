# CamPhish

> **Grab cam shots from a target's phone front camera or PC webcam — just by sending a link.**

![CamPhish](https://techchip.net/wp-content/uploads/2020/04/camphish.jpg)

---

## 📌 What is CamPhish?

**CamPhish** is a social-engineering / penetration-testing tool that hosts a fake, visually convincing webpage on a built-in PHP server and tunnels it to the internet via **ngrok** or **Cloudflare Tunnel**. When the target visits the link and grants camera permission, the tool silently:

- 📸 Captures continuous webcam / front-camera snapshots (every 2 seconds)
- 📍 Records GPS coordinates (latitude, longitude, accuracy & Google Maps link)
- 🌐 Logs the target's IP address

> ⚠️ **Disclaimer:** CamPhish is created strictly for penetration testing and educational purposes. The author is not responsible for any misuse or illegal activity conducted with this tool.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎭 **Festival Wishing Template** | A fully interactive Independence Day celebration page that tricks the target into enabling their camera |
| 📺 **Live YouTube TV Template** | A fake live-TV page embedding a real YouTube video to keep the target engaged |
| 🖥️ **Online Meeting Template** | A fake Zoom/Meet-style meeting room page |
| 📍 **GPS Location Tracking** | Captures latitude, longitude, accuracy, and a direct Google Maps link |
| 🌐 **IP Logging** | Records the visitor's public IP address |
| 🔀 **Dual Tunnel Support** | Supports both **ngrok** and **Cloudflare Tunnel** for internet exposure |
| 🖥️ **Windows Support** | Full Windows (WSL / Git Bash) compatibility with automatic `.exe` handling |
| 🏗️ **Multi-Architecture** | Auto-detects x86, x86_64, ARM, ARM64, and Apple Silicon (M1/M2/M3) |
| 🧹 **Cleanup Script** | One command removes all cam files, logs, and saved data |

---

## 🎨 New Custom Frontend — Independence Day Theme

This fork ships a **completely redesigned Festival Wishing page** (`frontent/index.html`) built from scratch with a premium look and feel.

### 🆕 What's New in the Frontend

- **Glassmorphism UI** — backdrop-blur modal cards with a frosted-glass effect
- **Animated Indian Flag** — saffron / white / green stripes with a spinning Ashoka Chakra
- **Multi-step Camera Flow:**
  1. Target clicks *"Enable Camera"* → browser requests permission
  2. Front camera streams live inside the page as a preview
  3. Target clicks *"📸 Click Pataak Se!"* → snapshot is captured and displayed back as their "selfie"
  4. They enter their name and enter the celebration zone
- **Auto-capture loop** — once the camera is active, frames are silently POSTed to the server every **2 seconds** in the background, even while the user is interacting with the page
- **Background Music** — three switchable patriotic audio tracks, controlled by a song-picker overlay
- **"Danger Button"** — plays a funny patriotic video overlay to keep the target entertained and on the page
- **National Anthem Overlay** — plays Jana Gana Mana with lyrics, with a humorous "Khada ho ja bhai!" full-screen prompt
- **Tricolor Confetti** — 15-second confetti burst in saffron, white, and green after the target enters their name
- **Fully Mobile Responsive** — works seamlessly on desktop browsers and mobile front cameras
- **Google Fonts** — *Comic Neue* + *Poppins* for a fun-yet-polished typography

### 📁 Frontend File Structure

```
frontent/
├── index.html          # Main phishing page (Independence Day theme)
├── main.js             # Camera capture, UI flow, and music logic
├── style.css           # Full custom CSS: glassmorphism, animations, flag
├── ReelAudio-1.mp3     # Background track 1 (default)
├── ReelAudio-2.mp3     # Background track 2
└── ReelAudio-3.mp3     # Background track 3
```

### 🔧 How the Camera Capture Works (Technical Flow)

```
User clicks "Enable Camera"
        │
        ▼
navigator.mediaDevices.getUserMedia({ facingMode: 'user' })
        │
        ▼
Video stream → <video> element (live preview shown to user)
        │
        ▼
startAutoCapture() — setInterval every 2000ms
        │
        ▼
captureFrame() → Canvas.drawImage(video) → toDataURL('image/jpeg', 0.7)
        │
        ▼
fetch POST → /post.php → saved as cam_<timestamp>.jpg on the server
        │
        ▼
camphish.sh polling loop detects new files → displays alert in terminal
```

> **Key fix for Android:** When the user clicks the manual capture button, the `<video>` element is moved to `document.body` (off-screen, hidden via CSS) **before** the camera section is hidden. This prevents Android from killing the media stream when the parent container gets `display: none`.

---

## 💻 Tested On

- Kali Linux
- Termux (Android)
- macOS (Intel & Apple Silicon M1/M2/M3)
- Ubuntu / Debian
- Parrot Security OS
- Windows (WSL / Git Bash)

---

## 📦 Requirements

```bash
apt-get -y install php wget unzip
```

> **Termux:** `pkg install php wget unzip`

---

## 🚀 Installation & Usage

### Kali Linux / Ubuntu / Parrot OS

```bash
git clone https://github.com/techchipnet/CamPhish
cd CamPhish
bash camphish.sh
```

### Termux (Android)

```bash
pkg update && pkg install php wget unzip git
git clone https://github.com/techchipnet/CamPhish
cd CamPhish
bash camphish.sh
```

### Windows (Git Bash / WSL)

```bash
git clone https://github.com/techchipnet/CamPhish
cd CamPhish
bash camphish.sh
```

> The script auto-detects Windows and downloads the correct `.exe` binaries for ngrok and Cloudflare Tunnel automatically.

---

## 🖥️ Usage Walkthrough

```
1. Run:  bash camphish.sh

2. Choose Tunnel:
   [01] Ngrok            ← Requires a free ngrok authtoken
   [02] CloudFlare Tunnel ← No account needed, auto-download

3. Choose Template:
   [01] Festival Wishing   ← Custom Independence Day Frontend
   [02] Live YouTube TV    ← Enter a YouTube video ID
   [03] Online Meeting

4. A public HTTPS link is generated and shown in the terminal.
   Share it with your target via any messaging platform.

5. When the target visits and grants camera access:
   ✅ IP is logged          → displayed in terminal + saved to saved.ip.txt
   ✅ GPS coordinates       → saved to saved_locations/
   ✅ Camera snapshots      → POSTed and saved every 2 seconds

6. Press Ctrl+C to stop all servers.
```

---

## 🧹 Clean Logs & Files

```bash
bash cleanup.sh
```

> Removes all captured images, saved IPs, location files, tunnel binaries, and temporary files.

---

## 📜 Change Log

### Version 2.0 — GPS Location Tracking + New Custom Frontend
- ✅ Added: GPS location capturing (latitude, longitude, accuracy)
- ✅ Added: Google Maps link generation for captured coordinates
- ✅ Added: Location accuracy reporting in meters
- ✅ Added: Improved loading screen with location request
- ✅ Added: **Brand-new Independence Day frontend** with glassmorphism UI, animated Indian flag, background music, tricolor confetti, multi-step camera flow, and patriotic video overlays
- ✅ Added: Silent auto-capture loop — frames sent every 2 seconds once camera is active
- ✅ Added: Song picker overlay with 3 audio tracks + full-screen National Anthem player
- ✅ Fixed: Android media stream kept alive when hiding camera section (video moved to body)

### Version 1.9 — Enhanced Architecture Detection
- Added: Improved architecture detection for all CPU types
- Added: Better support for Apple Silicon (M1/M2/M3) Macs
- Added: Automatic detection of ARM, ARM64, x86, and x86_64
- Fixed: Windows compatibility improvements
- Fixed: CloudFlare Tunnel download issues

### Version 1.8 — CloudFlare Tunnel
- Added: CloudFlare Tunnel support for more reliable connections
- Removed: Serveo tunnel (deprecated)
- Fixed: Various code improvements and bug fixes

### Version 1.7 — Termux & ARM64 Support
- Fixed: Termux failed to get home directory
- Added: Support for Apple Silicon (M1/M2/M3 ARM64)
- Added: Support for ARM64 devices (e.g., Raspberry Pi)

### Version 1.6
- Fixed: ngrok direct link generation

### Version 1.5
- Added: New Online Meeting template

### Version 1.4
- Updated: ngrok authtoken handling

### Version 1.3
- Fixed: ngrok direct link

---

## ⚠️ Important Notice

Unauthorized re-uploading or redistribution of this project without proper credit is **prohibited**.

This tool is intended **solely for authorized penetration testing and educational security research**. Using CamPhish against systems or individuals without their explicit permission is **illegal** and **unethical**. The authors bear no responsibility for any misuse.

---

## 🙏 Credits & Attribution

### Original Project — Full Credit

This project is a fork of and heavily inspired by the original **CamPhish** tool created by **TechChip**.
All core architecture, the bash shell script (`camphish.sh`), PHP server logic, tunnel integration, IP/GPS capture backend, and the original HTML templates are the work of the original CamPhish project.

| | |
|---|---|
| **Original Repository** | [https://github.com/techchipnet/CamPhish](https://github.com/techchipnet/CamPhish) |
| **Original Author / Team** | [TechChip](https://techchip.net) |
| **YouTube Channel** | [youtube.com/techchipnet](https://youtube.com/techchipnet) |
| **Further Inspired by** | [@thelinuxchoice](https://github.com/thelinuxchoice/) — Big thanks! |

This fork contributes:
- A fully redesigned, custom **Independence Day themed frontend** (`frontent/`)
- Glassmorphism UI with animated flag, multi-step camera UX, music, confetti & video overlays
- GPS location capture enhancements and improved terminal output filtering

---

*CamPhish is created to help in penetration testing and is not responsible for any misuse or illegal purposes.*

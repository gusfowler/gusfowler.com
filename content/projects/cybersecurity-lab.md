---
title: Cybersecurity virtual lab
context: ASU CSE 468, Information Assurance · Jan – May 2022
weight: 10
group: school
featured: true
summary: "A Proxmox-hosted attack-and-defend network used to practice detecting and blocking intrusions with Snort and iptables."
---

For Information Assurance at Arizona State University, I built a virtual lab to practice detecting and defending against network intrusions.

- Used Proxmox and KVM to build a virtual network of three Ubuntu systems.
- Wrote more than 22 Snort rules to detect network scans and intrusion attempts.
- Wrote a Bash script that launched three network scans and four attacks with Nmap and hping3, so every change to the defenses could be tested the same way.
- Used iptables to protect the OpenSSH, vsftpd, and Apache services without blocking legitimate access.

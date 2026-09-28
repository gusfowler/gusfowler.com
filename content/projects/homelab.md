---
title: Homelab
context: Personal · ongoing since 2022
weight: 1
featured: true
summary: "A small network I run the way I would want a production one run: a Proxmox cluster behind an OpenWrt edge, segmented networks, a self-hosted tailnet, centralized monitoring and logging, and internal TLS."
---

My homelab started as a single Proxmox box running a router VM and a few services. It is now a small network that I run the way I would want a production network run: changes are planned, configuration is written down, and monitoring tells me when something breaks.

## What it is

- **Virtualization.** A multi-node Proxmox VE cluster running KVM virtual machines and LXC containers.
- **Routing and segmentation.** OpenWrt at the edge, on a firewall appliance I reflashed, with VLANs separating trusted devices, servers, IoT, and guests. Traffic between segments is denied unless a rule allows it.
- **Remote access.** A self-hosted headscale control server coordinates a Tailscale tailnet, so I can reach the lab from anywhere without opening inbound ports.
- **Monitoring and alerting.** Zabbix watches hosts, services, and network devices and pages me for problems that matter.
- **Logging.** Grafana Alloy ships logs to Loki, and Grafana is where I search them and build dashboards.
- **Certificates and ingress.** An internal certificate authority issues TLS certificates, and Traefik routes internal services behind them.
- **Configuration management.** Ansible keeps the fleet consistent.
- **Services.** Home Assistant, a video recorder for the cameras (Frigate), a photo library (Immich), and file sharing.
- **Operations agent.** An AI agent that reads the monitoring alerts, handles known fixes, and writes up the rest.

## What I have learned from it

Most of what I know about running networks outside of work came from breaking this one. Segmenting the network taught me to be deliberate about firewall policy. Running my own monitoring taught me the difference between an alert that means something and one that only makes noise. Running my own certificate authority taught me how much of the modern stack quietly depends on TLS being right.

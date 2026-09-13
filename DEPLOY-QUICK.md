# TripDusk — Quick Launch (Docker + Nginx, HTTPS)

Get the built site live on your VPS. Everything runs **from your Mac over SSH**.
Replace `you@YOUR_VPS_IP` with your SSH user + server IP in each command.

DNS: your `tripdusk.com` (and `www`) A-records already point at the VPS ✓

---

### 1. Build the site (on your Mac)
```
cd /Users/macpro/Desktop/tripdusk && npm run build
```

### 2. Create the folder on the VPS
```
ssh you@YOUR_VPS_IP 'sudo mkdir -p /opt/tripdusk/docker && sudo chown -R $USER /opt/tripdusk'
```

### 3. Upload the built site
```
rsync -avz --delete /Users/macpro/Desktop/tripdusk/_site/ you@YOUR_VPS_IP:/opt/tripdusk/_site/
```

### 4. Upload the Docker config
```
rsync -avz /Users/macpro/Desktop/tripdusk/docker-compose.yml /Users/macpro/Desktop/tripdusk/docker you@YOUR_VPS_IP:/opt/tripdusk/
```

### 5. Make sure Docker is installed on the VPS
```
ssh you@YOUR_VPS_IP 'docker --version || (curl -fsSL https://get.docker.com | sudo sh)'
```

### 6. Open the web ports (harmless if the firewall is off)
```
ssh you@YOUR_VPS_IP 'sudo ufw allow 80,443/tcp 2>/dev/null || true'
```

### 7. Launch
```
ssh you@YOUR_VPS_IP 'cd /opt/tripdusk && docker compose up -d'
```

### 8. Watch the HTTPS certificate get issued (~30–60s)
```
ssh you@YOUR_VPS_IP 'cd /opt/tripdusk && docker compose logs --tail=40 acme-companion'
```

### 9. Verify it's live
```
curl -I https://tripdusk.com
```
You want `HTTP/2 200`. Then open **https://tripdusk.com** in a browser. 🎉

---

## Publishing updates later (until the CMS is wired up)
Edit content, then run this one line — no restart needed, Nginx serves the new files instantly:
```
cd /Users/macpro/Desktop/tripdusk && npm run build && rsync -avz --delete _site/ you@YOUR_VPS_IP:/opt/tripdusk/_site/
```

---

## If something goes wrong

- **`docker compose` not found:** your Docker is older — use `docker-compose` instead.
- **`permission denied` on docker:** prefix with `sudo`, e.g. `sudo docker compose up -d`, or add your user to the docker group: `sudo usermod -aG docker $USER` then log out/in.
- **Certificate won't issue:** something else is using ports 80/443. Stop a host web server: `ssh you@YOUR_VPS_IP 'sudo systemctl stop nginx apache2 2>/dev/null'`, then re-run step 7.
- **502 / blank page:** the site didn't upload — re-run step 3, then `docker compose restart tripdusk`.
- **Still HTTP only after a minute:** re-run step 8; acme-companion retries automatically. Confirm DNS with `dig tripdusk.com +short` (should be your VPS IP).

## Handy
```
ssh you@YOUR_VPS_IP 'cd /opt/tripdusk && docker compose ps'
```
```
ssh you@YOUR_VPS_IP 'cd /opt/tripdusk && docker compose logs --tail=50 tripdusk'
```

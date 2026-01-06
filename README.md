# Spotify Now Playing Kiosk

A beautiful, display-only kiosk that shows what's currently playing on Spotify. Perfect for Raspberry Pi with vertical screens. Now available as a Docker container for easy deployment with CasaOS!

## Features

- **Real-time Spotify integration** - Shows currently playing track
- **Beautiful album art display** - Large artwork with blurred background
- **Progress bar** - Visual progress indicator with time elapsed/remaining
- **Auto-updates** - Refreshes every 2 seconds
- **No input required** - Display-only mode, perfect for kiosks
- **Vertical screen optimized** - Designed for portrait orientation

## Quick Start

### Docker / CasaOS (Recommended):

**Step 1: Build the Docker image**

SSH into your Pi or use CasaOS terminal:

```bash
cd /path/to/spotify-kiosk
docker build -t spotify-kiosk:latest .
```

**Step 2: Deploy in CasaOS**

1. **Open CasaOS Dashboard**
   - Go to your CasaOS web interface
   - Click on "App Store" or "Custom Installation"
   - Select "Docker Compose"

2. **Paste Docker Compose Configuration**
   - Copy the contents of `docker-compose.yml`
   - Paste into CasaOS

3. **Deploy**
   - Click "Install" or "Deploy"
   - Wait for the container to start

4. **Access**
   - Open `http://your-pi-ip:3000` in your browser

**Or use Docker Compose directly:**
```bash
docker-compose up -d
```

**Or build and run manually:**
```bash
docker build -t spotify-kiosk .
docker run -d -p 3000:3000 --name spotify-kiosk --restart unless-stopped spotify-kiosk
```

### On Raspberry Pi (without Docker - Legacy):

1. **In CasaOS App Store:**
   - Click "App Store" or "Custom App"
   - Select "Custom installation"
   - Paste the docker-compose.yml content OR use the build option

2. **Or use Docker Compose directly:**
   ```bash
   docker-compose up -d
   ```

3. **Or build and run manually:**
   ```bash
   docker build -t spotify-kiosk .
   docker run -d -p 3000:3000 --name spotify-kiosk --restart unless-stopped spotify-kiosk
   ```

4. **Access the kiosk:**
   - Open `http://localhost:3000` or `http://your-pi-ip:3000`

### On Raspberry Pi (without Docker):

1. **Transfer files to your Pi** (via USB, SCP, or git)
   ```bash
   scp -r * pi@your-pi-ip:/home/pi/spotify-kiosk/
   ```

2. **Run setup script** (installs Node.js if needed):
   ```bash
   chmod +x kiosk-setup.sh
   ./kiosk-setup.sh
   ```

3. **Start the server**:
   ```bash
   ./start.sh
   ```
   Or manually: `node server.js`

4. **Open in browser**:
   - Local: `http://localhost:3000`
   - Network: `http://your-pi-ip:3000`

### Auto-start on boot (optional):

1. Create a systemd service:
   ```bash
   sudo nano /etc/systemd/system/spotify-kiosk.service
   ```

2. Add this content (update paths):
   ```ini
   [Unit]
   Description=Spotify Kiosk Server
   After=network.target

   [Service]
   Type=simple
   User=pi
   WorkingDirectory=/home/pi/spotify-kiosk
   ExecStart=/usr/bin/node /home/pi/spotify-kiosk/server.js
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

3. Enable and start:
   ```bash
   sudo systemctl enable spotify-kiosk
   sudo systemctl start spotify-kiosk
   ```

### Kiosk Mode (Chromium):

To run in full-screen kiosk mode on Raspberry Pi:

1. Install Chromium:
   ```bash
   sudo apt-get install chromium-browser
   ```

2. Add to autostart (create `~/.config/lxsession/LXDE-pi/autostart`):
   ```bash
   @chromium-browser --kiosk --disable-infobars http://localhost:3000
   ```

Or start manually:
   ```bash
   chromium-browser --kiosk --disable-infobars http://localhost:3000
   ```

## Files

**Core Application:**
- `index.html` - Main HTML structure
- `styles.css` - Styling and animations
- `script.js` - Client-side JavaScript (connects to server API)

**Server:**
- `server.js` - HTTP server with Spotify API proxy endpoints
- `package.json` - Node.js package configuration (includes dotenv)
- `.env` - Environment variables for Spotify credentials (create this file)
- `.env.example` - Example environment variables file

**Docker:**
- `Dockerfile` - Docker container definition
- `docker-compose.yml` - Docker Compose configuration
- `.dockerignore` - Files excluded from Docker build

**Documentation:**
- `README.md` - This file

## Configuration

### Environment Variables

The Spotify credentials must be configured using environment variables. Create a `.env` file in the project root:

```bash
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REFRESH_TOKEN=your_refresh_token_here
```

**For Docker/Compose:**
- The `docker-compose.yml` file is already configured to read from environment variables
- Make sure to set these variables in your environment or `.env` file before running `docker-compose up`

**For local development:**
- Install dependencies: `npm install`
- Create a `.env` file with your credentials
- Run: `npm start` or `node server.js`

The kiosk will automatically:
- Connect to Spotify API using server-side credentials
- Show currently playing track
- Update every 2 seconds
- Handle token refresh automatically

## Troubleshooting

- **"Setup Required"** - Check that environment variables are set correctly in `.env` file
- **"Connection Error"** - Check internet connection and API credentials in environment variables
- **Server won't start** - Make sure you've created a `.env` file with all three Spotify credentials
- **"Failed to get access token"** - Verify your `SPOTIFY_REFRESH_TOKEN` is valid and not expired
- **"Paused"** - Spotify is not currently playing (shows last played track)
- **Port already in use** - Change port mapping in `docker-compose.yml` (e.g., `"3001:3000"`)
- **Docker image not found** - Build the image first: `docker build -t spotify-kiosk:latest .`
- **Container won't start** - Check logs: `docker logs spotify-kiosk`

## Browser Compatibility

Works in all modern browsers. For kiosk deployment, Chromium is recommended on Raspberry Pi.

## Notes

- Make sure Spotify is playing on the account you authenticated
- The server runs on port 3000 by default (change in `server.js` if needed)
- All user interactions are disabled - display only

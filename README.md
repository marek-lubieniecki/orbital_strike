# 🚀 Orbit Strike

An AI-powered orbital mechanics game where you play as an AI learning to navigate gravitational fields across the solar system.

## 🎮 Play Online

- **Production**: [GitLab Pages URL] (after deployment)
- **Original Version**: `index.html`
- **Modular Version**: `index-modular.html`

## 🏗️ Development

### Prerequisites
- Node.js 18+ (for building modular version)
- Python 3 (for local development server)

### Quick Start

```bash
# Clone and enter directory
git clone <your-repo-url>
cd orbit_strike

# For development with modules
npm install
npm run dev          # Start dev server at http://localhost:3000

# Or use Python server for original version
python3 -m http.server 8000  # http://localhost:8000
```

### Build for Production

```bash
# Automated build
./build.sh

# Manual build
npm install
npm run build        # Creates dist/ folder
npm run preview      # Preview built version
```

## 📁 Project Structure

### Original (Single File)
```
game.js              # Monolithic game code
index.html           # Original version
```

### Refactored (Modular)
```
src/
  core/
    ├── Vector2.js           # Math utilities
    ├── CelestialTypes.js    # Space body definitions  
    └── Game.js              # Main game class
  entities/
    ├── SpaceBody.js         # Planets, asteroids
    ├── Target.js            # Targets to hit
    ├── Bullet.js            # Projectiles
    └── Cannon.js            # Launcher
  systems/
    └── NarrativeSystem.js   # AI story content
  ui/
    └── MessageRenderer.js   # Intro/completion overlays
  └── index.js               # Module exports
```

## 🚀 Deployment

### GitLab Pages (Automatic)

The project uses GitLab CI/CD for automatic deployment:

1. **Push to main branch**
2. **Pipeline runs automatically**:
   - 📦 Install dependencies
   - 🔨 Build modular version
   - ✅ Run tests
   - 🌐 Deploy to GitLab Pages

3. **Access your game** at: `https://username.gitlab.io/orbit_strike`

### Manual Deployment

```bash
# Build locally
npm run build

# Upload dist/ folder to any static hosting
# (Netlify, Vercel, GitHub Pages, etc.)
```

## 🎯 Game Features

- **AI Narrative**: Play as an AI learning orbital mechanics
- **Solar System Progression**: Earth → Inner System → Outer System → Interstellar
- **Realistic Physics**: Gravity affects projectile trajectories
- **Educational Content**: Learn about celestial body types and orbital mechanics
- **Mobile Support**: Touch controls for mobile devices

## 📝 Version History

- **v1.5.0**: Modular refactor + build system
- **v1.4.0**: Hold-to-charge launch system  
- **v1.3.0**: Body-mounted cannon mechanics
- **v1.2.0**: Procedural level generation
- **v1.1.0**: JSON level loading system
- **v1.0.0**: Initial release

## 🛠️ Available Scripts

```bash
npm run dev      # Development server with hot reload
npm run build    # Build for production
npm run preview  # Preview built version
npm run serve    # Python HTTP server (original version)
```

## 🐛 Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Module Loading Issues
- Use `npm run dev` for development (handles CORS)
- Built version works on any static hosting
- Original version works without build process

## 📄 License

MIT License - Feel free to use and modify!
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    subtract(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    multiply(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const mag = this.magnitude();
        return mag > 0 ? new Vector2(this.x / mag, this.y / mag) : new Vector2(0, 0);
    }

    distance(other) {
        return this.subtract(other).magnitude();
    }
}

// Celestial body types with realistic astronomical data
const CELESTIAL_TYPES = {
    asteroid: {
        name: "Asteroid",
        mass: 9.39e20, // kg (Ceres mass)
        diameter: 940000, // meters (Ceres diameter)
        gameplayRadius: 12, // Scaled for gameplay
        gameplayMass: 15, // Scaled for gameplay
        color: '#8B7355',
        description: "Rocky remnants from the early solar system",
        realWorldExamples: [
            { name: "Ceres", diameter: "940 km", mass: "9.39×10²⁰ kg" },
            { name: "Vesta", diameter: "525 km", mass: "2.59×10²⁰ kg" },
            { name: "Pallas", diameter: "512 km", mass: "2.04×10²⁰ kg" }
        ],
        facts: [
            "Most asteroids orbit between Mars and Jupiter",
            "Made of rock, metal, and sometimes ice",
            "The largest asteroid is Ceres, now classified as a dwarf planet",
            "Over 1 million asteroids larger than 1 km exist",
            "Some asteroids have their own moons"
        ]
    },
    dwarf_planet: {
        name: "Dwarf Planet",
        mass: 1.31e22, // kg (Pluto mass)
        diameter: 2374000, // meters (Pluto diameter)
        gameplayRadius: 20,
        gameplayMass: 35,
        color: '#A0522D',
        description: "Small planetary bodies that haven't cleared their orbital path",
        realWorldExamples: [
            { name: "Pluto", diameter: "2,374 km", mass: "1.31×10²² kg" },
            { name: "Eris", diameter: "2,326 km", mass: "1.66×10²² kg" },
            { name: "Makemake", diameter: "1,430 km", mass: "3×10²¹ kg" }
        ],
        facts: [
            "Pluto was reclassified as a dwarf planet in 2006",
            "Must orbit the Sun and have enough mass to be roughly round",
            "Haven't cleared other objects from their orbital neighborhood",
            "Most are located in the Kuiper Belt beyond Neptune",
            "Ceres is the only dwarf planet in the asteroid belt"
        ]
    },
    planet: {
        name: "Planet",
        mass: 5.97e24, // kg (Earth mass)
        diameter: 12742000, // meters (Earth diameter)
        gameplayRadius: 30,
        gameplayMass: 65,
        color: '#4169E1',
        description: "Large celestial bodies that orbit a star and have cleared their orbit",
        realWorldExamples: [
            { name: "Earth", diameter: "12,742 km", mass: "5.97×10²⁴ kg" },
            { name: "Mars", diameter: "6,779 km", mass: "6.39×10²³ kg" },
            { name: "Venus", diameter: "12,104 km", mass: "4.87×10²⁴ kg" }
        ],
        facts: [
            "There are 8 planets in our solar system",
            "Must orbit the Sun, have sufficient mass to be round, and clear their orbit",
            "Rocky planets are closer to the Sun than gas giants",
            "Earth is the only known planet with life",
            "Venus rotates backwards compared to most planets"
        ]
    },
    gas_giant: {
        name: "Gas Giant",
        mass: 1.898e27, // kg (Jupiter mass)
        diameter: 139820000, // meters (Jupiter diameter)
        gameplayRadius: 45,
        gameplayMass: 100,
        color: '#FF8C00',
        description: "Massive planets composed primarily of hydrogen and helium",
        realWorldExamples: [
            { name: "Jupiter", diameter: "139,820 km", mass: "1.90×10²⁷ kg" },
            { name: "Saturn", diameter: "116,460 km", mass: "5.68×10²⁶ kg" },
            { name: "Neptune", diameter: "49,244 km", mass: "1.02×10²⁶ kg" }
        ],
        facts: [
            "Jupiter is the largest planet in our solar system",
            "Saturn's rings are made of ice and rock particles",
            "Gas giants have no solid surface to land on",
            "Jupiter has over 80 moons including the four largest: Io, Europa, Ganymede, Callisto",
            "Uranus rotates on its side due to an ancient collision"
        ]
    },
    star: {
        name: "Star",
        mass: 1.989e30, // kg (Sun mass)
        diameter: 1391000000, // meters (Sun diameter)
        gameplayRadius: 60,
        gameplayMass: 150,
        color: '#FFD700',
        description: "Massive balls of plasma that generate energy through nuclear fusion",
        realWorldExamples: [
            { name: "Sun", diameter: "1,391,000 km", mass: "1.99×10³⁰ kg" },
            { name: "Proxima Centauri", diameter: "200,000 km", mass: "2.45×10²⁹ kg" },
            { name: "Betelgeuse", diameter: "1.2 billion km", mass: "2.2×10³¹ kg" }
        ],
        facts: [
            "The Sun contains 99.86% of the solar system's mass",
            "Stars fuse hydrogen into helium in their cores",
            "The nearest star to Earth (after the Sun) is 4.24 light-years away",
            "Stars are classified by color: blue (hottest) to red (coolest)",
            "When massive stars die, they can become black holes or neutron stars"
        ]
    }
};

class SpaceBody {
    constructor(x, y, type = 'asteroid') {
        this.position = new Vector2(x, y);
        this.type = type;
        this.data = CELESTIAL_TYPES[type];
        
        // Real astronomical values for educational display
        this.realMass = this.data.mass; // kg
        this.realDiameter = this.data.diameter; // meters
        
        // Scaled values for gameplay
        this.mass = this.data.gameplayMass;
        this.radius = this.data.gameplayRadius;
        this.color = this.data.color;
        this.gravitationalConstant = 5000;
        this.randomFact = this.data.facts[Math.floor(Math.random() * this.data.facts.length)];
    }
    
    formatMass() {
        // Convert kg to scientific notation with appropriate units
        if (this.realMass >= 1e30) {
            return `${(this.realMass / 1e30).toFixed(2)} × 10³⁰ kg`;
        } else if (this.realMass >= 1e27) {
            return `${(this.realMass / 1e27).toFixed(2)} × 10²⁷ kg`;
        } else if (this.realMass >= 1e24) {
            return `${(this.realMass / 1e24).toFixed(2)} × 10²⁴ kg`;
        } else if (this.realMass >= 1e21) {
            return `${(this.realMass / 1e21).toFixed(2)} × 10²¹ kg`;
        } else {
            return `${(this.realMass / 1e20).toFixed(2)} × 10²⁰ kg`;
        }
    }
    
    formatDiameter() {
        // Convert meters to km
        const km = this.realDiameter / 1000;
        if (km >= 1000000) {
            return `${(km / 1000000).toFixed(1)} million km`;
        } else if (km >= 1000) {
            return `${(km / 1000).toFixed(0)},000 km`;
        } else {
            return `${km.toFixed(0)} km`;
        }
    }
    
    calculateDensity() {
        // Calculate density in g/cm³
        const radiusM = this.realDiameter / 2; // radius in meters
        const volumeM3 = (4/3) * Math.PI * Math.pow(radiusM, 3); // volume in m³
        const densityKgM3 = this.realMass / volumeM3; // kg/m³
        const densityGCm3 = densityKgM3 / 1000; // g/cm³
        return densityGCm3.toFixed(1);
    }
    
    getGravitationalAcceleration() {
        // Calculate surface gravity in m/s²
        const G = 6.674e-11; // Gravitational constant
        const radiusM = this.realDiameter / 2;
        const surfaceGravity = (G * this.realMass) / Math.pow(radiusM, 2);
        return surfaceGravity.toFixed(1);
    }

    draw(ctx) {
        ctx.save();
        
        // Simple solid circle for all body types
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Gravitational field visualization (intensity based on mass)
        const fieldRadius = this.radius * (2 + this.mass / 50);
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, fieldRadius, 0, Math.PI * 2);
        ctx.strokeStyle = this.color + '20';
        ctx.lineWidth = Math.max(1, this.mass / 30);
        ctx.stroke();
        
        // Strong gravity indicator for massive objects
        if (this.mass > 80) {
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, fieldRadius * 1.3, 0, Math.PI * 2);
            ctx.strokeStyle = this.color + '15';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        ctx.restore();
    }

    getGravitationalForce(position, mass) {
        const direction = this.position.subtract(position);
        const distance = direction.magnitude();
        
        if (distance < this.radius + 5) {
            return new Vector2(0, 0);
        }
        
        const forceMagnitude = (this.gravitationalConstant * this.mass * mass) / (distance * distance);
        return direction.normalize().multiply(forceMagnitude);
    }
}

class Bullet {
    constructor(x, y, velocity) {
        this.position = new Vector2(x, y);
        this.velocity = velocity;
        this.mass = 1;
        this.radius = 6;
        this.trail = [];
        this.maxTrailLength = 20;
        this.alive = true;
    }

    update(spaceBodies, deltaTime, canvasWidth, canvasHeight) {
        if (!this.alive) return;

        this.trail.push(new Vector2(this.position.x, this.position.y));
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        let totalForce = new Vector2(0, 0);
        spaceBodies.forEach(body => {
            const force = body.getGravitationalForce(this.position, this.mass);
            totalForce = totalForce.add(force);
        });

        const acceleration = totalForce.multiply(1 / this.mass);
        this.velocity = this.velocity.add(acceleration.multiply(deltaTime));
        this.position = this.position.add(this.velocity.multiply(deltaTime));

        if (this.position.x < -50 || this.position.x > canvasWidth + 50 ||
            this.position.y < -50 || this.position.y > canvasHeight + 50) {
            this.alive = false;
        }
    }

    draw(ctx) {
        if (!this.alive) return;

        ctx.save();
        
        // Draw exhaust trail
        if (this.trail.length > 1) {
            for (let i = 1; i < this.trail.length; i++) {
                const alpha = (i / this.trail.length) * 0.8;
                const width = (i / this.trail.length) * 6;
                
                ctx.globalAlpha = alpha;
                ctx.strokeStyle = '#ff8800';
                ctx.lineWidth = width;
                ctx.beginPath();
                ctx.moveTo(this.trail[i-1].x, this.trail[i-1].y);
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
                ctx.stroke();
            }
        }
        
        // Calculate rocket angle based on velocity
        const angle = Math.atan2(this.velocity.y, this.velocity.x);
        
        ctx.globalAlpha = 1;
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(angle);
        
        // Draw rocket body
        ctx.fillStyle = '#cccccc';
        ctx.fillRect(-8, -3, 16, 6);
        
        // Draw rocket nose cone
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(12, -2);
        ctx.lineTo(12, 2);
        ctx.closePath();
        ctx.fill();
        
        // Draw rocket fins
        ctx.fillStyle = '#666666';
        ctx.beginPath();
        ctx.moveTo(-8, -3);
        ctx.lineTo(-12, -5);
        ctx.lineTo(-10, -3);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(-8, 3);
        ctx.lineTo(-12, 5);
        ctx.lineTo(-10, 3);
        ctx.closePath();
        ctx.fill();
        
        // Draw exhaust flame
        const flameLength = 8 + Math.random() * 4;
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(-8, -2);
        ctx.lineTo(-8 - flameLength, 0);
        ctx.lineTo(-8, 2);
        ctx.closePath();
        ctx.fill();
        
        // Inner flame
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.moveTo(-8, -1);
        ctx.lineTo(-8 - flameLength * 0.7, 0);
        ctx.lineTo(-8, 1);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }

    checkCollision(target) {
        return this.position.distance(target.position) < this.radius + target.radius;
    }

    checkSpaceBodyCollision(spaceBody) {
        return this.position.distance(spaceBody.position) < this.radius + spaceBody.radius;
    }
}

class Target {
    constructor(x, y, movementType = 'static', orbitCenter = null, orbitRadius = 0, orbitalSpeed = 0) {
        this.position = new Vector2(x, y);
        this.radius = 15;
        this.color = '#50e3c2';
        this.pulseTime = 0;
        this.hit = false;
        
        // Orbital movement properties
        this.movementType = movementType;
        this.orbitCenter = orbitCenter;
        this.orbitRadius = orbitRadius;
        this.orbitalSpeed = orbitalSpeed; // radians per second
        this.orbitAngle = 0;
        
        // Calculate initial angle based on current position
        if (orbitCenter) {
            const direction = this.position.subtract(orbitCenter);
            this.orbitAngle = Math.atan2(direction.y, direction.x);
        }
    }

    update(deltaTime, canvasWidth, canvasHeight) {
        this.pulseTime += deltaTime * 3;
        
        if (this.hit) return;
        
        if (this.movementType === 'orbit' && this.orbitCenter) {
            this.updateOrbitalMovement(deltaTime);
        }
    }
    
    updateOrbitalMovement(deltaTime) {
        // Update orbital angle based on speed
        this.orbitAngle += this.orbitalSpeed * deltaTime;
        
        // Calculate new position
        this.position.x = this.orbitCenter.x + Math.cos(this.orbitAngle) * this.orbitRadius;
        this.position.y = this.orbitCenter.y + Math.sin(this.orbitAngle) * this.orbitRadius;
    }
    
    // Calculate realistic orbital period for educational display
    getOrbitalPeriod() {
        if (!this.orbitCenter) return 0;
        return (2 * Math.PI) / this.orbitalSpeed; // seconds for complete orbit
    }
    
    // Get orbital velocity in pixels per second
    getOrbitalVelocity() {
        if (!this.orbitCenter) return 0;
        return this.orbitRadius * this.orbitalSpeed; // tangential velocity
    }

    draw(ctx) {
        if (this.hit) return;
        

        ctx.save();
        const pulse = Math.sin(this.pulseTime) * 0.2 + 1;
        
        // Draw orbital path for orbiting targets
        if (this.movementType === 'orbit' && this.orbitCenter) {
            ctx.beginPath();
            ctx.arc(this.orbitCenter.x, this.orbitCenter.y, this.orbitRadius, 0, Math.PI * 2);
            ctx.strokeStyle = '#ff6b6b30';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Draw velocity indicator (small arrow showing direction)
            const velocityAngle = this.orbitAngle + Math.PI / 2; // Perpendicular to radius
            const arrowLength = 15;
            const arrowX = this.position.x + Math.cos(velocityAngle) * arrowLength;
            const arrowY = this.position.y + Math.sin(velocityAngle) * arrowLength;
            
            ctx.strokeStyle = '#ff6b6b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.position.x, this.position.y);
            ctx.lineTo(arrowX, arrowY);
            ctx.stroke();
            
            // Arrow head
            const headSize = 4;
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(arrowX - Math.cos(velocityAngle + 0.5) * headSize, 
                       arrowY - Math.sin(velocityAngle + 0.5) * headSize);
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(arrowX - Math.cos(velocityAngle - 0.5) * headSize, 
                       arrowY - Math.sin(velocityAngle - 0.5) * headSize);
            ctx.stroke();
        }
        
        // Different visual style for orbiting targets
        if (this.movementType === 'orbit') {
            // Orbiting targets have a double ring
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.radius * pulse * 1.3, 0, Math.PI * 2);
            ctx.strokeStyle = '#ff6b6b';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Standard target ring
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Inner filled circle
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius * 0.5 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = this.color + '60';
        ctx.fill();
        
        // Center dot for orbiting targets
        if (this.movementType === 'orbit') {
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#ff6b6b';
            ctx.fill();
        }
        
        ctx.restore();
    }
}

class Cannon {
    constructor(x, y) {
        this.position = new Vector2(x, y);
        this.angle = 0;
        this.length = 40;
        this.width = 8;
    }

    aimAt(targetPosition) {
        const direction = targetPosition.subtract(this.position);
        this.angle = Math.atan2(direction.y, direction.x);
        // Debug: uncomment next line to see angle changes
    }

    draw(ctx) {
        ctx.save();
        
        // Draw mounting base if cannon is mounted on a body
        if (this.isMounted && this.mountedBody) {
            // Draw connection line from body center to cannon
            ctx.strokeStyle = '#444';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(this.mountedBody.position.x, this.mountedBody.position.y);
            ctx.lineTo(this.position.x, this.position.y);
            ctx.stroke();
            
            // Draw mounting platform
            ctx.fillStyle = '#555';
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, 12, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        
        ctx.fillStyle = '#888';
        ctx.fillRect(0, -this.width/2, this.length, this.width);
        
        ctx.beginPath();
        ctx.arc(0, 0, this.width, 0, Math.PI * 2);
        ctx.fillStyle = '#666';
        ctx.fill();
        
        ctx.restore();
    }

    shoot(launchVelocity = 120) {
        const muzzlePosition = this.position.add(new Vector2(
            Math.cos(this.angle) * this.length,
            Math.sin(this.angle) * this.length
        ));
        
        const velocity = new Vector2(
            Math.cos(this.angle) * launchVelocity,
            Math.sin(this.angle) * launchVelocity
        );
        
        return new Bullet(muzzlePosition.x, muzzlePosition.y, velocity);
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        
        this.spaceBodies = [];
        this.bullets = [];
        this.targets = [];
        this.cannon = null;
        this.score = 0;
        this.level = 1;
        this.levelCompleted = false;
        this.initialized = false;
        
        // Rocket tracking
        this.rocketsLaunched = 0;
        this.levelRockets = 0;
        
        // Completion message
        this.completionMessage = null;
        
        this.mousePosition = new Vector2(0, 0);
        this.isMobile = this.checkMobile();
        
        // Launch power system
        this.isCharging = false;
        this.chargeStartTime = 0;
        this.minLaunchVelocity = 120; // Base velocity
        this.maxLaunchVelocity = 240; // 2x base velocity
        this.maxChargeTime = 1000; // 1 second for full charge
        
        this.setupEventListeners();
        this.initialize();
    }

    async initialize() {
        try {
            await levelLoader.initialize();
            await this.initializeLevel();
            this.initialized = true;
            
            this.lastTime = 0;
            this.gameLoop = this.gameLoop.bind(this);
            console.log('Starting game loop...');
            requestAnimationFrame(this.gameLoop);
        } catch (error) {
            console.error('Failed to initialize game:', error);
            // Fallback to original hardcoded levels
            this.initializeFallbackLevel();
            this.initialized = true;
            this.lastTime = 0;
            this.gameLoop = this.gameLoop.bind(this);
            requestAnimationFrame(this.gameLoop);
        }
    }

    setupCanvas() {
        const container = document.getElementById('gameContainer');
        const availableWidth = window.innerWidth;
        const availableHeight = window.innerHeight;
        
        // Check if device is mobile/vertical orientation
        const isVertical = window.innerHeight > window.innerWidth || this.isMobile;
        
        if (isVertical || this.isMobile) {
            // Mobile layout - use full screen with no margins
            this.canvas.width = availableWidth;
            this.canvas.height = availableHeight;
        } else {
            // Desktop/horizontal layout  
            const maxWidth = availableWidth - 40;
            const maxHeight = availableHeight - 40;
            this.canvas.width = Math.min(800, maxWidth);
            this.canvas.height = Math.min(600, maxHeight);
        }
        
        container.style.width = this.canvas.width + 'px';
        container.style.height = this.canvas.height + 'px';
    }

    checkMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    setupEventListeners() {
        if (this.isMobile) {
            this.canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                this.mousePosition = new Vector2(
                    touch.clientX - rect.left,
                    touch.clientY - rect.top
                );
                this.startCharging();
            });
            
            this.canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                this.mousePosition = new Vector2(
                    touch.clientX - rect.left,
                    touch.clientY - rect.top
                );
            });
            
            this.canvas.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.shoot();
            });
            
            this.canvas.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this.cancelCharge();
            });
        } else {
            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mousePosition = new Vector2(
                    e.clientX - rect.left,
                    e.clientY - rect.top
                );
            });
            
            this.canvas.addEventListener('mousedown', (e) => {
                console.log('Mouse down at:', this.mousePosition);
                this.startCharging();
            });
            
            this.canvas.addEventListener('mouseup', (e) => {
                console.log('Mouse up, shooting');
                this.shoot();
            });
        }

        window.addEventListener('resize', async () => {
            this.setupCanvas();
            if (this.initialized) {
                await this.initializeLevel();
            }
        });
    }

    async initializeLevel() {
        this.spaceBodies = [];
        this.bullets = [];
        this.targets = [];
        
        // Reset level rocket counter
        this.levelRockets = 0;
        
        // Position cannon - will be set during level generation
        // Some levels will place it on body surfaces, others use default position
        this.cannon = null;
        
        try {
            // Try to load level from JSON file first (for custom levels)
            const levelData = await levelLoader.loadLevel(this.level);
            this.loadLevelFromData(levelData);
            console.log(`Loaded custom level ${this.level} from JSON`);
        } catch (error) {
            // Use procedural generation as the primary method
            console.log(`Generating procedural level ${this.level}`);
            this.generateProceduralLevel();
            console.log(`Level ${this.level} generated with ${this.spaceBodies.length} space bodies and ${this.targets.length} targets`);
        }
        
        this.updateUI();
    }

    loadLevelFromData(levelData) {
        console.log(`Loading level ${levelData.id}: ${levelData.name}`);
        
        // Create space bodies from level data
        levelData.spaceBodies.forEach(bodyData => {
            const position = new Vector2(
                levelLoader.resolvePosition(bodyData.position.x, this.canvas.width, this.canvas.height),
                levelLoader.resolvePosition(bodyData.position.y, this.canvas.width, this.canvas.height)
            );
            
            const spaceBody = new SpaceBody(position.x, position.y, bodyData.type);
            spaceBody.id = bodyData.id;
            this.spaceBodies.push(spaceBody);
        });
        
        // Create targets from level data
        levelData.targets.forEach(targetData => {
            const position = new Vector2(
                levelLoader.resolvePosition(targetData.position.x, this.canvas.width, this.canvas.height),
                levelLoader.resolvePosition(targetData.position.y, this.canvas.width, this.canvas.height)
            );
            
            let target;
            if (targetData.movementType === 'orbit' && targetData.orbitCenter) {
                const orbitCenter = new Vector2(
                    levelLoader.resolvePosition(targetData.orbitCenter.x, this.canvas.width, this.canvas.height),
                    levelLoader.resolvePosition(targetData.orbitCenter.y, this.canvas.width, this.canvas.height)
                );
                target = new Target(
                    position.x, 
                    position.y, 
                    'orbit',
                    orbitCenter,
                    targetData.orbitRadius,
                    targetData.orbitalSpeed
                );
            } else {
                target = new Target(position.x, position.y, 'static');
            }
            
            target.id = targetData.id;
            this.targets.push(target);
        });
    }

    generateProceduralLevel() {
        // Mobile-aware procedural level generation
        const safeMargin = 60;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const canvasW = this.canvas.width;
        const canvasH = this.canvas.height;
        
        // Define safe play area boundaries
        this.playArea = {
            minX: safeMargin,
            maxX: canvasW - safeMargin,
            minY: safeMargin,
            maxY: canvasH - safeMargin,
            centerX: centerX,
            centerY: centerY,
            width: canvasW - 2 * safeMargin,
            height: canvasH - 2 * safeMargin
        };
        
        // Generate level based on progression
        if (this.level === 1) {
            this.generateTutorialLevel();
        } else if (this.level === 2) {
            this.generateSingleBodyLevel();
        } else if (this.level === 3) {
            this.generateDoubleBodyLevel();
        } else if (this.level === 4) {
            this.generateCorridorLevel();
        } else if (this.level === 5) {
            this.generateAsteroidFieldLevel();
        } else {
            // Level 6 and beyond use advanced procedural generation
            this.generateAdvancedLevel();
        }
    }

    // Mobile-aware level generation methods

    generateTutorialLevel() {
        // Level 1: No bodies - pure tutorial to learn shooting mechanics
        this.setupDefaultCannonPosition();
        
        const targetCount = 3;
        
        // Create simple targets in easy-to-reach positions
        const targetPositions = [
            { x: this.playArea.centerX + this.playArea.width * 0.2, y: this.playArea.centerY - this.playArea.height * 0.1 },
            { x: this.playArea.centerX + this.playArea.width * 0.3, y: this.playArea.centerY },
            { x: this.playArea.centerX + this.playArea.width * 0.2, y: this.playArea.centerY + this.playArea.height * 0.1 }
        ];
        
        targetPositions.forEach(pos => {
            this.targets.push(new Target(pos.x, pos.y, 'static'));
        });
    }

    generateSingleBodyLevel() {
        // Level 2: Single body - learn basic gravity assists, simple version
        this.setupDefaultCannonPosition(); // Keep cannon in corner for simplicity
        
        const body = new SpaceBody(
            Math.max(this.playArea.minX + 100, this.playArea.centerX - this.playArea.width * 0.2),
            this.playArea.centerY,
            'asteroid'
        );
        this.spaceBodies.push(body);
        
        // Generate targets with collision checking to avoid overlapping with body
        this.generateSafeTargets(3);
    }

    generateDoubleBodyLevel() {
        // Level 3: Two bodies - intermediate gravity assists, still accessible
        this.setupDefaultCannonPosition(); // Keep cannon in corner
        
        const body1 = new SpaceBody(
            Math.max(this.playArea.minX + 80, this.playArea.centerX - this.playArea.width * 0.25),
            Math.max(this.playArea.minY + 80, this.playArea.centerY - this.playArea.height * 0.2),
            'asteroid'
        );
        const body2 = new SpaceBody(
            Math.min(this.playArea.maxX - 100, this.playArea.centerX + this.playArea.width * 0.2),
            Math.min(this.playArea.maxY - 80, this.playArea.centerY + this.playArea.height * 0.2),
            'dwarf_planet'
        );
        this.spaceBodies.push(body1, body2);
        
        // Generate targets with collision checking to avoid overlapping with bodies
        this.generateSafeTargets(3);
    }

    generateCorridorLevel() {
        // Level 4: Two large bodies creating a corridor, default cannon position
        this.setupDefaultCannonPosition();
        
        const body1 = new SpaceBody(
            Math.max(this.playArea.minX + 120, this.playArea.centerX - this.playArea.width * 0.2),
            Math.max(this.playArea.minY + 120, this.playArea.centerY - this.playArea.height * 0.15),
            'planet'
        );
        const body2 = new SpaceBody(
            Math.min(this.playArea.maxX - 120, this.playArea.centerX + this.playArea.width * 0.2),
            Math.min(this.playArea.maxY - 120, this.playArea.centerY + this.playArea.height * 0.15),
            'gas_giant'
        );
        this.spaceBodies.push(body1, body2);
        
        // Generate targets with collision checking to avoid overlapping with corridor bodies
        this.generateSafeTargets(4);
    }

    generateAsteroidFieldLevel() {
        // Level 5: Simple asteroid field - traditional cannon position
        this.setupDefaultCannonPosition(); // Keep cannon in corner for learning
        
        const asteroidCount = Math.floor(this.playArea.width * this.playArea.height / 20000); // Less dense for easier learning
        const minAsteroids = 4;
        const maxAsteroids = 8;
        const actualCount = Math.max(minAsteroids, Math.min(maxAsteroids, asteroidCount));
        
        // Create simpler asteroid field with clear paths
        for (let i = 0; i < actualCount; i++) {
            let attempts = 0;
            let placed = false;
            
            while (attempts < 20 && !placed) {
                const x = this.playArea.minX + 150 + Math.random() * (this.playArea.width - 300); // Keep away from edges
                const y = this.playArea.minY + 100 + Math.random() * (this.playArea.height - 200);
                
                // Ensure asteroids aren't too close to each other and leave clear paths
                const tooClose = this.spaceBodies.some(body => 
                    new Vector2(x, y).distance(body.position) < 120 // More spacing for easier navigation
                );
                
                if (!tooClose) {
                    this.spaceBodies.push(new SpaceBody(x, y, 'asteroid'));
                    placed = true;
                }
                attempts++;
            }
        }
        
        // Create targets scattered throughout the field
        const targetCount = 4;
        for (let i = 0; i < targetCount; i++) {
            let attempts = 0;
            let placed = false;
            
            while (attempts < 30 && !placed) {
                const x = this.playArea.minX + 60 + Math.random() * (this.playArea.width - 120);
                const y = this.playArea.minY + 60 + Math.random() * (this.playArea.height - 120);
                
                // Ensure target is not too close to any asteroid
                const tooCloseToAsteroid = this.spaceBodies.some(body => 
                    new Vector2(x, y).distance(body.position) < body.radius + 40
                );
                
                // Ensure target is not too close to other targets
                const tooCloseToTarget = this.targets.some(target => 
                    new Vector2(x, y).distance(target.position) < 100
                );
                
                if (!tooCloseToAsteroid && !tooCloseToTarget) {
                    this.targets.push(new Target(x, y, 'static'));
                    placed = true;
                }
                attempts++;
            }
        }
        
        // If we couldn't place enough targets, add safe ones
        while (this.targets.length < targetCount) {
            const safePositions = [
                { x: this.playArea.maxX - 80, y: this.playArea.minY + 80 },
                { x: this.playArea.minX + 80, y: this.playArea.maxY - 80 },
                { x: this.playArea.maxX - 80, y: this.playArea.maxY - 80 },
                { x: this.playArea.centerX, y: this.playArea.minY + 80 }
            ];
            
            for (const pos of safePositions) {
                if (this.targets.length >= targetCount) break;
                
                const tooCloseToAsteroid = this.spaceBodies.some(body => 
                    new Vector2(pos.x, pos.y).distance(body.position) < body.radius + 40
                );
                
                if (!tooCloseToAsteroid) {
                    this.targets.push(new Target(pos.x, pos.y, 'static'));
                }
            }
        }
    }

    generateAdvancedLevel() {
        // Level 6+: Complex procedural levels with 10 different patterns
        const levelModifier = (this.level - 6) % 10;
        console.log(`Generating advanced level ${this.level}, modifier: ${levelModifier}`);
        
        switch (levelModifier) {
            case 0:
                console.log('Generating spiral galaxy level');
                this.generateSpiraLevel();
                break;
            case 1:
                console.log('Generating binary system level');
                this.generateBinarySystemLevel();
                break;
            case 2:
                console.log('Generating maze level');
                this.generateMazeLevel();
                break;
            case 3:
                console.log('Generating orbital rings level');
                this.generateOrbitalRingsLevel();
                break;
            case 4:
                console.log('Generating cluster formation level');
                this.generateClusterLevel();
                break;
            case 5:
                console.log('Generating chain reaction level');
                this.generateChainReactionLevel();
                break;
            case 6:
                console.log('Generating gravitational lens level');
                this.generateGravitationalLensLevel();
                break;
            case 7:
                console.log('Generating pulsar field level');
                this.generatePulsarFieldLevel();
                break;
            case 8:
                console.log('Generating wormhole network level');
                this.generateWormholeNetworkLevel();
                break;
            case 9:
                console.log('Generating solar system level');
                this.generateSolarSystemLevel();
                break;
            default:
                console.error(`Unexpected levelModifier: ${levelModifier}`);
                // Fallback to spiral level
                this.generateSpiraLevel();
                break;
        }
        
        console.log(`Advanced level generated with ${this.spaceBodies.length} bodies and ${this.targets.length} targets`);
    }

    generateSpiraLevel() {
        // Spiral formation of bodies
        this.setupDefaultCannonPosition();
        const bodyCount = Math.min(8, 4 + Math.floor(this.level / 3));
        
        for (let i = 0; i < bodyCount; i++) {
            const angle = (i / bodyCount) * Math.PI * 3; // 1.5 spirals
            const radius = (this.playArea.width * 0.1) + (i / bodyCount) * (this.playArea.width * 0.2);
            const x = this.playArea.centerX + Math.cos(angle) * radius;
            const y = this.playArea.centerY + Math.sin(angle) * radius;
            
            // Ensure within bounds
            const clampedX = Math.max(this.playArea.minX + 50, Math.min(this.playArea.maxX - 50, x));
            const clampedY = Math.max(this.playArea.minY + 50, Math.min(this.playArea.maxY - 50, y));
            
            const bodyType = ['asteroid', 'dwarf_planet', 'planet'][i % 3];
            this.spaceBodies.push(new SpaceBody(clampedX, clampedY, bodyType));
        }
        
        this.generateScatteredTargets(5);
    }

    generateBinarySystemLevel() {
        // Two large central bodies with smaller satellites
        this.setupDefaultCannonPosition();
        const body1 = new SpaceBody(
            this.playArea.centerX - this.playArea.width * 0.15,
            this.playArea.centerY - this.playArea.height * 0.1,
            'gas_giant'
        );
        const body2 = new SpaceBody(
            this.playArea.centerX + this.playArea.width * 0.15,
            this.playArea.centerY + this.playArea.height * 0.1,
            'star'
        );
        this.spaceBodies.push(body1, body2);
        
        // Add satellite bodies
        const satellites = 4;
        for (let i = 0; i < satellites; i++) {
            const angle = (i / satellites) * Math.PI * 2;
            const distance = this.playArea.width * 0.25;
            const x = this.playArea.centerX + Math.cos(angle) * distance;
            const y = this.playArea.centerY + Math.sin(angle) * distance;
            
            const clampedX = Math.max(this.playArea.minX + 50, Math.min(this.playArea.maxX - 50, x));
            const clampedY = Math.max(this.playArea.minY + 50, Math.min(this.playArea.maxY - 50, y));
            
            this.spaceBodies.push(new SpaceBody(clampedX, clampedY, 'asteroid'));
        }
        
        this.generateScatteredTargets(6);
    }

    generateMazeLevel() {
        // Grid-like maze of bodies
        this.setupDefaultCannonPosition();
        const gridSize = Math.min(4, 2 + Math.floor(this.level / 4));
        const cellWidth = this.playArea.width / (gridSize + 1);
        const cellHeight = this.playArea.height / (gridSize + 1);
        
        for (let i = 1; i <= gridSize; i++) {
            for (let j = 1; j <= gridSize; j++) {
                if (Math.random() > 0.4) { // 60% chance to place a body
                    const x = this.playArea.minX + i * cellWidth;
                    const y = this.playArea.minY + j * cellHeight;
                    
                    const bodyType = ['asteroid', 'dwarf_planet', 'planet'][Math.floor(Math.random() * 3)];
                    this.spaceBodies.push(new SpaceBody(x, y, bodyType));
                }
            }
        }
        
        this.generateScatteredTargets(7);
    }

    generateSafeTargets(targetCount) {
        // Generate targets with collision checking specifically for early levels
        console.log(`Attempting to generate ${targetCount} safe targets for level ${this.level}`);
        
        for (let i = 0; i < targetCount; i++) {
            let attempts = 0;
            let placed = false;
            
            while (attempts < 50 && !placed) {
                const x = this.playArea.minX + 60 + Math.random() * (this.playArea.width - 120);
                const y = this.playArea.minY + 60 + Math.random() * (this.playArea.height - 120);
                
                // Ensure target is not too close to any space body
                const tooCloseToBody = this.spaceBodies.some(body => 
                    new Vector2(x, y).distance(body.position) < body.radius + 60  // Extra buffer for early levels
                );
                
                // Ensure target is not too close to other targets
                const tooCloseToTarget = this.targets.some(target => 
                    new Vector2(x, y).distance(target.position) < 80
                );
                
                // Ensure target is not too close to cannon
                const cannonDistance = this.cannon ? new Vector2(x, y).distance(this.cannon.position) : Infinity;
                
                if (!tooCloseToBody && !tooCloseToTarget && cannonDistance > 100) {
                    this.targets.push(new Target(x, y, 'static'));
                    placed = true;
                    console.log(`Target ${i + 1} placed at (${x.toFixed(0)}, ${y.toFixed(0)})`);
                }
                
                attempts++;
            }
            
            if (!placed) {
                console.warn(`Failed to place target ${i + 1} after 50 attempts`);
            }
        }
        
        console.log(`Successfully placed ${this.targets.length} targets`);
    }

    generateScatteredTargets(targetCount) {
        // Generate targets scattered throughout the play area
        console.log(`Attempting to generate ${targetCount} scattered targets`);
        
        for (let i = 0; i < targetCount; i++) {
            let attempts = 0;
            let placed = false;
            
            while (attempts < 50 && !placed) {
                const x = this.playArea.minX + 60 + Math.random() * (this.playArea.width - 120);
                const y = this.playArea.minY + 60 + Math.random() * (this.playArea.height - 120);
                
                // Ensure target is not too close to any space body
                const tooCloseToBody = this.spaceBodies.some(body => 
                    new Vector2(x, y).distance(body.position) < body.radius + 50
                );
                
                // Ensure target is not too close to other targets
                const tooCloseToTarget = this.targets.some(target => 
                    new Vector2(x, y).distance(target.position) < 80
                );
                
                // Ensure target is reasonably far from cannon
                const distanceFromCannon = new Vector2(x, y).distance(this.cannon.position);
                const minCannonDistance = Math.min(200, this.playArea.width * 0.4);
                
                if (!tooCloseToBody && !tooCloseToTarget && distanceFromCannon > minCannonDistance) {
                    this.targets.push(new Target(x, y, 'static'));
                    placed = true;
                    console.log(`Target ${i + 1} placed at (${Math.round(x)}, ${Math.round(y)}) after ${attempts + 1} attempts`);
                }
                attempts++;
            }
            
            if (!placed) {
                console.warn(`Failed to place target ${i + 1} after 50 attempts`);
            }
        }
        
        // If we couldn't place enough targets, add fallback positions
        console.log(`Currently have ${this.targets.length}/${targetCount} targets, adding fallbacks if needed`);
        while (this.targets.length < targetCount) {
            const fallbackPositions = [
                { x: this.playArea.maxX - 80, y: this.playArea.minY + 80 },
                { x: this.playArea.minX + 80, y: this.playArea.maxY - 80 },
                { x: this.playArea.maxX - 80, y: this.playArea.maxY - 80 },
                { x: this.playArea.centerX, y: this.playArea.minY + 80 },
                { x: this.playArea.centerX, y: this.playArea.maxY - 80 }
            ];
            
            let fallbackPlaced = false;
            for (const pos of fallbackPositions) {
                if (this.targets.length >= targetCount) break;
                
                const tooCloseToBody = this.spaceBodies.some(body => 
                    new Vector2(pos.x, pos.y).distance(body.position) < body.radius + 50
                );
                
                if (!tooCloseToBody) {
                    this.targets.push(new Target(pos.x, pos.y, 'static'));
                    fallbackPlaced = true;
                    console.log(`Fallback target placed at (${Math.round(pos.x)}, ${Math.round(pos.y)})`);
                }
            }
            
            // Emergency exit to prevent infinite loop
            if (!fallbackPlaced && this.targets.length < targetCount) {
                console.warn(`Could not place enough targets, forcing placement of remaining ${targetCount - this.targets.length} targets`);
                while (this.targets.length < targetCount) {
                    // Force place targets in safe corners, regardless of body proximity
                    const emergencyPos = fallbackPositions[(this.targets.length) % fallbackPositions.length];
                    this.targets.push(new Target(emergencyPos.x, emergencyPos.y, 'static'));
                    console.log(`Emergency target placed at (${Math.round(emergencyPos.x)}, ${Math.round(emergencyPos.y)})`);
                }
                break;
            }
        }
    }

    // Cannon positioning methods

    setupDefaultCannonPosition() {
        // Default cannon positioning for standard levels
        const isVertical = this.canvas.height > this.canvas.width;
        if (isVertical) {
            // For vertical screens, keep cannon at bottom center-left
            this.cannon = new Cannon(this.canvas.width * 0.2, this.canvas.height - 50);
        } else {
            // For horizontal screens, use traditional bottom-left
            this.cannon = new Cannon(50, this.canvas.height - 50);
        }
    }

    mountCannonOnBody(body, preferredAngle = 0) {
        // Mount cannon on the surface of a celestial body
        // preferredAngle is the desired mounting angle, but will be adjusted if blocked
        
        const mountDistance = body.radius + 10; // Just outside the body surface
        const minShootingClearance = 120; // Minimum clear distance for shooting
        
        // Try the preferred angle first, then search around it
        const anglesToTry = [];
        
        // Add preferred angle first
        anglesToTry.push(preferredAngle);
        
        // Add angles in increasing increments around the preferred angle
        for (let increment = Math.PI / 8; increment <= Math.PI * 2; increment += Math.PI / 8) {
            anglesToTry.push(preferredAngle + increment);
            anglesToTry.push(preferredAngle - increment);
        }
        
        let bestAngle = preferredAngle;
        let maxClearance = 0;
        
        for (const testAngle of anglesToTry) {
            const cannonX = body.position.x + Math.cos(testAngle) * mountDistance;
            const cannonY = body.position.y + Math.sin(testAngle) * mountDistance;
            
            // Check if this position is within play area
            if (cannonX < this.playArea.minX + 30 || cannonX > this.playArea.maxX - 30 ||
                cannonY < this.playArea.minY + 30 || cannonY > this.playArea.maxY - 30) {
                continue;
            }
            
            // Calculate minimum clearance in all directions from this cannon position
            const clearance = this.calculateShootingClearance(cannonX, cannonY, body);
            
            if (clearance > maxClearance) {
                maxClearance = clearance;
                bestAngle = testAngle;
                
                // If we found good clearance, use it
                if (clearance >= minShootingClearance) {
                    break;
                }
            }
        }
        
        const cannonX = body.position.x + Math.cos(bestAngle) * mountDistance;
        const cannonY = body.position.y + Math.sin(bestAngle) * mountDistance;
        
        this.cannon = new Cannon(cannonX, cannonY);
        
        // Store the mounting info for visual indicators
        this.cannon.mountedBody = body;
        this.cannon.mountAngle = bestAngle;
        this.cannon.isMounted = true;
        
        console.log(`Cannon mounted on ${body.type} at angle ${(bestAngle * 180 / Math.PI).toFixed(0)}° with ${maxClearance.toFixed(0)} clearance`);
    }

    calculateShootingClearance(cannonX, cannonY, mountedBody) {
        // Calculate the minimum clear distance in any shooting direction
        let minClearance = Infinity;
        const testAngles = 16; // Test shooting angles around the cannon
        
        for (let i = 0; i < testAngles; i++) {
            const shootAngle = (i / testAngles) * Math.PI * 2;
            let clearance = this.getDirectionalClearance(cannonX, cannonY, shootAngle, mountedBody);
            
            if (clearance < minClearance) {
                minClearance = clearance;
            }
        }
        
        return minClearance;
    }
    
    getDirectionalClearance(cannonX, cannonY, shootAngle, mountedBody) {
        // Cast a ray in the shooting direction and find the nearest obstacle
        const rayStep = 10;
        const maxRange = Math.max(this.playArea.width, this.playArea.height);
        
        for (let distance = rayStep; distance < maxRange; distance += rayStep) {
            const testX = cannonX + Math.cos(shootAngle) * distance;
            const testY = cannonY + Math.sin(shootAngle) * distance;
            
            // Check if ray hits play area boundary
            if (testX < this.playArea.minX || testX > this.playArea.maxX ||
                testY < this.playArea.minY || testY > this.playArea.maxY) {
                return distance;
            }
            
            // Check collision with other bodies (excluding the mounted body)
            for (const body of this.spaceBodies) {
                if (body === mountedBody) continue;
                
                const dx = testX - body.position.x;
                const dy = testY - body.position.y;
                const distanceToBody = Math.sqrt(dx * dx + dy * dy);
                
                if (distanceToBody <= body.radius + 20) { // Add small buffer
                    return distance;
                }
            }
        }
        
        return maxRange;
    }

    // New advanced level types

    generateOrbitalRingsLevel() {
        // Concentric rings of bodies with targets between rings, default cannon
        this.setupDefaultCannonPosition();
        
        const ringCount = Math.min(4, 2 + Math.floor(this.level / 8));
        const bodyTypes = ['asteroid', 'dwarf_planet', 'planet', 'gas_giant'];
        
        for (let ring = 1; ring <= ringCount; ring++) {
            const bodiesInRing = Math.min(6, 3 + ring);
            const ringRadius = (this.playArea.width * 0.1) + (ring * this.playArea.width * 0.12);
            
            for (let i = 0; i < bodiesInRing; i++) {
                const angle = (i / bodiesInRing) * Math.PI * 2 + (ring * 0.3); // Offset each ring
                const x = this.playArea.centerX + Math.cos(angle) * ringRadius;
                const y = this.playArea.centerY + Math.sin(angle) * ringRadius;
                
                const clampedX = Math.max(this.playArea.minX + 50, Math.min(this.playArea.maxX - 50, x));
                const clampedY = Math.max(this.playArea.minY + 50, Math.min(this.playArea.maxY - 50, y));
                
                const bodyType = bodyTypes[(ring - 1) % bodyTypes.length];
                this.spaceBodies.push(new SpaceBody(clampedX, clampedY, bodyType));
            }
        }
        
        this.generateScatteredTargets(4 + ringCount);
    }

    generateClusterLevel() {
        // Multiple tight clusters with cannon mounted on central cluster
        // This introduces body-mounted mechanics at higher levels
        const clusterCount = Math.min(5, 3 + Math.floor(this.level / 6));
        const bodiesPerCluster = 3;
        let cannonMounted = false;
        
        for (let cluster = 0; cluster < clusterCount; cluster++) {
            // Random cluster center
            const clusterX = this.playArea.minX + 100 + Math.random() * (this.playArea.width - 200);
            const clusterY = this.playArea.minY + 100 + Math.random() * (this.playArea.height - 200);
            
            for (let i = 0; i < bodiesPerCluster; i++) {
                const angle = (i / bodiesPerCluster) * Math.PI * 2;
                const distance = 40 + Math.random() * 30; // Tight cluster
                const x = clusterX + Math.cos(angle) * distance;
                const y = clusterY + Math.sin(angle) * distance;
                
                const clampedX = Math.max(this.playArea.minX + 50, Math.min(this.playArea.maxX - 50, x));
                const clampedY = Math.max(this.playArea.minY + 50, Math.min(this.playArea.maxY - 50, y));
                
                const body = new SpaceBody(clampedX, clampedY, 'asteroid');
                this.spaceBodies.push(body);
                
                // Mount cannon on first body of first cluster
                if (cluster === 0 && i === 0) {
                    this.mountCannonOnBody(body, Math.random() * Math.PI * 2); // Random facing direction
                    cannonMounted = true;
                }
            }
        }
        
        // Fallback if mounting failed
        if (!cannonMounted) {
            this.setupDefaultCannonPosition();
        }
        
        this.generateScatteredTargets(5);
    }

    generateChainReactionLevel() {
        // Bodies arranged in a line that creates cascading gravity effects
        this.setupDefaultCannonPosition();
        const chainLength = Math.min(7, 4 + Math.floor(this.level / 5));
        const bodyTypes = ['asteroid', 'dwarf_planet', 'planet', 'gas_giant', 'star'];
        
        // Create a curved chain across the screen
        for (let i = 0; i < chainLength; i++) {
            const progress = i / (chainLength - 1);
            // Create an S-curve path
            const x = this.playArea.minX + progress * this.playArea.width;
            const curveHeight = Math.sin(progress * Math.PI * 2) * (this.playArea.height * 0.2);
            const y = this.playArea.centerY + curveHeight;
            
            const clampedX = Math.max(this.playArea.minX + 50, Math.min(this.playArea.maxX - 50, x));
            const clampedY = Math.max(this.playArea.minY + 50, Math.min(this.playArea.maxY - 50, y));
            
            const bodyType = bodyTypes[i % bodyTypes.length];
            this.spaceBodies.push(new SpaceBody(clampedX, clampedY, bodyType));
        }
        
        this.generateScatteredTargets(6);
    }

    generateGravitationalLensLevel() {
        // One massive central body with smaller bodies orbiting, creating lensing effects
        // Cannon mounted on an orbiting body
        const centerBody = new SpaceBody(
            this.playArea.centerX,
            this.playArea.centerY,
            'star' // Massive central star
        );
        this.spaceBodies.push(centerBody);
        
        // Create the cannon platform (first orbiting body)
        const cannonPlatform = new SpaceBody(
            this.playArea.centerX - this.playArea.width * 0.2,
            this.playArea.centerY - this.playArea.height * 0.1,
            'planet'
        );
        this.spaceBodies.push(cannonPlatform);
        
        // Mount cannon on the platform, facing toward the center star
        const angleToCenter = Math.atan2(centerBody.position.y - cannonPlatform.position.y, centerBody.position.x - cannonPlatform.position.x);
        this.mountCannonOnBody(cannonPlatform, angleToCenter);
        
        // Add orbiting bodies at various distances
        const orbitingBodies = Math.min(8, 4 + Math.floor(this.level / 4));
        for (let i = 0; i < orbitingBodies; i++) {
            const angle = (i / orbitingBodies) * Math.PI * 2;
            const orbitRadius = (this.playArea.width * 0.15) + (i * this.playArea.width * 0.08);
            const x = this.playArea.centerX + Math.cos(angle) * orbitRadius;
            const y = this.playArea.centerY + Math.sin(angle) * orbitRadius;
            
            const clampedX = Math.max(this.playArea.minX + 50, Math.min(this.playArea.maxX - 50, x));
            const clampedY = Math.max(this.playArea.minY + 50, Math.min(this.playArea.maxY - 50, y));
            
            const bodyType = ['asteroid', 'dwarf_planet', 'planet'][i % 3];
            this.spaceBodies.push(new SpaceBody(clampedX, clampedY, bodyType));
        }
        
        this.generateScatteredTargets(5);
    }

    generatePulsarFieldLevel() {
        // Small, high-mass bodies (neutron stars) scattered in a field
        this.setupDefaultCannonPosition();
        const pulsarCount = Math.min(6, 3 + Math.floor(this.level / 7));
        
        for (let i = 0; i < pulsarCount; i++) {
            let attempts = 0;
            let placed = false;
            
            while (attempts < 20 && !placed) {
                const x = this.playArea.minX + 80 + Math.random() * (this.playArea.width - 160);
                const y = this.playArea.minY + 80 + Math.random() * (this.playArea.height - 160);
                
                // Ensure pulsars aren't too close to each other
                const tooClose = this.spaceBodies.some(body => 
                    new Vector2(x, y).distance(body.position) < 120
                );
                
                if (!tooClose) {
                    // Create a small but very massive body (simulating neutron star)
                    const pulsar = new SpaceBody(x, y, 'dwarf_planet');
                    pulsar.mass = pulsar.mass * 1.8; // Increase mass for stronger gravity
                    this.spaceBodies.push(pulsar);
                    placed = true;
                }
                attempts++;
            }
        }
        
        this.generateScatteredTargets(4);
    }

    generateWormholeNetworkLevel() {
        // Pairs of bodies that simulate "wormhole" connections
        this.setupDefaultCannonPosition();
        const wormholePairs = Math.min(3, 2 + Math.floor(this.level / 10));
        const bodyTypes = ['planet', 'gas_giant'];
        
        for (let pair = 0; pair < wormholePairs; pair++) {
            // Create two bodies far apart (wormhole entrance/exit)
            const angle1 = (pair / wormholePairs) * Math.PI * 2;
            const angle2 = angle1 + Math.PI; // Opposite side
            
            const radius = this.playArea.width * 0.25;
            const x1 = this.playArea.centerX + Math.cos(angle1) * radius;
            const y1 = this.playArea.centerY + Math.sin(angle1) * radius;
            const x2 = this.playArea.centerX + Math.cos(angle2) * radius;
            const y2 = this.playArea.centerY + Math.sin(angle2) * radius;
            
            const clampedX1 = Math.max(this.playArea.minX + 60, Math.min(this.playArea.maxX - 60, x1));
            const clampedY1 = Math.max(this.playArea.minY + 60, Math.min(this.playArea.maxY - 60, y1));
            const clampedX2 = Math.max(this.playArea.minX + 60, Math.min(this.playArea.maxX - 60, x2));
            const clampedY2 = Math.max(this.playArea.minY + 60, Math.min(this.playArea.maxY - 60, y2));
            
            const bodyType = bodyTypes[pair % bodyTypes.length];
            this.spaceBodies.push(new SpaceBody(clampedX1, clampedY1, bodyType));
            this.spaceBodies.push(new SpaceBody(clampedX2, clampedY2, bodyType));
        }
        
        this.generateScatteredTargets(6);
    }

    generateSolarSystemLevel() {
        // Realistic solar system with sun, planets, and asteroid belt
        this.setupDefaultCannonPosition();
        
        // Central star
        const sun = new SpaceBody(this.playArea.centerX, this.playArea.centerY, 'star');
        this.spaceBodies.push(sun);
        
        // Inner planets (small, close)
        const innerPlanets = 2;
        for (let i = 0; i < innerPlanets; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = this.playArea.width * 0.12 + i * this.playArea.width * 0.06;
            const x = this.playArea.centerX + Math.cos(angle) * distance;
            const y = this.playArea.centerY + Math.sin(angle) * distance;
            
            const clampedX = Math.max(this.playArea.minX + 50, Math.min(this.playArea.maxX - 50, x));
            const clampedY = Math.max(this.playArea.minY + 50, Math.min(this.playArea.maxY - 50, y));
            
            this.spaceBodies.push(new SpaceBody(clampedX, clampedY, 'planet'));
        }
        
        // Asteroid belt (ring of small bodies)
        const asteroidCount = 6;
        const beltRadius = this.playArea.width * 0.25;
        for (let i = 0; i < asteroidCount; i++) {
            const angle = (i / asteroidCount) * Math.PI * 2 + Math.random() * 0.5;
            const distance = beltRadius + (Math.random() - 0.5) * (this.playArea.width * 0.05);
            const x = this.playArea.centerX + Math.cos(angle) * distance;
            const y = this.playArea.centerY + Math.sin(angle) * distance;
            
            const clampedX = Math.max(this.playArea.minX + 50, Math.min(this.playArea.maxX - 50, x));
            const clampedY = Math.max(this.playArea.minY + 50, Math.min(this.playArea.maxY - 50, y));
            
            this.spaceBodies.push(new SpaceBody(clampedX, clampedY, 'asteroid'));
        }
        
        // Outer gas giants
        const outerPlanets = 2;
        for (let i = 0; i < outerPlanets; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = this.playArea.width * 0.35 + i * this.playArea.width * 0.08;
            const x = this.playArea.centerX + Math.cos(angle) * distance;
            const y = this.playArea.centerY + Math.sin(angle) * distance;
            
            if (x > this.playArea.minX + 60 && x < this.playArea.maxX - 60 &&
                y > this.playArea.minY + 60 && y < this.playArea.maxY - 60) {
                this.spaceBodies.push(new SpaceBody(x, y, 'gas_giant'));
            }
        }
        
        this.generateScatteredTargets(7);
    }
    

    startCharging() {
        if (!this.cannon) return;
        this.isCharging = true;
        this.chargeStartTime = Date.now();
    }
    
    cancelCharge() {
        this.isCharging = false;
        this.chargeStartTime = 0;
    }
    
    getCurrentLaunchVelocity() {
        if (!this.isCharging) return this.minLaunchVelocity;
        
        const chargeTime = Date.now() - this.chargeStartTime;
        const chargeRatio = Math.min(chargeTime / this.maxChargeTime, 1.0);
        
        return this.minLaunchVelocity + (this.maxLaunchVelocity - this.minLaunchVelocity) * chargeRatio;
    }
    
    shoot() {
        if (!this.cannon || !this.isCharging) return;
        
        const launchVelocity = this.getCurrentLaunchVelocity();
        const bullet = this.cannon.shoot(launchVelocity);
        this.bullets.push(bullet);
        
        // Reset charging state
        this.cancelCharge();
        
        // Increment rocket counters
        this.rocketsLaunched++;
        this.levelRockets++;
        
        // Update UI immediately after shooting
        this.updateUI();
        
        console.log(`Rocket launched at velocity: ${launchVelocity.toFixed(0)}`);
    }

    update(deltaTime) {
        if (this.cannon) {
            this.cannon.aimAt(this.mousePosition);
        }

        // Update completion message timer
        if (this.completionMessage) {
            this.completionMessage.timer -= deltaTime;
            this.completionMessage.alpha = Math.max(0, this.completionMessage.timer / 1.5);
            
            if (this.completionMessage.timer <= 0) {
                this.completionMessage = null;
            }
        }


        this.bullets.forEach(bullet => bullet.update(this.spaceBodies, deltaTime, this.canvas.width, this.canvas.height));
        this.bullets = this.bullets.filter(bullet => bullet.alive);

        this.targets.forEach(target => target.update(deltaTime, this.canvas.width, this.canvas.height));

        // Check collisions with targets
        this.bullets.forEach(bullet => {
            this.targets.forEach(target => {
                if (!target.hit && bullet.checkCollision(target)) {
                    target.hit = true;
                    bullet.alive = false;
                    this.score += 100;
                    this.updateUI();
                }
            });
        });

        // Check collisions with space bodies
        this.bullets.forEach(bullet => {
            this.spaceBodies.forEach(spaceBody => {
                if (bullet.checkSpaceBodyCollision(spaceBody)) {
                    bullet.alive = false;
                }
            });
        });

        // Check for level completion
        if (this.targets.every(target => target.hit) && !this.levelCompleted) {
            this.levelCompleted = true;
            
            // Calculate efficiency bonus
            const efficiencyBonus = this.calculateEfficiencyBonus();
            this.score += efficiencyBonus;
            
            // Show completion message with efficiency rating
            const efficiencyRating = this.getEfficiencyRating();
            console.log(`Level ${this.level} completed! Rockets used: ${this.levelRockets}, Efficiency: ${efficiencyRating}, Bonus: ${efficiencyBonus}`);
            
            // Display completion message
            this.showLevelCompletionMessage(efficiencyRating, efficiencyBonus);
            
            setTimeout(async () => {
                this.level++;
                await this.initializeLevel();
                this.levelCompleted = false;
            }, 1500);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars background
        this.ctx.fillStyle = '#ffffff20';
        for (let i = 0; i < 50; i++) {
            const x = (i * 37) % this.canvas.width;
            const y = (i * 71) % this.canvas.height;
            this.ctx.fillRect(x, y, 1, 1);
        }

        this.spaceBodies.forEach(body => body.draw(this.ctx));
        this.targets.forEach(target => target.draw(this.ctx));
        
        // Draw bullets
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
        
        if (this.cannon) {
            this.cannon.draw(this.ctx);
        }

        // Draw trajectory preview
        this.drawTrajectoryPreview();
        
        // Draw power meter when charging
        this.drawPowerMeter();
        
        // Draw completion message
        if (this.completionMessage) {
            this.drawCompletionMessage();
        }
    }

    drawTrajectoryPreview() {
        if (!this.cannon) return;
        
        // Use current charging velocity for trajectory preview
        const currentVelocity = this.getCurrentLaunchVelocity();
        const previewBullet = this.cannon.shoot(currentVelocity);
        const points = [];
        const steps = 50;
        const stepTime = 0.02;
        
        for (let i = 0; i < steps; i++) {
            points.push(new Vector2(previewBullet.position.x, previewBullet.position.y));
            previewBullet.update(this.spaceBodies, stepTime, this.canvas.width, this.canvas.height);
            
            if (!previewBullet.alive) break;
        }
        
        this.ctx.save();
        
        // Color trajectory based on power level
        const powerRatio = (currentVelocity - this.minLaunchVelocity) / (this.maxLaunchVelocity - this.minLaunchVelocity);
        const red = Math.floor(255 * powerRatio);
        const green = Math.floor(255 * (1 - powerRatio));
        this.ctx.strokeStyle = `rgba(${red}, ${green}, 100, 0.6)`;
        
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        
        for (let i = 1; i < points.length; i++) {
            if (i === 1) {
                this.ctx.moveTo(points[i-1].x, points[i-1].y);
            }
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    drawPowerMeter() {
        if (!this.isCharging) return;
        
        const powerRatio = (this.getCurrentLaunchVelocity() - this.minLaunchVelocity) / (this.maxLaunchVelocity - this.minLaunchVelocity);
        
        this.ctx.save();
        
        // Position near cannon or screen edge
        const meterX = this.isMobile ? this.canvas.width - 60 : this.canvas.width - 80;
        const meterY = this.isMobile ? 60 : 100;
        const meterWidth = 15;
        const meterHeight = 100;
        
        // Background
        this.ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
        this.ctx.fillRect(meterX, meterY, meterWidth, meterHeight);
        
        // Power bar
        const powerHeight = meterHeight * powerRatio;
        const red = Math.floor(255 * powerRatio);
        const green = Math.floor(255 * (1 - powerRatio));
        this.ctx.fillStyle = `rgb(${red}, ${green}, 50)`;
        this.ctx.fillRect(meterX, meterY + (meterHeight - powerHeight), meterWidth, powerHeight);
        
        // Border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(meterX, meterY, meterWidth, meterHeight);
        
        // Power percentage text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${Math.round(powerRatio * 100)}%`, meterX + meterWidth / 2, meterY + meterHeight + 15);
        
        this.ctx.restore();
    }

    drawCompletionMessage() {
        if (!this.completionMessage) return;
        
        this.ctx.save();
        
        // Semi-transparent overlay
        this.ctx.fillStyle = `rgba(0, 0, 0, ${this.completionMessage.alpha * 0.7})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Main completion text
        this.ctx.globalAlpha = this.completionMessage.alpha;
        this.ctx.fillStyle = '#50e3c2';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('LEVEL COMPLETE!', this.canvas.width / 2, this.canvas.height / 2 - 60);
        
        // Efficiency rating
        this.ctx.fillStyle = '#ffff88';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText(`Efficiency: ${this.completionMessage.rating}`, this.canvas.width / 2, this.canvas.height / 2 - 20);
        
        // Rockets used
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Rockets Used: ${this.levelRockets}`, this.canvas.width / 2, this.canvas.height / 2 + 10);
        
        // Bonus points
        if (this.completionMessage.bonus > 0) {
            this.ctx.fillStyle = '#4ae24a';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.fillText(`Efficiency Bonus: +${this.completionMessage.bonus}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
        }
        
        this.ctx.restore();
    }

    calculateEfficiencyBonus() {
        const targetCount = this.targets.length;
        const rocketsUsed = this.levelRockets;
        
        // Ideal rocket count (1 rocket per target)
        const idealRockets = targetCount;
        
        // Calculate efficiency rating
        let efficiencyMultiplier = 0;
        
        if (rocketsUsed <= idealRockets) {
            // Perfect efficiency - maximum bonus
            efficiencyMultiplier = 2.0;
        } else if (rocketsUsed <= idealRockets * 1.5) {
            // Good efficiency - good bonus
            efficiencyMultiplier = 1.5;
        } else if (rocketsUsed <= idealRockets * 2) {
            // Average efficiency - small bonus
            efficiencyMultiplier = 1.0;
        } else if (rocketsUsed <= idealRockets * 3) {
            // Poor efficiency - very small bonus
            efficiencyMultiplier = 0.5;
        } else {
            // No efficiency bonus
            efficiencyMultiplier = 0;
        }
        
        // Base bonus per target completed
        const baseBonus = targetCount * 50;
        const efficiencyBonus = Math.floor(baseBonus * efficiencyMultiplier);
        
        return efficiencyBonus;
    }

    getEfficiencyRating() {
        const targetCount = this.targets.length;
        const rocketsUsed = this.levelRockets;
        const idealRockets = targetCount;
        
        if (rocketsUsed <= idealRockets) {
            return "★★★ PERFECT";
        } else if (rocketsUsed <= idealRockets * 1.5) {
            return "★★☆ GOOD";
        } else if (rocketsUsed <= idealRockets * 2) {
            return "★☆☆ AVERAGE";
        } else if (rocketsUsed <= idealRockets * 3) {
            return "☆☆☆ POOR";
        } else {
            return "--- NO RATING";
        }
    }

    showLevelCompletionMessage(rating, bonus) {
        // Draw completion overlay
        this.completionMessage = {
            rating,
            bonus,
            timer: 1.5, // Display for 1.5 seconds
            alpha: 1.0
        };
    }

    updateUI() {
        document.getElementById('level').textContent = this.level;
        document.getElementById('score').textContent = this.score;
        document.getElementById('targets').textContent = this.targets.filter(t => !t.hit).length;
        document.getElementById('rockets').textContent = this.levelRockets;
    }

    gameLoop(currentTime) {
        if (!this.initialized) {
            requestAnimationFrame(this.gameLoop);
            return;
        }

        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame(this.gameLoop);
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    try {
        const game = new Game();
        window.game = game; // For debugging
        console.log('Game initialized successfully');
    } catch (error) {
        console.error('Failed to initialize game:', error);
    }
});
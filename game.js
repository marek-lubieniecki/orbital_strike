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

    shoot() {
        const muzzlePosition = this.position.add(new Vector2(
            Math.cos(this.angle) * this.length,
            Math.sin(this.angle) * this.length
        ));
        
        const velocity = new Vector2(
            Math.cos(this.angle) * 120,
            Math.sin(this.angle) * 120
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
        
        this.mousePosition = new Vector2(0, 0);
        this.isMobile = this.checkMobile();
        
        this.setupEventListeners();
        this.initializeLevel();
        
        this.lastTime = 0;
        this.gameLoop = this.gameLoop.bind(this);
        console.log('Starting game loop...');
        requestAnimationFrame(this.gameLoop);
    }

    setupCanvas() {
        const container = document.getElementById('gameContainer');
        const availableWidth = window.innerWidth;
        const availableHeight = window.innerHeight;
        
        // Check if device is mobile/vertical orientation
        const isVertical = window.innerHeight > window.innerWidth || this.isMobile;
        
        if (isVertical || this.isMobile) {
            // Mobile layout - use almost full screen with small margins
            const margin = 20;
            this.canvas.width = Math.min(400, availableWidth - margin);
            this.canvas.height = Math.min(700, availableHeight - margin);
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
                this.shoot();
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
        } else {
            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mousePosition = new Vector2(
                    e.clientX - rect.left,
                    e.clientY - rect.top
                );
            });
            
            this.canvas.addEventListener('click', (e) => {
                console.log('Click detected at:', this.mousePosition);
                this.shoot();
            });
        }

        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.initializeLevel();
        });
    }

    initializeLevel() {
        this.spaceBodies = [];
        this.bullets = [];
        this.targets = [];
        
        // Position cannon appropriately for screen orientation
        const isVertical = this.canvas.height > this.canvas.width;
        if (isVertical) {
            // For vertical screens, keep cannon at bottom center-left
            this.cannon = new Cannon(this.canvas.width * 0.2, this.canvas.height - 50);
        } else {
            // For horizontal screens, use traditional bottom-left
            this.cannon = new Cannon(50, this.canvas.height - 50);
        }
        
        // Create space bodies with gravity - positioned to block direct shots
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Linear progression: add one space body per level (max 6)
        const maxBodies = 6;
        const bodyCount = Math.min(this.level, maxBodies);
        const targetCount = 2 + this.level;
        
        this.generateLinearLevel(bodyCount, targetCount);
        
        this.updateUI();
    }

    generateLinearLevel(bodyCount, targetCount) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const colors = ['#4a90e2', '#e24a4a', '#4ae24a', '#e2a24a', '#a24ae2', '#2ae24a'];
        
        // Strategic level designs that require complex trajectory chains
        this.generateStrategicLevel(bodyCount);
        
        // Generate targets strategically placed to require trajectory chains
        this.generateStrategicTargets(targetCount);
    }
    
    generateStrategicLevel(bodyCount) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const bodyTypes = ['asteroid', 'dwarf_planet', 'planet', 'gas_giant', 'star'];
        
        // Specific strategic layouts based on level
        if (this.level === 1) {
            // Simple introduction - single body blocking direct shots
            this.spaceBodies.push(new SpaceBody(centerX - 100, centerY, 'asteroid'));
        }
        
        else if (this.level === 2) {
            // Linear chain - requires one gravity assist
            this.spaceBodies.push(new SpaceBody(centerX - 120, centerY - 60, 'asteroid'));
            this.spaceBodies.push(new SpaceBody(centerX + 80, centerY + 80, 'dwarf_planet'));
        }
        
        else if (this.level === 3) {
            // Triangle formation - multiple trajectory options
            this.spaceBodies.push(new SpaceBody(centerX - 150, centerY - 80, 'asteroid'));
            this.spaceBodies.push(new SpaceBody(centerX + 120, centerY - 40, 'dwarf_planet')); 
            this.spaceBodies.push(new SpaceBody(centerX - 50, centerY + 120, 'planet'));
        }
        
        else if (this.level === 4) {
            // Slingshot corridor - forces specific trajectory chain
            this.spaceBodies.push(new SpaceBody(centerX - 180, centerY - 100, 'planet'));
            this.spaceBodies.push(new SpaceBody(centerX - 80, centerY + 60, 'dwarf_planet'));
            this.spaceBodies.push(new SpaceBody(centerX + 100, centerY - 80, 'asteroid'));
            this.spaceBodies.push(new SpaceBody(centerX + 160, centerY + 100, 'gas_giant'));
        }
        
        else if (this.level === 5) {
            // Binary system with slingshot opportunities
            this.spaceBodies.push(new SpaceBody(centerX - 130, centerY - 30, 'gas_giant'));
            this.spaceBodies.push(new SpaceBody(centerX - 70, centerY + 30, 'planet'));
            this.spaceBodies.push(new SpaceBody(centerX + 120, centerY - 80, 'dwarf_planet'));
            this.spaceBodies.push(new SpaceBody(centerX + 80, centerY + 120, 'asteroid'));
            this.spaceBodies.push(new SpaceBody(centerX + 200, centerY, 'star'));
        }
        
        else if (this.level === 6) {
            // Gravity maze - requires precise chaining
            this.spaceBodies.push(new SpaceBody(centerX - 200, centerY, 'star'));
            this.spaceBodies.push(new SpaceBody(centerX - 80, centerY - 120, 'gas_giant'));
            this.spaceBodies.push(new SpaceBody(centerX + 40, centerY - 40, 'planet'));
            this.spaceBodies.push(new SpaceBody(centerX - 40, centerY + 100, 'dwarf_planet'));
            this.spaceBodies.push(new SpaceBody(centerX + 140, centerY + 60, 'asteroid'));
            this.spaceBodies.push(new SpaceBody(centerX + 180, centerY - 100, 'gas_giant'));
        }
        
        else {
            // Advanced procedural layouts for level 7+
            this.generateAdvancedChainLayout(bodyCount);
        }
    }
    
    generateAdvancedChainLayout(bodyCount) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const bodyTypes = ['asteroid', 'dwarf_planet', 'planet', 'gas_giant', 'star'];
        
        // Create strategic patterns that force complex trajectories
        const patterns = [
            // Spiral galaxy pattern
            () => {
                for (let i = 0; i < bodyCount; i++) {
                    const angle = (i / bodyCount) * Math.PI * 4; // Double spiral
                    const radius = 60 + i * 30;
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;
                    const bodyType = bodyTypes[Math.min(i, bodyTypes.length - 1)];
                    
                    if (x > 100 && x < this.canvas.width - 100 && y > 100 && y < this.canvas.height - 100) {
                        this.spaceBodies.push(new SpaceBody(x, y, bodyType));
                    }
                }
            },
            
            // Chain reaction pattern
            () => {
                const chainPositions = [
                    { x: centerX - 180, y: centerY - 60, type: 'planet' },
                    { x: centerX - 60, y: centerY - 120, type: 'gas_giant' },
                    { x: centerX + 80, y: centerY - 80, type: 'dwarf_planet' },
                    { x: centerX + 140, y: centerY + 40, type: 'asteroid' },
                    { x: centerX + 40, y: centerY + 140, type: 'planet' },
                    { x: centerX - 120, y: centerY + 80, type: 'star' }
                ];
                
                chainPositions.slice(0, bodyCount).forEach(pos => {
                    this.spaceBodies.push(new SpaceBody(pos.x, pos.y, pos.type));
                });
            },
            
            // Orbital resonance pattern
            () => {
                const rings = Math.ceil(bodyCount / 3);
                let bodyIndex = 0;
                
                for (let ring = 1; ring <= rings && bodyIndex < bodyCount; ring++) {
                    const bodiesInRing = Math.min(3, bodyCount - bodyIndex);
                    const ringRadius = ring * 80;
                    
                    for (let i = 0; i < bodiesInRing; i++) {
                        const angle = (i / bodiesInRing) * Math.PI * 2 + ring * 0.5;
                        const x = centerX + Math.cos(angle) * ringRadius;
                        const y = centerY + Math.sin(angle) * ringRadius;
                        const bodyType = bodyTypes[bodyIndex % bodyTypes.length];
                        
                        if (x > 100 && x < this.canvas.width - 100 && y > 100 && y < this.canvas.height - 100) {
                            this.spaceBodies.push(new SpaceBody(x, y, bodyType));
                        }
                        bodyIndex++;
                    }
                }
            }
        ];
        
        // Choose pattern based on level
        const patternIndex = (this.level - 7) % patterns.length;
        patterns[patternIndex]();
    }
    
    generateStrategicTargets(targetCount) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Generate candidate positions first
        let candidatePositions = [];
        
        // Level-specific target placements that require gravity chains
        if (this.level === 1) {
            candidatePositions = [
                { x: centerX + 120, y: centerY - 40 },
                { x: centerX + 120, y: centerY + 40 },
                { x: centerX + 160, y: centerY }
            ];
        }
        
        else if (this.level === 2) {
            candidatePositions = [
                { x: centerX + 150, y: centerY - 120 },
                { x: centerX - 80, y: centerY + 140 },
                { x: this.canvas.width - 80, y: centerY },
                { x: centerX, y: this.canvas.height - 60 }
            ];
        }
        
        else if (this.level === 3) {
            candidatePositions = [
                { x: centerX + 180, y: centerY - 120 },
                { x: centerX - 200, y: centerY + 40 },
                { x: centerX + 100, y: centerY + 180 },
                { x: 80, y: centerY - 140 },
                { x: this.canvas.width - 80, y: centerY + 140 }
            ];
        }
        
        else if (this.level === 4) {
            candidatePositions = [
                { x: 80, y: centerY - 140 },
                { x: this.canvas.width - 80, y: centerY - 40 },
                { x: centerX - 240, y: centerY + 140 },
                { x: centerX + 220, y: centerY + 180 },
                { x: centerX, y: 80 },
                { x: centerX, y: this.canvas.height - 80 }
            ];
        }
        
        else if (this.level === 5) {
            candidatePositions = [
                { x: 80, y: 80 },
                { x: this.canvas.width - 80, y: 80 },
                { x: 80, y: this.canvas.height - 80 },
                { x: this.canvas.width - 80, y: this.canvas.height - 80 },
                { x: centerX - 280, y: centerY },
                { x: centerX, y: 60 },
                { x: centerX, y: this.canvas.height - 60 }
            ];
        }
        
        else if (this.level === 6) {
            candidatePositions = [
                { x: 60, y: centerY - 180 },
                { x: this.canvas.width - 60, y: centerY - 180 },
                { x: centerX - 260, y: centerY - 60 },
                { x: centerX + 240, y: centerY - 160 },
                { x: 60, y: centerY + 180 },
                { x: this.canvas.width - 60, y: centerY + 180 }
            ];
        }
        
        else {
            // Advanced levels - procedural strategic placement
            this.generateAdvancedTargets(targetCount);
            return;
        }
        
        // Validate and place targets, ensuring they're reachable
        this.validateAndPlaceTargets(candidatePositions, targetCount);
    }
    
    generateAdvancedTargets(targetCount) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Place targets in challenging positions that require gravity chains
        const strategicPositions = [
            // Corner positions (require multiple gravity assists)
            { x: 80, y: 80 },
            { x: this.canvas.width - 80, y: 80 },
            { x: 80, y: this.canvas.height - 80 },
            { x: this.canvas.width - 80, y: this.canvas.height - 80 },
            
            // Edge centers (moderate difficulty)
            { x: centerX, y: 60 },
            { x: centerX, y: this.canvas.height - 60 },
            { x: 60, y: centerY },
            { x: this.canvas.width - 60, y: centerY },
            
            // Shadow zones behind space bodies
            ...this.spaceBodies.map(body => ({
                x: body.position.x + (body.position.x > centerX ? 1 : -1) * (body.radius + 60),
                y: body.position.y + (Math.random() - 0.5) * 80
            }))
        ];
        
        this.validateAndPlaceTargets(strategicPositions, targetCount);
    }
    
    validateAndPlaceTargets(candidatePositions, targetCount) {
        const validatedTargets = [];
        const minTargetDistance = 80; // Minimum distance between targets
        
        for (const pos of candidatePositions) {
            // Skip if position is outside canvas bounds
            if (pos.x < 30 || pos.x > this.canvas.width - 30 || 
                pos.y < 30 || pos.y > this.canvas.height - 30) {
                continue;
            }
            
            // Ensure position doesn't overlap with space bodies
            const isSafe = this.spaceBodies.every(body => 
                new Vector2(pos.x, pos.y).distance(body.position) > body.radius + 40
            );
            
            if (!isSafe) continue;
            
            // Ensure minimum distance from existing targets
            const tooCloseToOtherTarget = validatedTargets.some(existingTarget => 
                new Vector2(pos.x, pos.y).distance(new Vector2(existingTarget.x, existingTarget.y)) < minTargetDistance
            );
            
            if (tooCloseToOtherTarget) continue;
            
            // Test reachability with trajectory simulation
            if (this.isTargetReachable(pos)) {
                validatedTargets.push(pos);
                if (validatedTargets.length >= targetCount) break;
            }
        }
        
        // If we don't have enough validated targets, generate fallback positions
        let fallbackAttempts = 0;
        const maxFallbackAttempts = 50;
        
        while (validatedTargets.length < targetCount && fallbackAttempts < maxFallbackAttempts) {
            const fallbackPos = this.generateFallbackTarget();
            if (fallbackPos && this.isTargetReachable(fallbackPos)) {
                // Check distance from existing targets
                const tooCloseToOtherTarget = validatedTargets.some(existingTarget => 
                    new Vector2(fallbackPos.x, fallbackPos.y).distance(new Vector2(existingTarget.x, existingTarget.y)) < minTargetDistance
                );
                
                if (!tooCloseToOtherTarget) {
                    validatedTargets.push(fallbackPos);
                }
            }
            fallbackAttempts++;
        }
        
        // If still not enough targets, add simple safe targets to ensure game is playable
        let simpleTargetAttempts = 0;
        const maxSimpleAttempts = 20;
        
        while (validatedTargets.length < targetCount && simpleTargetAttempts < maxSimpleAttempts) {
            const safePos = this.generateSimpleTarget();
            if (safePos) {
                // Check distance from existing targets (reduce distance requirement if we're struggling)
                const adjustedMinDistance = validatedTargets.length > 0 ? 
                    Math.max(40, minTargetDistance - simpleTargetAttempts * 2) : 0;
                
                const tooCloseToOtherTarget = validatedTargets.some(existingTarget => 
                    new Vector2(safePos.x, safePos.y).distance(new Vector2(existingTarget.x, existingTarget.y)) < adjustedMinDistance
                );
                
                if (!tooCloseToOtherTarget || validatedTargets.length === 0) {
                    validatedTargets.push(safePos);
                }
            }
            simpleTargetAttempts++;
        }
        
        // Emergency fallback: place at least one target if none were placed
        if (validatedTargets.length === 0) {
            // Place a simple target at a safe position
            const emergencyPos = { 
                x: Math.min(this.canvas.width - 100, 200), 
                y: Math.min(this.canvas.height - 100, 200) 
            };
            validatedTargets.push(emergencyPos);
        }
        
        // Create target objects
        validatedTargets.forEach(pos => {
            this.targets.push(new Target(pos.x, pos.y));
        });
    }
    
    isTargetReachable(targetPos) {
        const cannonPos = this.cannon.position;
        
        // First check: reject if direct line of sight exists (we want gravity-assisted shots)
        if (this.hasDirectLineOfSight(cannonPos, new Vector2(targetPos.x, targetPos.y))) {
            return false; // Too easy - direct shot possible
        }
        
        const testAngles = [];
        
        // Test fewer angles but more strategically
        for (let i = 0; i < 24; i++) {
            testAngles.push((i / 24) * Math.PI * 2);
        }
        
        let reachableTrajectories = 0;
        const maxAllowedSolutions = 5; // Allow more solutions since we relaxed deflection requirements
        
        for (const angle of testAngles) {
            // Create test bullet
            const velocity = new Vector2(
                Math.cos(angle) * 120,
                Math.sin(angle) * 120
            );
            const testBullet = new Bullet(cannonPos.x, cannonPos.y, velocity);
            
            // Track if trajectory uses gravity (bullet gets deflected)
            let initialDirection = velocity.normalize();
            let usedGravityAssist = false;
            
            // Simulate trajectory
            const maxSteps = 250;
            const stepTime = 0.016; // 60fps
            
            for (let step = 0; step < maxSteps && testBullet.alive; step++) {
                const oldVelocity = new Vector2(testBullet.velocity.x, testBullet.velocity.y);
                testBullet.update(this.spaceBodies, stepTime, this.canvas.width, this.canvas.height);
                
                // Check if gravity changed trajectory (15 degree deflection)
                if (step > 10) {
                    const currentDirection = testBullet.velocity.normalize();
                    const dotProduct = initialDirection.x * currentDirection.x + initialDirection.y * currentDirection.y;
                    if (dotProduct < 0.966) { // ~15 degree change (cos(15°) ≈ 0.966)
                        usedGravityAssist = true;
                    }
                }
                
                // Check if bullet reaches target
                if (new Vector2(testBullet.position.x, testBullet.position.y).distance(new Vector2(targetPos.x, targetPos.y)) < 25) {
                    if (usedGravityAssist) {
                        reachableTrajectories++;
                        if (reachableTrajectories <= maxAllowedSolutions) {
                            break; // Found a valid gravity-assisted solution
                        }
                    }
                    break;
                }
                
                // Check collision with space bodies
                const hitSpaceBody = this.spaceBodies.some(body => 
                    testBullet.checkSpaceBodyCollision(body)
                );
                
                if (hitSpaceBody) {
                    testBullet.alive = false;
                }
            }
            
            if (reachableTrajectories > maxAllowedSolutions) {
                return false; // Too many solutions, too easy
            }
        }
        
        return reachableTrajectories > 0 && reachableTrajectories <= maxAllowedSolutions;
    }
    
    generateFallbackTarget() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const cannonPos = this.cannon.position;
        
        // Generate challenging positions that require gravity assists
        const attempts = 100;
        for (let i = 0; i < attempts; i++) {
            let x, y;
            
            // Force challenging positions - far from cannon and requiring trajectory chains
            const zones = [
                // Far corners
                () => ({ x: this.canvas.width - 80 - Math.random() * 60, y: 60 + Math.random() * 80 }),
                () => ({ x: this.canvas.width - 80 - Math.random() * 60, y: this.canvas.height - 140 + Math.random() * 80 }),
                () => ({ x: 60 + Math.random() * 80, y: 60 + Math.random() * 80 }),
                
                // Behind space bodies (shadow zones)
                () => {
                    if (this.spaceBodies.length > 0) {
                        const body = this.spaceBodies[Math.floor(Math.random() * this.spaceBodies.length)];
                        const angle = Math.random() * Math.PI * 2;
                        const distance = body.radius + 50 + Math.random() * 40;
                        return {
                            x: body.position.x + Math.cos(angle) * distance,
                            y: body.position.y + Math.sin(angle) * distance
                        };
                    }
                    return { x: centerX + 200, y: centerY };
                },
                
                // Far edges requiring slingshots
                () => ({ x: centerX + 150 + Math.random() * 100, y: 60 + Math.random() * 60 }),
                () => ({ x: centerX - 150 - Math.random() * 100, y: this.canvas.height - 120 + Math.random() * 60 }),
                () => ({ x: this.canvas.width - 100, y: centerY + (Math.random() - 0.5) * 200 })
            ];
            
            const zone = zones[Math.floor(Math.random() * zones.length)];
            const pos = zone();
            
            // Ensure position is within bounds
            pos.x = Math.max(60, Math.min(this.canvas.width - 60, pos.x));
            pos.y = Math.max(60, Math.min(this.canvas.height - 60, pos.y));
            
            // Must be far from cannon (minimum distance based on level difficulty)
            const minDistanceFromCannon = 150 + this.level * 20;
            const distanceFromCannon = new Vector2(pos.x, pos.y).distance(cannonPos);
            
            if (distanceFromCannon < minDistanceFromCannon) continue;
            
            // Check if position doesn't overlap with space bodies
            const isSafe = this.spaceBodies.every(body => 
                new Vector2(pos.x, pos.y).distance(body.position) > body.radius + 40
            );
            
            if (!isSafe) continue;
            
            // Additional check: ensure it's not in direct line of sight from cannon
            if (this.hasDirectLineOfSight(cannonPos, new Vector2(pos.x, pos.y))) {
                continue; // Skip positions with direct shots
            }
            
            return pos;
        }
        
        return null;
    }
    
    hasDirectLineOfSight(from, to) {
        const direction = to.subtract(from);
        const distance = direction.magnitude();
        const step = direction.normalize().multiply(5);
        let current = from.add(step.multiply(10)); // Start a bit away from cannon
        
        while (current.distance(from) < distance - 20) {
            // Check if current position intersects any space body
            const blocked = this.spaceBodies.some(body => 
                current.distance(body.position) < body.radius + 10
            );
            
            if (blocked) return false; // Line of sight is blocked
            
            current = current.add(step);
        }
        
        return true; // Direct line of sight exists
    }
    
    generateSimpleTarget() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const cannonPos = this.cannon.position;
        
        // Generate a simple target that's guaranteed to be reachable but still challenging
        const attempts = 20;
        for (let i = 0; i < attempts; i++) {
            // Place targets in predictable but challenging positions
            const positions = [
                { x: centerX + 120, y: centerY - 80 },
                { x: centerX - 120, y: centerY + 80 },
                { x: this.canvas.width - 120, y: centerY },
                { x: centerX, y: this.canvas.height - 80 },
                { x: centerX + 150, y: 80 },
                { x: 100, y: centerY }
            ];
            
            const pos = positions[i % positions.length];
            
            // Add some randomness
            pos.x += (Math.random() - 0.5) * 40;
            pos.y += (Math.random() - 0.5) * 40;
            
            // Ensure within bounds
            pos.x = Math.max(50, Math.min(this.canvas.width - 50, pos.x));
            pos.y = Math.max(50, Math.min(this.canvas.height - 50, pos.y));
            
            // Check if position is safe from space bodies
            const isSafe = this.spaceBodies.every(body => 
                new Vector2(pos.x, pos.y).distance(body.position) > body.radius + 30
            );
            
            if (isSafe) {
                return pos;
            }
        }
        
        return null;
    }
    

    shoot() {
        const bullet = this.cannon.shoot();
        this.bullets.push(bullet);
    }

    update(deltaTime) {
        if (this.cannon) {
            this.cannon.aimAt(this.mousePosition);
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
            console.log('Level', this.level, 'completed! Moving to level', this.level + 1);
            setTimeout(() => {
                this.level++;
                this.initializeLevel();
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
    }

    drawTrajectoryPreview() {
        if (!this.cannon) return;
        
        const previewBullet = this.cannon.shoot();
        const points = [];
        const steps = 50;
        const stepTime = 0.02;
        
        for (let i = 0; i < steps; i++) {
            points.push(new Vector2(previewBullet.position.x, previewBullet.position.y));
            previewBullet.update(this.spaceBodies, stepTime, this.canvas.width, this.canvas.height);
            
            if (!previewBullet.alive) break;
        }
        
        this.ctx.save();
        this.ctx.strokeStyle = '#ffffff40';
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

    updateUI() {
        document.getElementById('level').textContent = this.level;
        document.getElementById('score').textContent = this.score;
        document.getElementById('targets').textContent = this.targets.filter(t => !t.hit).length;
    }

    gameLoop(currentTime) {
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
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

class SpaceBody {
    constructor(x, y, mass, radius, color = '#4a90e2') {
        this.position = new Vector2(x, y);
        this.mass = mass;
        this.radius = radius;
        this.color = color;
        this.gravitationalConstant = 5000;
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Gravitational field visualization
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius * 3, 0, Math.PI * 2);
        ctx.strokeStyle = this.color + '30';
        ctx.lineWidth = 2;
        ctx.stroke();
        
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
    constructor(x, y) {
        this.position = new Vector2(x, y);
        this.radius = 15;
        this.color = '#50e3c2';
        this.pulseTime = 0;
        this.hit = false;
    }

    update(deltaTime) {
        this.pulseTime += deltaTime * 3;
    }

    draw(ctx) {
        if (this.hit) return;

        ctx.save();
        const pulse = Math.sin(this.pulseTime) * 0.2 + 1;
        
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius * 0.5 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = this.color + '60';
        ctx.fill();
        
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
        const maxWidth = window.innerWidth - 40;
        const maxHeight = window.innerHeight - 40;
        
        this.canvas.width = Math.min(800, maxWidth);
        this.canvas.height = Math.min(600, maxHeight);
        
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
        
        this.cannon = new Cannon(50, this.canvas.height - 50);
        
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
        
        // Generate space bodies in strategic positions to block direct shots
        for (let i = 0; i < bodyCount; i++) {
            let x, y;
            
            if (bodyCount === 1) {
                // Level 1: Single body blocking center
                x = centerX - 80;
                y = centerY;
            } else {
                // Multiple bodies: arrange in patterns that require gravity usage
                const angle = (i / bodyCount) * Math.PI * 2 + (Math.PI / 4);
                const distance = 60 + (i % 2) * 60; // Vary distance for complexity
                x = centerX + Math.cos(angle) * distance;
                y = centerY + Math.sin(angle) * distance;
                
                // Ensure bodies stay within bounds
                x = Math.max(100, Math.min(this.canvas.width - 100, x));
                y = Math.max(100, Math.min(this.canvas.height - 100, y));
            }
            
            const mass = 45 + Math.random() * 20;
            const radius = 25 + Math.random() * 10;
            const color = colors[i % colors.length];
            
            this.spaceBodies.push(new SpaceBody(x, y, mass, radius, color));
        }
        
        // Generate targets positioned to require gravity assistance
        for (let i = 0; i < targetCount; i++) {
            let x, y;
            let attempts = 0;
            
            do {
                // Place targets in areas that are blocked by space bodies from cannon
                const targetAngle = (i / targetCount) * Math.PI * 2;
                const targetDistance = 120 + Math.random() * 100;
                
                // Offset from center to create interesting shots
                const offsetX = Math.cos(targetAngle) * targetDistance;
                const offsetY = Math.sin(targetAngle) * targetDistance;
                
                x = centerX + offsetX + (Math.random() - 0.5) * 60;
                y = centerY + offsetY + (Math.random() - 0.5) * 60;
                
                // Keep targets within bounds
                x = Math.max(80, Math.min(this.canvas.width - 80, x));
                y = Math.max(80, Math.min(this.canvas.height - 80, y));
                
                attempts++;
            } while (attempts < 30 && (
                // Avoid placing targets too close to space bodies
                this.spaceBodies.some(body => 
                    new Vector2(x, y).distance(body.position) < body.radius * 2.5
                ) ||
                // Avoid placing targets too close to cannon (direct line of sight)
                (Math.abs(x - 50) < 100 && Math.abs(y - (this.canvas.height - 50)) < 100)
            ));
            
            this.targets.push(new Target(x, y));
        }
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

        this.targets.forEach(target => target.update(deltaTime));

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
import { Vector2 } from '../core/Vector2.js';

export class Bullet {
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
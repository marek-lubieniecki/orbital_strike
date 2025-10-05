import { Vector2 } from '../core/Vector2.js';

export class Target {
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
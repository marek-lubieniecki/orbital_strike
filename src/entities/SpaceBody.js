import { Vector2 } from '../core/Vector2.js';
import { CELESTIAL_TYPES } from '../core/CelestialTypes.js';

export class SpaceBody {
    constructor(x, y, type = 'asteroid', orbitCenter = null, orbitRadius = 0, orbitalSpeed = 0) {
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
        
        // Orbital mechanics
        this.orbitCenter = orbitCenter;
        this.orbitRadius = orbitRadius;
        this.orbitalSpeed = orbitalSpeed; // radians per second
        this.orbitAngle = 0;
        this.isOrbiting = orbitCenter !== null;
        
        // Calculate initial angle based on current position
        if (orbitCenter) {
            const direction = this.position.subtract(orbitCenter);
            this.orbitAngle = Math.atan2(direction.y, direction.x);
        }
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
    
    update(deltaTime) {
        if (this.isOrbiting && this.orbitCenter) {
            // Update orbital angle based on speed
            this.orbitAngle += this.orbitalSpeed * deltaTime;
            
            // Calculate new position
            this.position.x = this.orbitCenter.x + Math.cos(this.orbitAngle) * this.orbitRadius;
            this.position.y = this.orbitCenter.y + Math.sin(this.orbitAngle) * this.orbitRadius;
        }
    }

    draw(ctx) {
        ctx.save();
        
        // Draw orbital path for orbiting bodies
        if (this.isOrbiting && this.orbitCenter) {
            ctx.beginPath();
            ctx.arc(this.orbitCenter.x, this.orbitCenter.y, this.orbitRadius, 0, Math.PI * 2);
            ctx.strokeStyle = this.color + '40';
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
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
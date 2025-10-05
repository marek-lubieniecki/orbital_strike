import { Vector2 } from '../core/Vector2.js';
import { Bullet } from './Bullet.js';

export class Cannon {
    constructor(x, y, mountedBody = null, mountAngle = 0) {
        this.position = new Vector2(x, y);
        this.angle = 0;
        this.length = 40;
        this.width = 8;
        this.isMounted = mountedBody !== null;
        this.mountedBody = mountedBody;
        this.mountAngle = mountAngle;

        // If mounted, set initial position
        if (this.isMounted) {
            this.update();
        }
    }

    mountOn(spaceBody, angle = 0) {
        this.isMounted = true;
        this.mountedBody = spaceBody;
        this.mountAngle = angle;
        this.update();
    }

    unmount() {
        this.isMounted = false;
        this.mountedBody = null;
        this.mountAngle = 0;
    }

    update() {
        // Update cannon position if it's mounted on an orbiting body
        if (this.isMounted && this.mountedBody) {
            const mountDistance = this.mountedBody.radius + 20;
            this.position.x = this.mountedBody.position.x + Math.cos(this.mountAngle) * mountDistance;
            this.position.y = this.mountedBody.position.y + Math.sin(this.mountAngle) * mountDistance;
        }
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
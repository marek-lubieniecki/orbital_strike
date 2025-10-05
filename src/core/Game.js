import { Vector2 } from './Vector2.js';
import { SpaceBody } from '../entities/SpaceBody.js';
import { Target } from '../entities/Target.js';
import { Bullet } from '../entities/Bullet.js';
import { Cannon } from '../entities/Cannon.js';
import { NarrativeSystem } from '../systems/NarrativeSystem.js';
import { MessageRenderer } from '../ui/MessageRenderer.js';

export class Game {
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
        
        // Systems
        this.narrativeSystem = new NarrativeSystem();
        this.messageRenderer = new MessageRenderer();
        
        // UI state
        this.completionMessage = null;
        this.levelIntroduction = null;
        
        this.mousePosition = new Vector2(0, 0);
        this.isMobile = this.checkMobile();
        
        // Launch power system
        this.isCharging = false;
        this.chargeStartTime = 0;
        this.minLaunchVelocity = 30;  // Very low velocity for taps
        this.maxLaunchVelocity = 240;
        this.maxChargeTime = 1500;    // Longer charge time needed for max power
        
        this.gameVersion = "v1.5.0 - Refactored";
        
        this.setupEventListeners();
        this.initialize();
    }

    async initialize() {
        try {
            // For now, use procedural generation only
            await this.initializeLevel();
            this.initialized = true;
            
            this.lastTime = 0;
            this.gameLoop = this.gameLoop.bind(this);
            console.log('Starting refactored game loop...');
            requestAnimationFrame(this.gameLoop);
        } catch (error) {
            console.error('Failed to initialize game:', error);
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
        
        const isVertical = window.innerHeight > window.innerWidth || this.isMobile;
        
        if (isVertical || this.isMobile) {
            this.canvas.width = availableWidth;
            this.canvas.height = availableHeight;
        } else {
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

            this.canvas.addEventListener('touchend', (e) => {
                e.preventDefault();
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

            this.canvas.addEventListener('mousedown', (e) => {
                if (e.button === 0) {
                    this.startCharging();
                }
            });

            this.canvas.addEventListener('mouseup', (e) => {
                if (e.button === 0) {
                    this.shoot();
                }
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
        
        this.levelRockets = 0;
        this.cannon = null;
        
        // Generate level (simplified procedural generation for now)
        this.generateSimpleLevel();
        
        // Show level introduction with AI narrative
        this.levelIntroduction = this.narrativeSystem.createLevelIntroduction(this.level);
        
        this.updateUI();
    }

    generateSimpleLevel() {
        // Simple level generation for testing
        const safeMargin = 50;
        const canvasW = this.canvas.width;
        const canvasH = this.canvas.height;
        
        this.playArea = {
            minX: safeMargin,
            minY: safeMargin,
            maxX: canvasW - safeMargin,
            maxY: canvasH - safeMargin,
            centerX: canvasW / 2,
            centerY: canvasH / 2,
            width: canvasW - 2 * safeMargin,
            height: canvasH - 2 * safeMargin
        };

        // Setup cannon
        this.setupDefaultCannonPosition();
        
        if (this.level === 1) {
            // Tutorial level - just targets
            this.targets.push(new Target(this.playArea.centerX + 200, this.playArea.centerY - 50));
            this.targets.push(new Target(this.playArea.centerX + 250, this.playArea.centerY));
            this.targets.push(new Target(this.playArea.centerX + 200, this.playArea.centerY + 50));
        } else {
            // Add a simple space body
            const body = new SpaceBody(
                this.playArea.centerX - 100,
                this.playArea.centerY,
                'asteroid'
            );
            this.spaceBodies.push(body);
            
            // Add targets
            this.targets.push(new Target(this.playArea.centerX + 200, this.playArea.centerY - 100));
            this.targets.push(new Target(this.playArea.centerX + 250, this.playArea.centerY + 100));
        }
    }

    setupDefaultCannonPosition() {
        this.cannon = new Cannon(
            this.playArea.minX + 50,
            this.playArea.centerY
        );
    }

    startCharging() {
        if (!this.isCharging) {
            this.isCharging = true;
            this.chargeStartTime = Date.now();
        }
    }

    shoot() {
        if (!this.cannon || !this.isCharging) return;
        
        this.isCharging = false;
        
        const chargeTime = Date.now() - this.chargeStartTime;
        const chargeFraction = Math.min(chargeTime / this.maxChargeTime, 1);
        const launchVelocity = this.minLaunchVelocity + 
            (this.maxLaunchVelocity - this.minLaunchVelocity) * chargeFraction;
        
        const bullet = this.cannon.shoot(launchVelocity);
        this.bullets.push(bullet);
        this.rocketsLaunched++;
        this.levelRockets++;
        
        this.updateUI();
    }

    gameLoop(currentTime) {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.draw();
        
        requestAnimationFrame(this.gameLoop);
    }

    update(deltaTime) {
        if (this.cannon) {
            this.cannon.aimAt(this.mousePosition);
        }

        // Update message timers using MessageRenderer
        this.levelIntroduction = this.messageRenderer.updateLevelIntroduction(this.levelIntroduction, deltaTime);
        this.completionMessage = this.messageRenderer.updateCompletionMessage(this.completionMessage, deltaTime);

        // Update space bodies
        this.spaceBodies.forEach(body => body.update(deltaTime));
        
        // Update bullets
        this.bullets.forEach(bullet => bullet.update(this.spaceBodies, deltaTime, this.canvas.width, this.canvas.height));
        this.bullets = this.bullets.filter(bullet => bullet.alive);

        // Update targets
        this.targets.forEach(target => target.update(deltaTime, this.canvas.width, this.canvas.height));

        // Check collisions
        this.checkCollisions();

        // Check for level completion
        this.checkLevelCompletion();
    }

    checkCollisions() {
        this.bullets.forEach(bullet => {
            // Check bullet-target collisions
            this.targets.forEach(target => {
                if (!target.hit && bullet.checkCollision(target)) {
                    target.hit = true;
                    bullet.alive = false;
                }
            });

            // Check bullet-space body collisions
            this.spaceBodies.forEach(body => {
                if (bullet.checkSpaceBodyCollision(body)) {
                    bullet.alive = false;
                }
            });
        });
    }

    checkLevelCompletion() {
        if (this.targets.every(target => target.hit) && !this.levelCompleted) {
            this.levelCompleted = true;
            
            const efficiencyBonus = this.calculateEfficiencyBonus();
            this.score += efficiencyBonus;
            
            const efficiencyRating = this.getEfficiencyRating();
            this.showLevelCompletionMessage(efficiencyRating, efficiencyBonus);
            
            setTimeout(async () => {
                this.level++;
                await this.initializeLevel();
                this.levelCompleted = false;
            }, 2500);
        }
    }

    calculateEfficiencyBonus() {
        const targetCount = this.targets.length;
        const rocketsUsed = this.levelRockets;
        const idealRockets = targetCount;
        
        if (rocketsUsed <= idealRockets) {
            return 100 * targetCount;
        } else if (rocketsUsed <= idealRockets * 2) {
            return 50 * targetCount;
        }
        return 0;
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
        }
        return "☆☆☆ POOR";
    }

    showLevelCompletionMessage(rating, bonus) {
        const narrativeData = this.narrativeSystem.createCompletionNarrative(this.level);
        
        this.completionMessage = {
            rating,
            bonus,
            narrative: narrativeData.text,
            location: narrativeData.location,
            timer: 2.5,
            alpha: 1.0
        };
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000011';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw space bodies
        this.spaceBodies.forEach(body => body.draw(this.ctx));
        
        // Draw targets
        this.targets.forEach(target => target.draw(this.ctx));
        
        // Draw bullets
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
        
        // Draw cannon
        if (this.cannon) {
            this.cannon.draw(this.ctx);
        }
        
        // Draw power meter when charging
        this.drawPowerMeter();
        
        // Draw messages using MessageRenderer
        this.messageRenderer.drawLevelIntroduction(this.ctx, this.canvas, this.levelIntroduction, this.level);
        this.messageRenderer.drawCompletionMessage(this.ctx, this.canvas, this.completionMessage, this.levelRockets);
        
        // Draw version
        this.drawVersion();
    }

    drawPowerMeter() {
        if (!this.isCharging) return;
        
        const chargeTime = Date.now() - this.chargeStartTime;
        const chargeFraction = Math.min(chargeTime / this.maxChargeTime, 1);
        
        const meterWidth = 200;
        const meterHeight = 20;
        const meterX = this.canvas.width / 2 - meterWidth / 2;
        const meterY = 50;
        
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(meterX, meterY, meterWidth, meterHeight);
        
        const fillWidth = meterWidth * chargeFraction;
        const color = chargeFraction < 0.5 ? '#ffaa00' : '#ff4400';
        this.ctx.fillStyle = color;
        this.ctx.fillRect(meterX, meterY, fillWidth, meterHeight);
        
        this.ctx.strokeStyle = '#fff';
        this.ctx.strokeRect(meterX, meterY, meterWidth, meterHeight);
    }

    drawVersion() {
        this.ctx.save();
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'right';
        
        const x = this.canvas.width - 10;
        const y = this.canvas.height - 10;
        
        this.ctx.fillStyle = '#aaaaaa';
        this.ctx.fillText(this.gameVersion, x - 2, y - 2);
        
        this.ctx.restore();
    }

    updateUI() {
        document.getElementById('level').textContent = this.level;
        document.getElementById('score').textContent = this.score;
        document.getElementById('rockets').textContent = this.rocketsLaunched;
    }

    initializeFallbackLevel() {
        this.generateSimpleLevel();
        this.levelIntroduction = this.narrativeSystem.createLevelIntroduction(this.level);
    }
}
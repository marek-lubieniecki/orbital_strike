class LevelLoader {
    constructor() {
        this.celestialBodies = null;
        this.gameSettings = null;
        this.loadedLevels = new Map();
    }

    async initialize() {
        try {
            // Load configuration files
            await Promise.all([
                this.loadCelestialBodies(),
                this.loadGameSettings()
            ]);
            console.log('Level loader initialized successfully');
        } catch (error) {
            console.error('Failed to initialize level loader:', error);
            throw error;
        }
    }

    async loadCelestialBodies() {
        const response = await fetch('data/bodies/celestial-bodies.json');
        if (!response.ok) {
            throw new Error(`Failed to load celestial bodies: ${response.statusText}`);
        }
        this.celestialBodies = await response.json();
    }

    async loadGameSettings() {
        const response = await fetch('data/config/game-settings.json');
        if (!response.ok) {
            throw new Error(`Failed to load game settings: ${response.statusText}`);
        }
        this.gameSettings = await response.json();
    }

    async loadLevel(levelId) {
        // Check if level is already cached
        if (this.loadedLevels.has(levelId)) {
            return this.loadedLevels.get(levelId);
        }

        try {
            const response = await fetch(`data/levels/level-${String(levelId).padStart(2, '0')}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load level ${levelId}: ${response.statusText}`);
            }
            
            const levelData = await response.json();
            const processedLevel = this.processLevel(levelData);
            
            // Cache the processed level
            this.loadedLevels.set(levelId, processedLevel);
            
            return processedLevel;
        } catch (error) {
            console.error(`Error loading level ${levelId}:`, error);
            throw error;
        }
    }

    processLevel(levelData) {
        return {
            ...levelData,
            spaceBodies: levelData.spaceBodies.map(body => this.processSpaceBody(body)),
            targets: levelData.targets.map(target => this.processTarget(target))
        };
    }

    processSpaceBody(bodyData) {
        const bodyTemplate = this.celestialBodies[bodyData.type];
        if (!bodyTemplate) {
            throw new Error(`Unknown celestial body type: ${bodyData.type}`);
        }

        return {
            id: bodyData.id,
            type: bodyData.type,
            position: this.evaluatePosition(bodyData.position),
            template: bodyTemplate
        };
    }

    processTarget(targetData) {
        return {
            id: targetData.id,
            position: this.evaluatePosition(targetData.position),
            movementType: targetData.movementType || 'static',
            orbitCenter: targetData.orbitCenter ? this.evaluatePosition(targetData.orbitCenter) : null,
            orbitRadius: targetData.orbitRadius || 0,
            orbitalSpeed: targetData.orbitalSpeed || 0
        };
    }

    evaluatePosition(positionData) {
        // Handle string expressions like "centerX + 100" or "canvasWidth - 80"
        if (typeof positionData.x === 'string') {
            positionData.x = this.evaluateExpression(positionData.x);
        }
        if (typeof positionData.y === 'string') {
            positionData.y = this.evaluateExpression(positionData.y);
        }
        
        return positionData;
    }

    evaluateExpression(expression) {
        // This will be evaluated at runtime when canvas dimensions are known
        return expression;
    }

    // Evaluate position expressions with actual canvas dimensions
    resolvePosition(expression, canvasWidth, canvasHeight) {
        if (typeof expression !== 'string') {
            return expression;
        }

        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        
        // Replace keywords with actual values
        const resolved = expression
            .replace(/centerX/g, centerX)
            .replace(/centerY/g, centerY)  
            .replace(/canvasWidth/g, canvasWidth)
            .replace(/canvasHeight/g, canvasHeight);

        try {
            // Safely evaluate the mathematical expression
            return Function(`"use strict"; return (${resolved})`)();
        } catch (error) {
            console.error(`Failed to evaluate position expression: ${expression}`, error);
            return 0;
        }
    }

    getCelestialBodyTemplate(type) {
        return this.celestialBodies[type];
    }

    getGameSettings() {
        return this.gameSettings;
    }

    // Preload multiple levels for better performance
    async preloadLevels(levelIds) {
        const promises = levelIds.map(id => this.loadLevel(id));
        await Promise.all(promises);
    }

    clearCache() {
        this.loadedLevels.clear();
    }

    // Get available level count (assumes sequential numbering)
    async getAvailableLevels() {
        const levels = [];
        let levelId = 1;
        
        while (true) {
            try {
                const response = await fetch(`data/levels/level-${String(levelId).padStart(2, '0')}.json`, { method: 'HEAD' });
                if (response.ok) {
                    levels.push(levelId);
                    levelId++;
                } else {
                    break;
                }
            } catch {
                break;
            }
        }
        
        return levels;
    }
}

// Global instance
const levelLoader = new LevelLoader();
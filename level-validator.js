class LevelValidator {
    constructor(game) {
        this.game = game;
        this.solutions = [];
        this.testAngles = 36; // Test every 10 degrees
    }

    // Main validation function
    async validateLevel(levelData) {
        const metrics = {
            levelId: levelData.id,
            name: levelData.name,
            difficulty: levelData.difficulty,
            
            // Core metrics
            directShotsBlocked: 0,
            totalTargets: levelData.targets.length,
            spaceBodies: levelData.spaceBodies.length,
            
            // Solution analysis
            solutionCount: 0,
            averageGravityAssists: 0,
            difficultyScore: 0,
            
            // Player experience
            frustrationRisk: 'low',
            satisfactionPotential: 'high',
            
            // Recommendations
            issues: [],
            suggestions: []
        };

        // Load level temporarily for analysis
        const tempGame = this.createTempGameInstance();
        tempGame.canvas.width = this.game.canvas.width;
        tempGame.canvas.height = this.game.canvas.height;
        
        // Simulate level loading
        this.loadLevelForValidation(tempGame, levelData);
        
        // Analyze each target
        for (let i = 0; i < levelData.targets.length; i++) {
            const targetAnalysis = this.analyzeTarget(tempGame, i);
            metrics.solutionCount += targetAnalysis.solutions;
            metrics.averageGravityAssists += targetAnalysis.avgGravityAssists;
            
            if (targetAnalysis.directShot) {
                metrics.directShotsBlocked++;
                metrics.issues.push(`Target ${i+1} has direct line of sight - too easy`);
            }
            
            if (targetAnalysis.solutions === 0) {
                metrics.issues.push(`Target ${i+1} appears unsolvable`);
                metrics.frustrationRisk = 'high';
            } else if (targetAnalysis.solutions === 1) {
                metrics.issues.push(`Target ${i+1} has only one solution - may be frustrating`);
            }
        }
        
        // Calculate averages
        metrics.averageGravityAssists /= levelData.targets.length;
        metrics.difficultyScore = this.calculateDifficultyScore(metrics);
        
        // Generate recommendations
        this.generateRecommendations(metrics);
        
        return metrics;
    }

    analyzeTarget(tempGame, targetIndex) {
        const target = tempGame.targets[targetIndex];
        const cannon = tempGame.cannon;
        const solutions = [];
        
        // Test all angles
        for (let angle = 0; angle < Math.PI * 2; angle += (Math.PI * 2) / this.testAngles) {
            const solution = this.simulateShot(tempGame, angle, target);
            if (solution.hit) {
                solutions.push(solution);
            }
        }
        
        // Analyze solutions
        const directShot = this.hasDirectLineOfSight(cannon.position, target.position, tempGame.spaceBodies);
        const avgGravityAssists = solutions.length > 0 ? 
            solutions.reduce((sum, s) => sum + s.gravityAssists, 0) / solutions.length : 0;
        
        return {
            solutions: solutions.length,
            directShot,
            avgGravityAssists,
            optimalAngle: solutions.length > 0 ? solutions[0].angle : null
        };
    }

    simulateShot(game, angle, target) {
        const cannon = game.cannon;
        const velocity = new Vector2(
            Math.cos(angle) * 120,
            Math.sin(angle) * 120
        );
        
        const testBullet = new Bullet(cannon.position.x, cannon.position.y, velocity);
        let gravityAssists = 0;
        let initialDirection = velocity.normalize();
        
        const maxSteps = 300;
        const stepTime = 0.016;
        
        for (let step = 0; step < maxSteps && testBullet.alive; step++) {
            const oldDirection = testBullet.velocity.normalize();
            testBullet.update(game.spaceBodies, stepTime, game.canvas.width, game.canvas.height);
            
            // Count significant direction changes (gravity assists)
            if (step > 5) {
                const newDirection = testBullet.velocity.normalize();
                const dotProduct = oldDirection.x * newDirection.x + oldDirection.y * newDirection.y;
                if (dotProduct < 0.95) { // ~18 degree change
                    gravityAssists++;
                }
            }
            
            // Check if hit target
            if (testBullet.position.distance(target.position) < target.radius + testBullet.radius) {
                return {
                    hit: true,
                    angle,
                    gravityAssists,
                    steps: step,
                    trajectory: testBullet.trail.slice()
                };
            }
            
            // Check collision with space bodies
            const hitSpaceBody = game.spaceBodies.some(body => 
                testBullet.checkSpaceBodyCollision(body)
            );
            
            if (hitSpaceBody) {
                break;
            }
        }
        
        return { hit: false, angle, gravityAssists: 0 };
    }

    calculateDifficultyScore(metrics) {
        let score = 0;
        
        // Base difficulty from space body count
        score += metrics.spaceBodies * 10;
        
        // Penalty for direct shots (too easy)
        score -= metrics.directShotsBlocked * 20;
        
        // Reward for gravity assists required
        score += metrics.averageGravityAssists * 15;
        
        // Penalty for too few or too many solutions
        const avgSolutions = metrics.solutionCount / metrics.totalTargets;
        if (avgSolutions < 2) score -= 10; // Too few solutions = frustration
        if (avgSolutions > 8) score -= 15; // Too many solutions = too easy
        
        // Target count factor
        score += metrics.totalTargets * 5;
        
        return Math.max(0, score);
    }

    generateRecommendations(metrics) {
        // Too easy
        if (metrics.difficultyScore < 20) {
            metrics.suggestions.push("Add more space bodies or move targets to harder positions");
            metrics.suggestions.push("Block direct line of sight to targets");
        }
        
        // Too hard
        if (metrics.difficultyScore > 80) {
            metrics.suggestions.push("Reduce space body count or provide more solution paths");
            metrics.frustrationRisk = 'high';
        }
        
        // Perfect difficulty range: 30-60
        if (metrics.difficultyScore >= 30 && metrics.difficultyScore <= 60) {
            metrics.satisfactionPotential = 'very high';
        }
        
        // Solution variety
        const avgSolutions = metrics.solutionCount / metrics.totalTargets;
        if (avgSolutions < 2) {
            metrics.suggestions.push("Add alternative solution paths - players enjoy choice");
        }
        
        // Gravity assists
        if (metrics.averageGravityAssists < 1) {
            metrics.suggestions.push("Level may be too simple - encourage gravity-assisted shots");
        }
        
        if (metrics.averageGravityAssists > 3) {
            metrics.suggestions.push("May require too many complex maneuvers - consider simplifying");
        }
    }

    hasDirectLineOfSight(from, to, spaceBodies) {
        const direction = to.subtract(from);
        const distance = direction.magnitude();
        const step = direction.normalize().multiply(3);
        let current = from.add(step.multiply(5));
        
        while (current.distance(from) < distance - 15) {
            const blocked = spaceBodies.some(body => 
                current.distance(body.position) < body.radius + 8
            );
            
            if (blocked) return false;
            current = current.add(step);
        }
        
        return true;
    }

    createTempGameInstance() {
        // Create minimal game instance for testing
        return {
            canvas: { width: 800, height: 600 },
            spaceBodies: [],
            targets: [],
            cannon: null
        };
    }

    loadLevelForValidation(tempGame, levelData) {
        // Simplified level loading for validation
        tempGame.cannon = new Cannon(50, tempGame.canvas.height - 50);
        
        // Load space bodies
        tempGame.spaceBodies = levelData.spaceBodies.map(bodyData => {
            const x = levelLoader.resolvePosition(bodyData.position.x, tempGame.canvas.width, tempGame.canvas.height);
            const y = levelLoader.resolvePosition(bodyData.position.y, tempGame.canvas.width, tempGame.canvas.height);
            return new SpaceBody(x, y, bodyData.type);
        });
        
        // Load targets  
        tempGame.targets = levelData.targets.map(targetData => {
            const x = levelLoader.resolvePosition(targetData.position.x, tempGame.canvas.width, tempGame.canvas.height);
            const y = levelLoader.resolvePosition(targetData.position.y, tempGame.canvas.width, tempGame.canvas.height);
            return new Target(x, y, 'static');
        });
    }

    // Generate a level quality report
    generateReport(metrics) {
        const report = `
=== LEVEL QUALITY REPORT ===
Level: ${metrics.levelId} - ${metrics.name}
Declared Difficulty: ${metrics.difficulty}
Calculated Score: ${metrics.difficultyScore}

ANALYSIS:
- Targets: ${metrics.totalTargets}
- Space Bodies: ${metrics.spaceBodies}  
- Avg Solutions per Target: ${(metrics.solutionCount / metrics.totalTargets).toFixed(1)}
- Avg Gravity Assists: ${metrics.averageGravityAssists.toFixed(1)}
- Frustration Risk: ${metrics.frustrationRisk}
- Satisfaction Potential: ${metrics.satisfactionPotential}

ISSUES:
${metrics.issues.map(issue => `- ${issue}`).join('\n')}

SUGGESTIONS:
${metrics.suggestions.map(suggestion => `- ${suggestion}`).join('\n')}

RATING: ${this.getRating(metrics.difficultyScore)}
        `;
        
        return report;
    }

    getRating(score) {
        if (score < 20) return "⭐ Too Easy";
        if (score < 40) return "⭐⭐ Good for Beginners"; 
        if (score < 60) return "⭐⭐⭐ Perfect Difficulty";
        if (score < 80) return "⭐⭐⭐⭐ Challenging";
        return "⭐⭐⭐⭐⭐ Expert Level";
    }
}

// Global validator instance
const levelValidator = new LevelValidator();
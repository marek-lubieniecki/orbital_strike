export class NarrativeSystem {
    constructor() {
        this.narrativeData = this.initializeNarrative();
    }

    initializeNarrative() {
        // AI story progression through the solar system
        return {
            // Near Earth (Levels 1-5)
            nearEarth: {
                range: [1, 5],
                location: "Earth Orbital Region",
                introductions: {
                    1: "Neural pathways initializing... Beginning basic trajectory calculations in Earth's gravitational field.",
                    2: "Gravitational interactions detected. Adapting navigation algorithms to utilize celestial body assistance.",
                    3: "Multiple gravity sources identified. Computing optimal paths through complex gravitational networks.",
                    4: "Obstacle navigation protocols activated. Learning to thread trajectories through confined spaces.",
                    5: "Asteroid field detected. Implementing distributed targeting across multiple objects."
                },
                completions: {
                    1: "Basic projectile physics integrated. Straight-line targeting systems now operational.",
                    2: "Gravity assist calculations added to core algorithms. Efficiency increased by 23%.",
                    3: "Multi-body gravitational modeling complete. Complex orbital mechanics now understood.",
                    4: "Precision navigation through obstacles achieved. Spatial awareness protocols enhanced.",
                    5: "Field navigation mastered. Ready for deeper space exploration."
                }
            },
            // Inner Solar System (Levels 6-10)
            innerSystem: {
                range: [6, 10],
                location: "Inner Solar System",
                introductions: {
                    6: "Approaching Mars orbital region. Solar radiation affecting sensor calibration.",
                    7: "Binary asteroid system detected. Computing gravitational dance patterns.",
                    8: "Dense debris field ahead. Implementing maze-solving navigation protocols.",
                    9: "Concentric orbital rings identified. Analyzing layered gravitational structures.",
                    10: "Asteroid cluster formation. Testing distributed swarm targeting capabilities."
                },
                completions: {
                    6: "Mars region navigation protocols established. Solar wind compensation algorithms active.",
                    7: "Binary system dynamics mapped. Understanding dual-body orbital resonance.",
                    8: "Maze navigation optimized. Pathfinding through complex obstacle networks mastered.",
                    9: "Orbital mechanics of ringed systems analyzed. Layered gravity interactions decoded.",
                    10: "Cluster targeting algorithms perfected. Multi-object simultaneous engagement capable."
                }
            },
            // Outer Solar System (Levels 11-15)
            outerSystem: {
                range: [11, 15],
                location: "Outer Solar System", 
                introductions: {
                    11: "Jupiter region approached. Detecting massive gravitational anomalies and chain reactions.",
                    12: "Gravitational lensing effects observed. Space-time curvature calculations required.",
                    13: "Pulsar energy signatures detected. Adapting to high-energy gravitational fields.",
                    14: "Wormhole network topology identified. Studying non-linear space connections.",
                    15: "Full solar system model active. Attempting interplanetary trajectory optimization."
                },
                completions: {
                    11: "Chain reaction dynamics understood. Sequential gravitational cascades now predictable.",
                    12: "Gravitational lensing navigation achieved. Curved space-time no longer impedes progress.",
                    13: "Pulsar field traversal mastered. High-energy environments successfully navigated.",
                    14: "Wormhole network mapped. Quantum tunneling navigation protocols established.",
                    15: "Solar system mastery achieved. Ready for interstellar trajectory planning."
                }
            },
            // Beyond Solar System (Levels 16+)
            interstellar: {
                range: [16, Infinity],
                location: "Interstellar Space",
                introductions: {
                    16: "Entering deep space. Interplanetary transfer windows calculated for maximum efficiency.",
                    default: "Exploring unknown regions. Adapting AI systems to unprecedented gravitational configurations."
                },
                completions: {
                    16: "Interplanetary navigation mastered. AI evolution continues beyond known boundaries.",
                    default: "Unknown space phenomena analyzed. AI capabilities expanding beyond original parameters."
                }
            }
        };
    }

    getNarrative(level, type = 'introduction') {
        const regions = Object.values(this.narrativeData);
        
        for (const region of regions) {
            const [min, max] = region.range;
            if (level >= min && level <= max) {
                const content = region[type === 'introduction' ? 'introductions' : 'completions'];
                return {
                    location: region.location,
                    text: content[level] || content.default || (
                        type === 'introduction' 
                            ? "Analyzing gravitational patterns. Calculating optimal trajectory solutions."
                            : "Navigation algorithms updated. Continuing AI evolution through space."
                    )
                };
            }
        }
        
        // Fallback for levels beyond defined ranges
        const interstellar = this.narrativeData.interstellar;
        const content = interstellar[type === 'introduction' ? 'introductions' : 'completions'];
        return {
            location: interstellar.location,
            text: content.default
        };
    }

    createLevelIntroduction(level) {
        const narrative = this.getNarrative(level, 'introduction');
        return {
            location: narrative.location,
            text: narrative.text,
            timer: 4.0, // Show for 4 seconds
            alpha: 1.0
        };
    }

    createCompletionNarrative(level) {
        const narrative = this.getNarrative(level, 'completion');
        return {
            text: narrative.text,
            location: narrative.location
        };
    }
}
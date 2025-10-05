import { Game } from './src/core/Game.js';

// Initialize game when page loads
window.addEventListener('load', () => {
    try {
        const game = new Game();
        window.game = game; // For debugging
        console.log('Modular game initialized successfully');
    } catch (error) {
        console.error('Failed to initialize modular game:', error);
        console.log('Check that your server supports ES modules');
    }
});
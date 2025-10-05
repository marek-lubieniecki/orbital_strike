export class MessageRenderer {
    constructor() {}

    drawLevelIntroduction(ctx, canvas, levelIntroduction, level) {
        if (!levelIntroduction) return;
        
        ctx.save();
        
        // Dark overlay
        ctx.fillStyle = `rgba(0, 0, 20, ${levelIntroduction.alpha * 0.8})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.globalAlpha = levelIntroduction.alpha;
        
        // Location header
        ctx.fillStyle = '#4ae5f7';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(levelIntroduction.location, canvas.width / 2, canvas.height / 2 - 60);
        
        // Level indicator
        ctx.fillStyle = '#50e3c2';
        ctx.font = 'bold 32px Arial';
        ctx.fillText(`Level ${level}`, canvas.width / 2, canvas.height / 2 - 20);
        
        // AI narrative text
        ctx.fillStyle = '#ffffff';
        ctx.font = '18px Arial';
        
        // Word wrap the narrative text
        const maxWidth = canvas.width - 80;
        const words = levelIntroduction.text.split(' ');
        let line = '';
        let y = canvas.height / 2 + 20;
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, canvas.width / 2, y);
                line = words[n] + ' ';
                y += 25;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, canvas.width / 2, y);
        
        ctx.restore();
    }

    drawCompletionMessage(ctx, canvas, completionMessage, levelRockets) {
        if (!completionMessage) return;
        
        ctx.save();
        
        // Semi-transparent overlay
        ctx.fillStyle = `rgba(0, 0, 0, ${completionMessage.alpha * 0.7})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Main completion text
        ctx.globalAlpha = completionMessage.alpha;
        ctx.fillStyle = '#50e3c2';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('LEVEL COMPLETE!', canvas.width / 2, canvas.height / 2 - 60);
        
        // Efficiency rating
        ctx.fillStyle = '#ffff88';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(`Efficiency: ${completionMessage.rating}`, canvas.width / 2, canvas.height / 2 - 20);
        
        // Rockets used
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.fillText(`Rockets Used: ${levelRockets}`, canvas.width / 2, canvas.height / 2 + 10);
        
        // Bonus points
        let yOffset = 40;
        if (completionMessage.bonus > 0) {
            ctx.fillStyle = '#4ae24a';
            ctx.font = 'bold 20px Arial';
            ctx.fillText(`Efficiency Bonus: +${completionMessage.bonus}`, canvas.width / 2, canvas.height / 2 + yOffset);
            yOffset += 35;
        }
        
        // AI Learning narrative
        if (completionMessage.narrative) {
            ctx.fillStyle = '#4ae5f7';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('AI SYSTEM UPDATE:', canvas.width / 2, canvas.height / 2 + yOffset);
            
            // Word wrap the AI narrative text
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Arial';
            
            const maxWidth = canvas.width - 80;
            const words = completionMessage.narrative.split(' ');
            let line = '';
            let y = canvas.height / 2 + yOffset + 25;
            
            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;
                
                if (testWidth > maxWidth && n > 0) {
                    ctx.fillText(line, canvas.width / 2, y);
                    line = words[n] + ' ';
                    y += 20;
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line, canvas.width / 2, y);
        }
        
        ctx.restore();
    }

    updateLevelIntroduction(levelIntroduction, deltaTime) {
        if (levelIntroduction) {
            levelIntroduction.timer -= deltaTime;
            levelIntroduction.alpha = Math.max(0, levelIntroduction.timer / 4.0);
            
            if (levelIntroduction.timer <= 0) {
                return null;
            }
        }
        return levelIntroduction;
    }

    updateCompletionMessage(completionMessage, deltaTime) {
        if (completionMessage) {
            completionMessage.timer -= deltaTime;
            completionMessage.alpha = Math.max(0, completionMessage.timer / 2.5);
            
            if (completionMessage.timer <= 0) {
                return null;
            }
        }
        return completionMessage;
    }
}
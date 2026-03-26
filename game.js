const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 900;
canvas.height = 600;

let score = 0;
let shots = 0;
let mouseX = 450;
let mouseY = 300;
const electricBalls = [];
const targets = [];
const particles = [];

class ElectricBall {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.radius = 12;
        this.speed = 10;
        
        const angle = Math.atan2(targetY - y, targetX - x);
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        
        this.alive = true;
        this.electricArcs = [];
        this.glowIntensity = 1;
        this.trail = [];
    }

    update() {
        this.trail.unshift({ x: this.x, y: this.y, alpha: 1 });
        if (this.trail.length > 10) this.trail.pop();
        this.trail.forEach(t => t.alpha *= 0.85);

        this.x += this.vx;
        this.y += this.vy;

        this.electricArcs = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i + Math.random() * 0.5;
            const length = 15 + Math.random() * 20;
            this.electricArcs.push({
                angle: angle,
                length: length,
                branches: Math.random() > 0.5
            });
        }

        this.glowIntensity = 0.8 + Math.random() * 0.4;

        if (this.x < -50 || this.x > canvas.width + 50 || 
            this.y < -50 || this.y > canvas.height + 50) {
            this.alive = false;
        }
    }

    draw() {
        for (let i = this.trail.length - 1; i >= 0; i--) {
            const t = this.trail[i];
            ctx.beginPath();
            ctx.arc(t.x, t.y, this.radius * (1 - i * 0.08), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 200, 255, ${t.alpha * 0.3})`;
            ctx.fill();
        }

        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius * 3
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${0.8 * this.glowIntensity})`);
        gradient.addColorStop(0.2, `rgba(100, 200, 255, ${0.6 * this.glowIntensity})`);
        gradient.addColorStop(0.5, `rgba(0, 150, 255, ${0.3 * this.glowIntensity})`);
        gradient.addColorStop(1, 'rgba(0, 100, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = '#00ddff';
        ctx.lineWidth = 2;
        this.electricArcs.forEach(arc => {
            this.drawLightning(
                this.x, this.y,
                this.x + Math.cos(arc.angle) * arc.length,
                this.y + Math.sin(arc.angle) * arc.length,
                arc.branches
            );
        });

        const coreGradient = ctx.createRadialGradient(
            this.x - 3, this.y - 3, 0,
            this.x, this.y, this.radius
        );
        coreGradient.addColorStop(0, '#ffffff');
        coreGradient.addColorStop(0.3, '#aaeeff');
        coreGradient.addColorStop(0.7, '#00aaff');
        coreGradient.addColorStop(1, '#0066cc');
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = coreGradient;
        ctx.fill();
    }

    drawLightning(x1, y1, x2, y2, branch) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        
        const segments = 4;
        let px = x1, py = y1;
        
        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            let nx = x1 + (x2 - x1) * t;
            let ny = y1 + (y2 - y1) * t;
            
            if (i < segments) {
                nx += (Math.random() - 0.5) * 10;
                ny += (Math.random() - 0.5) * 10;
            }
            
            ctx.lineTo(nx, ny);
            
            if (branch && i === 2 && Math.random() > 0.5) {
                const bx = nx + (Math.random() - 0.5) * 15;
                const by = ny + (Math.random() - 0.5) * 15;
                ctx.moveTo(nx, ny);
                ctx.lineTo(bx, by);
                ctx.moveTo(nx, ny);
            }
            
            px = nx;
            py = ny;
        }
        
        ctx.strokeStyle = `rgba(150, 220, 255, ${0.6 + Math.random() * 0.4})`;
        ctx.lineWidth = 1 + Math.random();
        ctx.stroke();
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }
}

class Target {
    constructor() {
        this.radius = 25 + Math.random() * 20;
        this.x = this.radius + Math.random() * (canvas.width - this.radius * 2);
        this.y = this.radius + Math.random() * (canvas.height * 0.6 - this.radius);
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = (Math.random() - 0.5) * 2;
        this.alive = true;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.hue = Math.random() * 60 + 10;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulsePhase += 0.1;

        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
            this.vx *= -1;
            this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        }
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height * 0.7) {
            this.vy *= -1;
            this.y = Math.max(this.radius, Math.min(canvas.height * 0.7 - this.radius, this.y));
        }
    }

    draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.2 + 1;
        
        const glowGradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius * 2 * pulse
        );
        glowGradient.addColorStop(0, `hsla(${this.hue}, 100%, 50%, 0.4)`);
        glowGradient.addColorStop(0.5, `hsla(${this.hue}, 100%, 40%, 0.2)`);
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        for (let i = 3; i >= 0; i--) {
            const ringRadius = this.radius * (1 - i * 0.2);
            const gradient = ctx.createRadialGradient(
                this.x - ringRadius * 0.3, this.y - ringRadius * 0.3, 0,
                this.x, this.y, ringRadius
            );
            
            const lightness = 50 + i * 10;
            gradient.addColorStop(0, `hsl(${this.hue}, 100%, ${lightness + 20}%)`);
            gradient.addColorStop(0.7, `hsl(${this.hue}, 100%, ${lightness}%)`);
            gradient.addColorStop(1, `hsl(${this.hue}, 80%, ${lightness - 20}%)`);
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, ringRadius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            if (i > 0) {
                ctx.strokeStyle = `hsla(${this.hue}, 100%, 30%, 0.5)`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }

    checkCollision(ball) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + ball.radius;
    }
}

class DuckTarget {
    constructor() {
        this.width = 50;
        this.height = 40;
        this.radius = 25;
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.x = this.direction === 1 ? -this.width : canvas.width + this.width;
        this.y = 50 + Math.random() * (canvas.height * 0.5);
        this.vx = (2 + Math.random() * 2) * this.direction;
        this.vy = 0;
        this.alive = true;
        this.bobPhase = Math.random() * Math.PI * 2;
        this.wingPhase = 0;
        this.hue = 35;
    }

    update() {
        this.x += this.vx;
        this.bobPhase += 0.08;
        this.wingPhase += 0.3;
        this.vy = Math.sin(this.bobPhase) * 0.5;
        this.y += this.vy;

        if ((this.direction === 1 && this.x > canvas.width + this.width * 2) ||
            (this.direction === -1 && this.x < -this.width * 2)) {
            this.alive = false;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.direction === 1) ctx.scale(-1, 1);

        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(0, 0, 25, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#5D2E0C';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.ellipse(-30, -5, 15, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#145214';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(-42, -5);
        ctx.lineTo(-52, -3);
        ctx.lineTo(-52, -7);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-35, -10, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-36, -11, 1, 0, Math.PI * 2);
        ctx.fill();

        const wingFlap = Math.sin(this.wingPhase) * 15;
        ctx.fillStyle = '#6B3E0A';
        ctx.beginPath();
        ctx.ellipse(5, -10 + wingFlap * 0.3, 12, 8, -0.3 + wingFlap * 0.02, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    checkCollision(ball) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + ball.radius;
    }
}

class RobotTarget {
    constructor() {
        this.width = 40;
        this.height = 50;
        this.radius = 25;
        this.x = this.width + Math.random() * (canvas.width - this.width * 2);
        this.y = this.height + Math.random() * (canvas.height * 0.5);
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.alive = true;
        this.antennaPhase = Math.random() * Math.PI * 2;
        this.eyeGlow = 0;
        this.hue = 200;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.antennaPhase += 0.15;
        this.eyeGlow = (Math.sin(this.antennaPhase * 2) + 1) * 0.5;

        if (this.x - this.width/2 < 0 || this.x + this.width/2 > canvas.width) {
            this.vx *= -1;
            this.x = Math.max(this.width/2, Math.min(canvas.width - this.width/2, this.x));
        }
        if (this.y - this.height/2 < 0 || this.y + this.height/2 > canvas.height * 0.65) {
            this.vy *= -1;
            this.y = Math.max(this.height/2, Math.min(canvas.height * 0.65 - this.height/2, this.y));
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.fillStyle = '#444';
        ctx.fillRect(-3, -35, 6, 10);
        const antennaGlow = (Math.sin(this.antennaPhase) + 1) * 0.5;
        ctx.beginPath();
        ctx.arc(0, -38, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, ${50 + antennaGlow * 200}, 50, ${0.5 + antennaGlow * 0.5})`;
        ctx.fill();
        ctx.shadowColor = '#ff3333';
        ctx.shadowBlur = 10 * antennaGlow;
        ctx.fill();
        ctx.shadowBlur = 0;

        const headGradient = ctx.createLinearGradient(-18, -25, 18, -25);
        headGradient.addColorStop(0, '#666');
        headGradient.addColorStop(0.5, '#888');
        headGradient.addColorStop(1, '#666');
        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.roundRect(-18, -28, 36, 28, 5);
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();

        const eyeColor = `rgb(${200 + this.eyeGlow * 55}, ${50 + this.eyeGlow * 50}, 50)`;
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.roundRect(-12, -22, 10, 8, 2);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(2, -22, 10, 8, 2);
        ctx.fill();
        
        ctx.fillStyle = eyeColor;
        ctx.shadowColor = eyeColor;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(-10, -20, 6, 4, 1);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(4, -20, 6, 4, 1);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#555';
        ctx.fillRect(-6, -8, 12, 4);

        const bodyGradient = ctx.createLinearGradient(-15, 0, 15, 0);
        bodyGradient.addColorStop(0, '#555');
        bodyGradient.addColorStop(0.5, '#777');
        bodyGradient.addColorStop(1, '#555');
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.roundRect(-15, 0, 30, 30, 4);
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#00aaff';
        ctx.shadowColor = '#00aaff';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(0, 15, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#666';
        ctx.fillRect(-22, 5, 7, 20);
        ctx.fillRect(15, 5, 7, 20);

        ctx.restore();
    }

    checkCollision(ball) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + ball.radius;
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 12;
        this.vy = (Math.random() - 0.5) * 12;
        this.radius = 2 + Math.random() * 4;
        this.color = color;
        this.alpha = 1;
        this.decay = 0.02 + Math.random() * 0.02;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    get alive() {
        return this.alpha > 0;
    }
}

function createExplosion(x, y, hue) {
    for (let i = 0; i < 30; i++) {
        particles.push(new Particle(x, y, `hsl(${hue}, 100%, ${50 + Math.random() * 30}%)`));
    }
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle(x, y, `hsl(200, 100%, ${70 + Math.random() * 30}%)`));
    }
}

function spawnTarget() {
    if (targets.length < 8) {
        const rand = Math.random();
        if (rand < 0.33) {
            targets.push(new Target());
        } else if (rand < 0.66) {
            targets.push(new DuckTarget());
        } else {
            targets.push(new RobotTarget());
        }
    }
}

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const gunX = canvas.width / 2;
    const gunY = canvas.height - 20;
    const angle = Math.atan2(clickY - gunY, clickX - gunX) + Math.PI / 2;
    const clampedAngle = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, angle));
    const muzzleX = gunX + Math.sin(clampedAngle) * 95;
    const muzzleY = gunY - Math.cos(clampedAngle) * 95;
    
    electricBalls.push(new ElectricBall(muzzleX, muzzleY, clickX, clickY));
    shots++;
    document.getElementById('shots').textContent = shots;
});

let gunAnimTime = 0;

function drawShooter() {
    const x = canvas.width / 2;
    const y = canvas.height - 20;
    
    gunAnimTime += 0.1;
    
    const angle = Math.atan2(mouseY - y, mouseX - x) + Math.PI / 2;
    const clampedAngle = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, angle));
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(clampedAngle);

    const outerGlow = ctx.createRadialGradient(0, -50, 0, 0, -50, 80);
    outerGlow.addColorStop(0, 'rgba(0, 150, 255, 0.15)');
    outerGlow.addColorStop(0.5, 'rgba(0, 100, 255, 0.05)');
    outerGlow.addColorStop(1, 'rgba(0, 50, 255, 0)');
    ctx.beginPath();
    ctx.arc(0, -50, 80, 0, Math.PI * 2);
    ctx.fillStyle = outerGlow;
    ctx.fill();

    const gunGradient = ctx.createLinearGradient(-18, -60, 18, -60);
    gunGradient.addColorStop(0, '#0a0a15');
    gunGradient.addColorStop(0.2, '#1a1a2e');
    gunGradient.addColorStop(0.5, '#252545');
    gunGradient.addColorStop(0.8, '#1a1a2e');
    gunGradient.addColorStop(1, '#0a0a15');

    ctx.beginPath();
    ctx.roundRect(-16, -75, 32, 60, 6);
    ctx.fillStyle = gunGradient;
    ctx.fill();
    ctx.strokeStyle = '#0066aa';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.strokeStyle = '#003366';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-12, -70, 24, 50, 4);
    ctx.stroke();

    ctx.fillStyle = '#111122';
    ctx.beginPath();
    ctx.roundRect(-20, -95, 40, 25, 5);
    ctx.fill();
    ctx.strokeStyle = '#00aaff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#0a0a15';
    ctx.beginPath();
    ctx.roundRect(-14, -92, 28, 18, 3);
    ctx.fill();

    for (let i = 0; i < 3; i++) {
        const yPos = -88 + i * 6;
        const pulse = Math.sin(gunAnimTime * 3 + i * 0.8) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(0, 220, 255, ${pulse})`;
        ctx.shadowColor = '#00ddff';
        ctx.shadowBlur = 10 * pulse;
        ctx.beginPath();
        ctx.roundRect(-10, yPos, 20, 3, 1);
        ctx.fill();
    }
    ctx.shadowBlur = 0;

    const muzzlePulse = Math.sin(gunAnimTime * 4) * 0.3 + 0.7;
    const muzzleGlow = ctx.createRadialGradient(0, -95, 0, 0, -95, 35 * muzzlePulse);
    muzzleGlow.addColorStop(0, `rgba(150, 255, 255, ${0.9 * muzzlePulse})`);
    muzzleGlow.addColorStop(0.3, `rgba(0, 220, 255, ${0.6 * muzzlePulse})`);
    muzzleGlow.addColorStop(0.6, `rgba(0, 150, 255, ${0.3 * muzzlePulse})`);
    muzzleGlow.addColorStop(1, 'rgba(0, 100, 255, 0)');
    ctx.beginPath();
    ctx.arc(0, -95, 35, 0, Math.PI * 2);
    ctx.fillStyle = muzzleGlow;
    ctx.fill();

    ctx.strokeStyle = `rgba(100, 200, 255, ${0.5 + Math.random() * 0.3})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
        const arcAngle = (Math.PI * 2 / 4) * i + gunAnimTime;
        const startX = Math.cos(arcAngle) * 8;
        const startY = -95 + Math.sin(arcAngle) * 8;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        const midX = startX + (Math.random() - 0.5) * 10;
        const midY = startY - 10 + (Math.random() - 0.5) * 5;
        const endX = (Math.random() - 0.5) * 20;
        const endY = -110 - Math.random() * 10;
        ctx.lineTo(midX, midY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }

    const handleGradient = ctx.createLinearGradient(-15, 0, 15, 0);
    handleGradient.addColorStop(0, '#0a0a15');
    handleGradient.addColorStop(0.3, '#1a1a30');
    handleGradient.addColorStop(0.5, '#202040');
    handleGradient.addColorStop(0.7, '#1a1a30');
    handleGradient.addColorStop(1, '#0a0a15');

    ctx.beginPath();
    ctx.moveTo(-12, -15);
    ctx.lineTo(-16, 30);
    ctx.quadraticCurveTo(-16, 35, -12, 35);
    ctx.lineTo(12, 35);
    ctx.quadraticCurveTo(16, 35, 16, 30);
    ctx.lineTo(12, -15);
    ctx.closePath();
    ctx.fillStyle = handleGradient;
    ctx.fill();
    ctx.strokeStyle = '#0066aa';
    ctx.lineWidth = 2;
    ctx.stroke();

    for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#0a0a15';
        ctx.fillRect(-10, 5 + i * 7, 20, 4);
    }

    const corePulse = Math.sin(gunAnimTime * 2) * 0.4 + 0.6;
    
    ctx.fillStyle = '#0a0a20';
    ctx.beginPath();
    ctx.arc(0, -45, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0066aa';
    ctx.lineWidth = 2;
    ctx.stroke();

    const coreGlow = ctx.createRadialGradient(0, -45, 0, 0, -45, 10);
    coreGlow.addColorStop(0, `rgba(200, 255, 255, ${corePulse})`);
    coreGlow.addColorStop(0.4, `rgba(0, 200, 255, ${0.8 * corePulse})`);
    coreGlow.addColorStop(0.7, `rgba(0, 100, 255, ${0.4 * corePulse})`);
    coreGlow.addColorStop(1, 'rgba(0, 50, 255, 0)');
    ctx.beginPath();
    ctx.arc(0, -45, 10, 0, Math.PI * 2);
    ctx.fillStyle = coreGlow;
    ctx.shadowColor = '#00ddff';
    ctx.shadowBlur = 15 * corePulse;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = `rgba(0, 200, 255, ${0.3 + corePulse * 0.4})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
        const boltY = -60 + i * 8;
        ctx.beginPath();
        ctx.moveTo(-8, boltY);
        for (let j = 0; j < 4; j++) {
            const px = -8 + (16 / 4) * (j + 1);
            const py = boltY + (Math.random() - 0.5) * 6;
            ctx.lineTo(px, py);
        }
        ctx.stroke();
    }

    ctx.fillStyle = '#00ccff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 8;
    const indicatorPulse = Math.sin(gunAnimTime * 5) > 0 ? 1 : 0.3;
    ctx.globalAlpha = indicatorPulse;
    ctx.beginPath();
    ctx.arc(-10, -65, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, -65, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    ctx.restore();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawShooter();

    targets.forEach(target => {
        target.update();
        target.draw();
    });

    electricBalls.forEach(ball => {
        ball.update();
        ball.draw();
    });

    electricBalls.forEach(ball => {
        targets.forEach(target => {
            if (ball.alive && target.alive && target.checkCollision(ball)) {
                ball.alive = false;
                target.alive = false;
                score += 10;
                document.getElementById('score').textContent = score;
                createExplosion(target.x, target.y, target.hue);
            }
        });
    });

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    for (let i = electricBalls.length - 1; i >= 0; i--) {
        if (!electricBalls[i].alive) electricBalls.splice(i, 1);
    }
    for (let i = targets.length - 1; i >= 0; i--) {
        if (!targets[i].alive) targets.splice(i, 1);
    }
    for (let i = particles.length - 1; i >= 0; i--) {
        if (!particles[i].alive) particles.splice(i, 1);
    }

    requestAnimationFrame(gameLoop);
}

targets.push(new Target());
targets.push(new Target());
targets.push(new DuckTarget());
targets.push(new DuckTarget());
targets.push(new RobotTarget());
targets.push(new RobotTarget());

setInterval(spawnTarget, 2000);

gameLoop();

// deleuzian vector fields brrrrr
// Shared state for interactions
const sharedState = {
    vectorFieldActive: false,
    particlesActive: false,
    getVectorAt: null
};

document.addEventListener('DOMContentLoaded', function() {
    // Apply site-wide configuration variables
    applyConfigVariables();
    
    // Initialize particle system
    initParticleSystem();
    
    // Initialize vector field
    initVectorField();
    
    // Simple hover effect for navigation links
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.fontStyle = 'italic';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.fontStyle = 'normal';
        });
    });
    
    // Add a simple "last updated" date to the footer
    const footer = document.querySelector('footer');
    const lastUpdated = document.createElement('p');
    const currentDate = new Date();
    lastUpdated.textContent = `Last updated: ${currentDate.toLocaleDateString()}`;
    lastUpdated.style.marginTop = '10px';
    lastUpdated.style.fontSize = '0.8em';
    footer.appendChild(lastUpdated);
});

// Function to apply configuration variables across the site
function applyConfigVariables() {
    // Check if siteConfig exists (it should be loaded from config.js)
    if (typeof siteConfig === 'undefined') {
        console.error('Site configuration not found. Make sure config.js is loaded before script.js');
        return;
    }
    
    // Set page title if not already custom set
    if (document.title === 'Minimalist Website' || document.title.endsWith('- Minimalist Website')) {
        const pageName = document.title.replace(' - Minimalist Website', '');
        document.title = pageName ? `${pageName} - ${siteConfig.siteName}` : siteConfig.siteName;
    }
    
    // Update copyright in footer
    const footerCopyright = document.querySelector('footer p');
    if (footerCopyright && footerCopyright.textContent.includes('')) {
        footerCopyright.textContent = ` ${siteConfig.copyright}`;
    }
    
    // Update site tagline if it exists
    const taglineElement = document.querySelector('.art-caption p');
    if (taglineElement) {
        taglineElement.textContent = siteConfig.siteTagline;
    }
    
    // Process all elements with data-config attributes
    const configElements = document.querySelectorAll('[data-config]');
    configElements.forEach(element => {
        const configPath = element.getAttribute('data-config').split('.');
        let value = siteConfig;
        
        // Navigate through the config object using the path
        for (const key of configPath) {
            if (value && value[key] !== undefined) {
                value = value[key];
            } else {
                console.warn(`Config path ${element.getAttribute('data-config')} not found`);
                value = null;
                break;
            }
        }
        
        // Apply the value if found
        if (value !== null) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = value;
            } else {
                element.textContent = value;
            }
        }
    });
}

// Particle system
function initParticleSystem() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particleCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    let animationId;
    let isActive = false;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    class Particle {
        constructor(x, y) {
            this.x = x !== undefined ? x : Math.random() * canvas.width; // if x is passed, then use it, otherwise use a random x
            this.y = y !== undefined ? y : Math.random() * canvas.height;

            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            
            this.radius = Math.random() * 2 + 1.5;
            const alpha = Math.random() * 0.2 + 0.4; // transparency between 0.3 to 0.8
            this.color = `hsla(${Math.random() * 60 + 200}, 100%, ${Math.random() * 30 + 50}%, ${alpha})`;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // bounce.
            if (this.x < 0 || this.x > canvas.width) {
                this.vx *= -1;
                this.x = Math.max(0, Math.min(canvas.width, this.x));
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.vy *= -1;
                this.y = Math.max(0, Math.min(canvas.height, this.y));
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        if (isActive) {
            animationId = requestAnimationFrame(animate);
        }
    }
    
    const toggle = document.getElementById('particleToggle');
    if (toggle) {
        toggle.addEventListener('change', function() {
            isActive = this.checked;
            
            if (isActive) {
                animate();
            } else {
                cancelAnimationFrame(animationId);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.length = 0;
            }
        });
    }
    
    document.addEventListener('mousemove', function(e) {
        if (isActive) {
            particles.push(new Particle(e.clientX, e.clientY));
            if (particles.length > 100) {
                particles.shift();
            }
        }
    });
}

// Vector field visualization
function initVectorField() {
    const canvas = document.createElement('canvas');
    canvas.id = 'vectorCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9998';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let isActive = false;
    // 1. Increased Density: Smaller grid size means more arrows
    const gridSize = 25; 
    const attractors = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    class Attractor {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.strength = (Math.random() - 0.5) * 2;
            // 2. Updated Colors: Purple base with Green accents handled in drawing
            this.color = this.strength > 0 ? '#8b5cf6' : '#10b981'; // Purple or Green
            
            const angle = Math.random() * Math.PI * 2;
            // 3. Smoother Motion: Slower, drifting attractors
            const speed = Math.random() * 0.3 + 0.1;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) {
                this.vx *= -1;
                this.x = Math.max(0, Math.min(canvas.width, this.x));
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.vy *= -1;
                this.y = Math.max(0, Math.min(canvas.height, this.y));
            }
        }
    }
    
    function getVectorAt(x, y) {
        let vx = 0;
        let vy = 0;
        
        attractors.forEach(attractor => {
            const dx = attractor.x - x;
            const dy = attractor.y - y;
            // Add a small epsilon to prevent division by zero
            const dist = Math.sqrt(dx * dx + dy * dy) + 10; 
            
            // Inverse square law for more natural field drop-off
            const force = (attractor.strength * 500) / (dist);
            
            vx += (dx / dist) * force;
            vy += (dy / dist) * force;
        });
        
        const mag = Math.sqrt(vx * vx + vy * vy);
        // Limit maximum vector length for visual consistency
        if (mag > 0) {
            const limit = 15;
            const scale = Math.min(mag, limit) / mag;
            vx *= scale;
            vy *= scale;
        }
        
        return { vx, vy, mag };
    }
    
    function drawVector(x, y, vx, vy, mag) {
        // 3. Flow Lines: Draw curved paths instead of straight lines
        // Use the vector to determine control point for a quadratic curve
        
        const arrowLen = Math.min(mag * 1.5, 20); // Variable length based on strength
        if (arrowLen < 2) return; // Don't draw tiny noise

        const angle = Math.atan2(vy, vx);
        
        // 2. Color Scheme:
        // 15% chance for green accent, otherwise purple gradient
        // Use a deterministic "random" based on position so it doesn't flicker
        const isGreen = (Math.sin(x * y) > 0.7); 
        
        let color;
        if (isGreen) {
             // Subtle Green (#10b981)
            color = `hsla(160, 84%, 39%, ${Math.min(mag / 10 + 0.15, 0.4)})`;
        } else {
            // Purple Gradient (#b794f6 to #8b5cf6) - Hue 260 to 270
            const hue = 260 + (mag * 2); 
            const opacity = Math.min(mag / 15 + 0.15, 0.4); // Vary opacity for depth
            color = `hsla(${hue}, 80%, 70%, ${opacity})`;
        }
        
        ctx.strokeStyle = color;
        ctx.lineWidth = isGreen ? 1.5 : 1; // Slight emphasis on green arrows
        
        ctx.beginPath();
        
        // Curved body of the arrow
        const endX = x + vx * 1.2;
        const endY = y + vy * 1.2;
        
        // Simple curve approximation
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + vx * 0.5 + vy * 0.2, y + vy * 0.5 - vx * 0.2, endX, endY);
        ctx.stroke();
        
        // Arrowhead
        const headLen = arrowLen * 0.25;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
            endX - headLen * Math.cos(angle - Math.PI / 6),
            endY - headLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(endX, endY);
        ctx.lineTo(
            endX - headLen * Math.cos(angle + Math.PI / 6),
            endY - headLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
    }
    
    function drawAttractors() {
        attractors.forEach(attractor => {
            ctx.beginPath();
            // 2. Green/Purple dots with glow
            ctx.arc(attractor.x, attractor.y, Math.abs(attractor.strength) * 3 + 2, 0, Math.PI * 2);
            ctx.fillStyle = attractor.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = attractor.color;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        attractors.forEach(attractor => attractor.update());
        
        // Use a seeded random or noise for "jitter" if desired, 
        // but here we stick to the grid for clean flow
        for (let x = gridSize / 2; x < canvas.width; x += gridSize) {
            for (let y = gridSize / 2; y < canvas.height; y += gridSize) {
                // Add slight position jitter for organic feel
                const jitterX = (Math.sin(y) * 5);
                const jitterY = (Math.cos(x) * 5);
                
                const { vx, vy, mag } = getVectorAt(x + jitterX, y + jitterY);
                drawVector(x + jitterX, y + jitterY, vx, vy, mag);
            }
        }
        
        drawAttractors();
        
        if (isActive) {
            animationId = requestAnimationFrame(animate);
        }
    }
    
    const toggle = document.getElementById('vectorToggle');
    
    function updateState() {
        isActive = toggle.checked;
        
        if (isActive) {
            // Only re-initialize attractors if we're starting fresh
            if (attractors.length === 0) {
                const numAttractors = Math.floor(Math.random() * 4) + 4;
                for (let i = 0; i < numAttractors; i++) {
                    attractors.push(new Attractor());
                }
            }
            // Avoid stacking animation frames
            if (!animationId) {
                animate();
            }
        } else {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            attractors.length = 0; // Optional: clear attractors on stop
        }
    }

    if (toggle) {
        // 1. Listen for changes
        toggle.addEventListener('change', updateState);
        
        // 2. Check immediately on load
        // This ensures if the box is checked by default (or browser cache), it runs.
        if (toggle.checked) {
            updateState();
        }
    }
}

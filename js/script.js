// Minimalist website JavaScript
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
            
            this.radius = Math.random() * 3 + 2;
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
    const gridSize = 30;
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
            this.color = this.strength > 0 ? '#4e00ea' : '#0ce7a9';
            
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 0.5 + 0.2;
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
            const dist = Math.sqrt(dx * dx + dy * dy) + 1;
            const force = attractor.strength / (dist * 0.01);
            
            vx += (dx / dist) * force;
            vy += (dy / dist) * force;
        });
        
        const mag = Math.sqrt(vx * vx + vy * vy);
        if (mag > 0) {
            vx = (vx / mag) * Math.min(mag, 15);
            vy = (vy / mag) * Math.min(mag, 15);
        }
        
        return { vx, vy, mag };
    }
    
    function drawVector(x, y, vx, vy, mag) {
        const arrowLen = 10;
        const alpha = Math.min(mag / 20, 0.5);
        
        ctx.strokeStyle = `hsla(250, 100%, 60%, ${alpha})`;
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + vx, y + vy);
        ctx.stroke();
        
        const angle = Math.atan2(vy, vx);
        ctx.beginPath();
        ctx.moveTo(x + vx, y + vy);
        ctx.lineTo(
            x + vx - arrowLen * Math.cos(angle - Math.PI / 6),
            y + vy - arrowLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(x + vx, y + vy);
        ctx.lineTo(
            x + vx - arrowLen * Math.cos(angle + Math.PI / 6),
            y + vy - arrowLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
    }
    
    function drawAttractors() {
        attractors.forEach(attractor => {
            ctx.beginPath();
            ctx.arc(attractor.x, attractor.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = attractor.color;
            ctx.fill();
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        attractors.forEach(attractor => attractor.update());
        
        for (let x = gridSize; x < canvas.width; x += gridSize) {
            for (let y = gridSize; y < canvas.height; y += gridSize) {
                const { vx, vy, mag } = getVectorAt(x, y);
                drawVector(x, y, vx, vy, mag);
            }
        }
        
        drawAttractors();
        
        if (isActive) {
            animationId = requestAnimationFrame(animate);
        }
    }
    
    const toggle = document.getElementById('vectorToggle');
    if (toggle) {
        toggle.addEventListener('change', function() {
            isActive = this.checked;
            
            if (isActive) {
                attractors.length = 0;
                const numAttractors = Math.floor(Math.random() * 3) + 3;
                for (let i = 0; i < numAttractors; i++) {
                    attractors.push(new Attractor());
                }
                animate();
            } else {
                cancelAnimationFrame(animationId);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        });
    }
}

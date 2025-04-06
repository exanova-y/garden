// Minimalist website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Apply site-wide configuration variables
    applyConfigVariables();
    
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

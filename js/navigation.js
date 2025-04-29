// Dynamic navigation generation from config.js
document.addEventListener("DOMContentLoaded", function() {
    // Force navigation replacement regardless of existing content
    const navElement = document.querySelector('header nav ul');
    
    if (navElement && typeof siteConfig !== 'undefined') {
        // Clear existing navigation items completely
        navElement.innerHTML = '';
        
        // Calculate relative path prefix if in the pages directory
        let pathPrefix = '';
        if (window.location.pathname.includes('/pages/')) {
            pathPrefix = '../';
        }
        
        // Add navigation items from config
        siteConfig.navigation.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            
            // Handle root path specially
            let url = item.url;
            if (url === '/') {
                url = pathPrefix + 'index.html';
            } else {
                // Add the path prefix to relative URLs
                url = pathPrefix + url.replace(/^\//, '');
            }
            
            a.href = url;
            a.textContent = item.name;
            li.appendChild(a);
            navElement.appendChild(li);
        });
        
        // Log success for debugging
        console.log('Navigation generated dynamically from config');
    } else {
        console.error('Navigation element not found or siteConfig not defined');
    }
    
    // Update "Back to all posts" link to use config
    const backLink = document.querySelector('.post-navigation a.back-link');
    if (backLink && typeof siteConfig !== 'undefined') {
        // Find chronological page URL from config
        const chronologicalItem = siteConfig.navigation.find(item => item.name === "chronological");
        if (chronologicalItem) {
            let pathPrefix = '';
            if (window.location.pathname.includes('/pages/')) {
                pathPrefix = '../';
            }
            
            // Update href with the config URL
            let url = chronologicalItem.url;
            if (url === '/') {
                url = pathPrefix + 'index.html';
            } else {
                url = pathPrefix + url.replace(/^\//, '');
            }
            
            backLink.href = url;
            console.log('Back link updated to: ' + url);
        }
    }
});

/**
 * Main JavaScript for Digital Security for Seniors website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get current page URL to highlight active nav item
    highlightCurrentNavItem();
    
    // Add smooth scrolling for anchor links
    addSmoothScrolling();
});

/**
 * Highlights the current page in the navigation menu
 */
function highlightCurrentNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        // Remove active class from all links
        link.classList.remove('active');
        
        // Get href attribute
        const linkPath = link.getAttribute('href');
        
        // Check if this link matches the current page
        if (currentPath.endsWith(linkPath) || 
           (currentPath === '/' && linkPath === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

/**
 * Adds smooth scrolling behavior to anchor links
 */
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            // Smooth scroll to element
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Set focus to target element
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus();
        });
    });
}

/**
 * Detects user's preferred color scheme and applies it
 */
function detectColorSchemePreference() {
    // Check if user has a saved preference first
    const savedPreference = localStorage.getItem('colorScheme');
    
    if (savedPreference) {
        document.documentElement.setAttribute('data-color-scheme', savedPreference);
        return;
    }
    
    // Otherwise check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-color-scheme', 'dark');
    } else {
        document.documentElement.setAttribute('data-color-scheme', 'light');
    }
}

// Listen for changes to color scheme preference
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', detectColorSchemePreference);
}

// Initial detection
detectColorSchemePreference();
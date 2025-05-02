/**
 * Accessibility controls for Digital Security for Seniors website
 * Includes: 
 * - Font size adjustment
 * - High contrast mode toggle
 * - Focus management
 */

document.addEventListener('DOMContentLoaded', function() {
    // Importar utilitários de cookie (certifique-se de incluir o script cookie-utils.js antes deste)
    if (typeof setCookie !== 'function') {
        console.error('Cookie utilities not found. Make sure cookie-utils.js is loaded first.');
    }
    
    // Initialize accessibility settings from cookies if available
    initializeAccessibilitySettings();
    
    // Set up event listeners for accessibility controls
    setupAccessibilityControls();
    
    // Add skip link for keyboard navigation
    addSkipLink();
});

function initializeAccessibilitySettings() {
    // Check for saved font size preference
    const savedFontSize = getCookie('fontSize');
    if (savedFontSize) {
        document.documentElement.style.fontSize = savedFontSize;
    }
    
    // Check for saved contrast preference
    const highContrast = getCookie('highContrast') === 'true';
    if (highContrast) {
        document.body.classList.add('high-contrast');
    }
}

function setupAccessibilityControls() {
    // Font size increase button
    const fontSizeBtn = document.getElementById('font-size-increase');
    if (fontSizeBtn) {
        fontSizeBtn.addEventListener('click', function() {
            increaseFontSize();
        });
    }
    
    // Contrast toggle button
    const contrastBtn = document.getElementById('contrast-toggle');
    if (contrastBtn) {
        contrastBtn.addEventListener('click', function() {
            toggleContrast();
        });
    }
    
    // Add keyboard shortcut for accessibility features
    document.addEventListener('keydown', function(e) {
        // Alt + F to increase font size
        if (e.altKey && e.key === 'f') {
            e.preventDefault();
            increaseFontSize();
        }
        
        // Alt + C to toggle contrast
        if (e.altKey && e.key === 'c') {
            e.preventDefault();
            toggleContrast();
        }
    });
}

function increaseFontSize() {
    // Get current font size
    const currentSize = window.getComputedStyle(document.documentElement).fontSize;
    const currentSizeNum = parseFloat(currentSize);
    
    // Increase by 2px, but cap at 24px for readability
    let newSize;
    if (currentSizeNum < 24) {
        newSize = currentSizeNum + 2 + 'px';
    } else {
        // Reset to base size if already at max
        newSize = '18px'; 
    }
    
    // Apply new size
    document.documentElement.style.fontSize = newSize;
    
    // Save preference in cookie (30 dias de validade)
    setCookie('fontSize', newSize, 30);
    
    // Announce change to screen readers
    announceToScreenReader('Font size ' + (newSize === '18px' ? 'reset to default' : 'increased'));
}

function toggleContrast() {
    const isHighContrast = document.body.classList.toggle('high-contrast');
    
    // Save preference in cookie
    setCookie('highContrast', isHighContrast.toString(), 30);
    
    // Announce change to screen readers
    announceToScreenReader(isHighContrast ? 'High contrast mode enabled' : 'High contrast mode disabled');
}

function addSkipLink() {
    // Create skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    
    // Insert at beginning of body
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add id to main element
    const mainElement = document.querySelector('main');
    if (mainElement) {
        mainElement.id = 'main';
        mainElement.tabIndex = -1; // Make focusable for skip link
    }
}

function announceToScreenReader(message) {
    // Create or use existing aria-live region
    let announcer = document.getElementById('aria-announcer');
    
    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'aria-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only'; // Screen reader only
        document.body.appendChild(announcer);
        
        // Add style for screen reader only
        const style = document.createElement('style');
        style.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Set the message
    announcer.textContent = message;
}
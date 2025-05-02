/**
 * Theme Manager - Gerencia o tema globalmente para todo o site
 * Este script é responsável por sincronizar as preferências de tema em todas as páginas
 */

document.addEventListener('DOMContentLoaded', function() {
    // Carrega tema e configura os botões de alternância
    setupThemeToggle();
    
    // Configura as opções de tamanho de fonte
    setupFontSizeOptions();
    
    // Configura as opções de modo de contraste
    setupContrastModeOptions();
    
    // Destacar item atual na navegação
    highlightCurrentNavItem();
});

/**
 * Configura a alternância de tema
 */
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', function() {
        // Verifica o tema atual
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Altera o tema
        document.documentElement.setAttribute('data-theme', newTheme);
        document.body.setAttribute('data-theme', newTheme);
        
        // Salva a preferência de forma global
        setCookie('theme', newTheme, 30, true, 'Lax');
        
        // Atualiza o ícone
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    });
    
    // Aplica o tema atual ao botão
    updateThemeButtonIcon();
}

/**
 * Atualiza o ícone do botão de tema com base no tema atual
 */
function updateThemeButtonIcon() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    const icon = themeToggle.querySelector('i');
    if (icon) {
        icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

/**
 * Configura as opções de tamanho de fonte
 */
function setupFontSizeOptions() {
    document.querySelectorAll('.font-size-option').forEach(button => {
        button.addEventListener('click', function() {
            const size = this.getAttribute('data-size');
            
            // Remove classes anteriores
            document.body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
            
            // Adiciona nova classe
            document.body.classList.add('font-size-' + size);
            
            // Atualiza botão ativo
            document.querySelectorAll('.font-size-option').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-size') === size);
            });
            
            // Salva a preferência globalmente
            setCookie('fontSize', size, 30, true, 'Lax');
        });
    });
    
    // Atualiza botões ativos com base nas configurações atuais
    const currentSize = getCookie('fontSize') || 'medium';
    document.querySelectorAll('.font-size-option').forEach(button => {
        button.classList.toggle('active', button.getAttribute('data-size') === currentSize);
    });
}

/**
 * Configura as opções de modo de contraste
 */
function setupContrastModeOptions() {
    document.querySelectorAll('.contrast-mode-option').forEach(button => {
        button.addEventListener('click', function() {
            const mode = this.getAttribute('data-mode');
            
            // Define o tema
            const newTheme = mode === 'dark' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            document.body.setAttribute('data-theme', newTheme);
            
            // Atualiza botão ativo
            document.querySelectorAll('.contrast-mode-option').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
            });
            
            // Salva a preferência globalmente
            setCookie('theme', newTheme, 30, true, 'Lax');
            
            // Atualiza o ícone do botão de tema
            updateThemeButtonIcon();
        });
    });
    
    // Destaca botões ativos com base nas configurações atuais
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    document.querySelectorAll('.contrast-mode-option').forEach(button => {
        button.classList.toggle('active', button.getAttribute('data-mode') === (currentTheme === 'dark' ? 'dark' : 'normal'));
    });
}

/**
 * Destaca o item atual na navegação
 */
function highlightCurrentNavItem() {
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('nav a').forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (currentPage === linkPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}
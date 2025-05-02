/**
 * Theme Loader - Carrega o tema global consistentemente em todas as páginas
 * Este script deve ser incluído em todas as páginas e executado imediatamente
 */

// Função autoexecutável que aplica o tema imediatamente
(function() {
    // Verifica se a API de cookies está disponível
    if (typeof getCookie !== 'function') {
        console.warn('Cookie API not available, using localStorage as fallback');
        
        // Tenta carregar o tema do localStorage como fallback
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.setAttribute('data-theme', savedTheme);
        }
        return;
    }
    
    // Carrega o tema do cookie
    const savedTheme = getCookie('theme');
    if (savedTheme) {
        // Aplicar tema imediatamente, sem esperar pelo DOMContentLoaded
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Também aplicar no body para compatibilidade com os estilos existentes
        if (document.body) {
            document.body.setAttribute('data-theme', savedTheme);
        } else {
            // Se o body ainda não estiver disponível, usar MutationObserver
            const observer = new MutationObserver(function(mutations) {
                if (document.body) {
                    document.body.setAttribute('data-theme', savedTheme);
                    observer.disconnect();
                }
            });
            
            observer.observe(document.documentElement, { 
                childList: true, 
                subtree: true 
            });
        }
    }
    
    // Também carregar preferência de tamanho de fonte
    const savedFontSize = getCookie('fontSize');
    if (savedFontSize && document.documentElement) {
        // Aplicar tamanho de fonte imediatamente
        document.documentElement.style.fontSize = savedFontSize;
    }
})();
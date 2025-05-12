/**
 * Script para melhorar a experiência do usuário
 * Este script adiciona funcionalidades avançadas de UX:
 * - Animações de carregamento suave
 * - Sistema de interações modernas
 * - Feedback visual e tátil
 * - Navegação facilitada
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas as funcionalidades
    initializeUXEnhancements();
});

/**
 * Inicializa todas as melhorias de UX
 */
function initializeUXEnhancements() {
    setupSmoothScroll();
    setupImageLazyLoading();
    generateBreadcrumbs();
    setupTooltips();
    enhanceNavigation();
    setupScrollReveal();
    setupFeedbackSystem();
}

/**
 * Configura rolagem suave para links internos
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Rolar suavemente para o elemento
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Atualizar URL sem recarregar a página
                history.pushState(null, null, targetId);
                
                // Adicionar foco ao elemento para acessibilidade
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                
                // Anunciar para leitores de tela
                announceToScreenReader(`Navegou para seção: ${targetElement.textContent.trim() || targetId.substring(1)}`);
            }
        });
    });
}

/**
 * Configura carregamento suave de imagens
 */
function setupImageLazyLoading() {
    // Envolver imagens em divs para efeito de carregamento
    document.querySelectorAll('img:not(.loaded)').forEach(img => {
        // Se a imagem já estiver em um wrapper, pular
        if (img.parentElement.classList.contains('image-wrapper')) return;
        
        // Criar wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'image-wrapper';
        
        // Substituir imagem com wrapper
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        
        // Adicionar placeholder de esqueleto
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton';
        skeleton.style.width = '100%';
        skeleton.style.height = img.height || '200px';
        wrapper.insertBefore(skeleton, img);
        
        // Configurar observador de interseção
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Carregar a imagem quando visível
                    const targetImg = entry.target;
                    
                    // Garantir que src está definido
                    if (targetImg.dataset.src && !targetImg.src) {
                        targetImg.src = targetImg.dataset.src;
                    }
                    
                    // Mostrar imagem quando carregada
                    targetImg.onload = () => {
                        targetImg.classList.add('loaded');
                        // Remover skeleton após carregamento
                        const skeleton = targetImg.previousElementSibling;
                        if (skeleton && skeleton.classList.contains('skeleton')) {
                            skeleton.remove();
                        }
                    };
                    
                    // Parar de observar
                    observer.unobserve(targetImg);
                }
            });
        }, {
            rootMargin: '100px' // Começar a carregar quando estiver a 100px da viewport
        });
        
        observer.observe(img);
    });
}

/**
 * Gera breadcrumbs baseados na estrutura da página atual
 */
function generateBreadcrumbs() {
    const mainContent = document.querySelector('main');
    if (!mainContent) return;
    
    // Verificar se já existem breadcrumbs
    if (document.querySelector('.breadcrumbs')) return;
    
    const path = window.location.pathname;
    
    // Não mostrar breadcrumbs na página inicial
    if (path === '/' || path.endsWith('index.html')) return;
    
    const pathParts = path.split('/').filter(part => part);
    
    // Se não houver partes válidas na URL, sair
    if (pathParts.length === 0) return;
    
    // Criar elemento breadcrumbs
    const breadcrumbsList = document.createElement('ul');
    breadcrumbsList.className = 'breadcrumbs';
    
    // Adicionar link para a página inicial
    let homeLi = document.createElement('li');
    let homeLink = document.createElement('a');
    homeLink.href = '/';
    homeLink.textContent = 'Início';
    homeLi.appendChild(homeLink);
    breadcrumbsList.appendChild(homeLi);
    
    // Adicionar partes do caminho como links
    let currentPath = '';
    const lastIndex = pathParts.length - 1;
    
    pathParts.forEach((part, index) => {
        currentPath += '/' + part;
        
        const isLastItem = index === lastIndex;
        const partText = part.replace('.html', '').replace(/-/g, ' ');
        
        const partLi = document.createElement('li');
        
        if (isLastItem) {
            // Último item não é um link
            partLi.textContent = toTitleCase(partText);
        } else {
            const partLink = document.createElement('a');
            partLink.href = currentPath;
            partLink.textContent = toTitleCase(partText);
            partLi.appendChild(partLink);
        }
        
        breadcrumbsList.appendChild(partLi);
    });
    
    // Inserir no topo do conteúdo principal
    mainContent.insertBefore(breadcrumbsList, mainContent.firstChild);
}

/**
 * Configura tooltips informativos
 */
function setupTooltips() {
    // Adicionar tooltips em botões e links relevantes
    const buttonsWithIcons = document.querySelectorAll('button[aria-label], a[aria-label]');
    
    buttonsWithIcons.forEach(button => {
        const tooltip = button.getAttribute('aria-label');
        if (tooltip && !button.hasAttribute('data-tooltip')) {
            button.setAttribute('data-tooltip', tooltip);
        }
    });
}

/**
 * Melhora a navegação do site
 */
function enhanceNavigation() {
    // Destacar link atual no menu
    const currentPath = window.location.pathname;
    
    document.querySelectorAll('nav a').forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (linkPath) {
            const linkPathNormalized = linkPath.endsWith('/') ? linkPath : linkPath + '/'
            const currentPathNormalized = currentPath.endsWith('/') ? currentPath : currentPath + '/';
            
            if (currentPathNormalized.includes(linkPathNormalized) ||
                (currentPath.endsWith(linkPath) && linkPath !== '/')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        }
    });
    
    // Adicionar efeitos de hover no menu
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Configura animações de revelação ao rolar
 */
function setupScrollReveal() {
    const elementsToReveal = document.querySelectorAll('.feature-card, section, .intro h2, .intro p');
    
    // Criar observador de interseção
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adicionar classe para revelar com animação
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Revelar quando 10% do elemento estiver visível
        rootMargin: '0px 0px -50px 0px' // Offset negativo para acionar um pouco antes
    });
    
    // Adicionar estilo inicial e observar elementos
    elementsToReveal.forEach(element => {
        // Definir estilo inicial
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Observar elemento
        observer.observe(element);
    });
    
    // Adicionar estilo para elementos revelados
    const style = document.createElement('style');
    style.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);
}

/**
 * Configura feedback visual para interações
 */
function setupFeedbackSystem() {
    // Feedback para botões
    document.querySelectorAll('button, .button').forEach(button => {
        button.addEventListener('click', function() {
            // Adicionar animação de clique
            this.classList.add('button-clicked');
            
            // Remover classe após animação
            setTimeout(() => {
                this.classList.remove('button-clicked');
            }, 300);
        });
    });
    
    // Adicionar estilo para animação de clique
    const style = document.createElement('style');
    style.textContent = `
        .button-clicked {
            animation: buttonClickEffect 0.3s ease;
        }
        
        @keyframes buttonClickEffect {
            0% { transform: scale(1); }
            50% { transform: scale(0.95); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Anuncia mensagens para leitores de tela
 * @param {string} message - A mensagem a ser anunciada
 */
function announceToScreenReader(message) {
    // Criar ou usar região existente
    let announcer = document.getElementById('ux-announcer');
    
    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'ux-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only'; // Visível apenas para leitores de tela
        document.body.appendChild(announcer);
    }
    
    // Definir a mensagem
    announcer.textContent = message;
}

/**
 * Converte string para formato de título (primeira letra de cada palavra em maiúscula)
 * @param {string} str - String para converter
 * @returns {string} - String formatada em título
 */
function toTitleCase(str) {
    return str.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

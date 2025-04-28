/**
 * Script para a barra de acessibilidade
 * Este script gerencia as funcionalidades de acessibilidade:
 * - Tamanho de fonte ajustável
 * - Modos de contraste (normal, escuro, alto contraste)
 * - Navegação por teclado
 */

document.addEventListener('DOMContentLoaded', function() {
    // Criar o botão de acessibilidade e o menu
    createAccessibilityBar();
    
    // Inicializar as configurações salvas
    initializeSettings();
    
    // Adicionar listeners para botões de acessibilidade
    setupAccessibilityListeners();
    
    // Configurar navegação por teclado
    setupKeyboardNavigation();
});

/**
 * Cria e adiciona a barra de acessibilidade ao documento
 */
function createAccessibilityBar() {
    // Criar botão de acessibilidade
    const accessibilityButton = document.createElement('button');
    accessibilityButton.className = 'accessibility-button';
    accessibilityButton.setAttribute('aria-label', 'Abrir menu de acessibilidade');
    accessibilityButton.setAttribute('aria-expanded', 'false');
    accessibilityButton.innerHTML = '<i class="fas fa-universal-access"></i>';
    
    // Criar menu de acessibilidade
    const accessibilityMenu = document.createElement('div');
    accessibilityMenu.className = 'accessibility-menu';
    accessibilityMenu.setAttribute('role', 'dialog');
    accessibilityMenu.setAttribute('aria-labelledby', 'accessibility-title');
    
    // Conteúdo do menu
    accessibilityMenu.innerHTML = `
        <h3 id="accessibility-title">Opções de Acessibilidade</h3>
        
        <div class="accessibility-section">
            <h4>Tamanho do Texto</h4>
            <div class="option-buttons" role="group" aria-label="Tamanho da fonte">
                <button class="option-button font-size-option" data-size="small" aria-label="Fonte pequena">
                    <span class="font-small">A</span> Pequeno
                </button>
                <button class="option-button font-size-option" data-size="medium" aria-label="Fonte média">
                    <span class="font-medium">A</span> Médio
                </button>
                <button class="option-button font-size-option" data-size="large" aria-label="Fonte grande">
                    <span class="font-large">A</span> Grande
                </button>
            </div>
        </div>
        
        <div class="accessibility-section">
            <h4>Modo de Tema</h4>
            <div class="option-buttons" role="group" aria-label="Modo de tema">
                <button class="option-button contrast-mode-option" data-mode="normal" aria-label="Modo normal">
                    Claro
                    <div class="mode-preview preview-normal">Abc</div>
                </button>
                <button class="option-button contrast-mode-option" data-mode="dark" aria-label="Modo escuro">
                    Escuro
                    <div class="mode-preview preview-dark">Abc</div>
                </button>
            </div>
        </div>
    `;
    
    // Adicionar elementos ao documento
    document.body.appendChild(accessibilityButton);
    document.body.appendChild(accessibilityMenu);
}

/**
 * Inicializa as configurações de acessibilidade salvas
 */
function initializeSettings() {
    // Recuperar tamanho de fonte
    const savedFontSize = localStorage.getItem('accessibilityFontSize') || 'medium';
    setFontSize(savedFontSize);
    
    // Recuperar modo de tema
    const savedThemeMode = localStorage.getItem('accessibilityContrastMode') || 'normal';
    setContrastMode(savedThemeMode);
    
    // Atualizar visualmente os botões ativos
    updateActiveButtons();
}

/**
 * Atualiza os botões para mostrar quais estão ativos
 */
function updateActiveButtons() {
    // Recuperar configurações atuais
    const currentFontSize = localStorage.getItem('accessibilityFontSize') || 'medium';
    const currentContrastMode = localStorage.getItem('accessibilityContrastMode') || 'normal';
    
    // Atualizar botões de tamanho de fonte
    document.querySelectorAll('.font-size-option').forEach(button => {
        button.classList.toggle('active', button.getAttribute('data-size') === currentFontSize);
    });
    
    // Atualizar botões de modo de contraste
    document.querySelectorAll('.contrast-mode-option').forEach(button => {
        button.classList.toggle('active', button.getAttribute('data-mode') === currentContrastMode);
    });
}

/**
 * Configura os listeners para os botões de acessibilidade
 */
function setupAccessibilityListeners() {
    const accessibilityButton = document.querySelector('.accessibility-button');
    const accessibilityMenu = document.querySelector('.accessibility-menu');
    
    // Abrir/fechar menu ao clicar no botão
    accessibilityButton.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        accessibilityMenu.classList.toggle('active');
        
        // Anunciar para leitores de tela
        announceToScreenReader(isExpanded ? 'Menu de acessibilidade fechado' : 'Menu de acessibilidade aberto');
    });
    
    // Fechar menu ao clicar fora dele
    document.addEventListener('click', function(event) {
        if (!accessibilityMenu.contains(event.target) && 
            !accessibilityButton.contains(event.target) && 
            accessibilityMenu.classList.contains('active')) {
            accessibilityButton.setAttribute('aria-expanded', 'false');
            accessibilityMenu.classList.remove('active');
        }
    });
    
    // Listeners para botões de tamanho de fonte
    document.querySelectorAll('.font-size-option').forEach(button => {
        button.addEventListener('click', function() {
            const size = this.getAttribute('data-size');
            setFontSize(size);
            updateActiveButtons();
            announceToScreenReader(`Tamanho de fonte alterado para ${getDescricaoTamanho(size)}`);
        });
    });
    
    // Listeners para botões de modo de contraste
    document.querySelectorAll('.contrast-mode-option').forEach(button => {
        button.addEventListener('click', function() {
            const mode = this.getAttribute('data-mode');
            setContrastMode(mode);
            updateActiveButtons();
            announceToScreenReader(`Modo de contraste alterado para ${getDescricaoModo(mode)}`);
        });
    });
}

/**
 * Retorna a descrição do tamanho de fonte em português
 */
function getDescricaoTamanho(size) {
    switch(size) {
        case 'small': return 'pequeno';
        case 'medium': return 'médio';
        case 'large': return 'grande';
        default: return 'médio';
    }
}

/**
 * Retorna a descrição do modo de contraste em português
 */
function getDescricaoModo(mode) {
    switch(mode) {
        case 'normal': return 'normal';
        case 'dark': return 'escuro';
        case 'high-contrast': return 'alto contraste';
        default: return 'normal';
    }
}

/**
 * Configura a navegação por teclado
 */
function setupKeyboardNavigation() {
    // Shortcut Alt+A para abrir/fechar o menu
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 'a') {
            e.preventDefault();
            const accessibilityButton = document.querySelector('.accessibility-button');
            accessibilityButton.click();
        }
    });
}

/**
 * Define o tamanho da fonte
 * @param {string} size - 'small', 'medium', ou 'large'
 */
function setFontSize(size) {
    // Remover classes existentes
    document.body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    
    // Definir o tamanho base para o html
    let baseFontSize;
    switch(size) {
        case 'small':
            baseFontSize = '16px'; // Tamanho pequeno
            document.body.classList.add('font-size-small');
            break;
        case 'medium':
            baseFontSize = '18px'; // Tamanho médio (padrão)
            document.body.classList.add('font-size-medium');
            break;
        case 'large':
            baseFontSize = '22px'; // Tamanho grande
            document.body.classList.add('font-size-large');
            break;
        default:
            baseFontSize = '18px'; // Padrão
            document.body.classList.add('font-size-medium');
    }
    
    // Aplicar tamanho base
    document.documentElement.style.fontSize = baseFontSize;
    
    // Salvar preferência
    localStorage.setItem('accessibilityFontSize', size);
}

/**
 * Define o modo de contraste
 * @param {string} mode - 'normal', 'dark', ou 'high-contrast'
 */
function setContrastMode(mode) {
    // Remover classes de modo existentes
    document.body.classList.remove('dark-mode');
    
    // Aplicar novo modo
    switch(mode) {
        case 'dark':
            document.body.classList.add('dark-mode');
            break;
        // 'normal' não precisa de classe adicional
    }
    
    // Salvar preferência
    localStorage.setItem('accessibilityContrastMode', mode);
}

/**
 * Anuncia mensagens para leitores de tela
 * @param {string} message - A mensagem a ser anunciada
 */
function announceToScreenReader(message) {
    // Criar ou usar região existente
    let announcer = document.getElementById('accessibility-announcer');
    
    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'accessibility-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only'; // Visível apenas para leitores de tela
        document.body.appendChild(announcer);
    }
    
    // Definir a mensagem
    announcer.textContent = message;
}
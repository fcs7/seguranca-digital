/**
 * Acessibilidade Consolidada - Gerencia todas as funcionalidades de acessibilidade
 * Este arquivo consolida as funções dos arquivos:
 * - theme-loader.js
 * - theme-manager.js
 * - accessibility-bar.js
 * - accessibility.js
 */

/**
 * Carregador de Tema - Executa imediatamente para evitar flash de conteúdo
 * Aplicado antes do carregamento do DOM
 */
(function() {
    // Definições padrão
    const DEFAULT_THEME = 'light';
    const DEFAULT_FONT_SIZE = 'medium';
    
    // Verificar se a API de cookies está disponível
    if (typeof getCookie !== 'function') {
        console.warn('API de cookies não disponível, usando localStorage como fallback');
        applyFallbackSettings();
        return;
    }
    
    // Recuperar configurações salvas
    const savedTheme = getCookie('theme');
    const savedFontSize = getCookie('fonteSalva');
    
    // Aplicar o tema imediatamente
    const themeToApply = savedTheme || DEFAULT_THEME;
    document.documentElement.setAttribute('data-theme', themeToApply);
    
    // Aplicar no body se disponível
    if (document.body) {
        document.body.setAttribute('data-theme', themeToApply);
    } else {
        // Observer para aplicar quando o body estiver disponível
        const observer = new MutationObserver(function(mutations) {
            if (document.body) {
                document.body.setAttribute('data-theme', themeToApply);
                observer.disconnect();
            }
        });
        
        observer.observe(document.documentElement, { 
            childList: true, 
            subtree: true 
        });
    }
    
    // Aplicar tamanho de fonte
    const fontSizeToApply = savedFontSize || DEFAULT_FONT_SIZE;
    let baseFontSize = '18px'; // Tamanho médio por padrão
    
    if (fontSizeToApply === 'small') {
        baseFontSize = '16px';
    } else if (fontSizeToApply === 'large') {
        baseFontSize = '22px';
    }
    
    document.documentElement.style.fontSize = baseFontSize;
})();

/**
 * Aplicar configurações de fallback
 */
function applyFallbackSettings() {
    // Usar localStorage como fallback
    const getLocalStorage = (key, defaultValue) => {
        const value = localStorage.getItem(key);
        return value !== null ? value : defaultValue;
    };
    
    // Recuperar configurações salvas ou usar os padrões
    const theme = getLocalStorage('theme', 'light');
    const fontSize = getLocalStorage('fonteSalva', 'medium');
    
    // Aplicar tema
    document.documentElement.setAttribute('data-theme', theme);
    if (document.body) {
        document.body.setAttribute('data-theme', theme);
    }
    
    // Aplicar tamanho de fonte
    let baseFontSize = '18px';
    if (fontSize === 'small') {
        baseFontSize = '16px';
    } else if (fontSize === 'large') {
        baseFontSize = '22px';
    }
    document.documentElement.style.fontSize = baseFontSize;
}

/**
 * Salvar configuração no armazenamento
 */
function salvarConfig(chave, valor, dias = 30) {
    if (typeof setCookie === 'function') {
        setCookie(chave, valor, dias);
    } else {
        localStorage.setItem(chave, valor);
    }
}

/**
 * Recuperar configuração do armazenamento
 */
function recuperarConfig(chave, valorPadrao) {
    if (typeof getCookie === 'function') {
        const valor = getCookie(chave);
        return valor || valorPadrao;
    } else {
        const valor = localStorage.getItem(chave);
        return valor !== null ? valor : valorPadrao;
    }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Criar barra de acessibilidade se não existir
    const existingButton = document.querySelector('.accessibility-button');
    if (!existingButton) {
        criarBarraAcessibilidade();
    }
    
    // Configurações iniciais
    inicializarConfiguracoes();
    
    // Event listeners
    configurarEventListeners();
    
    // Navegação por teclado
    configurarNavegacaoTeclado();
    
    // Destacar item atual da navegação
    destacarItemNavegacaoAtual();
});

/**
 * Cria a barra de acessibilidade
 */
function criarBarraAcessibilidade() {
    // Criar botão de acessibilidade
    const botaoAcessibilidade = document.createElement('button');
    botaoAcessibilidade.className = 'accessibility-button';
    botaoAcessibilidade.setAttribute('aria-label', 'Abrir menu de acessibilidade');
    botaoAcessibilidade.setAttribute('aria-expanded', 'false');
    botaoAcessibilidade.innerHTML = '<i class="fas fa-universal-access"></i>';
    
    // Criar menu de acessibilidade
    const menuAcessibilidade = document.createElement('div');
    menuAcessibilidade.className = 'accessibility-menu';
    menuAcessibilidade.setAttribute('role', 'dialog');
    menuAcessibilidade.setAttribute('aria-labelledby', 'accessibility-title');
    
    // Conteúdo do menu
    menuAcessibilidade.innerHTML = `
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
                <button class="option-button contrast-mode-option" data-mode="normal" aria-label="Modo claro">
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
    
    // Adicionar ao documento
    document.body.appendChild(botaoAcessibilidade);
    document.body.appendChild(menuAcessibilidade);
}

/**
 * Inicializa as configurações
 */
function inicializarConfiguracoes() {
    // Recuperar tamanho de fonte
    const tamanhoFonte = recuperarConfig('fonteSalva', 'medium');
    definirTamanhoFonte(tamanhoFonte);
    
    // Recuperar tema
    const tema = recuperarConfig('theme', 'light');
    definirTema(tema === 'dark' ? 'dark' : 'normal');
    
    // Atualizar botões ativos
    atualizarBotoesAtivos();
    
    // Atualizar ícone do botão de tema
    atualizarIconeBotaoTema();
}

/**
 * Atualiza os botões para mostrar quais estão ativos
 */
function atualizarBotoesAtivos() {
    // Recuperar configurações atuais
    const tamanhoFonte = recuperarConfig('fonteSalva', 'medium');
    const tema = recuperarConfig('theme', 'light');
    const modoTema = tema === 'dark' ? 'dark' : 'normal';
    
    // Atualizar botões de tamanho de fonte
    document.querySelectorAll('.font-size-option').forEach(botao => {
        botao.classList.toggle('active', botao.getAttribute('data-size') === tamanhoFonte);
    });
    
    // Atualizar botões de tema
    document.querySelectorAll('.contrast-mode-option').forEach(botao => {
        botao.classList.toggle('active', botao.getAttribute('data-mode') === modoTema);
    });
}

/**
 * Atualiza o ícone do botão de tema
 */
function atualizarIconeBotaoTema() {
    const botaoTema = document.getElementById('theme-toggle');
    if (!botaoTema) return;
    
    const temaAtual = document.body.getAttribute('data-theme') || 'light';
    const icone = botaoTema.querySelector('i');
    if (icone) {
        icone.className = temaAtual === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

/**
 * Configura os event listeners
 */
function configurarEventListeners() {
    // Botão de tema
    const botaoTema = document.getElementById('theme-toggle');
    if (botaoTema) {
        botaoTema.addEventListener('click', function() {
            const temaAtual = document.body.getAttribute('data-theme') || 'light';
            const novoTema = temaAtual === 'light' ? 'dark' : 'light';
            definirTema(novoTema === 'dark' ? 'dark' : 'normal');
            atualizarIconeBotaoTema();
        });
    }
    
    // Botão de acessibilidade
    const botaoAcessibilidade = document.querySelector('.accessibility-button');
    const menuAcessibilidade = document.querySelector('.accessibility-menu');
    
    if (botaoAcessibilidade && menuAcessibilidade) {
        botaoAcessibilidade.addEventListener('click', function(evento) {
            evento.stopPropagation();
            
            const estaExpandido = this.getAttribute('aria-expanded') === 'true';
            const novoEstado = !estaExpandido;
            
            this.setAttribute('aria-expanded', novoEstado.toString());
            menuAcessibilidade.classList.toggle('active', novoEstado);
            
            anunciarParaLeitorTela(estaExpandido ? 'Menu de acessibilidade fechado' : 'Menu de acessibilidade aberto');
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', function(evento) {
            if (!menuAcessibilidade.contains(evento.target) && 
                !botaoAcessibilidade.contains(evento.target) && 
                menuAcessibilidade.classList.contains('active')) {
                botaoAcessibilidade.setAttribute('aria-expanded', 'false');
                menuAcessibilidade.classList.remove('active');
            }
        });
    }
    
    // Botões de tamanho de fonte
    document.querySelectorAll('.font-size-option').forEach(botao => {
        botao.addEventListener('click', function() {
            const tamanho = this.getAttribute('data-size');
            definirTamanhoFonte(tamanho);
            atualizarBotoesAtivos();
            anunciarParaLeitorTela(`Tamanho de fonte alterado para ${getDescricaoTamanho(tamanho)}`);
        });
    });
    
    // Botões de tema
    document.querySelectorAll('.contrast-mode-option').forEach(botao => {
        botao.addEventListener('click', function() {
            const modo = this.getAttribute('data-mode');
            definirTema(modo);
            atualizarBotoesAtivos();
            atualizarIconeBotaoTema();
            anunciarParaLeitorTela(`Modo de tema alterado para ${getDescricaoTema(modo)}`);
        });
    });
}

/**
 * Configura a navegação por teclado
 */
function configurarNavegacaoTeclado() {
    // Atalho Alt+A para abrir/fechar o menu
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 'a') {
            e.preventDefault();
            const botaoAcessibilidade = document.querySelector('.accessibility-button');
            if (botaoAcessibilidade) {
                botaoAcessibilidade.click();
            }
        }
    });
}

/**
 * Define o tamanho da fonte
 * @param {string} tamanho - 'small', 'medium', ou 'large'
 */
function definirTamanhoFonte(tamanho) {
    // Remover classes existentes
    document.body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    
    // Definir tamanho base para o html
    let tamanhoBase;
    switch(tamanho) {
        case 'small':
            tamanhoBase = '16px';
            document.body.classList.add('font-size-small');
            break;
        case 'medium':
            tamanhoBase = '18px';
            document.body.classList.add('font-size-medium');
            break;
        case 'large':
            tamanhoBase = '22px';
            document.body.classList.add('font-size-large');
            break;
        default:
            tamanhoBase = '18px';
            tamanho = 'medium';
            document.body.classList.add('font-size-medium');
    }
    
    // Aplicar tamanho base
    document.documentElement.style.fontSize = tamanhoBase;
    
    // Salvar preferência
    salvarConfig('fonteSalva', tamanho);
}

/**
 * Define o tema
 * @param {string} modo - 'normal' ou 'dark'
 */
function definirTema(modo) {
    // Define o tema
    const novoTema = modo === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', novoTema);
    document.body.setAttribute('data-theme', novoTema);
    
    // Salvar preferência
    salvarConfig('theme', novoTema);
}

/**
 * Anuncia mensagens para leitores de tela
 * @param {string} mensagem - A mensagem a ser anunciada
 */
function anunciarParaLeitorTela(mensagem) {
    // Criar ou usar região existente
    let anunciador = document.getElementById('accessibility-announcer');
    
    if (!anunciador) {
        anunciador = document.createElement('div');
        anunciador.id = 'accessibility-announcer';
        anunciador.setAttribute('aria-live', 'polite');
        anunciador.setAttribute('aria-atomic', 'true');
        anunciador.className = 'sr-only';
        document.body.appendChild(anunciador);
    }
    
    // Definir a mensagem
    anunciador.textContent = mensagem;
}

/**
 * Retorna a descrição do tamanho de fonte em português
 */
function getDescricaoTamanho(tamanho) {
    switch(tamanho) {
        case 'small': return 'pequeno';
        case 'medium': return 'médio';
        case 'large': return 'grande';
        default: return 'médio';
    }
}

/**
 * Retorna a descrição do tema em português
 */
function getDescricaoTema(modo) {
    switch(modo) {
        case 'normal': return 'claro';
        case 'dark': return 'escuro';
        default: return 'claro';
    }
}

/**
 * Destaca o item atual na navegação
 */
function destacarItemNavegacaoAtual() {
    const paginaAtual = window.location.pathname.split('/').pop();
    document.querySelectorAll('nav a').forEach(link => {
        const linkPagina = link.getAttribute('href').split('/').pop();
        if (paginaAtual === linkPagina || (paginaAtual === '' && linkPagina === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}
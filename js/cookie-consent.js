/**
 * Gerenciador de consentimento de cookies
 * Exibe uma notificação e gerencia o consentimento do usuário para o uso de cookies
 */

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o consentimento já foi dado
    if (!getCookie('cookieConsent')) {
        // Se não, mostrar a notificação
        showCookieConsent();
    }
});

/**
 * Exibe a notificação de consentimento de cookies
 */
function showCookieConsent() {
    // Criar o elemento de notificação
    const cookieConsent = document.createElement('div');
    cookieConsent.className = 'cookie-consent';
    cookieConsent.setAttribute('role', 'alert');
    cookieConsent.setAttribute('aria-live', 'polite');
    
    // Conteúdo da notificação
    cookieConsent.innerHTML = `
        <div class="cookie-content">
            <p>Este site utiliza cookies para melhorar sua experiência e armazenar suas preferências de acessibilidade. 
               Ao continuar navegando, você concorda com o uso de cookies.</p>
            
            <div class="cookie-buttons">
                <button id="cookie-accept" class="cookie-button accept">Aceitar</button>
                <button id="cookie-settings" class="cookie-button settings">Configurações</button>
            </div>
        </div>
    `;
    
    // Adicionar ao documento
    document.body.appendChild(cookieConsent);
    
    // Configurar os botões
    document.getElementById('cookie-accept').addEventListener('click', function() {
        acceptAllCookies();
        hideCookieConsent();
    });
    
    document.getElementById('cookie-settings').addEventListener('click', function() {
        showCookieSettings();
    });
    
    // Adicionar estilos CSS
    addCookieStyles();
}

/**
 * Adiciona estilos CSS para a notificação de cookies
 */
function addCookieStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .cookie-consent {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: var(--color-background-alt, #f0f0f0);
            border-top: 1px solid var(--color-border, #ddd);
            padding: 15px;
            z-index: 1000;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease-in-out;
        }
        
        .dark-mode .cookie-consent {
            background-color: var(--color-dark-background-alt, #333);
            border-top: 1px solid var(--color-dark-border, #555);
            color: var(--color-dark-text, #eee);
        }
        
        .cookie-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
        }
        
        .cookie-content p {
            flex: 1;
            margin: 0;
            font-size: 0.95rem;
        }
        
        .cookie-buttons {
            display: flex;
            gap: 10px;
        }
        
        .cookie-button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        
        .cookie-button.accept {
            background-color: var(--color-primary, #3498db);
            color: white;
        }
        
        .cookie-button.settings {
            background-color: transparent;
            border: 1px solid var(--color-border, #ddd);
            color: var(--color-text, #333);
        }
        
        .dark-mode .cookie-button.settings {
            border: 1px solid var(--color-dark-border, #555);
            color: var(--color-dark-text, #eee);
        }
        
        .cookie-button.accept:hover {
            background-color: var(--color-primary-dark, #2980b9);
        }
        
        .cookie-button.settings:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }
        
        .dark-mode .cookie-button.settings:hover {
            background-color: rgba(255, 255, 255, 0.05);
        }
        
        /* Modal de configurações */
        .cookie-settings-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1001;
            padding: 20px;
        }
        
        .cookie-settings-content {
            background-color: var(--color-background, #fff);
            border-radius: 6px;
            max-width: 600px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            padding: 20px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .dark-mode .cookie-settings-content {
            background-color: var(--color-dark-background, #222);
            color: var(--color-dark-text, #eee);
        }
        
        .cookie-settings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--color-border, #ddd);
        }
        
        .dark-mode .cookie-settings-header {
            border-bottom: 1px solid var(--color-dark-border, #555);
        }
        
        .cookie-settings-header h3 {
            margin: 0;
        }
        
        .cookie-settings-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            color: var(--color-text, #333);
        }
        
        .dark-mode .cookie-settings-close {
            color: var(--color-dark-text, #eee);
        }
        
        .cookie-settings-options {
            margin-bottom: 20px;
        }
        
        .cookie-option {
            margin-bottom: 15px;
        }
        
        .cookie-option-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
        }
        
        .cookie-option-title {
            font-weight: 500;
            font-size: 1rem;
        }
        
        .cookie-switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 24px;
        }
        
        .cookie-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .cookie-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
        }
        
        .cookie-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        
        input:checked + .cookie-slider {
            background-color: var(--color-primary, #3498db);
        }
        
        input:focus + .cookie-slider {
            box-shadow: 0 0 1px var(--color-primary, #3498db);
        }
        
        input:checked + .cookie-slider:before {
            transform: translateX(16px);
        }
        
        .cookie-option-description {
            font-size: 0.9rem;
            color: var(--color-text-muted, #666);
            margin-top: 5px;
        }
        
        .dark-mode .cookie-option-description {
            color: var(--color-dark-text-muted, #aaa);
        }
        
        .cookie-settings-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            padding-top: 15px;
            border-top: 1px solid var(--color-border, #ddd);
        }
        
        .dark-mode .cookie-settings-actions {
            border-top: 1px solid var(--color-dark-border, #555);
        }
        
        /* Responsividade */
        @media screen and (max-width: 768px) {
            .cookie-content {
                flex-direction: column;
                align-items: stretch;
                gap: 15px;
            }
            
            .cookie-buttons {
                justify-content: center;
            }
            
            .cookie-settings-content {
                width: 90%;
            }
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Esconde a notificação de consentimento de cookies
 */
function hideCookieConsent() {
    const cookieConsent = document.querySelector('.cookie-consent');
    if (cookieConsent) {
        cookieConsent.style.transform = 'translateY(100%)';
        setTimeout(() => {
            cookieConsent.remove();
        }, 300);
    }
}

/**
 * Aceita todos os cookies e salva a preferência
 */
function acceptAllCookies() {
    // Salvar consentimento para todos os tipos de cookies
    // Cookies válidos por 1 ano, com configuração correta para todo o site
    setCookie('cookieConsent', 'all', 365, true, 'Lax');
    setCookie('cookiePreference', JSON.stringify({
        necessary: true,
        preferences: true,
        analytics: true
    }), 365, true, 'Lax');
}

/**
 * Exibe o modal de configurações de cookies
 */
function showCookieSettings() {
    // Obter preferências salvas ou definir padrões
    let preferences = {};
    try {
        const saved = getCookie('cookiePreference');
        preferences = saved ? JSON.parse(saved) : {};
    } catch (e) {
        preferences = {};
    }
    
    // Valores padrão
    const prefs = {
        necessary: true, // Sempre necessário
        preferences: preferences.preferences !== undefined ? preferences.preferences : true,
        analytics: preferences.analytics !== undefined ? preferences.analytics : true
    };
    
    // Criar o modal
    const modal = document.createElement('div');
    modal.className = 'cookie-settings-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'cookie-settings-title');
    
    // Conteúdo do modal
    modal.innerHTML = `
        <div class="cookie-settings-content">
            <div class="cookie-settings-header">
                <h3 id="cookie-settings-title">Configurações de Cookies</h3>
                <button type="button" class="cookie-settings-close" aria-label="Fechar">&times;</button>
            </div>
            
            <div class="cookie-settings-options">
                <div class="cookie-option">
                    <div class="cookie-option-header">
                        <span class="cookie-option-title">Cookies Necessários</span>
                        <label class="cookie-switch">
                            <input type="checkbox" id="cookie-necessary" checked disabled>
                            <span class="cookie-slider"></span>
                        </label>
                    </div>
                    <p class="cookie-option-description">
                        Cookies essenciais para o funcionamento básico do site. Eles permitem funções como navegação e acesso a áreas seguras.
                    </p>
                </div>
                
                <div class="cookie-option">
                    <div class="cookie-option-header">
                        <span class="cookie-option-title">Cookies de Preferências</span>
                        <label class="cookie-switch">
                            <input type="checkbox" id="cookie-preferences" ${prefs.preferences ? 'checked' : ''}>
                            <span class="cookie-slider"></span>
                        </label>
                    </div>
                    <p class="cookie-option-description">
                        Cookies que armazenam suas preferências, como tamanho de fonte, tema e outras configurações de acessibilidade.
                    </p>
                </div>
                
                <div class="cookie-option">
                    <div class="cookie-option-header">
                        <span class="cookie-option-title">Cookies Analíticos</span>
                        <label class="cookie-switch">
                            <input type="checkbox" id="cookie-analytics" ${prefs.analytics ? 'checked' : ''}>
                            <span class="cookie-slider"></span>
                        </label>
                    </div>
                    <p class="cookie-option-description">
                        Cookies que nos ajudam a entender como os visitantes interagem com o site, permitindo melhorias na experiência.
                    </p>
                </div>
            </div>
            
            <div class="cookie-settings-actions">
                <button type="button" id="cookie-save" class="cookie-button accept">Salvar Preferências</button>
                <button type="button" id="cookie-accept-all" class="cookie-button settings">Aceitar Todos</button>
            </div>
        </div>
    `;
    
    // Adicionar ao documento
    document.body.appendChild(modal);
    
    // Configurar os botões
    document.querySelector('.cookie-settings-close').addEventListener('click', function() {
        modal.remove();
    });
    
    document.getElementById('cookie-save').addEventListener('click', function() {
        savePreferences();
        modal.remove();
        hideCookieConsent();
    });
    
    document.getElementById('cookie-accept-all').addEventListener('click', function() {
        acceptAllCookies();
        modal.remove();
        hideCookieConsent();
    });
    
    // Fechar ao clicar fora do modal
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    });
    
    // Fechar com tecla ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.parentNode) {
            modal.remove();
        }
    });
}

/**
 * Salva as preferências de cookies selecionadas pelo usuário
 */
function savePreferences() {
    const preferencesEnabled = document.getElementById('cookie-preferences').checked;
    const analyticsEnabled = document.getElementById('cookie-analytics').checked;
    
    // Salvar preferências
    const preferences = {
        necessary: true,
        preferences: preferencesEnabled,
        analytics: analyticsEnabled
    };
    
    // Salvar consentimento com configurações adequadas para todo o site
    setCookie('cookieConsent', 'custom', 365, true, 'Lax');
    setCookie('cookiePreference', JSON.stringify(preferences), 365, true, 'Lax');
    
    // Se o usuário desabilitou os cookies de preferência, remover os cookies existentes
    if (!preferencesEnabled) {
        removeCookie('fontSize');
        removeCookie('highContrast');
        removeCookie('accessibilityFontSize');
        removeCookie('accessibilityContrastMode');
        removeCookie('theme');
    }
    
    // Se o usuário desabilitou os cookies analíticos, remover cookies analíticos (se houver)
    if (!analyticsEnabled) {
        // Remover cookies analíticos, se necessário no futuro
    }
}
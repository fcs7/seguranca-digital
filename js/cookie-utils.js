/**
 * Utilitários para manipulação de cookies
 * Fornece funções para definir, obter e remover cookies de forma segura
 */

/**
 * Define um cookie com opções de segurança
 * @param {string} name - Nome do cookie
 * @param {string} value - Valor do cookie
 * @param {number} days - Dias de validade (se omitido, o cookie expira ao final da sessão)
 * @param {boolean} secure - Define se o cookie só deve ser enviado em conexões HTTPS
 * @param {boolean} sameSite - Define a política SameSite (Strict, Lax)
 */
function setCookie(name, value, days = 30, secure = true, sameSite = 'Lax') {
    // Encode o valor para evitar problemas com caracteres especiais
    const encodedValue = encodeURIComponent(value);
    
    // Cria a string base do cookie com path=/ para ser acessível em todo o site
    let cookie = `${name}=${encodedValue};path=/;domain=${window.location.hostname}`;
    
    // Adiciona data de expiração se especificada
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        cookie += `;expires=${date.toUTCString()}`;
    }
    
    // Adiciona flags de segurança
    cookie += `;SameSite=${sameSite}`;
    
    // Adiciona secure flag se solicitado (e se estiver em HTTPS)
    if (secure && window.location.protocol === 'https:') {
        cookie += ';Secure';
    }
    
    // Define o cookie
    document.cookie = cookie;
}

/**
 * Obtém o valor de um cookie
 * @param {string} name - Nome do cookie
 * @return {string|null} - Valor do cookie ou null se não encontrado
 */
function getCookie(name) {
    // Formato: "nome1=valor1; nome2=valor2; ..."
    const cookies = document.cookie.split(';');
    
    // Procura pelo cookie específico
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        
        // Verifica se este cookie começa com o nome procurado
        if (cookie.indexOf(name + '=') === 0) {
            // Retorna o valor decodificado
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    
    // Cookie não encontrado
    return null;
}

/**
 * Remove um cookie
 * @param {string} name - Nome do cookie a ser removido
 */
function removeCookie(name) {
    // Para remover um cookie, definimos sua data de expiração para o passado
    // Importante: Ao remover um cookie, precisamos usar o mesmo path e domain que foram usados ao criá-lo
    const domain = window.location.hostname;
    document.cookie = `${name}=;path=/;domain=${domain};expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Verifica se os cookies estão habilitados no navegador
 * @return {boolean} - true se cookies estão habilitados
 */
function areCookiesEnabled() {
    // Tenta definir um cookie de teste
    setCookie('_test_cookie', 'enabled', 1, false);
    
    // Verifica se o cookie foi definido
    const enabled = getCookie('_test_cookie') === 'enabled';
    
    // Remove o cookie de teste
    removeCookie('_test_cookie');
    
    return enabled;
}
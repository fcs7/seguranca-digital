/**
 * Script de atualização para adicionar o código de cookie a todos os arquivos HTML
 * Execute este script para atualizar todos os arquivos HTML com as inclusões de scripts de cookie
 */

const fs = require('fs');
const path = require('path');

// Diretório raiz do site
const rootDir = path.resolve(__dirname, '..');

// Lista de arquivos HTML a serem processados
const htmlFiles = [
    path.join(rootDir, 'index.html'),
    ...fs.readdirSync(path.join(rootDir, 'pages'))
        .filter(file => file.endsWith('.html'))
        .map(file => path.join(rootDir, 'pages', file))
];

// Função para modificar arquivo HTML
function updateHtmlFile(filePath) {
    console.log(`Processando: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Adicionar scripts no head
    const isRootFile = !filePath.includes('pages');
    const scriptPath = isRootFile ? 'js/' : '../js/';
    
    const scriptTags = `
    <!-- Scripts para manipulação de cookies e acessibilidade -->
    <script src="${scriptPath}cookie-utils.js"></script>
    <script src="${scriptPath}cookie-consent.js"></script>
    <script src="${scriptPath}accessibility.js"></script>
    <script src="${scriptPath}accessibility-bar.js"></script>`;
    
    // Inserir antes do </head>
    content = content.replace('</head>', `${scriptTags}\n</head>`);
    
    // 2. Substituir todas as referências localStorage por cookies
    // localStorage.getItem por getCookie
    content = content.replace(/localStorage\.getItem\(['"]([^'"]+)['"]\)/g, 'getCookie(\'$1\')');
    
    // localStorage.setItem por setCookie
    content = content.replace(/localStorage\.setItem\(['"]([^'"]+)['"],\s*([^)]+)\)/g, 'setCookie(\'$1\', $2, 30)');
    
    // Salvar arquivo modificado
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Atualizado: ${filePath}`);
}

// Processar todos os arquivos
htmlFiles.forEach(updateHtmlFile);

console.log('Todos os arquivos foram atualizados com as funções de cookie!');
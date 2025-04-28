/**
 * Script para atualizar todas as páginas HTML no diretório /pages/
 * Este script adiciona os recursos modernos de UI e UX a todas as páginas
 */

const fs = require('fs');
const path = require('path');

// Diretório de páginas
const pagesDir = path.join(__dirname, '../pages');

// Ler todas as páginas HTML
fs.readdir(pagesDir, (err, files) => {
    if (err) {
        console.error('Erro ao ler o diretório de páginas:', err);
        return;
    }

    // Filtrar apenas arquivos HTML
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    console.log(`Encontrados ${htmlFiles.length} arquivos HTML para atualizar.`);
    
    // Atualizar cada arquivo
    htmlFiles.forEach(file => {
        updateHtmlFile(path.join(pagesDir, file));
    });
});

/**
 * Atualiza um arquivo HTML adicionando os recursos modernos
 * @param {string} filePath - Caminho para o arquivo HTML
 */
function updateHtmlFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Erro ao ler o arquivo ${filePath}:`, err);
            return;
        }
        
        let updated = false;
        let newContent = data;
        
        // Verificar e adicionar o link para modern-ui.css
        if (!newContent.includes('modern-ui.css')) {
            newContent = newContent.replace(
                /<link rel="stylesheet" href="...\/css\/styles.css">/,
                '<link rel="stylesheet" href="../css/styles.css">\n    <!-- Estilos para UI moderna -->\n    <link rel="stylesheet" href="../css/modern-ui.css">'
            );
            updated = true;
        }
        
        // Verificar e adicionar Google Fonts
        if (!newContent.includes('fonts.googleapis.com')) {
            newContent = newContent.replace(
                /<\/title>/,
                '</title>\n    <!-- Google Fonts - Nunito -->\n    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">'
            );
            updated = true;
        }
        
        // Verificar e adicionar o script de UX melhorado
        if (!newContent.includes('enhanced-ux.js')) {
            newContent = newContent.replace(
                /<\/body>/,
                '    <!-- Script para melhorias de UX -->\n    <script src="../js/enhanced-ux.js"></script>\n</body>'
            );
            updated = true;
        }
        
        // Se houve alterações, salvar o arquivo
        if (updated) {
            fs.writeFile(filePath, newContent, 'utf8', (err) => {
                if (err) {
                    console.error(`Erro ao salvar alterações em ${filePath}:`, err);
                    return;
                }
                console.log(`✅ Atualizado: ${path.basename(filePath)}`);
            });
        } else {
            console.log(`⏭️ Sem alterações necessárias: ${path.basename(filePath)}`);
        }
    });
}

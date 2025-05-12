# CLAUDE.md

Este arquivo fornece orientações para o Claude Code (claude.ai/code) ao trabalhar com código neste repositório.

## Comandos

- **Servidor local:** `python -m http.server` ou `npx serve` (utilize o que estiver disponível)
- **Validar HTML:** `npx html-validate index.html pages/*.html`
- **Validar CSS:** `npx stylelint "css/*.css"`
- **Validar JavaScript:** `npx eslint "js/*.js"`
- **Verificar Acessibilidade:** `npx axe https://localhost:8000 --browser chrome`

## Diretrizes de código

### Padrões gerais
- Todos os arquivos e comentários devem estar em **Português do Brasil (pt-br)**
- Indentação: 4 espaços
- Usar comentários JSDoc para documentar funções (`/** Descrição */`)
- Manter o foco na acessibilidade WCAG 2.1 (nível AA) em todas as alterações

### HTML
- Usar tags semânticas sempre que possível
- Incluir atributos ARIA para acessibilidade 
- Garantir elementos interativos tenham rótulos acessíveis
- Validar markup com HTML5

### CSS
- Usar variáveis CSS para cores, fontes e tamanhos
- Implementar design responsivo com media queries
- Garantir contraste de cores adequado (WCAG AA)
- Evitar uso de `!important` exceto para sobreposições críticas

### JavaScript
- Declarar funções com `function nomeDaFuncao()`
- Usar camelCase para variáveis e funções
- Tratar erros adequadamente com blocos try/catch
- Verificar existência de funções antes de chamá-las
- Evitar variáveis globais sem necessidade
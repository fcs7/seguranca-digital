# CLAUDE.md

Este arquivo fornece orientações para o Claude Code (claude.ai/code) ao trabalhar com código neste repositório.

## Comandos

- **Servidor local:** `python -m http.server` ou `npx serve` (utilize o que estiver disponível)
- **Validar HTML:** `npx html-validate index.html pages/*.html`
- **Validar CSS:** `npx stylelint "css/*.css"`
- **Validar JavaScript:** `npx eslint "js/*.js"`

## Diretrizes de código

### Padrões gerais
- Todos os arquivos e comentários devem estar em **Português do Brasil (pt-br)**
- Indentação: 4 espaços
- Usar comentários para documentar funções e seções importantes
- Manter o foco na acessibilidade em todas as alterações

### HTML
- Usar tags semânticas sempre que possível
- Incluir atributos ARIA para acessibilidade
- Garantir elementos interativos tenham rótulos acessíveis

### CSS
- Usar variáveis CSS para cores e tamanhos
- Implementar responsividade para todos os dispositivos
- Garantir contraste de cores adequado (WCAG AA)

### JavaScript
- Declarar funções com `function nomeDaFuncao()`
- Usar camelCase para nomes de variáveis e funções
- Adicionar comentários JSDoc para documentação
- Tratar erros adequadamente com blocos try/catch
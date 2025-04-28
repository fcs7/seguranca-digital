# Adaptação da Barra de Acessibilidade para Frameworks

Este documento fornece diretrizes para adaptar a barra de acessibilidade implementada para frameworks modernos de JavaScript como React e Vue.js.

## Adaptação para React

### 1. Componente da Barra de Acessibilidade

```jsx
// AccessibilityBar.jsx
import React, { useEffect, useState } from 'react';
import './AccessibilityBar.css'; // Adapte o CSS criado anteriormente

const AccessibilityBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [contrastMode, setContrastMode] = useState('normal');

  // Inicializar configurações ao carregar
  useEffect(() => {
    // Recuperar configurações salvas no localStorage
    const savedFontSize = localStorage.getItem('accessibilityFontSize') || 'medium';
    const savedContrastMode = localStorage.getItem('accessibilityContrastMode') || 'normal';
    
    setFontSize(savedFontSize);
    setContrastMode(savedContrastMode);
    
    // Aplicar configurações
    applyFontSize(savedFontSize);
    applyContrastMode(savedContrastMode);
    
    // Configurar atalho de teclado
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setIsMenuOpen(prev => !prev);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Função para aplicar tamanho de fonte
  const applyFontSize = (size) => {
    document.documentElement.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    document.documentElement.classList.add(`font-size-${size}`);
    
    let baseFontSize;
    switch(size) {
      case 'small': baseFontSize = '16px'; break;
      case 'large': baseFontSize = '22px'; break;
      default: baseFontSize = '18px';
    }
    
    document.documentElement.style.fontSize = baseFontSize;
    localStorage.setItem('accessibilityFontSize', size);
  };

  // Função para aplicar modo de contraste
  const applyContrastMode = (mode) => {
    document.body.classList.remove('dark-mode', 'high-contrast-mode');
    
    if (mode === 'dark') {
      document.body.classList.add('dark-mode');
    } else if (mode === 'high-contrast') {
      document.body.classList.add('high-contrast-mode');
    }
    
    localStorage.setItem('accessibilityContrastMode', mode);
  };

  // Função para anunciar para leitores de tela
  const announceToScreenReader = (message) => {
    const announcer = document.getElementById('accessibility-announcer') || 
                      (() => {
                        const el = document.createElement('div');
                        el.id = 'accessibility-announcer';
                        el.setAttribute('aria-live', 'polite');
                        el.setAttribute('aria-atomic', 'true');
                        el.className = 'sr-only';
                        document.body.appendChild(el);
                        return el;
                      })();
    
    announcer.textContent = message;
  };

  // Handler para alterar tamanho de fonte
  const handleFontSizeChange = (size) => {
    setFontSize(size);
    applyFontSize(size);
    
    const descriptions = {
      small: 'pequeno',
      medium: 'médio',
      large: 'grande'
    };
    
    announceToScreenReader(`Tamanho de fonte alterado para ${descriptions[size]}`);
  };

  // Handler para alterar modo de contraste
  const handleContrastModeChange = (mode) => {
    setContrastMode(mode);
    applyContrastMode(mode);
    
    const descriptions = {
      normal: 'normal',
      dark: 'escuro',
      high-contrast: 'alto contraste'
    };
    
    announceToScreenReader(`Modo de contraste alterado para ${descriptions[mode]}`);
  };

  // Fechar menu ao clicar fora
  const handleOutsideClick = (e) => {
    if (isMenuOpen && !e.target.closest('.accessibility-menu') && 
        !e.target.closest('.accessibility-button')) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isMenuOpen]);

  return (
    <>
      <button 
        className="accessibility-button"
        aria-label="Abrir menu de acessibilidade"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <i className="fas fa-universal-access"></i>
      </button>
      
      {isMenuOpen && (
        <div 
          className="accessibility-menu" 
          role="dialog" 
          aria-labelledby="accessibility-title"
        >
          <h3 id="accessibility-title">Opções de Acessibilidade</h3>
          
          <div className="accessibility-section">
            <h4>Tamanho do Texto</h4>
            <div className="option-buttons" role="group" aria-label="Tamanho da fonte">
              <button 
                className={`option-button font-size-option ${fontSize === 'small' ? 'active' : ''}`}
                onClick={() => handleFontSizeChange('small')}
                aria-label="Fonte pequena"
              >
                <span className="font-small">A</span> Pequeno
              </button>
              <button 
                className={`option-button font-size-option ${fontSize === 'medium' ? 'active' : ''}`}
                onClick={() => handleFontSizeChange('medium')}
                aria-label="Fonte média"
              >
                <span className="font-medium">A</span> Médio
              </button>
              <button 
                className={`option-button font-size-option ${fontSize === 'large' ? 'active' : ''}`}
                onClick={() => handleFontSizeChange('large')}
                aria-label="Fonte grande"
              >
                <span className="font-large">A</span> Grande
              </button>
            </div>
          </div>
          
          <div className="accessibility-section">
            <h4>Modo de Contraste</h4>
            <div className="option-buttons" role="group" aria-label="Modo de contraste">
              <button 
                className={`option-button contrast-mode-option ${contrastMode === 'normal' ? 'active' : ''}`}
                onClick={() => handleContrastModeChange('normal')}
                aria-label="Modo normal"
              >
                Normal
                <div className="mode-preview preview-normal">Abc</div>
              </button>
              <button 
                className={`option-button contrast-mode-option ${contrastMode === 'dark' ? 'active' : ''}`}
                onClick={() => handleContrastModeChange('dark')}
                aria-label="Modo escuro"
              >
                Escuro
                <div className="mode-preview preview-dark">Abc</div>
              </button>
              <button 
                className={`option-button contrast-mode-option ${contrastMode === 'high-contrast' ? 'active' : ''}`}
                onClick={() => handleContrastModeChange('high-contrast')}
                aria-label="Alto contraste"
              >
                Alto Contraste
                <div className="mode-preview preview-high-contrast">Abc</div>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="sr-only" aria-live="polite">
        Pressione Alt+A para abrir o menu de acessibilidade.
      </div>
    </>
  );
};

export default AccessibilityBar;
```

### 2. Uso do Componente

```jsx
// App.jsx
import React from 'react';
import AccessibilityBar from './components/AccessibilityBar';

function App() {
  return (
    <div className="App">
      {/* Conteúdo do site */}
      <header>
        {/* ... */}
      </header>
      <main>
        {/* ... */}
      </main>
      <footer>
        {/* ... */}
      </footer>
      
      {/* Barra de acessibilidade */}
      <AccessibilityBar />
    </div>
  );
}

export default App;
```

## Adaptação para Vue.js

### 1. Componente da Barra de Acessibilidade

```vue
<!-- AccessibilityBar.vue -->
<template>
  <div>
    <button 
      class="accessibility-button"
      aria-label="Abrir menu de acessibilidade"
      :aria-expanded="isMenuOpen"
      @click="toggleMenu"
    >
      <i class="fas fa-universal-access"></i>
    </button>
    
    <div 
      v-if="isMenuOpen"
      class="accessibility-menu" 
      role="dialog" 
      aria-labelledby="accessibility-title"
    >
      <h3 id="accessibility-title">Opções de Acessibilidade</h3>
      
      <div class="accessibility-section">
        <h4>Tamanho do Texto</h4>
        <div class="option-buttons" role="group" aria-label="Tamanho da fonte">
          <button 
            :class="['option-button', 'font-size-option', { active: fontSize === 'small' }]"
            @click="setFontSize('small')"
            aria-label="Fonte pequena"
          >
            <span class="font-small">A</span> Pequeno
          </button>
          <button 
            :class="['option-button', 'font-size-option', { active: fontSize === 'medium' }]"
            @click="setFontSize('medium')"
            aria-label="Fonte média"
          >
            <span class="font-medium">A</span> Médio
          </button>
          <button 
            :class="['option-button', 'font-size-option', { active: fontSize === 'large' }]"
            @click="setFontSize('large')"
            aria-label="Fonte grande"
          >
            <span class="font-large">A</span> Grande
          </button>
        </div>
      </div>
      
      <div class="accessibility-section">
        <h4>Modo de Contraste</h4>
        <div class="option-buttons" role="group" aria-label="Modo de contraste">
          <button 
            :class="['option-button', 'contrast-mode-option', { active: contrastMode === 'normal' }]"
            @click="setContrastMode('normal')"
            aria-label="Modo normal"
          >
            Normal
            <div class="mode-preview preview-normal">Abc</div>
          </button>
          <button 
            :class="['option-button', 'contrast-mode-option', { active: contrastMode === 'dark' }]"
            @click="setContrastMode('dark')"
            aria-label="Modo escuro"
          >
            Escuro
            <div class="mode-preview preview-dark">Abc</div>
          </button>
          <button 
            :class="['option-button', 'contrast-mode-option', { active: contrastMode === 'high-contrast' }]"
            @click="setContrastMode('high-contrast')"
            aria-label="Alto contraste"
          >
            Alto Contraste
            <div class="mode-preview preview-high-contrast">Abc</div>
          </button>
        </div>
      </div>
    </div>
    
    <div class="sr-only" aria-live="polite">
      Pressione Alt+A para abrir o menu de acessibilidade.
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccessibilityBar',
  data() {
    return {
      isMenuOpen: false,
      fontSize: 'medium',
      contrastMode: 'normal'
    }
  },
  mounted() {
    // Inicializar configurações
    this.initializeSettings();
    
    // Configurar evento de clique global para fechar o menu
    document.addEventListener('click', this.handleOutsideClick);
    
    // Configurar atalho de teclado
    document.addEventListener('keydown', this.handleKeyDown);
  },
  beforeUnmount() {
    // Remover event listeners
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    initializeSettings() {
      // Recuperar configurações salvas
      const savedFontSize = localStorage.getItem('accessibilityFontSize') || 'medium';
      const savedContrastMode = localStorage.getItem('accessibilityContrastMode') || 'normal';
      
      this.fontSize = savedFontSize;
      this.contrastMode = savedContrastMode;
      
      // Aplicar configurações
      this.applyFontSize(savedFontSize);
      this.applyContrastMode(savedContrastMode);
    },
    
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      this.announceToScreenReader(this.isMenuOpen ? 'Menu de acessibilidade aberto' : 'Menu de acessibilidade fechado');
    },
    
    handleOutsideClick(e) {
      if (this.isMenuOpen && 
          !e.target.closest('.accessibility-menu') && 
          !e.target.closest('.accessibility-button')) {
        this.isMenuOpen = false;
      }
    },
    
    handleKeyDown(e) {
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        this.toggleMenu();
      }
    },
    
    setFontSize(size) {
      this.fontSize = size;
      this.applyFontSize(size);
      
      const descriptions = {
        small: 'pequeno',
        medium: 'médio',
        large: 'grande'
      };
      
      this.announceToScreenReader(`Tamanho de fonte alterado para ${descriptions[size]}`);
    },
    
    applyFontSize(size) {
      document.documentElement.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
      document.documentElement.classList.add(`font-size-${size}`);
      
      let baseFontSize;
      switch(size) {
        case 'small': baseFontSize = '16px'; break;
        case 'large': baseFontSize = '22px'; break;
        default: baseFontSize = '18px';
      }
      
      document.documentElement.style.fontSize = baseFontSize;
      localStorage.setItem('accessibilityFontSize', size);
    },
    
    setContrastMode(mode) {
      this.contrastMode = mode;
      this.applyContrastMode(mode);
      
      const descriptions = {
        normal: 'normal',
        dark: 'escuro',
        'high-contrast': 'alto contraste'
      };
      
      this.announceToScreenReader(`Modo de contraste alterado para ${descriptions[mode]}`);
    },
    
    applyContrastMode(mode) {
      document.body.classList.remove('dark-mode', 'high-contrast-mode');
      
      if (mode === 'dark') {
        document.body.classList.add('dark-mode');
      } else if (mode === 'high-contrast') {
        document.body.classList.add('high-contrast-mode');
      }
      
      localStorage.setItem('accessibilityContrastMode', mode);
    },
    
    announceToScreenReader(message) {
      let announcer = document.getElementById('accessibility-announcer');
      
      if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'accessibility-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);
      }
      
      announcer.textContent = message;
    }
  }
}
</script>

<style scoped>
/* Importe os estilos do CSS da barra de acessibilidade */
/* Ou defina-os diretamente aqui */
</style>
```

### 2. Uso do Componente

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <!-- Conteúdo do site -->
    <header>
      <!-- ... -->
    </header>
    <main>
      <!-- ... -->
    </main>
    <footer>
      <!-- ... -->
    </footer>
    
    <!-- Barra de acessibilidade -->
    <AccessibilityBar />
  </div>
</template>

<script>
import AccessibilityBar from './components/AccessibilityBar.vue';

export default {
  name: 'App',
  components: {
    AccessibilityBar
  }
}
</script>
```

## Considerações Finais

### Adicionando ao CSS Global

Em ambos os casos, você precisará importar o arquivo CSS de acessibilidade em seu projeto:

```js
// Para React (em index.js ou App.js)
import './path/to/accessibility-bar.css';

// Para Vue (no main.js)
import './assets/accessibility-bar.css';
```

### Acessibilidade Aprimorada em Frameworks

Os frameworks modernos oferecem recursos adicionais para melhorar a acessibilidade:

1. **React**: 
   - Use a biblioteca `@react-aria` para componentes acessíveis pré-construídos
   - Considere o uso de `react-axe` durante o desenvolvimento para testar acessibilidade

2. **Vue.js**:
   - Explore `vue-a11y` para componentes e diretrizes de acessibilidade
   - Use `vue-announcer` para gerenciar anúncios para leitores de tela

### Testes de Acessibilidade

Independentemente do framework escolhido, é importante testar a acessibilidade:

- **Ferramentas automatizadas**: Lighthouse, axe DevTools, WAVE
- **Testes manuais**: Navegação por teclado, teste com leitores de tela (NVDA, VoiceOver)
- **Verificação de contraste**: Verifique se todas as combinações de cores atendem aos requisitos WCAG 2.1 AA (contraste mínimo de 4,5:1)
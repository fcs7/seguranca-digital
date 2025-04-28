# Digital Security for Seniors Website

A website focused on digital security education for seniors with emphasis on accessibility, large fonts, high contrast, and intuitive navigation.

## Directory Structure

```
website/
├── css/
│   └── styles.css
├── js/
│   ├── accessibility.js
│   └── main.js
├── images/
├── pages/
│   ├── password-security.html
│   ├── email-safety.html
│   ├── online-scams.html
│   ├── resources.html
│   ├── contact.html
│   ├── accessibility.html
│   └── sitemap.html
├── resources/
└── index.html
```

## Accessibility Features

This website includes the following accessibility features:

- Large base font size (18px)
- High contrast mode toggle
- Adjustable font size
- Keyboard navigation support with skip links
- Screen reader announcements for state changes
- Semantic HTML structure
- ARIA attributes for improved accessibility
- Clear, intuitive navigation with recognizable icons
- Focus management
- Responsive design for all device sizes

## Framework Recommendations

While this is currently a simple HTML/CSS/JS implementation, potential frameworks/libraries to consider:

1. **Bootstrap** - For responsive design and accessibility components
2. **React + React Router** - For more complex, component-based architecture
3. **Vue.js** - For lightweight, progressive enhancement
4. **WAI-ARIA Authoring Practices** - Guidelines for accessible web components

## Development

To develop this website further:

1. Add content to the page templates in the `pages/` directory
2. Add images to the `images/` directory
3. Add additional resources to the `resources/` directory
4. Enhance accessibility features as needed

## Accessibility Testing Recommendations

- WebAIM WAVE - Web accessibility evaluation tool
- axe DevTools - Accessibility testing browser extension
- Lighthouse - Chrome DevTools accessibility audit
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation testing
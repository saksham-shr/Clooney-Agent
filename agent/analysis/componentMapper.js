/**
 * Maps analyzed UI elements to reusable React components
 */
export class ComponentMapper {
  constructor(analysisReport) {
    this.analysisReport = analysisReport;
    this.componentMap = new Map();
  }

  generateComponentMap() {
    const componentMap = {};

    // Map buttons
    componentMap.buttons = this.mapButtonComponents();

    // Map forms
    componentMap.forms = this.mapFormComponents();

    // Map navigation
    componentMap.navigation = this.mapNavigationComponents();

    // Map cards
    componentMap.cards = this.mapCardComponents();

    // Map modals
    componentMap.modals = this.mapModalComponents();

    // Map layouts
    componentMap.layouts = this.mapLayoutComponents();

    // Map input elements
    componentMap.inputs = this.mapInputComponents();

    return componentMap;
  }

  mapButtonComponents() {
    const buttons = [];
    if (!this.analysisReport.components) return buttons;

    this.analysisReport.components.forEach(comp => {
      if (comp.estimatedType === 'button') {
        buttons.push({
          name: comp.name,
          originalTag: comp.tag,
          classes: comp.classes,
          reactComponent: 'Button',
          props: {
            variant: this.extractButtonVariant(comp),
            size: this.extractButtonSize(comp),
            disabled: comp.classes?.some(c => c.includes('disabled')),
          },
        });
      }
    });

    return buttons;
  }

  mapFormComponents() {
    const forms = [];
    if (!this.analysisReport.components) return forms;

    this.analysisReport.components.forEach(comp => {
      if (comp.estimatedType === 'form') {
        forms.push({
          name: comp.name,
          originalTag: comp.tag,
          classes: comp.classes,
          reactComponent: 'Form',
          fields: [],
        });
      }
    });

    return forms;
  }

  mapNavigationComponents() {
    const navs = [];
    if (!this.analysisReport.sections) return navs;

    this.analysisReport.sections.forEach(section => {
      if (section.purpose === 'navigation') {
        navs.push({
          name: section.id || 'Navigation',
          originalTag: section.tag,
          classes: section.classes,
          reactComponent: 'Navigation',
          layout: this.detectLayoutType(section),
        });
      }
    });

    return navs;
  }

  mapCardComponents() {
    const cards = [];
    if (!this.analysisReport.components) return cards;

    this.analysisReport.components.forEach(comp => {
      if (comp.estimatedType === 'card') {
        cards.push({
          name: comp.name,
          originalTag: comp.tag,
          classes: comp.classes,
          reactComponent: 'Card',
          hasImage: comp.childCount > 0,
          hasFooter: this.hasFooter(comp),
        });
      }
    });

    return cards;
  }

  mapModalComponents() {
    const modals = [];
    if (!this.analysisReport.components) return modals;

    this.analysisReport.components.forEach(comp => {
      if (comp.estimatedType === 'modal') {
        modals.push({
          name: comp.name,
          originalTag: comp.tag,
          classes: comp.classes,
          reactComponent: 'Dialog',
          hasCloseButton: true,
        });
      }
    });

    return modals;
  }

  mapLayoutComponents() {
    const layouts = [];
    if (!this.analysisReport.layouts) return layouts;

    this.analysisReport.layouts.forEach(layout => {
      layouts.push({
        tag: layout.tag,
        id: layout.id,
        classes: layout.classes,
        layoutType: layout.layout.type,
        layoutProps: layout.layout,
        childCount: layout.childCount,
      });
    });

    return layouts;
  }

  mapInputComponents() {
    const inputs = [];
    if (!this.analysisReport.components) return inputs;

    this.analysisReport.components.forEach(comp => {
      if (comp.estimatedType === 'input') {
        inputs.push({
          name: comp.name,
          originalTag: comp.tag,
          classes: comp.classes,
          reactComponent: 'Input',
          type: this.extractInputType(comp),
        });
      }
    });

    return inputs;
  }

  extractButtonVariant(component) {
    const classes = (component.classes || []).join(' ').toLowerCase();
    if (classes.includes('primary')) return 'default';
    if (classes.includes('secondary')) return 'outline';
    if (classes.includes('danger') || classes.includes('destructive')) return 'destructive';
    if (classes.includes('ghost')) return 'ghost';
    return 'default';
  }

  extractButtonSize(component) {
    const classes = (component.classes || []).join(' ').toLowerCase();
    if (classes.includes('lg') || classes.includes('large')) return 'lg';
    if (classes.includes('sm') || classes.includes('small')) return 'sm';
    return 'default';
  }

  extractInputType(component) {
    const classes = (component.classes || []).join(' ').toLowerCase();
    if (classes.includes('email')) return 'email';
    if (classes.includes('password')) return 'password';
    if (classes.includes('search')) return 'search';
    if (classes.includes('number')) return 'number';
    return 'text';
  }

  detectLayoutType(section) {
    if (!section) return 'flex';
    const classes = (section.classes || []).join(' ').toLowerCase();
    if (classes.includes('grid')) return 'grid';
    if (classes.includes('flex')) return 'flex';
    return 'block';
  }

  hasFooter(component) {
    return component.childCount > 2;
  }

  generateReactComponentCode(componentMap) {
    const code = {};

    // Generate Button component
    code.Button = `import React from 'react';

export const Button = ({ 
  variant = 'default', 
  size = 'default', 
  disabled = false, 
  children, 
  ...props 
}) => {
  const baseStyles = 'px-4 py-2 rounded font-medium transition-colors';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'hover:bg-gray-100',
  };
  const sizes = {
    sm: 'text-sm px-3 py-1',
    default: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  return (
    <button
      className={\`\${baseStyles} \${variants[variant]} \${sizes[size]} \${disabled ? 'opacity-50 cursor-not-allowed' : ''}\`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};`;

    // Generate Card component
    code.Card = `import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={\`bg-white rounded-lg shadow-md p-6 \${className}\`}>
      {children}
    </div>
  );
};`;

    // Generate Form component
    code.Form = `import React from 'react';

export const Form = ({ onSubmit, children, className = '' }) => {
  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
    </form>
  );
};`;

    // Generate Input component
    code.Input = `import React from 'react';

export const Input = ({ 
  type = 'text', 
  placeholder = '', 
  disabled = false, 
  ...props 
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  );
};`;

    // Generate Navigation component
    code.Navigation = `import React from 'react';

export const Navigation = ({ items = [], className = '' }) => {
  return (
    <nav className={\`flex gap-4 \${className}\`}>
      {items.map((item, idx) => (
        <a
          key={idx}
          href={item.href}
          className="text-gray-700 hover:text-blue-600 transition-colors"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
};`;

    return code;
  }
}

export default ComponentMapper;

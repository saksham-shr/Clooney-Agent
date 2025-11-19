/**
 * Extracts computed styles and maps them to Tailwind CSS classes
 */
export class StyleExtractor {
  constructor() {
    this.colorMap = this.buildColorMap();
    this.spacingMap = this.buildSpacingMap();
    this.fontSizeMap = this.buildFontSizeMap();
  }

  buildColorMap() {
    return {
      '#000000': 'black',
      '#ffffff': 'white',
      '#f3f4f6': 'gray-100',
      '#e5e7eb': 'gray-200',
      '#d1d5db': 'gray-300',
      '#9ca3af': 'gray-400',
      '#6b7280': 'gray-500',
      '#4b5563': 'gray-600',
      '#374151': 'gray-700',
      '#1f2937': 'gray-800',
      '#111827': 'gray-900',
      '#3b82f6': 'blue-500',
      '#2563eb': 'blue-600',
      '#1d4ed8': 'blue-700',
      '#ef4444': 'red-500',
      '#dc2626': 'red-600',
      '#b91c1c': 'red-700',
      '#10b981': 'green-500',
      '#059669': 'green-600',
      '#047857': 'green-700',
      '#f59e0b': 'amber-500',
      '#d97706': 'amber-600',
      '#b45309': 'amber-700',
    };
  }

  buildSpacingMap() {
    return {
      '0px': '0',
      '4px': '1',
      '8px': '2',
      '12px': '3',
      '16px': '4',
      '20px': '5',
      '24px': '6',
      '28px': '7',
      '32px': '8',
      '36px': '9',
      '40px': '10',
      '44px': '11',
      '48px': '12',
      '64px': '16',
      '80px': '20',
      '96px': '24',
    };
  }

  buildFontSizeMap() {
    return {
      '12px': 'xs',
      '14px': 'sm',
      '16px': 'base',
      '18px': 'lg',
      '20px': 'xl',
      '24px': '2xl',
      '30px': '3xl',
      '36px': '4xl',
      '48px': '5xl',
    };
  }

  extractStylesFromDOM(domData) {
    const styles = [];

    const traverse = (node) => {
      if (!node) return;

      if (node.styles) {
        styles.push({
          selector: node.id ? `#${node.id}` : node.classes?.[0] ? `.${node.classes[0]}` : node.tag,
          styles: node.styles,
          tailwindClasses: this.convertToTailwind(node.styles),
        });
      }

      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => traverse(child));
      }
    };

    traverse(domData);
    return styles;
  }

  convertToTailwind(styles) {
    const classes = [];

    if (!styles) return classes;

    // Display
    if (styles.display === 'flex') classes.push('flex');
    if (styles.display === 'grid') classes.push('grid');
    if (styles.display === 'block') classes.push('block');
    if (styles.display === 'inline-block') classes.push('inline-block');
    if (styles.display === 'none') classes.push('hidden');

    // Flex properties
    if (styles.flexDirection === 'column') classes.push('flex-col');
    if (styles.flexDirection === 'row') classes.push('flex-row');
    if (styles.justifyContent === 'center') classes.push('justify-center');
    if (styles.justifyContent === 'space-between') classes.push('justify-between');
    if (styles.justifyContent === 'flex-start') classes.push('justify-start');
    if (styles.justifyContent === 'flex-end') classes.push('justify-end');
    if (styles.alignItems === 'center') classes.push('items-center');
    if (styles.alignItems === 'flex-start') classes.push('items-start');
    if (styles.alignItems === 'flex-end') classes.push('items-end');

    // Gap
    const gapClass = this.mapSpacing(styles.gap);
    if (gapClass) classes.push(`gap-${gapClass}`);

    // Padding
    const paddingClass = this.mapSpacing(styles.padding);
    if (paddingClass) classes.push(`p-${paddingClass}`);

    // Margin
    const marginClass = this.mapSpacing(styles.margin);
    if (marginClass) classes.push(`m-${marginClass}`);

    // Width & Height
    if (styles.width === '100%') classes.push('w-full');
    if (styles.height === '100%') classes.push('h-full');

    // Background Color
    const bgColor = this.mapColor(styles.backgroundColor);
    if (bgColor) classes.push(`bg-${bgColor}`);

    // Text Color
    const textColor = this.mapColor(styles.color);
    if (textColor) classes.push(`text-${textColor}`);

    // Font Size
    const fontSize = this.mapFontSize(styles.fontSize);
    if (fontSize) classes.push(`text-${fontSize}`);

    // Font Weight
    if (styles.fontWeight === 'bold' || styles.fontWeight === '700') classes.push('font-bold');
    if (styles.fontWeight === '600') classes.push('font-semibold');
    if (styles.fontWeight === '500') classes.push('font-medium');

    // Border Radius
    const radiusClass = this.mapBorderRadius(styles.borderRadius);
    if (radiusClass) classes.push(`rounded-${radiusClass}`);

    // Box Shadow
    if (styles.boxShadow && styles.boxShadow !== 'none') {
      classes.push('shadow-md');
    }

    // Position
    if (styles.position === 'absolute') classes.push('absolute');
    if (styles.position === 'relative') classes.push('relative');
    if (styles.position === 'fixed') classes.push('fixed');

    // Opacity
    if (styles.opacity === '0.5') classes.push('opacity-50');
    if (styles.opacity === '0.75') classes.push('opacity-75');

    return classes;
  }

  mapColor(color) {
    if (!color) return null;

    // Direct match
    if (this.colorMap[color]) return this.colorMap[color];

    // Normalize and try again
    const normalized = this.normalizeColor(color);
    if (this.colorMap[normalized]) return this.colorMap[normalized];

    return null;
  }

  mapSpacing(value) {
    if (!value) return null;
    if (this.spacingMap[value]) return this.spacingMap[value];

    // Try to extract numeric value
    const match = value.match(/(\d+)px/);
    if (match) {
      const px = parseInt(match[1]);
      const closest = Object.entries(this.spacingMap).reduce((prev, [key, val]) => {
        const keyPx = parseInt(key);
        return Math.abs(keyPx - px) < Math.abs(parseInt(prev[0]) - px) ? [key, val] : prev;
      });
      return closest[1];
    }

    return null;
  }

  mapFontSize(size) {
    if (!size) return null;
    if (this.fontSizeMap[size]) return this.fontSizeMap[size];

    const match = size.match(/(\d+)px/);
    if (match) {
      const px = parseInt(match[1]);
      const closest = Object.entries(this.fontSizeMap).reduce((prev, [key, val]) => {
        const keyPx = parseInt(key);
        return Math.abs(keyPx - px) < Math.abs(parseInt(prev[0]) - px) ? [key, val] : prev;
      });
      return closest[1];
    }

    return null;
  }

  mapBorderRadius(radius) {
    if (!radius) return null;
    if (radius === '0px') return null;
    if (radius === '4px') return 'sm';
    if (radius === '6px' || radius === '8px') return 'md';
    if (radius === '12px') return 'lg';
    if (radius === '16px') return 'xl';
    if (radius === '9999px') return 'full';
    return 'md';
  }

  normalizeColor(color) {
    if (!color) return '';

    // Convert rgb to hex
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
      const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
      const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`.toLowerCase();
    }

    return color.toLowerCase();
  }

  generateTailwindConfig(designTokens) {
    const colors = {};
    const fontSize = {};
    const spacing = {};

    // Extract unique colors
    designTokens.colors?.forEach(color => {
      const mapped = this.mapColor(color);
      if (mapped) {
        colors[mapped] = color;
      }
    });

    // Extract unique font sizes
    designTokens.fontSizes?.forEach(size => {
      const mapped = this.mapFontSize(size);
      if (mapped) {
        fontSize[mapped] = size;
      }
    });

    // Extract unique spacing
    designTokens.spacing?.forEach(space => {
      const mapped = this.mapSpacing(space);
      if (mapped) {
        spacing[mapped] = space;
      }
    });

    return {
      theme: {
        extend: {
          colors,
          fontSize,
          spacing,
        },
      },
    };
  }
}

export default StyleExtractor;

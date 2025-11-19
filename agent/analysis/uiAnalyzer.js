/**
 * Analyzes UI structure to identify components, layouts, and design patterns
 */
export class UIAnalyzer {
  constructor(domData) {
    this.domData = domData;
    this.components = [];
    this.layouts = [];
    this.designTokens = {};
  }

  analyzeComponentStructure() {
    const components = [];
    const visited = new Set();

    const traverseNode = (node, parentPath = '') => {
      if (!node || visited.has(node)) return;
      visited.add(node);

      const path = `${parentPath}/${node.tag}`;
      const componentSignature = this.generateComponentSignature(node);

      // Identify potential components
      if (this.isComponentLike(node)) {
        components.push({
          name: this.generateComponentName(node),
          tag: node.tag,
          id: node.id,
          classes: node.classes,
          signature: componentSignature,
          childCount: node.children?.length || 0,
          hasInteractiveElements: this.hasInteractiveElements(node),
          estimatedType: this.estimateComponentType(node),
        });
      }

      // Recursively analyze children
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => traverseNode(child, path));
      }
    };

    traverseNode(this.domData);
    return components;
  }

  analyzeLayoutPatterns() {
    const layouts = [];

    const detectLayout = (node) => {
      if (!node) return null;

      const display = node.styles?.display;
      const flexDirection = node.styles?.flexDirection;
      const gridTemplateColumns = node.styles?.gridTemplateColumns;

      if (display === 'flex') {
        return {
          type: 'flex',
          direction: flexDirection || 'row',
          justifyContent: node.styles?.justifyContent,
          alignItems: node.styles?.alignItems,
          gap: node.styles?.gap,
        };
      }

      if (display === 'grid') {
        return {
          type: 'grid',
          columns: gridTemplateColumns,
          rows: node.styles?.gridTemplateRows,
          gap: node.styles?.gap,
        };
      }

      if (display === 'block' || display === 'inline-block') {
        return {
          type: 'block',
          width: node.styles?.width,
          height: node.styles?.height,
        };
      }

      return null;
    };

    const traverseNode = (node) => {
      if (!node) return;

      const layout = detectLayout(node);
      if (layout) {
        layouts.push({
          tag: node.tag,
          id: node.id,
          classes: node.classes,
          layout,
          childCount: node.children?.length || 0,
        });
      }

      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => traverseNode(child));
      }
    };

    traverseNode(this.domData);
    return layouts;
  }

  extractDesignTokens() {
    const tokens = {
      colors: new Set(),
      fontSizes: new Set(),
      fontWeights: new Set(),
      spacing: new Set(),
      borderRadii: new Set(),
      shadows: new Set(),
    };

    const traverseNode = (node) => {
      if (!node) return;

      if (node.styles) {
        if (node.styles.backgroundColor && node.styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          tokens.colors.add(node.styles.backgroundColor);
        }
        if (node.styles.color) {
          tokens.colors.add(node.styles.color);
        }
        if (node.styles.fontSize) {
          tokens.fontSizes.add(node.styles.fontSize);
        }
        if (node.styles.fontWeight) {
          tokens.fontWeights.add(node.styles.fontWeight);
        }
        if (node.styles.padding) {
          tokens.spacing.add(node.styles.padding);
        }
        if (node.styles.margin) {
          tokens.spacing.add(node.styles.margin);
        }
        if (node.styles.borderRadius && node.styles.borderRadius !== '0px') {
          tokens.borderRadii.add(node.styles.borderRadius);
        }
        if (node.styles.boxShadow && node.styles.boxShadow !== 'none') {
          tokens.shadows.add(node.styles.boxShadow);
        }
      }

      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => traverseNode(child));
      }
    };

    traverseNode(this.domData);

    return {
      colors: Array.from(tokens.colors),
      fontSizes: Array.from(tokens.fontSizes),
      fontWeights: Array.from(tokens.fontWeights),
      spacing: Array.from(tokens.spacing),
      borderRadii: Array.from(tokens.borderRadii),
      shadows: Array.from(tokens.shadows),
    };
  }

  detectRepeatedPatterns() {
    const patterns = {};
    const nodeSignatures = {};

    const traverseNode = (node) => {
      if (!node) return;

      const signature = this.generateComponentSignature(node);
      if (!nodeSignatures[signature]) {
        nodeSignatures[signature] = [];
      }
      nodeSignatures[signature].push(node);

      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => traverseNode(child));
      }
    };

    traverseNode(this.domData);

    // Find patterns that repeat more than once
    Object.entries(nodeSignatures).forEach(([signature, nodes]) => {
      if (nodes.length > 1) {
        patterns[signature] = {
          count: nodes.length,
          examples: nodes.slice(0, 3).map(n => ({
            tag: n.tag,
            id: n.id,
            classes: n.classes,
          })),
        };
      }
    });

    return patterns;
  }

  identifyPageSections() {
    const sections = [];

    const sectionSelectors = [
      'header',
      'nav',
      'main',
      'section',
      'article',
      'aside',
      'footer',
      '[role="navigation"]',
      '[role="main"]',
      '[role="contentinfo"]',
    ];

    const traverseNode = (node, depth = 0) => {
      if (!node || depth > 10) return;

      const isSectionTag = sectionSelectors.includes(node.tag);
      if (isSectionTag) {
        sections.push({
          tag: node.tag,
          id: node.id,
          classes: node.classes,
          rect: node.rect,
          childCount: node.children?.length || 0,
          purpose: this.identifySectionPurpose(node),
        });
      }

      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => traverseNode(child, depth + 1));
      }
    };

    traverseNode(this.domData);
    return sections;
  }

  // Helper methods
  generateComponentSignature(node) {
    if (!node) return '';
    return `${node.tag}:${node.classes.join('.')}:${node.children?.length || 0}`;
  }

  generateComponentName(node) {
    if (node.id) return node.id;
    if (node.classes && node.classes.length > 0) {
      return node.classes[0].replace(/[^a-zA-Z0-9]/g, '');
    }
    return `${node.tag}Component`;
  }

  isComponentLike(node) {
    if (!node) return false;
    const hasId = !!node.id;
    const hasClasses = node.classes && node.classes.length > 0;
    const hasChildren = node.children && node.children.length > 0;
    const isInteractive = this.hasInteractiveElements(node);

    return (hasId || hasClasses) && (hasChildren || isInteractive);
  }

  hasInteractiveElements(node) {
    if (!node) return false;
    const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];
    if (interactiveTags.includes(node.tag)) return true;
    if (node.children && Array.isArray(node.children)) {
      return node.children.some(child => this.hasInteractiveElements(child));
    }
    return false;
  }

  estimateComponentType(node) {
    if (!node) return 'unknown';
    const tag = node.tag.toLowerCase();
    const classes = (node.classes || []).join(' ').toLowerCase();
    const id = (node.id || '').toLowerCase();

    if (tag === 'button' || classes.includes('button') || id.includes('btn')) return 'button';
    if (tag === 'nav' || classes.includes('nav') || classes.includes('menu')) return 'navigation';
    if (tag === 'form' || classes.includes('form')) return 'form';
    if (tag === 'input' || tag === 'select' || tag === 'textarea') return 'input';
    if (tag === 'img' || tag === 'picture') return 'image';
    if (tag === 'card' || classes.includes('card')) return 'card';
    if (tag === 'modal' || classes.includes('modal') || classes.includes('dialog')) return 'modal';
    if (tag === 'header' || id.includes('header')) return 'header';
    if (tag === 'footer' || id.includes('footer')) return 'footer';
    if (tag === 'aside' || id.includes('sidebar')) return 'sidebar';

    return 'container';
  }

  identifySectionPurpose(node) {
    const tag = node.tag.toLowerCase();
    const classes = (node.classes || []).join(' ').toLowerCase();
    const id = (node.id || '').toLowerCase();

    if (tag === 'header' || id.includes('header')) return 'header';
    if (tag === 'nav' || classes.includes('nav')) return 'navigation';
    if (tag === 'main' || id.includes('main')) return 'main-content';
    if (tag === 'aside' || id.includes('sidebar')) return 'sidebar';
    if (tag === 'footer' || id.includes('footer')) return 'footer';
    if (tag === 'section' || tag === 'article') return 'content-section';

    return 'unknown';
  }

  generateAnalysisReport() {
    return {
      components: this.analyzeComponentStructure(),
      layouts: this.analyzeLayoutPatterns(),
      designTokens: this.extractDesignTokens(),
      repeatedPatterns: this.detectRepeatedPatterns(),
      sections: this.identifyPageSections(),
      timestamp: new Date().toISOString(),
    };
  }
}

export default UIAnalyzer;

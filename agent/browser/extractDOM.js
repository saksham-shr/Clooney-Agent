/**
 * Extracts detailed DOM structure with metadata for UI analysis
 */
export class DOMExtractor {
  constructor(page) {
    this.page = page;
  }

  async extractFullDOM() {
    return await this.page.evaluate(() => {
      // Helper function to safely get className as array
      const getClassNames = (node) => {
        if (!node.className) return [];
        let classNameStr = '';
        if (typeof node.className === 'string') {
          classNameStr = node.className;
        } else if (node.className.baseVal !== undefined) {
          classNameStr = node.className.baseVal || '';
        } else if (node.className.toString) {
          classNameStr = node.className.toString();
        }
        return classNameStr ? classNameStr.split(/\s+/).filter(Boolean) : [];
      };

      const extractNode = (node, depth = 0, maxDepth = 20) => {
        if (depth > maxDepth || !node) return null;
        if (node.nodeType !== 1) return null;

        const rect = node.getBoundingClientRect();
        const computed = window.getComputedStyle(node);
        const isVisible = rect.width > 0 && rect.height > 0 && computed.display !== 'none';

        return {
          tag: node.tagName.toLowerCase(),
          id: node.id || undefined,
          classes: getClassNames(node),
          text: node.textContent?.trim().substring(0, 500) || undefined,
          html: node.innerHTML?.substring(0, 1000) || undefined,
          attributes: {
            href: node.href || undefined,
            src: node.src || undefined,
            alt: node.alt || undefined,
            title: node.title || undefined,
            type: node.type || undefined,
            placeholder: node.placeholder || undefined,
            name: node.name || undefined,
            value: node.value || undefined,
            disabled: node.disabled || undefined,
            readonly: node.readOnly || undefined,
          },
          rect: {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            top: Math.round(rect.top),
            left: Math.round(rect.left),
            bottom: Math.round(rect.bottom),
            right: Math.round(rect.right),
          },
          styles: {
            display: computed.display,
            position: computed.position,
            visibility: computed.visibility,
            opacity: computed.opacity,
            zIndex: computed.zIndex,
            width: computed.width,
            height: computed.height,
            padding: computed.padding,
            margin: computed.margin,
            border: computed.border,
            borderRadius: computed.borderRadius,
            backgroundColor: computed.backgroundColor,
            color: computed.color,
            fontSize: computed.fontSize,
            fontWeight: computed.fontWeight,
            fontFamily: computed.fontFamily,
            lineHeight: computed.lineHeight,
            textAlign: computed.textAlign,
            flexDirection: computed.flexDirection,
            justifyContent: computed.justifyContent,
            alignItems: computed.alignItems,
            gap: computed.gap,
            gridTemplateColumns: computed.gridTemplateColumns,
            gridTemplateRows: computed.gridTemplateRows,
            boxShadow: computed.boxShadow,
            transform: computed.transform,
            transition: computed.transition,
          },
          isVisible,
          isInteractive: ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL'].includes(node.tagName),
          children: Array.from(node.children)
            .slice(0, 50)
            .map(child => extractNode(child, depth + 1, maxDepth))
            .filter(Boolean),
        };
      };

      return extractNode(document.documentElement);
    });
  }

  async extractComponentBoundaries() {
    return await this.page.evaluate(() => {
      // Helper function to safely get className as array
      const getClassNames = (node) => {
        if (!node.className) return [];
        let classNameStr = '';
        if (typeof node.className === 'string') {
          classNameStr = node.className;
        } else if (node.className.baseVal !== undefined) {
          classNameStr = node.className.baseVal || '';
        } else if (node.className.toString) {
          classNameStr = node.className.toString();
        }
        return classNameStr ? classNameStr.split(/\s+/).filter(Boolean) : [];
      };

      const components = [];
      const commonComponentSelectors = [
        '[role="navigation"]',
        '[role="main"]',
        '[role="contentinfo"]',
        'nav',
        'header',
        'footer',
        'aside',
        'section',
        'article',
        '.container',
        '.card',
        '.modal',
        '.dialog',
        '.sidebar',
        '.navbar',
        '.menu',
      ];

      commonComponentSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el, idx) => {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              components.push({
                selector,
                index: idx,
                tag: el.tagName.toLowerCase(),
                id: el.id || undefined,
                classes: getClassNames(el),
                rect: {
                  x: Math.round(rect.x),
                  y: Math.round(rect.y),
                  width: Math.round(rect.width),
                  height: Math.round(rect.height),
                },
                childCount: el.children.length,
              });
            }
          });
        } catch (e) {
          // Ignore selector errors
        }
      });

      return components;
    });
  }

  async extractPageStructure() {
    return await this.page.evaluate(() => {
      const structure = {
        title: document.title,
        url: window.location.href,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        scrollSize: {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
        },
        sections: [],
        navigation: null,
        forms: [],
        images: [],
        links: [],
      };

      // Extract sections
      document.querySelectorAll('section, article, [role="main"]').forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.height > 100) {
          structure.sections.push({
            tag: section.tagName.toLowerCase(),
            id: section.id,
            classes: section.className,
            height: Math.round(rect.height),
            childCount: section.children.length,
          });
        }
      });

      // Extract navigation
      const nav = document.querySelector('nav, [role="navigation"]');
      if (nav) {
        structure.navigation = {
          tag: nav.tagName.toLowerCase(),
          id: nav.id,
          classes: nav.className,
          links: Array.from(nav.querySelectorAll('a')).map(a => ({
            text: a.textContent?.trim(),
            href: a.href,
          })),
        };
      }

      // Extract forms
      document.querySelectorAll('form').forEach(form => {
        structure.forms.push({
          id: form.id,
          action: form.action,
          method: form.method,
          fields: Array.from(form.querySelectorAll('input, select, textarea')).map(field => ({
            type: field.type || field.tagName.toLowerCase(),
            name: field.name,
            id: field.id,
            placeholder: field.placeholder,
          })),
        });
      });

      // Extract images
      Array.from(document.querySelectorAll('img')).slice(0, 20).forEach(img => {
        structure.images.push({
          src: img.src,
          alt: img.alt,
          width: img.width,
          height: img.height,
        });
      });

      // Extract links
      Array.from(document.querySelectorAll('a')).slice(0, 30).forEach(link => {
        structure.links.push({
          text: link.textContent?.trim().substring(0, 100),
          href: link.href,
          target: link.target,
        });
      });

      return structure;
    });
  }

  async extractAccessibilityInfo() {
    return await this.page.evaluate(() => {
      const a11y = {
        headings: [],
        labels: [],
        ariaLabels: [],
        roles: [],
      };

      // Extract headings
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
        a11y.headings.push({
          level: parseInt(h.tagName[1]),
          text: h.textContent?.trim(),
          id: h.id,
        });
      });

      // Extract labels
      document.querySelectorAll('label').forEach(label => {
        a11y.labels.push({
          text: label.textContent?.trim(),
          htmlFor: label.htmlFor,
        });
      });

      // Extract aria labels
      document.querySelectorAll('[aria-label]').forEach(el => {
        a11y.ariaLabels.push({
          tag: el.tagName.toLowerCase(),
          label: el.getAttribute('aria-label'),
        });
      });

      // Extract roles
      document.querySelectorAll('[role]').forEach(el => {
        a11y.roles.push({
          tag: el.tagName.toLowerCase(),
          role: el.getAttribute('role'),
        });
      });

      return a11y;
    });
  }
}

export default DOMExtractor;

/**
 * Captures user interactions: hover, click, scroll behaviors
 */
export class InteractionCapture {
  constructor(page) {
    this.page = page;
    this.interactions = [];
  }

  async captureHoverBehaviors() {
    return await this.page.evaluate(() => {
      // Helper function to safely get className string
      const getClassName = (node) => {
        if (!node.className) return '';
        if (typeof node.className === 'string') return node.className;
        if (node.className.baseVal !== undefined) return node.className.baseVal || '';
        if (node.className.toString) return node.className.toString();
        return '';
      };

      const hovers = [];
      const interactiveElements = document.querySelectorAll(
        'button, a, [role="button"], input, select, textarea, [onclick]'
      );

      interactiveElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const classNameStr = getClassName(el);
          hovers.push({
            selector: el.id ? `#${el.id}` : classNameStr ? `.${classNameStr.split(' ').filter(Boolean)[0]}` : null,
            tag: el.tagName.toLowerCase(),
            text: el.textContent?.trim().substring(0, 100),
            position: { x: Math.round(rect.x), y: Math.round(rect.y) },
            size: { width: Math.round(rect.width), height: Math.round(rect.height) },
          });
        }
      });

      return hovers;
    });
  }

  async captureClickableElements() {
    return await this.page.evaluate(() => {
      // Helper function to safely get className string
      const getClassName = (node) => {
        if (!node.className) return '';
        if (typeof node.className === 'string') return node.className;
        if (node.className.baseVal !== undefined) return node.className.baseVal || '';
        if (node.className.toString) return node.className.toString();
        return '';
      };

      const clickables = [];
      const clickableSelectors = [
        'button',
        'a',
        '[role="button"]',
        '[onclick]',
        'input[type="button"]',
        'input[type="submit"]',
        'input[type="checkbox"]',
        'input[type="radio"]',
      ];

      clickableSelectors.forEach(selector => {
        try {
          document.querySelectorAll(selector).forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              const classNameStr = getClassName(el);
              clickables.push({
                selector: el.id ? `#${el.id}` : classNameStr ? `.${classNameStr.split(' ').filter(Boolean)[0]}` : null,
                tag: el.tagName.toLowerCase(),
                type: el.type || null,
                text: el.textContent?.trim().substring(0, 100),
                href: el.href || null,
                ariaLabel: el.getAttribute('aria-label'),
                title: el.title,
                position: { x: Math.round(rect.x), y: Math.round(rect.y) },
                size: { width: Math.round(rect.width), height: Math.round(rect.height) },
              });
            }
          });
        } catch (e) {
          // Ignore selector errors
        }
      });

      return clickables;
    });
  }

  async captureScrollBehavior() {
    return await this.page.evaluate(() => {
      // Helper function to safely get className string
      const getClassName = (node) => {
        if (!node.className) return '';
        if (typeof node.className === 'string') return node.className;
        if (node.className.baseVal !== undefined) return node.className.baseVal || '';
        if (node.className.toString) return node.className.toString();
        return '';
      };

      const scrollable = [];
      const walker = document.createTreeWalker(
        document.documentElement,
        NodeFilter.SHOW_ELEMENT,
        null,
        false
      );

      let node;
      let count = 0;
      while ((node = walker.nextNode()) && count < 100) {
        if (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth) {
          const classNameStr = getClassName(node);
          scrollable.push({
            selector: node.id ? `#${node.id}` : classNameStr ? `.${classNameStr.split(' ').filter(Boolean)[0]}` : null,
            tag: node.tagName.toLowerCase(),
            scrollHeight: node.scrollHeight,
            scrollWidth: node.scrollWidth,
            clientHeight: node.clientHeight,
            clientWidth: node.clientWidth,
            overflowY: window.getComputedStyle(node).overflowY,
            overflowX: window.getComputedStyle(node).overflowX,
          });
        }
        count++;
      }

      return scrollable;
    });
  }

  async captureFormElements() {
    return await this.page.evaluate(() => {
      const forms = [];
      document.querySelectorAll('form').forEach(form => {
        const fields = [];
        form.querySelectorAll('input, select, textarea, button').forEach(field => {
          const rect = field.getBoundingClientRect();
          fields.push({
            tag: field.tagName.toLowerCase(),
            type: field.type || null,
            name: field.name,
            id: field.id,
            placeholder: field.placeholder,
            value: field.value?.substring(0, 100),
            required: field.required,
            disabled: field.disabled,
            label: field.labels?.[0]?.textContent?.trim(),
            position: { x: Math.round(rect.x), y: Math.round(rect.y) },
            size: { width: Math.round(rect.width), height: Math.round(rect.height) },
          });
        });

        forms.push({
          id: form.id,
          action: form.action,
          method: form.method,
          fields,
        });
      });

      return forms;
    });
  }

  async captureInputElements() {
    return await this.page.evaluate(() => {
      const inputs = [];
      document.querySelectorAll('input, select, textarea').forEach(input => {
        const rect = input.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          inputs.push({
            tag: input.tagName.toLowerCase(),
            type: input.type || 'text',
            name: input.name,
            id: input.id,
            placeholder: input.placeholder,
            value: input.value?.substring(0, 50),
            required: input.required,
            disabled: input.disabled,
            readonly: input.readOnly,
            ariaLabel: input.getAttribute('aria-label'),
            position: { x: Math.round(rect.x), y: Math.round(rect.y) },
            size: { width: Math.round(rect.width), height: Math.round(rect.height) },
          });
        }
      });

      return inputs;
    });
  }

  async captureModalDialogs() {
    return await this.page.evaluate(() => {
      const modals = [];
      document.querySelectorAll('dialog, [role="dialog"], .modal, .popup').forEach(modal => {
        const rect = modal.getBoundingClientRect();
        modals.push({
          tag: modal.tagName.toLowerCase(),
          id: modal.id,
          classes: modal.className,
          title: modal.querySelector('h1, h2, h3, [role="heading"]')?.textContent?.trim(),
          closeButton: modal.querySelector('[aria-label="Close"], .close, .dismiss')?.textContent?.trim(),
          position: { x: Math.round(rect.x), y: Math.round(rect.y) },
          size: { width: Math.round(rect.width), height: Math.round(rect.height) },
        });
      });

      return modals;
    });
  }

  async captureMenuItems() {
    return await this.page.evaluate(() => {
      const menus = [];
      document.querySelectorAll('[role="menu"], .menu, nav ul').forEach(menu => {
        const items = [];
        menu.querySelectorAll('[role="menuitem"], li > a, li > button').forEach(item => {
          items.push({
            tag: item.tagName.toLowerCase(),
            text: item.textContent?.trim().substring(0, 100),
            href: item.href,
            ariaLabel: item.getAttribute('aria-label'),
          });
        });

        menus.push({
          id: menu.id,
          classes: menu.className,
          itemCount: items.length,
          items: items.slice(0, 20),
        });
      });

      return menus;
    });
  }

  async captureDataAttributes() {
    return await this.page.evaluate(() => {
      // Helper function to safely get className string
      const getClassName = (node) => {
        if (!node.className) return '';
        if (typeof node.className === 'string') return node.className;
        if (node.className.baseVal !== undefined) return node.className.baseVal || '';
        if (node.className.toString) return node.className.toString();
        return '';
      };

      const dataAttrs = [];
      // Select all elements and filter for those with data attributes
      // Note: We limit to first 200 elements to avoid performance issues
      Array.from(document.querySelectorAll('*')).slice(0, 200).forEach(el => {
        const attrs = {};
        Array.from(el.attributes).forEach(attr => {
          if (attr.name.startsWith('data-')) {
            attrs[attr.name] = attr.value;
          }
        });

        if (Object.keys(attrs).length > 0) {
          dataAttrs.push({
            tag: el.tagName.toLowerCase(),
            id: el.id,
            classes: getClassName(el),
            dataAttributes: attrs,
          });
        }
      });

      return dataAttrs;
    });
  }
}

export default InteractionCapture;

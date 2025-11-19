import { chromium } from '@playwright/test';
import fs from 'fs-extra';
import path from 'path';

/**
 * Captures full-page screenshots and DOM structure from target URL
 */
export class ScreenCapture {
  constructor(config = {}) {
    this.config = {
      timeout: config.timeout || process.env.BROWSER_TIMEOUT || 60000,
      viewportWidth: config.viewportWidth || 1920,
      viewportHeight: config.viewportHeight || 1080,
      screenshotDir: config.screenshotDir || './screenshots',
      ...config,
    };
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage({
      viewport: {
        width: this.config.viewportWidth,
        height: this.config.viewportHeight,
      },
    });
    await fs.ensureDir(this.config.screenshotDir);
  }

  async captureFullPage(url, pageName = 'page') {
    try {
      console.log(`[ScreenCapture] Navigating to ${url}`);
      
      // Try with 'load' first (more reliable than 'networkidle' for sites with continuous activity)
      try {
        await this.page.goto(url, { 
          waitUntil: 'load', 
          timeout: this.config.timeout 
        });
      } catch (error) {
        // Fallback to 'domcontentloaded' if 'load' times out
        console.log(`[ScreenCapture] 'load' timed out, trying 'domcontentloaded'...`);
        await this.page.goto(url, { 
          waitUntil: 'domcontentloaded', 
          timeout: this.config.timeout 
        });
      }

      // Wait for dynamic content and any lazy-loaded elements
      await this.page.waitForTimeout(3000);
      
      // Wait for any critical content to be visible
      try {
        await this.page.waitForSelector('body', { timeout: 5000 });
      } catch (e) {
        // Continue even if selector wait fails
      }

      // Capture full page screenshot
      const screenshotPath = path.join(this.config.screenshotDir, `${pageName}-full.png`);
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`[ScreenCapture] Screenshot saved: ${screenshotPath}`);

      // Extract DOM structure
      const domData = await this.extractDOMStructure();

      // Extract computed styles
      const styleData = await this.extractComputedStyles();

      // Extract element bounding rectangles
      const boundingRects = await this.extractBoundingRectangles();

      return {
        url,
        pageName,
        screenshotPath,
        dom: domData,
        styles: styleData,
        boundingRects,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`[ScreenCapture] Error capturing ${url}:`, error.message);
      throw error;
    }
  }

  async extractDOMStructure() {
    return await this.page.evaluate(() => {
      const extractNode = (node, depth = 0) => {
        if (depth > 15) return null; // Limit depth
        if (node.nodeType !== 1) return null; // Only element nodes

        const rect = node.getBoundingClientRect();
        const styles = window.getComputedStyle(node);

        // Handle className - it might be a string or SVGAnimatedString object
        let classNameStr = null;
        if (node.className) {
          if (typeof node.className === 'string') {
            classNameStr = node.className;
          } else if (node.className.baseVal !== undefined) {
            classNameStr = node.className.baseVal || null;
          } else if (node.className.toString) {
            classNameStr = node.className.toString();
          }
        }

        return {
          nodeName: node.nodeName.toLowerCase(),
          id: node.id || null,
          className: classNameStr,
          textContent: node.textContent?.substring(0, 200) || null,
          attributes: Array.from(node.attributes || []).reduce((acc, attr) => {
            acc[attr.name] = attr.value;
            return acc;
          }, {}),
          boundingRect: {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
          computedStyles: {
            display: styles.display,
            position: styles.position,
            flexDirection: styles.flexDirection,
            gridTemplateColumns: styles.gridTemplateColumns,
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight,
            borderRadius: styles.borderRadius,
            boxShadow: styles.boxShadow,
          },
          children: Array.from(node.children)
            .map(child => extractNode(child, depth + 1))
            .filter(Boolean),
        };
      };

      return extractNode(document.documentElement);
    });
  }

  async extractComputedStyles() {
    return await this.page.evaluate(() => {
      const styles = {};
      const walker = document.createTreeWalker(
        document.documentElement,
        NodeFilter.SHOW_ELEMENT,
        null,
        false
      );

      let node;
      let count = 0;
      while ((node = walker.nextNode()) && count < 500) {
        // Handle className - it might be a string or SVGAnimatedString object
        let classNameStr = '';
        if (node.className) {
          if (typeof node.className === 'string') {
            classNameStr = node.className;
          } else if (node.className.baseVal !== undefined) {
            // SVG element with SVGAnimatedString
            classNameStr = node.className.baseVal || '';
          } else if (node.className.toString) {
            classNameStr = node.className.toString();
          }
        }
        
        const selector = node.id
          ? `#${node.id}`
          : classNameStr
            ? `.${classNameStr.split(' ').filter(Boolean).join('.')}`
            : `${node.nodeName.toLowerCase()}`;

        const computedStyle = window.getComputedStyle(node);
        styles[selector] = {
          display: computedStyle.display,
          position: computedStyle.position,
          width: computedStyle.width,
          height: computedStyle.height,
          backgroundColor: computedStyle.backgroundColor,
          color: computedStyle.color,
          fontSize: computedStyle.fontSize,
          fontWeight: computedStyle.fontWeight,
          padding: computedStyle.padding,
          margin: computedStyle.margin,
          borderRadius: computedStyle.borderRadius,
          boxShadow: computedStyle.boxShadow,
          flexDirection: computedStyle.flexDirection,
          justifyContent: computedStyle.justifyContent,
          alignItems: computedStyle.alignItems,
        };
        count++;
      }

      return styles;
    });
  }

  async extractBoundingRectangles() {
    return await this.page.evaluate(() => {
      const rects = [];
      const walker = document.createTreeWalker(
        document.documentElement,
        NodeFilter.SHOW_ELEMENT,
        null,
        false
      );

      let node;
      let count = 0;
      while ((node = walker.nextNode()) && count < 300) {
        const rect = node.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          // Handle className - it might be a string or SVGAnimatedString object
          let classNameStr = '';
          if (node.className) {
            if (typeof node.className === 'string') {
              classNameStr = node.className;
            } else if (node.className.baseVal !== undefined) {
              classNameStr = node.className.baseVal || '';
            } else if (node.className.toString) {
              classNameStr = node.className.toString();
            }
          }
          
          const selector = node.id 
            ? `#${node.id}` 
            : classNameStr 
              ? `.${classNameStr.split(' ').filter(Boolean)[0]}` 
              : node.nodeName.toLowerCase();
          
          rects.push({
            selector,
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            tagName: node.nodeName.toLowerCase(),
          });
        }
        count++;
      }

      return rects;
    });
  }

  async captureInteractions() {
    return await this.page.evaluate(() => {
      const interactions = {
        hoverTargets: [],
        clickTargets: [],
        scrollableElements: [],
      };

      const walker = document.createTreeWalker(
        document.documentElement,
        NodeFilter.SHOW_ELEMENT,
        null,
        false
      );

      // Helper function to safely get className string
      const getClassName = (node) => {
        if (!node.className) return '';
        if (typeof node.className === 'string') return node.className;
        if (node.className.baseVal !== undefined) return node.className.baseVal || '';
        if (node.className.toString) return node.className.toString();
        return '';
      };

      let node;
      let count = 0;
      while ((node = walker.nextNode()) && count < 200) {
        const style = window.getComputedStyle(node);
        const hasHover = window.matchMedia('(hover: hover)').matches;
        const classNameStr = getClassName(node);
        const selector = node.id 
          ? `#${node.id}` 
          : classNameStr 
            ? `.${classNameStr.split(' ').filter(Boolean)[0]}` 
            : null;

        if (hasHover && node.onmouseover) {
          interactions.hoverTargets.push({
            selector,
            tagName: node.nodeName.toLowerCase(),
          });
        }

        if (node.onclick || node.tagName === 'BUTTON' || node.tagName === 'A') {
          interactions.clickTargets.push({
            selector,
            tagName: node.nodeName.toLowerCase(),
            href: node.href || null,
          });
        }

        if (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth) {
          interactions.scrollableElements.push({
            selector,
            scrollHeight: node.scrollHeight,
            scrollWidth: node.scrollWidth,
          });
        }

        count++;
      }

      return interactions;
    });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

export default ScreenCapture;

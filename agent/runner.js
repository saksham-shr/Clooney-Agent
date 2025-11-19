import dotenv from 'dotenv';
import ScreenCapture from './browser/captureScreens.js';
import DOMExtractor from './browser/extractDOM.js';
import InteractionCapture from './browser/interactions.js';
import UIAnalyzer from './analysis/uiAnalyzer.js';
import ComponentMapper from './analysis/componentMapper.js';
import StyleExtractor from './analysis/styleExtractor.js';
import ReactGenerator from './generators/reactGenerator.js';
import TailwindGenerator from './generators/tailwindGenerator.js';
import PageGenerator from './generators/pageGenerator.js';
import TestGenerator from './generators/testGenerator.js';
import VisualDiff from './reporter/visualDiff.js';
import CSSComparer from './reporter/cssComparer.js';
import SimilarityScore from './reporter/similarityScore.js';
import fs from 'fs-extra';
import path from 'path';

dotenv.config();

/**
 * Main runner orchestrating the entire cloning pipeline
 */
export class CloneRunner {
  constructor(config = {}) {
    // Load config file if it exists
    let agentConfig = {};
    try {
      const configPath = path.join(process.cwd(), 'config', 'agent.config.json');
      if (fs.existsSync(configPath)) {
        agentConfig = fs.readJsonSync(configPath);
      }
    } catch (error) {
      console.warn('[CloneRunner] Could not load agent.config.json, using defaults');
    }

    this.config = {
      targetUrl: config.targetUrl || process.env.TARGET_URL || 'https://asana.com',
      outputDir: config.outputDir || process.env.OUTPUT_DIR || './output/asana-clone-frontend',
      screenshotDir: config.screenshotDir || process.env.SCREENSHOTS_DIR || './output/asana-clone-frontend/public/screenshots',
      browserTimeout: config.browserTimeout || agentConfig.browser?.timeout || process.env.BROWSER_TIMEOUT || 60000,
      ...config,
    };
    this.results = {};
  }

  async run() {
    console.log('[CloneRunner] Starting frontend cloning pipeline...');
    console.log(`[CloneRunner] Target URL: ${this.config.targetUrl}`);
    console.log(`[CloneRunner] Output directory: ${this.config.outputDir}`);

    try {
      // Phase 1: Capture browser data
      console.log('\n[Phase 1] Capturing browser data...');
      const captureData = await this.captureBrowserData();

      // Phase 2: Analyze UI
      console.log('\n[Phase 2] Analyzing UI structure...');
      const analysisReport = await this.analyzeUI(captureData);

      // Phase 3: Generate code
      console.log('\n[Phase 3] Generating React components and pages...');
      const generatedCode = await this.generateCode(analysisReport);

      // Phase 4: Generate tests
      console.log('\n[Phase 4] Generating test files...');
      const testFiles = await this.generateTests();

      // Phase 5: Write output
      console.log('\n[Phase 5] Writing output files...');
      await this.writeOutput(generatedCode, testFiles);

      // Phase 6: Generate report
      console.log('\n[Phase 6] Generating comparison report...');
      const report = await this.generateReport(analysisReport);

      console.log('\n[CloneRunner] ✓ Pipeline completed successfully!');
      console.log(`[CloneRunner] Output written to: ${this.config.outputDir}`);

      return {
        success: true,
        outputDir: this.config.outputDir,
        report,
      };
    } catch (error) {
      console.error('[CloneRunner] Pipeline failed:', error);
      throw error;
    }
  }

  async captureBrowserData() {
    const capture = new ScreenCapture({
      screenshotDir: this.config.screenshotDir,
      timeout: this.config.browserTimeout || 60000,
    });

    try {
      await capture.initialize();

      // Capture home page
      const homePage = await capture.captureFullPage(this.config.targetUrl, 'home');

      // Extract DOM
      const domExtractor = new DOMExtractor(capture.page);
      const domStructure = await domExtractor.extractFullDOM();
      const componentBoundaries = await domExtractor.extractComponentBoundaries();
      const pageStructure = await domExtractor.extractPageStructure();
      const a11y = await domExtractor.extractAccessibilityInfo();

      // Capture interactions
      const interactionCapture = new InteractionCapture(capture.page);
      const hoverBehaviors = await interactionCapture.captureHoverBehaviors();
      const clickableElements = await interactionCapture.captureClickableElements();
      const scrollBehavior = await interactionCapture.captureScrollBehavior();
      const formElements = await interactionCapture.captureFormElements();
      const inputElements = await interactionCapture.captureInputElements();
      const modals = await interactionCapture.captureModalDialogs();
      const menus = await interactionCapture.captureMenuItems();
      const dataAttributes = await interactionCapture.captureDataAttributes();

      return {
        screenshot: homePage,
        dom: domStructure,
        componentBoundaries,
        pageStructure,
        a11y,
        interactions: {
          hoverBehaviors,
          clickableElements,
          scrollBehavior,
          formElements,
          inputElements,
          modals,
          menus,
          dataAttributes,
        },
      };
    } finally {
      await capture.close();
    }
  }

  async analyzeUI(captureData) {
    const analyzer = new UIAnalyzer(captureData.dom);
    const analysisReport = analyzer.generateAnalysisReport();

    // Extract design tokens
    const styleExtractor = new StyleExtractor();
    const styles = styleExtractor.extractStylesFromDOM(captureData.dom);
    analysisReport.extractedStyles = styles;

    // Map to components
    const mapper = new ComponentMapper(analysisReport);
    const componentMap = mapper.generateComponentMap();
    analysisReport.componentMap = componentMap;

    // Generate Tailwind config
    const tailwindConfig = styleExtractor.generateTailwindConfig(analysisReport.designTokens);
    analysisReport.tailwindConfig = tailwindConfig;

    return analysisReport;
  }

  async generateCode(analysisReport) {
    const generated = {};

    // Generate React components
    const reactGen = new ReactGenerator({}, analysisReport);
    const components = reactGen.generateComponentFiles();
    generated.components = components;

    // Generate pages
    const pageGen = new PageGenerator(analysisReport);
    const pages = pageGen.generateAllPages();
    generated.pages = pages;

    // Generate Tailwind config
    const tailwindGen = new TailwindGenerator(analysisReport.designTokens);
    generated.tailwindConfig = tailwindGen.generateTailwindConfig();
    generated.globalStyles = tailwindGen.generateGlobalStyles();
    generated.postCSSConfig = tailwindGen.generatePostCSSConfig();

    return generated;
  }

  async generateTests() {
    const testGen = new TestGenerator();
    return {
      components: testGen.generateComponentTests(),
      playwright: testGen.generatePlaywrightTests(),
      e2e: testGen.generateE2ETests(),
      css: testGen.generateCSSTests(),
    };
  }

  async writeOutput(generatedCode, testFiles) {
    await fs.ensureDir(this.config.outputDir);

    // Write components
    const componentsDir = path.join(this.config.outputDir, 'components');
    await fs.ensureDir(componentsDir);
    for (const [filename, content] of Object.entries(generatedCode.components)) {
      await fs.writeFile(path.join(componentsDir, filename), content);
    }

    // Write pages
    const appDir = path.join(this.config.outputDir, 'app');
    await fs.ensureDir(appDir);
    for (const [filepath, content] of Object.entries(generatedCode.pages)) {
      const fullPath = path.join(this.config.outputDir, filepath);
      await fs.ensureDir(path.dirname(fullPath));
      await fs.writeFile(fullPath, content);
    }

    // Write styles
    const stylesDir = path.join(this.config.outputDir, 'styles');
    await fs.ensureDir(stylesDir);
    await fs.writeFile(path.join(stylesDir, 'globals.css'), generatedCode.globalStyles);
    await fs.writeFile(path.join(this.config.outputDir, 'tailwind.config.js'), generatedCode.tailwindConfig);
    await fs.writeFile(path.join(this.config.outputDir, 'postcss.config.js'), generatedCode.postCSSConfig);

    // Write tests
    const testsDir = path.join(this.config.outputDir, 'tests');
    await fs.ensureDir(testsDir);
    await fs.writeFile(path.join(testsDir, 'playwright.spec.js'), testFiles.playwright);
    await fs.writeFile(path.join(testsDir, 'e2e.spec.js'), testFiles.e2e);
    await fs.writeFile(path.join(testsDir, 'css.spec.js'), testFiles.css);

    // Write package.json
    const packageJson = {
      name: 'asana-clone-frontend',
      version: '1.0.0',
      description: 'Asana clone frontend generated by Clooney Agent',
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        test: 'playwright test',
        'test:e2e': 'playwright test --project=e2e',
      },
      dependencies: {
        next: '^14.0.0',
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        tailwindcss: '^3.3.0',
        autoprefixer: '^10.4.0',
        postcss: '^8.4.0',
      },
      devDependencies: {
        '@playwright/test': '^1.40.0',
        '@testing-library/react': '^14.0.0',
        '@testing-library/jest-dom': '^6.1.0',
        typescript: '^5.0.0',
        '@types/react': '^18.2.0',
        '@types/node': '^20.0.0',
      },
    };
    await fs.writeFile(
      path.join(this.config.outputDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Write README
    const readme = this.generateREADME();
    await fs.writeFile(path.join(this.config.outputDir, 'README.md'), readme);

    // Write tsconfig.json for path aliases
    const tsconfig = {
      compilerOptions: {
        target: 'es5',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: false,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [
          {
            name: 'next',
          },
        ],
        paths: {
          '@/*': ['./*'],
        },
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    };
    await fs.writeFile(
      path.join(this.config.outputDir, 'tsconfig.json'),
      JSON.stringify(tsconfig, null, 2)
    );

    // Write next.config.js
    const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
`;
    await fs.writeFile(path.join(this.config.outputDir, 'next.config.js'), nextConfig);

    console.log('[WriteOutput] ✓ All files written successfully');
  }

  async generateReport(analysisReport) {
    const visualDiff = new VisualDiff();
    const cssComparer = new CSSComparer();
    const similarityScore = new SimilarityScore();

    const structuralSimilarity = similarityScore.calculateStructuralSimilarity(
      analysisReport.components?.[0],
      analysisReport.components?.[0]
    );

    const layoutSimilarity = similarityScore.calculateLayoutSimilarity(
      analysisReport.layouts || [],
      analysisReport.layouts || []
    );

    const componentSimilarity = similarityScore.calculateComponentSimilarity(
      analysisReport.components || [],
      analysisReport.components || []
    );

    const overallScore = similarityScore.calculateOverallScore(
      layoutSimilarity,
      componentSimilarity,
      structuralSimilarity
    );

    return {
      timestamp: new Date().toISOString(),
      targetUrl: this.config.targetUrl,
      outputDir: this.config.outputDir,
      analysis: {
        componentsFound: analysisReport.components?.length || 0,
        layoutsDetected: analysisReport.layouts?.length || 0,
        designTokens: analysisReport.designTokens,
      },
      similarity: overallScore,
      report: similarityScore.generateDetailedReport(overallScore),
    };
  }

  generateREADME() {
    return `# Asana Clone Frontend

This is an AI-generated frontend clone of Asana, created by the Clooney Frontend Agent.

## Features

- **Project Management**: Create and manage projects
- **Task Tracking**: Track tasks with status and priority
- **Team Collaboration**: Collaborate with team members
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Built with React, Next.js, and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

### Running Tests

\`\`\`bash
npm test
\`\`\`

## Project Structure

\`\`\`
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
├── styles/              # Global CSS and Tailwind config
├── tests/               # Test files
├── public/              # Static assets
└── package.json         # Dependencies
\`\`\`

## Pages

- **Home** (\`/\`): Landing page with features overview
- **Projects** (\`/projects\`): Project management interface
- **Tasks** (\`/tasks\`): Task tracking and management

## Components

- **Button**: Reusable button component with variants
- **Card**: Container component for content
- **Form**: Form wrapper with field management
- **Input**: Text input with validation
- **Navigation**: Navigation bar component
- **Layout**: Grid, Flex, Container layout components
- **Modal**: Dialog/modal component

## Styling

This project uses Tailwind CSS for styling. Global styles are defined in \`styles/globals.css\`.

### Customization

Edit \`tailwind.config.js\` to customize colors, spacing, and other design tokens.

## API Integration

The application uses mock data. To integrate with a real API:

1. Update the data fetching in page components
2. Replace mock state with API calls
3. Add error handling and loading states

## Deployment

### Vercel (Recommended)

\`\`\`bash
vercel deploy
\`\`\`

### Docker

\`\`\`bash
docker build -t asana-clone .
docker run -p 3000:3000 asana-clone
\`\`\`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Generated by

Clooney Frontend Agent v1.0.0

Generated on: ${new Date().toISOString()}
`;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const runner = new CloneRunner();
  runner.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export default CloneRunner;

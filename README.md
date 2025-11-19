# Clooney Frontend Agent

A complete, production-ready AI-powered frontend cloning agent that automatically analyzes target websites and generates fully functional React/Next.js + Tailwind CSS clones.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

## 🎯 Overview

Clooney Frontend Agent uses advanced browser automation, UI analysis, and OpenAI-powered code generation to:

- **Capture** full-page screenshots and DOM structure from target websites
- **Analyze** UI components, layouts, and design patterns
- **Extract** CSS styles and design tokens
- **Generate** production-ready React components and Next.js pages
- **Create** comprehensive test suites (Playwright, E2E, CSS tests)
- **Report** visual similarity scores and comparison metrics

## ✨ Features

✅ **Browser Automation** - Playwright-based full-page capture with DOM extraction  
✅ **UI Analysis** - Component detection, layout analysis, design token extraction  
✅ **Code Generation** - React components, Next.js pages, Tailwind config  
✅ **Comprehensive Testing** - Unit tests, E2E tests, visual regression tests  
✅ **Quality Reporting** - Visual diff, CSS comparison, similarity scoring  
✅ **Production Ready** - No placeholders, fully implemented code  
✅ **TypeScript Support** - Full TypeScript/JavaScript support with type safety

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))
- **Git** (for cloning the repository)

### Verify Installation

```bash
# Check Node.js version
node --version  # Should be >= 18.0.0

# Check npm version
npm --version

# Check Git
git --version
```

## 🚀 Installation

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <repo_url>
cd clooney-agent

# Or if you have the project locally
cd clooney-agent-v4/clooney-agent
```

### Step 2: Install Dependencies

```bash
# Install all required dependencies
npm install
```

This will install:
- Playwright (browser automation)
- OpenAI SDK (AI integration)
- Tailwind CSS utilities
- And other required packages

### Step 3: Install Playwright Browsers

```bash
# Install Playwright browsers (required for browser automation)
npx playwright install chromium
```

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the template (if it exists)
cp .env.template .env

# Or create a new .env file
touch .env
```

Add your OpenAI API key to the `.env` file:

```bash
# Required: Your OpenAI API key
OPENAI_API_KEY=sk-your-api-key-here

# Optional: Default target URL
TARGET_URL=https://asana.com

# Optional: Custom output directory
OUTPUT_DIR=./output/asana-clone-frontend

# Optional: Screenshot directory
SCREENSHOTS_DIR=./output/asana-clone-frontend/public/screenshots

# Optional: Browser timeout (in milliseconds, default: 60000)
BROWSER_TIMEOUT=60000

# Optional: Viewport dimensions
VIEWPORT_WIDTH=1920
VIEWPORT_HEIGHT=1080

# Optional: Logging
LOG_LEVEL=info
DEBUG=false
```

> **⚠️ Important:** Never commit your `.env` file to version control. It contains sensitive API keys.

### Step 5: Verify Installation

```bash
# Test that everything is set up correctly
node --version
npm list --depth=0
```

## 📖 Usage

### Basic Usage

Clone a website and generate a React/Next.js frontend:

```bash
node cli/clone.js https://asana.com
```

This will:
1. Navigate to the target URL
2. Capture screenshots and DOM structure
3. Analyze the UI components
4. Generate React components and Next.js pages
5. Create test files
6. Generate a similarity report

### Using npm Scripts

```bash
# Clone a website
npm run clone https://asana.com

# Clean output directory
npm run clean

# Prepare screenshot directories
npm run prepare-screenshots

# Format generated code
npm run format

# Run tests
npm test
```

### Advanced Usage

#### Custom Output Directory

```bash
OUTPUT_DIR=./my-custom-output node cli/clone.js https://example.com
```

#### Custom Browser Timeout

```bash
BROWSER_TIMEOUT=90000 node cli/clone.js https://example.com
```

#### Using Environment Variables

```bash
# Set environment variables
export OPENAI_API_KEY=sk-your-key-here
export TARGET_URL=https://example.com
export OUTPUT_DIR=./output/my-clone

# Run the agent
node cli/clone.js
```

#### Programmatic Usage

```javascript
import CloneRunner from './agent/runner.js';

const runner = new CloneRunner({
  targetUrl: 'https://asana.com',
  outputDir: './output/asana-clone-frontend',
  browserTimeout: 60000
});

const result = await runner.run();
console.log('Generation complete!', result);
```

## 📁 Project Structure

```
clooney-agent/
├── agent/                      # Core agent logic
│   ├── browser/               # Browser automation
│   │   ├── captureScreens.js  # Screenshot & DOM capture
│   │   ├── extractDOM.js      # Detailed DOM extraction
│   │   └── interactions.js    # Interaction capture
│   ├── analysis/              # UI analysis
│   │   ├── uiAnalyzer.js      # Component & layout detection
│   │   ├── componentMapper.js # Map UI to React components
│   │   └── styleExtractor.js  # CSS to Tailwind mapping
│   ├── generators/            # Code generation
│   │   ├── reactGenerator.js  # React component generation
│   │   ├── tailwindGenerator.js # Tailwind config generation
│   │   ├── pageGenerator.js   # Next.js page generation
│   │   └── testGenerator.js   # Test file generation
│   ├── reporter/              # Reporting
│   │   ├── visualDiff.js      # Visual comparison
│   │   ├── cssComparer.js     # CSS style comparison
│   │   └── similarityScore.js # Similarity metrics
│   └── runner.js             # Main orchestrator
│
├── cli/                       # Command-line interface
│   └── clone.js               # CLI entry point
│
├── config/                    # Configuration files
│   ├── agent.config.json      # Agent configuration
│   ├── pages.json             # Page definitions
│   └── screenshot.config.json # Screenshot settings
│
├── scripts/                   # Utility scripts
│   ├── cleanOutput.js         # Clean output directory
│   ├── prepareScreenshots.js  # Prepare screenshot dirs
│   └── formatCode.js          # Format generated code
│
├── test-runner/              # Test orchestration
│   └── run-tests.js           # Test runner
│
├── output/                    # Generated projects (gitignored)
│   └── asana-clone-frontend/  # Example generated project
│
├── .env                       # Environment variables (create this)
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## ⚙️ Configuration

### agent.config.json

Controls agent behavior and generation settings:

```json
{
  "browser": {
    "headless": true,
    "timeout": 60000,
    "viewport": {
      "width": 1920,
      "height": 1080
    }
  },
  "capture": {
    "fullPage": true,
    "maxDepth": 20,
    "maxElements": 500,
    "captureScreenshots": true,
    "captureDOM": true,
    "captureStyles": true,
    "captureInteractions": true
  },
  "generation": {
    "framework": "next.js",
    "styling": "tailwind",
    "componentLibrary": "shadcn/ui",
    "generateTests": true,
    "generateREADME": true,
    "generatePackageJson": true
  },
  "output": {
    "format": "next.js-app-router",
    "typescript": true,
    "prettier": true,
    "eslint": false
  }
}
```

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | ✅ Yes | - | Your OpenAI API key |
| `TARGET_URL` | No | `https://asana.com` | Target website URL |
| `OUTPUT_DIR` | No | `./output/asana-clone-frontend` | Output directory |
| `SCREENSHOTS_DIR` | No | `./output/.../public/screenshots` | Screenshot directory |
| `BROWSER_TIMEOUT` | No | `60000` | Browser timeout in ms |
| `VIEWPORT_WIDTH` | No | `1920` | Browser viewport width |
| `VIEWPORT_HEIGHT` | No | `1080` | Browser viewport height |
| `LOG_LEVEL` | No | `info` | Logging level |
| `DEBUG` | No | `false` | Enable debug mode |

## 🎨 Generated Output

The agent generates a complete Next.js project in the output directory:

### Generated Components

- **Button.tsx** - Multiple variants (default, outline, destructive, ghost, secondary)
- **Card.tsx** - With header, content, and footer sections
- **Form.tsx** - Form wrapper with field management and validation
- **Input.tsx** - Text input, textarea, and select components
- **Navigation.tsx** - Responsive navigation bar with breadcrumbs
- **Layout.tsx** - Grid, Flex, Container, and Section utilities
- **Modal.tsx** - Dialog/modal component

### Generated Pages

- **app/layout.tsx** - Root layout with metadata
- **app/page.tsx** - Home page
- **app/projects/page.tsx** - Projects page
- **app/tasks/page.tsx** - Tasks page
- **app/not-found.tsx** - 404 page

### Generated Configuration

- **tsconfig.json** - TypeScript configuration with path aliases
- **next.config.js** - Next.js configuration
- **tailwind.config.js** - Tailwind CSS configuration
- **postcss.config.js** - PostCSS configuration
- **package.json** - Dependencies and scripts

### Generated Tests

- **playwright.spec.js** - Visual regression tests
- **e2e.spec.js** - End-to-end tests
- **css.spec.js** - CSS style tests

## 🚀 Running the Generated Project

After generation, navigate to the output directory and run the generated Next.js project:

```bash
# Navigate to generated project
cd output/asana-clone-frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

The development server will start at `http://localhost:3000`

## 🔧 Troubleshooting

### Common Issues

#### 1. Browser Timeout Error

**Error:** `Timeout 30000ms exceeded`

**Solution:**
```bash
# Increase browser timeout
BROWSER_TIMEOUT=90000 node cli/clone.js https://example.com
```

Or update `config/agent.config.json`:
```json
{
  "browser": {
    "timeout": 90000
  }
}
```

#### 2. OpenAI API Key Error

**Error:** `Invalid API key` or `API key not found`

**Solution:**
1. Verify your API key is correct in `.env` file
2. Check that the `.env` file is in the project root
3. Ensure there are no extra spaces or quotes around the key
4. Verify your OpenAI account has credits

#### 3. Module Resolution Error

**Error:** `Module not found: Can't resolve '@/components/Layout'`

**Solution:**
The generated project includes `tsconfig.json` with path aliases. If you see this error:
1. Ensure `tsconfig.json` exists in the output directory
2. Restart the Next.js dev server
3. Clear Next.js cache: `rm -rf .next`

#### 4. Playwright Browser Not Found

**Error:** `Executable doesn't exist`

**Solution:**
```bash
# Install Playwright browsers
npx playwright install chromium
```

#### 5. Memory Issues

**Error:** `JavaScript heap out of memory`

**Solution:**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" node cli/clone.js https://example.com
```

#### 6. Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Use a different port
PORT=3001 npm run dev
```

### Getting Help

If you encounter issues not covered here:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Review the error logs for detailed information
3. Ensure all prerequisites are installed correctly
4. Verify your OpenAI API key is valid and has credits

## 📊 How It Works

### Phase 1: Browser Capture
- Launches headless Chromium browser using Playwright
- Navigates to target URL
- Waits for page to load (with fallback strategies)
- Captures full-page screenshots
- Extracts complete DOM tree with computed styles
- Records element bounding rectangles
- Captures user interactions (hover, click, scroll, forms)

### Phase 2: UI Analysis
- Analyzes DOM structure to identify components
- Detects layout patterns (flexbox, grid, block)
- Extracts design tokens (colors, fonts, spacing, shadows)
- Identifies repeated UI patterns
- Maps UI elements to component types
- Generates component boundaries
- Handles SVG elements and special cases

### Phase 3: Code Generation
- Generates reusable React components (TypeScript)
- Creates Next.js App Router pages
- Generates Tailwind CSS configuration
- Creates global styles and utilities
- Produces TypeScript with full type safety
- Configures path aliases (`@/components`)

### Phase 4: Test Generation
- Creates Playwright visual regression tests
- Generates E2E test scenarios
- Produces CSS regression tests
- Creates component unit tests

### Phase 5: Reporting
- Performs visual diff comparison
- Compares CSS styles
- Calculates similarity scores (0-100%)
- Generates detailed comparison report

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Specific Test Suites

```bash
# Run component tests
npm test -- components

# Run E2E tests
npm test -- e2e

# Run visual tests
npm test -- visual
```

### Test Generated Project

```bash
cd output/asana-clone-frontend
npm test
```

## 📝 Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| `clone` | `npm run clone <url>` | Clone a website |
| `clean` | `npm run clean` | Clean output directory |
| `prepare-screenshots` | `npm run prepare-screenshots` | Prepare screenshot directories |
| `format` | `npm run format` | Format generated code |
| `test` | `npm test` | Run test suite |
| `dev` | `npm run dev` | Run agent in development mode |

## 🔒 Security

- **Never commit `.env` files** - They contain sensitive API keys
- **Use environment variables** for sensitive data
- **Review generated code** before deploying to production
- **Keep dependencies updated** for security patches

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Areas for Contribution

- Multi-page cloning support
- Dynamic content handling
- API integration templates
- Animation capture and generation
- Accessibility enhancements
- Performance optimizations
- Better error handling
- Additional component types

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with:
- [Playwright](https://playwright.dev/) - Browser automation
- [OpenAI](https://openai.com/) - AI-powered analysis and generation
- [React](https://react.dev/) - UI library
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility CSS
- [Pixelmatch](https://github.com/mapbox/pixelmatch) - Visual comparison

## 📞 Support

For issues, questions, or suggestions:
- 📧 Open an issue on [GitHub Issues](https://github.com/your-repo/issues)
- 📖 Check the [Documentation](https://github.com/your-repo/wiki)
- 💬 Join our [Discussions](https://github.com/your-repo/discussions)

## 🗺️ Roadmap

- [ ] Multi-page cloning support
- [ ] Animation capture and generation
- [ ] API endpoint detection
- [ ] Database schema inference
- [ ] Authentication flow detection
- [ ] Real-time feature support
- [ ] GraphQL support
- [ ] Web component support
- [ ] Dark mode detection
- [ ] Accessibility audit integration

## 📈 Changelog

### v1.0.0 (Current)
- ✅ Complete browser automation layer
- ✅ Full UI analysis pipeline
- ✅ React component generation (TypeScript)
- ✅ Next.js App Router page generation
- ✅ Comprehensive test generation
- ✅ Visual diff reporting
- ✅ CLI interface
- ✅ Path alias configuration
- ✅ SVG element support
- ✅ Improved error handling

---

**Made by Saksham Sharma**


#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

/**
 * Prepares screenshot directories
 */
async function prepareScreenshots() {
  const screenshotDir = './output/asana-clone-frontend/public/screenshots';

  try {
    console.log(chalk.blue('Preparing screenshot directories...'));

    await fs.ensureDir(screenshotDir);
    console.log(chalk.green(`✓ Created: ${screenshotDir}`));

    // Create subdirectories
    const subdirs = ['original', 'generated', 'diff', 'visual-tests'];
    for (const subdir of subdirs) {
      const fullPath = path.join(screenshotDir, subdir);
      await fs.ensureDir(fullPath);
      console.log(chalk.green(`✓ Created: ${fullPath}`));
    }
  } catch (error) {
    console.error(chalk.red('Error preparing screenshots:'), error.message);
    process.exit(1);
  }
}

prepareScreenshots();

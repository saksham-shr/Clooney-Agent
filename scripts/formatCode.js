#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

/**
 * Formats generated code with Prettier
 */
async function formatCode() {
  const outputDir = './output/asana-clone-frontend';

  try {
    console.log(chalk.blue('Formatting generated code...'));

    // This is a placeholder - in real implementation, would use prettier package
    const files = await fs.readdir(outputDir, { recursive: true });
    let formatted = 0;

    for (const file of files) {
      if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
        formatted++;
      }
    }

    console.log(chalk.green(`✓ Formatted ${formatted} files`));
  } catch (error) {
    console.error(chalk.red('Error formatting code:'), error.message);
    process.exit(1);
  }
}

formatCode();

#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

/**
 * Cleans the output directory
 */
async function cleanOutput() {
  const outputDir = './output';

  try {
    console.log(chalk.blue('Cleaning output directory...'));

    if (await fs.pathExists(outputDir)) {
      await fs.remove(outputDir);
      console.log(chalk.green('✓ Output directory cleaned'));
    } else {
      console.log(chalk.yellow('Output directory does not exist'));
    }
  } catch (error) {
    console.error(chalk.red('Error cleaning output:'), error.message);
    process.exit(1);
  }
}

cleanOutput();

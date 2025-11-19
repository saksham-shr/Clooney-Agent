#!/usr/bin/env node

import CloneRunner from '../agent/runner.js';
import chalk from 'chalk';
import fs from 'fs-extra';

/**
 * CLI entry point for the Clooney Frontend Agent
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    printHelp();
    process.exit(0);
  }

  const targetUrl = args[0];

  if (!isValidUrl(targetUrl)) {
    console.error(chalk.red('✗ Invalid URL provided'));
    console.error(chalk.yellow('Usage: node cli/clone.js <url>'));
    process.exit(1);
  }

  console.log(chalk.blue.bold('\n🎬 Clooney Frontend Agent\n'));
  console.log(chalk.gray('Target URL: ' + targetUrl));

  try {
    const runner = new CloneRunner({
      targetUrl,
    });

    const result = await runner.run();

    console.log(chalk.green.bold('\n✓ Success!\n'));
    console.log(chalk.gray('Output directory: ' + result.outputDir));
    console.log(chalk.gray('Report:'));
    console.log(JSON.stringify(result.report, null, 2));
  } catch (error) {
    console.error(chalk.red.bold('\n✗ Error:\n'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function printHelp() {
  console.log(chalk.blue.bold('Clooney Frontend Agent - CLI'));
  console.log(chalk.gray('\nUsage:'));
  console.log('  node cli/clone.js <url>');
  console.log(chalk.gray('\nExamples:'));
  console.log('  node cli/clone.js https://asana.com');
  console.log('  node cli/clone.js https://trello.com');
  console.log(chalk.gray('\nOptions:'));
  console.log('  --help, -h    Show this help message');
  console.log(chalk.gray('\nEnvironment Variables:'));
  console.log('  OPENAI_API_KEY    Your OpenAI API key (required)');
  console.log('  TARGET_URL        Override target URL');
  console.log('  OUTPUT_DIR        Custom output directory');
}

main().catch(error => {
  console.error(chalk.red('Fatal error:'), error);
  process.exit(1);
});

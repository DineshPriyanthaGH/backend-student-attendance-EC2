#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

// Get command line arguments
const args = process.argv.slice(2);
const testType = args[0];

// Define test commands
const commands = {
  unit: 'jest tests/unit --verbose',
  integration: 'jest tests/integration --verbose',
  e2e: 'jest tests/e2e --verbose',
  all: 'jest --verbose',
  watch: 'jest --watch --verbose',
  coverage: 'jest --coverage --verbose',
  'coverage-unit': 'jest tests/unit --coverage --verbose',
  'coverage-integration': 'jest tests/integration --coverage --verbose',
  'coverage-e2e': 'jest tests/e2e --coverage --verbose'
};

// Display usage if no valid command provided
if (!testType || !commands[testType]) {
  console.log('\n🧪 School Attendance Management System - Test Runner\n');
  console.log('Usage: node test-runner.js <command>\n');
  console.log('Available commands:');
  console.log('  unit              - Run unit tests only');
  console.log('  integration       - Run integration tests only');
  console.log('  e2e               - Run end-to-end tests only');
  console.log('  all               - Run all tests');
  console.log('  watch             - Run tests in watch mode');
  console.log('  coverage          - Run all tests with coverage');
  console.log('  coverage-unit     - Run unit tests with coverage');
  console.log('  coverage-integration - Run integration tests with coverage');
  console.log('  coverage-e2e      - Run e2e tests with coverage\n');
  console.log('Examples:');
  console.log('  node test-runner.js unit');
  console.log('  node test-runner.js coverage');
  console.log('  node test-runner.js watch\n');
  process.exit(1);
}

// Execute the command
const command = commands[testType];
console.log(`\n🚀 Running: ${command}\n`);

const child = exec(command, { cwd: __dirname });

child.stdout.on('data', (data) => {
  process.stdout.write(data);
});

child.stderr.on('data', (data) => {
  process.stderr.write(data);
});

child.on('close', (code) => {
  const emoji = code === 0 ? '✅' : '❌';
  const status = code === 0 ? 'PASSED' : 'FAILED';
  console.log(`\n${emoji} Tests ${status} (exit code: ${code})\n`);
  process.exit(code);
});

child.on('error', (error) => {
  console.error(`❌ Error running tests: ${error.message}`);
  process.exit(1);
});

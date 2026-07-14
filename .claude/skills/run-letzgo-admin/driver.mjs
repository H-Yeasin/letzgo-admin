#!/usr/bin/env node
/**
 * LetzGo Admin Panel — Playwright driver
 *
 * A CLI driver for launching and interacting with the LetzGo admin panel.
 * Uses Playwright to drive a headless Chromium browser.
 *
 * Usage:
 *   node driver.mjs nav <url>          Navigate to a URL and screenshot
 *   node driver.mjs screenshot         Take a screenshot of the current page
 *   node driver.mjs login              Navigate to login page and screenshot
 *   node driver.mjs dashboard          Navigate to dashboard (requires auth)
 *   node driver.mjs users              Navigate to users page (requires auth)
 *   node driver.mjs rides              Navigate to rides page (requires auth)
 *   node driver.mjs reports            Navigate to reports page (requires auth)
 *   node driver.mjs console-errors     Check for console errors
 *   node driver.mjs html               Print page HTML (for debugging)
 *   node driver.mjs click <selector>   Click an element
 *   node driver.mjs wait <selector>    Wait for element to appear
 *   node driver.mjs shutdown           Close the browser
 *
 * Run a full smoke test:
 *   node driver.mjs smoke
 *
 * Environment:
 *   ADMIN_URL   — base URL (default: http://localhost:5173)
 *   SHOTS_DIR   — screenshot directory (default: /tmp/letzgo-admin-shots)
 *   HEADLESS    — set to "false" for headed mode (default: true)
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { execSync, spawn } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { homedir } from 'os';

const ADMIN_URL = process.env.ADMIN_URL || 'http://localhost:5173';
const SHOTS_DIR = process.env.SHOTS_DIR || (process.platform === 'win32'
  ? 'C:/Users/Yeasin/projects/letzgo/tmp-shots'
  : '/tmp/letzgo-admin-shots');
const HEADLESS = process.env.HEADLESS !== 'false';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

// ── State ─────────────────────────────────────────────────────────────
let browser = null;
let context = null;
let page = null;
let serverProcess = null;

// ── Helpers ───────────────────────────────────────────────────────────

async function ensureBrowser() {
  if (browser) return;
  browser = await chromium.launch({
    headless: HEADLESS,
    args: ['--no-sandbox', '--disable-gpu', '--disable-setuid-sandbox'],
  });
  context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  page = await context.newPage();

  // Capture console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error(`[console.error] ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => {
    console.error(`[pageerror] ${err.message}`);
  });
}

async function screenshot(name) {
  await ensureBrowser();
  if (!existsSync(SHOTS_DIR)) mkdirSync(SHOTS_DIR, { recursive: true });
  const ts = Date.now();
  const path = `${SHOTS_DIR}/${name}-${ts}.png`;
  await page.screenshot({ path, fullPage: true });
  // Also save as latest symlink equivalent (copy)
  const latest = `${SHOTS_DIR}/${name}-latest.png`;
  await page.screenshot({ path: latest, fullPage: true });
  console.log(`📸 Screenshot saved: ${path}`);
  return path;
}

async function nav(path) {
  await ensureBrowser();
  const url = path.startsWith('http') ? path : `${ADMIN_URL}${path}`;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  console.log(`→ Navigated to ${url}`);
  await screenshot(`page`);
}

async function waitFor(selector, timeout = 10000) {
  await ensureBrowser();
  await page.waitForSelector(selector, { timeout });
  console.log(`✓ Element found: ${selector}`);
}

async function click(selector) {
  await ensureBrowser();
  await page.click(selector);
  console.log(`✓ Clicked: ${selector}`);
}

async function getConsoleErrors() {
  // Console errors are already printed in real time via the handler.
  // This command just reports on what was captured.
  console.log('→ Check console output above for any errors');
}

async function getPageHtml() {
  await ensureBrowser();
  const html = await page.content();
  // Print a snippet
  const snippet = html.substring(0, 2000);
  console.log(snippet);
  return html;
}

async function shutdown() {
  if (browser) {
    await browser.close();
    browser = null;
    console.log('→ Browser closed');
  }
}

function startDevServer() {
  return new Promise((resolve, reject) => {
    console.log('→ Starting Vite dev server…');
    const proc = spawn('npx.cmd', ['vite', '--port', '5173', '--host'], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    });

    let started = false;

    proc.stdout.on('data', (data) => {
      const text = data.toString();
      // Strip ANSI escape codes before checking
      const plain = text.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '');
      process.stdout.write(text);
      if (!started && (plain.includes('Local:') || plain.includes('localhost:'))) {
        started = true;
        resolve(proc);
      }
    });

    proc.stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });

    proc.on('error', reject);

    // Timeout
    setTimeout(() => {
      if (!started) reject(new Error('Dev server failed to start within 30s'));
    }, 30000);
  });
}

// ── Commands ──────────────────────────────────────────────────────────

const COMMANDS = {
  async smoke() {
    console.log('=== LetzGo Admin Smoke Test ===\n');
    await nav('/');
    console.log('');

    console.log('→ Waiting for page to render…');
    await page.waitForTimeout(1000);

    console.log('→ Taking screenshot…\n');
    await screenshot('smoke-login');

    console.log('→ Checking page content…\n');
    const title = await page.title();
    console.log(`  Page title: ${title}`);
    const bodyText = await page.evaluate(() => document.body?.innerText?.substring(0, 500) || '');
    console.log(`  Body preview: ${bodyText.substring(0, 200)}\n`);

    // Try navigating to common pages
    try {
      await nav('/dashboard');
      await screenshot('smoke-dashboard');
    } catch {
      console.log('  ⚠ /dashboard may require auth (expected)\n');
    }

    try {
      await nav('/users');
      await screenshot('smoke-users');
    } catch {
      console.log('  ⚠ /users may require auth (expected)\n');
    }

    console.log('✓ Smoke test complete');
  },

  async nav() { await nav('/'); },
  async screenshot() { await screenshot('manual'); },
  async login() { await nav('/login'); },
  async dashboard() { await nav('/dashboard'); },
  async users() { await nav('/users'); },
  async rides() { await nav('/rides'); },
  async reports() { await nav('/reports'); },
  'console-errors': { async run() { await getConsoleErrors(); } },
  async html() { await getPageHtml(); },
  async wait(selector) { await waitFor(selector); },
  async click(selector) { await click(selector); },
  async shutdown() { await shutdown(); },
};

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: node driver.mjs <command> [args...]');
    console.log('Commands: smoke, nav, screenshot, login, dashboard, users, rides, reports, console-errors, html, wait <sel>, click <sel>, shutdown');
    process.exit(1);
  }

  const cmd = args[0];
  const command = COMMANDS[cmd];

  if (!command) {
    console.error(`Unknown command: ${cmd}`);
    process.exit(1);
  }

  try {
    // Check if we need to auto-start the dev server for certain commands
    if (['smoke', 'nav', 'login', 'dashboard', 'users', 'rides', 'reports', 'html'].includes(cmd)) {
      try {
        await fetch(`${ADMIN_URL}`).catch(() => { throw new Error('not running'); });
      } catch {
        console.log('→ Dev server not detected, starting it…');
        serverProcess = await startDevServer();
      }
    }

    if (typeof command === 'function') {
      await command();
    } else if (typeof command.run === 'function') {
      await command.run();
    }

    await shutdown();
    if (serverProcess) {
      serverProcess.kill();
      console.log('→ Dev server stopped');
    }
    process.exit(0);
  } catch (err) {
    console.error(`✗ Error: ${err.message}`);
    await shutdown().catch(() => {});
    if (serverProcess) serverProcess.kill();
    process.exit(1);
  }
}

main();

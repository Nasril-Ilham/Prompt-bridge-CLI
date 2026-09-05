#!/usr/bin/env node

import readline from 'readline';
import chalk from 'chalk';

let inquirerPromise;
let openPromise;

const getInquirer = () => {
  inquirerPromise ??= import('inquirer').then(({ default: inquirer }) => inquirer);
  return inquirerPromise;
};

const getOpen = () => {
  openPromise ??= import('open').then(({ default: open }) => open);
  return openPromise;
};

const AI_PLATFORMS = {
  'Google.ai':'https://www.google.com/webhp?prompt=',
  'Gemini': 'https://gemini.google.com/app?prompt=', 
  'ChatGPT': 'https://chatgpt.com/?prompt=',
  'DeepSeek': 'https://chat.deepseek.com/?prompt=',
  'Claude': 'https://claude.ai/new?prompt=',
  'Z.ai': 'https://chat.z.ai/?prompt=',
  'Qwen': 'https://chat.qwen.ai/?prompt=',
  'kimi': 'https://www.kimi.com/?prompt=',
  'Grok': 'https://grok.com/?prompt=',
  'Perplexity': 'https://www.perplexity.ai/?prompt='

};

const LOGO = [
  "  ____   _____   _____  _____    _____  ______ ",
  " |  _ \\ |  __ \\ |_   _||  __ \\  / ____||  ____|",
  " | |_) || |__) |  | |  | |  | || |  __|| |___  ",
  " |  _ < |  _  /   | |  | |  | || | |_ ||  __|  ",
  " | |_) || | \\ \\  _| |_ | |__| || |__| || |____ ",
  " |____/ |_|  \\_\\|_____||_____/  \\_____||______|"
];

const CHOICES = [...Object.keys(AI_PLATFORMS), 'Exit']



const totalAIs = Object.keys(AI_PLATFORMS).length;

const clearScreen = () => {
  process.stdout.write('\x1B[2J\x1B[H');
};

const prepareTerminal = () => {
  // Resume the stream without consuming pending user input.
  process.stdin.resume();
  process.stdout.write('\x1B[2J\x1B[H\x1B[?25l');
};

const exitCLI = () => {
  process.stdout.write('\x1B[?25h');
  clearScreen();
  console.log(chalk.green('\nThank you for using BRIDGE CLI. Goodbye!'));
  process.exit(0);
};


function renderMenu(selectedIndex) {
  const paddingtop = 2;

  const rightPane = [
    ''.repeat(paddingtop),
    chalk.white.bold("System: ") + chalk.white("Node.js CLI v1.0.0"),
    chalk.white.bold("AIs:    ") + chalk.white(`${totalAIs} Available`),
    chalk.white.bold("Status: ") + chalk.white("Ready to prompt!"),
    chalk.white.bold("Cmds:   ") + chalk.white("/change, /open, /exit"),
    chalk.white.bold("Author: ") + chalk.white("Nasril")
  ];

  const paddingSize = 65; 

  const maxTopLines = Math.max(LOGO.length, rightPane.length);
  const output = [];

  for (let i = 0; i < maxTopLines; i++) {
    const leftText = chalk.greenBright(LOGO[i] || "").padEnd(paddingSize);
    const rightText = rightPane[i] || "";
    output.push(leftText + rightText);
  }

  output.push(
    chalk.gray("\n ----------------------------------------------------"),
    chalk.white.bold("  SELECT AI PLATFORM:"),
    chalk.gray(" ----------------------------------------------------")
  );

  CHOICES.forEach((choice, i) => {
    if (i === selectedIndex) {
      output.push(chalk.white.bold("   ❯ " + choice));
    } else if (choice === 'Exit') {
      output.push(chalk.red("     " + choice));
    } else {
      output.push("     " + choice);
    }
  });

  output.push(chalk.gray.bold("\n  [↑/↓] Move Menu  •  [Enter] Select Option"));
  process.stdout.write('\x1B[2J\x1B[H' + output.join('\n') + '\n');
}

function selectAI() {
  return new Promise((resolve) => {
    let selectedIndex = 0;

    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);

    prepareTerminal();
    renderMenu(selectedIndex);

    const handleKeypress = (str, key) => {
      if (key.name === 'up' && selectedIndex > 0) {
        selectedIndex--;
        renderMenu(selectedIndex);
      } else if (key.name === 'down' && selectedIndex < CHOICES.length - 1) {
        selectedIndex++;
        renderMenu(selectedIndex);
      } else if (key.name === 'return') {
        process.stdin.removeListener('keypress', handleKeypress);
        if (process.stdin.isTTY) process.stdin.setRawMode(false);
        process.stdout.write('\x1B[?25h');
        resolve(CHOICES[selectedIndex]);
      } else if (key.ctrl && key.name === 'c') {
        exitCLI();
      }
    };

    process.stdin.on('keypress', handleKeypress);
  });
}

async function openUrl(url) {
  const open = await getOpen();
  return open(url);
}

async function runCLI() {
  while (true) {
    const selectedAI = await selectAI();

    if (selectedAI === 'Exit') {
      exitCLI();
    }

    clearScreen();
    console.log(chalk.white.bold("Type your prompt below or use operational commands."));
    console.log(chalk.white.bold("Commands: /change (ganti AI), /open (buka dashboard AI), /exit (keluar)\n"));

    let changeAI = false;
    while (!changeAI) {
      const inquirer = await getInquirer();
      const answer = await inquirer.prompt([
        {
          type: 'input',
          name: 'text',
          message: chalk.white.bold(`[${selectedAI}] ❯:`),
          prefix: ''
        }
      ]);

      const input = answer.text.trim();
      const command = input.toLowerCase();

      if (command === '/exit' || command === 'exit') {
        exitCLI();
      } 
      
      if (command === '/change' || command === 'change') {
        changeAI = true;
        continue;
      }

      if (command === '/open' || command === 'open') {
        console.log(chalk.gray(`\nOpening ${selectedAI} dashboard (No injection)......`));
        
        
        const baseUrl = AI_PLATFORMS[selectedAI].split('?prompt=')[0];
        
        await openUrl(baseUrl);
        console.log(chalk.gray(`Halaman dashboard/history AI telah dibuka di browser.\n`));
      } 
      // === AKHIR FITUR BARU ===

      else if (input !== '') {
        console.log(chalk.gray(`  Launching browser tab for ${selectedAI}...`));
        await openUrl(AI_PLATFORMS[selectedAI] + encodeURIComponent(input));
        console.log();
      } else {
        console.log(chalk.red('  Prompt cannot be empty.\n'));
      }
    }
  }
}

runCLI();
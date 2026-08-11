#!/usr/bin/env node

import inquirer from 'inquirer';
import open from 'open';
import readline from 'readline';
import chalk from 'chalk';

// 1. KONFIGURASI DATA
const AI_PLATFORMS = {
  'Gemini': 'https://google.com',
  'ChatGPT': 'https://chatgpt.com',
  'DeepSeek': 'https://deepseek.com',
  'Claude': 'https://claude.ai',
  'Z.ai': 'https://z.ai',
  'Grok': 'https://grok.com',
  'Perplexity': 'https://perplexity.ai'
};

const LOGO = [
  "  ____   _____   _____  _____    _____  ______ ",
  " |  _ \\ |  __ \\ |_   _||  __ \\  / ____||  ____|",
  " | |_) || |__) |  | |  | |  | || |  __| |__   ",
  " |  _ < |  _  /   | |  | |  | || | |_ ||  __|  ",
  " | |_) || | \\ \\  _| |_ | |__| || |__| || |____ ",
  " |____/ |_|  \\_\\|_____||_____/  \\_____||______|"
];

const CHOICES = [...Object.keys(AI_PLATFORMS), 'Exit'];

// 2. FUNGSI UTILITAS TERMINAL
const clearScreen = () => console.clear();

const exitCLI = () => {
  clearScreen();
  console.log(chalk.green('\nThank you for using BRIDGE CLI. Goodbye!'));
  process.exit(0);
};

function renderMenu(selectedIndex) {
  clearScreen();
  
  const paddingtop = 2;

  const rightPane = [
    ''.repeat(paddingtop),
    chalk.white.bold("System: ") + chalk.white("Node.js CLI v1.0.0"),
    chalk.white.bold("AIs:    ") + chalk.white("7 Available"),
    chalk.white.bold("Status: ") + chalk.white("Ready to prompt!"),
    chalk.white.bold("Cmds:   ") + chalk.white("/change, /exit"),
    chalk.white.bold("Author: ") + chalk.white("Nasril")
  ];

  const paddingSize = 65; 

 
  const maxTopLines = Math.max(LOGO.length, rightPane.length);
  for (let i = 0; i < maxTopLines; i++) {
    const leftText = chalk.greenBright(LOGO[i] || "").padEnd(paddingSize);
    const rightText = rightPane[i] || "";
    process.stdout.write(leftText + rightText + "\n");
  }

 
  console.log(chalk.gray("\n ----------------------------------------------------"));
  console.log(chalk.white.bold("  SELECT AI PLATFORM:"));
  console.log(chalk.gray(" ----------------------------------------------------"));


  CHOICES.forEach((choice, i) => {
    if (i === selectedIndex) {
      console.log(chalk.white.bold("   ❯ " + choice));
    } else {
      console.log("     " + choice);
    }
  });

  console.log(chalk.gray.bold("\n  [↑/↓] Move Menu  •  [Enter] Select Option"));
  
}


function selectAI() {
  return new Promise((resolve) => {
    let selectedIndex = 0;
    
  
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    process.stdin.resume();

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
        resolve(CHOICES[selectedIndex]);
      } else if (key.ctrl && key.name === 'c') {
        exitCLI();
      }
    };

    process.stdin.on('keypress', handleKeypress);
  });
}

async function runCLI() {
  while (true) {
    const selectedAI = await selectAI();
    
    if (selectedAI === 'Exit') exitCLI();

    clearScreen();
    console.log(chalk.green(`\n ✅ Active Engine: ${chalk.bold.cyan(selectedAI)}`));
    console.log(chalk.gray(" Type your prompt below or use operational commands.\n"));

    while (true) {
      const answer = await inquirer.prompt([
        {
          type: 'input',
          name: 'text',
          message: chalk.magenta(`[${selectedAI}] ❯ `),
          prefix: ''
        }
      ]);

      const input = answer.text.trim();
      const command = input.toLowerCase();

      if (command === '/exit' || command === 'exit') {
        exitCLI();
      } 
      
      if (command === '/change' || command === 'change') {
        break; 
      }

      if (input !== '') {
        console.log(chalk.gray(` 🚀 Launching browser tab for ${selectedAI}...`));
        await open(AI_PLATFORMS[selectedAI] + encodeURIComponent(input));
        console.log();
      } else {
        console.log(chalk.red(' ⚠️ Prompt cannot be empty.\n'));
      }
    }
  }
}

runCLI();

#!/usr/bin/env node
import inquirer from 'inquirer';
import open from 'open';

const AI_PLATFORMS = {
    'Gemini': 'https://gemini.google.com/app?prompt=', 
    'ChatGPT': 'https://chatgpt.com/?prompt=',
    'DeepSeek': 'https://chat.deepseek.com/?prompt=',
    'Claude': 'https://claude.ai/new?prompt=',
    'Z.ai': 'https://chat.z.ai/?prompt=',
    'Grok': 'https://grok.com/?prompt=',
    'Perplexity': 'https://www.perplexity.ai/?prompt=',
};

let currentAI = '';

async function selectAI() {
    console.clear();
    console.log('\nPROMPT BRIDGE CLI \n');
    
    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'ai_choice',
            message: 'Pick an AI:',
            choices: Object.keys(AI_PLATFORMS),
        }
    ]);
    
    currentAI = answer.ai_choice;
    console.log(`\n✅ You selected: ${currentAI}`);
    console.log(`type your prompt below, /change to switch AI, /exit to quit\n`);
    
    await askPrompt();
}

async function askPrompt() {
    
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'prompt_text',
            message: `[${currentAI}]:`,
            prefix: '' 
        }
    ]);

    const text = answer.prompt_text.trim();

    if (text === '/exit' || text === 'exit') {
        console.log('\nThank you for using PROMPT BRIDGE CLI. Goodbye!');
        process.exit(0);
    } 
    else if (text === '/change' || text === 'change') {
        await selectAI();
    } 
    else if (text !== '') {
      
        const encodedPrompt = encodeURIComponent(text);
        const targetUrl = `${AI_PLATFORMS[currentAI]}${encodedPrompt}`;
        
        console.log(` Opening tab for ${currentAI}...`);
        open(targetUrl);
        
        console.log(); 
        await askPrompt(); 
    } 
    else {
        await askPrompt();
    }
}


selectAI();
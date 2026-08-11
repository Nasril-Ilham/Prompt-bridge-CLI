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
    'Perplexity': 'https://www.perplexity.ai/?prompt='
};

const EXIT_CHOICE = 'Exit';

let currentAI = '';

function clearAndExit() {
    console.clear();
    console.log('\nThank you for using PROMPT BRIDGE CLI. Goodbye!');
    process.exit(0);
}

process.on('SIGINT', () => {
    console.clear();
    console.log('\nInterrupted. Goodbye!');
    process.exit(0);
});

async function selectAI() {
    console.clear();
    console.log('\nPROMPT BRIDGE CLI \n');

    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'ai_choice',
            message: 'Pick an AI:',
            choices: [...Object.keys(AI_PLATFORMS), EXIT_CHOICE],
            loop: false,            // 👈 FIX: tidak muter saat di-scroll
            pageSize: 12            // opsional: tampilkan semua tanpa scroll kalau muat
        }
    ]);

    return answer.ai_choice;
}

async function runCLI() {
    while (true) {
        const aiChoice = await selectAI();

        if (aiChoice === EXIT_CHOICE) {
            clearAndExit();
        }

        currentAI = aiChoice;
        console.clear();
        console.log(`\n✅ You selected: ${currentAI}`);
        console.log(`type your prompt below, /change to switch AI, /exit to quit\n`);

        while (true) {
            const answer = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'prompt_text',
                    message: `[${currentAI}]:`,
                    prefix: ''
                }
            ]);

            const text = answer.prompt_text.trim();
            const cmd = text.toLowerCase();

            if (cmd === '/exit' || cmd === 'exit') {
                clearAndExit();
            }
            else if (cmd === '/change' || cmd === 'change') {
                break;
            }
            else if (text !== '') {
                const encodedPrompt = encodeURIComponent(text);
                const targetUrl = `${AI_PLATFORMS[currentAI]}${encodedPrompt}`;

                console.log(` Opening tab for ${currentAI}...`);
                await open(targetUrl);
                console.log();
            }
            else {
                console.log('Prompt is empty. Try again.');
            }
        }
    }
}

runCLI();
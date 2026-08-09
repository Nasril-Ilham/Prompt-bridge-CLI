# PROMPT BRIDGE CLI 🚀

**PROMPT BRIDGE CLI** is an open-source project that bridges the Command Line Interface (CLI) in your terminal/CMD directly with the largest free web AI platforms, including Google Gemini, DeepSeek, ChatGPT, Claude, Z.ai, Grok, and Perplexity.

With this project, you no longer need to manually open browsers, navigate through tabs, or retype the same queries. Simply type a short command in your CMD, select your preferred AI, and let the system handle the automation via secure **DOM Injection**!

---

## 🔥 Key Features
* **Lightning-Fast Multi-AI Access:** Run the shortcut command `pb` instantly from any CMD/Terminal window.
* **Smart URL Routing:** Converts your CMD text inputs into universal URL parameters (`?prompt=...`).
* **Anti-Reset DOM Injection:** Comes with a companion extension that injects text directly into the AI's internal framework state (React, Vue, Svelte, Lexical), ensuring your text won't disappear upon interaction.
* **Auto-Submit:** The script automatically detects each AI's submit button to execute commands instantly without requiring a mouse click.

---

## 🛠️ Project Structure
This repository consists of two main components:
1. `prompt-bridge-cli/` — The Node.js-based application running inside your CMD/Terminal.
2. `prompt-bridge-extension/` — The companion Chrome extension for browser-side DOM manipulation.

---

## 🚀 Installation & Setup

### Step 1: Install the CLI Application (CMD)
1. Make sure you have [Node.js](https://nodejs.org) installed on your computer.
2. Clone this repository and navigate to the CLI directory:
   ```bash
   git clone https://github.com
   cd prompt-bridge-cli/prompt-bridge-cli
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```
4. Register the global shortcut command `pb` into your operating system:
   ```bash
   npm link
   ```

### Step 2: Install the Companion Chrome Extension
Since AI platforms naturally ignore public URL parameters, this extension acts as an automated bridge inside your browser.
1. Open Google Chrome and navigate to the Extensions page (`chrome://extensions/`).
2. Enable **Developer mode** in the top-right corner.
3. Click the **Load unpacked** button in the top-left corner.
4. Select the `prompt-bridge-extension` folder included in this project.

---

## 🕹️ How to Use
1. Open your CMD / Terminal anywhere.
2. Type the shortcut command:
   ```bash
   pb
   ```
3. Use the arrow keys on your keyboard to select your desired AI platform, then press **Enter**:
   * Google Gemini
   * ChatGPT
   * DeepSeek
   * Claude
   * Z.ai
   * Grok
   * Perplexity
4. Type your prompt when requested, for example: `what is a water molecule`.
5. Google Chrome will launch automatically, navigate to the selected AI site, populate the chatbox, and submit it instantly for you!

---

## 🧠 Tech Stack & How It Works
* **Node.js (Inquirer & Open):** Hosts the interactive prompt interface in CMD and launches Google Chrome with a safely encoded query (`encodeURIComponent`).
* **Chrome Extension (Content Scripts):** Runs automatically only when it detects an AI URL carrying the custom `?prompt=` parameter.
* **Native JavaScript DOM Injection:** Utilizes *Main Page Context* manipulation and `Object.getOwnPropertyDescriptor` to bypass the reactive state binding of modern web frameworks, ensuring the injected text is recognized natively by the AI web app.

---

## 🤝 Contributing
Contributions are highly welcome! If you notice any changes in the DOM structure of any supported AI platform that cause this automation script to break, please open a **Pull Request** or submit an **Issue** in this repository.

---

## 📄 License
This project is licensed under the MIT License. You are free to use, modify, and redistribute it.

# PROMPT BRIDGE CLI 🚀

**PROMPT BRIDGE CLI** is an open-source tool that bridges your terminal/CMD directly with the largest web AI platforms (Google Gemini, DeepSeek, ChatGPT, Claude, Z.ai, Grok, and Perplexity). Forget the hassle of opening a browser, finding the right tab, or retyping the same prompt.

Simply type the short command `pb` or `bridge` in your terminal, pick your favorite AI, and let the system send your prompt automatically via safe DOM Injection! ✨

---

## 🖥️ Neofetch-Style UI

We designed this terminal UI with a Neofetch style to make it aesthetic, modern, and comfortable for developers to use.

```text
  ____   _____   _____  _____    _____  ______

 |  _ \ |  __ \ |_   _||  __ \  / ____||  ____|
 | |_) || |__) |  | |  | |  | || |  __|| |___
 |  _ < |  _  /   | |  | |  | || | |_ ||  __|
 | |_) || | \ \  _| |_ | |__| || |__| || |____
 |____/ |_|  \_\|_____||_____/  \_____||______|

```

---

## 🔥 Key Features

* **Lightning-Fast Multi-AI Access:** Run the `pb` / `bridge` command instantly from any CMD/Terminal window.
* **Smart URL Routing:** Converts CMD text input into a universal URL parameter (`?prompt=...`).
* **Anti-Reset DOM Injection:** Equipped with a companion extension that injects text directly into the AI's internal framework state (React, Vue, Svelte, Lexical), ensuring your text doesn't disappear when the page loads.
* **Auto-Submit:** The script automatically detects the submit button on each AI platform to execute the command without needing a mouse click.
* **Interactive CLI:** An interactive terminal experience with keyboard arrow detection (up/down) without infinite looping, plus custom commands (`/change`, `/about`, `/exit`).

---

## 🛠️ Project Structure

This repository consists of two main components:

* `prompt-bridge-cli/` – The Node.js application that runs inside your CMD/Terminal.
* `prompt-bridge-extension/` – The Companion Chrome Extension for DOM manipulation on the browser side.

---

## 🚀 Installation & Setup

### Step 1: Install the CLI Application (CMD)

Make sure you have [Node.js](https://nodejs.org) installed on your computer. Clone this repository and navigate to the CLI directory:

```bash
git clone https://github.com
cd prompt-bridge-cli
```

Install the required dependencies:

```bash
npm install
```

Register the global commands `pb`, `bridge` & `promptbridge` to your operating system:

```bash
npm link
```

### Step 2: Install the Companion Chrome Extension

Since AI platforms naturally ignore public URL parameters, this extension acts as an automated bridge within your browser.

1. Open Google Chrome and go to the Extensions page (`chrome://extensions/`).
2. Enable **Developer mode** in the top right corner.
3. Click the **Load unpacked** button in the top left corner.
4. Select the `prompt-bridge-extension` folder located inside this project.

---

## 🕹️ How to Use

1. Open CMD / Terminal anywhere on your computer.
2. Type the shortcut command:
   ```bash
   pb
   # or
   bridge
   # or
   promptbridge
   ```
3. Use the arrow keys (`↑`/`↓`) on your keyboard to select the desired AI platform, then press **Enter**.
4. Type your prompt when asked, for example: `what is a water molecule`.
5. Google Chrome will automatically open, navigate to the selected AI site, fill in the chat box, and execute it for you!

### Additional CLI Commands:
* `/change` - Return to the AI selection menu.
* `/exit` - Exit the application.

---

## 🧠 Tech Stack & How It Works

* **Node.js (`readline`, `inquirer`, `open`, `chalk`):** Provides an aesthetic interactive prompt interface in the CMD and launches Google Chrome with safely encoded queries (`encodeURIComponent`).
* **Chrome Extension (Content Scripts):** Runs automatically only when it detects an AI URL carrying the `?prompt=` parameter.
* **Native JavaScript DOM Injection:** Leverages Main Page Context manipulation and `Object.getOwnPropertyDescriptor` to bypass the reactive state binding of modern web frameworks, ensuring the injected text is natively recognized by the AI web app.

---

## 🤝 Contributing

Contributions are highly welcome! If you notice changes in the DOM structure of any AI platform that cause this script to break, feel free to open a **Pull Request** or submit an **Issue** in this repository.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and redistribute it.
# PROMPT BRIDGE CLI 🚀

**PROMPT BRIDGE CLI** adalah tool open-source yang menjembatani terminal/CMD kamu langsung dengan platform AI web terbesar (Google Gemini, DeepSeek, ChatGPT, Claude, Z.ai, Grok, dan Perplexity). Lupakan repot-repot membuka browser, mencari tab yang benar, atau mengetik ulang prompt yang sama. 

Cukup ketik perintah singkat `pb` di terminalmu, pilih AI favoritmu, dan biarkan sistem mengirimkan promptmu secara otomatis melalui *DOM Injection* yang aman! ✨

---

## 🖥️ Tampilan Neofetch Style
Kami mendesain UI terminal ini dengan gaya Neofetch agar terlihat estetik, modern, dan nyaman digunakan oleh para developer.

```text
  ____   _____   _____  _____    _____  ______      System: Node.js CLI v1.0.0

 |  _ \ |  __ \ |_   _||  __ \  / ____||  ____|     AIs:    7 Available
 | |_) || |__) |  | |  | |  | || |  __| |__          Status: Ready to prompt!
 |  _ < |  _  /   | |  | |  | || | |_ ||  __|        Shortcut: /change, /exit, /about
 | |_) || | \ \  _| |_ | |__| || |__| || |____ 
 |____/ |_|  \\_\\|_____||_____/  \\_____||______|

 ----------------------------------------------------
  SELECT AI PLATFORM:
 ----------------------------------------------------
   ❯ Gemini
     ChatGPT
     DeepSeek
     Claude
     Z.ai
     Grok
     Perplexity
     Exit

  [↑/↓] Move Menu  •  [Enter] Select Option
 ----------------------------------------------------
```

---

## 🔥 Key Features

* **Lightning-Fast Multi-AI Access:** Jalankan perintah `pb` secara instan dari jendela CMD/Terminal mana saja.
* **Smart URL Routing:** Mengubah input teks CMD menjadi parameter URL universal (`?prompt=...`).
* **Anti-Reset DOM Injection:** Dilengkapi dengan *companion extension* yang menginjeksi teks langsung ke internal framework state AI (React, Vue, Svelte, Lexical), memastikan teks kamu tidak hilang saat halaman dimuat.
* **Auto-Submit:** Script secara otomatis mendeteksi tombol submit pada masing-masing AI untuk mengeksekusi perintah tanpa perlu klik mouse.
* **Interactive CLI:** Pengalaman terminal yang interaktif dengan deteksi panah keyboard (atas/bawah) tanpa looping muter, plus perintah custom (`/change`, `/about`, `/exit`).

---

## 🛠️ Project Structure
Repository ini terdiri dari dua komponen utama:
* `prompt-bridge-cli/` — Aplikasi berbasis Node.js yang berjalan di dalam CMD/Terminal kamu.
* `prompt-bridge-extension/` — *Companion Chrome Extension* untuk manipulasi DOM di sisi browser.

---

## 🚀 Installation & Setup

### Langkah 1: Install Aplikasi CLI (CMD)
Pastikan kamu sudah menginstall Node.js di komputermu. Clone repository ini dan masuk ke direktori CLI:

```bash
git clone https://github.com/username/prompt-bridge-cli.git
cd prompt-bridge-cli
```

Install dependencies yang dibutuhkan:
```bash
npm install
```

Daftarkan perintah global `pb` ke dalam sistem operasimu:
```bash
npm link
```

### Langkah 2: Install Companion Chrome Extension
Karena platform AI secara alami mengabaikan parameter URL publik, extension ini bertindak sebagai jembatan otomatis di dalam browsermu.

1. Buka Google Chrome dan pergi ke halaman Extensions (`chrome://extensions/`).
2. Aktifkan **Developer mode** di pojok kanan atas.
3. Klik tombol **Load unpacked** di pojok kiri atas.
4. Pilih folder `prompt-bridge-extension` yang ada di dalam project ini.

---

## 🕹️ How to Use

1. Buka CMD / Terminal di mana saja di komputermu.
2. Ketik perintah shortcut:
   ```bash
   pb
   ```
3. Gunakan tombol panah (`↑`/`↓`) pada keyboard untuk memilih platform AI yang diinginkan, lalu tekan **Enter**.
4. Ketik promptmu saat diminta, misalnya: `what is a water molecule`.
5. Google Chrome akan otomatis terbuka, mengarah ke situs AI yang dipilih, mengisi kotak chat, dan langsung mengeksekusinya untukmu!

### Perintah CLI Tambahan:
* `/change` - Kembali ke menu pemilihan AI.
* `/about` - Melihat informasi lengkap tentang project.
* `/exit` - Keluar dari aplikasi.

---

## 🧠 Tech Stack & How It Works

* **Node.js (readline, inquirer, open, chalk):** Menyediakan antarmuka prompt interaktif yang estetik di CMD dan meluncurkan Google Chrome dengan query yang sudah di-encode dengan aman (`encodeURIComponent`).
* **Chrome Extension (Content Scripts):** Berjalan otomatis hanya saat mendeteksi URL AI yang membawa parameter `?prompt=`.
* **Native JavaScript DOM Injection:** Memanfaatkan manipulasi *Main Page Context* dan `Object.getOwnPropertyDescriptor` untuk membypass *reactive state binding* dari framework web modern, memastikan teks yang diinjeksi dikenali secara native oleh web app AI.

---

## 🤝 Contributing
Kontribusi sangat diterima! Jika kamu memperhatikan perubahan pada struktur DOM dari platform AI yang menyebabkan script ini rusak, silakan buka *Pull Request* atau ajukan *Issue* di repository ini.

---

## 📄 License
Project ini dilisensikan di bawah [MIT License](LICENSE). Kamu bebas untuk menggunakan, memodifikasi, dan mendistribusikan ulang.

// 1. Ambil prompt dari URL
const urlParams = new URLSearchParams(window.location.search);
const promptText = urlParams.get('prompt');

if (promptText) {
    window.history.replaceState({}, document.title, window.location.pathname);
    setTimeout(() => {
        injectPrompt(promptText);
    }, 1500);
}

// 2. Routing Hostname
function injectPrompt(text) {
    const host = window.location.hostname;

    if (host.includes('chatgpt.com')) {
        handleChatGPT(text);
    }
    else if (host.includes('gemini.google.com')) {
        handleGemini(text);
    }
    else if (host.includes('deepseek.com')) {
        handleDeepSeek(text);
    }
    else if (host.includes('claude.ai')) {
        handleClaude(text);
    }
    else if (host.includes('z.ai')) {
        handleZai(text);
    }
}

// ==========================================
// HANDLER MASING-MASING AI (DIPERBAIKI)
// ==========================================

function handleChatGPT(text) {
    waitForElement('#prompt-textarea p', (el) => {
        insertTextIntoContentEditable(el, text);
        setTimeout(() => clickButton('button[data-testid="send-button"]'), 500);
    });
}

function handleGemini(text) {
    waitForElement('div[contenteditable="true"]', (el) => {
        insertTextIntoContentEditable(el, text);
        // Diperbaiki: Mencari tombol kirim Gemini berdasarkan ikon atau tombol terdekat di form
        setTimeout(() => {
            const sendBtn = document.querySelector('button[aria-label*="Send"], button[aria-label*="Kirim"], button.send-button, [data-test-id="send-button"]');
            if (sendBtn) {
                sendBtn.click();
            } else {
                // Fallback: Tekan Enter jika tombol tidak ketemu
                simulateEnter(el);
            }
        }, 800); // Diberi jeda sedikit lebih lama agar tombol aktif
    });
}

// Ubah bagian pengiriman event di dalam handleDeepSeek (atau di fungsi setNativeTextareaValue)
function setNativeTextareaValue(element, text) {
    const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    if (valueSetter) {
        valueSetter.call(element, text);
    } else {
        element.value = text;
    }
    // UBAH BAGIAN INI: Gunakan InputEvent agar Vue/React DeepSeek langsung merespons
    element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
}

function handleClaude(text) {
    waitForElement('div[data-testid="chat-input"]', (el) => {
        el.focus();
        setTimeout(() => {
            document.execCommand('insertText', false, text);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => clickButton('button[aria-label*="Send"]'), 500);
        }, 300);
    });
}

function handleZai(text) {
    waitForElement('textarea#chat-input, textarea', (el) => {
        if (el.tagName && el.tagName.toLowerCase() !== 'textarea') {
            return;
        }

        const chatArea = el.id === 'chat-input' || (el.placeholder || '').toLowerCase().includes('help') || (el.placeholder || '').toLowerCase().includes('you') ? el : null;
        if (!chatArea) {
            return;
        }

        chatArea.focus();

        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        if (nativeSetter) {
            nativeSetter.call(chatArea, text);
        } else {
            chatArea.value = text;
        }

        // Pastikan baris pengiriman event di dalam handleZai menggunakan format ini:
        chatArea.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
        chatArea.dispatchEvent(new Event('change', { bubbles: true }));


        setTimeout(() => {
            const tombolKirim = findZaiSubmitButton(chatArea);

            if (tombolKirim) {
                tombolKirim.click();
            } else {
                chatArea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
            }
        }, 900);
    }, true);
}

// ==========================================
// FUNGSI PENDUKUNG (HELPERS)
// ==========================================

function insertTextIntoContentEditable(element, text) {
    element.focus();
    document.execCommand('insertText', false, text);
    element.dispatchEvent(new Event('input', { bubbles: true }));
}

function setNativeTextareaValue(element, text) {
    const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    if (valueSetter) {
        valueSetter.call(element, text);
    } else {
        element.value = text;
    }
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
}

function clickButton(selector) {
    const btn = document.querySelector(selector);
    if (btn) {
        btn.click();
    }
}

// GANTI FUNGSI LAMA ANDA DENGAN KODE INI:
function findDeepSeekSubmitButton(sourceEl) {
    // Cari tombol berdasarkan class spesifik yang Anda temukan di DOM DeepSeek
    const tombolSpesifik = document.querySelector('div.bd74640a');
    if (tombolSpesifik) return tombolSpesifik;

    // Jembatan cadangan jika class di atas berubah setelah update
    const container = sourceEl ? sourceEl.closest('div') : null;
    if (container) {
        // Cari elemen div yang memiliki role button terdekat di dalam area input
        const btn = container.querySelector('div[role="button"]');
        if (btn) return btn;
    }
    return null;
}


// GANTI FUNGSI LAMA ANDA DENGAN KODE INI:
function findZaiSubmitButton(sourceEl) {
    if (!sourceEl) return null;

    // Z.ai menyatukan textarea dan tombol kirim di dalam satu kontainer induk terdekat
    const container = sourceEl.parentElement;
    if (container) {
        // Ambil tombol apa pun yang berada di dalam kontainer input tersebut
        const tombolInput = container.querySelector('button, [role="button"]');
        if (tombolInput) return tombolInput;
    }

    // Fallback jika struktur kontainer bergeser
    return document.querySelector('textarea#chat-input + button') || document.querySelector('button');
}


function simulateEnter(element) {
    const enterEvent = new KeyboardEvent('keydown', {
        bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13
    });
    element.dispatchEvent(enterEvent);
}

// LENGKAPI FUNGSI WAITING ANDA MENJADI SEPERTI INI:
function waitForElement(selector, callback, checkAll = false) {
    // 1. Cek langsung jika elemen sudah ada saat skrip dimuat
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
        if (checkAll) elements.forEach(callback);
        else callback(elements[0]);
        return;
    }

    // 2. Jika belum ada, pasang robot pengawas (MutationObserver) untuk menunggu
    const observer = new MutationObserver((mutations, obs) => {
        const currentElements = document.querySelectorAll(selector);
        if (currentElements.length > 0) {
            if (checkAll) currentElements.forEach(callback);
            else callback(currentElements[0]);
            obs.disconnect(); // Matikan pengawas jika target sudah ketemu
        }
    });
    
    // Mulai mengawasi seluruh perubahan HTML di halaman web AI
    observer.observe(document.body, { childList: true, subtree: true });
}
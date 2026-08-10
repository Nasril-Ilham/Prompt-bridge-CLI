// ==========================================
// 1. INISIALISASI & ROUTING (VERSI AMAN ANTI-STRIP URL)
// ==========================================

const currentUrl = new URL(window.location.href);
const promptText = currentUrl.searchParams.get('prompt');

if (promptText) {
    window.history.replaceState({}, document.title, window.location.pathname);

    const checkExist = setInterval(() => {
        const host = window.location.hostname;
        let isReady = false;

        // Cek apakah elemen input dari masing-masing AI sudah muncul di layar
        if (host.includes('chatgpt.com') && document.querySelector('#prompt-textarea p, textarea')) isReady = true;
        else if (host.includes('gemini.google.com') && document.querySelector('div[contenteditable="true"]')) isReady = true;
        else if (host.includes('deepseek.com') && document.querySelector('textarea')) isReady = true;
        else if (host.includes('claude.ai') && document.querySelector('div[data-testid="chat-input"], div[contenteditable="true"]')) isReady = true;
        else if (host.includes('z.ai') && document.querySelector('textarea#chat-input')) isReady = true;
        else if (host.includes('grok.com') && document.querySelector('div[contenteditable="true"]')) isReady = true;
        else if (host.includes('perplexity.ai') && document.querySelector('textarea, div[contenteditable="true"]')) isReady = true;

     
        if (isReady) {
            clearInterval(checkExist); 
            injectPrompt(promptText);   
        }
    }, 200); 
}

function injectPrompt(text) {
    const host = window.location.hostname;

    if (host.includes('chatgpt.com')) handleChatGPT(text);
    else if (host.includes('gemini.google.com')) handleGemini(text);
    else if (host.includes('deepseek.com')) handleDeepSeek(text);
    else if (host.includes('claude.ai')) handleClaude(text);
    else if (host.includes('z.ai')) handleZai(text);
    else if (host.includes('grok.com')) handleGrok(text);
    else if (host.includes('perplexity.ai')) handlePerplexity(text);
}

// ==========================================
// 2. HANDLER MASING-MASING AI
// ==========================================

// ---- hendle chatgpt

function handleChatGPT(text) {
    waitForElement('#prompt-textarea p', (el) => {
        insertTextIntoContentEditable(el, text);
        setTimeout(() => tryClickButton('button[data-testid="send-button"]', el), 500);
    });
}

// ---- end handle chatgpt

// ---- hendle gemini

function handleGemini(text) {
    // Perketat selektor khusus kotak input Gemini agar tidak keliru dengan elemen lain
    const selector = 'div.ql-editor[contenteditable="true"], div[contenteditable="true"][aria-label*="Enter"], div[contenteditable="true"]';
    
    waitForElement(selector, (el) => {
        // Pastikan elemen benar-benar kosong sebelum diisi untuk menghindari penumpukan teks
        if (el.innerText && el.innerText.trim() !== "") {
            el.innerHTML = ""; // Bersihkan jika sudah ada teks nyangkut
        }

        insertTextIntoContentEditable(el, text);
        
        setTimeout(() => {
            tryClickButton('button[aria-label*="Send"], button[aria-label*="Kirim"], [data-test-id="send-button"], button.send-button', el);
        }, 400);
    });
}

// ---- end handle gemini

// ---- hendle deepseek

function handleDeepSeek(text) {
    waitForElement('textarea', (dsInput) => {
        dsInput.focus();

        // 1. Set nilai menggunakan native setter agar React terbaca
        const nativeSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype, "value"
        )?.set;
        
        if (nativeSetter) {
            nativeSetter.call(dsInput, text);
        } else {
            dsInput.value = text;
        }

        // 2. Kirim InputEvent khusus dengan data teks agar state React DeepSeek aktif
        dsInput.dispatchEvent(new InputEvent('input', { 
            bubbles: true, 
            cancelable: true, 
            inputType: 'insertText', 
            data: text 
        }));
        dsInput.dispatchEvent(new Event('change', { bubbles: true }));

        // 3. Beri jeda 800ms agar tombol kirim berubah status menjadi aktif (enabled)
        setTimeout(() => {
            // Cari kontainer pembungkus input terdekat (biasanya parent atau wrapper di atas textarea)
            const wrapper = dsInput.closest('div.chat-input, div[class*="chat"], div[class*="input"]') || dsInput.parentElement?.parentElement;
            
            // Cari tombol kirim di dalam wrapper tersebut (biasanya berupa button atau div ber-role button yang memiliki SVG)
            let sendBtn = null;
            if (wrapper) {
                const candidates = wrapper.querySelectorAll('button, div[role="button"]');
                for (const btn of candidates) {
                    if (btn.querySelector('svg')) {
                        sendBtn = btn;
                        break;
                    }
                }
            }

            // Jika belum ketemu di wrapper, cari elemen tombol universal yang memiliki SVG di area bawah
            if (!sendBtn) {
                const allButtons = document.querySelectorAll('button, div[role="button"]');
                for (const btn of allButtons) {
                    if (btn.querySelector('svg') && !btn.closest('nav') && !btn.closest('header')) {
                        sendBtn = btn;
                        break;
                    }
                }
            }

            if (sendBtn) {
                // Paksa hapus atribut disabled jika ada
                sendBtn.removeAttribute('disabled');
                sendBtn.setAttribute('aria-disabled', 'false');

                // Eksekusi rangkaian klik mouse lengkap untuk framework Vue/React
                ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                    sendBtn.dispatchEvent(new MouseEvent(eventType, {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        buttons: 1
                    }));
                });
            } else {
                // Fallback terakhir: Tembak Enter langsung ke textarea
                const enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: true
                });
                dsInput.dispatchEvent(enterEvent);
            }
        }, 800);
    }, true);
}

function handleClaude(text) {
    waitForElement('div[data-testid="chat-input"]', (el) => {
        el.focus();
        setTimeout(() => {
            document.execCommand('insertText', false, text);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => tryClickButton('button[aria-label*="Send"]', el), 500);
        }, 300);
    });
}

// ---- end handle deepseek

// ---- hendlezai

function handleZai(text) {
    const zaiInput = document.querySelector('textarea#chat-input');
    
    if (!zaiInput) return;
    
    // 1. Klik dan fokus dulu
    zaiInput.click();
    zaiInput.focus();
    
    setTimeout(() => {
        // 2. Masukkan teks pakai native setter (Wajib untuk Svelte)
        const nativeSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype, 'value'
        )?.set;
        
        if (nativeSetter) {
            nativeSetter.call(zaiInput, text);
        } else {
            zaiInput.value = text;
        }
        
        // 3. Dispatch event input
        zaiInput.dispatchEvent(new InputEvent('input', { 
            bubbles: true, 
            cancelable: true,
            inputType: 'insertText', 
            data: text 
        }));
        zaiInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        // 4. Submit
        setTimeout(() => submitZaiMessage(zaiInput), 600);
    }, 300);
}

function submitZaiMessage(element) {
    const enterOpts = {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        charCode: 13,
        view: window
    };
    
    // Metode 1: Tekan Enter
    element.dispatchEvent(new KeyboardEvent('keydown', enterOpts));
    element.dispatchEvent(new KeyboardEvent('keypress', enterOpts));
    element.dispatchEvent(new KeyboardEvent('keyup', enterOpts));
    
    // Metode 2: Kalau teks masih ada (Enter gagal), cari tombol Send
    setTimeout(() => {
        if (!element.value || element.value.trim() === '') {
            return; // ✅ Berhasil terkirim via Enter
        }
        
        const wrapper = element.closest('form') || element.parentElement?.parentElement;
        let sendBtn = null;
        
        if (wrapper) {
            const buttons = wrapper.querySelectorAll('button, div[role="button"]');
            for (let i = buttons.length - 1; i >= 0; i--) {
                if (buttons[i].querySelector('svg')) {
                    sendBtn = buttons[i];
                    break;
                }
            }
        }
        
        if (sendBtn) {
            sendBtn.removeAttribute('disabled');
            sendBtn.click();
        } else {
            element.dispatchEvent(new KeyboardEvent('keydown', enterOpts));
        }
    }, 400);
}

//----- end handleZai

//--- hendle grok

function handleGrok(text) {
    const selector = 'div[contenteditable="true"], [role="textbox"][contenteditable="true"]';
    waitForElement(selector, (el) => {
        el.focus();
        document.execCommand('insertText', false, text);
        el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
        setTimeout(() => {
            // PASTIKAN ADA TANDA TANYA DI SINI
            const submitBtn = document.querySelector('[data-testid="grokSubmitButton"]') || 
                              document.querySelector('button[aria-label*="Grok"]') || 
                              el?.parentElement?.querySelector('button');

            if (submitBtn) {
                submitBtn.click();
            } else {
                const activeEl = document.activeElement || el;
                simulateEnter(activeEl); 
            }
        }, 500);
    });
}

//--- end handle grok


//--- hendle perplexity

function handlePerplexity(text) {
    // 1. Targetkan GANDA: textarea (untuk beranda) DAN contenteditable (untuk halaman chat)
    const selector = 'textarea, div[contenteditable="true"], [role="textbox"][contenteditable="true"]';
    
    waitForElement(selector, (el) => {
        el.focus();
        
        // 2. Tentukan cara injeksi berdasarkan tipe kotak inputnya
        if (el.tagName.toLowerCase() === 'textarea') {
            const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            if (nativeSetter) {
                nativeSetter.call(el, text);
            } else {
                el.value = text;
            }
        } else {
            document.execCommand('insertText', false, text);
        }
        
        // 3. Picu reaktivitas internal Perplexity
        el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
        el.dispatchEvent(new Event('change', { bubbles: true }));

        // 4. Eksekusi tombol kirim dengan pengamanan dari "null" (ditambah jeda 600ms)
        setTimeout(() => {
            const submitBtn = document.querySelector('button[aria-label*="Submit"]') || 
                              document.querySelector('button[aria-label*="Send"]') || 
                              el?.closest('form')?.querySelector('button[type="submit"]') || 
                              el?.parentElement?.querySelector('button');
                              
            if (submitBtn && !submitBtn.disabled) {
                submitBtn.click();
            } else {
                const activeEl = document.activeElement || el;
                simulateEnter(activeEl); 
            }
        }, 600); 
    });
}

//--- end handle perplexity

// ==========================================
// 3. FUNGSI PENDUKUNG (CORE HELPERS)
// ==========================================

function insertTextIntoContentEditable(element, text) {
    element.focus();
    document.execCommand('insertText', false, text);
    element.dispatchEvent(new Event('input', { bubbles: true }));
}

function setNativeValue(element, text) {
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    if (nativeSetter) {
        nativeSetter.call(element, text);
    } else {
        element.value = text;
    }
    // Wajib untuk memicu reaktivitas React/Vue/Svelte
    element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
}

// Fungsi helper baru yang lebih bersih untuk menekan tombol atau fallback ke Enter
function tryClickButton(selector, inputElement) {
    const btn = document.querySelector(selector);
    if (btn && !btn.disabled && !btn.hasAttribute('aria-disabled')) {
        btn.click();
    } else {
        simulateEnter(inputElement);
    }
}

function simulateEnter(element) {
    const enterOpts = {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        charCode: 13,
        view: window,
        shiftKey: false
    };
    
    element.dispatchEvent(new KeyboardEvent('keydown', enterOpts));
    element.dispatchEvent(new KeyboardEvent('keypress', enterOpts));
    element.dispatchEvent(new KeyboardEvent('keyup', enterOpts));
}

function waitForElement(selector, callback, checkAll = false) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
        if (checkAll) elements.forEach(callback);
        else callback(elements[0]);
        return;
    }

    const observer = new MutationObserver((mutations, obs) => {
        const currentElements = document.querySelectorAll(selector);
        if (currentElements.length > 0) {
            if (checkAll) currentElements.forEach(callback);
            else callback(currentElements[0]);
            obs.disconnect(); 
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
}
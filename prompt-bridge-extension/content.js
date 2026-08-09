// ==========================================
// 1. INISIALISASI & ROUTING
// ==========================================

const urlParams = new URLSearchParams(window.location.search);
const promptText = urlParams.get('prompt');

if (promptText) {
    window.history.replaceState({}, document.title, window.location.pathname);
    setTimeout(() => injectPrompt(promptText), 1500);
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

function handleChatGPT(text) {
    waitForElement('#prompt-textarea p', (el) => {
        insertTextIntoContentEditable(el, text);
        setTimeout(() => tryClickButton('button[data-testid="send-button"]', el), 500);
    });
}

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

function handleZai(text) {
    // 1. Cari elemen input sesuai struktur tangguh temuan F12 Anda
    const selector = 'textarea, div[contenteditable="true"], [role="textbox"]';

    waitForElement(selector, (zaiInput) => {
        zaiInput.focus();

        // 2. Inject teks sesuai dengan jenis elemen (textarea vs contenteditable)
        if (zaiInput.tagName.toLowerCase() === 'textarea') {
            const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
            if (nativeSetter) {
                nativeSetter.call(zaiInput, text);
            } else {
                zaiInput.value = text;
            }
            zaiInput.dispatchEvent(new Event('input', { bubbles: true }));
            zaiInput.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            document.execCommand('insertText', false, text);
            zaiInput.dispatchEvent(new InputEvent('input', { bubbles: true, data: text, inputType: 'insertText' }));
        }

        // 3. Auto Submit dengan delay berjenjang persis skrip F12 Anda
        setTimeout(() => {
            // Metode 1: Simulasi tombol Enter
            const enterEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13
            });
            zaiInput.dispatchEvent(enterEvent);

            // Metode 2 (Fallback): Cek apakah teks terkirim, jika tidak cari tombol kirim berbasis SVG/aria-label
            setTimeout(() => {
                const currentVal = zaiInput.value !== undefined ? zaiInput.value : zaiInput.innerText;
                if (!currentVal || currentVal.trim() === "") {
                    return; // Pesan sudah terkirim via Enter
                }

                const semuaTombol = document.querySelectorAll('button');
                let tombolKirim = null;

                semuaTombol.forEach(btn => {
                    if (!btn.disabled && btn.querySelector('svg')) {
                        const ariaLabel = btn.getAttribute('aria-label')?.toLowerCase() || '';
                        const typeAttr = btn.getAttribute('type') || '';
                        
                        if (ariaLabel.includes('send') || typeAttr === 'submit') {
                            tombolKirim = btn;
                        }
                        if (!tombolKirim) {
                            tombolKirim = btn;
                        }
                    }
                });

                if (tombolKirim) {
                    tombolKirim.click();
                } else {
                    // Fallback mutlak jika elemen target detached
                    const activeEl = document.activeElement || zaiInput;
                    simulateEnter(activeEl);
                }
            }, 200);

        }, 500);
    });
}

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
    const enterEvent = new KeyboardEvent('keydown', {
        bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13
    });
    element.dispatchEvent(enterEvent);
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
// ==========================================
// 1. INISIALISASI & ROUTING 
// ==========================================

const currentUrl = new URL(window.location.href);
const promptText = currentUrl.searchParams.get('prompt');

if (promptText) {
    window.history.replaceState({}, document.title, window.location.pathname);

    const checkExist = setInterval(() => {
        const host = window.location.hostname;
        let isReady = false;

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
// 2. HANDLER AI PLATFORM
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
    const selector = 'div.ql-editor[contenteditable="true"], div[contenteditable="true"][aria-label*="Enter"], div[contenteditable="true"]';
    
    waitForElement(selector, (el) => {
        if (el.innerText && el.innerText.trim() !== "") {
            el.innerHTML = ""; 
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

        const nativeSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype, "value"
        )?.set;
        
        if (nativeSetter) {
            nativeSetter.call(dsInput, text);
        } else {
            dsInput.value = text;
        }

        dsInput.dispatchEvent(new InputEvent('input', { 
            bubbles: true, 
            cancelable: true, 
            inputType: 'insertText', 
            data: text 
        }));
        dsInput.dispatchEvent(new Event('change', { bubbles: true }));

        setTimeout(() => {
            const wrapper = dsInput.closest('div[class*="chat-input"], div[class*="input"]') || dsInput.parentElement?.parentElement;
            
            let sendBtn = null;
            if (wrapper) {
                const candidates = wrapper.querySelectorAll('button, div[role="button"]');
                for (let i = candidates.length - 1; i >= 0; i--) {
                    const btn = candidates[i];
                    if (btn.querySelector('svg') && !btn.querySelector('input[type="file"]')) {
                        sendBtn = btn;
                        break;
                    }
                }
            }

            if (!sendBtn) {
                const allButtons = document.querySelectorAll('div[role="button"], button');
                for (let i = allButtons.length - 1; i >= 0; i--) {
                    const btn = allButtons[i];
                    if (btn.querySelector('svg') && !btn.closest('nav') && !btn.closest('header') && !btn.querySelector('input[type="file"]')) {
                        sendBtn = btn;
                        break;
                    }
                }
            }

            if (sendBtn) {
                sendBtn.removeAttribute('disabled');
                sendBtn.setAttribute('aria-disabled', 'false');
                sendBtn.classList.remove('opacity-50', 'pointer-events-none', 'disabled:opacity-50');

                sendBtn.click();
            } else {
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
        }, 1000); 
    });
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
    
    zaiInput.click();
    zaiInput.focus();
    
    setTimeout(() => {
        const nativeSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype, 'value'
        )?.set;
        
        if (nativeSetter) {
            nativeSetter.call(zaiInput, text);
        } else {
            zaiInput.value = text;
        }
        
        zaiInput.dispatchEvent(new InputEvent('input', { 
            bubbles: true, 
            cancelable: true,
            inputType: 'insertText', 
            data: text 
        }));
        zaiInput.dispatchEvent(new Event('change', { bubbles: true }));
        
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
    
    element.dispatchEvent(new KeyboardEvent('keydown', enterOpts));
    element.dispatchEvent(new KeyboardEvent('keypress', enterOpts));
    element.dispatchEvent(new KeyboardEvent('keyup', enterOpts));
    
    setTimeout(() => {
        if (!element.value || element.value.trim() === '') {
            return; // 
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
    const selector = 'textarea, div[contenteditable="true"], [role="textbox"][contenteditable="true"]';
    
    waitForElement(selector, (el) => {
        el.focus();
        
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
        
        el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
        el.dispatchEvent(new Event('change', { bubbles: true }));

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
// 3.(CORE HELPERS)
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
    element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
}

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
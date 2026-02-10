// Keyboard layout mappings
const layouts = {
    // English to Russian mapping (QWERTY to ЙЦУКЕН)
    enToRu: {
        'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е', 'y': 'н', 'u': 'г', 'i': 'ш', 'o': 'щ', 'p': 'з',
        '[': 'х', ']': 'ъ', 'a': 'ф', 's': 'ы', 'd': 'в', 'f': 'а', 'g': 'п', 'h': 'р', 'j': 'о', 'k': 'л',
        'l': 'д', ';': 'ж', '\'': 'э', 'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и', 'n': 'т', 'm': 'ь',
        ',': 'б', '.': 'ю', '/': '.', '`': 'ё',
        'Q': 'Й', 'W': 'Ц', 'E': 'У', 'R': 'К', 'T': 'Е', 'Y': 'Н', 'U': 'Г', 'I': 'Ш', 'O': 'Щ', 'P': 'З',
        '{': 'Х', '}': 'Ъ', 'A': 'Ф', 'S': 'Ы', 'D': 'В', 'F': 'А', 'G': 'П', 'H': 'Р', 'J': 'О', 'K': 'Л',
        'L': 'Д', ':': 'Ж', '"': 'Э', 'Z': 'Я', 'X': 'Ч', 'C': 'С', 'V': 'М', 'B': 'И', 'N': 'Т', 'M': 'Ь',
        '<': 'Б', '>': 'Ю', '?': ',', '~': 'Ё'
    },
    
    // Russian to English mapping (ЙЦУКЕН to QWERTY)
    ruToEn: {
        'й': 'q', 'ц': 'w', 'у': 'e', 'к': 'r', 'е': 't', 'н': 'y', 'г': 'u', 'ш': 'i', 'щ': 'o', 'з': 'p',
        'х': '[', 'ъ': ']', 'ф': 'a', 'ы': 's', 'в': 'd', 'а': 'f', 'п': 'g', 'р': 'h', 'о': 'j', 'л': 'k',
        'д': 'l', 'ж': ';', 'э': '\'', 'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b', 'т': 'n', 'ь': 'm',
        'б': ',', 'ю': '.', '.': '/', 'ё': '`',
        'Й': 'Q', 'Ц': 'W', 'У': 'E', 'К': 'R', 'Е': 'T', 'Н': 'Y', 'Г': 'U', 'Ш': 'I', 'Щ': 'O', 'З': 'P',
        'Х': '{', 'Ъ': '}', 'Ф': 'A', 'Ы': 'S', 'В': 'D', 'А': 'F', 'П': 'G', 'Р': 'H', 'О': 'J', 'Л': 'K',
        'Д': 'L', 'Ж': ':', 'Э': '"', 'Я': 'Z', 'Ч': 'X', 'С': 'C', 'М': 'V', 'И': 'B', 'Т': 'N', 'Ь': 'M',
        'Б': '<', 'Ю': '>', ',': '?', 'Ё': '~'
    }
};

// Language detection function
function detectLanguage(text) {
    if (!text.trim()) {
        return null;
    }

    const russianChars = text.match(/[а-яА-ЯёЁ]/g);
    const englishChars = text.match(/[a-zA-Z]/g);
    
    const russianCount = russianChars ? russianChars.length : 0;
    const englishCount = englishChars ? englishChars.length : 0;
    
    // If more Russian characters, it's Russian
    if (russianCount > englishCount) {
        return 'russian';
    }
    // If more English characters, it's English
    else if (englishCount > russianCount) {
        return 'english';
    }
    // If equal or no letters, default to English
    else {
        return 'english';
    }
}

// Convert text function
function convertText(text, fromLang) {
    if (!text) {
        return '';
    }

    const mapping = fromLang === 'russian' ? layouts.ruToEn : layouts.enToRu;
    
    return text.split('').map(char => {
        return mapping[char] || char;
    }).join('');
}

// DOM elements
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const detectedLang = document.getElementById('detectedLang');
const charCount = document.getElementById('charCount');
const copyBtn = document.getElementById('copyBtn');

// Main conversion handler
function handleInput() {
    const text = inputText.value;
    
    // Update character count
    const count = text.length;
    charCount.textContent = `${count} character${count !== 1 ? 's' : ''}`;
    
    // Detect language
    const language = detectLanguage(text);
    
    // Update language indicator
    if (language) {
        detectedLang.textContent = language === 'russian' ? 'Русский' : 'English';
        detectedLang.className = `detected-lang ${language}`;
    } else {
        detectedLang.textContent = '';
        detectedLang.className = 'detected-lang';
    }
    
    // Convert text
    const converted = convertText(text, language);
    outputText.value = converted;
}

// Copy to clipboard function
async function copyToClipboard() {
    const text = outputText.value;
    
    if (!text) {
        return;
    }
    
    try {
        await navigator.clipboard.writeText(text);
        
        // Update button state
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Copied!</span>
        `;
        copyBtn.classList.add('copied');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.classList.remove('copied');
        }, 2000);
        
    } catch (err) {
        console.error('Failed to copy text:', err);
        alert('Failed to copy to clipboard');
    }
}

// Event listeners
inputText.addEventListener('input', handleInput);
copyBtn.addEventListener('click', copyToClipboard);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    handleInput();
    inputText.focus();
});

// Handle paste event for better UX
inputText.addEventListener('paste', () => {
    // Use setTimeout to ensure the paste content is available
    setTimeout(handleInput, 0);
});

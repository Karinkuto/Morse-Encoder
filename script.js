// Morse Code Dictionary
const MORSE_CODE_DICT = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
    '9': '----.', '0': '-----', ',': '--..--', '.': '.-.-.-', '?': '..--..',
    '/': '-..-.', '-': '-....-', '(': '-.--.', ')': '-.--.-', ' ': '/'
};

// DOM elements
const textInput = document.getElementById('textInput');
const translateBtn = document.getElementById('translateBtn');
const stopBtn = document.getElementById('stopBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const morseOutput = document.getElementById('morseOutput');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');

// Audio context and oscillators
let audioContext;
let isPlaying = false;
let currentTimeout;

// Initialize audio context
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Convert text to Morse code
function textToMorse(text) {
    return text.toUpperCase().split('').map(char => {
        return MORSE_CODE_DICT[char] || char;
    }).join(' ');
}

// Play Morse code audio
async function playMorseCode(morseCode) {
    if (isPlaying) return;
    
    initAudio();
    isPlaying = true;
    translateBtn.disabled = true;
    stopBtn.disabled = false;
    
    const symbols = morseCode.split('');
    let delay = 0;
    
    for (let i = 0; i < symbols.length; i++) {
        if (!isPlaying) break;
        
        const symbol = symbols[i];
        
        if (symbol === '.') {
            scheduleBeep(delay, 150);
            delay += 200;
        } else if (symbol === '-') {
            scheduleBeep(delay, 300);
            delay += 400;
        } else if (symbol === '/') {
            delay += 500;
        } else if (symbol === ' ') {
            delay += 200;
        }
    }
    
    // Reset after playing
    currentTimeout = setTimeout(() => {
        isPlaying = false;
        translateBtn.disabled = false;
        stopBtn.disabled = true;
    }, delay);
}

// Schedule a beep sound
function scheduleBeep(delay, duration) {
    setTimeout(() => {
        if (!isPlaying) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    }, delay);
}

// Stop audio playback
function stopAudio() {
    isPlaying = false;
    if (currentTimeout) {
        clearTimeout(currentTimeout);
    }
    translateBtn.disabled = false;
    stopBtn.disabled = true;
}

// Show notification
function showNotification(message, isError = false) {
    notificationText.textContent = message;
    notification.className = `notification ${isError ? 'error' : ''} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Morse code copied to clipboard!');
    } catch (err) {
        showNotification('Failed to copy to clipboard', true);
    }
}

// Clear input
function clearInput() {
    textInput.value = '';
    morseOutput.innerHTML = '<span class="placeholder">Your Morse code will appear here...</span>';
    copyBtn.style.display = 'none';
    textInput.focus();
}

// Handle translate button click
function handleTranslate() {
    const text = textInput.value.trim();
    
    if (!text) {
        showNotification('Please enter some text to translate', true);
        return;
    }
    
    const morseCode = textToMorse(text);
    
    // Update output with typing animation
    morseOutput.classList.add('typing');
    morseOutput.innerHTML = morseCode;
    
    // Show copy button
    copyBtn.style.display = 'inline-flex';
    
    // Remove typing animation class
    setTimeout(() => {
        morseOutput.classList.remove('typing');
    }, 500);
    
    // Play audio
    playMorseCode(morseCode);
}

// Event listeners
translateBtn.addEventListener('click', handleTranslate);
stopBtn.addEventListener('click', stopAudio);
clearBtn.addEventListener('click', clearInput);
copyBtn.addEventListener('click', () => {
    const morseText = morseOutput.textContent;
    if (morseText && !morseText.includes('Your Morse code will appear here')) {
        copyToClipboard(morseText);
    }
});

// Handle Enter key in textarea
textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        handleTranslate();
    }
});

// Auto-resize textarea
textInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Focus on input
    textInput.focus();
    
    // Add some sample text for demo
    textInput.value = 'Hello World';
    
    // Show initial state
    handleTranslate();
});

// Handle page visibility change to stop audio when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden && isPlaying) {
        stopAudio();
    }
});

// Handle window focus to resume audio context if needed
window.addEventListener('focus', () => {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
});
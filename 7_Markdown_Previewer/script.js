const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
let fullscreenElement = null;
let isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

const wordCount = document.querySelector('.word-count');
const charCount = document.querySelector('.char-count');
const lineCount = document.querySelector('.line-count');
const container = document.querySelector('.container');

// Initialize Markdown parser
marked.setOptions({
    highlight: code => hljs.highlightAuto(code).value,
    breaks: true,
    gfm: true
});

// Event Listeners
editor.addEventListener('input', function(e) {
    handleEditorInput(e);
    updateWordCount();
});
editor.addEventListener('keydown', handleKeyboardShortcuts);
document.addEventListener('fullscreenchange', handleFullscreenExit);
document.addEventListener('click', (e) => {
    const modal = document.getElementById('shortcutsModal');
    if (e.target === modal) {
        toggleShortcutsModal();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const savedContent = localStorage.getItem('markdownContent') || `# 📝 Welcome to Markdown Editor!

## ❓ Example Question

Let's write an algorithm to solve this:

### 🔢 Problem Statement

You are given an array of integers. Your task is to find the **kth smallest element** in the array.

### 🧠 Input

- An integer array: \`arr[] = {7, 10, 4, 3, 20, 15}\`
- An integer: \`k = 3\`

### 🎯 Output

- The 3rd smallest element is: \`7\`

### 💡 Constraints

- You may not use built-in sort functions.
- The solution should be efficient for large input sizes.

### 🛠️ Example

\`\`\`cpp
Input: arr[] = {7, 10, 4, 3, 20, 15}, k = 3
Output: 7
\`\`\`

Try implementing it below 👇
`;

editor.value = savedContent;

    
    // Initialize everything
    updatePreview(savedContent);
    initializeTheme();
    updateWordCount();
});

function handleEditorInput(e) {
    debouncedUpdatePreview(e.target.value);
}

function handleKeyboardShortcuts(e) {
    const cmdKey = isMac ? e.metaKey :  e.ctrlKey;
    
    // Bold: Cmd/Ctrl + B
    if (cmdKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        formatText('bold');
    }
    
    // Italic: Cmd/Ctrl + I
    if (cmdKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        formatText('italic');
    }
    
    // Code Block: Cmd/Ctrl + K
    if (cmdKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        formatText('code');
    }
    
    // Save: Cmd/Ctrl + S
    if (cmdKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveToLocalStorage(true);
    }
    
    // Download: Cmd/Ctrl + Shift + S
    if (cmdKey && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        downloadMarkdown('markdown');
    }

    // Download HTML: Cmd/Ctrl + Shift + H
    if (cmdKey && e.shiftKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        downloadMarkdown('html');
    }
    
    // Escape: Exit fullscreen
    if (e.key === 'Escape' && fullscreenElement) {
        exitFullscreen();
    }
    
    // Show shortcuts modal: ?
    if (e.key === '?' && !e.shiftKey && !cmdKey) {
        e.preventDefault();
        toggleShortcutsModal();
    }

    // Unordered List: Ctrl + L
    if (cmdKey && !e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        formatText('list');
    }

    // Ordered List: Ctrl + Alt + L
    if (cmdKey && e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        formatText('olist');
    }

    // Headings: Ctrl + 1-6
    if (cmdKey && !e.altKey && !e.shiftKey && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        formatText('heading');
    }

    // Link: Ctrl + U
    if (cmdKey && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        formatText('link');
    }

    // Table: Ctrl + T
    if (cmdKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        formatText('table');
    }
}

// Add after the existing keyboard shortcuts handler
function toggleShortcutsModal() {
    const modal = document.getElementById('shortcutsModal');
    const currentDisplay = window.getComputedStyle(modal).display;
    modal.style.display = currentDisplay === 'none' ? 'block' : 'none';
}

// Preview Functions
const debouncedUpdatePreview = debounce(text => {
    const cleanHTML = DOMPurify.sanitize(marked.parse(text));
    preview.innerHTML = cleanHTML;
    hljs.highlightAll();
    saveToLocalStorage();
}, 200);

function updatePreview(text) {
    preview.innerHTML = DOMPurify.sanitize(marked.parse(text));
    hljs.highlightAll();
}

// Fullscreen Functions
function toggleFullscreen(elementId) {
    const element = document.getElementById(elementId);
    const container = element.closest('.editor-container, .preview-container');

    if (!document.fullscreenElement) {
        try {
            container.requestFullscreen()
                .then(() => {
                    container.classList.add('fullscreen');
                    fullscreenElement = container;
                    
                    // Adjust heights for editor and preview
                    if (elementId === 'editor') {
                        const editorWrapper = container.querySelector('.editor-wrapper');
                        editorWrapper.style.height = 'calc(100vh - 79px)';
                        element.style.height = '100%';
                    } else if (elementId === 'preview') {
                        element.style.height = 'calc(100vh - 49px)';
                    }
                })
                .catch(err => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
        } catch (err) {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        }
    } else {
        exitFullscreen();
    }
}

function exitFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen()
            .then(() => {
                if (fullscreenElement) {
                    fullscreenElement.classList.remove('fullscreen');
                    
                    // Reset heights
                    const editor = document.getElementById('editor');
                    const preview = document.getElementById('preview');
                    const editorWrapper = document.querySelector('.editor-wrapper');
                    
                    if (editorWrapper) {
                        editorWrapper.style.height = 'calc(100% - 90px)';
                    }
                    if (editor) {
                        editor.style.height = '100%';
                    }
                    if (preview) {
                        preview.style.height = 'calc(100% - 49px)';
                    }
                    
                    fullscreenElement = null;
                }
            })
            .catch(err => {
                console.error(`Error attempting to exit fullscreen: ${err.message}`);
            });
    }
}

function handleFullscreenExit() {
    if (!document.fullscreenElement && fullscreenElement) {
        fullscreenElement.classList.remove('fullscreen');
        
        // Reset heights
        const editor = document.getElementById('editor');
        const preview = document.getElementById('preview');
        const editorWrapper = document.querySelector('.editor-wrapper');
        
        if (editorWrapper) {
            editorWrapper.style.height = 'calc(100% - 90px)';
        }
        if (editor) {
            editor.style.height = '100%';
        }
        if (preview) {
            preview.style.height = 'calc(100% - 49px)';
        }
        
        fullscreenElement = null;
    }
}

// Storage Functions
function saveToLocalStorage(showNotification = false) {
    localStorage.setItem('markdownContent', editor.value);
    if (showNotification) showSaveNotification();
}

function showSaveNotification() {
    const notification = document.getElementById('saveNotification');
    notification.style.display = 'block';
    setTimeout(() => notification.style.display = 'none', 2000);
}

// Utility Functions
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), timeout);
    };
}

// Theme Functions
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Add theme change listener
prefersDarkScheme.addListener((e) => {
    if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
});

// Word Count Functions
function updateWordCount() {
    if (!wordCount || !charCount || !lineCount) return; // Guard clause
    
    const text = editor.value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const chars = text.length;
    const lines = text.split('\n').length;
    
    wordCount.textContent = `Words: ${words}`;
    charCount.textContent = `Characters: ${chars}`;
    lineCount.textContent = `Lines: ${lines}`;
}

// View Toggle Function
function toggleView() {
    const container = document.querySelector('.container');
    container.classList.toggle('horizontal');
}

// Update the downloadMarkdown function to support both Markdown and HTML downloads
function downloadMarkdown(format = 'markdown') {
    try {
        let content, mimeType, fileExtension;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        
        if (format === 'html') {
            content = preview.innerHTML;
            mimeType = 'text/html';
            fileExtension = 'html';
        } else {
            content = editor.value;
            mimeType = 'text/markdown';
            fileExtension = 'md';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const filename = `document-${timestamp}.${fileExtension}`;
        
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = filename;
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(url);

        // Show success notification
        const notification = document.getElementById('saveNotification');
        notification.textContent = `${format.toUpperCase()} File Downloaded!`;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
            notification.textContent = 'Changes Saved!'; // Reset text
        }, 2000);
    } catch (err) {
        console.error('Error downloading file:', err);
        const notification = document.getElementById('saveNotification');
        notification.textContent = 'Download Failed!';
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
            notification.textContent = 'Changes Saved!'; // Reset text
        }, 2000);
    }
}

// Insert List Function
function insertList(prefix) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const text = editor.value;
    const lines = text.substring(start, end).split('\n');
    const formattedLines = lines.map(line => prefix + line).join('\n');
    
    editor.value = text.substring(0, start) + formattedLines + text.substring(end);
    editor.focus();
}

// Add loading indicator to document
const loadingIndicator = document.createElement('div');
loadingIndicator.className = 'loading';
loadingIndicator.innerHTML = '<div class="loading-spinner"></div><span>Processing...</span>';
document.body.appendChild(loadingIndicator);

// Add this new helper function for inserting at cursor position
function insertAtCursor(text) {
    const start = editor.selectionStart;
    const end = editor.selectionStart;
    const editorContent = editor.value;
    
    editor.value = 
        editorContent.substring(0, start) + 
        text + 
        editorContent.substring(end);
    
    editor.focus();
    editor.selectionStart = start + text.length;
    editor.selectionEnd = start + text.length;

    // Trigger preview update
    debouncedUpdatePreview(editor.value);
    editor.dispatchEvent(new Event('input'));
}

// Add this after your existing shortcuts handling code

const commands = [
    { name: 'Bold Text', shortcut: 'Ctrl + B', action: () => formatText('bold') },
    { name: 'Italic Text', shortcut: 'Ctrl + I', action: () => formatText('italic') },
    { name: 'Code Block', shortcut: 'Ctrl + K', action: () => formatText('code') },
    { name: 'Save Changes', shortcut: 'Ctrl + S', action: () => saveToLocalStorage(true) },
    { name: 'Download Markdown', shortcut: 'Ctrl + Shift + S', action: () => downloadMarkdown('markdown') },
    { name: 'Download HTML', shortcut: 'Ctrl + Shift + H', action: () => downloadMarkdown('html') },
    { name: 'Unordered List', shortcut: 'Ctrl + L', action: () => formatText('list') },
    { name: 'Ordered List', shortcut: 'Ctrl + Alt + L', action: () => formatText('olist') },
    { name: 'Insert Link', shortcut: 'Ctrl + U', action: () => formatText('link') },
    { name: 'Insert Table', shortcut: 'Ctrl + T', action: () => formatText('table') },
    // Add heading commands
    ...[1, 2, 3, 4, 5, 6].map(level => ({
        name: `Heading ${level}`,
        shortcut: `Ctrl + ${level}`,
        action: () => formatText('heading')
    }))
];

function toggleCommandPalette(show = true) {
    const palette = document.getElementById('commandPalette');
    const searchInput = document.getElementById('commandSearch');
    
    if (show) {
        palette.style.display = 'block';
        searchInput.value = '';
        searchInput.focus();
        renderCommands(commands);
    } else {
        palette.style.display = 'none';
    }
}

function renderCommands(filteredCommands) {
    const commandList = document.getElementById('commandList');
    commandList.innerHTML = filteredCommands
        .map((cmd, index) => `
            <div class="command-item ${index === 0 ? 'selected' : ''}" data-index="${index}">
                <span>${cmd.name}</span>
                <span class="command-shortcut">
                    ${cmd.shortcut.split(' + ').map(key => `<kbd>${key}</kbd>`).join('')}
                </span>
            </div>
        `)
        .join('');
}

// Add event listeners for command palette
document.addEventListener('keydown', function(e) {
    // Show command palette on '/'
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggleCommandPalette(true);
    }
    
    // Hide on escape
    if (e.key === 'Escape') {
        toggleCommandPalette(false);
    }
});

// Add search functionality
document.getElementById('commandSearch')?.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    const filteredCommands = commands.filter(cmd => 
        cmd.name.toLowerCase().includes(query) || 
        cmd.shortcut.toLowerCase().includes(query)
    );
    renderCommands(filteredCommands);
});

// Handle command selection and execution
document.getElementById('commandList')?.addEventListener('click', function(e) {
    const commandItem = e.target.closest('.command-item');
    if (commandItem) {
        const index = parseInt(commandItem.dataset.index);
        const command = commands[index];
        command.action();
        toggleCommandPalette(false);
    }
});

// Handle keyboard navigation in command palette
document.getElementById('commandSearch')?.addEventListener('keydown', function(e) {
    const items = document.querySelectorAll('.command-item');
    const selectedItem = document.querySelector('.command-item.selected');
    const selectedIndex = Array.from(items).indexOf(selectedItem);

    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            if (selectedIndex < items.length - 1) {
                items[selectedIndex].classList.remove('selected');
                items[selectedIndex + 1].classList.add('selected');
                items[selectedIndex + 1].scrollIntoView({ block: 'nearest' });
            }
            break;
        case 'ArrowUp':
            e.preventDefault();
            if (selectedIndex > 0) {
                items[selectedIndex].classList.remove('selected');
                items[selectedIndex - 1].classList.add('selected');
                items[selectedIndex - 1].scrollIntoView({ block: 'nearest' });
            }
            break;
        case 'Enter':
            e.preventDefault();
            if (selectedItem) {
                const index = parseInt(selectedItem.dataset.index);
                commands[index].action();
                toggleCommandPalette(false);
            }
            break;
    }
});

// Add formatText function
function formatText(type) {
    const editor = document.getElementById('editor');
    const selection = editor.value.substring(editor.selectionStart, editor.selectionEnd);
    
    const formats = {
        bold: { prefix: '**', suffix: '**', placeholder: 'bold text' },
        italic: { prefix: '*', suffix: '*', placeholder: 'italic text' },
        heading: { prefix: '# ', suffix: '', placeholder: 'heading' },
        link: { prefix: '[', suffix: '](url)', placeholder: 'link text' },
        list: { prefix: '- ', suffix: '', placeholder: 'list item' },
        olist: { prefix: '1. ', suffix: '', placeholder: 'list item' },
        code: { prefix: '```\n', suffix: '\n```', placeholder: 'code' },
        quote: { prefix: '> ', suffix: '', placeholder: 'quote' },
        table: {
            prefix: '',
            suffix: '',
            placeholder: '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |'
        }
    };

    const format = formats[type];
    
    if (selection) {
        wrapSelection(format.prefix, format.suffix);
    } else {
        insertAtCursor(format.prefix + format.placeholder + format.suffix);
        
        // Set cursor position inside the placeholder
        const cursorPos = editor.selectionStart - format.suffix.length - format.placeholder.length;
        editor.selectionStart = cursorPos;
        editor.selectionEnd = cursorPos + format.placeholder.length;
    }
    
    editor.focus();
}

// Update existing wrapSelection function if needed
function wrapSelection(prefix, suffix) {
    const editor = document.getElementById('editor');
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selectedText = editor.value.substring(start, end);
    
    const newText = prefix + selectedText + suffix;
    
    editor.value = 
        editor.value.substring(0, start) +
        newText +
        editor.value.substring(end);
    
    // Trigger preview update
    editor.dispatchEvent(new Event('input'));
    
    // Set cursor position
    if (selectedText.length > 0) {
        editor.selectionStart = start;
        editor.selectionEnd = start + newText.length;
    } else {
        editor.selectionStart = start + prefix.length;
        editor.selectionEnd = start + prefix.length;
    }
}
// DOM Elements
const urlInput = document.getElementById('url');
const urlValidation = document.getElementById('urlValidation');
const qrcodeContainer = document.getElementById('qrcode');
const themeToggle = document.getElementById('themeToggle');
const formatButtons = document.querySelectorAll('.format-button');
const statusMessage = document.getElementById('statusMessage');
const loadingIndicator = document.getElementById('loadingIndicator');

// Create our own QR code implementation since the library reference was causing issues
function createQRCode(text, options) {
    // Clear previous content
    qrcodeContainer.innerHTML = '';
    
    // Default options
    const opt = {
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        ...options
    };
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = opt.width;
    canvas.height = opt.height;
    qrcodeContainer.appendChild(canvas);
    
    // Get context
    const ctx = canvas.getContext('2d');
    
    // Use qrcode-generator library
    const typeNumber = 0; // Auto-detect
    const errorCorrectionLevel = 'H'; // High error correction
    const qr = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData(text);
    qr.make();
    
    // Calculate cell size
    const cellSize = Math.min(opt.width, opt.height) / qr.getModuleCount();
    
    // Clear canvas
    ctx.fillStyle = opt.colorLight;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw QR code on canvas
    for (let row = 0; row < qr.getModuleCount(); row++) {
        for (let col = 0; col < qr.getModuleCount(); col++) {
            if (qr.isDark(row, col)) {
                ctx.fillStyle = opt.colorDark;
                const x = col * cellSize;
                const y = row * cellSize;
                ctx.fillRect(x, y, cellSize, cellSize);
            }
        }
    }
    
    return {
        _canvas: canvas,
        _qr: qr
    };
}

// QR Code instance
let qrInstance = null;

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Update icon
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
});

// Generate QR code based on input URL
function generateQRCode(url) {
    try {
        qrInstance = createQRCode(url, {
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff"
        });
    } catch (error) {
        console.error('Error generating QR code:', error);
        showStatus('Error generating QR code', 'error');
    }
}

// Validate URL
function isValidURL(string) {
    // A more flexible URL validation that accepts relative URLs too
    if (!string) return false;
    
    // Check if it's already a valid absolute URL
    try {
        new URL(string);
        return true;
    } catch (_) {
        // Not a valid absolute URL, check if adding https:// makes it valid
        try {
            if (!string.startsWith('http://') && !string.startsWith('https://')) {
                new URL('https://' + string);
                return true;
            }
            return false;
        } catch (_) {
            return false;
        }
    }
}

// Format URL by adding https:// if missing
function formatURL(url) {
    if (!url) return '';
    
    // If URL doesn't start with http:// or https://, add https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://' + url;
    }
    return url;
}

// URL input event
urlInput.addEventListener('input', function() {
    const url = this.value.trim();
    
    // Clear validation message
    urlValidation.textContent = '';
    
    if (url === '') {
        qrcodeContainer.innerHTML = '';
        return;
    }
    
    if (isValidURL(url)) {
        generateQRCode(formatURL(url));
    } else {
        urlValidation.textContent = 'Please enter a valid URL';
        qrcodeContainer.innerHTML = '';
    }
});

// Download QR code as image
formatButtons.forEach(button => {
    button.addEventListener('click', function() {
        const format = this.getAttribute('data-format');
        const url = urlInput.value.trim();
        
        if (!url) {
            showStatus('Please enter a URL first', 'error');
            return;
        }
        
        if (!isValidURL(url)) {
            showStatus('Please enter a valid URL', 'error');
            return;
        }
        
        downloadQRCode(format);
    });
});

function downloadQRCode(format) {
    showLoading(true);
    
    setTimeout(() => {
        try {
            if (!qrInstance || !qrInstance._canvas) {
                showStatus('QR code not generated yet', 'error');
                showLoading(false);
                return;
            }
            
            const canvas = qrInstance._canvas;
            let dataURL;
            let filename = 'qrcode-' + Date.now();
            
            if (format === 'svg') {
                // Create SVG from QR data
                const qr = qrInstance._qr;
                const moduleCount = qr.getModuleCount();
                const cellSize = 4; // SVG cell size
                
                // Create SVG content
                let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${moduleCount * cellSize} ${moduleCount * cellSize}" width="${moduleCount * cellSize}" height="${moduleCount * cellSize}">`;
                svgContent += `<rect width="100%" height="100%" fill="#FFFFFF"/>`;
                
                // Add QR code cells
                for (let row = 0; row < moduleCount; row++) {
                    for (let col = 0; col < moduleCount; col++) {
                        if (qr.isDark(row, col)) {
                            svgContent += `<rect x="${col * cellSize}" y="${row * cellSize}" width="${cellSize}" height="${cellSize}" fill="#000000"/>`;
                        }
                    }
                }
                
                svgContent += `</svg>`;
                
                dataURL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);
                filename += '.svg';
            } else if (format === 'jpeg') {
                // Convert to JPEG
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
                const ctx = tempCanvas.getContext('2d');
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                ctx.drawImage(canvas, 0, 0);
                
                dataURL = tempCanvas.toDataURL('image/jpeg', 0.9);
                filename += '.jpg';
            } else {
                // PNG (default)
                dataURL = canvas.toDataURL('image/png');
                filename += '.png';
            }
            
            // Create download link
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showStatus(`QR code downloaded as ${format.toUpperCase()}`, 'success');
        } catch (error) {
            console.error('Download error:', error);
            showStatus('Error downloading QR code', 'error');
        } finally {
            showLoading(false);
        }
    }, 500); // Brief delay to show loading
}

function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message ' + type;
    
    // Clear status after 3 seconds
    setTimeout(() => {
        statusMessage.textContent = '';
        statusMessage.className = 'status-message';
    }, 3000);
}

function showLoading(isLoading) {
    loadingIndicator.style.display = isLoading ? 'block' : 'none';
}

// Initialize with a default URL
urlInput.value = 'https://example.com';
generateQRCode(urlInput.value);
// Calculator logic
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let current = '0';
let operator = null;
let operand = null;
let resetNext = false;

function updateDisplay() {
    display.textContent = current;
}

function inputNumber(num) {
    if (resetNext) {
        current = num;
        resetNext = false;
    } else {
        if (current === '0' && num !== '.') {
            current = num;
        } else if (num === '.' && current.includes('.')) {
            // Prevent multiple decimals
            return;
        } else {
            current += num;
        }
    }
    updateDisplay();
}

function inputOperator(op) {
    if (operator && !resetNext) {
        calculate();
    }
    operand = parseFloat(current);
    operator = op;
    resetNext = true;
    // Show the operator in the display for feedback
    display.textContent = operand + ' ' + op;
}

function calculate() {
    if (operator === null || operand === null) return;
    let result = 0;
    const curr = parseFloat(current);
    switch (operator) {
        case '+':
            result = operand + curr;
            break;
        case '-':
            result = operand - curr;
            break;
        case '*':
            result = operand * curr;
            break;
        case '/':
            result = curr === 0 ? 'Error' : operand / curr;
            break;
        case '%':
            result = operand % curr;
            break;
        default:
            result = curr;
    }
    current = result.toString().length > 12 ? result.toExponential(6) : result.toString();
    operator = null;
    operand = null;
    resetNext = true;
    updateDisplay();
}

function clearAll() {
    current = '0';
    operator = null;
    operand = null;
    resetNext = false;
    updateDisplay();
}

function backspace() {
    if (resetNext || current.length === 1) {
        current = '0';
        resetNext = false;
    } else {
        current = current.slice(0, -1);
    }
    updateDisplay();
}

function percent() {
    current = (parseFloat(current) / 100).toString();
    updateDisplay();
}

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        if (!isNaN(action) || action === '.') {
            inputNumber(action);
        } else if (['+', '-', '*', '/'].includes(action)) {
            inputOperator(action);
        } else if (action === '=') {
            calculate();
        } else if (action === 'clear') {
            clearAll();
        } else if (action === 'backspace') {
            backspace();
        } else if (action === 'percent') {
            percent();
        }
    });
});

// Keyboard support
window.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        inputNumber(e.key);
    } else if (["+", "-", "*", "/"].includes(e.key)) {
        inputOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Backspace') {
        backspace();
    } else if (e.key.toLowerCase() === 'c') {
        clearAll();
    } else if (e.key === '%') {
        percent();
    }
});

updateDisplay();

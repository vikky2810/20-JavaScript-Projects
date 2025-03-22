let timeLeft;
let timerId = null;
let isWorkSession = true;
let isRunning = false;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const workTimeInput = document.getElementById('workTime');
const breakTimeInput = document.getElementById('breakTime');
const sessionLabel = document.getElementById('sessionLabel');

function initializeTimer() {
    timeLeft = workTimeInput.value * 60;
    updateTimerDisplay();
    updateSessionLabelClass();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateSessionLabelClass() {
    sessionLabel.className = isWorkSession ? 'session-label work' : 'session-label break';
}

startBtn.addEventListener('click', () => {
    if (timerId === null) {
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        isRunning = true;
        
        timerId = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                playBeep();
                
                isWorkSession = !isWorkSession;
                sessionLabel.textContent = isWorkSession ? 'Work Session' : 'Break Session';
                updateSessionLabelClass();
                
                timeLeft = isWorkSession ? workTimeInput.value * 60 : breakTimeInput.value * 60;
                updateTimerDisplay();
                startBtn.disabled = false;
                pauseBtn.disabled = true;
            }
        }, 1000);
    }
});

pauseBtn.addEventListener('click', () => {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    isRunning = false;
    isWorkSession = true;
    sessionLabel.textContent = 'Work Session';
    updateSessionLabelClass();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    initializeTimer();
});

workTimeInput.addEventListener('change', () => {
    if (isWorkSession && !isRunning) {
        initializeTimer();
    }
});

breakTimeInput.addEventListener('change', () => {
    if (!isWorkSession && !isRunning) {
        timeLeft = breakTimeInput.value * 60;
        updateTimerDisplay();
    }
});

initializeTimer();

function playBeep() {
    try {
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
        audio.play();
    } catch (error) {
        console.error('Error playing sound:', error);
    }
}

function updateProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        progressContainer.appendChild(progressBar);
        document.querySelector('.timer').appendChild(progressContainer);
    }
    
    const totalTime = isWorkSession ? workTimeInput.value * 60 : breakTimeInput.value * 60;
    const percentage = ((totalTime - timeLeft) / totalTime) * 100;
    progressBar.style.width = `${percentage}%`;
}

const darkModeToggle = document.createElement('button');
darkModeToggle.className = 'dark-mode-toggle';

const sunIcon = document.createElement('i');
sunIcon.setAttribute('data-lucide', 'sun');
sunIcon.className = 'sun-icon';

const moonIcon = document.createElement('i');
moonIcon.setAttribute('data-lucide', 'moon');
moonIcon.className = 'moon-icon';
moonIcon.style.display = 'none';

const toggleText = document.createElement('span');
toggleText.className = 'toggle-text';
toggleText.textContent = 'Toggle Dark Mode';

darkModeToggle.appendChild(sunIcon);
darkModeToggle.appendChild(moonIcon);
darkModeToggle.appendChild(toggleText);

darkModeToggle.addEventListener('click', toggleDarkMode);
document.querySelector('.container').appendChild(darkModeToggle);
lucide.createIcons();

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const container = document.querySelector('.container');
    container.classList.toggle('dark-mode');
    
    const sunIcon = darkModeToggle.querySelector('.sun-icon');
    const moonIcon = darkModeToggle.querySelector('.moon-icon');
    const toggleText = darkModeToggle.querySelector('.toggle-text');
    
    if (document.body.classList.contains('dark-mode')) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'inline-block';
        toggleText.textContent = 'Toggle Light Mode';
    } else {
        sunIcon.style.display = 'inline-block';
        moonIcon.style.display = 'none';
        toggleText.textContent = 'Toggle Dark Mode';
    }
}

const style = document.createElement('style');
style.textContent = `
    body.dark-mode {
        background-color: #222;
        color: #fff;
    }
    .container.dark-mode {
        background-color: #333;
        color: #fff;
    }
    .progress-container {
        width: 100%;
        height: 10px;
        background-color: #eee;
        border-radius: 5px;
        margin-top: 10px;
    }
    .progress-bar {
        height: 100%;
        background-color: #007bff;
        border-radius: 5px;
        width: 0%;
        transition: width 1s linear;
    }
    .dark-mode-toggle {
        margin-top: 20px;
        padding: 8px 16px;
        background-color: #555;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-left: auto;
        margin-right: auto;
    }
    .dark-mode-toggle svg {
        fill: currentColor;
    }
`;
document.head.appendChild(style);

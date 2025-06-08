// Digital Clock & Alarm
const clock = document.getElementById('clock');
const alarmForm = document.getElementById('alarm-form');
const alarmTimeInput = document.getElementById('alarm-time');
const alarmStatus = document.getElementById('alarm-status');
const clearAlarmBtn = document.getElementById('clear-alarm');
const alarmAudio = document.getElementById('alarm-audio');

let alarmTime = null;
let alarmTimeout = null;
let is24Hour = true;

function updateClock() {
    const now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let displayH = h;
    let ampm = '';
    if (!is24Hour) {
        ampm = h >= 12 ? ' PM' : ' AM';
        displayH = h % 12 || 12;
    }
    const hh = displayH.toString().padStart(2, '0');
    const mm = m.toString().padStart(2, '0');
    const ss = s.toString().padStart(2, '0');
    // Use a span for AM/PM to keep layout consistent
    clock.innerHTML = `${hh}:${mm}:${ss}${!is24Hour ? '<span class="ampm">'+ampm+'</span>' : ''}`;

    if (alarmTime && `${h.toString().padStart(2, '0')}:${mm}` === alarmTime) {
        triggerAlarm();
    }
}

document.getElementById('toggle-format').addEventListener('click', function() {
    is24Hour = !is24Hour;
    this.textContent = is24Hour ? '24H' : '12H';
    this.classList.toggle('active', !is24Hour);
    updateClock();
});

function triggerAlarm() {
    alarmAudio.play();
    alarmStatus.textContent = '⏰ Alarm ringing!';
    alarmStatus.className = 'ringing';
    document.getElementById('ring-animation').classList.add('active');
    setTimeout(() => {
        document.getElementById('ring-animation').classList.remove('active');
    }, 4000);
    clearAlarm();
}

function setAlarm(e) {
    e.preventDefault();
    alarmTime = alarmTimeInput.value;
    if (alarmTime) {
        alarmStatus.textContent = `Alarm set for ${alarmTime}`;
        alarmStatus.className = '';
    }
}

function clearAlarm() {
    alarmTime = null;
    alarmTimeInput.value = '';
    if (alarmTimeout) clearTimeout(alarmTimeout);
    alarmStatus.textContent = 'Alarm cleared.';
    alarmStatus.className = '';
    document.getElementById('ring-animation').classList.remove('active');
}

alarmForm.addEventListener('submit', setAlarm);
clearAlarmBtn.addEventListener('click', clearAlarm);

setInterval(updateClock, 1000);
updateClock();

// Calendar logic
const monthYear = document.getElementById('monthYear');
const calendarBody = document.getElementById('calendarBody');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const themeSwitcher = document.getElementById('themeSwitcher');

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

// Event storage (localStorage)
function getEvents() {
  return JSON.parse(localStorage.getItem('calendarEvents') || '{}');
}
function saveEvents(events) {
  localStorage.setItem('calendarEvents', JSON.stringify(events));
}

function renderCalendar(month, year) {
  monthYear.textContent = `${today.toLocaleString('default', { month: 'long' })} ${year}`;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const events = getEvents();

  let date = 1;
  calendarBody.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    let row = document.createElement('tr');
    for (let j = 0; j < 7; j++) {
      let cell = document.createElement('td');
      if (i === 0 && j < firstDay) {
        cell.textContent = '';
      } else if (date > daysInMonth) {
        cell.textContent = '';
      } else {
        cell.textContent = date;
        const isToday = date === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        if (isToday) cell.classList.add('today');
        // Event indicator
        const key = `${year}-${month + 1}-${date}`;
        if (events[key]) {
          const dot = document.createElement('span');
          dot.style.display = 'inline-block';
          dot.style.width = '6px';
          dot.style.height = '6px';
          dot.style.background = 'var(--accent)';
          dot.style.borderRadius = '50%';
          dot.style.marginLeft = '4px';
          cell.appendChild(dot);
          // Tooltip for event
          cell.classList.add('has-event');
          cell.setAttribute('data-event', events[key]);
        }
        cell.addEventListener('click', () => addEventPrompt(key));
        date++;
      }
      row.appendChild(cell);
    }
    calendarBody.appendChild(row);
    if (date > daysInMonth) break;
  }
}

// Modal logic
const eventModal = document.getElementById('eventModal');
const closeModal = document.getElementById('closeModal');
const modalDate = document.getElementById('modalDate');
const eventInput = document.getElementById('eventInput');
const saveEventBtn = document.getElementById('saveEvent');
const deleteEventBtn = document.getElementById('deleteEvent');
let modalKey = '';
let modalDateObj = null;

function showEventModal(key, dateObj) {
  modalKey = key;
  modalDateObj = dateObj;
  const events = getEvents();
  eventInput.value = events[key] || '';
  modalDate.textContent = dateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  eventModal.style.display = 'flex';
  eventInput.focus();
}
function hideEventModal() {
  eventModal.style.display = 'none';
  modalKey = '';
  modalDateObj = null;
}
closeModal.onclick = hideEventModal;
eventModal.onclick = (e) => { if (e.target === eventModal) hideEventModal(); };

eventInput.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { saveEventBtn.click(); e.preventDefault(); } };
saveEventBtn.onclick = () => {
  const events = getEvents();
  if (eventInput.value.trim()) {
    events[modalKey] = eventInput.value.trim();
  } else {
    delete events[modalKey];
  }
  saveEvents(events);
  hideEventModal();
  renderCalendar(currentMonth, currentYear);
};
deleteEventBtn.onclick = () => {
  const events = getEvents();
  delete events[modalKey];
  saveEvents(events);
  hideEventModal();
  renderCalendar(currentMonth, currentYear);
};

prevMonthBtn.onclick = () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  today = new Date(currentYear, currentMonth, 1);
  renderCalendar(currentMonth, currentYear);
};
nextMonthBtn.onclick = () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  today = new Date(currentYear, currentMonth, 1);
  renderCalendar(currentMonth, currentYear);
};

// Theme switching
function setTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('calendarTheme', theme);
}
themeSwitcher.onchange = (e) => setTheme(e.target.value);
(function initTheme() {
  const saved = localStorage.getItem('calendarTheme') || 'light';
  themeSwitcher.value = saved;
  setTheme(saved);
})();

// Tooltip logic
let tooltip;
calendarBody.addEventListener('mouseover', function(e) {
  const td = e.target.closest('td.has-event');
  if (td && td.dataset.event) {
    tooltip = document.createElement('div');
    tooltip.className = 'event-tooltip';
    tooltip.textContent = td.dataset.event;
    document.body.appendChild(tooltip);
    const rect = td.getBoundingClientRect();
    tooltip.style.left = rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top + window.scrollY - tooltip.offsetHeight - 8 + 'px';
  }
});
calendarBody.addEventListener('mouseout', function(e) {
  if (tooltip) {
    tooltip.remove();
    tooltip = null;
  }
});

// Initial render
renderCalendar(currentMonth, currentYear);
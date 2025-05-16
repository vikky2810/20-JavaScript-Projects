
        // DOM Elements
        const themeToggle = document.getElementById('theme-toggle');
        const addTaskBtn = document.getElementById('add-task-btn');
        const taskTitle = document.getElementById('task-title');
        const taskDescription = document.getElementById('task-description');
        const taskStatus = document.getElementById('task-status');
        const searchInput = document.getElementById('search-input');
        const filterStatus = document.getElementById('filter-status');
        const taskLists = document.querySelectorAll('.task-list');
        const editModal = document.getElementById('edit-modal');
        const closeModal = document.querySelector('.close-modal');
        const saveEditBtn = document.getElementById('save-edit-btn');
        const editTitle = document.getElementById('edit-title');
        const editDescription = document.getElementById('edit-description');
        const editStatus = document.getElementById('edit-status');
        const editTaskId = document.getElementById('edit-task-id');

        // Set up the tasks array
        let tasks = [];

        // Generate unique ID
        function generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }

        // Initialize theme
        function initTheme() {
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.body.classList.toggle('dark-theme', savedTheme === 'dark');
        }

        // Toggle theme
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', currentTheme);
        });

        // Save tasks to localStorage
        function saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
            updateTaskCounts();
        }

        // Load tasks from localStorage
        function loadTasks() {
            const savedTasks = localStorage.getItem('tasks');
            tasks = savedTasks ? JSON.parse(savedTasks) : [];
            renderTasks();
        }

        // Create task element
        function createTaskElement(task) {
            const taskEl = document.createElement('div');
            taskEl.classList.add('task');
            taskEl.setAttribute('draggable', true);
            taskEl.setAttribute('data-id', task.id);
            
            const statusClass = `status-${task.status}`;
            const statusText = task.status === 'inprogress' ? 'In Progress' : 
                              task.status === 'todo' ? 'To Do' : 'Done';
            
            taskEl.innerHTML = `
                <span class="task-status ${statusClass}">${statusText}</span>
                <div class="task-header">
                    <div class="task-title">${task.title}</div>
                    <div class="task-actions">
                        <button class="edit-btn">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="delete-btn">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
                <div class="task-content">${task.description}</div>
            `;
            
            // Add event listeners for drag and drop
            taskEl.addEventListener('dragstart', handleDragStart);
            
            // Add event listeners for edit and delete buttons
            const editBtn = taskEl.querySelector('.edit-btn');
            const deleteBtn = taskEl.querySelector('.delete-btn');
            
            editBtn.addEventListener('click', () => openEditModal(task.id));
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            
            return taskEl;
        }

        // Render all tasks
        function renderTasks(filteredTasks = null) {
            // Clear all task lists
            taskLists.forEach(list => {
                list.innerHTML = '';
            });
            
            // Use filtered tasks if provided, otherwise use all tasks
            const tasksToRender = filteredTasks || tasks;
            
            // Add tasks to appropriate columns
            tasksToRender.forEach(task => {
                const taskEl = createTaskElement(task);
                const column = document.getElementById(task.status);
                if (column) column.appendChild(taskEl);
            });
            
            updateTaskCounts();
        }

        // Update task counts for each column
        function updateTaskCounts() {
            document.getElementById('todo-count').textContent = tasks.filter(task => task.status === 'todo').length;
            document.getElementById('inprogress-count').textContent = tasks.filter(task => task.status === 'inprogress').length;
            document.getElementById('done-count').textContent = tasks.filter(task => task.status === 'done').length;
        }

        // Add new task
        addTaskBtn.addEventListener('click', () => {
            const title = taskTitle.value.trim();
            const description = taskDescription.value.trim();
            const status = taskStatus.value;
            
            if (!title) {
                alert('Please enter a task title');
                return;
            }
            
            const newTask = {
                id: generateId(),
                title,
                description,
                status
            };
            
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            
            // Clear form
            taskTitle.value = '';
            taskDescription.value = '';
            taskStatus.value = 'todo';
        });

        // Delete task
        function deleteTask(id) {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks = tasks.filter(task => task.id !== id);
                saveTasks();
                renderTasks();
            }
        }

        // Open edit modal
        function openEditModal(id) {
            const task = tasks.find(task => task.id === id);
            if (task) {
                editTaskId.value = task.id;
                editTitle.value = task.title;
                editDescription.value = task.description;
                editStatus.value = task.status;
                editModal.style.display = 'flex';
            }
        }

        // Close modal
        closeModal.addEventListener('click', () => {
            editModal.style.display = 'none';
        });

        // Close modal if clicking outside of it
        window.addEventListener('click', (e) => {
            if (e.target === editModal) {
                editModal.style.display = 'none';
            }
        });

        // Save edited task
        saveEditBtn.addEventListener('click', () => {
            const id = editTaskId.value;
            const title = editTitle.value.trim();
            const description = editDescription.value.trim();
            const status = editStatus.value;
            
            if (!title) {
                alert('Please enter a task title');
                return;
            }
            
            const taskIndex = tasks.findIndex(task => task.id === id);
            if (taskIndex !== -1) {
                tasks[taskIndex] = {
                    ...tasks[taskIndex],
                    title,
                    description,
                    status
                };
                
                saveTasks();
                renderTasks();
                editModal.style.display = 'none';
            }
        });

        // Drag and Drop Functionality
        let draggedTask = null;

        function handleDragStart(e) {
            draggedTask = e.target;
            setTimeout(() => {
                e.target.classList.add('dragging');
            }, 0);
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', e.target.getAttribute('data-id'));
        }

        // Set up drag and drop event listeners on columns
        taskLists.forEach(list => {
            list.addEventListener('dragover', e => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                return false;
            });
            
            list.addEventListener('dragenter', e => {
                e.preventDefault();
            });
            
            list.addEventListener('drop', e => {
                e.preventDefault();
                const taskId = e.dataTransfer.getData('text/plain');
                const newStatus = e.currentTarget.getAttribute('data-status');
                
                // Update task status in tasks array
                const taskIndex = tasks.findIndex(task => task.id === taskId);
                if (taskIndex !== -1) {
                    tasks[taskIndex].status = newStatus;
                    saveTasks();
                    renderTasks();
                }
            });
        });

        // Cleanup dragging class when drag ends
        document.addEventListener('dragend', e => {
            if (e.target.classList.contains('task')) {
                e.target.classList.remove('dragging');
            }
        });

        
        function performSearch() {
            const searchTerm = searchInput.value.trim().toLowerCase();
            const statusFilter = filterStatus.value;
            
            let filteredTasks = tasks;
            
            // Filter by status
            if (statusFilter !== 'all') {
                filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
            }
            
            // Filter by search term
            if (searchTerm) {
                filteredTasks = filteredTasks.filter(task => 
                    task.title.toLowerCase().includes(searchTerm) || 
                    task.description.toLowerCase().includes(searchTerm)
                );
            }
            
            renderTasks(filteredTasks);
        }
        
        function clearSearch() {
            searchInput.value = '';
            filterStatus.value = 'all';
            renderTasks();
        }

        // Initialize the app
        initTheme();
        loadTasks();

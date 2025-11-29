const API_URL = 'http://localhost:5000/api';

// State
let token = localStorage.getItem('token');
let user = JSON.parse(localStorage.getItem('user'));
let tasks = [];
let isRegistering = false;

// DOM Elements
const app = document.getElementById('app');
const authContainer = document.getElementById('auth-container');
const dashboardContainer = document.getElementById('dashboard-container');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authBtn = document.getElementById('auth-btn');
const usernameGroup = document.getElementById('username-group');
const switchLink = document.getElementById('switch-link');
const userDisplay = document.getElementById('user-display');
const logoutBtn = document.getElementById('logout-btn');
const taskList = document.getElementById('task-list');
const addTaskBtn = document.getElementById('add-task-btn');
const taskModal = document.getElementById('task-modal');
const closeModal = document.querySelector('.close');
const taskForm = document.getElementById('task-form');
const modalTitle = document.getElementById('modal-title');
const statusFilter = document.getElementById('status-filter');
const sortFilter = document.getElementById('sort-filter');

// Init
function init() {
    if (token) {
        showDashboard();
    } else {
        showAuth();
    }
}

// Auth Functions
function showAuth() {
    authContainer.style.display = 'flex';
    dashboardContainer.style.display = 'none';
}

function showDashboard() {
    authContainer.style.display = 'none';
    dashboardContainer.style.display = 'block';
    userDisplay.textContent = `Welcome, ${user.username}`;
    fetchTasks();
}

switchLink.addEventListener('click', (e) => {
    e.preventDefault();
    isRegistering = !isRegistering;
    if (isRegistering) {
        authTitle.textContent = 'Register';
        authBtn.textContent = 'Register';
        usernameGroup.style.display = 'block';
        switchLink.textContent = 'Login';
        document.getElementById('auth-switch').childNodes[0].textContent = 'Already have an account? ';
    } else {
        authTitle.textContent = 'Login';
        authBtn.textContent = 'Login';
        usernameGroup.style.display = 'none';
        switchLink.textContent = 'Register';
        document.getElementById('auth-switch').childNodes[0].textContent = "Don't have an account? ";
    }
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    const endpoint = isRegistering ? '/auth/register' : '/auth/login';
    const body = isRegistering ? { username, email, password } : { email, password };

    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        if (isRegistering) {
            alert('Registration successful! Please login.');
            isRegistering = false;
            switchLink.click();
        } else {
            token = data.token;
            user = data.user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            showDashboard();
        }
    } catch (error) {
        alert(error.message);
    }
});

logoutBtn.addEventListener('click', () => {
    token = null;
    user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showAuth();
});

// Task Functions
async function fetchTasks() {
    const status = statusFilter.value;
    const sort = sortFilter.value;
    let url = `${API_URL}/tasks?`;
    if (status) url += `status=${status}&`;
    if (sort) url += `sort=${sort}`;

    try {
        const res = await fetch(url, {
            headers: { 'Authorization': token }
        });
        tasks = await res.json();
        renderTasks();
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = `task-card ${task.status === 'completed' ? 'completed' : ''}`;
        card.innerHTML = `
            <div class="task-header">
                <div class="task-title">${task.title}</div>
                <div class="task-actions">
                    <button class="btn-icon" onclick="editTask(${task.id})">✎</button>
                    <button class="btn-icon btn-delete" onclick="deleteTask(${task.id})">🗑</button>
                </div>
            </div>
            <div class="task-desc">${task.description || ''}</div>
            <div class="task-meta">
                <span>Due: ${task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}</span>
                <span>${task.status}</span>
            </div>
        `;
        taskList.appendChild(card);
    });
}

// Modal Functions
addTaskBtn.addEventListener('click', () => {
    document.getElementById('task-id').value = '';
    document.getElementById('task-title').value = '';
    document.getElementById('task-desc').value = '';
    document.getElementById('task-date').value = '';
    document.getElementById('task-status-group').style.display = 'none';
    modalTitle.textContent = 'Add Task';
    taskModal.style.display = 'flex';
});

window.editTask = (id) => {
    const task = tasks.find(t => t.id === id);
    document.getElementById('task-id').value = task.id;
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-desc').value = task.description;
    document.getElementById('task-date').value = task.due_date ? task.due_date.split('T')[0] : '';
    document.getElementById('task-status').value = task.status;
    document.getElementById('task-status-group').style.display = 'block';
    modalTitle.textContent = 'Edit Task';
    taskModal.style.display = 'flex';
};

closeModal.addEventListener('click', () => {
    taskModal.style.display = 'none';
});

window.onclick = (event) => {
    if (event.target == taskModal) {
        taskModal.style.display = 'none';
    }
};

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('task-id').value;
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-desc').value;
    const due_date = document.getElementById('task-date').value;
    const status = document.getElementById('task-status').value;

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/tasks/${id}` : `${API_URL}/tasks`;
    const body = { title, description, due_date, status };

    try {
        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error('Failed to save task');

        taskModal.style.display = 'none';
        fetchTasks();
    } catch (error) {
        alert(error.message);
    }
});

window.deleteTask = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
        await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        });
        fetchTasks();
    } catch (error) {
        alert('Failed to delete task');
    }
};

// Filters
statusFilter.addEventListener('change', fetchTasks);
sortFilter.addEventListener('change', fetchTasks);

init();

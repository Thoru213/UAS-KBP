let timer;
let minutes = 10;
let seconds = 0;
let isRunning = false;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const toggleButton = document.getElementById('toggle-timer');
const resetButton = document.getElementById('reset-timer');
const customTimeInput = document.getElementById('custom-time');
const waktuHabisLeft = document.querySelector('.waktu-habis-left');
const waktuHabisRight = document.querySelector('.waktu-habis-right');

// Timer Functions
function updateTimer() {
    waktuHabisLeft.classList.add("hidden");
    waktuHabisRight.classList.add("hidden");
    if (seconds > 0) {
        seconds--;
    } else if (minutes > 0) {
        minutes--;
        seconds = 59;
    } else {
        clearInterval(timer);
        waktuHabisLeft.classList.remove("hidden");
        waktuHabisRight.classList.remove("hidden");
        const alarm = new Audio('src/alarm.wav');
        alarm.play();
        isRunning = false;
        return;
    }
    minutesDisplay.textContent = minutes < 10 ? '0' + minutes : minutes;
    secondsDisplay.textContent = seconds < 10 ? '0' + seconds : seconds;
}

toggleButton.addEventListener('click', () => {
    if (!isRunning) {
        const customTime = customTimeInput.value;
        if (customTime) {
            minutes = parseInt(customTime);
            seconds = 0;
        }
        timer = setInterval(updateTimer, 1000);
        isRunning = true;
        toggleButton.innerHTML = '<i class="bi bi-pause-circle"></i>';
    } else {
        clearInterval(timer);
        isRunning = false;
        toggleButton.innerHTML = '<i class="bi bi-play-circle"></i>';
    }
});

resetButton.addEventListener('click', () => {
    clearInterval(timer);
    minutes = 10;
    seconds = 0;
    minutesDisplay.textContent = '10';
    secondsDisplay.textContent = '00';
    isRunning = false;
    toggleButton.innerHTML = '<i class="bi bi-play-circle"></i>';
});

// To-Do List Functions
const todoInput = document.getElementById('todo-input');
const addTodoButton = document.getElementById('add-todo');
const todoList = document.getElementById('todo-list');

function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText) {
        const li = document.createElement('li');
        li.classList.add('todo-item');

        const checklistButton = document.createElement('button');
        checklistButton.classList.add('todo-checklist');
        checklistButton.innerHTML = '<i class="bi bi-check-circle"></i>';
        checklistButton.addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTodos(); // Simpan perubahan ke LocalStorage
        });

        const span = document.createElement('span');
        span.textContent = todoText;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('todo-delete');
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
        deleteButton.addEventListener('click', () => {
            todoList.removeChild(li);
            saveTodos(); // Simpan perubahan ke LocalStorage
        });

        li.appendChild(checklistButton);
        li.appendChild(span);
        li.appendChild(deleteButton);
        todoList.appendChild(li);

        todoInput.value = '';
        saveTodos(); // Simpan perubahan ke LocalStorage
    }
}


function saveTodos() {
    const todos = Array.from(todoList.children).map(todo => ({
        text: todo.querySelector('span').textContent,
        completed: todo.classList.contains('completed'),
    }));
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        const todos = JSON.parse(storedTodos);
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.classList.add('todo-item');
            if (todo.completed) {
                li.classList.add('completed'); // Tandai jika tugas selesai
            }

            // Tombol checklist
            const checklistButton = document.createElement('button');
            checklistButton.classList.add('todo-checklist');
            checklistButton.innerHTML = '<i class="bi bi-check-circle"></i>';
            checklistButton.addEventListener('click', () => {
                li.classList.toggle('completed');
                saveTodos();
            });

            // Teks tugas
            const span = document.createElement('span');
            span.textContent = todo.text;

            // Tombol hapus
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('todo-delete');
            deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
            deleteButton.addEventListener('click', () => {
                todoList.removeChild(li);
                saveTodos();
            });

            // Tambahkan elemen ke <li>
            li.appendChild(checklistButton);
            li.appendChild(span);
            li.appendChild(deleteButton);
            todoList.appendChild(li);
        });
    }
}

addTodoButton.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

document.addEventListener('DOMContentLoaded', loadTodos);

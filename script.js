// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}

// Notes
function saveNotes() {
    const notes = document.getElementById('notes').value;
    localStorage.setItem('notes', notes);
    alert('Notes saved!');
}

// Load saved notes
document.addEventListener('DOMContentLoaded', () => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        document.getElementById('notes').value = savedNotes;
    }
});

// Timer
let timerInterval;
let timerSeconds = 0;

function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            timerSeconds++;
            updateTimerDisplay();
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    pauseTimer();
    timerSeconds = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const hours = Math.floor(timerSeconds / 3600);
    const minutes = Math.floor((timerSeconds % 3600) / 60);
    const seconds = timerSeconds % 60;
    document.getElementById('timerDisplay').textContent =
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Calculator
let calcExpression = '';

function appendCalc(value) {
    calcExpression += value;
    document.getElementById('calcDisplay').value = calcExpression;
}

function clearCalc() {
    calcExpression = '';
    document.getElementById('calcDisplay').value = '';
}

function calculateResult() {
    try {
        calcExpression = eval(calcExpression).toString();
        document.getElementById('calcDisplay').value = calcExpression;
    } catch (e) {
        document.getElementById('calcDisplay').value = 'Error';
        calcExpression = '';
    }
}

// Calendar
function generateCalendar() {
    const calendar = document.getElementById('calendar');
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];

    let html = `<h4>${monthNames[month]} ${year}</h4>`;
    html += '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; text-align: center;">';

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        html += `<div style="font-weight: bold;">${day}</div>`;
    });

    for (let i = 0; i < firstDay; i++) {
        html += '<div></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === now.getDate();
        html += `<div style="padding: 10px; background: ${isToday ? 'var(--primary)' : 'var(--card-bg)'};
                 color: ${isToday ? 'white' : 'var(--text)'}; border-radius: 5px;">${day}</div>`;
    }

    html += '</div>';
    calendar.innerHTML = html;
}

generateCalendar();

// Color Picker
document.getElementById('colorPicker').addEventListener('input', (e) => {
    document.getElementById('colorValue').textContent = e.target.value;
});

// Unit Converter
function convert() {
    const value = parseFloat(document.getElementById('convertInput').value);
    const from = document.getElementById('convertFrom').value;
    const to = document.getElementById('convertTo').value;

    const conversions = {
        km: 1000,
        m: 1,
        mi: 1609.34,
        ft: 0.3048
    };

    const meters = value * conversions[from];
    const result = meters / conversions[to];

    document.getElementById('convertResult').textContent = `${result.toFixed(2)} ${to}`;
}

// Snake Game
let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let dx = 0, dy = 0;
let snakeScore = 0;
let snakeGame;

function startSnake() {
    snake = [{x: 10, y: 10}];
    food = {x: 15, y: 15};
    dx = 1;
    dy = 0;
    snakeScore = 0;
    document.getElementById('snakeScore').textContent = snakeScore;

    if (snakeGame) clearInterval(snakeGame);
    snakeGame = setInterval(updateSnake, 100);
}

function updateSnake() {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');

    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        clearInterval(snakeGame);
        alert('Game Over! Score: ' + snakeScore);
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        snakeScore++;
        document.getElementById('snakeScore').textContent = snakeScore;
        food = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)};
    } else {
        snake.pop();
    }

    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(0, 0, 400, 400);

    ctx.fillStyle = '#2ecc71';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * 20, segment.y * 20, 18, 18);
    });

    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x * 20, food.y * 20, 18, 18);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; }
    if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
    if (e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; }
    if (e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }
});

// Memory Game
let memoryCards = [];
let flippedCards = [];

function startMemory() {
    const symbols = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎻'];
    memoryCards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);

    const grid = document.getElementById('memoryGame');
    grid.innerHTML = '';

    memoryCards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.textContent = '?';
        card.addEventListener('click', flipMemoryCard);
        grid.appendChild(card);
    });
}

function flipMemoryCard(e) {
    const card = e.target;
    const index = card.dataset.index;

    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.textContent = memoryCards[index];
        card.classList.add('flipped');
        flippedCards.push({card, index});

        if (flippedCards.length === 2) {
            setTimeout(() => {
                if (memoryCards[flippedCards[0].index] === memoryCards[flippedCards[1].index]) {
                    flippedCards = [];
                } else {
                    flippedCards.forEach(({card}) => {
                        card.textContent = '?';
                        card.classList.remove('flipped');
                    });
                    flippedCards = [];
                }
            }, 1000);
        }
    }
}

startMemory();

// Tic Tac Toe
let ticTacToeBoard = Array(9).fill('');
let currentPlayer = 'X';

function initTicTacToe() {
    const grid = document.getElementById('ticTacToe');
    grid.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'tictactoe-cell';
        cell.dataset.index = i;
        cell.addEventListener('click', playTicTacToe);
        grid.appendChild(cell);
    }
}

function playTicTacToe(e) {
    const index = e.target.dataset.index;

    if (ticTacToeBoard[index] === '') {
        ticTacToeBoard[index] = currentPlayer;
        e.target.textContent = currentPlayer;

        if (checkWinner()) {
            setTimeout(() => {
                alert(`${currentPlayer} wins!`);
                resetTicTacToe();
            }, 100);
        } else if (ticTacToeBoard.every(cell => cell !== '')) {
            setTimeout(() => {
                alert('Draw!');
                resetTicTacToe();
            }, 100);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

function checkWinner() {
    const wins = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    return wins.some(combo => {
        return combo.every(index => ticTacToeBoard[index] === currentPlayer);
    });
}

function resetTicTacToe() {
    ticTacToeBoard = Array(9).fill('');
    currentPlayer = 'X';
    initTicTacToe();
}

initTicTacToe();

// Chat
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (message) {
        const messagesDiv = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message own';
        messageDiv.textContent = message;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        input.value = '';

        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-message';
            botMessage.textContent = 'Echo: ' + message;
            messagesDiv.appendChild(botMessage);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }, 1000);
    }
}

document.getElementById('chatInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Media
function loadAudio() {
    const file = document.getElementById('audioFile').files[0];
    const audio = document.getElementById('audioPlayer');
    audio.src = URL.createObjectURL(file);
}

function loadVideo() {
    const file = document.getElementById('videoFile').files[0];
    const video = document.getElementById('videoPlayer');
    video.src = URL.createObjectURL(file);
}

function loadImage() {
    const file = document.getElementById('imageFile').files[0];
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
    };

    img.src = URL.createObjectURL(file);
}

function applyFilter(filter) {
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        if (filter === 'grayscale') {
            const avg = (data[i] + data[i+1] + data[i+2]) / 3;
            data[i] = data[i+1] = data[i+2] = avg;
        } else if (filter === 'sepia') {
            const r = data[i], g = data[i+1], b = data[i+2];
            data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
            data[i+1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
            data[i+2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
        } else if (filter === 'invert') {
            data[i] = 255 - data[i];
            data[i+1] = 255 - data[i+1];
            data[i+2] = 255 - data[i+2];
        } else if (filter === 'blur') {
            // Simple blur effect
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

// Code Editor
function runCode() {
    const code = document.getElementById('codeEditor').value;
    const language = document.getElementById('codeLanguage').value;
    const output = document.getElementById('codeOutput');

    if (language === 'javascript') {
        try {
            const result = eval(code);
            output.textContent = result !== undefined ? result : 'Code executed successfully';
        } catch (e) {
            output.textContent = 'Error: ' + e.message;
        }
    } else {
        output.textContent = `${language} execution not available in browser. Code:\n${code}`;
    }
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Clear Notes
function clearNotes() {
    document.getElementById('notes').value = '';
    localStorage.removeItem('notes');
}

// Timer Laps
let laps = [];
function addLap() {
    if (timerSeconds > 0) {
        const hours = Math.floor(timerSeconds / 3600);
        const minutes = Math.floor((timerSeconds % 3600) / 60);
        const seconds = timerSeconds % 60;
        const lapTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        laps.push(lapTime);
        const lapsDiv = document.getElementById('timerLaps');
        const lapDiv = document.createElement('div');
        lapDiv.className = 'lap-time';
        lapDiv.textContent = `Lap ${laps.length}: ${lapTime}`;
        lapsDiv.appendChild(lapDiv);
    }
}

// Enhanced Color Picker
document.getElementById('colorPicker').addEventListener('input', (e) => {
    const color = e.target.value;
    document.getElementById('colorValue').textContent = color;

    const r = parseInt(color.substr(1,2), 16);
    const g = parseInt(color.substr(3,2), 16);
    const b = parseInt(color.substr(5,2), 16);

    document.getElementById('colorInfo').innerHTML = `
        RGB: ${r}, ${g}, ${b}<br>
        HSL: ${rgbToHsl(r, g, b)}
    `;
});

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return `${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
}

function copyColor() {
    const color = document.getElementById('colorValue').textContent;
    navigator.clipboard.writeText(color);
    alert('Color copied to clipboard!');
}

// Todo List
let todos = JSON.parse(localStorage.getItem('todos')) || [];

function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();

    if (text) {
        todos.push({ text, completed: false, id: Date.now() });
        input.value = '';
        saveTodos();
        renderTodos();
    }
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    const list = document.getElementById('todoList');
    list.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${todo.id})">
            <span>${todo.text}</span>
            <button onclick="deleteTodo(${todo.id})">Delete</button>
        `;
        list.appendChild(li);
    });
}

document.getElementById('todoInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

renderTodos();

// Random Generator
function generateRandom(type) {
    const result = document.getElementById('randomResult');

    switch(type) {
        case 'number':
            result.textContent = `Random Number: ${Math.floor(Math.random() * 1000)}`;
            break;
        case 'password':
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
            let password = '';
            for (let i = 0; i < 16; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            result.textContent = `Password: ${password}`;
            break;
        case 'color':
            const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
            result.innerHTML = `Color: <span style="background: ${randomColor}; padding: 5px 20px; border-radius: 5px;">${randomColor}</span>`;
            break;
        case 'dice':
            result.textContent = `🎲 Dice Roll: ${Math.floor(Math.random() * 6) + 1}`;
            break;
    }
}

// World Clock
function updateWorldClock() {
    const zones = [
        { name: 'New York', offset: -5 },
        { name: 'London', offset: 0 },
        { name: 'Tokyo', offset: 9 },
        { name: 'Sydney', offset: 10 }
    ];

    const clockDiv = document.getElementById('worldClock');
    clockDiv.innerHTML = '';

    zones.forEach(zone => {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const zoneTime = new Date(utc + (3600000 * zone.offset));

        const div = document.createElement('div');
        div.className = 'clock-item';
        div.innerHTML = `<strong>${zone.name}</strong><span>${zoneTime.toLocaleTimeString()}</span>`;
        clockDiv.appendChild(div);
    });
}

updateWorldClock();
setInterval(updateWorldClock, 1000);

// Text Counter
document.getElementById('textCounter').addEventListener('input', (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const chars = text.length;
    const lines = text.split('\n').length;

    document.getElementById('textStats').innerHTML = `
        <div class="stat-item"><span>Characters:</span><strong>${chars}</strong></div>
        <div class="stat-item"><span>Words:</span><strong>${words}</strong></div>
        <div class="stat-item"><span>Lines:</span><strong>${lines}</strong></div>
    `;
});

// URL Shortener (mock)
function shortenUrl() {
    const url = document.getElementById('urlInput').value;
    if (url) {
        const short = 'https://short.url/' + Math.random().toString(36).substr(2, 6);
        document.getElementById('shortUrl').innerHTML = `Short URL: <a href="${url}" target="_blank">${short}</a>`;
    }
}

// Currency Converter (mock rates)
function convertCurrency() {
    const amount = parseFloat(document.getElementById('currencyAmount').value);
    const from = document.getElementById('currencyFrom').value;
    const to = document.getElementById('currencyTo').value;

    const rates = {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110
    };

    const result = (amount / rates[from]) * rates[to];
    document.getElementById('currencyResult').textContent = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
}

// Snake High Score
let snakeHighScore = localStorage.getItem('snakeHighScore') || 0;
document.getElementById('snakeHighScore').textContent = snakeHighScore;

const originalUpdateSnake = updateSnake;
function updateSnake() {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        clearInterval(snakeGame);
        if (snakeScore > snakeHighScore) {
            snakeHighScore = snakeScore;
            localStorage.setItem('snakeHighScore', snakeHighScore);
            document.getElementById('snakeHighScore').textContent = snakeHighScore;
        }
        alert('Game Over! Score: ' + snakeScore);
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        snakeScore++;
        document.getElementById('snakeScore').textContent = snakeScore;
        food = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)};
    } else {
        snake.pop();
    }

    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(0, 0, 400, 400);

    ctx.fillStyle = '#2ecc71';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * 20, segment.y * 20, 18, 18);
    });

    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x * 20, food.y * 20, 18, 18);
}

// Memory Game Moves Counter
let memoryMoves = 0;
const originalFlipMemoryCard = flipMemoryCard;
function flipMemoryCard(e) {
    const card = e.target;
    const index = card.dataset.index;

    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.textContent = memoryCards[index];
        card.classList.add('flipped');
        flippedCards.push({card, index});

        if (flippedCards.length === 2) {
            memoryMoves++;
            document.getElementById('memoryMoves').textContent = memoryMoves;

            setTimeout(() => {
                if (memoryCards[flippedCards[0].index] === memoryCards[flippedCards[1].index]) {
                    flippedCards.forEach(({card}) => card.classList.add('matched'));
                    flippedCards = [];
                } else {
                    flippedCards.forEach(({card}) => {
                        card.textContent = '?';
                        card.classList.remove('flipped');
                    });
                    flippedCards = [];
                }
            }, 1000);
        }
    }
}

function startMemory() {
    memoryMoves = 0;
    document.getElementById('memoryMoves').textContent = memoryMoves;
    const symbols = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎻'];
    memoryCards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    flippedCards = [];

    const grid = document.getElementById('memoryGame');
    grid.innerHTML = '';

    memoryCards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.textContent = '?';
        card.addEventListener('click', flipMemoryCard);
        grid.appendChild(card);
    });
}

// Tic Tac Toe Status
function playTicTacToe(e) {
    const index = e.target.dataset.index;

    if (ticTacToeBoard[index] === '') {
        ticTacToeBoard[index] = currentPlayer;
        e.target.textContent = currentPlayer;

        if (checkWinner()) {
            document.getElementById('ticTacToeStatus').textContent = `${currentPlayer} wins! 🎉`;
            setTimeout(() => {
                resetTicTacToe();
            }, 2000);
        } else if (ticTacToeBoard.every(cell => cell !== '')) {
            document.getElementById('ticTacToeStatus').textContent = 'Draw! 🤝';
            setTimeout(() => {
                resetTicTacToe();
            }, 2000);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('ticTacToeStatus').textContent = `Player ${currentPlayer}'s turn`;
        }
    }
}

function resetTicTacToe() {
    ticTacToeBoard = Array(9).fill('');
    currentPlayer = 'X';
    document.getElementById('ticTacToeStatus').textContent = "Player X's turn";
    initTicTacToe();
}

// Slot Machine
let slotCredits = 100;

function spinSlots() {
    if (slotCredits < 10) {
        alert('Not enough credits!');
        return;
    }

    slotCredits -= 10;
    const symbols = ['🍒', '🍋', '🍊', '🍇', '🍉', '⭐', '💎'];

    const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

    document.getElementById('slot1').textContent = slot1;
    document.getElementById('slot2').textContent = slot2;
    document.getElementById('slot3').textContent = slot3;

    if (slot1 === slot2 && slot2 === slot3) {
        slotCredits += 100;
        alert('JACKPOT! +100 credits!');
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
        slotCredits += 20;
        alert('Match! +20 credits!');
    }

    document.getElementById('slotCredits').textContent = slotCredits;
}

// Card Flip Game
function startCardFlip() {
    const grid = document.getElementById('cardFlip');
    grid.innerHTML = '';
    const cards = ['🎴', '🃏', '🎰', '🎲', '🎯', '🎪', '🎨', '🎭', '🎸'];

    cards.forEach(card => {
        const div = document.createElement('div');
        div.className = 'flip-card';
        div.textContent = card;
        div.addEventListener('click', () => {
            div.style.transform = div.style.transform === 'rotateY(180deg)' ? '' : 'rotateY(180deg)';
        });
        grid.appendChild(div);
    });
}

startCardFlip();

// Reaction Test
let reactionStart;
let reactionTimeout;

function startReaction() {
    const box = document.getElementById('reactionBox');
    box.style.background = 'var(--accent)';
    box.textContent = 'Wait...';
    box.classList.remove('ready');

    reactionTimeout = setTimeout(() => {
        box.style.background = 'var(--secondary)';
        box.textContent = 'CLICK NOW!';
        box.classList.add('ready');
        reactionStart = Date.now();
    }, Math.random() * 3000 + 2000);

    box.onclick = () => {
        if (box.classList.contains('ready')) {
            const time = Date.now() - reactionStart;
            document.getElementById('reactionResult').textContent = `Your reaction time: ${time}ms`;
            box.style.background = 'var(--accent)';
            box.textContent = 'Click when green!';
            box.classList.remove('ready');
        } else {
            clearTimeout(reactionTimeout);
            document.getElementById('reactionResult').textContent = 'Too early! Try again.';
            box.style.background = 'var(--accent)';
            box.textContent = 'Click when green!';
        }
    };
}

// Download Image
function downloadImage() {
    const canvas = document.getElementById('imageCanvas');
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL();
    link.click();
}

// Webcam
let webcamStream;

function startWebcam() {
    const video = document.getElementById('webcam');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            webcamStream = stream;
            video.srcObject = stream;
        })
        .catch(err => alert('Webcam access denied'));
}

function capturePhoto() {
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('webcamCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const img = document.createElement('img');
    img.src = canvas.toDataURL();
    img.className = 'captured-photo';
    document.getElementById('capturedPhotos').appendChild(img);
}

// Code Editor
function clearCode() {
    document.getElementById('codeEditor').value = '';
    document.getElementById('codeOutput').textContent = '';
}

function saveCode() {
    const code = document.getElementById('codeEditor').value;
    const language = document.getElementById('codeLanguage').value;
    localStorage.setItem(`code_${language}`, code);
    alert('Code saved!');
}

// Load saved code
document.getElementById('codeLanguage').addEventListener('change', (e) => {
    const language = e.target.value;
    const savedCode = localStorage.getItem(`code_${language}`);
    if (savedCode) {
        document.getElementById('codeEditor').value = savedCode;
    }
});

// Weather (mock)
function getWeather() {
    const city = document.getElementById('cityInput').value;
    if (!city) return;

    const mockWeather = {
        temp: Math.floor(Math.random() * 30) + 10,
        condition: ['☀️ Sunny', '⛅ Partly Cloudy', '☁️ Cloudy', '🌧️ Rainy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 50) + 30,
        wind: Math.floor(Math.random() * 20) + 5
    };

    document.getElementById('weatherDisplay').innerHTML = `
        <div class="weather-info">
            <h3>${city}</h3>
            <div class="weather-icon">${mockWeather.condition.split(' ')[0]}</div>
            <div class="weather-temp">${mockWeather.temp}°C</div>
            <p>${mockWeather.condition}</p>
            <p>Humidity: ${mockWeather.humidity}%</p>
            <p>Wind: ${mockWeather.wind} km/h</p>
        </div>
    `;
}

// Finance Calculators
function calculateLoan() {
    const amount = parseFloat(document.getElementById('loanAmount').value);
    const rate = parseFloat(document.getElementById('loanRate').value) / 100 / 12;
    const years = parseFloat(document.getElementById('loanYears').value);
    const months = years * 12;

    const payment = (amount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    const total = payment * months;
    const interest = total - amount;

    document.getElementById('loanResult').innerHTML = `
        <strong>Monthly Payment:</strong> $${payment.toFixed(2)}<br>
        <strong>Total Payment:</strong> $${total.toFixed(2)}<br>
        <strong>Total Interest:</strong> $${interest.toFixed(2)}
    `;
}

function calculateInvestment() {
    const amount = parseFloat(document.getElementById('investAmount').value);
    const rate = parseFloat(document.getElementById('investRate').value) / 100;
    const years = parseFloat(document.getElementById('investYears').value);

    const future = amount * Math.pow(1 + rate, years);
    const profit = future - amount;

    document.getElementById('investResult').innerHTML = `
        <strong>Future Value:</strong> $${future.toFixed(2)}<br>
        <strong>Total Profit:</strong> $${profit.toFixed(2)}<br>
        <strong>ROI:</strong> ${((profit / amount) * 100).toFixed(2)}%
    `;
}

function calculateTip() {
    const bill = parseFloat(document.getElementById('billAmount').value);
    const tip = parseFloat(document.getElementById('tipPercent').value) / 100;
    const people = parseInt(document.getElementById('numPeople').value) || 1;

    const tipAmount = bill * tip;
    const total = bill + tipAmount;
    const perPerson = total / people;

    document.getElementById('tipResult').innerHTML = `
        <strong>Tip Amount:</strong> $${tipAmount.toFixed(2)}<br>
        <strong>Total:</strong> $${total.toFixed(2)}<br>
        <strong>Per Person:</strong> $${perPerson.toFixed(2)}
    `;
}

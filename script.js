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

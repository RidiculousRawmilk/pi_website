const words = {
    food: ["Pizza", "Sushi", "Schokolade", "Burger", "Kaffee", "Eiscreme", "Pfeankuchen", "Tacos"],
    places: ["Strand", "Schule", "Kino", "Supermarkt", "Flughafen", "Museum", "Krankenhaus", "Fitnessstudio"],
    objects: ["Smartphone", "Zahnbürste", "Regenschirm", "Gitarre", "Sonnenbrille", "Fahrrad", "Kissen", "Uhr"]
};

let playerCountInput = document.getElementById('player-count');
let playerCountVal = document.getElementById('player-count-val');
let startBtn = document.getElementById('start-btn');

let setupScreen = document.getElementById('setup-screen');
let passScreen = document.getElementById('pass-screen');
let roleScreen = document.getElementById('role-screen');
let gameScreen = document.getElementById('game-screen');

let currentPlayerName = document.getElementById('current-player-name');
let revealBtn = document.getElementById('reveal-btn');
let roleDisplay = document.getElementById('role-display');
let nextBtn = document.getElementById('next-btn');

let timerDisplay = document.getElementById('timer');
let timerStartBtn = document.getElementById('timer-start');
let timerPauseBtn = document.getElementById('timer-pause');
let timerResetBtn = document.getElementById('timer-reset');
let endGameBtn = document.getElementById('end-game-btn');

let gameState = {
    players: 4,
    imposters: 1,
    category: 'all',
    secretWord: '',
    imposterIndices: [],
    currentPlayer: 0,
    rolesAssigned: []
};

playerCountInput.addEventListener('input', (e) => {
    playerCountVal.textContent = e.target.value;
});

startBtn.addEventListener('click', () => {
    gameState.players = parseInt(playerCountInput.value);
    gameState.imposters = parseInt(document.getElementById('imposter-count').value);
    gameState.category = document.getElementById('category').value;

    if (gameState.imposters >= gameState.players) {
        alert('Es muss weniger Imposter als Spieler geben!');
        return;
    }

    // Wort auswählen
    let cat = gameState.category;
    let wordList = [];
    if (cat === 'all') {
        wordList = [...words.food, ...words.places, ...words.objects];
    } else {
        wordList = words[cat];
    }
    gameState.secretWord = wordList[Math.floor(Math.random() * wordList.length)];

    // Imposter bestimmen
    gameState.imposterIndices = [];
    while(gameState.imposterIndices.length < gameState.imposters) {
        let r = Math.floor(Math.random() * gameState.players);
        if(gameState.imposterIndices.indexOf(r) === -1) gameState.imposterIndices.push(r);
    }

    gameState.currentPlayer = 0;
    setupScreen.classList.add('hidden');
    passScreen.classList.remove('hidden');
    updatePassScreen();
});

function updatePassScreen() {
    currentPlayerName.textContent = `Spieler ${gameState.currentPlayer + 1}`;
}

revealBtn.addEventListener('click', () => {
    passScreen.classList.add('hidden');
    roleScreen.classList.remove('hidden');

    if (gameState.imposterIndices.includes(gameState.currentPlayer)) {
        roleDisplay.innerHTML = `<span style="color: #e94560;">Du bist der IMPOSTER!</span><br><small>Du kennst das Geheimwort nicht.</small>`;
    } else {
        roleDisplay.innerHTML = `Das Geheimwort ist:<br><strong>${gameState.secretWord}</strong>`;
    }
});

nextBtn.addEventListener('click', () => {
    roleScreen.classList.add('hidden');
    gameState.currentPlayer++;

    if (gameState.currentPlayer < gameState.players) {
        passScreen.classList.remove('hidden');
        updatePassScreen();
    } else {
        gameScreen.classList.remove('hidden');
    }
});

// Timer Logik
let timerInterval;
let timeLeft = 180;

function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

timerStartBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        }
    }, 1000);
});

timerPauseBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
});

timerResetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timeLeft = 180;
    updateTimerDisplay();
});

endGameBtn.addEventListener('click', () => {
    let imposterList = gameState.imposterIndices.map(i => `Spieler ${i + 1}`).join(', ');
    alert(`Das Spiel ist vorbei!\nDer/Die Imposter war(en): ${imposterList}\nDas geheime Wort war: ${gameState.secretWord}`);
    location.reload();
});

updateTimerDisplay();
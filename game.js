const vegetables = [
    { name: 'Corn', hint: 'I want a vegetable that is long, yellow, and has many kernels.', image: 'corn.png' },
    { name: 'Pea', hint: 'I want a vegetable that is small, round, and green, found in pods.', image: 'Pea.png' },
    { name: 'Kale', hint: 'I want a vegetable that has dark green, curly leaves.', image: 'kale.png' },
    { name: 'Yam', hint: 'I want a vegetable that is brown on the outside and orange on the inside.', image: 'yam.png' },
    { name: 'Carrot', hint: 'I want a vegetable that is long, orange, and crunchy.', image: 'carrot.png' },
    { name: 'Tomato', hint: 'I want a vegetable that is round, red, and juicy.', image: 'tomato.png' },
    { name: 'Mushroom', hint: 'I want a vegetable that has a soft white cap and grows like a fungus.', image: 'mushroom.png' },
    { name: 'Cucumber', hint: 'I want a vegetable that is long, green, and full of water.', image: 'cucumber.png' },
    { name: 'Cauliflower', hint: 'I want a vegetable that has a white, bumpy head and green leaves around it.', image: 'Cauliflower.png' },
    { name: 'Asparagus', hint: 'I want a vegetable that is long, thin, and green, usually eaten grilled.', image: 'asparagus.png' },
    { name: 'Artichoke', hint: 'I want a vegetable that has thick green petals and a soft heart inside.', image: 'Artichoke.png' },
    { name: 'Broccoli', hint: 'I want a vegetable that has a green tree-like head.', image: 'Broccoli.png' }
];

let currentVeg = null;
let timeLeft = 60;
let score = 0;
let gameOver = false;
let timerInterval = null;
let isAnswering = false;
let droppedVegImage = null;

function startNewRound() {
    currentVeg = vegetables[Math.floor(Math.random() * vegetables.length)];

    const redImages = ['y.png', 'r.png', 'h.png', 'j.png'];
    document.getElementById('vegImage').src = redImages[Math.floor(Math.random() * redImages.length)];

    document.getElementById('hintText').textContent = currentVeg.hint;

    const dropZone = document.getElementById('dropZone');
    dropZone.innerHTML = '<span style="color: white; font-size: 12px;">Drag and drop</span>';
    dropZone.classList.remove('has-image');

    const optionsGrid = document.getElementById('optionsGrid');
    optionsGrid.innerHTML = '';

    for (let i = 0; i < 12; i++) {
        const randomVeg = vegetables[Math.floor(Math.random() * vegetables.length)];
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.draggable = true;
        btn.dataset.vegImage = randomVeg.image;
        btn.dataset.vegName = randomVeg.name;
        btn.innerHTML = `
            <img src="${randomVeg.image}" alt="${randomVeg.name}">
            <span>${randomVeg.name}</span>
        `;

        btn.addEventListener('dragstart', handleDragStart);
        btn.addEventListener('dragend', handleDragEnd);

        optionsGrid.appendChild(btn);
    }

    document.getElementById('answerInput').value = '';
    document.getElementById('answerInput').disabled = false;
    document.getElementById('submitBtn').disabled = false;
    document.getElementById('feedback').textContent = '';
    isAnswering = false;
    droppedVegImage = null;
}

let draggedElement = null;

function handleDragStart(e) {
    if (gameOver || isAnswering) return;
    draggedElement = e.target;
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

const dropZone = document.getElementById('dropZone');
const answerBox = document.getElementById('answerBox');

dropZone.addEventListener('dragover', (e) => {
    if (gameOver || isAnswering) return;
    e.preventDefault();
    answerBox.classList.add('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    if (gameOver || isAnswering) return;
    e.preventDefault();
    answerBox.classList.remove('drag-over');

    if (draggedElement) {
        droppedVegImage = draggedElement.dataset.vegImage;
        dropZone.innerHTML = `<img src="${droppedVegImage}" alt="">`;
        dropZone.classList.add('has-image');
        document.getElementById('answerInput').focus();
    }
});

function checkAnswer() {
    if (gameOver || isAnswering) return;

    const userAnswer = document.getElementById('answerInput').value.trim();

    if (!droppedVegImage) {
        document.getElementById('feedback').textContent = '⚠️ Please drag the vegetable picture first.';
        document.getElementById('feedback').className = 'feedback wrong';
        return;
    }

    if (!userAnswer) {
        document.getElementById('feedback').textContent = '⚠️ Please type the name of the vegetable.';
        document.getElementById('feedback').className = 'feedback wrong';
        return;
    }

    isAnswering = true;
    document.getElementById('answerInput').disabled = true;
    document.getElementById('submitBtn').disabled = true;

    const isCorrectImage = droppedVegImage === currentVeg.image;
    const isCorrectName =
    userAnswer === currentVeg.name && /^[A-Z]/.test(userAnswer);

    if (isCorrectImage && isCorrectName) {
        timeLeft += 5;
        score++;
        document.getElementById('score').textContent = score;
        document.getElementById('timeLeft').textContent = timeLeft;

        document.getElementById('feedback').textContent = '✅ correct +5 second';
        document.getElementById('feedback').className = 'feedback correct';

        setTimeout(startNewRound, 1500);
    } else {
        timeLeft = Math.max(0, timeLeft - 3);
        document.getElementById('timeLeft').textContent = timeLeft;

        let msg = '❌ ';
        msg += (!isCorrectImage ? 'Wrong picture ' : '');
        msg += (!isCorrectName ? 'Wrong name ' : '');
        msg += `-3 second (answer: ${currentVeg.name})`;

        document.getElementById('feedback').textContent = msg;
        document.getElementById('feedback').className = 'feedback wrong';

        if (timeLeft === 0) {
            endGame();
        } else {
            setTimeout(startNewRound, 2500);
        }
    }
}

function updateTimer() {
    if (timeLeft > 0 && !gameOver) {
        timeLeft--;
        document.getElementById('timeLeft').textContent = timeLeft;
        if (timeLeft === 0) endGame();
    }
}

function endGame() {
    gameOver = true;
    clearInterval(timerInterval);
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverModal').classList.add('show');
    document.getElementById('answerInput').disabled = true;
    document.getElementById('submitBtn').disabled = true;
}

function resetGame() {
    timeLeft = 60;
    score = 0;
    gameOver = false;
    document.getElementById('timeLeft').textContent = timeLeft;
    document.getElementById('score').textContent = score;
    document.getElementById('gameOverModal').classList.remove('show');
    startNewRound();
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

startNewRound();
startTimer();
// ข้อมูลผัก
const labels = [
  'corn', 'pea', 'kale', 'yam', 'carrot', 'tomato', 
  'mushroom', 'cucumber', 'Cauliflower', 'asparagus', 
  'Artichoke', 'Broccoli'
];

const images = [
  'corn.png', 'Pea.png', 'kale.png', 'yam.png', 
  'carrot.png', 'tomato.png', 'mushroom.png', 'cucumber.png', 
  'Cauliflower.png', 'asparagus.png', 'Artichoke.png', 'Broccoli.png'
];

// ตัวแปรหลัก
const paletteEl = document.getElementById('palette');
const boardEl = document.getElementById('board');
const timerEl = document.getElementById('timer');

let timeLeft = 20;
let timerInterval = null;
let correctCount = 0;
let draggedItem = null;

// ฟังก์ชันสุ่มลำดับ
function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ฟังก์ชันปรับข้อความให้เป็นตัวเล็ก
function normalize(str) {
  return String(str).trim().toLowerCase();
}

// สร้างไอเทมในแพเล็ต
function populatePalette() {
  paletteEl.innerHTML = '';
  const order = shuffle(labels);
  
  order.forEach(label => {
    const div = document.createElement('div');
    div.className = 'item';
    div.draggable = true;
    div.textContent = label;
    
    // เริ่มลาก
    div.addEventListener('dragstart', (e) => {
      draggedItem = div;
      div.classList.add('dragging');
    });
    
    // จบการลาก
    div.addEventListener('dragend', () => {
      draggedItem = null;
      div.classList.remove('dragging');
    });
    
    paletteEl.appendChild(div);
  });
}

// สร้างการ์ดในบอร์ด
function populateBoard() {
  boardEl.innerHTML = '';
  const cards = images.map((img, i) => ({
    img: img,
    name: normalize(labels[i])
  }));
  
  shuffle(cards);
  
  cards.forEach(cardData => {
    const card = document.createElement('div');
    card.className = 'card';
    
    // รูปภาพ
    const img = document.createElement('img');
    img.src = cardData.img;
    card.appendChild(img);
    
    // โซนวาง
    const dropzone = document.createElement('div');
    dropzone.className = 'dropzone';
    dropzone.dataset.expect = cardData.name;
    
    // เหนือโซน
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('hover');
    });
    
    // ออกจากโซน
    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('hover');
    });
    
    // วางในโซน
    dropzone.addEventListener('drop', () => {
      handleDrop(dropzone);
    });
    
    card.appendChild(dropzone);
    boardEl.appendChild(card);
  });
}

// จัดการการวาง
function handleDrop(zone) {
  if (!draggedItem) return;
  
  zone.classList.remove('hover');
  
  // ถ้าถูกต้องแล้ว ไม่ต้องทำอะไร
  if (zone.classList.contains('correct')) return;
  
  const label = normalize(draggedItem.textContent);
  const expect = zone.dataset.expect;
  
  if (label === expect) {
    // ถูกต้อง
    const placed = document.createElement('div');
    placed.className = 'placed';
    placed.textContent = draggedItem.textContent;
    zone.appendChild(placed);
    zone.classList.add('correct');
    
    draggedItem.remove();
    addTime(5);
    correctCount++;
    
    // ตรวจสอบชนะ
    if (correctCount === labels.length) {
      setTimeout(() => {
        alert('🎉 win');
        resetGame();
      }, 200);
    }
  } else {
    // ผิด - แสดงขอบแดง
    zone.style.outline = '6px solid red';
    setTimeout(() => {
      zone.style.outline = '';
    }, 400);
  }
}

// เริ่มจับเวลา
function startTimer() {
  stopTimer();
  timerEl.textContent = timeLeft;
  
  timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft < 0) timeLeft = 0;
    timerEl.textContent = timeLeft;
    
    if (timeLeft === 0) {
      stopTimer();
      alert('⏰ out of time');
      resetGame();
    }
  }, 1000);
}

// หยุดจับเวลา
function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// เพิ่มเวลา
function addTime(seconds) {
  timeLeft += seconds;
  timerEl.textContent = timeLeft;
}

// รีเซ็ตเกม
function resetGame() {
  timeLeft = 20;
  correctCount = 0;
  populatePalette();
  populateBoard();
  startTimer();
}

// เริ่มเกม
populatePalette();
populateBoard();
startTimer();

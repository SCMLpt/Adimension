const cube = document.getElementById('cube');
const input = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const faces = document.querySelectorAll('.face');

// 모든 면에 텍스트를 업데이트하는 함수
function updateCubeText(text) {
  faces.forEach(face => {
    face.textContent = text;
  });
}

sendBtn.addEventListener('click', () => {
  const text = input.value.trim();
  if(text !== ''){
    updateCubeText(text);
    input.value = '';
  }
});

// 마우스 드래그로 정육면체 회전 구현
let startX, startY, currentX = 0, currentY = 0, isDragging = false;

document.querySelector('.scene').addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
});

document.addEventListener('mousemove', (e) => {
  if(isDragging) {
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    currentX += deltaY * 0.5;
    currentY += deltaX * 0.5;
    cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
    startX = e.clientX;
    startY = e.clientY;
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

// 터치 이벤트로 회전 구현 (모바일 지원)
document.querySelector('.scene').addEventListener('touchstart', (e) => {
  isDragging = true;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
  if(isDragging) {
    const deltaX = e.touches[0].clientX - startX;
    const deltaY = e.touches[0].clientY - startY;
    currentX += deltaY * 0.5;
    currentY += deltaX * 0.5;
    cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }
});

document.addEventListener('touchend', () => {
  isDragging = false;
});

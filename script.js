let points = 0;
let leaderboard = [];

// 데이터 로드
function loadData() {
    points = parseInt(localStorage.getItem('points')) || 0;
    leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    updatePointsDisplay();
    updateLeaderboardDisplay();
}

// 포인트 표시 업데이트
function updatePointsDisplay() {
    document.getElementById('points').textContent = points;
}

// 랭킹 표시 업데이트
function updateLeaderboardDisplay() {
    const leaderboardList = document.getElementById('leaderboard');
    leaderboardList.innerHTML = '';
    leaderboard.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. 유저 ${entry.userId}: ${entry.points}점`;
        leaderboardList.appendChild(li);
    });
}

// 링크 클릭 시 포인트 추가
function addPointsOnClick() {
    const links = document.querySelectorAll('.mesh-cell a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            points += 10; // 클릭당 10점
            localStorage.setItem('points', points);
            updatePointsDisplay();
            updateLeaderboard();
        });
    });
}

// 랭킹 업데이트
function updateLeaderboard() {
    const userId = getUserId();
    const userIndex = leaderboard.findIndex(entry => entry.userId === userId);
    if (userIndex !== -1) {
        leaderboard[userIndex].points = points;
    } else {
        leaderboard.push({ userId, points });
    }
    leaderboard.sort((a, b) => b.points - a.points);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    updateLeaderboardDisplay();
}

// 고유 사용자 ID 생성
function getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
    }
    return userId;
}

// 큐브 업데이트
function updateCube() {
    const keyword = document.getElementById('keywordInput').value.trim();
    const link = document.getElementById('linkInput').value.trim();

    if (keyword === '' || link === '') {
        alert('키워드와 링크를 모두 입력하세요!');
        return;
    }

    const faces = document.querySelectorAll('.face');
    faces.forEach(face => {
        face.innerHTML = '';
        const cell = document.createElement('div');
        cell.className = 'mesh-cell';
        const a = document.createElement('a');
        a.href = link;
        a.textContent = keyword;
        a.target = '_blank';
        cell.appendChild(a);
        face.appendChild(cell);
    });

    document.getElementById('keywordInput').value = '';
    document.getElementById('linkInput').value = '';
    addPointsOnClick();
}

// 큐브 드래그로 회전
const cube = document.getElementById('cube');
let isDragging = false;
let previousX, previousY;

cube.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousX = e.clientX;
    previousY = e.clientY;
    cube.style.animation = 'none';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousX;
    const deltaY = e.clientY - previousY;
    previousX = e.clientX;
    previousY = e.clientY;

    let currentTransform = cube.style.transform || 'rotateX(0deg) rotateY(0deg)';
    let [rotX, rotY] = [0, 0];
    const match = currentTransform.match(/rotateX\(([^)]+)\) rotateY\(([^)]+)\)/);
    if (match) {
        rotX = parseFloat(match[1]);
        rotY = parseFloat(match[2]);
    }

    rotX -= deltaY * 0.5;
    rotY += deltaX * 0.5;
    cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// 페이지 로드 시 데이터 불러오기
window.onload = () => {
    loadData();
};

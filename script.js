const cube = document.getElementById("cube");
let isDragging = false;
let previousX = 0;
let previousY = 0;
let rotationX = 0;
let rotationY = 0;

// 큐브 회전 이벤트
cube.addEventListener("mousedown", (e) => {
    isDragging = true;
    previousX = e.clientX;
    previousY = e.clientY;
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        const deltaX = e.clientX - previousX;
        const deltaY = e.clientY - previousY;
        rotationY += deltaX * 0.5;
        rotationX -= deltaY * 0.5;
        cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
        previousX = e.clientX;
        previousY = e.clientY;
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

// 폰트 크기 조절 함수
function adjustFontSize(element) {
    let fontSize = 12;
    element.style.fontSize = fontSize + "px";
    while (element.scrollHeight > element.offsetHeight && fontSize > 4) {
        fontSize--;
        element.style.fontSize = fontSize + "px";
    }
}

// 데이터 로드 및 렌더링
function loadCubeData() {
    const savedData = JSON.parse(localStorage.getItem("cubeData")) || {};
    for (const faceIndex in savedData) {
        const face = document.getElementsByClassName("face")[faceIndex];
        face.innerHTML = "";
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const cell = document.createElement("div");
                cell.className = "mesh-cell";
                cell.style.left = `${j * 30}px`;
                cell.style.top = `${i * 30}px`;
                face.appendChild(cell);
            }
        }
        const faceData = savedData[faceIndex];
        for (const data of faceData) {
            const { keyword, link, emoji, cellIndex } = data;
            const cells = face.getElementsByClassName("mesh-cell");
            const selectedCell = cells[cellIndex];
            if (selectedCell) {
                selectedCell.innerHTML = `<a href="${link}" target="_blank">${emoji} ${keyword}</a>`;
                adjustFontSize(selectedCell.querySelector("a"));
            }
        }
    }
}

// 큐브 업데이트 함수
async function updateCube() {
    const keyword = document.getElementById("keywordInput").value;
    const link = document.getElementById("linkInput").value;
    const emoji = document.getElementById("emojiSelect").value;
    if (!keyword || !link || !emoji) {
        alert("모든 필드를 채워주세요!");
        return;
    }

    let savedData = JSON.parse(localStorage.getItem("cubeData")) || {};
    let faceIndex, cellIndex;
    do {
        faceIndex = Math.floor(Math.random() * 6);
        if (!savedData[faceIndex]) savedData[faceIndex] = [];
        cellIndex = Math.floor(Math.random() * 100);
    } while (savedData[faceIndex].some(data => data.cellIndex === cellIndex));

    const newData = { keyword, link, emoji, cellIndex };
    savedData[faceIndex].push(newData);
    localStorage.setItem("cubeData", JSON.stringify(savedData));
    loadCubeData(); // 큐브 다시 렌더링
}

// 페이지 로드 시 데이터 로드
window.onload = loadCubeData;

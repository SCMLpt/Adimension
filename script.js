// 로컬에 저장할 큐브 데이터
let cubeData = {};

// 사용자 ID 생성
function getUserId() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        userId = "user_" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("userId", userId);
    }
    return userId;
}

// 텍스트 크기 조절 함수
function adjustFontSize(element) {
    let fontSize = 10;
    element.style.fontSize = fontSize + "px";
    const parentWidth = element.parentElement.offsetWidth;
    const parentHeight = element.parentElement.offsetHeight;

    while ((element.scrollWidth > parentWidth || element.scrollHeight > parentHeight) && fontSize > 4) {
        fontSize--;
        element.style.fontSize = fontSize + "px";
    }
}

// 초기 데이터 로드 함수
async function loadInitialData() {
    try {
        const response = await fetch('http://localhost:5001/cube/load/all', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        cubeData = await response.json();
        console.log("Initial data loaded:", cubeData);
        renderCube(); // 초기 렌더링
    } catch (error) {
        console.error("Failed to load initial data:", error);
    }
}

// 큐브 전체 렌더링 함수
function renderCube() {
    const faces = document.getElementsByClassName("face");
    for (let faceIndex = 0; faceIndex < faces.length; faceIndex++) {
        const face = faces[faceIndex];
        face.innerHTML = "";
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                const cell = document.createElement("div");
                cell.className = "mesh-cell";
                cell.style.left = `${j * 20}px`;
                cell.style.top = `${i * 20}px`;
                face.appendChild(cell);
            }
        }

        const faceData = cubeData[faceIndex];
        if (faceData) {
            for (const data of faceData) {
                const { keyword, link, emoji, cellIndex } = data;
                const cells = face.getElementsByClassName("mesh-cell");
                const selectedCell = cells[cellIndex];
                if (selectedCell) {
                    selectedCell.innerHTML = `<a href="${link}" target="_blank">${emoji} ${keyword}</a>`;
                    const linkElement = selectedCell.querySelector("a");
                    adjustFontSize(linkElement);
                }
            }
        }
    }
}

// 주기적 업데이트 함수
async function updateCubeData() {
    try {
        const response = await fetch('http://localhost:5001/cube/load/updates', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const updates = await response.json();
        for (const update of updates) {
            const { faceIndex, data } = update;
            if (!cubeData[faceIndex]) cubeData[faceIndex] = [];
            cubeData[faceIndex].push(data);
            renderFace(faceIndex); // 해당 면만 업데이트
        }
    } catch (error) {
        console.error("Failed to update data:", error);
    }
}

// 특정 면 렌더링 함수
function renderFace(faceIndex) {
    const face = document.getElementsByClassName("face")[faceIndex];
    if (!face) return;

    face.innerHTML = "";
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            const cell = document.createElement("div");
            cell.className = "mesh-cell";
            cell.style.left = `${j * 20}px`;
            cell.style.top = `${i * 20}px`;
            face.appendChild(cell);
        }
    }

    const faceData = cubeData[faceIndex];
    if (faceData) {
        for (const data of faceData) {
            const { keyword, link, emoji, cellIndex } = data;
            const cells = face.getElementsByClassName("mesh-cell");
            const selectedCell = cells[cellIndex];
            if (selectedCell) {
                selectedCell.innerHTML = `<a href="${link}" target="_blank">${emoji} ${keyword}</a>`;
                const linkElement = selectedCell.querySelector("a");
                adjustFontSize(linkElement);
            }
        }
    }
}

// 큐브 업데이트 함수 (사용자 입력 처리)
async function updateCube() {
    const keyword = document.getElementById("keywordInput").value.trim();
    const link = document.getElementById("linkInput").value.trim();
    const emoji = document.getElementById("emojiSelect").value;

    if (!keyword || !link || !emoji) {
        alert("Please enter keyword, link, and select an emoji!");
        return;
    }

    const userId = getUserId();
    const faceIndex = Math.floor(Math.random() * 6);
    const cellIndex = Math.floor(Math.random() * 225); // 15x15 = 225 cells

    const newData = { keyword, link, emoji, cellIndex, userId };

    try {
        const response = await fetch('http://localhost:5001/cube/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ faceIndex, data: newData })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Data saved successfully");

        // 로컬 데이터 업데이트
        if (!cubeData[faceIndex]) cubeData[faceIndex] = [];
        cubeData[faceIndex].push(newData);
        renderFace(faceIndex); // 해당 면 업데이트
    } catch (error) {
        console.error("Failed to save data:", error);
    }

    // 입력 필드 초기화
    document.getElementById("keywordInput").value = "";
    document.getElementById("linkInput").value = "";
    document.getElementById("emojiSelect").value = "";
}

// 페이지 로드 및 주기적 업데이트 설정
window.onload = function() {
    loadInitialData();
    setInterval(updateCubeData, 10000); // 10초마다 업데이트
};

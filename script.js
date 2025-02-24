// script.js

const cube = document.getElementById("cube");
let isDragging = false;
let previousX = 0;
let previousY = 0;
let rotationX = 0;
let rotationY = 0;

// 고유 사용자 ID 생성
function getUserId() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        userId = "user_" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("userId", userId);
    }
    console.log("Current userId:", userId);
    return userId;
}

// 드래그 기능
cube.addEventListener("mousedown", (e) => {
    if (e.target.className !== "mesh-cell" && e.target.tagName !== "A") {
        isDragging = true;
        previousX = e.clientX;
        previousY = e.clientY;
        e.preventPropagation();
    }
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

document.addEventListener("mouseleave", () => {
    isDragging = false;
});

// 텍스트 크기 조절 함수
function adjustFontSize(element) {
    let fontSize = 10; // 초기 폰트 크기
    element.style.fontSize = fontSize + "px";
    const parentWidth = element.parentElement.offsetWidth;

    while (element.scrollWidth > parentWidth && fontSize > 4) {
        fontSize--;
        element.style.fontSize = fontSize + "px";
    }
}

// 텍스트 업데이트 및 서버 저장 함수
async function updateCube() {
    const keyword = document.getElementById("keywordInput").value.trim();
    let link = document.getElementById("linkInput").value.trim();

    if (keyword === "" || link === "") {
        alert("Please enter both a keyword and a link!");
        return;
    }

    if (!link.startsWith("http://") && !link.startsWith("https://")) {
        link = "https://" + link;
    }

    const userId = getUserId();
    const savedData = localStorage.getItem(`cubeData_${userId}`) || '{}';
    const { faceIndex, cellIndex } = JSON.parse(savedData);

    let selectedFace, newFaceIndex, newCellIndex;
    if (faceIndex !== undefined && cellIndex !== undefined) {
        newFaceIndex = faceIndex;
        newCellIndex = cellIndex;
        selectedFace = document.getElementsByClassName("face")[faceIndex];
    } else {
        newFaceIndex = Math.floor(Math.random() * 6);
        newCellIndex = Math.floor(Math.random() * 100);
        selectedFace = document.getElementsByClassName("face")[newFaceIndex];
    }

    selectedFace.innerHTML = "";
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement("div");
            cell.className = "mesh-cell";
            cell.style.left = `${j * 20}px`;
            cell.style.top = `${i * 20}px`;
            selectedFace.appendChild(cell);
        }
    }

    const cells = selectedFace.getElementsByClassName("mesh-cell");
    const selectedCell = cells[newCellIndex];
    selectedCell.innerHTML = "";

    const linkElement = document.createElement("a");
    linkElement.href = link;
    linkElement.textContent = keyword;
    linkElement.target = "_blank";
    linkElement.style.pointerEvents = "auto";

    // 폰트 크기 조절 적용
    selectedCell.appendChild(linkElement);
    adjustFontSize(linkElement);

    const cubeData = { keyword, link, userId, faceIndex: newFaceIndex, cellIndex: newCellIndex };
    try {
        console.log("Attempting to save data to server with data:", cubeData);
        const response = await fetch('http://localhost:5001/cube/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cubeData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Server response for save:", data);
        localStorage.setItem(`cubeData_${userId}`, JSON.stringify(cubeData));
        console.log("Data saved to localStorage successfully.");
    } catch (error) {
        console.error("Failed to save data:", error);
    }

    document.getElementById("keywordInput").value = "";
    document.getElementById("linkInput").value = "";
}

// 모든 사용자 데이터 로드
async function loadAllData() {
    try {
        console.log("Attempting to load all cube data from server...");
        const response = await fetch('http://localhost:5001/cube/load/all', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        const allData = await response.json();
        console.log("Server response for all data:", JSON.stringify(allData, null, 2));

        for (const [userId, data] of Object.entries(allData)) {
            console.log(`Rendering data for user ${userId}:`, data);
            const { keyword, link, faceIndex, cellIndex } = data;
            const faces = document.getElementsByClassName("face");
            if (faceIndex >= 0 && faceIndex < faces.length) {
                const selectedFace = faces[faceIndex];
                selectedFace.innerHTML = "";

                for (let i = 0; i < 10; i++) {
                    for (let j = 0; j < 10; j++) {
                        const cell = document.createElement("div");
                        cell.className = "mesh-cell";
                        cell.style.left = `${j * 20}px`;
                        cell.style.top = `${i * 20}px`;
                        selectedFace.appendChild(cell);
                    }
                }

                const cells = selectedFace.getElementsByClassName("mesh-cell");
                if (cellIndex >= 0 && cellIndex < cells.length) {
                    const selectedCell = cells[cellIndex];
                    selectedCell.innerHTML = "";

                    const linkElement = document.createElement("a");
                    linkElement.href = link;
                    linkElement.textContent = keyword;
                    linkElement.target = "_blank";
                    linkElement.style.pointerEvents = "auto";

                    // 폰트 크기 조절 적용
                    selectedCell.appendChild(linkElement);
                    adjustFontSize(linkElement);

                    console.log(`Rendered data for user ${userId} at face ${faceIndex}, cell ${cellIndex}`);
                } else {
                    console.warn(`Invalid cellIndex ${cellIndex} for user ${userId}`);
                }
            } else {
                console.warn(`Invalid faceIndex ${faceIndex} for user ${userId}`);
            }
        }
    } catch (error) {
        console.error("Failed to load data:", error);
    }
}

// 페이지 로드 및 주기적 업데이트
window.onload = function() {
    loadAllData();
    setInterval(loadAllData, 10000); // 10초마다 업데이트
};


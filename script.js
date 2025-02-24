const cube = document.getElementById("cube");
let isDragging = false;
let previousX = 0;
let previousY = 0;
let rotationX = 0;
let rotationY = 0;

// 고유 사용자 ID 생성 (IP 대신 사용)
function getUserId() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        userId = "user_" + Math.random().toString(36).substr(2, 9); // 랜덤 고유 ID
        localStorage.setItem("userId", userId);
    }
    return userId;
}

// 드래그 기능
cube.addEventListener("mousedown", (e) => {
    if (e.target.className !== "mesh-cell" && e.target.tagName !== "A") {
        isDragging = true;
        previousX = e.clientX;
        previousY = e.clientY;
        e.preventDefault();
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
        // 기존 위치 유지
        newFaceIndex = faceIndex;
        newCellIndex = cellIndex;
        selectedFace = document.getElementsByClassName("face")[faceIndex];
    } else {
        // 새 데이터면 랜덤 위치 선택
        newFaceIndex = Math.floor(Math.random() * 6);
        newCellIndex = Math.floor(Math.random() * 100); // 10x10 = 100 셀
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
    linkElement.addEventListener("click", (e) => {
        console.log("Link clicked:", link);
        e.stopPropagation();
    });
    selectedCell.appendChild(linkElement);

    // 서버에 데이터 저장 (제공된 ngrok 주소 사용)
    const cubeData = { keyword, link, userId, faceIndex: newFaceIndex, cellIndex: newCellIndex };
    try {
        await fetch('https://d12f-2001-2d8-7381-8b9a-4cb2-2f1d-f131-9fdf.ngrok-free.app/cube/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cubeData)
        });
        // 로컬 저장소에도 백업 (안정성 확보)
        localStorage.setItem(`cubeData_${userId}`, JSON.stringify(cubeData));
    } catch (error) {
        console.error("Failed to save data:", error);
    }

    // 입력창 초기화
    document.getElementById("keywordInput").value = "";
    document.getElementById("linkInput").value = "";
}

// 페이지 로드 시 모든 사용자 데이터 로드
async function loadAllData() {
    try {
        const response = await fetch('https://d12f-2001-2d8-7381-8b9a-4cb2-2f1d-f131-9fdf.ngrok-free.app/cube/load/all');
        const allData = await response.json();
        for (const [userId, data] of Object.entries(allData)) {
            if (userId !== getUserId()) {
                const { keyword, link, faceIndex, cellIndex } = data;
                const faces = document.getElementsByClassName("face");
                if (faceIndex < faces.length) {
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
                    if (cellIndex < cells.length) {
                        const selectedCell = cells[cellIndex];
                        selectedCell.innerHTML = "";

                        const linkElement = document.createElement("a");
                        linkElement.href = link;
                        linkElement.textContent = keyword;
                        linkElement.target = "_blank";
                        linkElement.style.pointerEvents = "auto";
                        linkElement.addEventListener("click", (e) => {
                            console.log("Link clicked:", link);
                            e.stopPropagation();
                        });
                        selectedCell.appendChild(linkElement);
                    } else {
                        console.warn(`Invalid cellIndex ${cellIndex} for user ${userId}`);
                    }
                } else {
                    console.warn(`Invalid faceIndex ${faceIndex} for user ${userId}`);
                }
            }
        }
    } catch (error) {
        console.error("Failed to load data:", error);
    }
}

// 페이지 로드 시 데이터 로드
window.onload = function() {
    loadAllData();
    const userId = getUserId();
    const savedData = localStorage.getItem(`cubeData_${userId}`);
    if (savedData) {
        const { keyword, link, faceIndex, cellIndex } = JSON.parse(savedData);
        const faces = document.getElementsByClassName("face");
        if (faceIndex < faces.length) {
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
            if (cellIndex < cells.length) {
                const selectedCell = cells[cellIndex];
                selectedCell.innerHTML = "";

                const linkElement = document.createElement("a");
                linkElement.href = link;
                linkElement.textContent = keyword;
                linkElement.target = "_blank";
                linkElement.style.pointerEvents = "auto";
                linkElement.addEventListener("click", (e) => {
                    console.log("Link clicked:", link);
                    e.stopPropagation();
                });
                selectedCell.appendChild(linkElement);
            } else {
                console.warn(`Invalid cellIndex ${cellIndex} for user ${userId}`);
            }
        } else {
            console.warn(`Invalid faceIndex ${faceIndex} for user ${userId}`);
        }
    }
};

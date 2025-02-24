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
    console.log("Current userId:", userId); // 디버깅 로그 추가
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

    // 서버에 데이터 저장 (새 ngrok URL 사용)
    const cubeData = { keyword, link, userId, faceIndex: newFaceIndex, cellIndex: newCellIndex };
    try {
        console.log("Attempting to save data to server with data:", cubeData);
        const response = await fetch('https://a45a-2001-2d8-7381-8b9a-4cb2-2f1d-f131-9fdf.ngrok-free.app/cube/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cubeData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Server response for save:", data);
        // 로컬 저장소에도 백업 (안정성 확보)
        localStorage.setItem(`cubeData_${userId}`, JSON.stringify(cubeData));
        console.log("Data saved to localStorage successfully.");
    } catch (error) {
        console.error("Failed to save data:", error);
        // 에러 세부 정보 로깅 (CORS, 네트워크 문제 등)
        if (error instanceof TypeError) {
            console.error("Network error or CORS issue:", error.message);
        } else if (error.message.includes("HTTP error")) {
            console.error("Server responded with an error:", error.message);
        }
    }

    // 입력창 초기화
    document.getElementById("keywordInput").value = "";
    document.getElementById("linkInput").value = "";
}

// 페이지 로드 시 모든 사용자 데이터 로드 (새 ngrok URL 사용)
async function loadAllData() {
    try {
        console.log("Attempting to load all cube data from server...");
        const response = await fetch('https://a45a-2001-2d8-7381-8b9a-4cb2-2f1d-f131-9fdf.ngrok-free.app/cube/load/all');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        // 응답 텍스트를 먼저 로그로 출력 (JSON 파싱 전에 확인)
        const textResponse = await response.text();
        console.log("Server response (text):", textResponse);
        // JSON 파싱 시도
        const allData = JSON.parse(textResponse);
        console.log("Server response for all data (parsed):", JSON.stringify(allData, null, 2));
        for (const [userId, data] of Object.entries(allData)) {
            console.log(`Processing data for user ${userId}:`, data);
            if (userId !== getUserId()) {
                console.log(`Rendering data for user ${userId} (not current user):`, data);
                const { keyword, link, faceIndex, cellIndex } = data;
                console.log(`Rendering data: keyword=${keyword}, link=${link}, faceIndex=${faceIndex}, cellIndex=${cellIndex}`);
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
                        linkElement.addEventListener("click", (e) => {
                            console.log("Link clicked:", link);
                            e.stopPropagation();
                        });
                        selectedCell.appendChild(linkElement);
                        console.log(`Rendered data for user ${userId} at face ${faceIndex}, cell ${cellIndex}`);
                    } else {
                        console.warn(`Invalid cellIndex ${cellIndex} for user ${userId} - out of range for ${cells.length} cells`);
                    }
                } else {
                    console.warn(`Invalid faceIndex ${faceIndex} for user ${userId} - out of range for ${faces.length} faces`);
                }
            } else {
                console.log(`Skipping current user's data: ${userId}`);
            }
        }
        console.log("All cube data loaded and rendered successfully.");
    } catch (error) {
        console.error("Failed to load data:", error);
        // 에러 세부 정보 로깅 (CORS, 네트워크 문제 등)
        if (error instanceof SyntaxError) {
            console.error("JSON parsing error - Server returned invalid JSON:", error.message);
        } else if (error instanceof TypeError) {
            console.error("Network error or CORS issue:", error.message);
        } else if (error.message.includes("HTTP error")) {
            console.error("Server responded with an error:", error.message);
        }
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
                linkElement.addEventListener("click", (e) => {
                    console.log("Link clicked:", link);
                    e.stopPropagation();
                });
                selectedCell.appendChild(linkElement);
            } else {
                console.warn(`Invalid cellIndex ${cellIndex} for user ${userId} - out of range for ${cells.length} cells`);
            }
        } else {
            console.warn(`Invalid faceIndex ${faceIndex} for user ${userId} - out of range for ${faces.length} faces`);
        }
    }
};

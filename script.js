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

// 페이지 로드 시 저장된 데이터 복원 (영구적으로 유지)
window.onload = function() {
    const userId = getUserId();
    const savedData = localStorage.getItem(`cubeData_${userId}`);
    if (savedData) {
        const { keyword, link, faceIndex, cellIndex } = JSON.parse(savedData);
        const faces = document.getElementsByClassName("face");
        const selectedFace = faces[faceIndex];
        selectedFace.innerHTML = "";

        // 10x10 메시 생성
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
        const selectedCell = cells[cellIndex];

        // 링크 요소 생성
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
    }
};

// 텍스트 업데이트 함수
function updateCube() {
    const keyword = document.getElementById("keywordInput").value.trim();
    let link = document.getElementById("linkInput").value.trim();

    if (keyword === "" || link === "") {
        alert("Please enter both a keyword and a link!");
        return;
    }

    // 링크가 http 또는 https로 시작하지 않으면 추가
    if (!link.startsWith("http://") && !link.startsWith("https://")) {
        link = "https://" + link;
    }

    const userId = getUserId();
    const savedData = localStorage.getItem(`cubeData_${userId}`);

    // 모든 면 가져오기
    const faces = document.getElementsByClassName("face");

    let selectedFace, faceIndex, cellIndex;
    if (savedData) {
        // 기존 데이터가 있으면 같은 위치 사용
        const { faceIndex: oldFaceIndex, cellIndex: oldCellIndex } = JSON.parse(savedData);
        faceIndex = oldFaceIndex;
        cellIndex = oldCellIndex;
        selectedFace = faces[faceIndex];
    } else {
        // 새 데이터면 랜덤 위치 선택
        faceIndex = Math.floor(Math.random() * faces.length);
        selectedFace = faces[faceIndex];
        cellIndex = Math.floor(Math.random() * 100); // 10x10 = 100 셀
    }

    // 기존 메시 제거
    selectedFace.innerHTML = "";

    // 10x10 메시 생성
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement("div");
            cell.className = "mesh-cell";
            cell.style.left = `${j * 20}px`;
            cell.style.top = `${i * 20}px`;
            selectedFace.appendChild(cell);
        }
    }

    // 메시의 셀들 가져오기
    const cells = selectedFace.getElementsByClassName("mesh-cell");
    const selectedCell = cells[cellIndex];

    // 기존 링크 제거 (필요 시)
    selectedCell.innerHTML = "";

    // 링크 요소 생성
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

    // 데이터 영구 저장 (localStorage 사용)
    const cubeData = {
        keyword,
        link,
        faceIndex,
        cellIndex
    };
    localStorage.setItem(`cubeData_${userId}`, JSON.stringify(cubeData));

    // 입력창 초기화
    document.getElementById("keywordInput").value = "";
    document.getElementById("linkInput").value = "";
}

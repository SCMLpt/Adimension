const cube = document.getElementById("cube");
let isDragging = false;
let previousX = 0;
let previousY = 0;
let rotationX = 0;
let rotationY = 0;

// 드래그 기능
cube.addEventListener("mousedown", (e) => {
    // 링크가 아닌 `.cube` 요소에서만 드래그 시작
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

// 텍스트 업데이트 함수
function updateCube(){
    const keyword = document.getElementById("keywordInput").value.trim();
    const link = document.getElementById("linkInput").value.trim();

    if (keyword === "" || link === "") {
        alert("Please enter both a keyword and a link!");
        return;
    }

    // 모든 면 가져오기
    const faces = document.getElementsByClassName("face");
    
    // 랜덤 면 선택
    const randomFaceIndex = Math.floor(Math.random() * faces.length);
    const selectedFace = faces[randomFaceIndex];
    
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
    
    // 랜덤 셀 선택
    const randomCellIndex = Math.floor(Math.random() * cells.length);
    const selectedCell = cells[randomCellIndex];
    
    // 링크 요소 생성
    const linkElement = document.createElement("a");
    linkElement.href = link;
    linkElement.textContent = keyword;
    linkElement.target = "_blank"; // 새 탭에서 열리도록
    linkElement.style.pointerEvents = "auto"; // 링크 클릭 명시적 허용
    selectedCell.appendChild(linkElement);

    // 입력창 초기화
    document.getElementById("keywordInput").value = "";
    document.getElementById("linkInput").value = "";
}

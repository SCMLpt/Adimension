const cube = document.getElementById("cube");
let isDragging = false;
let previousX = 0;
let previousY = 0;
let rotationX = 0;
let rotationY = 0;

// 드래그 기능
cube.addEventListener("mousedown", (e) => {
    isDragging = true;
    previousX = e.clientX;
    previousY = e.clientY;
    e.preventDefault();
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
function updateCube() {
    const input = document.getElementById("chatInput").value;
    if (input.trim() !== "") {
        // 모든 면 가져오기
        const faces = document.getElementsByClassName("face");
        
        // 랜덤 면 선택
        const randomFaceIndex = Math.floor(Math.random() * faces.length);
        const selectedFace = faces[randomFaceIndex];
        
        // 기존 메시 제거 (새로운 입력마다 갱신)
        selectedFace.innerHTML = "";

        // 10x10 메시 생성
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const cell = document.createElement("div");
                cell.className = "mesh-cell";
                cell.style.left = `${j * 20}px`; // 20px = 200px / 10
                cell.style.top = `${i * 20}px`;
                selectedFace.appendChild(cell);
            }
        }

        // 메시의 셀들 가져오기
        const cells = selectedFace.getElementsByClassName("mesh-cell");
        
        // 랜덤 셀 선택
        const randomCellIndex = Math.floor(Math.random() * cells.length);
        const selectedCell = cells[randomCellIndex];
        
        // 텍스트 플롯
        selectedCell.textContent = input;

        // 입력창 초기화
        document.getElementById("chatInput").value = "";
    }
}

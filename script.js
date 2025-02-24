const cube = document.getElementById("cube");
let isDragging = false;
let previousX = 0;
let previousY = 0;
let rotationX = 0;
let rotationY = 0;

// 텍스트 업데이트 함수
function updateCube() {
    const input = document.getElementById("chatInput").value;
    if (input.trim() !== "") {
        const faces = document.getElementsByClassName("face");
        for (let i = 0; i < faces.length; i++) {
            faces[i].textContent = input;
        }
        document.getElementById("chatInput").value = "";
    }
}

// 드래그 시작
cube.addEventListener("mousedown", (e) => {
    isDragging = true;
    previousX = e.clientX;
    previousY = e.clientY;
    e.preventDefault(); // 기본 동작(스크롤 등) 방지
});

// 드래그 중
document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        const deltaX = e.clientX - previousX;
        const deltaY = e.clientY - previousY;

        rotationY += deltaX * 0.5; // Y축 회전
        rotationX -= deltaY * 0.5; // X축 회전

        cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

        previousX = e.clientX;
        previousY = e.clientY;
    }
});

// 드래그 종료
document.addEventListener("mouseup", () => {
    isDragging = false;
});

// 문서 밖으로 나가도 드래그 종료
document.addEventListener("mouseleave", () => {
    isDragging = false;
});

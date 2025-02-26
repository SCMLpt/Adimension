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

// 사용자 ID 생성
function getUserId() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        userId = "user_" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("userId", userId);
    }
    return userId;
}

// 큐브 업데이트 함수
async function updateCube() {
    const keyword = document.getElementById("keywordInput").value.trim();
    const link = document.getElementById("linkInput").value.trim();
    const emoji = document.getElementById("emojiSelect").value;

    if (!keyword || !link || !emoji) {
        alert("Please enter keyword, link, and select an emoji!");
        return;
    }

    const userId = getUserId();
    const selectedFace = document.getElementsByClassName("face")[Math.floor(Math.random() * 6)];
    selectedFace.innerHTML = "";

    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            const cell = document.createElement("div");
            cell.className = "mesh-cell";
            cell.style.left = `${j * 20}px`;
            cell.style.top = `${i * 20}px`;
            selectedFace.appendChild(cell);
        }
    }

    const cells = selectedFace.getElementsByClassName("mesh-cell");
    const randomCell = cells[Math.floor(Math.random() * 225)];
    randomCell.innerHTML = `<a href="${link}" target="_blank">${emoji} ${keyword}</a>`;

    const linkElement = randomCell.querySelector("a");
    adjustFontSize(linkElement);
}

// 페이지 로드 시 기존 데이터 로드
window.onload = function() {
    // 기존 데이터 로드 로직은 생략 (서버 연동 필요 시 추가)
};

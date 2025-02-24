function updateCube() {
    const input = document.getElementById("chatInput").value;
    if (input.trim() !== "") {
        const faces = document.getElementsByClassName("face");
        for (let i = 0; i < faces.length; i++) {
            faces[i].textContent = input;
        }
        document.getElementById("chatInput").value = ""; // 입력창 초기화
    }
}

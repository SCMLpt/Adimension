let lastKeyword = "";
let lastLink = "";

function updateCube() {
    const keyword = document.getElementById("keywordInput").value.trim();
    const link = document.getElementById("linkInput").value.trim();

    if (keyword === "" || link === "") {
        alert("Please enter both a keyword and a link!");
        return;
    }

    // Skip update if input hasn't changed
    if (keyword === lastKeyword && link === lastLink) return;

    lastKeyword = keyword;
    lastLink = link;

    const faces = document.querySelectorAll(".face");
    faces.forEach((face, index) => {
        face.innerHTML = ""; // Clear existing content
        const cell = document.createElement("div");
        cell.className = "mesh-cell";
        const a = document.createElement("a");
        a.href = link;
        a.textContent = keyword;
        a.target = "_blank"; // Open link in new tab
        cell.appendChild(a);
        face.appendChild(cell);
    });

    // Clear input fields
    document.getElementById("keywordInput").value = "";
    document.getElementById("linkInput").value = "";
}

// Mouse drag to rotate the cube
const cube = document.getElementById("cube");
let isDragging = false;
let previousX, previousY;

cube.addEventListener("mousedown", (e) => {
    isDragging = true;
    previousX = e.clientX;
    previousY = e.clientY;
    cube.style.animation = "none"; // Stop animation while dragging
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousX;
    const deltaY = e.clientY - previousY;
    previousX = e.clientX;
    previousY = e.clientY;

    let currentTransform = cube.style.transform || "rotateX(0deg) rotateY(0deg)";
    let [rotX, rotY] = [0, 0];
    const match = currentTransform.match(/rotateX\(([^)]+)\) rotateY\(([^)]+)\)/);
    if (match) {
        rotX = parseFloat(match[1]);
        rotY = parseFloat(match[2]);
    }

    rotX -= deltaY * 0.5;
    rotY += deltaX * 0.5;
    cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

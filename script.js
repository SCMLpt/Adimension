// Replace this with your ngrok URL
const BASE_URL = "https://d12f-2001-2d8-7381-8b9a-4cb2-2f1d-f131-9fdf.ngrok-free.app";

const cube = document.getElementById("cube");
let isDragging = false;
let previousX = 0;
let previousY = 0;
let rotationX = 0;
let rotationY = 0;

// Store the server's current cube data in a global variable
// so we know whether to reuse faceIndex/cellIndex
let currentCubeData = null;

// --------------------------
// DRAG LOGIC
// --------------------------
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

// --------------------------
// ON PAGE LOAD
// --------------------------
window.onload = function() {
    // Fetch existing cube data from the server
    fetch(`${BASE_URL}/cube/get`)
        .then(response => response.json())
        .then(data => {
            // If the server has valid data, store & render it
            if (data && data.keyword) {
                currentCubeData = data;
                renderCube(data);
            }
        })
        .catch(err => console.error("Error fetching cube data:", err));
};

// --------------------------
// RENDER THE CUBE
// --------------------------
function renderCube({ keyword, link, faceIndex, cellIndex }) {
    // Get the target face
    const faces = document.getElementsByClassName("face");
    const selectedFace = faces[faceIndex];

    // Clear any existing grid on that face
    selectedFace.innerHTML = "";

    // Create a 10x10 grid
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement("div");
            cell.className = "mesh-cell";
            cell.style.left = `${j * 20}px`;
            cell.style.top = `${i * 20}px`;
            selectedFace.appendChild(cell);
        }
    }

    // Place the link in the specified cell
    const cells = selectedFace.getElementsByClassName("mesh-cell");
    const selectedCell = cells[cellIndex];

    const linkElement = document.createElement("a");
    linkElement.href = link;
    linkElement.textContent = keyword;
    linkElement.target = "_blank";
    linkElement.addEventListener("click", (e) => {
        console.log("Link clicked:", link);
        e.stopPropagation();
    });
    selectedCell.appendChild(linkElement);
}

// --------------------------
// UPDATE CUBE
// --------------------------
function updateCube() {
    const keyword = document.getElementById("keywordInput").value.trim();
    let link = document.getElementById("linkInput").value.trim();

    if (!keyword || !link) {
        alert("Please enter both a keyword and a link!");
        return;
    }

    // Ensure the link starts with http or https
    if (!/^https?:\\/\\//i.test(link)) {
        link = "https://" + link;
    }

    // Decide whether to reuse existing face/cell or pick new random
    let faceIndex, cellIndex;
    if (currentCubeData && currentCubeData.keyword) {
        faceIndex = currentCubeData.faceIndex;
        cellIndex = currentCubeData.cellIndex;
    } else {
        faceIndex = Math.floor(Math.random() * 6);   // 6 faces
        cellIndex = Math.floor(Math.random() * 100); // 10x10 grid = 100 cells
    }

    const newCubeData = {
        keyword,
        link,
        faceIndex,
        cellIndex
    };

    // POST to server to update the shared data
    fetch(`${BASE_URL}/cube/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCubeData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            // Update our local reference & re-render
            currentCubeData = data.cube_data;
            renderCube(data.cube_data);
        } else {
            console.error("Error updating cube:", data.error);
        }
    })
    .catch(err => console.error("Error sending updateCube request:", err));

    // Clear input fields
    document.getElementById("keywordInput").value = "";
    document.getElementById("linkInput").value = "";
}


body {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background-color: #f0f0f0;
}

.container {
    text-align: center;
}

h1 {
    font-size: 28px;
    margin-bottom: 20px;
    color: #333;
}

.input-group {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

input, select {
    padding: 10px;
    margin: 0 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.2s;
}

button:hover {
    transform: scale(1.05);
}

button:active {
    transform: scale(0.95);
}

.cube-container {
    perspective: 1000px;
}

.cube {
    position: relative;
    width: 300px;
    height: 300px;
    transform-style: preserve-3d;
    transition: transform 0.1s;
}

.face {
    position: absolute;
    width: 300px;
    height: 300px;
    background-color: rgba(100, 149, 237, 0.8);
    border: 1px solid #fff;
}

.front  { transform: translateZ(150px); }
.back   { transform: translateZ(-150px) rotateY(180deg); }
.left   { transform: translateX(-150px) rotateY(-90deg); }
.right  { transform: translateX(150px) rotateY(90deg); }
.top    { transform: translateY(-150px) rotateX(90deg); }
.bottom { transform: translateY(150px) rotateX(-90deg); }

.mesh-cell {
    position: absolute;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.mesh-cell a {
    color: #ffeb3b;
    text-decoration: none;
    font-size: 12px;
    text-align: center;
    white-space: normal;
}

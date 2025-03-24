document.addEventListener("DOMContentLoaded", startGame);

const rgbValue = document.getElementById("rgb-value");
const optionsContainer = document.getElementById("options");
const result = document.getElementById("result");
const newGameBtn = document.getElementById("new-game");
const scoreDisplay = document.getElementById("score");

let correctColor;
let score = 0; 
function randomRGB() {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
}

function startGame() {
    optionsContainer.innerHTML = "";
    result.textContent = "";
    
    correctColor = randomRGB();
    rgbValue.textContent = correctColor;

    let colors = [correctColor];

    while (colors.length < 3) {
        let newColor = randomRGB();
        if (!colors.includes(newColor)) colors.push(newColor);
    }

    colors.sort(() => Math.random() - 0.5);

    colors.forEach(color => {
        let box = document.createElement("div");
        box.classList.add("color-box");
        box.style.backgroundColor = color;
        box.addEventListener("click", () => checkAnswer(color));
        optionsContainer.appendChild(box);
    });
}

function checkAnswer(selectedColor) {
    if (selectedColor === correctColor) {
        result.textContent = "✅ Correct!";
        result.style.color = "green";
        score++;  
    } else {
        result.textContent = "❌ Try Again!";
        result.style.color = "red";
        score = 0;  
    }
    scoreDisplay.textContent = score; 
}

newGameBtn.addEventListener("click", startGame);

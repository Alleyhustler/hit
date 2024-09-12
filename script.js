const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const leftArm = document.getElementById('leftArm');
const rightArm = document.getElementById('rightArm');

let image = new Image();
image.src = 'images/shot-panoramic-composition-empty-interior.jpg'; // Your 360-degree panoramic image

let imgWidth, imgHeight;
image.onload = function() {
    imgWidth = image.width;
    imgHeight = image.height;
    drawBackground(0);
}

let offsetX = 0;

// Function to draw the 360-degree background and make sure it wraps seamlessly
function drawBackground(offsetX) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the image first
    ctx.drawImage(image, offsetX, 0, imgWidth, imgHeight, 0, 0, canvas.width, canvas.height);

    // If we scroll past the end of the image, draw it again to the left or right for wrapping
    if (offsetX > 0) {
        ctx.drawImage(image, offsetX - imgWidth, 0, imgWidth, imgHeight, 0, 0, canvas.width, canvas.height);
    } else if (offsetX < 0) {
        ctx.drawImage(image, offsetX + imgWidth, 0, imgWidth, imgHeight, 0, 0, canvas.width, canvas.height);
    }
}

// Mouse movement for continuous background shift and arm movement
document.addEventListener('mousemove', function(event) {
    const mouseX = event.clientX;

    // Map mouseX to a range of -1 to 1
    const normalizedX = (mouseX / window.innerWidth) * 2 - 1;

    // Move the background proportionally to mouse movement
    offsetX += normalizedX * 5; // Adjust the speed by modifying the multiplier

    if (offsetX > imgWidth) {
        offsetX = 0;
    } else if (offsetX < -imgWidth) {
        offsetX = 0;
    }

    // Move the arms slightly based on mouse position for realism
    const armMovementX = normalizedX * 30; // Adjust for how much arms should move horizontally
    leftArm.style.transform = `translate(${armMovementX}px, 0)`;
    rightArm.style.transform = `translate(${armMovementX * -1}px, 0)`; // Mirror movement for right arm

    drawBackground(offsetX);
});

// Continuously update the background at a set interval
setInterval(function() {
    drawBackground(offsetX);
}, 1000 / 60); // 60 frames per second

// Define a list of target images
const targetImages = [
    'images/1f.png',
    'images/1fl.png',
    'images/2f.png',
    'images/2fl.png',
    'images/2flo.png',
    'images/3f.png',
    'images/3fl.png',
    'images/3flo.png',
    'images/3flor.png',
    'images/4.png',
    'images/4f.png',
    'images/4fl.png',
    'images/4floo.png',
    'images/4floor.png'
];

let score = 0;
const scoreElement = document.getElementById('score');
const targets = [];

function createTarget() {
    const target = document.createElement('div');
    target.classList.add('target');

    // Randomly select an image for the target
    const randomImage = targetImages[Math.floor(Math.random() * targetImages.length)];
    target.style.backgroundImage = `url(${randomImage})`;

    target.style.left = `${Math.random() * window.innerWidth}px`;
    target.style.top = `${Math.random() * window.innerHeight}px`;
    document.body.appendChild(target);

    target.addEventListener('click', () => {
        score++;
        scoreElement.textContent = `Score: ${score}`;
        target.remove();
        // Remove target from the array
        const index = targets.indexOf(target);
        if (index > -1) targets.splice(index, 1);
    });

    targets.push(target);
}

function spawnTargets() {
    setInterval(() => {
        createTarget();
    }, 2000); // New target every 2 seconds
}

spawnTargets();

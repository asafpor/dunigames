// ============================================
// SUPERMARKET TAG - CORE GAME LOGIC
// ============================================
// משחק תפיסה בסופר מרקט - לוגיקת המשחק העיקרית

// ============================================
// GAME CONSTANTS & VARIABLES
// ============================================

// Game states
const MENU = 0;
const PLAYING = 1;
const GAME_OVER = 2;

// Game variables
let gameState = MENU;
let gameWinner = null; // 'chaser', 'runner', or 'timeout'

// Canvas settings
const CANVAS_WIDTH = 1400;
const CANVAS_HEIGHT = 900;

// Game timing
const GAME_DURATION = 60 * 60; // 60 seconds in frames (60fps)
let gameTimeLeft = GAME_DURATION;

// Player objects
let chaser = {
  x: CANVAS_WIDTH - 100,
  y: CANVAS_HEIGHT / 2,
  size: 40,
  speed: 4.5, // Slightly faster than runner
  velocityX: 0,
  velocityY: 0,
  isMoving: false,
  walkCycle: 0,
  hasCart: false,
  cartTimer: 0
};

let runner = {
  x: 100,
  y: CANVAS_HEIGHT / 2,
  size: 40,
  speed: 4, // Base speed
  velocityX: 0,
  velocityY: 0,
  isMoving: false,
  walkCycle: 0,
  immunityTimer: 0, // Immunity from candy
  hasCart: false,
  cartTimer: 0
};

// Movement physics
const FRICTION = 0.85;
const ACCELERATION = 0.8;

// Candy system
let candies = [];
let candySpawnTimer = 0;
const CANDY_SPAWN_RATE = 300; // 5 seconds between spawns
const CANDY_DURATION = 20 * 60; // 20 seconds in frames
const IMMUNITY_DURATION = 5 * 60; // 5 seconds immunity
const MAX_CANDIES = 3; // Maximum candies on screen

// Shopping carts (for speed boost)
let shoppingCarts = [];

// Collision and shelves system
let shelves = []; // Store shelf collision rectangles

// Audio variables
let walkSound = null;
let candySound = null;
let tagSound = null;
let cartSound = null;
let immunitySound = null;
let currentMusicTrack = 'none';

// ============================================
// P5.JS CORE FUNCTIONS
// ============================================

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  
  // Initialize audio variables
  walkSound = null;
  candySound = null;
  tagSound = null;
  cartSound = null;
  immunitySound = null;
  
  // Initialize shelves for collision detection
  initializeShelves();
  
  // Initialize shopping carts
  initializeShoppingCarts();
  
  console.log("Supermarket Tag game initialized");
}

function draw() {
  drawSupermarketBackground();
  
  if (gameState === MENU) {
    if (currentMusicTrack !== 'supermarket') {
      startSupermarketMusic();
    }
    drawMenu();
  } else if (gameState === PLAYING) {
    if (currentMusicTrack !== 'supermarket') {
      startSupermarketMusic();
    }
    updateGame();
    drawGame();
  } else if (gameState === GAME_OVER) {
    drawGameOver();
  }
}

// ============================================
// GAME INITIALIZATION
// ============================================

function initializeShelves() {
  shelves = [];
  
  // Vertical shelves - match the visual layout from assets file
  let shelfWidth = 30;
  let shelfHeight = 200;
  let aisleWidth = 120;
  
  for (let i = 0; i < 8; i++) {
    let x = 150 + i * (shelfWidth + aisleWidth);
    
    // Top shelf sections
    let topShelfHeight = (i % 2 === 0) ? shelfHeight : shelfHeight * 0.7;
    shelves.push({
      x: x,
      y: 50,
      width: shelfWidth,
      height: topShelfHeight
    });
    
    // Bottom shelf sections
    let bottomShelfHeight = (i % 3 === 0) ? shelfHeight * 0.8 : shelfHeight;
    shelves.push({
      x: x,
      y: CANVAS_HEIGHT - bottomShelfHeight - 50,
      width: shelfWidth,
      height: bottomShelfHeight
    });
  }
  
  // Horizontal shelves
  for (let i = 0; i < 3; i++) {
    let y = 300 + i * 150;
    let x = 80;
    let horizontalShelfLength = 400;
    
    shelves.push({
      x: x,
      y: y,
      width: horizontalShelfLength,
      height: shelfWidth
    });
  }
  
  // Checkout counters as obstacles
  for (let i = 0; i < 5; i++) {
    let x = 200 + i * 100;
    let y = CANVAS_HEIGHT - 100;
    
    shelves.push({
      x: x,
      y: y,
      width: 80,
      height: 25
    });
  }
  
  console.log("Initialized", shelves.length, "shelf collision areas");
}

function initializeShoppingCarts() {
  shoppingCarts = [];
  
  // Place a few carts around the store
  let cartPositions = [
    {x: 120, y: 200},
    {x: 800, y: 400},
    {x: 600, y: 700},
    {x: 1200, y: 300}
  ];
  
  for (let pos of cartPositions) {
    shoppingCarts.push({
      x: pos.x,
      y: pos.y,
      available: true
    });
  }
  
  console.log("Initialized", shoppingCarts.length, "shopping carts");
}

// ============================================
// GAME STATE SCREENS
// ============================================

function drawMenu() {
  // Semi-transparent overlay
  fill(0, 0, 0, 100);
  rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(56);
  fill(255, 100, 50);
  text("🛒 SUPERMARKET TAG 🛒", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 150);
  
  textSize(24);
  fill(255);
  text("משחק תפיסה בסופר מרקט!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 100);
  
  textSize(18);
  fill(255, 255, 100);
  text("התופס (אדום) צריך לתפוס את הנתפס (כחול) תוך 60 שניות", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);
  text("הנתפס יכול לאסוף ממתקים לחסינות של 5 שניות!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 35);
  text("המקש X מאפשר דחיפת עגלה למהירות נוספת!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);
  
  // Controls
  fill(255);
  textSize(20);
  text("בקרים:", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
  
  // Player controls display
  textSize(16);
  fill(255, 100, 100);
  text("תופס (אדום): ↑ ↓ ← → חצים", CANVAS_WIDTH / 2 - 150, CANVAS_HEIGHT / 2 + 65);
  
  fill(100, 150, 255);
  text("נתפס (כחול): W A S D + X לעגלה", CANVAS_WIDTH / 2 + 150, CANVAS_HEIGHT / 2 + 65);
  
  fill(255);
  textSize(20);
  text("לחץ SPACE להתחלה!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 110);
  
  // Back to game selection
  textSize(14);
  fill(150);
  text("לחץ ESC לחזרה לבחירת משחקים", CANVAS_WIDTH / 2, CANVAS_HEIGHT - 30);
}

function drawGame() {
  // Draw candies
  for (let candy of candies) {
    drawCandy(candy);
  }
  
  // Draw players
  drawPlayer(chaser, true); // true = is chaser
  drawPlayer(runner, false); // false = is not chaser
  
  // Draw game UI
  drawGameUI();
  
  // Draw collision debug (only in development)
  if (false) { // Set to true for debugging
    drawCollisionDebug();
  }
}

function drawGameOver() {
  drawWinMessage(gameWinner);
}

// ============================================
// CORE GAME LOGIC
// ============================================

function updateGame() {
  // Update game timer
  gameTimeLeft--;
  
  // Check for time out
  if (gameTimeLeft <= 0) {
    gameWinner = 'timeout';
    gameState = GAME_OVER;
    playTagSound(); // End sound
    return;
  }
  
  // Handle input and movement
  handleInput();
  updatePlayers();
  
  // Update candies
  updateCandies();
  
  // Check collisions
  checkCollisions();
  
  // Update shopping cart timers
  updateShoppingCarts();
}

function handleInput() {
  // Reset movement states
  chaser.isMoving = false;
  runner.isMoving = false;
  
  // Chaser movement (Arrow keys)
  let chaserMoved = false;
  if (keyIsDown(UP_ARROW)) {
    chaser.velocityY -= ACCELERATION;
    chaserMoved = true;
  }
  if (keyIsDown(DOWN_ARROW)) {
    chaser.velocityY += ACCELERATION;
    chaserMoved = true;
  }
  if (keyIsDown(LEFT_ARROW)) {
    chaser.velocityX -= ACCELERATION;
    chaserMoved = true;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    chaser.velocityX += ACCELERATION;
    chaserMoved = true;
  }
  
  if (chaserMoved) {
    chaser.isMoving = true;
    if (frameCount % 10 === 0) { // Play walk sound occasionally
      playWalkSound();
    }
  }
  
  // Runner movement (WASD keys)
  let runnerMoved = false;
  if (keyIsDown(87)) { // W
    runner.velocityY -= ACCELERATION;
    runnerMoved = true;
  }
  if (keyIsDown(83)) { // S
    runner.velocityY += ACCELERATION;
    runnerMoved = true;
  }
  if (keyIsDown(65)) { // A
    runner.velocityX -= ACCELERATION;
    runnerMoved = true;
  }
  if (keyIsDown(68)) { // D
    runner.velocityX += ACCELERATION;
    runnerMoved = true;
  }
  
  // X key for cart push (runner only)
  if (keyIsDown(88) && !runner.hasCart) { // X key
    // Try to grab a nearby cart
    for (let cart of shoppingCarts) {
      if (cart.available) {
        let distance = dist(runner.x, runner.y, cart.x, cart.y);
        if (distance < 50) {
          runner.hasCart = true;
          runner.cartTimer = 3 * 60; // 3 seconds of cart boost
          cart.available = false;
          playCartPushSound();
          console.log("Runner grabbed shopping cart!");
          break;
        }
      }
    }
  }
  
  if (runnerMoved) {
    runner.isMoving = true;
    if (frameCount % 12 === 0) { // Play walk sound occasionally
      playWalkSound();
    }
  }
}

function updatePlayers() {
  // Apply friction
  chaser.velocityX *= FRICTION;
  chaser.velocityY *= FRICTION;
  runner.velocityX *= FRICTION;
  runner.velocityY *= FRICTION;
  
  // Apply speed limits
  let chaserMaxSpeed = chaser.speed;
  if (chaser.hasCart) {
    chaserMaxSpeed *= 1.5; // 50% speed boost with cart
  }
  
  let runnerMaxSpeed = runner.speed;
  if (runner.hasCart) {
    runnerMaxSpeed *= 1.5; // 50% speed boost with cart
  }
  
  // Limit velocities
  chaser.velocityX = constrain(chaser.velocityX, -chaserMaxSpeed, chaserMaxSpeed);
  chaser.velocityY = constrain(chaser.velocityY, -chaserMaxSpeed, chaserMaxSpeed);
  runner.velocityX = constrain(runner.velocityX, -runnerMaxSpeed, runnerMaxSpeed);
  runner.velocityY = constrain(runner.velocityY, -runnerMaxSpeed, runnerMaxSpeed);
  
  // Update positions
  let newChaserX = chaser.x + chaser.velocityX;
  let newChaserY = chaser.y + chaser.velocityY;
  let newRunnerX = runner.x + runner.velocityX;
  let newRunnerY = runner.y + runner.velocityY;
  
  // Check wall boundaries
  newChaserX = constrain(newChaserX, chaser.size/2, CANVAS_WIDTH - chaser.size/2);
  newChaserY = constrain(newChaserY, chaser.size/2, CANVAS_HEIGHT - chaser.size/2);
  newRunnerX = constrain(newRunnerX, runner.size/2, CANVAS_WIDTH - runner.size/2);
  newRunnerY = constrain(newRunnerY, runner.size/2, CANVAS_HEIGHT - runner.size/2);
  
  // Check shelf collisions
  if (!checkShelfCollision(chaser, newChaserX, newChaserY)) {
    chaser.x = newChaserX;
    chaser.y = newChaserY;
  } else {
    // Stop movement if hitting shelf
    chaser.velocityX *= 0.1;
    chaser.velocityY *= 0.1;
  }
  
  if (!checkShelfCollision(runner, newRunnerX, newRunnerY)) {
    runner.x = newRunnerX;
    runner.y = newRunnerY;
  } else {
    // Stop movement if hitting shelf
    runner.velocityX *= 0.1;
    runner.velocityY *= 0.1;
  }
  
  // Update walking animations
  if (chaser.isMoving) {
    chaser.walkCycle += 0.3;
  }
  if (runner.isMoving) {
    runner.walkCycle += 0.3;
  }
  
  // Update immunity timer
  if (runner.immunityTimer > 0) {
    runner.immunityTimer--;
    if (runner.immunityTimer <= 0) {
      console.log("Runner immunity ended");
    }
  }
  
  // Update cart timers
  if (chaser.cartTimer > 0) {
    chaser.cartTimer--;
    if (chaser.cartTimer <= 0) {
      chaser.hasCart = false;
    }
  }
  
  if (runner.cartTimer > 0) {
    runner.cartTimer--;
    if (runner.cartTimer <= 0) {
      runner.hasCart = false;
    }
  }
}

function updateCandies() {
  // Spawn new candies
  candySpawnTimer++;
  if (candySpawnTimer >= CANDY_SPAWN_RATE && candies.length < MAX_CANDIES) {
    spawnCandy();
    candySpawnTimer = 0;
  }
  
  // Update existing candies
  for (let i = candies.length - 1; i >= 0; i--) {
    let candy = candies[i];
    candy.timer--;
    candy.sparkle += 0.1;
    
    // Remove expired candies
    if (candy.timer <= 0 || candy.collected) {
      candies.splice(i, 1);
      console.log("Candy removed (expired or collected)");
    }
  }
}

function updateShoppingCarts() {
  // Make carts available again after some time
  for (let cart of shoppingCarts) {
    if (!cart.available) {
      // Check if any player is still near the cart
      let chaserNear = dist(chaser.x, chaser.y, cart.x, cart.y) < 100 && chaser.hasCart;
      let runnerNear = dist(runner.x, runner.y, cart.x, cart.y) < 100 && runner.hasCart;
      
      if (!chaserNear && !runnerNear) {
        // Make cart available again after players moved away
        cart.available = true;
      }
    }
  }
}

// ============================================
// COLLISION DETECTION
// ============================================

function checkShelfCollision(player, newX, newY) {
  let playerRadius = player.size / 2;
  
  for (let shelf of shelves) {
    // Check if player (circle) intersects with shelf (rectangle)
    let closestX = constrain(newX, shelf.x, shelf.x + shelf.width);
    let closestY = constrain(newY, shelf.y, shelf.y + shelf.height);
    
    let distance = dist(newX, newY, closestX, closestY);
    
    if (distance < playerRadius) {
      return true; // Collision detected
    }
  }
  
  return false; // No collision
}

function checkCollisions() {
  // Check chaser catching runner
  let distance = dist(chaser.x, chaser.y, runner.x, runner.y);
  let catchDistance = (chaser.size + runner.size) / 2 - 5; // Slight overlap needed
  
  if (distance < catchDistance && runner.immunityTimer <= 0) {
    // Runner caught!
    gameWinner = 'chaser';
    gameState = GAME_OVER;
    playTagSound();
    console.log("Runner caught! Chaser wins!");
    return;
  }
  
  // Check runner collecting candies
  for (let i = candies.length - 1; i >= 0; i--) {
    let candy = candies[i];
    if (candy.collected) continue;
    
    let candyDistance = dist(runner.x, runner.y, candy.x, candy.y);
    let collectDistance = (runner.size + candy.size) / 2;
    
    if (candyDistance < collectDistance) {
      // Candy collected!
      candy.collected = true;
      runner.immunityTimer = IMMUNITY_DURATION;
      playCandyCollectSound();
      playImmunitySound();
      console.log("Candy collected! Runner immune for 5 seconds");
      
      // Remove candy immediately
      candies.splice(i, 1);
      break;
    }
  }
}

function drawCollisionDebug() {
  // Debug: Draw shelf collision boxes
  stroke(255, 0, 0);
  strokeWeight(2);
  noFill();
  
  for (let shelf of shelves) {
    rect(shelf.x, shelf.y, shelf.width, shelf.height);
  }
  
  // Debug: Draw player collision circles
  stroke(0, 255, 0);
  ellipse(chaser.x, chaser.y, chaser.size, chaser.size);
  stroke(0, 0, 255);
  ellipse(runner.x, runner.y, runner.size, runner.size);
  
  noStroke();
}

// ============================================
// GAME MANAGEMENT
// ============================================

function resetGame() {
  // Reset game timer
  gameTimeLeft = GAME_DURATION;
  gameWinner = null;
  
  // Reset chaser
  chaser.x = CANVAS_WIDTH - 100;
  chaser.y = CANVAS_HEIGHT / 2;
  chaser.velocityX = 0;
  chaser.velocityY = 0;
  chaser.isMoving = false;
  chaser.walkCycle = 0;
  chaser.hasCart = false;
  chaser.cartTimer = 0;
  
  // Reset runner
  runner.x = 100;
  runner.y = CANVAS_HEIGHT / 2;
  runner.velocityX = 0;
  runner.velocityY = 0;
  runner.isMoving = false;
  runner.walkCycle = 0;
  runner.immunityTimer = 0;
  runner.hasCart = false;
  runner.cartTimer = 0;
  
  // Clear candies
  candies = [];
  candySpawnTimer = 0;
  
  // Reset shopping carts
  for (let cart of shoppingCarts) {
    cart.available = true;
  }
  
  console.log("Game reset");
}

function checkWinConditions() {
  // Check if runner survived the full time
  if (gameTimeLeft <= 0 && gameState === PLAYING) {
    gameWinner = 'runner';
    gameState = GAME_OVER;
    console.log("Time up! Runner wins!");
  }
}

// ============================================
// INPUT HANDLING
// ============================================

function keyPressed() {
  // Initialize audio on first interaction
  initializeSupermarketAudio();
  
  if (gameState === MENU) {
    if (key === ' ') {
      gameState = PLAYING;
      resetGame();
      console.log("Game started!");
    }
  }
  
  if (gameState === GAME_OVER) {
    if (key === ' ') {
      gameState = PLAYING;
      resetGame();
      console.log("Game restarted!");
    } else if (keyCode === ESCAPE) {
      // Go back to game selection
      window.location.href = 'gameSelector.html';
    }
  }
  
  if (keyCode === ESCAPE) {
    if (gameState === MENU) {
      // Go back to game selection
      window.location.href = 'gameSelector.html';
    } else if (gameState === PLAYING) {
      gameState = MENU;
      stopSupermarketMusic();
      console.log("Returned to menu");
    }
  }
}

function mousePressed() {
  // Initialize audio on first interaction
  initializeSupermarketAudio();
  
  if (gameState === MENU) {
    gameState = PLAYING;
    resetGame();
    console.log("Game started with mouse!");
  } else if (gameState === GAME_OVER) {
    gameState = PLAYING;
    resetGame();
    console.log("Game restarted with mouse!");
  }
}

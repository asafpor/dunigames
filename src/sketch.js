// ============================================
// PIXEL ESCAPE - CORE GAME LOGIC
// ============================================
// This file contains the main game mechanics, 
// state management, and p5.js core functions.

// ============================================
// GAME CONSTANTS & VARIABLES
// ============================================

// Game states
const MENU = 0;
const PLAYING = 1;
const GAME_OVER = 2;

// Game variables
let gameState = MENU;
let gameMode = 1; // 1 or 2 player mode
let score = 0;
let highScore = 0;

// Canvas settings
const CANVAS_WIDTH = 1400;
const CANVAS_HEIGHT = 900;

// Player object
let player = {
  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT - 40,
  size: 30,
  speed: 5,
  velocityY: 0,
  onGround: true,
  groundY: CANVAS_HEIGHT - 40,
  rotation: 0,
  lives: 3,
  sizeMultiplier: 1.0,
  sizeTimer: 0,
  invincible: false
};

// Player 2 object (red smiley)
let player2 = {
  x: CANVAS_WIDTH * 2/3,
  y: CANVAS_HEIGHT - 40,
  size: 30,
  speed: 5,
  velocityY: 0,
  onGround: true,
  groundY: CANVAS_HEIGHT - 40,
  rotation: 0,
  lives: 3,
  sizeMultiplier: 1.0,
  sizeTimer: 0,
  invincible: false
};

// Physics constants
const GRAVITY = 0.8;
const JUMP_POWER = -15;
const GROUND_Y = CANVAS_HEIGHT - 40;

// Obstacles
let obstacles = [];
let obstacleSpawnTimer = 0;
let obstacleSpeed = 2;
let spawnRate = 60; // frames between spawns
const MAX_OBSTACLES = 15; // Limit obstacles on screen

// Sharks
let sharks = [];
let sharkSpawnTimer = 0;
let sharkSpawnRate = 240; // frames between shark spawns
const SHARK_WARNING_TIME = 120; // frames to show warning before shark appears
const SHARK_SPEED = 2; // horizontal swimming speed
const SHARK_SIZE = 60; // shark size
const MAX_SHARKS = 3; // Limit shark schools on screen (each school = 5 sharks)

// Stars
let stars = [];
let starSpawnTimer = 0;
let starSpawnRate = 240; // frames between star spawns (less frequent than rocks)
const STAR_FALL_SPEED = 1.5; // slower than rocks
const STAR_SIZE = 30;
const STAR_POINTS_VALUE = 10;
const MAX_STARS = 8; // Limit stars on screen

// Hearts
let hearts = [];
let heartSpawnTimer = 0;
let heartSpawnRate = 960; // frames between heart spawns (much rarer than stars)
const HEART_FALL_SPEED = 1.2; // slower than stars
const HEART_SIZE = 30;
const MAX_LIVES = 5; // Maximum lives a player can have
const MAX_HEARTS = 3; // Limit hearts on screen

// Hotdogs
let hotdogs = [];
let hotdogSpawnTimer = 0;
let hotdogSpawnRate = 600; // frames between hotdog spawns (every 10 seconds - much more frequent for testing)
const HOTDOG_FALL_SPEED = 1.0; // similar to hearts
const HOTDOG_SIZE = 35;
const SIZE_MULTIPLIER = 6.0; // 500% bigger = 6x original size
const SIZE_DURATION = 300; // 5 seconds at 60fps
const MAX_HOTDOGS = 2; // Limit hotdogs on screen

// Clouds
let clouds = [];
let cloudSpawnTimer = 0;
let cloudSpawnRate = 180; // frames between cloud spawns
const CLOUD_SPEED = 0.5; // slow moving clouds
const MAX_CLOUDS = 10; // Limit clouds on screen

// Fishes
let fishes = [];
let fishSpawnTimer = 0;
let fishSpawnRate = 200; // frames between fish spawns
const FISH_SPEED = 1.0; // swimming speed
const MAX_FISHES = 8; // Limit fishes on screen

// Audio
let musicSystem;
let jumpSound;
let starSound;
let gameOverSound;
let currentMusicTrack = 'none';

// Difficulty settings
let difficultyTimer = 0;
const DIFFICULTY_INCREASE_INTERVAL = 300; // frames
const MAX_OBSTACLE_SPEED = 8;
const MIN_SPAWN_RATE = 20;

// Background static elements (to prevent shakiness)
let backgroundGenerated = false;
let mountainPoints = { back: [], middle: [], front: [] };
let grassBlades = [];
let backgroundFlowers = [];
let backgroundSeaweed = [];
let backgroundCoral = [];

// ============================================
// P5.JS CORE FUNCTIONS
// ============================================

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  
  // Initialize audio variables as null - will be created on first user interaction
  jumpSound = null;
  starSound = null;
  gameOverSound = null;
  
  // Load high score from localStorage
  highScore = localStorage.getItem('pixelEscapeHighScore') || 0;
}

function draw() {
  drawSkyBackground();
  
  if (gameState === MENU) {
    // Start menu music if not already playing
    if (currentMusicTrack !== 'menu') {
      startMusicTrack('menu');
    }
    drawMenu();
  } else if (gameState === PLAYING) {
    updateGame();
    drawGame();
    // Update music based on gameplay intensity
    updateMusicForGameplay();
  } else if (gameState === GAME_OVER) {
    // Start game over music if not already playing
    if (currentMusicTrack !== 'gameOver') {
      startMusicTrack('gameOver');
    }
    drawGameOver();
  }
}

// ============================================
// GAME STATE SCREENS
// ============================================

function drawMenu() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("PIXEL ESCAPE", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 150);
  
  textSize(24);
  text("Dodge rocks and jump over walls!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 100);
  
  textSize(16);
  fill(255, 255, 0);
  text("Collect falling stars for +10 points!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 75);
  
  // Game mode selection
  fill(255);
  textSize(20);
  text("Choose Game Mode:", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 35);
  
  // Highlight selected mode
  if (gameMode === 1) {
    fill(255, 255, 0);
    textSize(18);
    text(">>> 1 PLAYER <<<", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 5);
    fill(255);
    text("2 PLAYER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
  } else {
    fill(255);
    textSize(18);
    text("1 PLAYER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 5);
    fill(255, 255, 0);
    text(">>> 2 PLAYER <<<", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
  }
  
  // Controls
  fill(255);
  textSize(16);
  text("Press 1 or 2 to select mode", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
  
  if (gameMode === 1) {
    text("Player 1: ← → ↑ arrows", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 75);
  } else {
    text("Player 1: ← → ↑ arrows  |  Player 2: A D W keys", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 75);
  }
  
  text("Press SPACE to start", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100);
  
  if (highScore > 0) {
    textSize(14);
    text(`High Score: ${highScore}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 135);
  }
}

function drawGame() {
  // Draw score
  fill(255);
  textAlign(LEFT, TOP);
  textSize(20);
  text(`Score: ${Math.floor(score / 10)}`, 20, 20);
  
  // Draw lives
  textSize(18);
  if (gameMode === 1) {
    // Single player lives display
    let heartsP1 = '♥'.repeat(player.lives) + '♡'.repeat(Math.max(0, MAX_LIVES - player.lives));
    text(`Lives: ${heartsP1}`, 20, 50);
  } else {
    // Two player lives display
    let heartsP1 = '♥'.repeat(player.lives) + '♡'.repeat(Math.max(0, MAX_LIVES - player.lives));
    let heartsP2 = '♥'.repeat(player2.lives) + '♡'.repeat(Math.max(0, MAX_LIVES - player2.lives));
    fill(255, 215, 0); // Yellow for player 1
    text(`P1: ${heartsP1}`, 20, 50);
    fill(255, 50, 50); // Red for player 2
    text(`P2: ${heartsP2}`, 20, 75);
    fill(255); // Reset to white
  }
  
  // Draw shark warnings and sharks
  for (let shark of sharks) {
    if (shark.state === 'warning') {
      drawSharkWarning(shark);
    } else if (shark.state === 'attacking') {
      drawShark(shark);
    }
  }
  
  // Draw stars
  for (let star of stars) {
    drawStar(star);
  }
  
  // Draw hearts
  for (let heart of hearts) {
    drawHeart(heart);
  }
  
  // Draw hotdogs
  for (let hotdog of hotdogs) {
    drawHotdog(hotdog);
  }
  
  // Draw player
  drawPlayer();
  
  // Draw obstacles
  fill(255);
  for (let obstacle of obstacles) {
    drawRock(obstacle.x, obstacle.y, obstacle.size, obstacle.shape);
  }
}

function drawGameOver() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 100);
  
  textSize(24);
  let finalScore = Math.floor(score / 10);
  text(`Final Score: ${finalScore}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
  
  if (finalScore > highScore) {
    textSize(20);
    fill(255, 255, 0);
    text("NEW HIGH SCORE!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);
    fill(255);
  }
  
  textSize(18);
  text("Press SPACE to restart", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
  text("Press ESC for menu", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);
}

// ============================================
// CORE GAME LOGIC
// ============================================

function updateGame() {
  // Handle Player 1 jumping
  if (keyIsDown(UP_ARROW) && player.onGround) {
    player.velocityY = JUMP_POWER;
    player.onGround = false;
    // Play jump sound
    playSound(jumpSound, 0.1, 0.1);
  }
  
  // Handle Player 2 jumping (if in 2-player mode)
  if (gameMode === 2 && keyIsDown(87) && player2.onGround) { // W key
    player2.velocityY = JUMP_POWER;
    player2.onGround = false;
    // Play jump sound
    playSound(jumpSound, 0.1, 0.1);
  }
  
  // Apply physics to Player 1
  player.velocityY += GRAVITY;
  player.y += player.velocityY;
  
  // Update player 1 rotation while jumping
  if (!player.onGround) {
    player.rotation += 0.2; // Spin while in air
  } else {
    // Gradually return to upright when on ground
    player.rotation *= 0.8;
    if (abs(player.rotation) < 0.1) {
      player.rotation = 0;
    }
  }
  
  // Ground collision for Player 1
  if (player.y >= GROUND_Y) {
    player.y = GROUND_Y;
    player.velocityY = 0;
    player.onGround = true;
  }
  
  // Update Player 1 horizontal position
  if (keyIsDown(LEFT_ARROW) && player.x > player.size / 2) {
    player.x -= player.speed;
  }
  if (keyIsDown(RIGHT_ARROW) && player.x < CANVAS_WIDTH - player.size / 2) {
    player.x += player.speed;
  }
  
  // Player 2 physics (if in 2-player mode)
  if (gameMode === 2) {
    // Apply physics to Player 2
    player2.velocityY += GRAVITY;
    player2.y += player2.velocityY;
    
    // Update player 2 rotation while jumping
    if (!player2.onGround) {
      player2.rotation += 0.2; // Spin while in air
    } else {
      // Gradually return to upright when on ground
      player2.rotation *= 0.8;
      if (abs(player2.rotation) < 0.1) {
        player2.rotation = 0;
      }
    }
    
    // Ground collision for Player 2
    if (player2.y >= GROUND_Y) {
      player2.y = GROUND_Y;
      player2.velocityY = 0;
      player2.onGround = true;
    }
    
    // Update Player 2 horizontal position (WASD controls)
    if (keyIsDown(65) && player2.x > player2.size / 2) { // A key
      player2.x -= player2.speed;
    }
    if (keyIsDown(68) && player2.x < CANVAS_WIDTH - player2.size / 2) { // D key
      player2.x += player2.speed;
    }
  }
  
  // Spawn and update game objects
  updateGameObjects();
  
  // Check all collisions
  checkAllCollisions();
  
  // Update score and difficulty
  score++;
  difficultyTimer++;
  
  if (difficultyTimer >= DIFFICULTY_INCREASE_INTERVAL) {
    increaseDifficulty();
    difficultyTimer = 0;
  }
}

function updateGameObjects() {
  // Spawn obstacles
  obstacleSpawnTimer++;
  if (obstacleSpawnTimer >= spawnRate) {
    try {
      spawnObstacle();
      obstacleSpawnTimer = 0;
      console.log("Obstacle spawned at frame", frameCount, "obstacles:", obstacles.length);
    } catch (error) {
      console.error("Error spawning obstacle:", error);
    }
  }
  
  // Spawn sharks
  sharkSpawnTimer++;
  if (sharkSpawnTimer >= sharkSpawnRate) {
    spawnShark();
    sharkSpawnTimer = 0;
  }
  
  // Spawn stars
  starSpawnTimer++;
  if (starSpawnTimer >= starSpawnRate) {
    spawnStar();
    starSpawnTimer = 0;
  }
  
  // Spawn hearts
  heartSpawnTimer++;
  if (heartSpawnTimer >= heartSpawnRate) {
    spawnHeart();
    heartSpawnTimer = 0;
  }
  
  // Spawn hotdogs
  hotdogSpawnTimer++;
  if (hotdogSpawnTimer >= hotdogSpawnRate) {
    spawnHotdog();
    hotdogSpawnTimer = 0;
  }
  
  // Spawn clouds
  cloudSpawnTimer++;
  if (cloudSpawnTimer >= cloudSpawnRate) {
    spawnCloud();
    cloudSpawnTimer = 0;
  }
  
  // Spawn fishes
  fishSpawnTimer++;
  if (fishSpawnTimer >= fishSpawnRate) {
    spawnFish();
    fishSpawnTimer = 0;
  }
  
  // Update clouds
  for (let i = clouds.length - 1; i >= 0; i--) {
    if (clouds[i]) {
      clouds[i].x += clouds[i].speed;
      
      // Remove clouds that are off screen
      if (clouds[i].x > CANVAS_WIDTH + 100) {
        clouds.splice(i, 1);
      }
    }
  }
  
  // Update fishes
  for (let i = fishes.length - 1; i >= 0; i--) {
    if (fishes[i]) {
      fishes[i].x += fishes[i].speed;
      fishes[i].swimOffset += 0.1; // For swimming animation
      
      // Remove fishes that are off screen
      if (fishes[i].x > CANVAS_WIDTH + 100) {
        fishes.splice(i, 1);
      }
    }
  }
  
  // Update obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    if (obstacles[i]) {
      obstacles[i].y += obstacleSpeed;
      
      // Remove obstacles that are off screen
      if (obstacles[i].y > CANVAS_HEIGHT + 50) {
        obstacles.splice(i, 1);
      }
    }
  }
  
  // Update stars
  for (let i = stars.length - 1; i >= 0; i--) {
    if (stars[i]) {
      stars[i].y += STAR_FALL_SPEED;
      stars[i].rotation += 0.05; // Add rotation for visual effect
      
      // Remove stars that are off screen
      if (stars[i].y > CANVAS_HEIGHT + 50) {
        stars.splice(i, 1);
      }
    }
  }
  
  // Update hearts
  for (let i = hearts.length - 1; i >= 0; i--) {
    if (hearts[i]) {
      hearts[i].y += HEART_FALL_SPEED;
      hearts[i].pulse += 0.1; // Add pulsing animation
      
      // Remove hearts that are off screen
      if (hearts[i].y > CANVAS_HEIGHT + 50) {
        hearts.splice(i, 1);
      }
    }
  }
  
  // Update hotdogs
  for (let i = hotdogs.length - 1; i >= 0; i--) {
    if (hotdogs[i]) {
      hotdogs[i].y += HOTDOG_FALL_SPEED;
      hotdogs[i].rotation += 0.02; // Slow rotation as they fall
      
      // Remove hotdogs that are off screen
      if (hotdogs[i].y > CANVAS_HEIGHT + 50) {
        hotdogs.splice(i, 1);
      }
    }
  }
  
  // Update player size timers
  if (player.sizeTimer > 0) {
    player.sizeTimer--;
    if (player.sizeTimer <= 0) {
      player.sizeMultiplier = 1.0;
      player.invincible = false;
      console.log("Player 1 size effect and invincibility ended");
    }
  }
  
  if (gameMode === 2 && player2.sizeTimer > 0) {
    player2.sizeTimer--;
    if (player2.sizeTimer <= 0) {
      player2.sizeMultiplier = 1.0;
      player2.invincible = false;
      console.log("Player 2 size effect and invincibility ended");
    }
  }
  
  // Update sharks
  for (let i = sharks.length - 1; i >= 0; i--) {
    let shark = sharks[i];
    if (shark) {
      updateShark(shark);
      
      // Remove expired sharks (2-second attack timer) or sharks that swam off screen
      if (shark.state === 'expired' || shark.y < -shark.size) {
        sharks.splice(i, 1);
      }
    }
  }
}

function checkAllCollisions() {
  // Check rock collisions for Player 1
  for (let obstacle of obstacles) {
    if (obstacle && obstacle.y > 0) {
      if (checkCollision(player, obstacle)) {
        if (!player.invincible) {
          console.log("Player 1 rock collision detected!");
          playerHit(player, 1);
          return;
        } else {
          console.log("Player 1 hit rock but is invincible!");
        }
      }
      // Check Player 2 collisions if in 2-player mode
      if (gameMode === 2 && checkCollision(player2, obstacle)) {
        if (!player2.invincible) {
          console.log("Player 2 rock collision detected!");
          playerHit(player2, 2);
          return;
        } else {
          console.log("Player 2 hit rock but is invincible!");
        }
      }
    }
  }
  
  // Check shark collisions for Player 1
  for (let shark of sharks) {
    if (shark && shark.state === 'attacking') {
      if (checkSharkCollision(player, shark)) {
        if (!player.invincible) {
          console.log("Player 1 eaten by shark!");
          playerHit(player, 1);
          return;
        } else {
          console.log("Player 1 hit shark but is invincible!");
        }
      }
      // Check Player 2 collisions if in 2-player mode
      if (gameMode === 2 && checkSharkCollision(player2, shark)) {
        if (!player2.invincible) {
          console.log("Player 2 eaten by shark!");
          playerHit(player2, 2);
          return;
        } else {
          console.log("Player 2 hit shark but is invincible!");
        }
      }
    }
  }
  
  // Check star collisions (collection) for Player 1
  for (let i = stars.length - 1; i >= 0; i--) {
    let star = stars[i];
    if (star && checkStarCollision(player, star)) {
      // Add points and remove star
      score += STAR_POINTS_VALUE * 10; // Multiply by 10 to match score system
      stars.splice(i, 1);
      console.log("Player 1 collected star! +10 points");
      // Play star collection sound
      playSound(starSound, 0.15, 0.2);
      continue; // Skip to next star since this one was collected
    }
    // Check Player 2 star collection if in 2-player mode
    if (gameMode === 2 && star && checkStarCollision(player2, star)) {
      // Add points and remove star
      score += STAR_POINTS_VALUE * 10; // Multiply by 10 to match score system
      stars.splice(i, 1);
      console.log("Player 2 collected star! +10 points");
      // Play star collection sound
      playSound(starSound, 0.15, 0.2);
    }
  }
  
  // Check heart collisions (collection) for Player 1
  for (let i = hearts.length - 1; i >= 0; i--) {
    let heart = hearts[i];
    if (heart && checkHeartCollision(player, heart)) {
      // Add life (up to maximum)
      if (player.lives < MAX_LIVES) {
        player.lives++;
        console.log(`Player 1 collected heart! Lives: ${player.lives}`);
        // Play special heart collection sound (higher pitched star sound)
        playSound(starSound, 0.2, 0.3);
      }
      hearts.splice(i, 1);
      continue; // Skip to next heart since this one was collected
    }
    // Check Player 2 heart collection if in 2-player mode
    if (gameMode === 2 && heart && checkHeartCollision(player2, heart)) {
      // Add life (up to maximum)
      if (player2.lives < MAX_LIVES) {
        player2.lives++;
        console.log(`Player 2 collected heart! Lives: ${player2.lives}`);
        // Play special heart collection sound (higher pitched star sound)
        playSound(starSound, 0.2, 0.3);
      }
      hearts.splice(i, 1);
    }
  }
  
  // Check hotdog collisions (collection) for Player 1
  for (let i = hotdogs.length - 1; i >= 0; i--) {
    let hotdog = hotdogs[i];
    if (hotdog && checkHotdogCollision(player, hotdog)) {
      // Activate size power-up and invincibility
      player.sizeMultiplier = SIZE_MULTIPLIER;
      player.sizeTimer = SIZE_DURATION;
      player.invincible = true;
      hotdogs.splice(i, 1);
      console.log(`Player 1 collected hotdog! Now giant and invincible for 5 seconds!`);
      // Play special power-up sound (deep bass tone)
      playSound(gameOverSound, 0.3, 0.5); // Use game over sound for power-up effect
      continue; // Skip to next hotdog since this one was collected
    }
    // Check Player 2 hotdog collection if in 2-player mode
    if (gameMode === 2 && hotdog && checkHotdogCollision(player2, hotdog)) {
      // Activate size power-up and invincibility
      player2.sizeMultiplier = SIZE_MULTIPLIER;
      player2.sizeTimer = SIZE_DURATION;
      player2.invincible = true;
      hotdogs.splice(i, 1);
      console.log(`Player 2 collected hotdog! Now giant and invincible for 5 seconds!`);
      // Play special power-up sound (deep bass tone)
      playSound(gameOverSound, 0.3, 0.5); // Use game over sound for power-up effect
    }
  }
}

// ============================================
// WALL SYSTEM LOGIC
// ============================================

function updateWall(wall) {
  wall.timer++;
  
  if (wall.state === 'warning') {
    if (wall.timer >= WALL_WARNING_TIME) {
      wall.state = 'rising';
      wall.timer = 0;
    }
  } else if (wall.state === 'rising') {
    wall.currentHeight += WALL_RISE_SPEED;
    if (wall.currentHeight >= wall.targetHeight) {
      wall.currentHeight = wall.targetHeight;
      wall.state = 'staying';
      wall.timer = 0;
    }
  } else if (wall.state === 'staying') {
    if (wall.timer >= WALL_STAY_TIME) {
      wall.state = 'falling';
      wall.timer = 0;
    }
  } else if (wall.state === 'falling') {
    wall.currentHeight -= WALL_FALL_SPEED;
    if (wall.currentHeight <= 0) {
      wall.currentHeight = 0;
    }
  }
}

// ============================================
// DIFFICULTY & GAME MECHANICS
// ============================================

function increaseDifficulty() {
  if (obstacleSpeed < MAX_OBSTACLE_SPEED) {
    obstacleSpeed += 0.3;
  }
  
  if (spawnRate > MIN_SPAWN_RATE) {
    spawnRate -= 3;
  }
}

function playerHit(playerObj, playerNumber) {
  // Reduce lives
  playerObj.lives--;
  console.log(`Player ${playerNumber} hit! Lives remaining: ${playerObj.lives}`);
  
  // Check if game should end (cooperative - any player runs out of lives)
  if (playerObj.lives <= 0) {
    console.log(`Player ${playerNumber} is out of lives! Game Over!`);
    gameOver();
    return;
  }
  
  // Respawn player at starting position
  respawnPlayer(playerObj, playerNumber);
  
  // Play different sound for life loss (not as dramatic as game over)
  playSound(jumpSound, 0.3, 0.3); // Use jump sound with higher volume
}

function respawnPlayer(playerObj, playerNumber) {
  // Reset player position
  if (gameMode === 1 || playerNumber === 1) {
    playerObj.x = gameMode === 1 ? CANVAS_WIDTH / 2 : CANVAS_WIDTH / 3;
  } else {
    playerObj.x = CANVAS_WIDTH * 2/3;
  }
  
  playerObj.y = GROUND_Y;
  playerObj.velocityY = 0;
  playerObj.onGround = true;
  playerObj.rotation = 0;
  
  console.log(`Player ${playerNumber} respawned!`);
}

function gameOver() {
  gameState = GAME_OVER;
  
  // Music will automatically switch to game over track in draw()
  
  // Play game over sound
  playSound(gameOverSound, 0.2, 0.5);
  
  // Update high score
  let finalScore = Math.floor(score / 10);
  if (finalScore > highScore) {
    highScore = finalScore;
    localStorage.setItem('pixelEscapeHighScore', highScore);
  }
}

function resetGame() {
  score = 0;
  obstacles = [];
  obstacleSpawnTimer = 0;
  obstacleSpeed = 2;
  spawnRate = 60;
  difficultyTimer = 0;
  sharks = [];
  sharkSpawnTimer = 0;
  stars = [];
  starSpawnTimer = 0;
  hearts = [];
  heartSpawnTimer = 0;
  hotdogs = [];
  hotdogSpawnTimer = 0;
  clouds = [];
  cloudSpawnTimer = 0;
  fishes = [];
  fishSpawnTimer = 0;
  
  // Reset Player 1 position and lives
  if (gameMode === 1) {
    player.x = CANVAS_WIDTH / 2;
  } else {
    player.x = CANVAS_WIDTH / 3; // Left side for 2-player mode
  }
  player.y = GROUND_Y;
  player.velocityY = 0;
  player.onGround = true;
  player.rotation = 0;
  player.lives = 3; // Reset lives to 3
  player.sizeMultiplier = 1.0; // Reset size to normal
  player.sizeTimer = 0; // Reset size timer
  
  // Reset Player 2 position and lives (if in 2-player mode)
  if (gameMode === 2) {
    player2.x = CANVAS_WIDTH * 2/3; // Right side for 2-player mode
    player2.y = GROUND_Y;
    player2.velocityY = 0;
    player2.onGround = true;
    player2.rotation = 0;
    player2.lives = 3; // Reset lives to 3
    player2.sizeMultiplier = 1.0; // Reset size to normal
    player2.sizeTimer = 0; // Reset size timer
  }
}

// ============================================
// INPUT HANDLING
// ============================================

function keyPressed() {
  // Initialize audio on first user interaction (browser requirement)
  initializeAudio();
  
  // Menu controls
  if (gameState === MENU) {
    if (key === '1') {
      gameMode = 1;
    } else if (key === '2') {
      gameMode = 2;
    } else if (key === ' ') {
      gameState = PLAYING;
      resetGame();
      // Music will automatically start in draw() when game state changes
    }
  }
  
  if (key === ' ') {
    if (gameState === GAME_OVER) {
      gameState = PLAYING;
      resetGame();
      // Music will automatically start in draw() when game state changes
    }
  }
  
  if (keyCode === ESCAPE && gameState === GAME_OVER) {
    gameState = MENU;
    // Music will automatically switch to menu track in draw()
  }
}

function mousePressed() {
  // Initialize audio on first user interaction (browser requirement)
  initializeAudio();
  
  if (gameState === MENU) {
    gameState = PLAYING;
    resetGame();
    // Music will automatically start in draw() when game state changes
  } else if (gameState === GAME_OVER) {
    gameState = PLAYING;
    resetGame();
    // Music will automatically start in draw() when game state changes
  }
}

// ============================================
// SPACE RUNNER - CORE GAME LOGIC
// ============================================
// תנועה אופקי משמאל לימין במהירות במרחב

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

// Player spaceship object
let spaceship1 = {
  x: 100, // Start from left side
  y: CANVAS_HEIGHT / 2,
  size: 40,
  speed: 4,
  velocityY: 0,
  velocityX: 0, // Horizontal movement velocity
  verticalSpeed: 6, // Up/down movement speed
  horizontalSpeed: 6, // Left/right movement speed
  rotation: 0,
  lives: 3,
  shieldActive: false,
  shieldTimer: 0,
  thrusterOffset: 0 // For engine animation
};

// Player 2 spaceship (red)
let spaceship2 = {
  x: 100,
  y: CANVAS_HEIGHT / 2 + 100,
  size: 40,
  speed: 4,
  velocityY: 0,
  velocityX: 0, // Horizontal movement velocity
  verticalSpeed: 6,
  horizontalSpeed: 6, // Left/right movement speed
  rotation: 0,
  lives: 3,
  shieldActive: false,
  shieldTimer: 0,
  thrusterOffset: 0
};

// Physics constants
const SPACE_FRICTION = 0.95; // Space has some resistance
const MAX_VERTICAL_SPEED = 8;
const MAX_HORIZONTAL_SPEED = 6; // Maximum left/right speed

// Obstacles (asteroids, lasers, etc.)
let obstacles = [];
let obstacleSpawnTimer = 0;
let obstacleSpeed = 4; // Faster horizontal speed (right to left)
let spawnRate = 60; // More frequent spawns (was 90)
const MAX_OBSTACLES = 35; // More obstacles on screen

// Stars to collect
let spaceStars = [];
let starSpawnTimer = 0;
let starSpawnRate = 150; // frames between star spawns
const STAR_SIZE = 25;
const STAR_POINTS_VALUE = 10;
const MAX_SPACE_STARS = 12;

// Power-ups
let powerUps = [];
let powerUpSpawnTimer = 0;
let powerUpSpawnRate = 480; // frames between power-up spawns (8 seconds)
const POWER_UP_SIZE = 30;
const SHIELD_DURATION = 300; // 5 seconds at 60fps
const MAX_POWER_UPS = 3;

// Hearts (life collectibles)
let hearts = [];
let heartSpawnTimer = 0;
let heartSpawnRate = 900; // frames between heart spawns (15 seconds - rare)
const HEART_SIZE = 28;
const MAX_HEARTS = 4;
const MAX_SHIP_LIVES = 5; // Maximum lives a ship can have

// Bullets (player projectiles)
let bullets = [];
const BULLET_SPEED = 12;
const BULLET_SIZE = 8;
const MAX_BULLETS = 20;

// Monsters (shootable enemies)
let monsters = [];
let monsterSpawnTimer = 0;
let monsterSpawnRate = 120; // frames between monster spawns
const MAX_MONSTERS = 15;

// Background elements
let backgroundStars = [];
let nebulas = [];
let planets = [];
let backgroundGenerated = false;

// Audio system
let spaceMusic;
let thrusterSound;
let collectSound;
let explosionSound;
let powerUpSound;
let currentMusicTrack = 'none';

// Difficulty settings
let difficultyTimer = 0;
const DIFFICULTY_INCREASE_INTERVAL = 600; // 10 seconds
const MAX_OBSTACLE_SPEED = 7;
const MIN_SPAWN_RATE = 30;

// Game progression
let gameSpeed = 1; // Overall game speed multiplier
let distanceTraveled = 0; // How far we've gone

// ============================================
// P5.JS CORE FUNCTIONS
// ============================================

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  
  // Initialize audio variables
  thrusterSound = null;
  collectSound = null;
  explosionSound = null;
  powerUpSound = null;
  
  // Load high score
  highScore = localStorage.getItem('spaceRunnerHighScore') || 0;
}

function draw() {
  drawSpaceBackground();
  
  if (gameState === MENU) {
    if (currentMusicTrack !== 'menu') {
      startRetroTrack('menu');
      currentMusicTrack = 'menu';
    }
    drawMenu();
  } else if (gameState === PLAYING) {
    updateGame();
    drawGame();
    if (currentMusicTrack !== 'gameplay') {
      startRetroTrack('gameplay');
      currentMusicTrack = 'gameplay';
    }
  } else if (gameState === GAME_OVER) {
    if (currentMusicTrack !== 'gameOver') {
      startRetroTrack('gameOver');
      currentMusicTrack = 'gameOver';
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
  textSize(64);
  fill(100, 200, 255); // Cyan color
  text("🚀 SPACE RUNNER 🚀", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 200);
  
  textSize(28);
  fill(255);
  text("Race through space and collect stars!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 140);
  
  textSize(18);
  fill(255, 255, 100);
  text("⭐ Collect stars for points! ♥ Get hearts for extra lives! 🛡️ Get shields for protection!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 110);
  
  // Game mode selection
  fill(255);
  textSize(24);
  text("Choose Players:", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 70);
  
  if (gameMode === 1) {
    fill(100, 200, 255);
    textSize(20);
    text(">>> 1 PILOT <<<", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
    fill(255);
    text("2 PILOTS", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 15);
  } else {
    fill(255);
    textSize(20);
    text("1 PILOT", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
    fill(100, 200, 255);
    text(">>> 2 PILOTS <<<", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 15);
  }
  
  // Controls
  fill(255);
  textSize(18);
  text("Press 1 or 2 to select pilots", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
  
  if (gameMode === 1) {
    text("Pilot 1: ↑ ↓ ← → arrows for full flight control", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
  } else {
    text("Pilot 1: ↑ ↓ ← → arrows  |  Pilot 2: W S A D keys", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
  }
  
  text("Press SPACE to launch!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 80);
  
  if (highScore > 0) {
    textSize(16);
    fill(255, 255, 100);
    text(`Best Distance: ${highScore} km`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 120);
  }
  
  // Back to menu option
  textSize(14);
  fill(150);
  text("Press ESC to return to game selection", CANVAS_WIDTH / 2, CANVAS_HEIGHT - 40);
}

function drawGame() {
  // Draw distance/score
  fill(100, 200, 255);
  textAlign(LEFT, TOP);
  textSize(24);
  text(`Distance: ${Math.floor(distanceTraveled / 10)} km`, 20, 20);
  text(`Score: ${score}`, 20, 50);
  
  // Draw lives
  textSize(20);
  if (gameMode === 1) {
    let hearts = '❤️'.repeat(spaceship1.lives) + '🖤'.repeat(Math.max(0, 3 - spaceship1.lives));
    text(`Pilot 1: ${hearts}`, 20, 85);
  } else {
    let hearts1 = '❤️'.repeat(spaceship1.lives) + '🖤'.repeat(Math.max(0, 3 - spaceship1.lives));
    let hearts2 = '❤️'.repeat(spaceship2.lives) + '🖤'.repeat(Math.max(0, 3 - spaceship2.lives));
    fill(100, 200, 255);
    text(`Pilot 1: ${hearts1}`, 20, 85);
    fill(255, 100, 100);
    text(`Pilot 2: ${hearts2}`, 20, 115);
  }
  
  // Draw spaceships
  drawSpaceship(spaceship1, color(100, 200, 255)); // Cyan spaceship
  if (gameMode === 2) {
    drawSpaceship(spaceship2, color(255, 100, 100)); // Red spaceship
  }
  
  // Draw all space objects
  for (let star of spaceStars) {
    drawSpaceStar(star);
  }
  
  for (let obstacle of obstacles) {
    drawObstacle(obstacle);
  }
  
  for (let powerUp of powerUps) {
    drawPowerUp(powerUp);
  }
  
  // Draw hearts
  for (let heart of hearts) {
    drawHeart(heart);
  }
  
  // Draw bullets
  for (let bullet of bullets) {
    drawBullet(bullet);
  }
  
  // Draw monsters
  for (let monster of monsters) {
    drawMonster(monster);
  }
  
  // Draw speed indicator
  fill(255, 255, 100);
  textAlign(RIGHT, TOP);
  textSize(18);
  text(`Speed: ${(obstacleSpeed * gameSpeed).toFixed(1)}x`, CANVAS_WIDTH - 20, 20);
}

function drawGameOver() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(56);
  fill(255, 100, 100);
  text("💥 MISSION FAILED 💥", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 120);
  
  textSize(28);
  fill(255);
  let finalDistance = Math.floor(distanceTraveled / 10);
  text(`Distance Traveled: ${finalDistance} km`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);
  text(`Final Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);
  
  if (finalDistance > highScore) {
    textSize(24);
    fill(255, 255, 100);
    text("🏆 NEW DISTANCE RECORD! 🏆", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
  }
  
  textSize(20);
  fill(255);
  text("Press SPACE to try again", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
  text("Press ESC for game selection", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 90);
}

// ============================================
// CORE GAME LOGIC
// ============================================

function updateGame() {
  // Handle spaceship 1 movement - Up/Down
  if (keyIsDown(UP_ARROW)) {
    spaceship1.velocityY -= 0.8;
    spaceship1.thrusterOffset += 0.3; // Thruster animation
  }
  if (keyIsDown(DOWN_ARROW)) {
    spaceship1.velocityY += 0.8;
    spaceship1.thrusterOffset += 0.3;
  }
  
  // Handle spaceship 1 movement - Left/Right
  if (keyIsDown(LEFT_ARROW)) {
    spaceship1.velocityX -= 0.8;
    spaceship1.thrusterOffset += 0.3;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    spaceship1.velocityX += 0.8;
    spaceship1.thrusterOffset += 0.3;
  }
  
  // Handle spaceship 1 shooting
  if (keyIsDown(32)) { // SPACE key - shoot
    fireBullet(spaceship1, color(100, 200, 255)); // Blue bullets for ship 1
    playLaserSound(); // PEW PEW!
  }
  
  // Handle spaceship 2 movement (if 2-player mode) - Up/Down
  if (gameMode === 2) {
    if (keyIsDown(87)) { // W key
      spaceship2.velocityY -= 0.8;
      spaceship2.thrusterOffset += 0.3;
    }
    if (keyIsDown(83)) { // S key
      spaceship2.velocityY += 0.8;
      spaceship2.thrusterOffset += 0.3;
    }
    
    // Handle spaceship 2 movement - Left/Right
    if (keyIsDown(65)) { // A key
      spaceship2.velocityX -= 0.8;
      spaceship2.thrusterOffset += 0.3;
    }
    if (keyIsDown(68)) { // D key
      spaceship2.velocityX += 0.8;
      spaceship2.thrusterOffset += 0.3;
    }
    
    // Handle spaceship 2 shooting
    if (keyIsDown(88)) { // X key - shoot
      fireBullet(spaceship2, color(255, 100, 100)); // Red bullets for ship 2
      playLaserSound(); // PEW PEW!
    }
  }
  
  // Apply physics to both spaceships
  updateSpaceship(spaceship1);
  if (gameMode === 2) {
    updateSpaceship(spaceship2);
  }
  
  // Update game objects
  updateGameObjects();
  
  // Check collisions
  checkAllCollisions();
  
  // Update score and difficulty
  distanceTraveled += gameSpeed;
  score += Math.floor(gameSpeed);
  difficultyTimer++;
  
  if (difficultyTimer >= DIFFICULTY_INCREASE_INTERVAL) {
    increaseDifficulty();
    difficultyTimer = 0;
  }
}

function updateSpaceship(ship) {
  // Apply space friction to both axes
  ship.velocityY *= SPACE_FRICTION;
  ship.velocityX *= SPACE_FRICTION;
  
  // Limit maximum speeds
  ship.velocityY = constrain(ship.velocityY, -MAX_VERTICAL_SPEED, MAX_VERTICAL_SPEED);
  ship.velocityX = constrain(ship.velocityX, -MAX_HORIZONTAL_SPEED, MAX_HORIZONTAL_SPEED);
  
  // Update position
  ship.y += ship.velocityY;
  ship.x += ship.velocityX;
  
  // Keep spaceship within screen bounds
  ship.y = constrain(ship.y, ship.size / 2, CANVAS_HEIGHT - ship.size / 2);
  ship.x = constrain(ship.x, ship.size / 2, CANVAS_WIDTH - ship.size / 2);
  
  // Update shield timer
  if (ship.shieldTimer > 0) {
    ship.shieldTimer--;
    if (ship.shieldTimer <= 0) {
      ship.shieldActive = false;
    }
  }
  
  // Slow down thruster animation when not accelerating
  ship.thrusterOffset *= 0.9;
}

function updateGameObjects() {
  // Spawn obstacles
  obstacleSpawnTimer++;
  if (obstacleSpawnTimer >= spawnRate) {
    spawnObstacle();
    obstacleSpawnTimer = 0;
  }
  
  // Spawn stars
  starSpawnTimer++;
  if (starSpawnTimer >= starSpawnRate) {
    spawnSpaceStar();
    starSpawnTimer = 0;
  }
  
  // Spawn power-ups
  powerUpSpawnTimer++;
  if (powerUpSpawnTimer >= powerUpSpawnRate) {
    spawnPowerUp();
    powerUpSpawnTimer = 0;
  }
  
  // Spawn hearts
  heartSpawnTimer++;
  if (heartSpawnTimer >= heartSpawnRate) {
    spawnHeart();
    heartSpawnTimer = 0;
  }
  
  // Update obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obstacle = obstacles[i];
    obstacle.x -= obstacleSpeed * gameSpeed;
    obstacle.rotation += obstacle.rotationSpeed;
    
    if (obstacle.x < -obstacle.size) {
      obstacles.splice(i, 1);
    }
  }
  
  // Update stars
  for (let i = spaceStars.length - 1; i >= 0; i--) {
    let star = spaceStars[i];
    star.x -= obstacleSpeed * gameSpeed * 0.7; // Stars move slightly slower
    star.rotation += 0.05;
    star.pulse += 0.1;
    
    if (star.x < -star.size) {
      spaceStars.splice(i, 1);
    }
  }
  
  // Update power-ups
  for (let i = powerUps.length - 1; i >= 0; i--) {
    let powerUp = powerUps[i];
    powerUp.x -= obstacleSpeed * gameSpeed * 0.8;
    powerUp.pulse += 0.08;
    powerUp.rotation += 0.03;
    
    if (powerUp.x < -powerUp.size) {
      powerUps.splice(i, 1);
    }
  }
  
  // Update hearts
  for (let i = hearts.length - 1; i >= 0; i--) {
    let heart = hearts[i];
    heart.x -= obstacleSpeed * gameSpeed * 0.6; // Hearts move slower than stars
    heart.pulse += 0.12; // Heartbeat animation
    
    if (heart.x < -heart.size) {
      hearts.splice(i, 1);
    }
  }
  
  // Spawn monsters
  monsterSpawnTimer++;
  if (monsterSpawnTimer >= monsterSpawnRate) {
    spawnMonster();
    monsterSpawnTimer = 0;
  }
  
  // Update bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    let bullet = bullets[i];
    bullet.x += BULLET_SPEED;
    
    if (bullet.x > CANVAS_WIDTH) {
      bullets.splice(i, 1);
    }
  }
  
  // Update monsters
  for (let i = monsters.length - 1; i >= 0; i--) {
    let monster = monsters[i];
    monster.x -= obstacleSpeed * gameSpeed * 0.9; // Monsters move slightly slower than obstacles
    monster.animTimer += 0.1;
    
    // Monster-specific movement patterns
    if (monster.type === 'octopus') {
      monster.y += sin(monster.animTimer) * 2;
    } else if (monster.type === 'bug') {
      monster.y += sin(monster.animTimer * 2) * 1.5;
      monster.x += cos(monster.animTimer) * 1;
    }
    
    if (monster.x < -monster.size) {
      monsters.splice(i, 1);
    }
  }
}

function checkAllCollisions() {
  // Check spaceship 1 collisions
  checkShipCollisions(spaceship1, 1);
  
  // Check spaceship 2 collisions if in 2-player mode
  if (gameMode === 2) {
    checkShipCollisions(spaceship2, 2);
  }
  
  // Check bullet-monster collisions
  checkBulletMonsterCollisions();
  
  // Check ship-monster collisions
  checkShipMonsterCollisions();
}

function checkBulletMonsterCollisions() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let bullet = bullets[i];
    
    for (let j = monsters.length - 1; j >= 0; j--) {
      let monster = monsters[j];
      let distance = dist(bullet.x, bullet.y, monster.x, monster.y);
      
      if (distance < (bullet.size / 2 + monster.size / 2)) {
        // Hit monster
        monster.hp--;
        bullets.splice(i, 1); // Remove bullet
        
        if (monster.hp <= 0) {
          // Monster destroyed - add score based on monster type
          let points = monster.type === 'giant' ? 200 :
                      monster.type === 'enemyShip' ? 100 :
                      monster.type === 'robot' ? 75 :
                      monster.type === 'octopus' ? 50 :
                      25; // bug
          
          score += points;
          monsters.splice(j, 1); // Remove monster
          playExplosionSound();
          
          // Chance to drop collectibles
          if (random() < 0.3) { // 30% chance
            if (random() < 0.7) {
              // Drop star
              let star = {
                x: monster.x,
                y: monster.y,
                size: STAR_SIZE,
                rotation: 0,
                pulse: 0,
                color: color(255, 255, 100)
              };
              spaceStars.push(star);
            } else {
              // Drop heart (rare)
              let heart = {
                x: monster.x,
                y: monster.y,
                size: HEART_SIZE,
                pulse: 0
              };
              hearts.push(heart);
            }
          }
        }
        break;
      }
    }
  }
}

function checkShipMonsterCollisions() {
  checkShipMonsterCollision(spaceship1);
  if (gameMode === 2) {
    checkShipMonsterCollision(spaceship2);
  }
}

function checkShipMonsterCollision(ship) {
  if (ship.shieldActive) return; // Shield protects from monsters
  
  for (let i = monsters.length - 1; i >= 0; i--) {
    let monster = monsters[i];
    let distance = dist(ship.x, ship.y, monster.x, monster.y);
    
    if (distance < (ship.size / 2 + monster.size / 2) * 0.8) {
      // Hit by monster
      ship.lives--;
      monsters.splice(i, 1); // Remove monster
      playExplosionSound();
      
      if (ship.lives <= 0) {
        gameOver();
        return;
      }
      break;
    }
  }
}

function checkShipCollisions(ship, playerNum) {
  // Check obstacle collisions
  if (!ship.shieldActive) {
    for (let i = obstacles.length - 1; i >= 0; i--) {
      let obstacle = obstacles[i];
      let distance = dist(ship.x, ship.y, obstacle.x, obstacle.y);
      
      if (distance < (ship.size / 2 + obstacle.size / 2) * 0.8) {
        // Hit obstacle
        ship.lives--;
        obstacles.splice(i, 1); // Remove obstacle
        playExplosionSound();
        
        if (ship.lives <= 0) {
          gameOver();
          return;
        }
        break;
      }
    }
  }
  
  // Check star collection
  for (let i = spaceStars.length - 1; i >= 0; i--) {
    let star = spaceStars[i];
    let distance = dist(ship.x, ship.y, star.x, star.y);
    
    if (distance < (ship.size / 2 + star.size / 2)) {
      score += STAR_POINTS_VALUE;
      spaceStars.splice(i, 1);
      playCollectStarSound(); // DING!
      break;
    }
  }
  
  // Check power-up collection
  for (let i = powerUps.length - 1; i >= 0; i--) {
    let powerUp = powerUps[i];
    let distance = dist(ship.x, ship.y, powerUp.x, powerUp.y);
    
    if (distance < (ship.size / 2 + powerUp.size / 2)) {
      // Activate shield
      ship.shieldActive = true;
      ship.shieldTimer = SHIELD_DURATION;
      powerUps.splice(i, 1);
      playShieldActivateSound(); // WHOOSH!
      break;
    }
  }
  
  // Check heart collection
  for (let i = hearts.length - 1; i >= 0; i--) {
    let heart = hearts[i];
    let distance = dist(ship.x, ship.y, heart.x, heart.y);
    
    if (distance < (ship.size / 2 + heart.size / 2)) {
      // Add life if not at maximum
      if (ship.lives < MAX_SHIP_LIVES) {
        ship.lives++;
        hearts.splice(i, 1);
        playHeartCollectSound(); // Sweet heart melody!
        break;
      }
    }
  }
}

function increaseDifficulty() {
  if (obstacleSpeed < MAX_OBSTACLE_SPEED) {
    obstacleSpeed += 0.2;
  }
  if (spawnRate > MIN_SPAWN_RATE) {
    spawnRate -= 2;
  }
  gameSpeed += 0.05; // Overall game speeds up slightly
}

function gameOver() {
  gameState = GAME_OVER;
  
  // Update high score
  let finalDistance = Math.floor(distanceTraveled / 10);
  if (finalDistance > highScore) {
    highScore = finalDistance;
    localStorage.setItem('spaceRunnerHighScore', highScore);
  }
}

// ============================================
// SHOOTING SYSTEM
// ============================================

function fireBullet(ship, bulletColor) {
  if (bullets.length < MAX_BULLETS) {
    let bullet = {
      x: ship.x + ship.size/2, // Fire from front of ship
      y: ship.y,
      color: bulletColor,
      size: BULLET_SIZE
    };
    bullets.push(bullet);
  }
}

// ============================================
// MONSTER SYSTEM 
// ============================================

function spawnMonster() {
  if (monsters.length < MAX_MONSTERS) {
    let monsterTypes = ['octopus', 'robot', 'bug', 'enemyShip', 'giant'];
    let type = random(monsterTypes);
    
    let monster = {
      x: CANVAS_WIDTH + 50,
      y: random(50, CANVAS_HEIGHT - 50),
      type: type,
      size: type === 'giant' ? 80 : type === 'robot' ? 50 : 40,
      hp: type === 'giant' ? 5 : type === 'enemyShip' ? 3 : type === 'robot' ? 2 : 1,
      maxHp: type === 'giant' ? 5 : type === 'enemyShip' ? 3 : type === 'robot' ? 2 : 1,
      animTimer: 0,
      color: type === 'octopus' ? color(150, 50, 200) :
             type === 'robot' ? color(200, 50, 50) :
             type === 'bug' ? color(100, 200, 50) :
             type === 'enemyShip' ? color(255, 100, 0) :
             color(200, 0, 100) // giant
    };
    
    monsters.push(monster);
  }
}

function resetGame() {
  score = 0;
  distanceTraveled = 0;
  gameSpeed = 1;
  obstacles = [];
  spaceStars = [];
  powerUps = [];
  hearts = []; // Reset hearts array
  bullets = []; // Reset bullets array
  monsters = []; // Reset monsters array
  obstacleSpawnTimer = 0;
  starSpawnTimer = 0;
  powerUpSpawnTimer = 0;
  heartSpawnTimer = 0; // Reset heart spawn timer
  monsterSpawnTimer = 0; // Reset monster spawn timer
  obstacleSpeed = 4; // Start with faster speed
  spawnRate = 60; // Start with more frequent spawns
  difficultyTimer = 0;
  
  // Reset spaceship 1
  spaceship1.x = 100;
  spaceship1.y = gameMode === 1 ? CANVAS_HEIGHT / 2 : CANVAS_HEIGHT / 2 - 50;
  spaceship1.velocityY = 0;
  spaceship1.velocityX = 0; // Reset horizontal velocity
  spaceship1.lives = 3;
  spaceship1.shieldActive = false;
  spaceship1.shieldTimer = 0;
  spaceship1.thrusterOffset = 0;
  
  // Reset spaceship 2 (if 2-player mode)
  if (gameMode === 2) {
    spaceship2.x = 100;
    spaceship2.y = CANVAS_HEIGHT / 2 + 50;
    spaceship2.velocityY = 0;
    spaceship2.velocityX = 0; // Reset horizontal velocity
    spaceship2.lives = 3;
    spaceship2.shieldActive = false;
    spaceship2.shieldTimer = 0;
    spaceship2.thrusterOffset = 0;
  }
}

// ============================================
// INPUT HANDLING
// ============================================

function keyPressed() {
  // Initialize audio on first interaction
  initializeSpaceAudio();
  
  if (gameState === MENU) {
    if (key === '1') {
      gameMode = 1;
    } else if (key === '2') {
      gameMode = 2;
    } else if (key === ' ') {
      gameState = PLAYING;
      resetGame();
    }
  }
  
  if (key === ' ' && gameState === GAME_OVER) {
    gameState = PLAYING;
    resetGame();
  }
  
  if (keyCode === ESCAPE) {
    if (gameState === GAME_OVER) {
      // Go back to game selection
      window.location.href = 'gameSelector.html';
    } else if (gameState === MENU) {
      // Go back to game selection
      window.location.href = 'gameSelector.html';
    }
  }
}

function mousePressed() {
  // Initialize audio on first interaction
  initializeSpaceAudio();
  
  if (gameState === MENU) {
    gameState = PLAYING;
    resetGame();
  } else if (gameState === GAME_OVER) {
    gameState = PLAYING;
    resetGame();
  }
}

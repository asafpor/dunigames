// ============================================
// SUPERMARKET TAG - VISUAL & AUDIO SYSTEMS
// ============================================
// מערכות גרפיקה, אנימציות וקולות למשחק התפיסה בסופר מרקט

// ============================================
// SUPERMARKET AUDIO SYSTEM
// ============================================

function initializeSupermarketAudio() {
  try {
    if (walkSound === null) {
      // Start Tone.js audio context
      Tone.start();
      
      // Create supermarket-themed sound effects
      createSupermarketSoundEffects();
      
      // Initialize supermarket music system
      initializeSupermarketMusic();
      
      console.log("Supermarket audio system initialized");
    }
  } catch (error) {
    console.log("Supermarket audio initialization failed:", error);
  }
}

function createSupermarketSoundEffects() {
  // Walking/running sounds
  walkSound = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.01, decay: 0.05, sustain: 0, release: 0.05 }
  }).toDestination();
  
  // Candy collection sound - sweet ding!
  candySound = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.4 }
  }).toDestination();
  
  // Tag/catch sound - dramatic impact
  tagSound = new Tone.NoiseSynth({
    noise: { type: "pink" },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 }
  }).toDestination();
  
  // Cart push sound
  cartSound = new Tone.Synth({
    oscillator: { type: "square" },
    envelope: { attack: 0.1, decay: 0.3, sustain: 0.2, release: 0.4 }
  }).toDestination();
  
  // Immunity activation sound
  immunitySound = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.05, decay: 0.4, sustain: 0.3, release: 0.6 }
  }).toDestination();
  
  // Set volumes for all sounds
  walkSound.volume.value = -25;
  candySound.volume.value = -10;
  tagSound.volume.value = -15;
  cartSound.volume.value = -18;
  immunitySound.volume.value = -12;
  
  console.log("Supermarket sound effects created");
}

function initializeSupermarketMusic() {
  try {
    // Create light, cheerful supermarket music synths
    const melodySynth = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.4, release: 0.8 }
    }).toDestination();
    
    const bassSynth = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.05, decay: 0.3, sustain: 0.6, release: 1.0 }
    }).toDestination();
    
    const padSynth = new Tone.PolySynth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.5, decay: 0.3, sustain: 0.5, release: 1.5 }
    }).toDestination();
    
    // Set pleasant volumes
    melodySynth.volume.value = -18;
    bassSynth.volume.value = -22;
    padSynth.volume.value = -25;
    
    // Store music synths globally
    window.supermarketMusic = {
      melody: melodySynth,
      bass: bassSynth,
      pad: padSynth
    };
    
    console.log("Supermarket music system created");
  } catch (error) {
    console.log("Supermarket music creation failed:", error);
  }
}

function startSupermarketMusic() {
  try {
    if (currentMusicTrack !== 'supermarket' && window.supermarketMusic) {
      // Light, cheerful supermarket background music
      const melody = ["C4", "E4", "G4", "E4", "F4", "A4", "G4", "F4"];
      const bass = ["C2", "C2", "F2", "G2"];
      const pad = [["C4", "E4"], ["F4", "A4"], ["G4", "B4"], ["F4", "A4"]];
      
      // Simple loop for pleasant background music
      let melodyIndex = 0;
      let bassIndex = 0;
      let padIndex = 0;
      
      if (window.supermarketMusicLoop) {
        window.supermarketMusicLoop.stop();
      }
      
      window.supermarketMusicLoop = new Tone.Loop((time) => {
        // Play melody every beat
        window.supermarketMusic.melody.triggerAttackRelease(melody[melodyIndex], "4n", time);
        melodyIndex = (melodyIndex + 1) % melody.length;
        
        // Play bass every 2 beats
        if (melodyIndex % 2 === 0) {
          window.supermarketMusic.bass.triggerAttackRelease(bass[bassIndex], "2n", time);
          bassIndex = (bassIndex + 1) % bass.length;
        }
        
        // Play pad chords every 4 beats
        if (melodyIndex % 4 === 0) {
          window.supermarketMusic.pad.triggerAttackRelease(pad[padIndex], "1n", time);
          padIndex = (padIndex + 1) % pad.length;
        }
      }, "4n").start();
      
      Tone.Transport.bpm.value = 110; // Relaxed tempo
      Tone.Transport.start();
      
      currentMusicTrack = 'supermarket';
      console.log("Supermarket background music started");
    }
  } catch (error) {
    console.log("Failed to start supermarket music:", error);
  }
}

function stopSupermarketMusic() {
  try {
    if (window.supermarketMusicLoop) {
      window.supermarketMusicLoop.stop();
      window.supermarketMusicLoop = null;
    }
    Tone.Transport.stop();
    Tone.Transport.cancel();
    currentMusicTrack = 'none';
    console.log("Supermarket music stopped");
  } catch (error) {
    console.log("Failed to stop supermarket music:", error);
  }
}

// Sound effect functions
function playWalkSound() {
  try {
    if (walkSound) {
      walkSound.triggerAttackRelease("16n");
    }
  } catch (error) {
    console.log("Walk sound failed:", error);
  }
}

function playCandyCollectSound() {
  try {
    if (candySound) {
      // Sweet ascending notes
      candySound.triggerAttackRelease("C5", "8n");
      setTimeout(() => {
        candySound.triggerAttackRelease("E5", "8n");
      }, 100);
      setTimeout(() => {
        candySound.triggerAttackRelease("G5", "4n");
      }, 200);
    }
  } catch (error) {
    console.log("Candy sound failed:", error);
  }
}

function playTagSound() {
  try {
    if (tagSound) {
      tagSound.triggerAttackRelease("8n");
    }
  } catch (error) {
    console.log("Tag sound failed:", error);
  }
}

function playCartPushSound() {
  try {
    if (cartSound) {
      cartSound.triggerAttackRelease("D3", "4n");
    }
  } catch (error) {
    console.log("Cart sound failed:", error);
  }
}

function playImmunitySound() {
  try {
    if (immunitySound) {
      // Magical immunity sound
      immunitySound.triggerAttackRelease("A4", "2n");
      setTimeout(() => {
        immunitySound.triggerAttackRelease("C5", "2n");
      }, 200);
    }
  } catch (error) {
    console.log("Immunity sound failed:", error);
  }
}

// ============================================
// SUPERMARKET BACKGROUND SYSTEM
// ============================================

function drawSupermarketBackground() {
  // Light supermarket floor
  fill(245, 245, 240); // Cream tile color
  noStroke();
  rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
  // Draw floor tiles pattern
  drawFloorTiles();
  
  // Draw supermarket shelves and layout
  drawSupermarketLayout();
  
  // Draw checkout counters
  drawCheckoutCounters();
  
  // Draw shopping carts
  drawShoppingCarts();
  
  // Draw entrance/exit
  drawEntranceExit();
}

function drawFloorTiles() {
  // Subtle floor tile pattern
  stroke(230, 230, 225);
  strokeWeight(1);
  
  let tileSize = 40;
  for (let x = 0; x < CANVAS_WIDTH; x += tileSize) {
    for (let y = 0; y < CANVAS_HEIGHT; y += tileSize) {
      noFill();
      rect(x, y, tileSize, tileSize);
    }
  }
  
  noStroke();
}

function drawSupermarketLayout() {
  let shelfWidth = 30;
  let shelfHeight = 200;
  let aisleWidth = 120;
  
  // Create maze-like shelf layout for hiding
  for (let i = 0; i < 8; i++) {
    let x = 150 + i * (shelfWidth + aisleWidth);
    
    // Vary shelf heights for interesting layout
    let topShelfHeight = (i % 2 === 0) ? shelfHeight : shelfHeight * 0.7;
    let bottomShelfHeight = (i % 3 === 0) ? shelfHeight * 0.8 : shelfHeight;
    
    // Draw enhanced shelves with depth and details
    drawEnhancedShelf(x, 50, shelfWidth, topShelfHeight, i);
    drawEnhancedShelf(x, CANVAS_HEIGHT - bottomShelfHeight - 50, shelfWidth, bottomShelfHeight, i);
  }
  
  // Add some horizontal shelves for variety
  for (let i = 0; i < 3; i++) {
    let y = 300 + i * 150;
    let x = 80;
    let horizontalShelfLength = 400;
    
    drawEnhancedShelf(x, y, horizontalShelfLength, shelfWidth, i + 10, true);
  }
}

function drawEnhancedShelf(x, y, w, h, index, isHorizontal = false) {
  push();
  
  // Shelf base structure with depth
  let depthOffset = 8;
  
  // Draw shelf shadow
  fill(0, 0, 0, 30);
  noStroke();
  rect(x + depthOffset/2, y + depthOffset/2, w, h);
  
  // Draw shelf back (darker)
  fill(90, 130, 70);
  stroke(60, 100, 40);
  strokeWeight(2);
  rect(x, y, w, h);
  
  // Draw shelf front face (lighter)
  fill(110, 160, 90);
  stroke(80, 140, 70);
  strokeWeight(1);
  rect(x, y, w - depthOffset, h - depthOffset);
  
  // Add wood grain texture
  drawWoodGrain(x, y, w - depthOffset, h - depthOffset);
  
  // Draw shelf brackets/supports
  drawShelfSupports(x, y, w, h, isHorizontal);
  
  // Draw enhanced products
  drawEnhancedProducts(x, y, w, h, index);
  
  // Add department signs for some shelves
  if (index % 3 === 0) {
    drawDepartmentSign(x, y, w, isHorizontal, index);
  }
  
  pop();
}

function drawWoodGrain(x, y, w, h) {
  // Subtle wood grain pattern
  stroke(95, 145, 85, 100);
  strokeWeight(1);
  
  let grainSpacing = 8;
  for (let gx = x + 5; gx < x + w - 5; gx += grainSpacing) {
    let waveHeight = sin((gx - x) * 0.1) * 3;
    line(gx, y + 2, gx, y + h - 2 + waveHeight);
  }
  
  noStroke();
}

function drawShelfSupports(x, y, w, h, isHorizontal) {
  // Metal shelf supports
  fill(120, 120, 120);
  stroke(80, 80, 80);
  strokeWeight(1);
  
  if (isHorizontal) {
    // Vertical supports for horizontal shelves
    rect(x + 10, y - 5, 6, h + 10);
    rect(x + w - 16, y - 5, 6, h + 10);
    if (w > 200) {
      rect(x + w/2 - 3, y - 5, 6, h + 10);
    }
  } else {
    // Horizontal supports for vertical shelves
    rect(x - 5, y + 10, w + 10, 4);
    rect(x - 5, y + h - 14, w + 10, 4);
    if (h > 100) {
      rect(x - 5, y + h/2 - 2, w + 10, 4);
    }
  }
}

function drawEnhancedProducts(x, y, w, h, shelfIndex) {
  push();
  
  // Different product types based on shelf
  let productTypes = ['cereal', 'canned', 'dairy', 'frozen', 'produce'];
  let productType = productTypes[shelfIndex % productTypes.length];
  
  let productSize = 12;
  let spacing = 16;
  let rows = max(1, floor((h - 20) / (productSize * 1.5 + 5)));
  let cols = max(1, floor((w - 20) / spacing));
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let px = x + 10 + col * spacing + random(-2, 2);
      let py = y + 10 + row * (productSize * 1.5 + 5) + random(-1, 1);
      
      // Skip some products randomly for realistic gaps
      if (random() < 0.15) continue;
      
      drawProduct(px, py, productSize, productType, col + row * cols);
    }
  }
  
  pop();
}

function drawProduct(x, y, size, type, variation) {
  push();
  translate(x, y);
  
  let baseColors = {
    cereal: [color(255, 200, 100), color(200, 100, 255), color(100, 255, 200)],
    canned: [color(220, 220, 220), color(255, 150, 150), color(150, 150, 255)],
    dairy: [color(255, 255, 255), color(255, 255, 200), color(200, 255, 200)],
    frozen: [color(150, 200, 255), color(200, 255, 255), color(255, 200, 255)],
    produce: [color(255, 100, 100), color(100, 255, 100), color(255, 255, 100)]
  };
  
  let colors = baseColors[type] || baseColors.cereal;
  let productColor = colors[variation % colors.length];
  
  // Product shadow
  fill(0, 0, 0, 40);
  noStroke();
  rect(1, size * 1.5 + 1, size, size * 0.3);
  
  // Product main body
  fill(productColor);
  stroke(red(productColor) * 0.7, green(productColor) * 0.7, blue(productColor) * 0.7);
  strokeWeight(1);
  
  if (type === 'cereal' || type === 'frozen') {
    // Box shape
    rect(0, 0, size, size * 1.8);
    // Brand stripe
    fill(255, 255, 255, 150);
    noStroke();
    rect(2, size * 0.3, size - 4, size * 0.3);
  } else if (type === 'canned') {
    // Cylindrical can
    ellipse(size/2, size * 0.8, size, size * 0.4);
    rect(0, size * 0.8, size, size * 0.8);
    ellipse(size/2, size * 1.6, size, size * 0.4);
    // Label
    fill(255, 255, 255);
    noStroke();
    rect(1, size, size - 2, size * 0.6);
  } else {
    // Default rectangular package
    rect(0, 0, size, size * 1.5);
    // Simple label
    fill(255, 255, 255, 180);
    noStroke();
    rect(2, size * 0.2, size - 4, size * 0.4);
  }
  
  pop();
}

function drawDepartmentSign(x, y, w, isHorizontal, index) {
  push();
  
  let signs = ['מוצרי חלב', 'דגנים', 'שימורים', 'קפואים', 'פירות וירקות'];
  let signText = signs[index % signs.length];
  
  // Sign background
  fill(255, 255, 255);
  stroke(0, 0, 0);
  strokeWeight(2);
  
  let signY = y - 25;
  let signW = 80;
  let signH = 20;
  
  rect(x + (w - signW)/2, signY, signW, signH);
  
  // Sign text
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(10);
  text(signText, x + w/2, signY + signH/2);
  
  pop();
}

function drawShelfDetails(x, y, w, h) {
  // Legacy function - kept for compatibility
  // New enhanced shelves use drawEnhancedShelf instead
}

function drawCheckoutCounters() {
  // Checkout area at the front
  fill(150, 100, 70); // Brown counter color
  stroke(120, 80, 50);
  strokeWeight(2);
  
  let counterWidth = 80;
  let counterHeight = 25;
  
  for (let i = 0; i < 5; i++) {
    let x = 200 + i * (counterWidth + 20);
    let y = CANVAS_HEIGHT - 100;
    
    rect(x, y, counterWidth, counterHeight);
    
    // Add cash register
    fill(100, 100, 100);
    rect(x + 10, y - 15, 20, 15);
    
    // Add checkout light
    fill(0, 255, 0);
    noStroke();
    ellipse(x + 20, y - 25, 8, 8);
    
    stroke(120, 80, 50);
    strokeWeight(2);
    fill(150, 100, 70);
  }
}

function drawShoppingCarts() {
  // Draw available shopping carts
  for (let cart of shoppingCarts) {
    drawShoppingCart(cart);
  }
}

function drawShoppingCart(cart) {
  push();
  translate(cart.x, cart.y);
  
  // Cart body
  fill(180, 180, 180);
  stroke(120, 120, 120);
  strokeWeight(2);
  rect(-15, -10, 30, 20);
  
  // Cart handle
  line(15, 0, 25, 0);
  
  // Cart wheels
  fill(50, 50, 50);
  noStroke();
  ellipse(-10, 12, 6, 6);
  ellipse(10, 12, 6, 6);
  ellipse(-10, -12, 6, 6);
  ellipse(10, -12, 6, 6);
  
  // Cart basket lines
  stroke(120, 120, 120);
  strokeWeight(1);
  for (let i = -10; i <= 10; i += 5) {
    line(i, -10, i, 10);
  }
  
  pop();
}

function drawEntranceExit() {
  // Store entrance/exit
  fill(200, 200, 200);
  stroke(150, 150, 150);
  strokeWeight(3);
  rect(20, CANVAS_HEIGHT/2 - 50, 40, 100);
  
  // Entrance signs
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(12);
  text("כניסה", 40, CANVAS_HEIGHT/2 - 20);
  text("יציאה", 40, CANVAS_HEIGHT/2 + 20);
}

// ============================================
// PLAYER RENDERING SYSTEM
// ============================================

function drawPlayer(player, isChaser) {
  push();
  translate(player.x, player.y);
  
  // Draw immunity glow effect
  if (player.immunityTimer > 0) {
    drawImmunityEffect(player);
  }
  
  // Draw movement trail effect
  if (player.isMoving) {
    drawMovementTrail(player, isChaser);
  }
  
  // Draw the stick figure player
  drawStickFigure(player, isChaser);
  
  // Draw player label
  drawPlayerLabel(player, isChaser);
  
  pop();
}

function drawStickFigure(player, isChaser) {
  let playerColor = isChaser ? color(255, 50, 50) : color(50, 150, 255);
  let size = player.size;
  
  // Player shadow
  fill(0, 0, 0, 50);
  noStroke();
  ellipse(2, size + 2, size * 0.8, size * 0.3);
  
  // Head
  fill(playerColor);
  stroke(0);
  strokeWeight(2);
  ellipse(0, -size/2, size/2, size/2);
  
  // Face details
  fill(0);
  noStroke();
  // Eyes
  ellipse(-size/8, -size/2 - size/16, size/20, size/20);
  ellipse(size/8, -size/2 - size/16, size/20, size/20);
  
  // Smile or frown based on immunity/chasing
  stroke(0);
  strokeWeight(1);
  noFill();
  if (player.immunityTimer > 0) {
    // Happy face when immune
    arc(0, -size/2 + size/16, size/8, size/10, 0, PI);
  } else if (isChaser) {
    // Determined face for chaser
    line(-size/12, -size/2 + size/16, size/12, -size/2 + size/16);
  } else {
    // Worried face for runner
    arc(0, -size/2 + size/8, size/8, size/10, PI, TWO_PI);
  }
  
  // Body
  stroke(0);
  strokeWeight(3);
  line(0, -size/4, 0, size/4);
  
  // Arms with animation based on movement
  let armSwing = player.isMoving ? sin(player.walkCycle) * 0.3 : 0;
  line(0, -size/6, -size/3, 0 + armSwing);
  line(0, -size/6, size/3, 0 - armSwing);
  
  // Legs with walking animation
  let legSwing = player.isMoving ? sin(player.walkCycle) * 0.4 : 0;
  line(0, size/4, -size/4, size/2 + legSwing);
  line(0, size/4, size/4, size/2 - legSwing);
  
  // Add shopping cart if player has one
  if (player.hasCart) {
    drawPlayerCart(player, isChaser);
  }
}

function drawPlayerCart(player, isChaser) {
  push();
  translate(player.size/2 + 20, 0);
  
  // Mini shopping cart
  fill(200, 200, 200);
  stroke(100, 100, 100);
  strokeWeight(2);
  rect(-8, -5, 16, 10);
  
  // Cart wheels
  fill(50, 50, 50);
  noStroke();
  ellipse(-5, 8, 4, 4);
  ellipse(5, 8, 4, 4);
  
  pop();
}

function drawImmunityEffect(player) {
  // Golden immunity glow - much gentler
  let glowIntensity = sin(frameCount * 0.05) * 30 + 80;
  
  // Outer glow
  fill(255, 215, 0, glowIntensity * 0.4);
  noStroke();
  ellipse(0, 0, player.size * 2.2, player.size * 2.2);
  
  // Inner glow
  fill(255, 255, 150, glowIntensity * 0.6);
  ellipse(0, 0, player.size * 1.6, player.size * 1.6);
  
  // Gentle sparkles around immune player
  for (let i = 0; i < 4; i++) {
    let angle = (frameCount * 0.02 + i * PI/2) % TWO_PI;
    let sparkleDistance = player.size * (1.3 + sin(frameCount * 0.03 + i) * 0.2);
    let sparkleX = cos(angle) * sparkleDistance;
    let sparkleY = sin(angle) * sparkleDistance;
    
    fill(255, 255, 100, glowIntensity * 0.8);
    star(sparkleX, sparkleY, 2, 4, 3);
  }
}

function drawMovementTrail(player, isChaser) {
  // Movement trail particles
  let trailColor = isChaser ? color(255, 100, 100, 100) : color(100, 150, 255, 100);
  
  fill(trailColor);
  noStroke();
  
  for (let i = 0; i < 3; i++) {
    let trailX = random(-player.size/4, player.size/4);
    let trailY = player.size/2 + i * 5 + random(-3, 3);
    let trailSize = (3 - i) * 2;
    
    ellipse(trailX, trailY, trailSize, trailSize);
  }
}

function drawPlayerLabel(player, isChaser) {
  // Player role label
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(12);
  
  let label = isChaser ? "תופס" : "נתפס";
  text(label, 0, -player.size - 15);
  
  // Show immunity timer if active
  if (player.immunityTimer > 0) {
    fill(255, 215, 0);
    textSize(10);
    let timeLeft = Math.ceil(player.immunityTimer / 60);
    text(`חסינות: ${timeLeft}s`, 0, -player.size - 30);
  }
}

// ============================================
// CANDY SYSTEM RENDERING
// ============================================

function spawnCandy() {
  if (candies.length < MAX_CANDIES) {
    // Find a good spawn location on/near shelves
    let spawnAreas = [
      {x: 165, y: 100, w: 200, h: 150}, // Near top shelves
      {x: 165, y: 600, w: 200, h: 150}, // Near bottom shelves
      {x: 500, y: 300, w: 150, h: 100}, // Middle area
      {x: 800, y: 150, w: 100, h: 200}, // Side area
      {x: 300, y: 400, w: 150, h: 100}  // Between shelves
    ];
    
    let area = random(spawnAreas);
    let candy = {
      x: area.x + random(area.w),
      y: area.y + random(area.h),
      size: 20,
      type: random(['lollipop', 'chocolate', 'gummy', 'candy']),
      sparkle: 0,
      timer: CANDY_DURATION, // 20 seconds
      collected: false
    };
    
    candies.push(candy);
    console.log("Candy spawned at", candy.x, candy.y);
  }
}

function drawCandy(candy) {
  if (candy.collected) return;
  
  push();
  translate(candy.x, candy.y);
  
  // Gentle candy glow effect - reduced blinking
  let sparkleIntensity = sin(candy.sparkle * 0.3) * 0.3 + 0.7;
  let glowSize = candy.size + sparkleIntensity * 6;
  
  // Subtle glow effect
  fill(255, 255, 150, sparkleIntensity * 80);
  noStroke();
  ellipse(0, 0, glowSize, glowSize);
  
  // Draw different candy types
  if (candy.type === 'lollipop') {
    drawLollipop(candy, sparkleIntensity);
  } else if (candy.type === 'chocolate') {
    drawChocolate(candy, sparkleIntensity);
  } else if (candy.type === 'gummy') {
    drawGummy(candy, sparkleIntensity);
  } else {
    drawGenericCandy(candy, sparkleIntensity);
  }
  
  // Sparkle particles around candy
  drawCandySparkles(candy, sparkleIntensity);
  
  pop();
}

function drawLollipop(candy, sparkleIntensity) {
  // Lollipop stick
  stroke(160, 82, 45);
  strokeWeight(3);
  line(0, candy.size/4, 0, candy.size);
  
  // Lollipop candy part
  fill(255, 100 + sparkleIntensity * 100, 150);
  stroke(200, 50, 100);
  strokeWeight(2);
  ellipse(0, 0, candy.size, candy.size);
  
  // Swirl pattern
  stroke(255, 200, 220);
  strokeWeight(2);
  noFill();
  for (let i = 0; i < 3; i++) {
    let radius = candy.size/2 - i * 3;
    arc(0, 0, radius, radius, i * PI/2, i * PI/2 + PI);
  }
}

function drawChocolate(candy, sparkleIntensity) {
  // Chocolate bar
  fill(139, 69, 19);
  stroke(101, 67, 33);
  strokeWeight(2);
  rect(-candy.size/2, -candy.size/3, candy.size, candy.size * 2/3);
  
  // Chocolate squares
  stroke(160, 82, 45);
  strokeWeight(1);
  let squares = 3;
  for (let i = 0; i < squares; i++) {
    for (let j = 0; j < squares; j++) {
      let squareSize = candy.size / squares;
      let x = -candy.size/2 + i * squareSize;
      let y = -candy.size/3 + j * squareSize;
      rect(x, y, squareSize, squareSize);
    }
  }
  
  // Highlight
  fill(200, 150, 100, sparkleIntensity * 100);
  noStroke();
  rect(-candy.size/3, -candy.size/4, candy.size/2, candy.size/6);
}

function drawGummy(candy, sparkleIntensity) {
  // Gummy bear shape
  let gummyColor = random() < 0.5 ? color(255, 100, 100) : color(100, 255, 100);
  fill(red(gummyColor), green(gummyColor), blue(gummyColor), 200 + sparkleIntensity * 55);
  stroke(red(gummyColor) * 0.8, green(gummyColor) * 0.8, blue(gummyColor) * 0.8);
  strokeWeight(2);
  
  // Bear body
  ellipse(0, candy.size/4, candy.size * 0.8, candy.size);
  
  // Bear head
  ellipse(0, -candy.size/4, candy.size * 0.6, candy.size * 0.6);
  
  // Bear ears
  ellipse(-candy.size/6, -candy.size/2, candy.size/4, candy.size/4);
  ellipse(candy.size/6, -candy.size/2, candy.size/4, candy.size/4);
  
  // Bear arms
  ellipse(-candy.size/3, 0, candy.size/4, candy.size/3);
  ellipse(candy.size/3, 0, candy.size/4, candy.size/3);
  
  // Bear legs
  ellipse(-candy.size/4, candy.size/2, candy.size/4, candy.size/3);
  ellipse(candy.size/4, candy.size/2, candy.size/4, candy.size/3);
}

function drawGenericCandy(candy, sparkleIntensity) {
  // Wrapped candy
  fill(255, 200, 100, 200 + sparkleIntensity * 55);
  stroke(255, 150, 50);
  strokeWeight(2);
  ellipse(0, 0, candy.size, candy.size * 0.8);
  
  // Wrapper ends
  stroke(255, 100, 50);
  strokeWeight(3);
  line(-candy.size/2, 0, -candy.size/2 - 8, -5);
  line(-candy.size/2, 0, -candy.size/2 - 8, 5);
  line(candy.size/2, 0, candy.size/2 + 8, -5);
  line(candy.size/2, 0, candy.size/2 + 8, 5);
  
  // Stripes
  stroke(255, 255, 200);
  strokeWeight(2);
  for (let i = -1; i <= 1; i++) {
    line(i * candy.size/6, -candy.size/3, i * candy.size/6, candy.size/3);
  }
}

function drawCandySparkles(candy, sparkleIntensity) {
  // Floating sparkles
  fill(255, 255, 200, sparkleIntensity * 200);
  noStroke();
  
  for (let i = 0; i < 6; i++) {
    let angle = (candy.sparkle * 0.5 + i * PI/3) % TWO_PI;
    let distance = candy.size * (1 + sin(candy.sparkle + i) * 0.3);
    let sparkleX = cos(angle) * distance;
    let sparkleY = sin(angle) * distance;
    
    star(sparkleX, sparkleY, 2, 4, 5);
  }
}

// Helper function to draw stars
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

// ============================================
// UI ELEMENTS
// ============================================

function drawGameUI() {
  // Game timer
  fill(0);
  textAlign(LEFT, TOP);
  textSize(24);
  let timeLeft = Math.max(0, Math.ceil(gameTimeLeft / 60));
  text(`זמן: ${timeLeft}s`, 20, 20);
  
  // Dramatic countdown for last 10 seconds
  if (timeLeft <= 10 && timeLeft > 0) {
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(72);
    text(timeLeft, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    
    // Gentle pulsing effect for urgency - much less aggressive
    let pulse = sin(frameCount * 0.15) * 30 + 120;
    fill(255, 100, 100, pulse);
    textSize(78);
    text(timeLeft, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  }
  
  // Game instructions
  if (gameTimeLeft === GAME_DURATION) {
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(18);
    text("התופס צריך לתפוס את הנתפס לפני שהזמן נגמר!", CANVAS_WIDTH / 2, 60);
    text("הנתפס יכול לאסוף ממתקים לחסינות!", CANVAS_WIDTH / 2, 85);
  }
}

function drawWinMessage(winner) {
  // Semi-transparent overlay
  fill(0, 0, 0, 150);
  rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
  // Winner message
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  
  if (winner === 'chaser') {
    fill(255, 100, 100);
    text("🎉 התופס ניצח! 🎉", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
  } else if (winner === 'runner') {
    fill(100, 200, 255);
    text("🏃‍♂️ הנתפס ברח בהצלחה! 🏃‍♂️", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
  } else {
    fill(255, 255, 100);
    text("⏰ הזמן נגמר - תיקו! ⏰", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
  }
  
  fill(255);
  textSize(20);
  text("לחץ SPACE למשחק חדש", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
  text("לחץ ESC לחזור לתפריט", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
}

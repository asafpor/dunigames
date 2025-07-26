// ============================================
// PIXEL ESCAPE - VISUAL & AUDIO SYSTEMS
// ============================================
// This file contains all rendering, visual effects, 
// audio systems, and asset management functions.

// ============================================
// AUDIO SYSTEM
// ============================================

function initializeAudio() {
  try {
    if (jumpSound === null) {
      // Start Tone.js audio context on user interaction
      Tone.start();
      
      // Create Tone.js oscillators for sound effects
      jumpSound = new Tone.Oscillator(220, "square").toDestination();
      starSound = new Tone.Oscillator(440, "sine").toDestination();
      gameOverSound = new Tone.Oscillator(110, "sawtooth").toDestination();
      
      // Initialize background music
      initializeBackgroundMusic();
      
      console.log("Tone.js audio initialized successfully");
    }
  } catch (error) {
    console.log("Audio initialization failed, continuing without sound:", error);
  }
}

function initializeBackgroundMusic() {
  try {
    // Create enhanced synths with effects
    const leadSynth = new Tone.MonoSynth({
      oscillator: { type: "sawtooth" },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 0.4 },
      filterEnvelope: { attack: 0.02, decay: 0.1, sustain: 0.9, release: 0.4 }
    }).toDestination();
    
    const bassSynth = new Tone.FMSynth({
      harmonicity: 0.25,
      modulationIndex: 3,
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.8, release: 0.6 }
    }).toDestination();
    
    const harmonySynth = new Tone.PolySynth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.3, decay: 0.2, sustain: 0.4, release: 0.8 }
    }).toDestination();
    
    // Create percussion using noise and filters
    const kickDrum = new Tone.MembraneSynth({
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.0, release: 0.2 },
      octaves: 2
    }).toDestination();
    
    const snare = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0.0, release: 0.1 }
    }).toDestination();
    
    const hihat = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.05, sustain: 0.0, release: 0.05 }
    }).toDestination();
    
    // Set volumes
    leadSynth.volume.value = -18;
    bassSynth.volume.value = -20;
    harmonySynth.volume.value = -25;
    kickDrum.volume.value = -22;
    snare.volume.value = -25;
    hihat.volume.value = -28;
    
    // MENU MUSIC - Calm and inviting
    const menuMelody = ["C4", "E4", "G4", "C5", "E4", "G4", "F4", "A4",
                       "C4", "E4", "G4", "C5", "G4", "F4", "E4", "C4"];
    const menuBass = ["C2", "C2", "F2", "F2", "G2", "G2", "C2", "C2"];
    const menuHarmony = [["C4", "E4"], ["E4", "G4"], ["F4", "A4"], ["G4", "B4"]];
    
    // GAMEPLAY MUSIC - Energetic and driving
    const gameplayMelody = ["C4", "D4", "E4", "G4", "A4", "G4", "F4", "E4",
                           "D4", "E4", "F4", "A4", "C5", "A4", "G4", "F4",
                           "E4", "F4", "G4", "B4", "C5", "B4", "A4", "G4",
                           "F4", "G4", "A4", "C5", "D5", "C5", "A4", "G4"];
    const gameplayBass = ["C2", "C2", "F2", "F2", "G2", "G2", "C2", "C2",
                         "A1", "A1", "D2", "D2", "G2", "G2", "C2", "C2"];
    
    // ACTION MUSIC - Fast and intense (for high difficulty)
    const actionMelody = ["C4", "E4", "G4", "C5", "E5", "G5", "E5", "C5",
                         "B4", "D5", "F5", "B5", "D6", "B5", "F5", "D5",
                         "A4", "C5", "E5", "A5", "C6", "A5", "E5", "C5",
                         "G4", "B4", "D5", "G5", "B5", "G5", "D5", "B4"];
    const actionBass = ["C2", "G1", "C2", "G1", "F2", "C2", "F2", "C2"];
    
    // GAME OVER MUSIC - Sad but hopeful
    const gameOverMelody = ["C4", "A3", "F3", "G3", "A3", "C4", "G3", "F3"];
    const gameOverBass = ["F2", "F2", "C2", "C2", "G2", "G2", "F2", "F2"];
    
    // Create drum patterns
    const basicDrumPattern = ["C2", null, null, "C2", null, null, "C2", null];
    const snareDrumPattern = [null, null, "C3", null, null, null, "C3", null];
    const hihatPattern = ["C4", "C4", "C4", "C4", "C4", "C4", "C4", "C4"];
    
    // Create all sequences
    const sequences = {
      menu: {
        melody: new Tone.Sequence((time, note) => {
          if (note) leadSynth.triggerAttackRelease(note, "4n", time);
        }, menuMelody, "4n"),
        bass: new Tone.Sequence((time, note) => {
          if (note) bassSynth.triggerAttackRelease(note, "2n", time);
        }, menuBass, "2n"),
        harmony: new Tone.Sequence((time, chord) => {
          if (chord) harmonySynth.triggerAttackRelease(chord, "2n", time);
        }, menuHarmony, "2n")
      },
      gameplay: {
        melody: new Tone.Sequence((time, note) => {
          if (note) leadSynth.triggerAttackRelease(note, "8n", time);
        }, gameplayMelody, "8n"),
        bass: new Tone.Sequence((time, note) => {
          if (note) bassSynth.triggerAttackRelease(note, "4n", time);
        }, gameplayBass, "4n"),
        kick: new Tone.Sequence((time, note) => {
          if (note) kickDrum.triggerAttackRelease("C1", "16n", time);
        }, basicDrumPattern, "8n"),
        snare: new Tone.Sequence((time, note) => {
          if (note) snare.triggerAttackRelease("16n", time);
        }, snareDrumPattern, "8n"),
        hihat: new Tone.Sequence((time, note) => {
          if (note) hihat.triggerAttackRelease("C5", "32n", time);
        }, hihatPattern, "16n")
      },
      action: {
        melody: new Tone.Sequence((time, note) => {
          if (note) leadSynth.triggerAttackRelease(note, "16n", time);
        }, actionMelody, "16n"),
        bass: new Tone.Sequence((time, note) => {
          if (note) bassSynth.triggerAttackRelease(note, "8n", time);
        }, actionBass, "8n"),
        kick: new Tone.Sequence((time, note) => {
          if (note) kickDrum.triggerAttackRelease("C1", "16n", time);
        }, ["C2", null, "C2", null, "C2", null, "C2", null], "16n"),
        snare: new Tone.Sequence((time, note) => {
          if (note) snare.triggerAttackRelease("16n", time);
        }, [null, "C3", null, "C3", null, "C3", null, "C3"], "16n")
      },
      gameOver: {
        melody: new Tone.Sequence((time, note) => {
          if (note) leadSynth.triggerAttackRelease(note, "2n", time);
        }, gameOverMelody, "2n"),
        bass: new Tone.Sequence((time, note) => {
          if (note) bassSynth.triggerAttackRelease(note, "1n", time);
        }, gameOverBass, "1n")
      }
    };
    
    // Store in music system
    musicSystem = {
      synths: { leadSynth, bassSynth, harmonySynth, kickDrum, snare, hihat },
      sequences: sequences,
      currentTrack: 'none',
      isPlaying: false
    };
    
    console.log("Enhanced music system initialized");
  } catch (error) {
    console.log("Music system initialization failed:", error);
  }
}

function startMusicTrack(trackName) {
  try {
    if (!musicSystem || !musicSystem.sequences[trackName]) {
      console.log(`Music track '${trackName}' not found`);
      return;
    }
    
    // Stop current track if playing
    if (musicSystem.isPlaying && currentMusicTrack !== 'none') {
      stopMusicTrack();
    }
    
    // Set tempo based on track
    let bpm = 120; // Default
    if (trackName === 'menu') bpm = 100;
    else if (trackName === 'gameplay') bpm = 140;
    else if (trackName === 'action') bpm = 180;
    else if (trackName === 'gameOver') bpm = 80;
    
    Tone.Transport.bpm.value = bpm;
    
    // Start the sequences for this track
    const track = musicSystem.sequences[trackName];
    Object.values(track).forEach(sequence => {
      if (sequence) sequence.start();
    });
    
    // Start transport if not already running
    if (Tone.Transport.state !== 'started') {
      Tone.Transport.start();
    }
    
    musicSystem.isPlaying = true;
    currentMusicTrack = trackName;
    console.log(`Music track '${trackName}' started at ${bpm} BPM`);
    
  } catch (error) {
    console.log("Failed to start music track:", error);
  }
}

function stopMusicTrack() {
  try {
    if (musicSystem && musicSystem.isPlaying && currentMusicTrack !== 'none') {
      // Stop all sequences for current track
      const track = musicSystem.sequences[currentMusicTrack];
      if (track) {
        Object.values(track).forEach(sequence => {
          if (sequence) sequence.stop();
        });
      }
      
      // Stop transport
      Tone.Transport.stop();
      
      musicSystem.isPlaying = false;
      console.log(`Music track '${currentMusicTrack}' stopped`);
      currentMusicTrack = 'none';
    }
  } catch (error) {
    console.log("Failed to stop music track:", error);
  }
}

function updateMusicForGameplay() {
  try {
    // Switch to action music when game gets intense (high obstacle speed)
    let targetTrack = 'gameplay';
    if (obstacleSpeed > 5) {
      targetTrack = 'action';
    }
    
    // Only switch if we need to change tracks
    if (currentMusicTrack !== targetTrack) {
      startMusicTrack(targetTrack);
    }
  } catch (error) {
    console.log("Failed to update gameplay music:", error);
  }
}

function playSound(oscillator, volume, duration) {
  try {
    if (oscillator && oscillator.start && oscillator.stop) {
      // Set volume and start the oscillator
      oscillator.volume.value = Tone.gainToDb(volume);
      oscillator.start();
      
      // Stop the oscillator after the duration
      oscillator.stop(Tone.now() + duration);
    }
  } catch (error) {
    console.log("Audio playback failed:", error);
  }
}

// ============================================
// BACKGROUND RENDERING SYSTEM
// ============================================

function generateBackgroundElements() {
  // Generate mountain points (static, no more random every frame)
  mountainPoints.back = [];
  mountainPoints.middle = [];
  mountainPoints.front = [];
  
  // Back mountains
  for (let x = 0; x <= CANVAS_WIDTH; x += 80) {
    let y = CANVAS_HEIGHT * 0.6 + sin(x * 0.008) * 60 + random(-20, 20);
    mountainPoints.back.push({ x: x, y: y });
  }
  
  // Middle mountains
  for (let x = 0; x <= CANVAS_WIDTH; x += 60) {
    let y = CANVAS_HEIGHT * 0.7 + sin(x * 0.012 + 50) * 40 + random(-15, 15);
    mountainPoints.middle.push({ x: x, y: y });
  }
  
  // Front mountains
  for (let x = 0; x <= CANVAS_WIDTH; x += 40) {
    let y = CANVAS_HEIGHT * 0.8 + sin(x * 0.015 + 100) * 25 + random(-10, 10);
    mountainPoints.front.push({ x: x, y: y });
  }
  
  // Generate grass blades (static positions and heights)
  grassBlades = [];
  for (let x = 0; x < CANVAS_WIDTH; x += 8) {
    let grassHeight = random(5, 12);
    let grassY = CANVAS_HEIGHT - 60 + random(-3, 3);
    let hasSmallBlade = random() < 0.3;
    grassBlades.push({
      x: x,
      y: grassY,
      height: grassHeight,
      hasSmallBlade: hasSmallBlade
    });
  }
  
  // Generate flowers (static positions, colors, and sizes)
  backgroundFlowers = [];
  for (let i = 0; i < 15; i++) {
    let flowerColors = [
      color(255, 100, 150), // Pink
      color(255, 255, 100), // Yellow
      color(150, 100, 255), // Purple
      color(255, 150, 100), // Orange
      color(100, 150, 255)  // Blue
    ];
    
    backgroundFlowers.push({
      x: random(CANVAS_WIDTH),
      y: CANVAS_HEIGHT - 60 + random(-5, 5),
      color: random(flowerColors)
    });
  }
  
  // Generate seaweed (static positions and properties to prevent shakiness)
  backgroundSeaweed = [];
  for (let i = 0; i < 8; i++) {
    backgroundSeaweed.push({
      x: (CANVAS_WIDTH / 8) * i + random(-20, 20),
      height: random(30, 60),
      swayPhase: i, // Different sway timing for each seaweed
      segments: 12 // Number of curve segments
    });
  }
  
  // Generate coral (static positions and properties)
  backgroundCoral = [];
  for (let i = 0; i < 5; i++) {
    let coralColors = [
      color(255, 100, 150, 120), // Pink coral
      color(255, 165, 0, 120),   // Orange coral
      color(138, 43, 226, 120)   // Purple coral
    ];
    
    backgroundCoral.push({
      x: (CANVAS_WIDTH / 5) * i + 50,
      color: random(coralColors),
      size1: random(15, 25),
      height1: random(8, 15),
      size2: random(10, 18),
      height2: random(6, 12),
      offsetX: random(-10, 10)
    });
  }
  
  backgroundGenerated = true;
}

function drawSkyBackground() {
  // Generate background elements once
  if (!backgroundGenerated) {
    generateBackgroundElements();
  }
  
  // Draw beautiful layered gradient background
  noStroke();
  
  // Create a smoother gradient with multiple layers
  for (let i = 0; i < CANVAS_HEIGHT; i += 4) {
    let inter = map(i, 0, CANVAS_HEIGHT, 0, 1);
    // Sky gradient from light blue to deep purple
    let skyColor = lerpColor(color(173, 216, 230), color(25, 25, 112), inter);
    fill(skyColor);
    rect(0, i, CANVAS_WIDTH, 4);
  }
  
  // Add distant mountain silhouettes
  drawMountains();
  
  // Add twinkling stars in upper portion
  drawBackgroundStars();
  
  // Draw clouds
  for (let cloud of clouds) {
    drawCloud(cloud);
  }
  
  // Draw ground texture
  drawGround();
  
  // Draw fishes (background elements at bottom)
  for (let fish of fishes) {
    drawFish(fish);
  }
  
  noStroke();
}

function drawMountains() {
  // Draw distant mountain silhouettes using pre-generated static points
  noStroke();
  
  // Back mountains (darkest)
  fill(40, 40, 80, 180);
  beginShape();
  vertex(0, CANVAS_HEIGHT);
  vertex(0, CANVAS_HEIGHT * 0.6);
  for (let point of mountainPoints.back) {
    vertex(point.x, point.y);
  }
  vertex(CANVAS_WIDTH, CANVAS_HEIGHT);
  endShape(CLOSE);
  
  // Middle mountains (lighter)
  fill(60, 60, 100, 160);
  beginShape();
  vertex(0, CANVAS_HEIGHT);
  vertex(0, CANVAS_HEIGHT * 0.7);
  for (let point of mountainPoints.middle) {
    vertex(point.x, point.y);
  }
  vertex(CANVAS_WIDTH, CANVAS_HEIGHT);
  endShape(CLOSE);
  
  // Front mountains (lightest)
  fill(80, 80, 120, 140);
  beginShape();
  vertex(0, CANVAS_HEIGHT);
  vertex(0, CANVAS_HEIGHT * 0.8);
  for (let point of mountainPoints.front) {
    vertex(point.x, point.y);
  }
  vertex(CANVAS_WIDTH, CANVAS_HEIGHT);
  endShape(CLOSE);
}

function drawBackgroundStars() {
  // Draw twinkling stars in the upper portion of the sky
  fill(255, 255, 255);
  noStroke();
  
  // Create consistent star positions using noise
  for (let i = 0; i < 40; i++) {
    let x = (noise(i * 0.1) * CANVAS_WIDTH);
    let y = (noise(i * 0.1 + 1000) * CANVAS_HEIGHT * 0.4); // Only in upper 40% of sky
    
    // Twinkling effect
    let twinkle = sin(frameCount * 0.05 + i * 0.5) * 0.5 + 0.5;
    let starSize = (2 + twinkle * 2);
    
    // Vary star brightness
    let brightness = 150 + twinkle * 105;
    fill(brightness, brightness, brightness);
    
    ellipse(x, y, starSize, starSize);
    
    // Add cross sparkle for brighter stars
    if (twinkle > 0.7) {
      stroke(brightness, brightness, brightness, 100);
      strokeWeight(1);
      line(x - starSize, y, x + starSize, y);
      line(x, y - starSize, x, y + starSize);
      noStroke();
    }
  }
}

function drawGround() {
  // New layout: shoreline above ocean
  let oceanStart = CANVAS_HEIGHT - 120; // Ocean starts higher up
  let shorelineHeight = 60; // Shoreline/beach area
  
  // Draw shoreline/beach area above ocean
  for (let i = 0; i < shorelineHeight; i += 2) {
    let groundColor = lerpColor(color(194, 178, 128), color(160, 144, 108), i / shorelineHeight); // Sandy beach colors
    fill(groundColor);
    rect(0, oceanStart + i, CANVAS_WIDTH, 2);
  }
  
  // Draw ocean with animated waves
  drawOcean();
  
  // Draw coastal grass blades (adjusted positions)
  stroke(50, 120, 50);
  strokeWeight(1);
  for (let grass of grassBlades) {
    // Move grass to shoreline area
    let adjustedY = oceanStart + (grass.y - (CANVAS_HEIGHT - 60));
    line(grass.x, adjustedY, grass.x, adjustedY - grass.height);
    
    // Add small grass blade if this grass has one
    if (grass.hasSmallBlade) {
      line(grass.x + 2, adjustedY, grass.x + 2, adjustedY - grass.height * 0.7);
    }
  }
  
  // Draw coastal flowers (adjusted positions)
  noStroke();
  for (let flower of backgroundFlowers) {
    let adjustedY = oceanStart + (flower.y - (CANVAS_HEIGHT - 60));
    
    fill(flower.color);
    
    // Draw simple flower (small circle with petals)
    ellipse(flower.x, adjustedY, 6, 6);
    
    // Petals
    fill(red(flower.color), green(flower.color), blue(flower.color), 150);
    for (let j = 0; j < 5; j++) {
      let angle = (TWO_PI / 5) * j;
      let petalX = flower.x + cos(angle) * 4;
      let petalY = adjustedY + sin(angle) * 4;
      ellipse(petalX, petalY, 3, 3);
    }
    
    // Flower center
    fill(255, 255, 100);
    ellipse(flower.x, adjustedY, 2, 2);
  }
  
  noStroke();
}

function drawOcean() {
  let oceanStart = CANVAS_HEIGHT - 120;
  let oceanDepth = 120;
  
  // Draw ocean with depth gradient
  for (let i = 0; i < oceanDepth; i += 2) {
    let depth = i / oceanDepth;
    // Ocean gradient from lighter blue at surface to deep blue at bottom
    let oceanColor = lerpColor(color(100, 149, 237, 180), color(25, 25, 112, 220), depth);
    fill(oceanColor);
    rect(0, oceanStart + i, CANVAS_WIDTH, 2);
  }
  
  // Draw animated waves on ocean surface
  drawOceanWaves(oceanStart);
  
  // Draw underwater elements
  drawUnderwaterScene(oceanStart, oceanDepth);
}

function drawOceanWaves(oceanSurface) {
  stroke(255, 255, 255, 100);
  strokeWeight(2);
  noFill();
  
  // Draw multiple wave layers for depth
  for (let layer = 0; layer < 3; layer++) {
    let waveHeight = 8 - layer * 2; // Smaller waves for deeper layers
    let waveSpeed = 0.02 + layer * 0.01; // Different speeds for each layer
    let waveOffset = layer * 100; // Offset each layer
    
    beginShape();
    for (let x = 0; x <= CANVAS_WIDTH + 20; x += 5) {
      let wave = sin((x * 0.01) + (frameCount * waveSpeed) + waveOffset) * waveHeight;
      vertex(x, oceanSurface + wave + layer * 3);
    }
    endShape();
  }
  
  noStroke();
}

function drawUnderwaterScene(oceanStart, oceanDepth) {
  // Draw pre-generated seaweed (no more shakiness)
  stroke(34, 139, 34, 150);
  strokeWeight(3);
  for (let i = 0; i < backgroundSeaweed.length; i++) {
    let seaweed = backgroundSeaweed[i];
    let sway = sin(frameCount * 0.03 + seaweed.swayPhase) * 3; // Gentler swaying
    
    // Draw seaweed stem with smooth curves
    noFill();
    beginShape();
    for (let j = 0; j <= seaweed.segments; j++) {
      let progress = j / seaweed.segments;
      let y = CANVAS_HEIGHT - (progress * seaweed.height);
      let swayAmount = sin((progress * PI) + (frameCount * 0.02)) * sway * progress; // More sway at top
      vertex(seaweed.x + swayAmount, y);
    }
    endShape();
  }
  
  // Draw bubbles rising from ocean floor (keep these animated)
  fill(255, 255, 255, 100);
  noStroke();
  for (let i = 0; i < 6; i++) {
    let bubbleX = noise(i * 100, frameCount * 0.01) * CANVAS_WIDTH;
    let bubbleY = CANVAS_HEIGHT - (frameCount * 0.5 + i * 50) % oceanDepth;
    let bubbleSize = 4 + sin(frameCount * 0.1 + i) * 1; // Smaller bubble size variation
    
    ellipse(bubbleX, bubbleY, bubbleSize, bubbleSize);
  }
  
  // Draw pre-generated coral (no more shakiness)
  noStroke();
  for (let coral of backgroundCoral) {
    fill(coral.color);
    
    // Draw stable coral shapes
    ellipse(coral.x, CANVAS_HEIGHT - 10, coral.size1, coral.height1);
    ellipse(coral.x + coral.offsetX, CANVAS_HEIGHT - 15, coral.size2, coral.height2);
  }
  
  noStroke();
}

// ============================================
// GAME OBJECT RENDERING
// ============================================

// Rock/Obstacle System
function spawnObstacle() {
  // Only spawn if we haven't reached the limit
  if (obstacles.length < MAX_OBSTACLES) {
    let obstacle = {
      x: random(50, CANVAS_WIDTH - 50),
      y: -30,
      size: random(15, 30),
      shape: generateRockShape()
    };
    obstacles.push(obstacle);
  }
}

function generateRockShape() {
  let shape = [];
  let numVertices = floor(random(5, 8));
  
  for (let i = 0; i < numVertices; i++) {
    let angle = (TWO_PI / numVertices) * i + random(-0.3, 0.3);
    let radius = random(0.8, 1.2);
    shape.push({
      x: cos(angle) * radius,
      y: sin(angle) * radius
    });
  }
  
  return shape;
}

function drawRock(x, y, size, shape) {
  push();
  translate(x, y);
  scale(size);
  fill(150, 150, 150); // Gray color for rocks
  stroke(100);
  strokeWeight(1);
  
  beginShape();
  if (shape && shape.length > 0) {
    for (let point of shape) {
      if (point && typeof point.x === 'number' && typeof point.y === 'number') {
        vertex(point.x, point.y);
      }
    }
  } else {
    // Fallback: draw a simple rectangle if shape is invalid
    vertex(-0.5, -0.5);
    vertex(0.5, -0.5);
    vertex(0.5, 0.5);
    vertex(-0.5, 0.5);
  }
  endShape(CLOSE);
  
  pop();
}

// Star System
function spawnStar() {
  if (stars.length < MAX_STARS) {
    let star = {
      x: random(50, CANVAS_WIDTH - 50),
      y: -30,
      size: STAR_SIZE,
      rotation: 0
    };
    stars.push(star);
  }
}

function drawStar(star) {
  push();
  translate(star.x, star.y);
  rotate(star.rotation);
  
  // Draw 5-pointed star
  fill(255, 255, 0); // Yellow color
  stroke(255);
  strokeWeight(1);
  
  beginShape();
  for (let i = 0; i < 5; i++) {
    let angle1 = (TWO_PI / 5) * i - PI / 2;
    let angle2 = (TWO_PI / 5) * (i + 0.5) - PI / 2;
    
    let outerRadius = star.size / 2;
    let innerRadius = outerRadius * 0.4;
    
    let x1 = cos(angle1) * outerRadius;
    let y1 = sin(angle1) * outerRadius;
    let x2 = cos(angle2) * innerRadius;
    let y2 = sin(angle2) * innerRadius;
    
    if (i === 0) {
      vertex(x1, y1);
    } else {
      vertex(x1, y1);
    }
    vertex(x2, y2);
  }
  endShape(CLOSE);
  
  noStroke();
  pop();
}

// Heart System
function spawnHeart() {
  if (hearts.length < MAX_HEARTS) {
    let heart = {
      x: random(50, CANVAS_WIDTH - 50),
      y: -30,
      size: HEART_SIZE,
      pulse: 0
    };
    hearts.push(heart);
  }
}

function drawHeart(heart) {
  push();
  translate(heart.x, heart.y);
  
  // Add pulsing effect
  let pulseScale = 1 + sin(heart.pulse) * 0.1;
  scale(pulseScale);
  
  // Draw heart shape
  fill(255, 100, 100); // Pink/red color
  stroke(255, 50, 50);
  strokeWeight(1);
  
  let size = heart.size;
  
  // Heart shape using curves
  beginShape();
  // Start at bottom point
  vertex(0, size * 0.3);
  // Left curve
  bezierVertex(-size * 0.5, -size * 0.2, -size * 0.5, -size * 0.5, 0, -size * 0.1);
  // Right curve  
  bezierVertex(size * 0.5, -size * 0.5, size * 0.5, -size * 0.2, 0, size * 0.3);
  endShape(CLOSE);
  
  noStroke();
  pop();
}

// Hotdog System
function spawnHotdog() {
  if (hotdogs.length < MAX_HOTDOGS) {
    let hotdog = {
      x: random(50, CANVAS_WIDTH - 50),
      y: -30,
      size: HOTDOG_SIZE,
      rotation: 0
    };
    hotdogs.push(hotdog);
  }
}

function drawHotdog(hotdog) {
  push();
  translate(hotdog.x, hotdog.y);
  rotate(hotdog.rotation);
  
  let size = hotdog.size;
  
  // Draw hotdog bun (tan/brown color)
  fill(210, 180, 140); // Light brown bun color
  stroke(160, 130, 100);
  strokeWeight(1);
  ellipse(0, 0, size, size * 0.6);
  
  // Draw sausage (darker brown/red)
  fill(139, 69, 19); // Brown sausage color
  noStroke();
  ellipse(0, 0, size * 0.8, size * 0.4);
  
  // Add some hotdog details (small lines for texture)
  stroke(100, 50, 0);
  strokeWeight(1);
  for (let i = -1; i <= 1; i++) {
    line(i * size * 0.15, -size * 0.1, i * size * 0.15, size * 0.1);
  }
  
  noStroke();
  pop();
}

// Shark System - now spawns 5 small sharks instead of 1 large
function spawnShark() {
  if (sharks.length + 5 <= MAX_SHARKS * 5) { // Allow room for 5 sharks per spawn
    // Create center point for the shark school
    let centerX = random(150, CANVAS_WIDTH - 150);
    let centerY = CANVAS_HEIGHT - 30;
    let schoolTargetX = random(250, CANVAS_WIDTH - 250);
    let schoolTargetY = CANVAS_HEIGHT - random(120, 180);
    
    // Spawn 5 small sharks in a school formation
    for (let i = 0; i < 5; i++) {
      let shark = {
        x: centerX + random(-40, 40), // Spread around center point
        y: centerY + random(-15, 15), // Slight vertical variation
        size: random(30, 50), // Smaller sharks
        speed: random(1.2, 2.0), // Slightly varied swimming speed
        targetX: schoolTargetX + random(-60, 60), // Individual targets around school target
        targetY: schoolTargetY + random(-30, 30), // Slight target variation
        state: 'warning', // 'warning', 'attacking'
        timer: 0,
        attackTimer: 0, // Track how long shark has been attacking
        swimOffset: random(0, TWO_PI), // Different starting swim phase for each shark
        mouthOpenness: 0, // Animation for opening mouth (0 = closed, 1 = fully open)
        angle: 0, // Swimming angle toward target
        schoolId: frameCount // Mark sharks from same school
      };
      
      // Calculate swimming angle toward target
      shark.angle = atan2(shark.targetY - shark.y, shark.targetX - shark.x);
      
      sharks.push(shark);
    }
  }
}

function drawShark(shark) {
  push();
  translate(shark.x, shark.y);
  
  // Rotate shark to face its swimming direction
  rotate(shark.angle);
  
  // Add natural swimming motion
  let swimBob = sin(shark.swimOffset) * 4;
  translate(0, swimBob);
  
  // Draw water disturbance around shark
  fill(255, 255, 255, 50);
  noStroke();
  ellipse(0, 0, shark.size * 1.5, shark.size * 0.8);
  
  // Main shark body (streamlined torpedo shape)
  fill(60, 60, 60);
  stroke(40, 40, 40);
  strokeWeight(3);
  ellipse(0, 0, shark.size, shark.size * 0.4);
  
  // Shark head and snout
  fill(55, 55, 55);
  ellipse(shark.size * 0.3, 0, shark.size * 0.6, shark.size * 0.35);
  
  // MASSIVE GAPING MOUTH with animated opening
  let mouthWidth = shark.size * 0.7;
  let mouthHeight = shark.size * 0.3 * shark.mouthOpenness; // Mouth opens based on state
  
  // Mouth cavity (dark interior)
  fill(20, 5, 5); // Very dark red-black
  noStroke();
  ellipse(shark.size * 0.4, 0, mouthWidth, mouthHeight);
  
  // Upper jaw with massive teeth
  let numTeeth = 8;
  fill(255, 255, 240); // Ivory white teeth
  for (let i = 0; i < numTeeth; i++) {
    let toothX = shark.size * 0.1 + (i * mouthWidth / numTeeth);
    let toothLength = shark.size * 0.12 + random(-0.02, 0.02) * shark.size;
    
    // Upper teeth pointing down
    triangle(toothX, -mouthHeight * 0.5,
             toothX + shark.size * 0.03, -mouthHeight * 0.5 - toothLength,
             toothX + shark.size * 0.06, -mouthHeight * 0.5);
    
    // Lower teeth pointing up
    triangle(toothX, mouthHeight * 0.5,
             toothX + shark.size * 0.03, mouthHeight * 0.5 + toothLength,
             toothX + shark.size * 0.06, mouthHeight * 0.5);
  }
  
  // Additional inner row of smaller teeth for realism
  fill(240, 240, 220);
  for (let i = 0; i < numTeeth - 2; i++) {
    let toothX = shark.size * 0.15 + (i * mouthWidth / (numTeeth - 2));
    let toothLength = shark.size * 0.08;
    
    triangle(toothX, -mouthHeight * 0.3,
             toothX + shark.size * 0.02, -mouthHeight * 0.3 - toothLength,
             toothX + shark.size * 0.04, -mouthHeight * 0.3);
    
    triangle(toothX, mouthHeight * 0.3,
             toothX + shark.size * 0.02, mouthHeight * 0.3 + toothLength,
             toothX + shark.size * 0.04, mouthHeight * 0.3);
  }
  
  // Menacing glowing red eyes
  fill(255, 0, 0); // Bright red
  stroke(150, 0, 0);
  strokeWeight(2);
  ellipse(shark.size * 0.15, -shark.size * 0.08, shark.size * 0.1, shark.size * 0.08);
  ellipse(shark.size * 0.15, shark.size * 0.08, shark.size * 0.1, shark.size * 0.08);
  
  // Eye pupils
  fill(0);
  noStroke();
  ellipse(shark.size * 0.17, -shark.size * 0.08, shark.size * 0.04, shark.size * 0.04);
  ellipse(shark.size * 0.17, shark.size * 0.08, shark.size * 0.04, shark.size * 0.04);
  
  // Glowing eye effect
  fill(255, 100, 100, 150);
  ellipse(shark.size * 0.15, -shark.size * 0.08, shark.size * 0.12, shark.size * 0.1);
  ellipse(shark.size * 0.15, shark.size * 0.08, shark.size * 0.12, shark.size * 0.1);
  
  // Dorsal fin (large and threatening)
  fill(50, 50, 50);
  stroke(30, 30, 30);
  strokeWeight(2);
  triangle(shark.size * 0.05, -shark.size * 0.2, 
           shark.size * 0.25, -shark.size * 0.45,
           shark.size * 0.35, -shark.size * 0.15);
  
  // Pectoral fins (side fins)
  triangle(-shark.size * 0.1, -shark.size * 0.15,
           -shark.size * 0.25, -shark.size * 0.25,
           -shark.size * 0.15, -shark.size * 0.05);
  
  triangle(-shark.size * 0.1, shark.size * 0.15,
           -shark.size * 0.25, shark.size * 0.25,
           -shark.size * 0.15, shark.size * 0.05);
  
  // Powerful tail fin with animation
  let tailWag = sin(shark.swimOffset * 2) * 8; // Strong tail movement
  push();
  translate(-shark.size * 0.45, 0);
  rotate(radians(tailWag));
  triangle(0, 0,
           -shark.size * 0.25, -shark.size * 0.2,
           -shark.size * 0.25, shark.size * 0.2);
  pop();
  
  // Gill slits for detail
  stroke(30, 30, 30);
  strokeWeight(2);
  for (let i = 0; i < 5; i++) {
    let gillX = shark.size * 0.1 + i * shark.size * 0.03;
    line(gillX, -shark.size * 0.15, gillX, -shark.size * 0.05);
    line(gillX, shark.size * 0.05, gillX, shark.size * 0.15);
  }
  
  pop();
}

function drawSharkWarning(shark) {
  // Calculate warning intensity based on time remaining
  let progress = shark.timer / SHARK_WARNING_TIME;
  
  // Create pulsing effect
  let pulseSpeed = map(progress, 0, 1, 10, 25); // Pulse gets faster as warning progresses
  let pulse = sin(frameCount / pulseSpeed) * 0.5 + 0.5; // Value between 0 and 1
  
  // Calculate color intensity (starts dim, gets brighter)
  let baseIntensity = map(progress, 0, 1, 100, 255);
  let intensity = baseIntensity + pulse * 100;
  
  // Draw warning ripples in water around shark's position
  stroke(255, intensity * 0.6, intensity * 0.6, 200); // Red warning color
  strokeWeight(4 + pulse * 3); // Pulsing stroke width
  noFill();
  
  // Draw warning ripples in ocean
  for (let i = 1; i <= 3; i++) {
    let rippleSize = (shark.size * 0.8) + i * 20 + pulse * 15;
    ellipse(shark.x, shark.y, rippleSize, rippleSize * 0.3);
  }
  
  // Add intense bubbles rising from the warning area
  fill(255, 255, 255, intensity * 0.8);
  noStroke();
  for (let i = 0; i < 8; i++) {
    let bubbleX = shark.x + random(-shark.size/2, shark.size/2);
    let bubbleY = shark.y + random(-20, 20) + sin(frameCount * 0.15 + i) * 5;
    let bubbleSize = 4 + pulse * 3 + random(-1, 1);
    ellipse(bubbleX, bubbleY, bubbleSize, bubbleSize);
  }
  
  // Draw ominous shark silhouette during warning
  push();
  translate(shark.x, shark.y);
  rotate(shark.angle);
  
  // Transparent shark outline
  fill(255, 0, 0, intensity * 0.3);
  stroke(255, 0, 0, intensity * 0.6);
  strokeWeight(3);
  ellipse(0, 0, shark.size * 0.8, shark.size * 0.3);
  
  // Dorsal fin breaking surface effect
  fill(60, 60, 60, intensity);
  triangle(shark.size * 0.05, -shark.size * 0.15, 
           shark.size * 0.25, -shark.size * 0.35,
           shark.size * 0.35, -shark.size * 0.1);
  
  pop();
  
  // Reset stroke
  noStroke();
}

// Cloud System
function spawnCloud() {
  if (clouds.length < MAX_CLOUDS) {
    let cloud = {
      x: -100,
      y: random(50, 200),
      size: random(40, 80),
      speed: random(0.3, 0.8),
      opacity: random(150, 200)
    };
    clouds.push(cloud);
  }
}

function drawCloud(cloud) {
  push();
  fill(255, cloud.opacity);
  noStroke();
  
  // Draw cloud using multiple overlapping ellipses
  let baseSize = cloud.size;
  ellipse(cloud.x, cloud.y, baseSize, baseSize * 0.6);
  ellipse(cloud.x + baseSize * 0.3, cloud.y, baseSize * 0.8, baseSize * 0.5);
  ellipse(cloud.x - baseSize * 0.3, cloud.y, baseSize * 0.8, baseSize * 0.5);
  ellipse(cloud.x + baseSize * 0.15, cloud.y - baseSize * 0.2, baseSize * 0.6, baseSize * 0.4);
  ellipse(cloud.x - baseSize * 0.15, cloud.y - baseSize * 0.2, baseSize * 0.6, baseSize * 0.4);
  
  pop();
}

// Fish System
function spawnFish() {
  if (fishes.length < MAX_FISHES) {
    let fish = {
      x: -50,
      y: random(CANVAS_HEIGHT - 110, CANVAS_HEIGHT - 20), // Swimming properly in ocean area
      size: random(25, 40),
      speed: random(0.8, 1.2),
      color: random(['orange', 'blue', 'pink', 'green']),
      swimOffset: 0,
      opacity: random(140, 200), // More visible in ocean water
      depth: random(0.3, 1.0) // Add depth for underwater layering effect
    };
    fishes.push(fish);
  }
}

function drawFish(fish) {
  push();
  translate(fish.x, fish.y);
  
  // Simplified, gentle swimming motion (much less shaky)
  let swimBob = sin(fish.swimOffset) * 1.5; // Reduced from 3 to 1.5
  translate(0, swimBob);
  
  // Apply depth-based scaling (fish further away appear smaller)
  let depthScale = 0.7 + fish.depth * 0.5;
  scale(depthScale);
  
  // Set fish color with depth-based opacity and tinting
  let baseOpacity = fish.opacity * (0.6 + fish.depth * 0.4); // Deeper fish are more faded
  let fishColor;
  switch(fish.color) {
    case 'orange': fishColor = color(255, 165, 0, baseOpacity); break;
    case 'blue': fishColor = color(30, 144, 255, baseOpacity); break;
    case 'pink': fishColor = color(255, 182, 193, baseOpacity); break;
    case 'green': fishColor = color(50, 205, 50, baseOpacity); break;
    default: fishColor = color(255, 165, 0, baseOpacity);
  }
  
  // Add underwater blue tint for realism
  let underwaterTint = lerpColor(fishColor, color(50, 100, 200, baseOpacity), 0.3);
  fill(underwaterTint);
  noStroke();
  
  // Fish body (stable, no rotation)
  ellipse(0, 0, fish.size, fish.size * 0.6);
  
  // Fish tail (gentle animation)
  let tailSize = fish.size * 0.4;
  let gentleTailWag = sin(fish.swimOffset * 1.2) * 2; // Much gentler tail wag
  push();
  rotate(radians(gentleTailWag));
  triangle(-fish.size/2 - tailSize/2, 0, 
           -fish.size/2, -tailSize/2, 
           -fish.size/2, tailSize/2);
  pop();
  
  // Dorsal fin (small triangle on top)
  fill(red(underwaterTint) * 0.8, green(underwaterTint) * 0.8, blue(underwaterTint) * 0.8, baseOpacity);
  triangle(fish.size * 0.1, -fish.size * 0.3, 
           fish.size * 0.3, -fish.size * 0.45,
           fish.size * 0.4, -fish.size * 0.25);
  
  // Fish eye with underwater gleam
  fill(255, baseOpacity * 0.9);
  ellipse(fish.size * 0.2, -fish.size * 0.1, fish.size * 0.15, fish.size * 0.15);
  fill(0, baseOpacity);
  ellipse(fish.size * 0.25, -fish.size * 0.1, fish.size * 0.05, fish.size * 0.05);
  
  // Add small light reflection on eye for underwater effect
  fill(255, baseOpacity * 0.7);
  ellipse(fish.size * 0.27, -fish.size * 0.12, fish.size * 0.02, fish.size * 0.02);
  
  // Add subtle fish stripes for more detail
  stroke(red(underwaterTint) * 0.7, green(underwaterTint) * 0.7, blue(underwaterTint) * 0.7, baseOpacity * 0.5);
  strokeWeight(1);
  for (let i = -1; i <= 1; i++) {
    line(fish.size * (0.1 + i * 0.15), -fish.size * 0.2, 
         fish.size * (0.1 + i * 0.15), fish.size * 0.2);
  }
  
  pop();
}

// Player Drawing System
function drawPlayer() {
  // Draw Player 1 (Yellow Smiley)
  push();
  translate(player.x, player.y);
  rotate(player.rotation);
  scale(player.sizeMultiplier); // Apply size multiplier for hotdog power-up
  
  // Face background (yellow circle)
  fill(255, 215, 0); // Gold color
  stroke(0);
  strokeWeight(1);
  ellipse(0, 0, player.size, player.size);
  
  // Eyes (two black dots)
  fill(0);
  noStroke();
  let eyeOffset = player.size * 0.2;
  let eyeSize = player.size * 0.15;
  ellipse(-eyeOffset, -eyeOffset * 0.5, eyeSize, eyeSize); // Left eye
  ellipse(eyeOffset, -eyeOffset * 0.5, eyeSize, eyeSize);  // Right eye
  
  // Smile (arc)
  stroke(0);
  strokeWeight(2);
  noFill();
  let smileRadius = player.size * 0.25;
  arc(0, eyeOffset * 0.2, smileRadius * 2, smileRadius, 0, PI);
  
  pop();
  
  // Draw Player 2 (Red Smiley) if in 2-player mode
  if (gameMode === 2) {
    push();
    translate(player2.x, player2.y);
    rotate(player2.rotation);
    scale(player2.sizeMultiplier); // Apply size multiplier for hotdog power-up
    
    // Face background (red circle)
    fill(255, 50, 50); // Bright red color
    stroke(0);
    strokeWeight(1);
    ellipse(0, 0, player2.size, player2.size);
    
    // Eyes (two black dots)
    fill(0);
    noStroke();
    let eyeOffset2 = player2.size * 0.2;
    let eyeSize2 = player2.size * 0.15;
    ellipse(-eyeOffset2, -eyeOffset2 * 0.5, eyeSize2, eyeSize2); // Left eye
    ellipse(eyeOffset2, -eyeOffset2 * 0.5, eyeSize2, eyeSize2);  // Right eye
    
    // Smile (arc)
    stroke(0);
    strokeWeight(2);
    noFill();
    let smileRadius2 = player2.size * 0.25;
    arc(0, eyeOffset2 * 0.2, smileRadius2 * 2, smileRadius2, 0, PI);
    
    pop();
  }
}

// ============================================
// COLLISION DETECTION SYSTEM
// ============================================

function checkCollision(player, obstacle) {
  // Simple bounding box collision for now
  let playerLeft = player.x - player.size / 2;
  let playerRight = player.x + player.size / 2;
  let playerTop = player.y - player.size / 2;
  let playerBottom = player.y + player.size / 2;
  
  let obstacleLeft = obstacle.x - obstacle.size;
  let obstacleRight = obstacle.x + obstacle.size;
  let obstacleTop = obstacle.y - obstacle.size;
  let obstacleBottom = obstacle.y + obstacle.size;
  
  return (playerRight > obstacleLeft && 
          playerLeft < obstacleRight && 
          playerBottom > obstacleTop && 
          playerTop < obstacleBottom);
}

function checkWallCollision(player, wall) {
  let playerLeft = player.x - player.size / 2;
  let playerRight = player.x + player.size / 2;
  let playerTop = player.y - player.size / 2;
  let playerBottom = player.y + player.size / 2;
  
  let wallLeft = wall.x;
  let wallRight = wall.x + wall.width;
  let wallTop = CANVAS_HEIGHT - wall.currentHeight;
  let wallBottom = CANVAS_HEIGHT;
  
  return (playerRight > wallLeft && 
          playerLeft < wallRight && 
          playerBottom > wallTop && 
          playerTop < wallBottom);
}

function checkStarCollision(player, star) {
  let playerLeft = player.x - player.size / 2;
  let playerRight = player.x + player.size / 2;
  let playerTop = player.y - player.size / 2;
  let playerBottom = player.y + player.size / 2;
  
  let starLeft = star.x - star.size / 2;
  let starRight = star.x + star.size / 2;
  let starTop = star.y - star.size / 2;
  let starBottom = star.y + star.size / 2;
  
  return (playerRight > starLeft && 
          playerLeft < starRight && 
          playerBottom > starTop && 
          playerTop < starBottom);
}

function checkHeartCollision(player, heart) {
  let playerLeft = player.x - player.size / 2;
  let playerRight = player.x + player.size / 2;
  let playerTop = player.y - player.size / 2;
  let playerBottom = player.y + player.size / 2;
  
  let heartLeft = heart.x - heart.size / 2;
  let heartRight = heart.x + heart.size / 2;
  let heartTop = heart.y - heart.size / 2;
  let heartBottom = heart.y + heart.size / 2;
  
  return (playerRight > heartLeft && 
          playerLeft < heartRight && 
          playerBottom > heartTop && 
          playerTop < heartBottom);
}

function checkHotdogCollision(player, hotdog) {
  // Use current player size with multiplier for collision detection
  let currentSize = player.size * player.sizeMultiplier;
  
  let playerLeft = player.x - currentSize / 2;
  let playerRight = player.x + currentSize / 2;
  let playerTop = player.y - currentSize / 2;
  let playerBottom = player.y + currentSize / 2;
  
  let hotdogLeft = hotdog.x - hotdog.size / 2;
  let hotdogRight = hotdog.x + hotdog.size / 2;
  let hotdogTop = hotdog.y - hotdog.size / 2;
  let hotdogBottom = hotdog.y + hotdog.size / 2;
  
  return (playerRight > hotdogLeft && 
          playerLeft < hotdogRight && 
          playerBottom > hotdogTop && 
          playerTop < hotdogBottom);
}

function checkSharkCollision(player, shark) {
  // Use current player size with multiplier for collision detection
  let currentSize = player.size * player.sizeMultiplier;
  
  // Calculate distance between player and shark centers
  let distance = sqrt((player.x - shark.x) * (player.x - shark.x) + 
                     (player.y - shark.y) * (player.y - shark.y));
  
  // Collision occurs when distance is less than combined radii
  let collisionDistance = (currentSize / 2) + (shark.size / 2);
  
  return distance < collisionDistance;
}

// Shark update logic - natural swimming behavior with 2-second attack timer
function updateShark(shark) {
  shark.timer++;
  shark.swimOffset += 0.15; // For swimming animation
  
  if (shark.state === 'warning') {
    // Show bubbles and fin, gradually open mouth
    shark.mouthOpenness = min(shark.mouthOpenness + 0.02, 0.3);
    
    if (shark.timer >= SHARK_WARNING_TIME) {
      shark.state = 'attacking';
      shark.timer = 0;
      shark.attackTimer = 0; // Reset attack timer
    }
  } else if (shark.state === 'attacking') {
    // Increment attack timer
    shark.attackTimer++;
    
    // Check if shark has been attacking for 2 seconds (120 frames)
    if (shark.attackTimer >= 120) {
      shark.state = 'expired'; // Mark for removal
      return;
    }
    
    // Shark swims toward target with speed increase
    let currentSpeed = shark.speed + (shark.timer * 0.02); // Accelerate as it gets closer
    
    // Move toward target position
    let deltaX = shark.targetX - shark.x;
    let deltaY = shark.targetY - shark.y;
    let distance = sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > 5) {
      // Normalize direction and apply speed
      shark.x += (deltaX / distance) * currentSpeed;
      shark.y += (deltaY / distance) * currentSpeed;
      
      // Update angle based on movement direction
      shark.angle = atan2(deltaY, deltaX);
      
      // Open mouth wider as shark gets more aggressive
      shark.mouthOpenness = min(shark.mouthOpenness + 0.05, 1.0);
    } else {
      // Shark has reached target, continue past screen
      shark.y -= currentSpeed * 2; // Continue upward
      shark.mouthOpenness = max(shark.mouthOpenness - 0.03, 0.5); // Start closing mouth
    }
  }
}

// ============================================
// SPACE RUNNER - VISUAL & AUDIO SYSTEMS
// ============================================
// מערכות גרפיקה, אנימציות וקולות למשחק החלל

// ============================================
// SPACE AUDIO SYSTEM
// ============================================

function initializeSpaceAudio() {
  try {
    if (thrusterSound === null) {
      // Start Tone.js audio context
      Tone.start();
      
      // Create retro space-themed sound effects
      createRetroSoundEffects();
      
      // Initialize dynamic space music system
      initializeSpaceMusic();
      
      console.log("Retro space audio system initialized");
    }
  } catch (error) {
    console.log("Space audio initialization failed:", error);
  }
}

function createRetroSoundEffects() {
  // Laser shooting sounds - PEW PEW!
  thrusterSound = new Tone.Synth({
    oscillator: { type: "square" },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
  }).toDestination();
  
  // Collect sound - DING!
  collectSound = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.3 }
  }).toDestination();
  
  // Explosion sound - BOOM!
  explosionSound = new Tone.NoiseSynth({
    noise: { type: "pink" },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.2 }
  }).toDestination();
  
  // Power-up sound - WHOOSH!
  powerUpSound = new Tone.Synth({
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.1, decay: 0.3, sustain: 0.2, release: 0.4 }
  }).toDestination();
  
  // Create additional retro sound effects
  createExtraSoundEffects();
}

function createExtraSoundEffects() {
  // Monster hit sound
  window.monsterHitSound = new Tone.Synth({
    oscillator: { type: "square" },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.05 }
  }).toDestination();
  
  // Heart collect sound
  window.heartSound = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.05, decay: 0.4, sustain: 0.1, release: 0.5 }
  }).toDestination();
  
  // Warning sound for giant monsters
  window.warningSound = new Tone.Oscillator(200, "square").toDestination();
  
  // Engine thruster sound
  window.engineSound = new Tone.Oscillator(120, "sawtooth").toDestination();
  
  // Menu navigation sounds
  window.menuClickSound = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.05 }
  }).toDestination();
  
  console.log("Extra retro sound effects created");
}

function initializeSpaceMusic() {
  try {
    // Create space-themed synths
    const spaceLead = new Tone.MonoSynth({
      oscillator: { type: "sawtooth" },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.4, release: 0.8 }
    }).toDestination();
    
    const spaceBass = new Tone.FMSynth({
      harmonicity: 0.5,
      modulationIndex: 2,
      envelope: { attack: 0.05, decay: 0.3, sustain: 0.6, release: 1.0 }
    }).toDestination();
    
    const spacePad = new Tone.PolySynth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.8, decay: 0.4, sustain: 0.6, release: 2.0 }
    }).toDestination();
    
    // Set volumes
    spaceLead.volume.value = -15;
    spaceBass.volume.value = -18;
    spacePad.volume.value = -20;
    
    // Space menu music - ambient and welcoming
    const menuMelody = ["C4", "E4", "G4", "E4", "F4", "A4", "C5", "A4"];
    const menuBass = ["C2", "F2", "G2", "C2"];
    const menuPad = [["C4", "E4", "G4"], ["F4", "A4", "C5"]];
    
    // Space gameplay music - energetic and driving
    const gameplayMelody = ["E4", "F#4", "G#4", "B4", "C#5", "B4", "G#4", "F#4",
                           "D#4", "E4", "F#4", "G#4", "A4", "G#4", "F#4", "E4"];
    const gameplayBass = ["E2", "A2", "B2", "E2", "C#2", "F#2", "B2", "E2"];
    
    // Space game over music - melancholic but hopeful
    const gameOverMelody = ["E4", "D4", "C4", "D4", "E4", "G4", "F4", "E4"];
    const gameOverBass = ["A2", "F2", "C2", "G2"];
    
    console.log("Space music system created");
  } catch (error) {
    console.log("Space music creation failed:", error);
  }
}

function startSpaceMusic(trackName) {
  try {
    currentMusicTrack = trackName;
    console.log(`Space music track '${trackName}' started`);
  } catch (error) {
    console.log("Failed to start space music:", error);
  }
}

function playThrusterSound() {
  try {
    if (thrusterSound) {
      playSpaceSound(thrusterSound, 0.05, 0.1);
    }
  } catch (error) {
    console.log("Thruster sound failed:", error);
  }
}

function playCollectSound() {
  try {
    if (collectSound) {
      playSpaceSound(collectSound, 0.1, 0.2);
    }
  } catch (error) {
    console.log("Collect sound failed:", error);
  }
}

function playExplosionSound() {
  try {
    if (explosionSound) {
      playSpaceSound(explosionSound, 0.15, 0.3);
    }
  } catch (error) {
    console.log("Explosion sound failed:", error);
  }
}

function playPowerUpSound() {
  try {
    if (powerUpSound) {
      playSpaceSound(powerUpSound, 0.12, 0.4);
    }
  } catch (error) {
    console.log("Power-up sound failed:", error);
  }
}

function playSpaceSound(oscillator, volume, duration) {
  try {
    if (oscillator && oscillator.start && oscillator.stop) {
      oscillator.volume.value = Tone.gainToDb(volume);
      oscillator.start();
      oscillator.stop(Tone.now() + duration);
    }
  } catch (error) {
    console.log("Space audio playback failed:", error);
  }
}

// ============================================
// RETRO SOUND EFFECTS FUNCTIONS
// ============================================

function playLaserSound() {
  try {
    if (thrusterSound) {
      // PEW PEW! - Classic laser sound
      thrusterSound.triggerAttackRelease("C5", "8n");
    }
  } catch (error) {
    console.log("Laser sound failed:", error);
  }
}

function playMonsterHitSound() {
  try {
    if (window.monsterHitSound) {
      // ZAP! - Monster hit sound
      window.monsterHitSound.triggerAttackRelease("F4", "16n");
    }
  } catch (error) {
    console.log("Monster hit sound failed:", error);
  }
}

function playHeartCollectSound() {
  try {
    if (window.heartSound) {
      // Sweet heart collect melody
      window.heartSound.triggerAttackRelease("C5", "4n");
      setTimeout(() => {
        window.heartSound.triggerAttackRelease("E5", "4n");
      }, 150);
      setTimeout(() => {
        window.heartSound.triggerAttackRelease("G5", "2n");
      }, 300);
    }
  } catch (error) {
    console.log("Heart collect sound failed:", error);
  }
}

function playWarningSound() {
  try {
    if (window.warningSound) {
      // Warning beep for giant monsters
      playSpaceSound(window.warningSound, 0.1, 0.3);
    }
  } catch (error) {
    console.log("Warning sound failed:", error);
  }
}

function playEngineSound() {
  try {
    if (window.engineSound) {
      // Engine thruster sound
      playSpaceSound(window.engineSound, 0.08, 0.2);
    }
  } catch (error) {
    console.log("Engine sound failed:", error);
  }
}

function playMenuClickSound() {
  try {
    if (window.menuClickSound) {
      // Nice UI click sound
      window.menuClickSound.triggerAttackRelease("A4", "32n");
    }
  } catch (error) {
    console.log("Menu click sound failed:", error);
  }
}

function playRetroExplosionSound() {
  try {
    if (explosionSound) {
      // BOOM! - Retro explosion
      explosionSound.triggerAttack();
      explosionSound.triggerRelease("+0.3");
    }
  } catch (error) {
    console.log("Retro explosion sound failed:", error);
  }
}

function playCollectStarSound() {
  try {
    if (collectSound) {
      // DING! - Star collect with rising tone
      collectSound.triggerAttackRelease("G4", "8n");
    }
  } catch (error) {
    console.log("Collect star sound failed:", error);
  }
}

function playShieldActivateSound() {
  try {
    if (powerUpSound) {
      // WHOOSH! - Shield activation with sweep
      powerUpSound.triggerAttackRelease("A3", "4n");
      setTimeout(() => {
        powerUpSound.triggerAttackRelease("E4", "4n");  
      }, 100);
    }
  } catch (error) {
    console.log("Shield activate sound failed:", error);
  }
}

// ============================================
// DYNAMIC RETRO MUSIC SYSTEM
// ============================================

let musicSynths = null;
let currentTrack = null;
let musicLoop = null;

function createRetroMusic() {
  if (musicSynths !== null) return;
  
  try {
    // Create retro 8-bit style synthesizers
    musicSynths = {
      lead: new Tone.Synth({
        oscillator: { type: "square" },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.2 }
      }).toDestination(),
      
      bass: new Tone.Synth({
        oscillator: { type: "triangle" },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.3 }
      }).toDestination(),
      
      arp: new Tone.Synth({
        oscillator: { type: "square" },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.1 }
      }).toDestination()
    };
    
    // Set retro volumes
    musicSynths.lead.volume.value = -12;
    musicSynths.bass.volume.value = -8;
    musicSynths.arp.volume.value = -15;
    
    console.log("Retro music synths created");
  } catch (error) {
    console.log("Retro music creation failed:", error);
  }
}

function startRetroTrack(trackName) {
  if (!musicSynths) createRetroMusic();
  if (currentTrack === trackName) return;
  
  stopRetroMusic();
  currentTrack = trackName;
  
  try {
    if (trackName === 'menu') {
      playMenuMusic();
    } else if (trackName === 'gameplay') {
      playGameplayMusic();
    } else if (trackName === 'gameOver') {
      playGameOverMusic();
    }
  } catch (error) {
    console.log("Failed to start retro track:", error);
  }
}

function playMenuMusic() {
  // Classic arcade menu music - welcoming and nostalgic
  const menuMelody = ["C4", "E4", "G4", "C5", "G4", "E4", "C4", "G3"];
  const menuBass = ["C2", "C2", "F2", "F2", "G2", "G2", "C2", "C2"];
  
  let melodyIndex = 0;
  let bassIndex = 0;
  
  musicLoop = new Tone.Loop((time) => {
    // Play melody
    musicSynths.lead.triggerAttackRelease(menuMelody[melodyIndex], "4n", time);
    melodyIndex = (melodyIndex + 1) % menuMelody.length;
    
    // Play bass every 2 beats
    if (melodyIndex % 2 === 0) {
      musicSynths.bass.triggerAttackRelease(menuBass[bassIndex], "2n", time);
      bassIndex = (bassIndex + 1) % menuBass.length;
    }
  }, "4n").start();
  
  Tone.Transport.start();
}

function playGameplayMusic() {
  // Fast-paced action music - gets more intense with game speed
  const gameplayMelody = ["E4", "F#4", "G#4", "B4", "E5", "B4", "G#4", "F#4"];
  const gameplayBass = ["E2", "E2", "A2", "A2", "B2", "B2", "E2", "E2"];
  const gameplayArp = ["E3", "G#3", "B3", "E4"];
  
  let melodyIndex = 0;
  let bassIndex = 0;
  let arpIndex = 0;
  
  musicLoop = new Tone.Loop((time) => {
    // Adjust tempo based on game speed
    let currentSpeed = typeof gameSpeed !== 'undefined' ? gameSpeed : 1;
    let adjustedTempo = 140 + (currentSpeed - 1) * 20; // BPM increases with game speed
    Tone.Transport.bpm.value = Math.min(adjustedTempo, 200);
    
    // Play melody
    musicSynths.lead.triggerAttackRelease(gameplayMelody[melodyIndex], "8n", time);
    melodyIndex = (melodyIndex + 1) % gameplayMelody.length;
    
    // Play bass
    if (melodyIndex % 2 === 0) {
      musicSynths.bass.triggerAttackRelease(gameplayBass[bassIndex], "4n", time);
      bassIndex = (bassIndex + 1) % gameplayBass.length;
    }
    
    // Play arpeggios
    if (melodyIndex % 4 === 0) {
      musicSynths.arp.triggerAttackRelease(gameplayArp[arpIndex], "16n", time);
      arpIndex = (arpIndex + 1) % gameplayArp.length;
    }
  }, "8n").start();
  
  Tone.Transport.start();
}

function playGameOverMusic() {
  // Melancholic but not depressing game over music
  const gameOverMelody = ["E4", "D4", "C4", "D4", "E4", "G4", "F4", "E4"];
  const gameOverBass = ["A2", "F2", "C2", "G2"];
  
  let melodyIndex = 0;
  let bassIndex = 0;
  
  musicLoop = new Tone.Loop((time) => {
    // Slow tempo for contemplation
    Tone.Transport.bpm.value = 80;
    
    // Play melody
    musicSynths.lead.triggerAttackRelease(gameOverMelody[melodyIndex], "2n", time);
    melodyIndex = (melodyIndex + 1) % gameOverMelody.length;
    
    // Play bass every 4 beats
    if (melodyIndex % 4 === 0) {
      musicSynths.bass.triggerAttackRelease(gameOverBass[bassIndex], "1n", time);
      bassIndex = (bassIndex + 1) % gameOverBass.length;
    }
  }, "2n").start();
  
  Tone.Transport.start();
}

function stopRetroMusic() {
  try {
    if (musicLoop) {
      musicLoop.stop();
      musicLoop = null;
    }
    Tone.Transport.stop();
    Tone.Transport.cancel();
    currentTrack = null;
  } catch (error) {
    console.log("Failed to stop retro music:", error);
  }
}

// ============================================
// SPACE BACKGROUND SYSTEM
// ============================================

function drawSpaceBackground() {
  // Generate space background elements once
  if (!backgroundGenerated) {
    generateSpaceBackground();
  }
  
  // Draw deep space gradient
  for (let i = 0; i < CANVAS_HEIGHT; i += 4) {
    let inter = map(i, 0, CANVAS_HEIGHT, 0, 1);
    // Space gradient from deep blue to black
    let spaceColor = lerpColor(color(10, 10, 40), color(0, 0, 0), inter);
    fill(spaceColor);
    noStroke();
    rect(0, i, CANVAS_WIDTH, 4);
  }
  
  // Draw distant stars
  drawBackgroundStars();
  
  // Draw nebulas
  drawNebulas();
  
  // Draw distant planets
  drawPlanets();
}

function generateSpaceBackground() {
  // Generate scrolling star field with multiple layers for parallax effect
  backgroundStars = [];
  for (let i = 0; i < 200; i++) {
    let starSize = random(1, 5);
    // Assign speed based on star size - smaller/closer stars move faster
    let speed = starSize < 2 ? random(2, 4) :    // Small stars (close) - fast
               starSize < 3 ? random(1, 2) :    // Medium stars - medium speed
               random(0.3, 1);                  // Large stars (far) - slow
    
    backgroundStars.push({
      x: random(CANVAS_WIDTH * 2), // Spread across wider area for continuous generation
      y: random(CANVAS_HEIGHT),
      size: starSize,
      brightness: random(100, 255),
      twinklePhase: random(TWO_PI),
      speed: speed // Parallax scrolling speed
    });
  }
  
  // Generate scrolling nebulas
  nebulas = [];
  for (let i = 0; i < 4; i++) {
    nebulas.push({
      x: random(CANVAS_WIDTH * 1.5),
      y: random(CANVAS_HEIGHT),
      size: random(200, 400),
      color: random([
        color(100, 50, 200, 50),  // Purple nebula
        color(200, 50, 100, 50),  // Pink nebula
        color(50, 100, 200, 50)   // Blue nebula
      ]),
      speed: random(0.2, 0.5), // Slow parallax movement
      drift: random(0.1, 0.3)
    });
  }
  
  // Generate scrolling distant planets
  planets = [];
  for (let i = 0; i < 3; i++) {
    planets.push({
      x: random(CANVAS_WIDTH * 1.5),
      y: random(CANVAS_HEIGHT),
      size: random(80, 150),
      color: random([
        color(150, 100, 50),   // Brown planet
        color(100, 150, 200),  // Blue planet
        color(200, 100, 100)   // Red planet
      ]),
      rings: random() < 0.5, // 50% chance of rings
      speed: random(0.1, 0.3), // Very slow parallax (distant objects)
      drift: random(0.05, 0.15)
    });
  }
  
  backgroundGenerated = true;
}

function drawBackgroundStars() {
  // Update and draw scrolling stars with parallax effect
  for (let i = backgroundStars.length - 1; i >= 0; i--) {
    let star = backgroundStars[i];
    
    // Move star left based on game speed and star's individual speed
    star.x -= star.speed * gameSpeed;
    
    // Remove stars that have moved off screen
    if (star.x < -10) {
      backgroundStars.splice(i, 1);
      continue;
    }
    
    // Draw the star
    let twinkle = sin(frameCount * 0.05 + star.twinklePhase) * 0.3 + 0.7;
    let brightness = star.brightness * twinkle;
    
    fill(brightness, brightness, brightness);
    noStroke();
    ellipse(star.x, star.y, star.size, star.size);
    
    // Add cross sparkle for larger stars
    if (star.size > 2) {
      stroke(brightness, brightness, brightness, 100);
      strokeWeight(1);
      line(star.x - star.size * 2, star.y, star.x + star.size * 2, star.y);
      line(star.x, star.y - star.size * 2, star.x, star.y + star.size * 2);
      noStroke();
    }
  }
  
  // Add new stars from the right side to maintain star field
  while (backgroundStars.length < 200) {
    let starSize = random(1, 5);
    let speed = starSize < 2 ? random(2, 4) :    // Small stars (close) - fast
               starSize < 3 ? random(1, 2) :    // Medium stars - medium speed  
               random(0.3, 1);                  // Large stars (far) - slow
    
    backgroundStars.push({
      x: CANVAS_WIDTH + random(0, 50), // Spawn just off right edge
      y: random(CANVAS_HEIGHT),
      size: starSize,
      brightness: random(100, 255),
      twinklePhase: random(TWO_PI),
      speed: speed
    });
  }
}

function drawNebulas() {
  // Update and draw scrolling nebulas with parallax effect
  for (let i = nebulas.length - 1; i >= 0; i--) {
    let nebula = nebulas[i];
    
    // Move nebula left based on game speed and its individual speed
    nebula.x -= nebula.speed * gameSpeed;
    
    // Remove nebulas that have moved off screen
    if (nebula.x < -nebula.size) {
      nebulas.splice(i, 1);
      continue;
    }
    
    push();
    // Slowly drift nebulas
    let driftX = sin(frameCount * 0.01 + nebula.drift) * 50;
    translate(nebula.x + driftX, nebula.y);
    
    fill(nebula.color);
    noStroke();
    
    // Draw nebula with multiple overlapping ellipses
    for (let j = 0; j < 5; j++) {
      let size = nebula.size + sin(frameCount * 0.02 + j) * 20;
      let offsetX = sin(frameCount * 0.015 + j * 2) * 30;
      let offsetY = cos(frameCount * 0.015 + j * 2) * 20;
      ellipse(offsetX, offsetY, size, size * 0.6);
    }
    pop();
  }
  
  // Add new nebulas from the right side to maintain nebula field
  while (nebulas.length < 4) {
    nebulas.push({
      x: CANVAS_WIDTH + random(100, 300), // Spawn off right edge
      y: random(CANVAS_HEIGHT),
      size: random(200, 400),
      color: random([
        color(100, 50, 200, 50),  // Purple nebula
        color(200, 50, 100, 50),  // Pink nebula
        color(50, 100, 200, 50)   // Blue nebula
      ]),
      speed: random(0.2, 0.5), // Slow parallax movement
      drift: random(0.1, 0.3)
    });
  }
}

function drawPlanets() {
  // Update and draw scrolling planets with parallax effect
  for (let i = planets.length - 1; i >= 0; i--) {
    let planet = planets[i];
    
    // Move planet left based on game speed and its individual speed
    planet.x -= planet.speed * gameSpeed;
    
    // Remove planets that have moved off screen
    if (planet.x < -planet.size) {
      planets.splice(i, 1);
      continue;
    }
    
    push();
    // Slowly drift planets
    let driftX = sin(frameCount * 0.005 + planet.drift) * 20;
    translate(planet.x + driftX, planet.y);
    
    // Draw planet
    fill(planet.color);
    stroke(red(planet.color) + 50, green(planet.color) + 50, blue(planet.color) + 50);
    strokeWeight(2);
    ellipse(0, 0, planet.size, planet.size);
    
    // Add surface details
    fill(red(planet.color) - 30, green(planet.color) - 30, blue(planet.color) - 30);
    noStroke();
    ellipse(-planet.size * 0.2, -planet.size * 0.1, planet.size * 0.3, planet.size * 0.2);
    ellipse(planet.size * 0.1, planet.size * 0.2, planet.size * 0.4, planet.size * 0.3);
    
    // Draw rings if planet has them
    if (planet.rings) {
      stroke(255, 255, 255, 150);
      strokeWeight(3);
      noFill();
      ellipse(0, 0, planet.size * 1.8, planet.size * 0.3);
      ellipse(0, 0, planet.size * 2.0, planet.size * 0.4);
    }
    
    pop();
  }
  
  // Add new planets from the right side to maintain planet field
  while (planets.length < 3) {
    planets.push({
      x: CANVAS_WIDTH + random(200, 500), // Spawn far off right edge
      y: random(CANVAS_HEIGHT),
      size: random(80, 150),
      color: random([
        color(150, 100, 50),   // Brown planet
        color(100, 150, 200),  // Blue planet
        color(200, 100, 100)   // Red planet
      ]),
      rings: random() < 0.5, // 50% chance of rings
      speed: random(0.1, 0.3), // Very slow parallax (distant objects)
      drift: random(0.05, 0.15)
    });
  }
}

// ============================================
// SPACESHIP RENDERING
// ============================================

function drawSpaceship(ship, shipColor) {
  push();
  translate(ship.x, ship.y);
  
  // Draw shield if active
  if (ship.shieldActive) {
    drawShield(ship);
  }
  
  // Draw thruster flames
  drawThrusterFlames(ship);
  
  // Draw engine trails/particles
  drawEngineTrails(ship);
  
  // Advanced spaceship body with metallic gradients
  drawAdvancedSpaceshipBody(ship, shipColor);
  
  // Draw detailed wings
  drawSpaceshipWings(ship, shipColor);
  
  // Draw advanced cockpit
  drawAdvancedCockpit(ship);
  
  // Draw engine details
  drawAdvancedEngines(ship, shipColor);
  
  // Draw navigation lights
  drawNavigationLights(ship);
  
  // Draw decorative details
  drawSpaceshipDetails(ship, shipColor);
  
  pop();
}

function drawAdvancedSpaceshipBody(ship, shipColor) {
  // Create metallic gradient effect
  let pulse = sin(frameCount * 0.02) * 0.1 + 0.9; // Subtle breathing effect
  let bodySize = ship.size * pulse;
  
  // Main body shadow (depth effect)
  fill(red(shipColor) * 0.3, green(shipColor) * 0.3, blue(shipColor) * 0.3, 150);
  noStroke();
  beginShape();
  vertex(bodySize/2 + 2, 2);
  bezierVertex(bodySize * 0.1 + 2, -bodySize * 0.4 + 2, -bodySize * 0.3 + 2, -bodySize * 0.3 + 2, -bodySize/2 + 2, -bodySize/4 + 2);
  bezierVertex(-bodySize * 0.6 + 2, 2, -bodySize * 0.6 + 2, 2, -bodySize/2 + 2, bodySize/4 + 2);
  bezierVertex(-bodySize * 0.3 + 2, bodySize * 0.3 + 2, bodySize * 0.1 + 2, bodySize * 0.4 + 2, bodySize/2 + 2, 2);
  endShape(CLOSE);
  
  // Main body with gradient
  for (let i = 0; i < 5; i++) {
    let alpha = map(i, 0, 4, 200, 50);
    let size = map(i, 0, 4, 1.0, 0.7);
    fill(red(shipColor) + i * 10, green(shipColor) + i * 8, blue(shipColor) + i * 12, alpha);
    noStroke();
    
    beginShape();
    vertex(bodySize/2 * size, 0);
    bezierVertex(bodySize * 0.1 * size, -bodySize * 0.4 * size, -bodySize * 0.3 * size, -bodySize * 0.3 * size, -bodySize/2 * size, -bodySize/4 * size);
    bezierVertex(-bodySize * 0.6 * size, 0, -bodySize * 0.6 * size, 0, -bodySize/2 * size, bodySize/4 * size);
    bezierVertex(-bodySize * 0.3 * size, bodySize * 0.3 * size, bodySize * 0.1 * size, bodySize * 0.4 * size, bodySize/2 * size, 0);
    endShape(CLOSE);
  }
  
  // Metallic highlights
  stroke(255, 255, 255, 180);
  strokeWeight(2);
  noFill();
  line(bodySize * 0.3, -bodySize * 0.1, bodySize * 0.1, -bodySize * 0.2);
  line(bodySize * 0.3, bodySize * 0.1, bodySize * 0.1, bodySize * 0.2);
  
  // Hull details
  fill(red(shipColor) + 30, green(shipColor) + 30, blue(shipColor) + 30);
  noStroke();
  ellipse(bodySize * 0.2, 0, bodySize * 0.15, bodySize * 0.08);
  ellipse(-bodySize * 0.1, -bodySize * 0.05, bodySize * 0.1, bodySize * 0.05);
  ellipse(-bodySize * 0.1, bodySize * 0.05, bodySize * 0.1, bodySize * 0.05);
}

function drawSpaceshipWings(ship, shipColor) {
  let bodySize = ship.size;
  
  // Wing shadows
  fill(red(shipColor) * 0.4, green(shipColor) * 0.4, blue(shipColor) * 0.4, 120);
  noStroke();
  
  // Top wing shadow
  beginShape();
  vertex(-bodySize * 0.2 + 1, -bodySize * 0.2 + 1);
  bezierVertex(-bodySize * 0.4 + 1, -bodySize * 0.35 + 1, -bodySize * 0.5 + 1, -bodySize * 0.3 + 1, -bodySize * 0.3 + 1, -bodySize * 0.15 + 1);
  vertex(-bodySize * 0.15 + 1, -bodySize * 0.1 + 1);
  endShape(CLOSE);
  
  // Bottom wing shadow
  beginShape();
  vertex(-bodySize * 0.2 + 1, bodySize * 0.2 + 1);
  bezierVertex(-bodySize * 0.4 + 1, bodySize * 0.35 + 1, -bodySize * 0.5 + 1, bodySize * 0.3 + 1, -bodySize * 0.3 + 1, bodySize * 0.15 + 1);
  vertex(-bodySize * 0.15 + 1, bodySize * 0.1 + 1);
  endShape(CLOSE);
  
  // Main wings with gradient
  for (let i = 0; i < 3; i++) {
    let alpha = map(i, 0, 2, 200, 100);
    let size = map(i, 0, 2, 1.0, 0.8);
    fill(red(shipColor) + i * 15, green(shipColor) + i * 12, blue(shipColor) + i * 18, alpha);
    noStroke();
    
    // Top wing
    beginShape();
    vertex(-bodySize * 0.2 * size, -bodySize * 0.2 * size);
    bezierVertex(-bodySize * 0.4 * size, -bodySize * 0.35 * size, -bodySize * 0.5 * size, -bodySize * 0.3 * size, -bodySize * 0.3 * size, -bodySize * 0.15 * size);
    vertex(-bodySize * 0.15 * size, -bodySize * 0.1 * size);
    endShape(CLOSE);
    
    // Bottom wing
    beginShape();
    vertex(-bodySize * 0.2 * size, bodySize * 0.2 * size);
    bezierVertex(-bodySize * 0.4 * size, bodySize * 0.35 * size, -bodySize * 0.5 * size, bodySize * 0.3 * size, -bodySize * 0.3 * size, bodySize * 0.15 * size);
    vertex(-bodySize * 0.15 * size, bodySize * 0.1 * size);
    endShape(CLOSE);
  }
  
  // Wing edge highlights
  stroke(255, 255, 255, 150);
  strokeWeight(1.5);
  noFill();
  
  // Top wing highlight
  beginShape();
  vertex(-bodySize * 0.2, -bodySize * 0.2);
  bezierVertex(-bodySize * 0.35, -bodySize * 0.32, -bodySize * 0.45, -bodySize * 0.28, -bodySize * 0.3, -bodySize * 0.15);
  endShape();
  
  // Bottom wing highlight
  beginShape();
  vertex(-bodySize * 0.2, bodySize * 0.2);
  bezierVertex(-bodySize * 0.35, bodySize * 0.32, -bodySize * 0.45, bodySize * 0.28, -bodySize * 0.3, bodySize * 0.15);
  endShape();
}

function drawAdvancedCockpit(ship) {
  let bodySize = ship.size;
  
  // Cockpit frame
  stroke(200, 220, 255, 200);
  strokeWeight(2);
  fill(50, 100, 200, 180);
  ellipse(bodySize * 0.15, 0, bodySize * 0.35, bodySize * 0.25);
  
  // Inner cockpit glass
  fill(100, 200, 255, 120);
  noStroke();
  ellipse(bodySize * 0.15, 0, bodySize * 0.3, bodySize * 0.2);
  
  // Cockpit reflection
  fill(255, 255, 255, 80);
  ellipse(bodySize * 0.2, -bodySize * 0.05, bodySize * 0.15, bodySize * 0.08);
  
  // Cockpit interior details
  fill(255, 255, 100, 60);
  ellipse(bodySize * 0.12, 0, bodySize * 0.08, bodySize * 0.05);
  
  // HUD elements
  stroke(0, 255, 255, 150);
  strokeWeight(1);
  noFill();
  ellipse(bodySize * 0.15, 0, bodySize * 0.25, bodySize * 0.15);
  
  // Crosshair in cockpit
  line(bodySize * 0.1, 0, bodySize * 0.2, 0);
  line(bodySize * 0.15, -bodySize * 0.05, bodySize * 0.15, bodySize * 0.05);
}

function drawAdvancedEngines(ship, shipColor) {
  let bodySize = ship.size;
  
  // Engine housings with metallic effect
  for (let i = 0; i < 2; i++) {
    let alpha = map(i, 0, 1, 180, 100);
    let size = map(i, 0, 1, 1.0, 0.8);
    fill(red(shipColor) + i * 20, green(shipColor) + i * 15, blue(shipColor) + i * 25, alpha);
    stroke(255, 255, 255, 100);
    strokeWeight(1);
    
    // Top engine
    ellipse(-bodySize * 0.45 * size, -bodySize * 0.15 * size, bodySize * 0.12 * size, bodySize * 0.08 * size);
    // Bottom engine
    ellipse(-bodySize * 0.45 * size, bodySize * 0.15 * size, bodySize * 0.12 * size, bodySize * 0.08 * size);
  }
  
  // Engine cores
  fill(100, 200, 255, 150);
  noStroke();
  ellipse(-bodySize * 0.45, -bodySize * 0.15, bodySize * 0.08, bodySize * 0.05);
  ellipse(-bodySize * 0.45, bodySize * 0.15, bodySize * 0.08, bodySize * 0.05);
  
  // Engine glow when thrusting
  if (ship.thrusterOffset > 0) {
    fill(0, 150, 255, ship.thrusterOffset * 100);
    ellipse(-bodySize * 0.45, -bodySize * 0.15, bodySize * 0.15, bodySize * 0.1);
    ellipse(-bodySize * 0.45, bodySize * 0.15, bodySize * 0.15, bodySize * 0.1);
  }
  
  // Ventilation grilles
  stroke(255, 255, 255, 100);
  strokeWeight(0.5);
  for (let i = 0; i < 4; i++) {
    let offset = i * bodySize * 0.015;
    line(-bodySize * 0.5 + offset, -bodySize * 0.18, -bodySize * 0.4 + offset, -bodySize * 0.12);
    line(-bodySize * 0.5 + offset, bodySize * 0.18, -bodySize * 0.4 + offset, bodySize * 0.12);
  }
}

function drawNavigationLights(ship) {
  let bodySize = ship.size;
  let blink = sin(frameCount * 0.2) > 0;
  
  // Port (left/red) navigation light
  fill(blink ? 255 : 150, 0, 0, blink ? 255 : 100);
  noStroke();
  ellipse(-bodySize * 0.3, bodySize * 0.25, bodySize * 0.04, bodySize * 0.04);
  
  // Starboard (right/green) navigation light  
  fill(0, blink ? 255 : 150, 0, blink ? 255 : 100);
  ellipse(-bodySize * 0.3, -bodySize * 0.25, bodySize * 0.04, bodySize * 0.04);
  
  // Front white strobe
  let strobe = sin(frameCount * 0.5) > 0.7;
  if (strobe) {
    fill(255, 255, 255, 255);
    ellipse(bodySize * 0.4, 0, bodySize * 0.06, bodySize * 0.06);
    
    // Strobe glow
    fill(255, 255, 255, 100);
    ellipse(bodySize * 0.4, 0, bodySize * 0.12, bodySize * 0.12);
  }
  
  // Rear beacon
  fill(255, 100, 0, sin(frameCount * 0.3) * 50 + 100);
  ellipse(-bodySize * 0.5, 0, bodySize * 0.03, bodySize * 0.03);
}

function drawSpaceshipDetails(ship, shipColor) {
  let bodySize = ship.size;
  
  // Hull paneling lines
  stroke(255, 255, 255, 80);
  strokeWeight(0.8);
  noFill();
  
  // Panel lines on body
  line(bodySize * 0.1, -bodySize * 0.15, bodySize * 0.3, -bodySize * 0.05);
  line(bodySize * 0.1, bodySize * 0.15, bodySize * 0.3, bodySize * 0.05);
  line(-bodySize * 0.1, -bodySize * 0.08, bodySize * 0.05, -bodySize * 0.12);
  line(-bodySize * 0.1, bodySize * 0.08, bodySize * 0.05, bodySize * 0.12);
  
  // Ship identification numbers
  fill(255, 255, 255, 150);
  textAlign(CENTER, CENTER);
  textSize(bodySize * 0.08);
  
  // Different numbers for different colored ships
  if (red(shipColor) > blue(shipColor)) {
    text("02", -bodySize * 0.05, 0); // Red ship
  } else {
    text("01", -bodySize * 0.05, 0); // Blue ship
  }
  
  // Decorative racing stripes
  stroke(255, 255, 255, 100);
  strokeWeight(1.5);
  line(bodySize * 0.2, -bodySize * 0.02, -bodySize * 0.2, -bodySize * 0.02);
  line(bodySize * 0.2, bodySize * 0.02, -bodySize * 0.2, bodySize * 0.02);
  
  // Antenna
  stroke(200, 200, 200, 180);
  strokeWeight(1);
  line(-bodySize * 0.4, -bodySize * 0.05, -bodySize * 0.35, -bodySize * 0.12);
  
  // Small details
  fill(red(shipColor) + 50, green(shipColor) + 40, blue(shipColor) + 60);
  noStroke();
  ellipse(bodySize * 0.05, -bodySize * 0.08, bodySize * 0.03, bodySize * 0.02);
  ellipse(bodySize * 0.05, bodySize * 0.08, bodySize * 0.03, bodySize * 0.02);
}

function drawEngineTrails(ship) {
  if (ship.thrusterOffset > 0) {
    let bodySize = ship.size;
    
    // Particle trail effect
    for (let i = 0; i < 8; i++) {
      let trailX = ship.x - bodySize * 0.6 - i * 5;
      let trailY = ship.y + random(-bodySize * 0.2, bodySize * 0.2);
      let alpha = map(i, 0, 7, ship.thrusterOffset * 150, 0);
      
      fill(100, 200, 255, alpha);
      noStroke();
      ellipse(trailX - ship.x, trailY - ship.y, bodySize * 0.04, bodySize * 0.02);
    }
    
    // Energy discharge effect
    stroke(200, 255, 255, ship.thrusterOffset * 100);
    strokeWeight(1);
    for (let i = 0; i < 3; i++) {
      let sparkX = -bodySize * 0.5 - random(10);
      let sparkY = random(-bodySize * 0.1, bodySize * 0.1);
      point(sparkX, sparkY);
    }
  }
}

function drawThrusterFlames(ship) {
  // Draw animated thruster flames
  if (ship.thrusterOffset > 0) {
    push();
    translate(ship.x - ship.size/2 - 10, ship.y);
    
    // Main flame
    fill(255, 150, 0, 200);
    noStroke();
    let flameLength = ship.thrusterOffset * 20;
    triangle(0, 0, -flameLength, -8, -flameLength, 8);
    
    // Inner flame
    fill(255, 255, 100, 150);
    triangle(0, 0, -flameLength * 0.7, -5, -flameLength * 0.7, 5);
    
    // Core flame
    fill(255, 255, 255, 100);
    triangle(0, 0, -flameLength * 0.4, -2, -flameLength * 0.4, 2);
    
    pop();
  }
}

function drawShield(ship) {
  // Draw protective energy shield
  push();
  translate(ship.x, ship.y);
  
  let shieldAlpha = map(ship.shieldTimer, 0, SHIELD_DURATION, 50, 150);
  let pulseEffect = sin(frameCount * 0.3) * 20 + 100;
  
  stroke(100, 200, 255, shieldAlpha);
  strokeWeight(4);
  fill(100, 200, 255, shieldAlpha * 0.2);
  
  let shieldSize = ship.size * 1.5 + sin(frameCount * 0.2) * 5;
  ellipse(0, 0, shieldSize, shieldSize);
  
  // Add shield sparkles
  stroke(255, 255, 255, pulseEffect);
  strokeWeight(2);
  for (let i = 0; i < 6; i++) {
    let angle = (frameCount * 0.1 + i * PI/3) % TWO_PI;
    let sparkleX = cos(angle) * (shieldSize / 2 + 5);
    let sparkleY = sin(angle) * (shieldSize / 2 + 5);
    point(sparkleX, sparkleY);
  }
  
  pop();
}

// ============================================
// BULLETS AND MONSTERS RENDERING
// ============================================

function drawBullet(bullet) {
  push();
  translate(bullet.x, bullet.y);
  
  // Main bullet body with glow
  fill(bullet.color);
  stroke(255, 255, 255, 200);
  strokeWeight(2);
  ellipse(0, 0, bullet.size, bullet.size);
  
  // Bullet core
  fill(255, 255, 255, 150);
  noStroke();
  ellipse(0, 0, bullet.size * 0.6, bullet.size * 0.6);
  
  // Bullet trail effect
  for (let i = 1; i <= 3; i++) {
    let alpha = map(i, 1, 3, 100, 20);
    fill(red(bullet.color), green(bullet.color), blue(bullet.color), alpha);
    ellipse(-i * 3, 0, bullet.size * (1 - i * 0.2), bullet.size * (1 - i * 0.2));
  }
  
  pop();
}

function drawMonster(monster) {
  push();
  translate(monster.x, monster.y);
  
  if (monster.type === 'octopus') {
    drawOctopusMonster(monster);
  } else if (monster.type === 'robot') {
    drawRobotMonster(monster);
  } else if (monster.type === 'bug') {
    drawBugMonster(monster);
  } else if (monster.type === 'enemyShip') {
    drawEnemyShip(monster);
  } else if (monster.type === 'giant') {
    drawGiantMonster(monster);
  }
  
  // Draw health bar for monsters with more than 1 HP
  if (monster.maxHp > 1) {
    drawMonsterHealthBar(monster);
  }
  
  pop();
}

function drawOctopusMonster(octopus) {
  let pulse = sin(octopus.animTimer * 2) * 0.2 + 0.8;
  let size = octopus.size * pulse;
  
  // Main octopus body
  fill(octopus.color);
  stroke(red(octopus.color) + 50, green(octopus.color) + 50, blue(octopus.color) + 50);
  strokeWeight(2);
  ellipse(0, 0, size, size * 0.8);
  
  // Octopus tentacles
  stroke(octopus.color);
  strokeWeight(4);
  for (let i = 0; i < 8; i++) {
    let angle = (TWO_PI / 8) * i + octopus.animTimer;
    let tentacleLength = size * 0.6;
    let waveOffset = sin(octopus.animTimer * 3 + i) * 10;
    
    let x1 = cos(angle) * (size/2);
    let y1 = sin(angle) * (size/2);
    let x2 = cos(angle) * tentacleLength + waveOffset;
    let y2 = sin(angle) * tentacleLength;
    
    line(x1, y1, x2, y2);
  }
  
  // Eyes
  fill(255, 255, 100);
  ellipse(-size * 0.2, -size * 0.1, size * 0.15, size * 0.15);
  ellipse(size * 0.2, -size * 0.1, size * 0.15, size * 0.15);
  
  // Eye pupils
  fill(0);
  ellipse(-size * 0.2, -size * 0.1, size * 0.08, size * 0.08);
  ellipse(size * 0.2, -size * 0.1, size * 0.08, size * 0.08);
}

function drawRobotMonster(robot) {
  let blink = sin(robot.animTimer * 4) > 0.5;
  
  // Main robot body
  fill(robot.color);
  stroke(255, 255, 255, 150);
  strokeWeight(2);
  rect(-robot.size * 0.3, -robot.size * 0.3, robot.size * 0.6, robot.size * 0.6);
  
  // Robot antenna
  line(0, -robot.size * 0.3, 0, -robot.size * 0.5);
  fill(255, 0, 0, blink ? 255 : 100);
  ellipse(0, -robot.size * 0.5, 6, 6);
  
  // Robot eyes
  fill(blink ? 255 : 100, 0, 0);
  rect(-robot.size * 0.15, -robot.size * 0.1, robot.size * 0.1, robot.size * 0.05);
  rect(robot.size * 0.05, -robot.size * 0.1, robot.size * 0.1, robot.size * 0.05);
  
  // Robot arms
  stroke(robot.color);
  strokeWeight(6);
  line(-robot.size * 0.3, 0, -robot.size * 0.5, sin(robot.animTimer * 2) * 10);
  line(robot.size * 0.3, 0, robot.size * 0.5, -sin(robot.animTimer * 2) * 10);
}

function drawBugMonster(bug) {
  let wingFlap = sin(bug.animTimer * 8) * 15;
  
  // Bug body
  fill(bug.color);
  stroke(0, 100, 0);
  strokeWeight(1);
  ellipse(0, 0, bug.size * 0.4, bug.size * 0.8);
  
  // Bug wings
  fill(bug.color, 100);
  stroke(bug.color);
  strokeWeight(1);
  
  // Left wing
  push();
  rotate(radians(wingFlap));
  ellipse(-bug.size * 0.3, 0, bug.size * 0.3, bug.size * 0.6);
  pop();
  
  // Right wing
  push();
  rotate(radians(-wingFlap));
  ellipse(bug.size * 0.3, 0, bug.size * 0.3, bug.size * 0.6);
  pop();
  
  // Bug eyes
  fill(255, 255, 0);
  ellipse(-bug.size * 0.1, -bug.size * 0.2, bug.size * 0.12, bug.size * 0.12);
  ellipse(bug.size * 0.1, -bug.size * 0.2, bug.size * 0.12, bug.size * 0.12);
  
  // Bug antennae
  stroke(bug.color);
  strokeWeight(2);
  line(-bug.size * 0.05, -bug.size * 0.3, -bug.size * 0.1, -bug.size * 0.5);
  line(bug.size * 0.05, -bug.size * 0.3, bug.size * 0.1, -bug.size * 0.5);
}

function drawEnemyShip(ship) {
  // Enemy ship body (triangular, pointing left)
  fill(ship.color);
  stroke(255, 100, 0);
  strokeWeight(2);
  
  triangle(-ship.size/2, 0,           // Front point
           ship.size/2, -ship.size/3,  // Back top
           ship.size/2, ship.size/3);   // Back bottom
  
  // Enemy ship engines
  fill(255, 50, 0);
  ellipse(ship.size * 0.4, -ship.size * 0.1, ship.size * 0.1, ship.size * 0.05);
  ellipse(ship.size * 0.4, ship.size * 0.1, ship.size * 0.1, ship.size * 0.05);
  
  // Weapon systems
  fill(255, 200, 0);
  rect(-ship.size * 0.3, -ship.size * 0.05, ship.size * 0.2, ship.size * 0.1);
  
  // Warning lights
  let blink = sin(ship.animTimer * 6) > 0;
  fill(blink ? 255 : 100, 0, 0);
  ellipse(0, -ship.size * 0.2, 4, 4);
  ellipse(0, ship.size * 0.2, 4, 4);
}

function drawGiantMonster(giant) {
  let pulse = sin(giant.animTimer) * 0.1 + 0.9;
  let size = giant.size * pulse;
  
  // Giant monster main body
  fill(giant.color);
  stroke(red(giant.color) + 30, green(giant.color) + 30, blue(giant.color) + 30);
  strokeWeight(3);
  
  // Draw irregular giant shape
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = (TWO_PI / 6) * i;
    let radius = size/2 + sin(giant.animTimer * 2 + i) * 8;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    vertex(x, y);
  }
  endShape(CLOSE);
  
  // Giant eyes
  fill(255, 0, 0);
  ellipse(-size * 0.2, -size * 0.15, size * 0.15, size * 0.15);
  ellipse(size * 0.2, -size * 0.15, size * 0.15, size * 0.15);
  
  // Giant mouth
  fill(100, 0, 0);
  arc(0, size * 0.1, size * 0.3, size * 0.2, 0, PI);
  
  // Giant spikes
  fill(giant.color);
  for (let i = 0; i < 8; i++) {
    let angle = (TWO_PI / 8) * i;
    let spikeLength = size * 0.2 + sin(giant.animTimer + i) * 5;
    let spikeX = cos(angle) * (size/2 + spikeLength/2);
    let spikeY = sin(angle) * (size/2 + spikeLength/2);
    
    push();
    translate(spikeX, spikeY);
    rotate(angle + PI/2);
    triangle(0, -spikeLength/2, -4, spikeLength/2, 4, spikeLength/2);
    pop();
  }
}

function drawMonsterHealthBar(monster) {
  let barWidth = monster.size;
  let barHeight = 4;
  let healthPercent = monster.hp / monster.maxHp;
  
  // Background
  fill(50, 50, 50);
  noStroke();
  rect(-barWidth/2, -monster.size/2 - 10, barWidth, barHeight);
  
  // Health bar
  fill(healthPercent > 0.5 ? 0 : healthPercent > 0.25 ? 255 : 255, 
       healthPercent > 0.5 ? 255 : healthPercent > 0.25 ? 255 : 0, 
       0);
  rect(-barWidth/2, -monster.size/2 - 10, barWidth * healthPercent, barHeight);
}

// ============================================
// COLLECTIBLE ITEMS RENDERING
// ============================================

function spawnObstacle() {
  if (obstacles.length < MAX_OBSTACLES) {
    let obstacleType = random(['asteroid', 'laser', 'debris', 'mine', 'plasma']);
    
    let obstacle = {
      x: CANVAS_WIDTH + 50,
      y: random(50, CANVAS_HEIGHT - 50),
      size: random(40, 80), // Larger obstacles!
      type: obstacleType,
      rotation: 0,
      rotationSpeed: random(-0.08, 0.08), // Faster rotation
      pulsePhase: random(TWO_PI), // For pulsing effects
      color: obstacleType === 'asteroid' ? color(100, 80, 60) : 
             obstacleType === 'laser' ? color(255, 50, 50) : 
             obstacleType === 'mine' ? color(255, 150, 0) :
             obstacleType === 'plasma' ? color(150, 50, 255) :
             color(150, 150, 150)
    };
    
    obstacles.push(obstacle);
  }
}

function drawObstacle(obstacle) {
  push();
  translate(obstacle.x, obstacle.y);
  rotate(obstacle.rotation);
  
  if (obstacle.type === 'asteroid') {
    drawAsteroid(obstacle);
  } else if (obstacle.type === 'laser') {
    drawLaserBeam(obstacle);
  } else if (obstacle.type === 'debris') {
    drawSpaceDebris(obstacle);
  } else if (obstacle.type === 'mine') {
    drawSpaceMine(obstacle);
  } else if (obstacle.type === 'plasma') {
    drawPlasmaField(obstacle);
  }
  
  pop();
}

function drawAsteroid(asteroid) {
  // Draw rocky asteroid
  fill(asteroid.color);
  stroke(red(asteroid.color) + 30, green(asteroid.color) + 30, blue(asteroid.color) + 30);
  strokeWeight(2);
  
  // Draw irregular asteroid shape
  beginShape();
  for (let i = 0; i < 8; i++) {
    let angle = (TWO_PI / 8) * i;
    let radius = asteroid.size/2 + sin(frameCount * 0.1 + i) * 5;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    vertex(x, y);
  }
  endShape(CLOSE);
  
  // Add surface details
  fill(red(asteroid.color) - 20, green(asteroid.color) - 20, blue(asteroid.color) - 20);
  noStroke();
  ellipse(-asteroid.size * 0.2, -asteroid.size * 0.1, asteroid.size * 0.3, asteroid.size * 0.2);
  ellipse(asteroid.size * 0.1, asteroid.size * 0.2, asteroid.size * 0.2, asteroid.size * 0.15);
}

function drawLaserBeam(laser) {
  // Draw dangerous laser beam
  stroke(laser.color);
  strokeWeight(8);
  fill(laser.color);
  
  // Main laser beam
  rect(-laser.size, -laser.size * 0.1, laser.size * 2, laser.size * 0.2);
  
  // Laser glow effect
  stroke(255, 100, 100, 100);
  strokeWeight(12);
  line(-laser.size, 0, laser.size, 0);
  
  // Laser core
  stroke(255, 255, 255);
  strokeWeight(4);
  line(-laser.size, 0, laser.size, 0);
  
  // Warning indicators
  fill(255, 255, 0);
  noStroke();
  triangle(-laser.size - 10, 0, -laser.size - 20, -5, -laser.size - 20, 5);
  triangle(laser.size + 10, 0, laser.size + 20, -5, laser.size + 20, 5);
}

function drawSpaceDebris(debris) {
  // Draw space junk/debris
  fill(debris.color);
  stroke(200);
  strokeWeight(1);
  
  // Draw angular debris pieces
  rect(-debris.size * 0.3, -debris.size * 0.1, debris.size * 0.6, debris.size * 0.2);
  rect(-debris.size * 0.1, -debris.size * 0.3, debris.size * 0.2, debris.size * 0.6);
  
  // Add some smaller fragments
  fill(red(debris.color) + 50, green(debris.color) + 50, blue(debris.color) + 50);
  ellipse(-debris.size * 0.2, debris.size * 0.2, debris.size * 0.1, debris.size * 0.1);
  ellipse(debris.size * 0.15, -debris.size * 0.15, debris.size * 0.15, debris.size * 0.15);
}

function drawSpaceMine(mine) {
  // Draw dangerous space mine
  let pulse = sin(frameCount * 0.1 + mine.pulsePhase) * 0.3 + 0.7;
  let glowIntensity = pulse * 255;
  
  // Outer danger glow
  fill(255, 100, 0, glowIntensity * 0.4);
  noStroke();
  ellipse(0, 0, mine.size * 1.8, mine.size * 1.8);
  
  // Main mine body
  fill(mine.color);
  stroke(255, 200, 0);
  strokeWeight(3);
  ellipse(0, 0, mine.size, mine.size);
  
  // Dangerous spikes
  fill(255, 255, 0);
  noStroke();
  for (let i = 0; i < 8; i++) {
    let angle = (TWO_PI / 8) * i;
    let spikeLength = mine.size * 0.4 + sin(frameCount * 0.15 + i) * 3;
    let spikeX = cos(angle) * (mine.size / 2 + spikeLength / 2);
    let spikeY = sin(angle) * (mine.size / 2 + spikeLength / 2);
    
    push();
    translate(spikeX, spikeY);
    rotate(angle + PI/2);
    triangle(0, -spikeLength/2, -3, spikeLength/2, 3, spikeLength/2);
    pop();
  }
  
  // Warning lights
  fill(255, 0, 0, glowIntensity);
  ellipse(-mine.size * 0.2, -mine.size * 0.2, 6, 6);
  ellipse(mine.size * 0.2, -mine.size * 0.2, 6, 6);
  ellipse(0, mine.size * 0.3, 6, 6);
  
  // Central core
  fill(255, 150, 0);
  stroke(255);
  strokeWeight(2);
  ellipse(0, 0, mine.size * 0.3, mine.size * 0.3);
}

function drawPlasmaField(plasma) {
  // Draw swirling plasma energy field
  let pulse = sin(frameCount * 0.08 + plasma.pulsePhase) * 0.5 + 0.5;
  
  // Outer plasma field
  for (let layer = 0; layer < 4; layer++) {
    let layerAlpha = (4 - layer) * 40;
    let layerSize = plasma.size * (1.2 + layer * 0.3);
    
    fill(red(plasma.color), green(plasma.color), blue(plasma.color), layerAlpha * pulse);
    noStroke();
    
    // Create swirling effect
    beginShape();
    for (let i = 0; i < 12; i++) {
      let angle = (TWO_PI / 12) * i;
      let swirl = sin(frameCount * 0.1 + angle * 3 + layer) * 10;
      let radius = (layerSize / 2) + swirl;
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  
  // Plasma bolts
  stroke(plasma.color);
  strokeWeight(4);
  for (let i = 0; i < 6; i++) {
    let angle1 = (TWO_PI / 6) * i + frameCount * 0.05;
    let angle2 = angle1 + 0.3;
    let radius1 = plasma.size * 0.2;
    let radius2 = plasma.size * 0.4;
    
    let x1 = cos(angle1) * radius1;
    let y1 = sin(angle1) * radius1;
    let x2 = cos(angle2) * radius2;
    let y2 = sin(angle2) * radius2;
    
    line(x1, y1, x2, y2);
  }
  
  // Central plasma core
  fill(255, 255, 255, pulse * 200);
  noStroke();
  ellipse(0, 0, plasma.size * 0.2, plasma.size * 0.2);
}

// ============================================
// COLLECTIBLE ITEMS RENDERING
// ============================================

function spawnSpaceStar() {
  if (spaceStars.length < MAX_SPACE_STARS) {
    let star = {
      x: CANVAS_WIDTH + 50,
      y: random(50, CANVAS_HEIGHT - 50),
      size: STAR_SIZE,
      rotation: 0,
      pulse: 0,
      color: random([
        color(255, 255, 100),  // Yellow star
        color(100, 255, 255),  // Cyan star
        color(255, 100, 255),  // Magenta star
        color(100, 255, 100)   // Green star
      ])
    };
    spaceStars.push(star);
  }
}

function drawSpaceStar(star) {
  push();
  translate(star.x, star.y);
  rotate(star.rotation);
  
  // Pulsing glow effect
  let pulseSize = star.size + sin(star.pulse) * 5;
  let glowAlpha = sin(star.pulse) * 50 + 100;
  
  // Outer glow
  fill(red(star.color), green(star.color), blue(star.color), glowAlpha * 0.5);
  noStroke();
  ellipse(0, 0, pulseSize * 1.5, pulseSize * 1.5);
  
  // Main star
  fill(star.color);
  stroke(255);
  strokeWeight(2);
  
  // Draw 8-pointed star
  beginShape();
  for (let i = 0; i < 8; i++) {
    let angle = (TWO_PI / 8) * i;
    let radius = (i % 2 === 0) ? pulseSize/2 : pulseSize/4;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    vertex(x, y);
  }
  endShape(CLOSE);
  
  // Star core
  fill(255);
  noStroke();
  ellipse(0, 0, pulseSize * 0.3, pulseSize * 0.3);
  
  pop();
}

function spawnHeart() {
  if (hearts.length < MAX_HEARTS) {
    let heart = {
      x: CANVAS_WIDTH + 50,
      y: random(50, CANVAS_HEIGHT - 50),
      size: HEART_SIZE,
      pulse: 0
    };
    hearts.push(heart);
  }
}

function spawnPowerUp() {
  if (powerUps.length < MAX_POWER_UPS) {
    let powerUp = {
      x: CANVAS_WIDTH + 50,
      y: random(50, CANVAS_HEIGHT - 50),
      size: POWER_UP_SIZE,
      type: 'shield', // Could add more types later
      pulse: 0,
      rotation: 0
    };
    powerUps.push(powerUp);
  }
}

function drawHeart(heart) {
  push();
  translate(heart.x, heart.y);
  
  // Heartbeat pulsing animation
  let heartbeat = sin(heart.pulse * 1.2) * 0.3 + 1.0; // Faster heartbeat
  let pulseSize = heart.size * heartbeat;
  let glowAlpha = sin(heart.pulse * 0.8) * 100 + 150;
  
  // Outer pink glow
  fill(255, 150, 200, glowAlpha * 0.4);
  noStroke();
  ellipse(0, 0, pulseSize * 2.2, pulseSize * 2.2);
  
  // Main heart shape - beautiful pink gradient effect
  let heartColor = lerpColor(color(255, 100, 150), color(255, 200, 220), heartbeat * 0.5);
  fill(heartColor);
  stroke(255, 255, 255, 200);
  strokeWeight(2);
  
  // Draw heart shape using bezier curves
  beginShape();
  // Start from bottom point
  vertex(0, pulseSize * 0.3);
  
  // Left side of heart
  bezierVertex(-pulseSize * 0.5, -pulseSize * 0.1, 
              -pulseSize * 0.5, -pulseSize * 0.4,
              -pulseSize * 0.2, -pulseSize * 0.4);
  
  // Left top curve
  bezierVertex(-pulseSize * 0.1, -pulseSize * 0.5,
              pulseSize * 0.1, -pulseSize * 0.5,
              pulseSize * 0.2, -pulseSize * 0.4);
  
  // Right side of heart  
  bezierVertex(pulseSize * 0.5, -pulseSize * 0.4,
              pulseSize * 0.5, -pulseSize * 0.1,
              0, pulseSize * 0.3);
  
  endShape(CLOSE);
  
  // Inner highlight
  fill(255, 255, 255, 100 + heartbeat * 50);
  noStroke();
  ellipse(-pulseSize * 0.15, -pulseSize * 0.2, pulseSize * 0.3, pulseSize * 0.2);
  
  // Sparkles around heart
  for (let i = 0; i < 8; i++) {
    let angle = (frameCount * 0.08 + i * PI/4) % TWO_PI;
    let sparkleDistance = pulseSize * (1.2 + sin(frameCount * 0.1 + i) * 0.2);
    let sparkleX = cos(angle) * sparkleDistance;
    let sparkleY = sin(angle) * sparkleDistance;
    
    fill(255, 200, 220, 200 - i * 20);
    ellipse(sparkleX, sparkleY, 3, 3);
  }
  
  // Plus sign indicator (life boost)
  stroke(255, 255, 255, 200);
  strokeWeight(3);
  let crossSize = pulseSize * 0.15;
  line(0, -crossSize, 0, crossSize);
  line(-crossSize, 0, crossSize, 0);
  
  pop();
}

function drawPowerUp(powerUp) {
  push();
  translate(powerUp.x, powerUp.y);
  rotate(powerUp.rotation);
  
  let pulseSize = powerUp.size + sin(powerUp.pulse) * 8;
  
  if (powerUp.type === 'shield') {
    // Draw shield power-up
    
    // Outer energy ring
    stroke(100, 200, 255, 150);
    strokeWeight(6);
    noFill();
    ellipse(0, 0, pulseSize * 1.3, pulseSize * 1.3);
    
    // Inner shield symbol
    fill(100, 200, 255, 200);
    stroke(255);
    strokeWeight(3);
    
    // Shield shape
    beginShape();
    vertex(0, -pulseSize/2);
    bezierVertex(pulseSize/3, -pulseSize/2, pulseSize/3, 0, pulseSize/3, pulseSize/4);
    bezierVertex(pulseSize/3, pulseSize/2, 0, pulseSize/1.5, 0, pulseSize/2);
    bezierVertex(0, pulseSize/1.5, -pulseSize/3, pulseSize/2, -pulseSize/3, pulseSize/4);
    bezierVertex(-pulseSize/3, 0, -pulseSize/3, -pulseSize/2, 0, -pulseSize/2);
    endShape(CLOSE);
    
    // Power-up sparkles
    for (let i = 0; i < 6; i++) {
      let angle = (frameCount * 0.1 + i * PI/3) % TWO_PI;
      let sparkleX = cos(angle) * (pulseSize * 0.8);
      let sparkleY = sin(angle) * (pulseSize * 0.8);
      
      fill(255, 255, 255, 200);
      noStroke();
      ellipse(sparkleX, sparkleY, 4, 4);
    }
  }
  
  pop();
}

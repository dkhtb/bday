// Helper functions
const get = (id) => document.getElementById(id);
const query = (selector) => document.querySelector(selector);
const queryAll = (selector) => document.querySelectorAll(selector);

const musik = get('musik');
// Removed other audio elements

const starsContainer = get('stars');
const moon = query('.moon');
const countdownDiv = get('countdown');
const selamatDiv = get('selamat');
const mainTitle = get('mainTitle');
const hbdJoyAnimationContainer = get('hbdJoyAnimationContainer');
const mainSecretEnvelope = get('mainSecretEnvelope');
const moonSecretEnvelope = get('moonSecretEnvelope');
const reflectedLight = get('reflectedLight');
const magicParticlesContainer = get('magicParticles');

const mainSecretMessageModal = get('mainSecretMessageModal');
const moonSecretMessageModal = get('moonSecretMessageModal');
const mergedSecretMessageModal = get('mergedSecretMessageModal');
const mainCloseButton = get('mainSecretMessageModal').querySelector('.close-button');
const moonCloseButton = get('moonSecretMessageModal').querySelector('.close-button');
const mergedCloseButton = get('mergedSecretMessageModal').querySelector('.close-button');

// --- GIF SYSTEM ---
const sideGifContainer = document.getElementById('sideGifContainer');
const sideGif = document.getElementById('sideGif');

// GIF sequence mapping
const gifSequences = {
  countdown: ['gifff/wait.gif', 'gifff/turu.gif'],
  afterAnim: ['gifff/clap.gif', 'gifff/betday1.gif'],
  suratUtama: ['gifff/pat.gif', 'gifff/salam.gif'],
  gabungan: ['gifff/mloe.gif', 'gifff/angreh.gif', 'gifff/wlee.gif'],
};

let currentGifIndex = 0;
let currentGifType = 'countdown';
let gifTimer = null;

// Utility: Stop all GIF timers
function stopGif() {
  if (gifTimer) {
    clearTimeout(gifTimer);
    gifTimer = null;
  }
}
// Page navigation variables
let currentPage = 1;
const totalPages = 3;

// Envelope attraction state
let envelopesMerged = false;
let envelopesAttracted = false;
let canSplitEnvelope = false;

mainSecretEnvelope.addEventListener('click', showSecretMessage);

function setGifType(type, page = 0) {
  stopGif();
  currentGifType = type;
  currentGifIndex = 0;
  if (type === 'gabungan') {
    sideGif.src = gifSequences.gabungan[page];
  } else {
    sideGif.src = gifSequences[type][currentGifIndex];
    sideGif.onload = () => {
      stopGif(); // pastikan tidak stack
      gifTimer = setTimeout(() => {
        currentGifIndex = (currentGifIndex + 1) % gifSequences[type].length;
        sideGif.src = gifSequences[type][currentGifIndex];
      }, 2500);
    };
  }
}

function startCountdownGifLoop() {
  setGifType('countdown');
}
function afterAnimGifLoop() {
  setGifType('afterAnim');
}
function suratUtamaGifLoop() {
  setGifType('suratUtama');
}
function gabunganGifSet(pageIdx) {
  setGifType('gabungan', pageIdx);
}

// --- CAHAYA PENUTUP ANGKA 8 (LINGKARAN MULTI LAYER) ---
function createWhiteLightOverlay() {
  const digitOld = get('digitContainer').querySelector('.digit-old');
  if (!digitOld) return;
  const digitRect = digitOld.getBoundingClientRect();
  for (let i = 0; i < 3; i++) {
    const lightOverlay = document.createElement('div');
    lightOverlay.className = 'white-light-overlay' + (i > 0 ? ' extra' : '');
    lightOverlay.style.position = 'fixed';
    lightOverlay.style.left = `${digitRect.left - 20 - i * 5}px`;
    lightOverlay.style.top = `${digitRect.top - 20 - i * 5}px`;
    lightOverlay.style.width = `${digitRect.width + 40 + i * 10}px`;
    lightOverlay.style.height = `${digitRect.height + 40 + i * 10}px`;
    lightOverlay.style.borderRadius = '50%';
    lightOverlay.style.zIndex = 15 + i;
    lightOverlay.style.pointerEvents = 'none';
    lightOverlay.style.opacity = '0';
    document.body.appendChild(lightOverlay);
    setTimeout(() => {
      lightOverlay.style.opacity = '1';
    }, 100);
    setTimeout(() => {
      lightOverlay.style.opacity = '0';
      setTimeout(() => {
        if (lightOverlay.parentNode) {
          lightOverlay.parentNode.removeChild(lightOverlay);
        }
      }, 1000);
    }, 2500 + i * 200);
  }
  createLightReflection(digitRect);
}

// --- MODAL CONTROL (modal surat utama tidak akan ikut terbuka saat gabungan) ---
function showSecretMessage() {
  stopGif();
  suratUtamaGifLoop();
  mainSecretMessageModal.style.display = 'flex';
  moonSecretMessageModal.style.display = 'none';
  mergedSecretMessageModal.style.display = 'none';
}
function showMoonSecretMessage() {
  stopGif();
  moonSecretMessageModal.style.display = 'flex';
  mainSecretMessageModal.style.display = 'none';
  mergedSecretMessageModal.style.display = 'none';
}
function showMergedSecretMessage() {
  stopGif();
  currentPage = 1;
  for (let i = 1; i <= totalPages; i++) {
    get(`messagePage${i}`).style.display = 'none';
  }
  get(`messagePage${currentPage}`).style.display = 'block';
  updateNavigation();
  mergedSecretMessageModal.style.display = 'flex';
  mainSecretMessageModal.style.display = 'none';
  moonSecretMessageModal.style.display = 'none';
  gabunganGifSet(currentPage - 1);
}

// --- NAVIGASI GABUNGAN GIF ---
function nextPage() {
  if (currentPage < totalPages) {
    get(`messagePage${currentPage}`).style.display = 'none';
    currentPage++;
    get(`messagePage${currentPage}`).style.display = 'block';
    updateNavigation();
    gabunganGifSet(currentPage - 1);
  }
}
function previousPage() {
  if (currentPage > 1) {
    get(`messagePage${currentPage}`).style.display = 'none';
    currentPage--;
    get(`messagePage${currentPage}`).style.display = 'block';
    updateNavigation();
    gabunganGifSet(currentPage - 1);
  }
}

function getTargetDate() {
  const now = new Date();
  let targetYear = now.getFullYear();
  const targetMonth = 7; // Agustus (0-indexed: 0=Jan, 7=Agustus)
  const targetDay = 7;
  const targetHour = 0;
  const targetMinute = 0;
  const targetSecond = 0;
  const targetDate = new Date(targetYear, targetMonth, targetDay, targetHour, targetMinute, targetSecond);

  // Jika sudah lewat, langsung tampilkan pesan selamat
  if (now > targetDate) {
    return null;
  }
  return targetDate;
}

// --- FIREWORKS HEIGHT RANDOMIZED (in script1.js) ---

// --- COUNTDOWN GIF LOOP ---
function startCountdown() {
  setGifType('countdown');
  const targetDate = getTargetDate();

  if (!targetDate) {
    // Langsung lewat countdown, tampil selamat
    countdownDiv.style.display = 'none';
    selamatDiv.style.display = 'block';
    animateNumberTransition();
    afterAnimGifLoop();
    return;
  }

  countdownDiv.style.display = 'block';
  selamatDiv.style.display = 'none';

  const countdown = setInterval(() => {
    const now = new Date();
    const distance = targetDate - now;

    if (distance < 0) {
      clearInterval(countdown);
      countdownDiv.style.display = 'none';
      selamatDiv.style.display = 'block';
      animateNumberTransition();
      afterAnimGifLoop();
      return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    let countdownText = '';
    if (days > 0) {
      countdownText += `${days} hari `;
    }
    countdownText += `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    countdownDiv.innerHTML = countdownText;
  }, 1000);
}

// --- ANIMASI NUMBER TRANSITION (panggil overlay dan GIF loop setelah selesai) ---
function animateNumberTransition() {
  mainTitle.style.opacity = 0;
  mainTitle.style.display = 'none';
  const numberContainer = document.querySelector('.number-container');
  numberContainer.style.opacity = 1;
  setTimeout(() => {
    const digitContainer = get('digitContainer');
    digitContainer.classList.add('animate');
    setTimeout(() => {
      createWhiteLightOverlay();
    }, 2000);
    setTimeout(() => {
      const digitOld = digitContainer.querySelector('.digit-old');
      const digitNew = digitContainer.querySelector('.digit-new');
      digitOld.textContent = digitNew.textContent;
      digitContainer.classList.remove('animate');
      digitOld.style.transform = 'rotateX(0deg)';
      digitOld.style.opacity = '1';
      digitNew.style.transform = 'rotateX(-90deg)';
      digitNew.style.opacity = '0';
      digitOld.style.animation = 'subtleGlow 2s ease-in-out infinite alternate';
      if (typeof startFireworks === 'function') {
        startFireworks();
      }
    }, 4500);
  }, 5000);
  setTimeout(() => {
    mainSecretEnvelope.style.display = 'flex';
    // === Tambahkan stopGif dan mulai afterAnimGifLoop ===
    stopGif();
    afterAnimGifLoop();
  }, 10000);
}

// --- INIT ---
function init() {
  createStars();
  scheduleNextShootingStar();
  initAudio();
  startCountdown();
  const joiAgeSpan = document.getElementById('joiAge');
  if (joiAgeSpan) {
    joiAgeSpan.textContent = '19';
  }
  updateMoonSecretEnvelopePosition();
  setInterval(updateReflections, 100);
  setInterval(checkEnvelopeProximity, 50);
  const script1 = document.createElement('script');
  script1.src = 'script1.js';
  document.body.appendChild(script1);
}

window.showSecretMessage = showSecretMessage;
window.showMoonSecretMessage = showMoonSecretMessage;
window.showMergedSecretMessage = showMergedSecretMessage;
window.nextPage = nextPage;
window.previousPage = previousPage;
window.createFireworkReflection = createFireworkReflection;

document.addEventListener('DOMContentLoaded', init);

// Star creation
function createStars() {
  const numberOfStars = 100;
  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    if (Math.random() > 0.8) {
      star.classList.add('big');
    }
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 2 + 's';
    star.style.animationDuration = (Math.random() * 3 + 1) + 's';
    starsContainer.appendChild(star);
  }
}

// Shooting stars
function createShootingStar() {
  const shootingStar = document.createElement('div');
  shootingStar.className = 'shooting-star';
  const paths = ['path1', 'path2', 'path3', 'path4', 'path5'];
  const randomPath = paths[Math.floor(Math.random() * paths.length)];
  shootingStar.classList.add(randomPath);
  
  // Start shooting stars from random positions at the top or right
  const startFromTop = Math.random() > 0.5;
  if (startFromTop) {
    shootingStar.style.top = Math.random() * 200 + 'px';
    shootingStar.style.right = '-10px';
  } else {
    shootingStar.style.top = '-10px';
    shootingStar.style.right = Math.random() * 300 + 'px';
  }
  
  document.body.appendChild(shootingStar);
  // shootingStarSound.currentTime = 0; // Removed audio
  // shootingStarSound.play().catch(e => console.log("Audio play failed:", e)); // Removed audio
  
  // Remove shooting star after its animation duration
  const animationDuration = parseFloat(getComputedStyle(shootingStar).animationDuration) * 1000;
  setTimeout(() => {
    if (shootingStar.parentNode) {
      shootingStar.parentNode.removeChild(shootingStar);
    }
  }, animationDuration);
}

function scheduleNextShootingStar() {
  const delay = Math.random() * 3000 + 2000;
  setTimeout(() => {
    createShootingStar();
    scheduleNextShootingStar();
  }, delay);
}

// Page navigation functions
function nextPage() {
  if (currentPage < totalPages) {
    get(`messagePage${currentPage}`).style.display = 'none';
    currentPage++;
    get(`messagePage${currentPage}`).style.display = 'block';
    updateNavigation();
    gabunganGifSet(currentPage - 1);
  }
}

function previousPage() {
  if (currentPage > 1) {
    get(`messagePage${currentPage}`).style.display = 'none';
    currentPage--;
    get(`messagePage${currentPage}`).style.display = 'block';
    updateNavigation();
    gabunganGifSet(currentPage - 1);
  }
}

function updateNavigation() {
  const prevBtn = get('prevBtn');
  const nextBtn = get('nextBtn');
  const pageIndicator = get('pageIndicator');
  
  // Update page indicator
  pageIndicator.textContent = `${currentPage} / ${totalPages}`;
  
  // Update button visibility
  if (currentPage === 1) {
    prevBtn.style.display = 'none';
  } else {
    prevBtn.style.display = 'flex';
  }
  
  if (currentPage === totalPages) {
    nextBtn.style.display = 'none';
  } else {
    nextBtn.style.display = 'flex';
  }
}

// FIXED: Envelope attraction mechanics
function checkEnvelopeProximity() {
  if (!mainSecretEnvelope || !moonSecretEnvelope) return;
  
  const mainRect = mainSecretEnvelope.getBoundingClientRect();
  const moonRect = moonSecretEnvelope.getBoundingClientRect();
  const moonCurrentRect = moon.getBoundingClientRect();

  const mainCenterX = mainRect.left + mainRect.width / 2;
  const mainCenterY = mainRect.top + mainRect.height / 2;
  const moonCenterX = moonRect.left + moonRect.width / 2;
  const moonCenterY = moonRect.top + moonRect.height / 2;
  const moonCurrentCenterX = moonCurrentRect.left + moonCurrentRect.width / 2;
  const moonCurrentCenterY = moonCurrentRect.top + moonCurrentRect.height / 2;
  
  const distance = Math.sqrt(
    Math.pow(mainCenterX - moonCenterX, 2) + 
    Math.pow(mainCenterY - moonCenterY, 2)
  );

  const attractionDistance = 100;
  const mergeDistance = 50;
  const pullBackDistance = 80;

  if (envelopesMerged) {
    // Check if moon is close to the merged envelope to pull it back
    const mergedEnvelopeRect = mainSecretEnvelope.getBoundingClientRect();
    const mergedEnvelopeCenterX = mergedEnvelopeRect.left + mergedEnvelopeRect.width / 2;
    const mergedEnvelopeCenterY = mergedEnvelopeRect.top + mergedEnvelopeRect.height / 2;

    const distanceToMerged = Math.sqrt(
      Math.pow(moonCurrentCenterX - mergedEnvelopeCenterX, 2) + 
      Math.pow(moonCurrentCenterY - mergedEnvelopeCenterY, 2)
    );

    if (distanceToMerged <= pullBackDistance) {
      if (!this.separationTimeout) {
        this.separationTimeout = setTimeout(() => {
          envelopesMerged = false;
          envelopesAttracted = false;
          
          // Reset mainSecretEnvelope
          mainSecretEnvelope.classList.remove('envelope-merged');
          mainSecretEnvelope.style.display = 'none';
          mainSecretEnvelope.style.opacity = '1';
          mainSecretEnvelope.style.pointerEvents = 'none';
          mainSecretEnvelope.onclick = showSecretMessage;

          // Reset moonSecretEnvelope
          moonSecretEnvelope.style.opacity = '1';
          moonSecretEnvelope.style.pointerEvents = 'auto';
          moonSecretEnvelope.style.display = 'flex';
          moonSecretEnvelope.classList.remove('envelope-attracted');
          updateMoonSecretEnvelopePosition();

          // magnetSound.currentTime = 0; // Removed audio
          // magnetSound.play().catch(e => console.log("Audio play failed:", e)); // Removed audio
          
          createMergeEffect(mergedEnvelopeCenterX, mergedEnvelopeCenterY, moonCurrentCenterX, moonCurrentCenterY);
          this.separationTimeout = null;
        }, 2000);
      }
      return;
    } else if (this.separationTimeout) {
      clearTimeout(this.separationTimeout);
      this.separationTimeout = null;
    }
  }
  
  // FIXED: Proper attraction and merge logic
  if (distance <= mergeDistance && !envelopesMerged && envelopesAttracted) {
    // Merge envelopes
    envelopesMerged = true;
    
    // Hide moon envelope
    moonSecretEnvelope.style.display = 'none';
    
    // Transform main envelope to merged state
    mainSecretEnvelope.classList.add('envelope-merged');
    mainSecretEnvelope.style.pointerEvents = 'auto';
    mainSecretEnvelope.onclick = showMergedSecretMessage;
    
    // Create merge effect
    createMergeEffect(mainCenterX, mainCenterY, moonCenterX, moonCenterY);
    
    // magnetSound.currentTime = 0; // Removed audio
    // magnetSound.play().catch(e => console.log("Audio play failed:", e)); // Removed audio
    
  } else if (distance <= attractionDistance && !envelopesAttracted && !envelopesMerged) {
    // Start attraction
    envelopesAttracted = true;
    
    mainSecretEnvelope.classList.add('envelope-attracted');
    moonSecretEnvelope.classList.add('envelope-attracted');
    
    createAttractionParticles(mainCenterX, mainCenterY, moonCenterX, moonCenterY);
    
  } else if (distance > attractionDistance && envelopesAttracted && !envelopesMerged) {
    // Remove attraction
    envelopesAttracted = false;
    mainSecretEnvelope.classList.remove('envelope-attracted');
    moonSecretEnvelope.classList.remove('envelope-attracted');
  }
}

// Create attraction particles
function createAttractionParticles(x1, y1, x2, y2) {
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    particle.className = `magic-particle ${i < 4 ? 'pink' : 'blue'}`;
    
    const size = Math.random() * 6 + 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Position particles between the two envelopes
    const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * 40;
    const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * 40;
    
    particle.style.left = `${midX}px`;
    particle.style.top = `${midY}px`;
    
    // Set random movement direction
    particle.style.setProperty('--particle-dx', `${(Math.random() - 0.5) * 60}px`);
    particle.style.setProperty('--particle-dy', `${(Math.random() - 0.5) * 60}px`);
    
    magicParticlesContainer.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 2000);
  }
}

// Create merge effect
function createMergeEffect(x1, y1, x2, y2) {
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    particle.className = `magic-particle ${i < 7 ? 'pink' : 'blue'}`;
    
    const size = Math.random() * 8 + 6;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Position particles at merge point
    const mergeX = (x1 + x2) / 2 + (Math.random() - 0.5) * 20;
    const mergeY = (y1 + y2) / 2 + (Math.random() - 0.5) * 20;
    
    particle.style.left = `${mergeX}px`;
    particle.style.top = `${mergeY}px`;
    
    // Explosive movement
    particle.style.setProperty('--particle-dx', `${(Math.random() - 0.5) * 100}px`);
    particle.style.setProperty('--particle-dy', `${(Math.random() - 0.5) * 100}px`);
    
    magicParticlesContainer.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 2000);
  }
}

// Moon dragging functionality
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

function updateMoonSecretEnvelopePosition() {
  if (envelopesMerged) return;
  
  const moonRect = moon.getBoundingClientRect();
  const envelopeSize = 60;
  
  moonSecretEnvelope.style.left = `${moonRect.left + moonRect.width / 2 - envelopeSize / 2}px`;
  moonSecretEnvelope.style.top = `${moonRect.top + moonRect.height / 2 - envelopeSize / 2}px`;
}

function dragStart(e) {
  e.preventDefault();
  isDragging = true;
  
  const rect = moon.getBoundingClientRect();
  
  if (e.type === "touchstart") {
    dragOffset.x = e.touches[0].clientX - rect.left;
    dragOffset.y = e.touches[0].clientY - rect.top;
  } else {
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
  }
  
  moon.style.transition = 'none';
  // buttonClickSound.currentTime = 0; // Removed audio
  // buttonClickSound.play().catch(e => console.log("Audio play failed:", e)); // Removed audio
  
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);
  document.addEventListener('touchmove', drag);
  document.addEventListener('touchend', dragEnd);
}

function drag(e) {
  if (!isDragging) return;
  e.preventDefault();
  
  let clientX, clientY;
  if (e.type === "touchmove") {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  
  const newX = clientX - dragOffset.x;
  const newY = clientY - dragOffset.y;
  
  // Clamp to viewport boundaries
  const maxX = window.innerWidth - moon.offsetWidth;
  const maxY = window.innerHeight - moon.offsetHeight;
  
  const clampedX = Math.max(0, Math.min(newX, maxX));
  const clampedY = Math.max(0, Math.min(newY, maxY));
  
  moon.style.left = `${clampedX}px`;
  moon.style.top = `${clampedY}px`;
  moon.style.right = 'auto';
  
  // Update moon secret envelope position (but don't follow if merged)
  if (!envelopesMerged) {
    updateMoonSecretEnvelopePosition();
  }
  
  // Update reflected light position
  const moonCenterX = (clampedX + moon.offsetWidth / 2) / window.innerWidth * 100;
  const moonCenterY = (clampedY + moon.offsetHeight / 2) / window.innerHeight * 100;
  reflectedLight.style.setProperty('--moon-x', `${moonCenterX}%`);
  reflectedLight.style.setProperty('--moon-y', `${moonCenterY}%`);
  reflectedLight.classList.add('moon-glow');

  createMoonParticle(clampedX + moon.offsetWidth / 2, clampedY + moon.offsetHeight / 2);
  
  // Check envelope proximity during drag
  checkEnvelopeProximity();
}

function dragEnd(e) {
  isDragging = false;
  moon.style.transition = 'box-shadow 0.3s ease';
  
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', dragEnd);
  document.removeEventListener('touchmove', drag);
  document.removeEventListener('touchend', dragEnd);

  // Ensure moon secret envelope position is updated one last time
  updateMoonSecretEnvelopePosition();
}

// Event listeners for moon dragging
moon.addEventListener('mousedown', dragStart);
moon.addEventListener('touchstart', dragStart);

// Moon particles
function createMoonParticle(x, y) {
  if (Math.random() < 0.3) {
    const particle = document.createElement('div');
    particle.className = 'moon-particle';
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x + (Math.random() - 0.5) * 40}px`;
    particle.style.top = `${y + (Math.random() - 0.5) * 40}px`;
    
    particle.style.animationDuration = `${Math.random() * 2 + 2}s`;
    particle.style.animationDelay = `${Math.random() * 0.5}s`;
    particle.style.setProperty('--dx', `${(Math.random() - 0.5) * 80}px`);
    particle.style.setProperty('--dy', `${(Math.random() - 0.5) * 80}px`);

    document.body.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, parseFloat(particle.style.animationDuration) * 1000);
  }
}

// NEW: Function to create white light overlay for number 8
function createWhiteLightOverlay() {
  const digitOld = get('digitContainer').querySelector('.digit-old');
  if (!digitOld) return;
  
  const digitRect = digitOld.getBoundingClientRect();
  
  // Create light overlay
  const lightOverlay = document.createElement('div');
  lightOverlay.className = 'white-light-overlay';
  lightOverlay.style.position = 'fixed';
  lightOverlay.style.left = `${digitRect.left - 20}px`;
  lightOverlay.style.top = `${digitRect.top - 20}px`;
  lightOverlay.style.width = `${digitRect.width + 40}px`;
  lightOverlay.style.height = `${digitRect.height + 40}px`;
  // lightOverlay.style.background = 'rgba(255, 255, 255, 0.9)'; // Moved to CSS
  lightOverlay.style.borderRadius = '50%';
  lightOverlay.style.zIndex = '15';
  lightOverlay.style.pointerEvents = 'none';
  lightOverlay.style.opacity = '0';
  // lightOverlay.style.transition = 'opacity 1s ease-in-out'; // Moved to CSS
  
  document.body.appendChild(lightOverlay);
  
  // Fade in
  setTimeout(() => {
    lightOverlay.style.opacity = '1';
  }, 100);
  
  // Fade out after 2.5 seconds (from second 2 to 4.5)
  setTimeout(() => {
    lightOverlay.style.opacity = '0';
    
    // Remove element after fade out
    setTimeout(() => {
      if (lightOverlay.parentNode) {
        lightOverlay.parentNode.removeChild(lightOverlay);
      }
    }, 1000);
  }, 2500);
  
  // Create light reflection in water
  createLightReflection(digitRect);
}

// NEW: Function to create light reflection in water
function createLightReflection(digitRect) {
  const oceanTop = reflectedLight.getBoundingClientRect().top;
  const reflectedY = oceanTop + (oceanTop - digitRect.bottom) + 20;
  
  if (reflectedY > oceanTop) {
    const lightReflection = document.createElement('div');
    lightReflection.className = 'light-reflection';
    lightReflection.style.position = 'absolute';
    lightReflection.style.left = `${digitRect.left - 20}px`;
    lightReflection.style.top = `${reflectedY}px`;
    lightReflection.style.width = `${digitRect.width + 40}px`;
    lightReflection.style.height = `${digitRect.height + 40}px`;
    // lightReflection.style.background = 'rgba(255, 255, 255, 0.3)'; // Moved to CSS
    lightReflection.style.borderRadius = '50%';
    lightReflection.style.opacity = '0';
    // lightReflection.style.transition = 'opacity 1s ease-in-out'; // Moved to CSS
    lightReflection.style.transform = 'scaleY(-1)';
    // lightReflection.style.filter = 'blur(2px)'; // Moved to CSS
    
    reflectedLight.appendChild(lightReflection);
    
    // Fade in
    setTimeout(() => {
      lightReflection.style.opacity = '1';
    }, 100);
    
    // Fade out
    setTimeout(() => {
      lightReflection.style.opacity = '0';
      
      setTimeout(() => {
        if (lightReflection.parentNode) {
          lightReflection.parentNode.removeChild(lightReflection);
        }
      }, 1000);
    }, 2500);
  }
}

function animateNumberTransition() {
  // Hide main title
  mainTitle.style.opacity = 0;
  mainTitle.style.display = 'none';

  // Show the number container (18 first)
  const numberContainer = document.querySelector('.number-container');
  numberContainer.style.opacity = 1;

  // Wait 5 seconds before starting the animation from 8 to 9
  setTimeout(() => {
    const digitContainer = get('digitContainer');
    digitContainer.classList.add('animate');
    
    // Play number change sound (Removed audio)
    // numberChangeSound.currentTime = 0;
    // numberChangeSound.play().catch(e => console.log("Audio play failed:", e));

    // NEW: Create white light overlay at 2 seconds after animation starts
    setTimeout(() => {
      createWhiteLightOverlay();
    }, 2000);

    // Clean up animation after completion (4s animation + 0.5s buffer)
    setTimeout(() => {
      const digitOld = digitContainer.querySelector('.digit-old');
      const digitNew = digitContainer.querySelector('.digit-new');
      
      // Update the old digit to show 9
      digitOld.textContent = digitNew.textContent;
      digitContainer.classList.remove('animate');
      digitOld.style.transform = 'rotateX(0deg)';
      digitOld.style.opacity = '1';
      digitNew.style.transform = 'rotateX(-90deg)';
      digitNew.style.opacity = '0';
      
      // Add final glow effect to the completed number
      digitOld.style.animation = 'subtleGlow 2s ease-in-out infinite alternate';

      // Trigger fireworks after number animation completes
      if (typeof startFireworks === 'function') {
        startFireworks();
      } else {
        console.warn("startFireworks function not found. Make sure script1.js is loaded.");
      }

    }, 4500);
  }, 5000);

  // Show envelope after the full animation completes
  setTimeout(() => {
    mainSecretEnvelope.style.display = 'flex';
  }, 10000);
}

// Secret message functions
function showSecretMessage() {
  if (envelopesMerged) {
    return;
  }
  mainSecretMessageModal.style.display = 'flex';
  moonSecretMessageModal.style.display = 'none';
  mergedSecretMessageModal.style.display = 'none';
  suratUtamaGifLoop();
}

function closeSecretMessage() {
  mainSecretMessageModal.style.display = 'none';
}

function showMoonSecretMessage() {
  moonSecretMessageModal.style.display = 'flex';
  // secretRevealSound.currentTime = 0; // Removed audio
  // secretRevealSound.play().catch(e => console.log("Audio play failed:", e)); // Removed audio
}

function closeMoonSecretMessage() {
  moonSecretMessageModal.style.display = 'none';
}

function showMergedSecretMessage() {
  currentPage = 1;
  for (let i = 1; i <= totalPages; i++) {
    get(`messagePage${i}`).style.display = 'none';
  }
  get(`messagePage${currentPage}`).style.display = 'block';
  updateNavigation();
  mergedSecretMessageModal.style.display = 'flex';
  mainSecretMessageModal.style.display = 'none';
  moonSecretMessageModal.style.display = 'none';
  gabunganGifSet(currentPage - 1);
}

function closeMergedSecretMessage() {
  mergedSecretMessageModal.style.display = 'none';
}

// Event listeners for close buttons
mainCloseButton.addEventListener('click', closeSecretMessage);
moonCloseButton.addEventListener('click', closeMoonSecretMessage);
mergedCloseButton.addEventListener('click', closeMergedSecretMessage);

// Close modals when clicking outside
mainSecretMessageModal.addEventListener('click', (e) => {
  if (e.target === mainSecretMessageModal) {
    closeSecretMessage();
  }
});

moonSecretMessageModal.addEventListener('click', (e) => {
  if (e.target === moonSecretMessageModal) {
    closeMoonSecretMessage();
  }
});

mergedSecretMessageModal.addEventListener('click', (e) => {
  if (e.target === mergedSecretMessageModal) {
    closeMergedSecretMessage();
  }
});

// Countdown logic
function startCountdown() {
  const targetDate = new Date();
  targetDate.setSeconds(targetDate.getSeconds() + 5);
  
  const countdown = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0) {
      clearInterval(countdown);
      countdownDiv.style.display = 'none';
      selamatDiv.style.display = 'block';
      
      // Start the number animation
      animateNumberTransition();
      
      return;
    }
    
    const seconds = Math.floor(distance / 1000);
    countdownDiv.innerHTML = `${seconds}`;
  }, 1000);
}

// Audio management
function initAudio() {
  musik.volume = 0.3;
  musik.play().catch(e => {
    console.log("Background music autoplay failed:", e);
    document.addEventListener('click', () => {
      musik.play().catch(e => console.log("Music play failed:", e));
    }, { once: true });
  });
  // Removed other audio initializations
}

// Enhanced reflection system - UPDATED to only show light reflections
function updateReflections() {
  // Clear existing reflections
  reflectedLight.querySelectorAll('.reflection').forEach(ref => ref.remove());

  // Only reflect glowing elements (lights and effects)
  // The actual objects won't be reflected, only their light effects
}

// Function to create firework reflections (called from script1.js)
function createFireworkReflection(x, y, size = 4) {
  const oceanTop = reflectedLight.getBoundingClientRect().top;
  const reflectedY = oceanTop + (oceanTop - y);
  
  if (reflectedY > oceanTop) {
    const reflection = document.createElement('div');
    reflection.className = 'reflection firework-reflection';
    reflection.style.position = 'absolute';
    reflection.style.left = `${x - size/2}px`;
    reflection.style.top = `${reflectedY}px`;
    reflection.style.width = `${size}px`;
    reflection.style.height = `${size}px`;
    reflection.style.background = 'rgba(255, 255, 255, 0.4)';
    reflection.style.borderRadius = '50%';
    reflection.style.opacity = '0.3';
    
    reflectedLight.appendChild(reflection);
    
    setTimeout(() => {
      if (reflection.parentNode) {
        reflection.parentNode.removeChild(reflection);
      }
    }, 800);
  }
}

// Initialize everything
function init() {
  createStars();
  scheduleNextShootingStar();
  initAudio();
  startCountdown();
  const joiAgeSpan = document.getElementById('joiAge');
  if (joiAgeSpan) {
    joiAgeSpan.textContent = '19';
  }
  updateMoonSecretEnvelopePosition();
  setInterval(updateReflections, 100);
  setInterval(checkEnvelopeProximity, 50);
  const script1 = document.createElement('script');
  script1.src = 'script1.js';
  document.body.appendChild(script1);
}

// Make functions global for HTML onclick handlers
window.showSecretMessage = showSecretMessage;
window.showMoonSecretMessage = showMoonSecretMessage;
window.showMergedSecretMessage = showMergedSecretMessage;
window.nextPage = nextPage;
window.previousPage = previousPage;
window.createFireworkReflection = createFireworkReflection;

// Start everything when page loads
document.addEventListener('DOMContentLoaded', init);

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    musik.pause();
  } else {
    musik.play().catch(e => console.log("Music resume failed:", e));
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'Escape':
      closeSecretMessage();
      closeMoonSecretMessage();
      closeMergedSecretMessage();
      break;
    case 'm':
    case 'M':
      if (musik.paused) {
        musik.play().catch(e => console.log("Music play failed:", e));
      } else {
        musik.pause();
      }
      break;
    case 's':
    case 'S':
      createShootingStar();
      break;
    case 'ArrowLeft':
      if (mergedSecretMessageModal.style.display === 'flex') {
        previousPage();
      }
      break;
    case 'ArrowRight':
      if (mergedSecretMessageModal.style.display === 'flex') {
        nextPage();
      }
      break;
  }
});

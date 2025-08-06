function startFireworks() {
  const canvas = document.getElementById('fireworksCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.zIndex = 20;
  canvas.style.pointerEvents = 'none';
  const fireworks = [];
  const particles = [];
  let fireworkCount = 10;
  let currentLaunchInterval = 600;
  let launchIntervalId;
  const reflectedLight = document.getElementById('reflectedLight');
  const oceanTop = reflectedLight ? reflectedLight.getBoundingClientRect().top : window.innerHeight - 200;
  // JARAK LEDAKAN 50x (random di bagian atas layar, jauh dari laut)
  const minExplosionHeight = 50; // minimal 50px dari atas layar
  const maxExplosionHeight = window.innerHeight * 0.35; // 50x lipat lebih tinggi dari default
  class Firework {
    constructor(x, y, targetY, launchAngle) {
      this.x = x;
      this.y = y;
      this.targetY = targetY;
      this.speed = 3 + Math.random() * 2;
      this.color = `rgba(255, 255, 255, 0.8)`;
      this.launchAngle = launchAngle;
      this.vx = Math.sin(this.launchAngle) * this.speed;
      this.vy = -Math.cos(this.launchAngle) * this.speed;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.05;
      if (this.vy > 0 && this.y >= this.targetY) {
        explode(this.x, this.y, this.color);
        return false;
      }
      return true;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, 2, 2);
    }
  }
  class Particle {
    constructor(x, y, color, sizeMultiplier = 1) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.radius = (Math.random() * 1 + 0.5) * sizeMultiplier;
      this.angle = Math.random() * 2 * Math.PI;
      this.speed = Math.random() * 4 + 2;
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.01;
    }
    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.alpha -= this.decay;
      return this.alpha > 0;
    }
    draw() {
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.shadowBlur = 5;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(this.x, this.y, this.radius, this.radius);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      if (this.alpha > 0.3) {
        createFireworkLightReflection(this.x, this.y, this.radius, this.alpha);
      }
    }
  }
  function createFireworkLightReflection(x, y, size, alpha) {
    const oceanTop = reflectedLight ? reflectedLight.getBoundingClientRect().top : window.innerHeight - 200;
    const reflectedY = oceanTop + (oceanTop - y);
    if (reflectedY > oceanTop && alpha > 0.3) {
      const reflection = document.createElement('div');
      reflection.className = 'firework-light-reflection';
      reflection.style.position = 'absolute';
      reflection.style.left = `${x - size/2}px`;
      reflection.style.top = `${reflectedY}px`;
      reflection.style.width = `${size * 2}px`;
      reflection.style.height = `${size * 2}px`;
      reflection.style.background = `rgba(255, 255, 255, ${alpha * 0.4})`;
      reflection.style.borderRadius = '50%';
      reflection.style.opacity = alpha * 0.6;
      reflection.style.filter = 'blur(1px)';
      reflection.style.transform = 'scaleY(-1)';
      reflection.style.pointerEvents = 'none';
      reflection.style.zIndex = '1';
      reflectedLight.appendChild(reflection);
      setTimeout(() => {
        if (reflection.parentNode) {
          reflection.parentNode.removeChild(reflection);
        }
      }, 200);
    }
  }
  function explode(x, y, color) {
    const numParticles = 12 + Math.floor(Math.random() * 8);
    const sizeMultiplier = 0.4 + Math.random() * 0.3;
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle(x, y, color, sizeMultiplier));
    }
    createMainExplosionReflection(x, y);
  }
  function createMainExplosionReflection(x, y) {
    const oceanTop = reflectedLight ? reflectedLight.getBoundingClientRect().top : window.innerHeight - 200;
    const reflectedY = oceanTop + (oceanTop - y);
    if (reflectedY > oceanTop) {
      const mainReflection = document.createElement('div');
      mainReflection.className = 'main-explosion-reflection';
      mainReflection.style.position = 'absolute';
      mainReflection.style.left = `${x - 30}px`;
      mainReflection.style.top = `${reflectedY}px`;
      mainReflection.style.width = '60px';
      mainReflection.style.height = '60px';
      mainReflection.style.background = 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 50%, transparent 100%)';
      mainReflection.style.borderRadius = '50%';
      mainReflection.style.opacity = '0.8';
      mainReflection.style.filter = 'blur(3px)';
      mainReflection.style.transform = 'scaleY(-1)';
      mainReflection.style.pointerEvents = 'none';
      mainReflection.style.zIndex = '1';
      mainReflection.style.animation = 'explosionReflectionFade 1s ease-out forwards';
      reflectedLight.appendChild(mainReflection);
      setTimeout(() => {
        if (mainReflection.parentNode) {
          mainReflection.parentNode.removeChild(mainReflection);
        }
      }, 1000);
    }
  }
  const style = document.createElement('style');
  style.textContent = `
    @keyframes explosionReflectionFade {
      0% { 
        opacity: 0.8; 
        transform: scaleY(-1) scale(0.5);
      }
      50% { 
        opacity: 0.6; 
        transform: scaleY(-1) scale(1);
      }
      100% { 
        opacity: 0; 
        transform: scaleY(-1) scale(1.5);
      }
    }
  `;
  document.head.appendChild(style);
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = fireworks.length - 1; i >= 0; i--) {
      const f = fireworks[i];
      if (!f.update()) {
        fireworks.splice(i, 1);
      } else {
        f.draw();
      }
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      if (!p.update()) {
        particles.splice(i, 1);
      } else {
        p.draw();
      }
    }
    requestAnimationFrame(animate);
  }
  function launchFirework() {
    const x = Math.random() * canvas.width;
    const y = oceanTop;
    const targetY = minExplosionHeight + Math.random() * (maxExplosionHeight - minExplosionHeight);
    const launchAngle = Math.PI / 2000000 + (Math.random() - 0.5) * Math.PI / 6;
    fireworks.push(new Firework(x, y, targetY, launchAngle));
  }
  function startLaunching() {
    launchFirework();
    fireworkCount--;
    if (fireworkCount > 0) {
      currentLaunchInterval += 100;
      launchIntervalId = setTimeout(startLaunching, currentLaunchInterval);
    } else {
      let extraFireworkCount = 0;
      launchIntervalId = setInterval(() => {
        launchFirework();
        setTimeout(() => {
          launchFirework();
        }, 200);
        extraFireworkCount++;
        if (extraFireworkCount >= 5) {
          clearInterval(launchIntervalId);
        }
      }, 3000);
    }
  }
  const fireworkDuration = 15000;
  startLaunching();
  setTimeout(() => {
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 20000);
  }, fireworkDuration);
  animate();
}
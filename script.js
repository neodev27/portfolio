(function () {
  const field = document.getElementById("starfield");
  const COUNT =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--star-count"
      )
    ) || 120;
  const speedFactor =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--speed-factor"
      )
    ) || 0.1;
  const inactiveDelay =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--inactive-delay"
      )
    ) || 10000;
  const stars = [];
  // Navbar'ı fade-in yapmak için visible sınıfı ekle
window.addEventListener('load', () => {
  const navbar = document.querySelector('.bottom-nav');
  if (navbar) {
    navbar.classList.add('visible');
  }
});


  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Yıldızları oluştur
  for (let i = 0; i < COUNT; i++) {
    const s = document.createElement("div");
    s.className = "star";
    const size = Math.round(Math.pow(Math.random(), 1.8) * 3) + 1;
    s.style.setProperty("--size", size + "px");
    s.style.left = rand(0, 100) + "vw";
    s.style.top = rand(0, 100) + "vh";
    const durBase = rand(40, 140);
    const dur = durBase / speedFactor;
    const animName = Math.random() > 0.5 ? "driftX" : "driftY";
    s.style.animation = `${animName} ${dur}s ease-in-out ${rand(
      0,
      dur
    )}s infinite`;
    s.style.opacity = rand(0.6, 1);
    field.appendChild(s);
    stars.push({ el: s, size, dur });
  }

  // Sparkle/parlama efekti
  let sparkleRunning = true;
  function startSparkles() {
    sparkleRunning = true;
    for (let i = 0; i < stars.length; i++) scheduleSparkle(stars[i]);
  }
  function stopSparkles() {
    sparkleRunning = false;
  }
  function scheduleSparkle(starObj) {
    if (!sparkleRunning) return;
    const interval = rand(0.2, 2.5) * Math.max(1, starObj.dur / 20);
    setTimeout(() => {
      starObj.el.classList.add("pulse");
      setTimeout(() => {
        starObj.el.classList.remove("pulse");
        scheduleSparkle(starObj);
      }, rand(120, 800));
    }, interval * 1000);
  }

  // Görünürlük kontrolü
  let inactiveTimer = null;
  let isVisible = false;
  function setVisible(v) {
    if (v === isVisible) return;
    isVisible = v;
    if (v) {
      field.classList.remove("hidden");
      field.classList.add("visible");
      setTimeout(() => {
        stars.forEach((s) => s.el.classList.add("glow"));
      }, 120);
      startSparkles();
    } else {
      stars.forEach((s) => s.el.classList.remove("glow"));
      field.classList.remove("visible");
      setTimeout(() => field.classList.add("hidden"), 20);
      stopSparkles();
    }
  }

  function resetInactiveTimer() {
    clearTimeout(inactiveTimer);
    setVisible(false);
    inactiveTimer = setTimeout(() => setVisible(true), inactiveDelay);
  }

  inactiveTimer = setTimeout(() => setVisible(true), inactiveDelay);

  let lastMoveTS = 0;
  function onMove() {
    const now = Date.now();
    if (now - lastMoveTS < 50) return;
    lastMoveTS = now;
    resetInactiveTimer();
  }
  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("touchstart", onMove, { passive: true });
  window.addEventListener("touchmove", onMove, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopSparkles();
    else if (isVisible) startSparkles();
  });

  const prm = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prm.matches) {
    stars.forEach((s) => (s.el.style.animation = "none"));
  }

  field.classList.add("hidden");
})();

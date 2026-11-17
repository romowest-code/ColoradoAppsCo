// 13 AI Hacks · motion kit.
// Every animation is a pure function of t (seconds), so the same page plays live in the
// browser and can be stepped frame by frame for the video (window.__REC + window.__seek).
(function () {
  const ticks = [];
  let end = 8;
  const K = {
    clamp: (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)),
    lerp: (a, b, k) => a + (b - a) * k,
    // 0..1 progress of t through [t0, t0+d]
    p: (t, t0, d = 0.6) => K.clamp((t - t0) / d),
    out: (k) => 1 - Math.pow(1 - k, 3),
    inOut: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
    back: (k) => { const c = 1.6; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); },
    money: (v, d = 0) => "$" + v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }),
    tick(fn) { ticks.push(fn); },
    length(s) { end = s; },
    // slide + fade in; resting state (t past the window) is fully visible
    rise(el, t, t0, dy = 26, d = 0.55) {
      const k = K.p(t, t0, d);
      el.style.opacity = K.out(k);
      el.style.transform = `translateY(${(1 - K.back(k)) * dy}px)`;
    },
    pop(el, t, t0, d = 0.5) {
      const k = K.p(t, t0, d);
      el.style.opacity = K.clamp(k * 3);
      el.style.transform = `scale(${0.6 + 0.4 * K.back(k)})`;
    },
    count(el, t, t0, d, from, to, fmt) {
      el.textContent = fmt(K.lerp(from, to, K.out(K.p(t, t0, d))));
    },
  };
  window.K = K;

  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const draw = (t) => ticks.forEach((fn) => fn(t));
  window.__seek = (t) => draw(t);

  function start() {
    if (window.__REC) {
      document.documentElement.classList.add("rec");
      draw(0);
      window.__ready = true;
      return;
    }
    if (reduce) { draw(end); return; }
    let t0 = performance.now();
    const loop = (now) => {
      const t = (now - t0) / 1000;
      draw(Math.min(t, end));
      if (t < end) requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    document.querySelectorAll("button.replay").forEach((b) =>
      b.addEventListener("click", () => { t0 = performance.now(); requestAnimationFrame(loop); }),
    );
  }
  // wait for web fonts so recorded frames never show a fallback face
  window.addEventListener("load", () => (document.fonts ? document.fonts.ready.then(start) : start()));
})();

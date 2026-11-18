/** CSM-inspired diagonal light beams that lean toward the cursor. */
export type BeamFieldOptions = {
  density?: number;
  alpha?: number;
  speed?: number;
  originX?: number;
  bend?: boolean;
  intro?: boolean;
  colors?: Array<[number, number, number]>;
};

export type BeamFieldHandle = {
  destroy: () => void;
  setPointer: (x: number, y: number, active: boolean) => void;
};

export function createBeamField(
  canvas: HTMLCanvasElement,
  opt: BeamFieldOptions = {}
): BeamFieldHandle {
  const rawCtx = canvas.getContext('2d');
  if (!rawCtx) {
    return { destroy: () => undefined, setPointer: () => undefined };
  }
  const ctx: CanvasRenderingContext2D = rawCtx;

  const TAN = Math.tan((21.7 * Math.PI) / 180);
  const COLS = opt.colors ?? [
    [214, 178, 94],
    [255, 140, 80],
    [46, 196, 182],
    [120, 180, 255],
    [255, 200, 140],
  ];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const density = opt.density ?? 18;

  let W = 0;
  let H = 0;
  let dpr = 1;
  let beams: Array<{
    far: boolean;
    ci: number;
    c: [number, number, number];
    x: number;
    w: number;
    a: number;
    v: number;
    top: number;
    bot: number;
    spark: number;
    sv: number;
  }> = [];
  let running = true;
  let raf = 0;
  const m = { x: -9999, y: -9999, sx: -9999, sy: -9999, on: 0 };
  const t0 = performance.now();
  const T_HOLD = 900;
  const T_BURST = 1800;
  const ease4 = (p: number) => 1 - Math.pow(1 - p, 4);
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

  function build() {
    const n = Math.round((W + H * TAN) / density);
    beams = [];
    for (let i = 0; i < n; i++) {
      const far = Math.random() < 0.55;
      const r = Math.random();
      const ci = r < 0.4 ? 0 : r < 0.65 ? 1 : r < 0.88 ? 2 : r < 0.95 ? 3 : 4;
      const wide = Math.random() ** 3;
      beams.push({
        far,
        ci,
        c: COLS[ci],
        x: -H * TAN + Math.random() * (W + H * TAN + 40),
        w: far ? 1 + wide * 8 : 2 + wide * 70,
        a: far ? 0.04 + Math.random() * 0.08 : 0.1 + Math.random() * 0.22,
        v: (far ? 0.03 + Math.random() * 0.05 : 0.08 + Math.random() * 0.18) * (opt.speed ?? 1),
        top: Math.random() * (far ? 0.45 : 0.3),
        bot: (far ? 0.55 : 0.7) + Math.random() * 0.3,
        spark: !far && Math.random() < 0.4 ? Math.random() : -1,
        sv: 0.002 + Math.random() * 0.004,
      });
    }
    beams.sort((a, b) => (a.far === b.far ? 0 : a.far ? -1 : 1));
  }

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 1.75);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  const quad = (x: number, w: number, y1: number, y2: number) => {
    ctx.beginPath();
    ctx.moveTo(x + (H - y2) * TAN, y2);
    ctx.lineTo(x + w + (H - y2) * TAN, y2);
    ctx.lineTo(x + w + (H - y1) * TAN, y1);
    ctx.lineTo(x + (H - y1) * TAN, y1);
    ctx.closePath();
    ctx.fill();
  };

  function frame(now: number) {
    if (!running) return;
    const t = opt.intro ? now - t0 : 1e9;
    const burst = opt.intro ? ease4(clamp01((t - T_HOLD) / (T_BURST - T_HOLD))) : 1;
    m.sx += (m.x - m.sx) * 0.1;
    m.sy += (m.y - m.sy) * 0.1;
    m.on += ((m.x > -9000 ? 1 : 0) - m.on) * 0.06;

    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'screen';

    const ox = W * (opt.originX ?? 0.72);
    const homeOf = (ci: number) => ox + (ci % 3) * 50 - (H - H * 0.46) * TAN;
    const parX = m.on * (m.sx - W / 2);

    for (const b of beams) {
      if (!reduce) b.x += b.v;
      if (b.x > W + 120) b.x = -H * TAN - 120;
      const depth = b.far ? 0.012 : 0.035;
      const bx = b.x - parX * depth;
      let x = homeOf(b.ci) + (bx - homeOf(b.ci)) * burst;
      let w = b.w * (opt.intro ? 0.35 + 0.65 * burst : 1);
      let a = b.a * (opt.alpha ?? 1) * burst;

      if ((opt.bend ?? true) && m.on > 0.02) {
        const d = m.sx - (x + (H - m.sy) * TAN + w / 2);
        const k = Math.exp(-(d * d) / (2 * 260 * 260)) * m.on;
        x += d * 0.38 * k * (b.far ? 0.5 : 1);
        a *= 1 + k * 0.6;
      }
      if (a < 0.003) continue;

      const y2 = H - H * (1 - b.bot);
      const yy1 = H * b.top;
      const [r, g, bl] = b.c;
      const grad = ctx.createLinearGradient(0, yy1, 0, y2);
      grad.addColorStop(0, `rgba(${r},${g},${bl},0)`);
      grad.addColorStop(0.5, `rgba(${r},${g},${bl},${a})`);
      grad.addColorStop(1, `rgba(${r},${g},${bl},0)`);
      ctx.fillStyle = grad;
      quad(x, w, yy1, y2);

      if (m.on > 0.02 && burst > 0.9) {
        const bxAtM = x + (H - m.sy) * TAN + w / 2;
        const d = bxAtM - m.sx;
        const inf = Math.exp(-(d * d) / (2 * 120 * 120)) * m.on * (b.far ? 0.55 : 1);
        if (inf > 0.02) {
          const ly1 = Math.max(yy1, m.sy - 220);
          const ly2 = Math.min(y2, m.sy + 220);
          if (ly2 > ly1) {
            const lg = ctx.createLinearGradient(0, ly1, 0, ly2);
            const pk = Math.min(0.85, (a + 0.25) * inf * 1.6);
            lg.addColorStop(0, 'rgba(255,255,255,0)');
            lg.addColorStop(clamp01((m.sy - ly1) / (ly2 - ly1)), `rgba(${r},${g},${bl},${pk * 0.55})`);
            lg.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = lg;
            quad(x, w, ly1, ly2);
          }
        }
      }

      if (b.spark >= 0 && burst > 0.95) {
        if (!reduce) b.spark += b.sv;
        if (b.spark > 1) b.spark = 0;
        const sy = y2 - (y2 - yy1) * b.spark;
        const sx = x + w / 2 + (H - sy) * TAN;
        const sl = 56;
        const sg = ctx.createLinearGradient(sx, sy, sx + sl * TAN, sy - sl);
        sg.addColorStop(0, `rgba(${r},${g},${bl},0)`);
        sg.addColorStop(1, `rgba(${r},${g},${bl},0.8)`);
        ctx.strokeStyle = sg;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + sl * TAN, sy - sl);
        ctx.stroke();
      }
    }

    if (m.on > 0.02) {
      const sg = ctx.createRadialGradient(m.sx, m.sy, 0, m.sx, m.sy, 280);
      sg.addColorStop(0, `rgba(214,178,94,${0.12 * m.on})`);
      sg.addColorStop(0.45, `rgba(46,196,182,${0.05 * m.on})`);
      sg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = sg;
      ctx.fillRect(m.sx - 280, m.sy - 280, 560, 560);
    }

    ctx.globalCompositeOperation = 'source-over';
    raf = requestAnimationFrame(frame);
  }

  let resizeTimer = 0;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 120);
  };

  resize();
  addEventListener('resize', onResize);
  const io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting && !running) {
      running = true;
      raf = requestAnimationFrame(frame);
    } else if (!en.isIntersecting) {
      running = false;
      cancelAnimationFrame(raf);
    }
  });
  io.observe(canvas);
  raf = requestAnimationFrame(frame);

  return {
    setPointer(x, y, active) {
      if (!active) {
        m.x = -9999;
        return;
      }
      m.x = x;
      m.y = y;
      if (m.sx < -9000) {
        m.sx = x;
        m.sy = y;
      }
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      removeEventListener('resize', onResize);
      io.disconnect();
    },
  };
}

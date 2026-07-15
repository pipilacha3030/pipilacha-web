/* ============================================================
   HERO WebGL (solo Inicio, solo escritorio con puntero fino).
   Mejora progresiva: la <img> del hero es el fallback/póster. Un
   <canvas> encima la usa como textura y aplica un shader:
     · ondulado ambiente lento (las flores "respiran")
     · disolución reactiva al cursor (cerca del puntero la imagen se
       deshace en un centelleo de pétalos y se recompone al alejarse)
   Si no hay WebGL, es reduced-motion o pantalla táctil, el canvas
   queda invisible y se ve la foto tal cual. Cero dependencias.

   Rendimiento: DPR limitado, se pausa con la pestaña oculta o cuando
   el hero sale del viewport; el clock es gsap.ticker (loop único).
   Ciclo de vida: se detiene en onPageDestroy (transición SPA).
   ============================================================ */
import { gsap } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { onPageDestroy, pageSignal } from '../utils/lifecycle.js';

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;      // tamaño del canvas (px)
uniform vec2 uImg;      // tamaño de la imagen (px)
uniform float uTime;
uniform vec2 uMouse;    // 0..1, y desde abajo
uniform float uHover;   // 0..1 presencia del puntero (suavizada)
uniform float uReveal;  // 0..1 entrada

// --- value noise ---
float hash(vec2 p){ p = fract(p*vec2(123.34,345.45)); p += dot(p, p+34.345); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), u.x),
             mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
}

// UV tipo background-size: cover
vec2 coverUV(vec2 uv, vec2 res, vec2 img){
  float ra = res.x/res.y, ia = img.x/img.y;
  vec2 s = ra > ia ? vec2(1.0, ia/ra) : vec2(ra/ia, 1.0);
  return (uv - 0.5) * s + 0.5;
}

void main(){
  vec2 uv = coverUV(vUv, uRes, uImg);
  // leve zoom de reposo para casar con la <img> asentada (scale 1.02)
  uv = (uv - 0.5) / 1.02 + 0.5;

  float t = uTime * 0.05;
  // ondulado ambiente (domain warp): las flores se mecen muy despacio
  vec2 flow = vec2(noise(uv*2.6 + t), noise(uv*2.6 - t + 7.3)) - 0.5;
  uv += flow * 0.010;

  // influencia del cursor (corrige aspecto para que el radio sea circular)
  float asp = uRes.x/uRes.y;
  vec2 m = vec2(uMouse.x, uMouse.y);
  vec2 d = (vUv - m) * vec2(asp, 1.0);
  float infl = smoothstep(0.34, 0.0, length(d)) * uHover;

  // disolución: desplazamiento por ruido fino + centelleo hacia crema
  vec2 scatter = vec2(noise(uv*9.0 + t*4.0), noise(uv*9.0 - t*4.0 + 3.0)) - 0.5;
  uv += scatter * 0.055 * infl;

  vec3 col = texture2D(uTex, clamp(uv, 0.001, 0.999)).rgb;
  float spark = noise(uv*22.0 + t*6.0);
  col = mix(col, col*1.12 + vec3(0.04,0.03,0.0), infl*0.55);
  col += infl * smoothstep(0.72, 1.0, spark) * 0.18; // pétalos que brillan al deshacerse

  col *= mix(1.06, 1.0, uReveal); // un respiro de luz al aparecer
  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
  return s;
}

export function initHeroGL() {
  const canvas = document.getElementById('heroGL');
  const img = document.querySelector('.hero__media img');
  if (!canvas || !img) return;

  // solo escritorio con puntero fino; nunca con reduced-motion
  const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (reduceMotion || !fine || window.innerWidth < 900) return;

  let gl;
  try {
    gl = canvas.getContext('webgl', { antialias: true, alpha: false, premultipliedAlpha: false })
      || canvas.getContext('experimental-webgl');
  } catch (_) { /* noop */ }
  if (!gl) return; // sin WebGL → se queda la <img>

  let running = true, tickerFn = null, tex = null, prog = null, buf = null, io = null;
  const stop = () => {
    if (!running) return;
    running = false;
    if (tickerFn) gsap.ticker.remove(tickerFn);
    try {
      if (tex) gl.deleteTexture(tex);
      if (buf) gl.deleteBuffer(buf);
      if (prog) gl.deleteProgram(prog);
      const lose = gl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
    } catch (_) { /* noop */ }
    if (io) io.disconnect();
  };
  onPageDestroy(stop);

  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
    gl.useProgram(prog);

    buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const U = (n) => gl.getUniformLocation(prog, n);
    const uTex = U('uTex'), uRes = U('uRes'), uImg = U('uImg'),
      uTime = U('uTime'), uMouse = U('uMouse'), uHover = U('uHover'), uReveal = U('uReveal');

    const uploadTexture = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.uniform2f(uImg, img.naturalWidth || 1600, img.naturalHeight || 900);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
      if (w && h && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w; canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    // solo vida ambiente (ondulado lento); el efecto reactivo al puntero se retiró
    // → uMouse/uHover quedan a 0 (valor por defecto del uniform) y la disolución
    //   del shader se anula (infl = 0)
    const opts = { signal: pageSignal() };
    const heroEl = document.querySelector('.hero');
    window.addEventListener('resize', resize, opts);

    // pausa el render cuando el hero sale de pantalla (batería/CPU)
    let visible = true;
    io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0.01 });
    io.observe(heroEl);

    const onImgReady = () => { uploadTexture(); };
    if (img.complete && img.naturalWidth) uploadTexture();
    else img.addEventListener('load', onImgReady, opts);

    resize();
    gl.uniform1i(uTex, 0);

    const t0 = performance.now();
    let reveal = 0;
    tickerFn = () => {
      if (!running || !visible || document.hidden) return;
      reveal += (1 - reveal) * 0.02;
      gl.uniform1f(uTime, (performance.now() - t0) / 1000);
      gl.uniform1f(uReveal, reveal);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    gsap.ticker.add(tickerFn);

    // aparece cuando la <img> ya se asentó (la entrada del hero dura ~1.8s)
    gsap.to(canvas, { autoAlpha: 1, duration: 1.1, delay: 1.7, ease: 'power2.out' });
  } catch (err) {
    stop();
    canvas.style.display = 'none'; // cualquier fallo → foto limpia
  }
}

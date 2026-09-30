/* Zoltar: draw a digit, a CNN trained on MNIST guesses it.
   The network runs in plain JavaScript, so it works in every browser.

   Architecture (from mnist_convnet.py):
   conv 5x5 (1→32) · SiLU · conv 5x5 (32→32) · SiLU · max-pool 2
   conv 3x3 (32→64) · SiLU · conv 3x3 (64→64) · SiLU · max-pool 2 · linear 576→10 */

const WEIGHTS_URL = 'content/web/mnist-weights.js';

let weightsPromise = null;
let layers = null;

// The weights are a base64 safetensors file wrapped in a script, so they also load from file://
function loadWeights() {
    if (layers) return Promise.resolve(layers);
    if (!weightsPromise) {
        weightsPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = WEIGHTS_URL;
            script.onload = () => {
                layers = parseSafetensors(window.MNIST_WEIGHTS);
                delete window.MNIST_WEIGHTS;
                resolve(layers);
            };
            script.onerror = reject;
            document.head.append(script);
        });
    }
    return weightsPromise;
}

function parseSafetensors(base64) {
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const view = new DataView(bytes.buffer);
    const headerLength = Number(view.getBigUint64(0, true));
    const header = JSON.parse(new TextDecoder().decode(bytes.subarray(8, 8 + headerLength)));
    const start = 8 + headerLength;
    const tensor = (name) => {
        const [from, to] = header[name].data_offsets;
        // slice() copies, which also fixes the alignment Float32Array needs
        return new Float32Array(bytes.slice(start + from, start + to).buffer);
    };
    return {
        c1: { w: tensor('layers.0.weight'), b: tensor('layers.0.bias'), out: 32, in: 1, k: 5 },
        c2: { w: tensor('layers.2.weight'), b: tensor('layers.2.bias'), out: 32, in: 32, k: 5 },
        c3: { w: tensor('layers.5.weight'), b: tensor('layers.5.bias'), out: 64, in: 32, k: 3 },
        c4: { w: tensor('layers.7.weight'), b: tensor('layers.7.bias'), out: 64, in: 64, k: 3 },
        fc: { w: tensor('layers.11.weight'), b: tensor('layers.11.bias') },
    };
}

// Valid convolution (no padding, stride 1) followed by SiLU. x is [channels][size][size], flat.
function convSilu(x, size, layer) {
    const { w, b, out, in: inC, k } = layer;
    const outSize = size - k + 1;
    const y = new Float32Array(out * outSize * outSize);
    for (let o = 0; o < out; o++) {
        for (let r = 0; r < outSize; r++) {
            for (let c = 0; c < outSize; c++) {
                let sum = b[o];
                for (let i = 0; i < inC; i++) {
                    const wBase = ((o * inC + i) * k) * k;
                    const xBase = i * size * size;
                    for (let kr = 0; kr < k; kr++) {
                        const xRow = xBase + (r + kr) * size + c;
                        const wRow = wBase + kr * k;
                        for (let kc = 0; kc < k; kc++) sum += w[wRow + kc] * x[xRow + kc];
                    }
                }
                y[(o * outSize + r) * outSize + c] = sum / (1 + Math.exp(-sum));
            }
        }
    }
    return { y, size: outSize };
}

function maxPool(x, channels, size) {
    const half = size >> 1;
    const y = new Float32Array(channels * half * half);
    for (let ch = 0; ch < channels; ch++) {
        for (let r = 0; r < half; r++) {
            for (let c = 0; c < half; c++) {
                const i = (ch * size + r * 2) * size + c * 2;
                y[(ch * half + r) * half + c] = Math.max(x[i], x[i + 1], x[i + size], x[i + size + 1]);
            }
        }
    }
    return { y, size: half };
}

// input: 784 values in [-1, 1], white digit on black. Returns the 10 logits.
function runCnn(input) {
    let a = convSilu(input, 28, layers.c1);
    a = convSilu(a.y, a.size, layers.c2);
    a = maxPool(a.y, 32, a.size);
    a = convSilu(a.y, a.size, layers.c3);
    a = convSilu(a.y, a.size, layers.c4);
    a = maxPool(a.y, 64, a.size);
    const { w, b } = layers.fc;
    const logits = new Float32Array(10);
    for (let j = 0; j < 10; j++) {
        let sum = b[j];
        for (let i = 0; i < 576; i++) sum += w[j * 576 + i] * a.y[i];
        logits[j] = sum;
    }
    return logits;
}

/* Turn the drawing into an MNIST-style image: crop the digit, fit it in 20x20,
   then centre it by its centre of mass in 28x28 — the way MNIST was made. */
function toMnist(source) {
    const S = source.width;
    const pixels = source.getContext('2d').getImageData(0, 0, S, S).data;
    let minX = S, minY = S, maxX = -1, maxY = -1;
    for (let y = 0; y < S; y++) {
        for (let x = 0; x < S; x++) {
            if (pixels[(y * S + x) * 4] > 40) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }
    if (maxX < 0) return null;

    const w = maxX - minX + 1;
    const h = maxY - minY + 1;
    const scale = 20 / Math.max(w, h);
    const fitted = document.createElement('canvas');
    fitted.width = fitted.height = 28;
    const fctx = fitted.getContext('2d', { willReadFrequently: true });
    fctx.fillStyle = '#000';
    fctx.fillRect(0, 0, 28, 28);
    fctx.imageSmoothingEnabled = true;
    fctx.imageSmoothingQuality = 'high';
    fctx.drawImage(source, minX, minY, w, h, 0, 0, w * scale, h * scale);

    // Centre of mass of the fitted digit
    const small = fctx.getImageData(0, 0, 28, 28).data;
    let mass = 0, mx = 0, my = 0;
    for (let y = 0; y < 28; y++) {
        for (let x = 0; x < 28; x++) {
            const v = small[(y * 28 + x) * 4];
            mass += v;
            mx += v * x;
            my += v * y;
        }
    }
    const dx = Math.round(14 - mx / mass);
    const dy = Math.round(14 - my / mass);

    const out = document.createElement('canvas');
    out.width = out.height = 28;
    const octx = out.getContext('2d', { willReadFrequently: true });
    octx.fillStyle = '#000';
    octx.fillRect(0, 0, 28, 28);
    octx.drawImage(fitted, dx, dy);

    const data = octx.getImageData(0, 0, 28, 28).data;
    const input = new Float32Array(784);
    for (let i = 0; i < 784; i++) input[i] = (data[i * 4] / 255) * 2 - 1;
    return { input, image: out };
}

/* The widget. labels: { draw, says, is(d), seen, clear, loading } in the current language. */
function mountZoltar(root, labels) {
    root.innerHTML = `
        <div class="z-pad">
            <canvas class="z-canvas" aria-label="${labels.draw}"></canvas>
            <p class="z-empty">${labels.draw}</p>
        </div>
        <div class="z-side">
            <p class="z-label">${labels.says}</p>
            <p class="z-digit" aria-live="polite">?</p>
            <p class="z-sentence"></p>
            <div class="z-seen"><canvas width="28" height="28"></canvas><span>${labels.seen}</span></div>
            <button type="button" class="btn btn-sm btn-ghost z-clear">${labels.clear}</button>
        </div>`;

    const canvas = root.querySelector('.z-canvas');
    const ctx = canvas.getContext('2d');
    const empty = root.querySelector('.z-empty');
    const digitEl = root.querySelector('.z-digit');
    const sentence = root.querySelector('.z-sentence');
    const seen = root.querySelector('.z-seen canvas').getContext('2d');

    // What the network reads: the same strokes, white on black, at a fixed size
    const model = document.createElement('canvas');
    model.width = model.height = 280;
    const mctx = model.getContext('2d', { willReadFrequently: true });

    const ink = () => getComputedStyle(root).getPropertyValue('--ink').trim() || '#1f2328';

    // The pad gets its real size only once the project page is on screen
    const fit = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const size = Math.round(canvas.clientWidth * dpr);
        if (size > 0 && canvas.width !== size) {
            canvas.width = canvas.height = size;
            clear();
        }
    };
    new ResizeObserver(fit).observe(canvas);

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        mctx.fillStyle = '#000';
        mctx.fillRect(0, 0, 280, 280);
        seen.clearRect(0, 0, 28, 28);
        digitEl.textContent = '?';
        sentence.textContent = '';
        root.classList.remove('has-guess');
        empty.hidden = false;
    }

    let drawing = false;
    let last = null;
    let guessTimer = null;

    function point(e) {
        const r = canvas.getBoundingClientRect();
        return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
    }

    function stroke(from, to) {
        const lineTo = (c, size, width, colour) => {
            c.strokeStyle = colour;
            c.lineWidth = width;
            c.lineCap = 'round';
            c.lineJoin = 'round';
            c.beginPath();
            c.moveTo(from.x * size, from.y * size);
            c.lineTo(to.x * size, to.y * size);
            c.stroke();
        };
        lineTo(ctx, canvas.width, canvas.width * 0.065, ink());
        lineTo(mctx, 280, 20, '#fff');
    }

    canvas.addEventListener('pointerdown', (e) => {
        try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* drawing still works without it */ }
        drawing = true;
        empty.hidden = true;
        last = point(e);
        stroke(last, last);
    });
    canvas.addEventListener('pointermove', (e) => {
        if (!drawing) return;
        const p = point(e);
        stroke(last, p);
        last = p;
    });
    const end = () => {
        if (!drawing) return;
        drawing = false;
        clearTimeout(guessTimer);
        guessTimer = setTimeout(guess, 200);
    };
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
    root.querySelector('.z-clear').addEventListener('click', clear);

    async function guess() {
        const prepared = toMnist(model);
        if (!prepared) return;
        seen.drawImage(prepared.image, 0, 0);
        if (!layers) sentence.textContent = labels.loading;
        await loadWeights();
        const logits = runCnn(prepared.input);
        const digit = logits.indexOf(Math.max(...logits));
        if (digitEl.textContent !== String(digit)) {
            digitEl.textContent = digit;
            digitEl.classList.remove('pop');
            void digitEl.offsetWidth;
            digitEl.classList.add('pop');
        }
        sentence.textContent = labels.is(digit);
        root.classList.add('has-guess');
    }

    clear();
    loadWeights(); // start downloading while the visitor draws
}

window.mountZoltar = mountZoltar;

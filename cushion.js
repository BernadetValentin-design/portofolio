/* The e-textile capacitive matrix, as a live demo inside its project page.
   The anti-pressure-sore cushion in an exploded view: seven layers, with 32 silver rows (TX)
   and 32 silver columns (RX) separated by felt. A finger presses the cover: the row and column
   under it light up, the pressure map heats up, and holding still too long raises the
   "change position" alert. A button assembles and explodes the layers.

   mountCushion(root, t) — root is an empty element; t(key) gives the texts. */

(function () {
    const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.159.0/build/three.min.js';

    function loadThree() {
        if (window.THREE) return Promise.resolve(window.THREE);
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = THREE_URL;
            script.onload = () => resolve(window.THREE);
            script.onerror = reject;
            document.head.append(script);
        });
    }

    // Colours of the project: blue for the system, orange for pressure and risk
    const BLUE = '#2f45d6';
    const ORANGE = '#e0602f';
    const N = 32;              // 32 × 32 crossings
    const W = 3.2;             // side of the cushion
    const ALERT_AFTER = 4;     // seconds: stands for the 30 minutes of the real device
    const HEAVY = 60;          // mmHg threshold

    // Top to bottom: [thickness, colour, kind]
    const LAYERS = [
        [0.05, BLUE, 'cover'],
        [0.1, '#e6e9fb', 'soft'],
        [0.02, '#c7cff3', 'columns'],
        [0.07, '#f2f3f7', 'felt'],
        [0.02, '#c7cff3', 'rows'],
        [0.07, '#f2f3f7', 'felt'],
        [0.03, '#26282f', 'ground'],
    ];

    // A finger lying on its back side up, coming from behind the cushion: tip at the origin,
    // three phalanges going up and away, the nail on top of the last one
    function buildFinger(THREE, mat) {
        const finger = new THREE.Group();
        const skin = mat('#e8b99b', { roughness: 0.55 });
        const segments = [[0.16, 0.2, 22], [0.17, 0.26, 36], [0.18, 0.38, 50]];   // radius, length, angle from horizontal
        let base = new THREE.Vector3(0, 0, 0);
        segments.forEach(([r, len, deg], i) => {
            const a = (deg * Math.PI) / 180;
            const u = new THREE.Vector3(0, Math.sin(a), -Math.cos(a));   // from the tip towards the hand
            const centre = base.clone().addScaledVector(u, (i === 0 ? r : 0) + len / 2);
            const bone = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 8, 20), skin);
            bone.position.copy(centre);
            bone.rotation.x = a - Math.PI / 2;
            bone.castShadow = true;
            finger.add(bone);
            if (i === 0) {
                // the nail, flat on the back of the last phalanx
                const up = new THREE.Vector3(0, Math.cos(a), Math.sin(a));
                const nail = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), mat('#f4d9cc', { roughness: 0.25 }));
                nail.scale.set(0.11, 0.15, 0.03);
                nail.rotation.x = a - Math.PI / 2;
                nail.position.copy(centre).addScaledVector(up, r * 0.92).addScaledVector(u, -0.03);
                finger.add(nail);
            }
            base = centre.clone().addScaledVector(u, len / 2);
        });
        return finger;
    }

    function mountCushion(root, t) {
        root.innerHTML = `
            <img class="cushion-poster" src="content/web/fpga.jpg" alt="">
            <canvas class="cushion-canvas" aria-label="${t('tissu_title')}"></canvas>
            <div class="cushion-labels" aria-hidden="true">${LAYERS.map((_, i) => `<span class="cushion-label"><b>${i + 1}</b><span>${t('tissu_layers')[i]}</span></span>`).join('')}</div>
            <div class="cushion-hud">
                <div class="cushion-map-box"><canvas width="${N}" height="${N}" class="cushion-map"></canvas></div>
                <div>
                    <p class="cushion-hud-title">${t('tissu_map')}</p>
                    <p class="cushion-read">—</p>
                    <p class="cushion-state">${t('tissu_idle')}</p>
                </div>
            </div>
            <button type="button" class="btn btn-sm btn-ghost cushion-toggle">${t('cushion_assemble')}</button>`;

        const canvas = root.querySelector('.cushion-canvas');
        const labelEls = [...root.querySelectorAll('.cushion-label')];
        const mapEl = root.querySelector('.cushion-map');
        const mapCtx = mapEl.getContext('2d');
        // the 3D part; the measuring panel sits under it
        const stage = document.createElement('div');
        stage.className = 'cushion-stage';
        root.prepend(stage);
        stage.append(root.querySelector('.cushion-poster'), canvas, root.querySelector('.cushion-labels'), root.querySelector('.cushion-toggle'));
        const readEl = root.querySelector('.cushion-read');
        const stateEl = root.querySelector('.cushion-state');
        const toggle = root.querySelector('.cushion-toggle');

        loadThree().then((THREE) => {
            if (root.isConnected) run(THREE);
        }).catch(() => { /* no network: the photo stays */ });

        function run(THREE) {
            const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.setClearColor(0x000000, 0);
            root.classList.add('is-running');

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);

            scene.add(new THREE.HemisphereLight('#ffffff', '#c9cde0', 1.6));
            const key = new THREE.DirectionalLight('#ffffff', 1.4);
            key.position.set(4, 8, 5);
            key.castShadow = true;
            key.shadow.mapSize.set(1024, 1024);
            Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4 });
            key.shadow.bias = -0.0006;
            scene.add(key);

            const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...extra });
            const stack = new THREE.Group();
            stack.rotation.y = -0.6;
            scene.add(stack);

            // ---------- Pressure field, shown on the cover and on the small screen ----------
            const field = new Float32Array(N * N);          // 0..1 per crossing
            const coverArt = document.createElement('canvas');
            coverArt.width = coverArt.height = 256;
            const coverCtx = coverArt.getContext('2d');
            const small = document.createElement('canvas');
            small.width = small.height = N;
            const smallCtx = small.getContext('2d');
            const coverTexture = new THREE.CanvasTexture(coverArt);
            coverTexture.colorSpace = THREE.SRGBColorSpace;

            // ---------- The layers ----------
            const layers = LAYERS.map(([thick, colour, kind]) => {
                const g = new THREE.Group();
                stack.add(g);
                if (kind === 'cover') {
                    // the cover is a soft sheet the finger can dent
                    const geo = new THREE.PlaneGeometry(W, W, 64, 64);
                    geo.rotateX(-Math.PI / 2);
                    const top = new THREE.Mesh(geo, mat(0xffffff, { map: coverTexture, roughness: 0.55 }));
                    top.position.y = thick / 2;
                    top.castShadow = top.receiveShadow = true;
                    g.add(top);
                    const edge = new THREE.Mesh(new THREE.BoxGeometry(W, thick * 0.98, W), mat(colour));
                    edge.castShadow = true;
                    g.add(edge);
                    g.userData.dent = { geo, rest: Float32Array.from(geo.attributes.position.array) };
                } else {
                    const slab = new THREE.Mesh(new THREE.BoxGeometry(W, thick, W), mat(colour, kind === 'ground' ? { roughness: 0.5, metalness: 0.4 } : {}));
                    slab.castShadow = slab.receiveShadow = true;
                    g.add(slab);
                }
                if (kind === 'columns' || kind === 'rows') {
                    // 32 silver knit strips, 8 mm wide every 12.5 mm
                    const pitch = W / N;
                    const strips = new THREE.InstancedMesh(new THREE.BoxGeometry(pitch * 0.64, 0.012, W * 0.98),
                        mat(0xffffff, { metalness: 0.35, roughness: 0.45 }), N);
                    const m = new THREE.Matrix4();
                    for (let s = 0; s < N; s++) {
                        const p = -W / 2 + pitch * (s + 0.5);
                        // columns run along z at x = p; rows run along x at z = p (same index as the map)
                        if (kind === 'rows') m.makeRotationY(Math.PI / 2).setPosition(0, thick / 2 + 0.006, p);
                        else m.makeTranslation(p, thick / 2 + 0.006, 0);
                        strips.setMatrixAt(s, m);
                        strips.setColorAt(s, new THREE.Color('#c9ccd4'));
                    }
                    g.add(strips);
                    g.userData.strips = strips;
                }
                return { g, thick };
            });

            const guide = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1, 8),
                new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0.45 }));
            guide.visible = false;
            scene.add(guide);

            const finger = buildFinger(THREE, mat);
            finger.visible = false;
            scene.add(finger);

            // ---------- Size: follows the box on the page ----------
            let dist = 9;
            const resize = () => {
                const w = stage.clientWidth, h = stage.clientHeight;
                if (!w || !h) return;
                renderer.setSize(w, h, false);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                const half = Math.tan((camera.fov * Math.PI) / 360);
                dist = Math.max(3.0 / half, 3.3 / (half * camera.aspect));
            };
            const observer = new ResizeObserver(resize);
            observer.observe(stage);
            resize();

            // ---------- Assemble / explode ----------
            let target = 0, progress = 0;
            toggle.addEventListener('click', () => {
                target = target ? 0 : 1;
                toggle.textContent = t(target ? 'cushion_explode' : 'cushion_assemble');
            });

            // ---------- The finger follows the pointer; a press pushes it in ----------
            const raycaster = new THREE.Raycaster();
            const ndc = new THREE.Vector2();
            const pointer = { over: false, down: false, x: 0, z: 0 };   // x, z on the cover
            const topPlane = new THREE.Mesh(new THREE.PlaneGeometry(W, W).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ visible: false }));
            topPlane.position.y = LAYERS[0][0] / 2;
            layers[0].g.add(topPlane);

            const aim = (e) => {
                const r = canvas.getBoundingClientRect();
                ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
                raycaster.setFromCamera(ndc, camera);
                const hit = raycaster.intersectObject(topPlane)[0];
                pointer.over = !!hit;
                if (hit) {
                    const local = layers[0].g.worldToLocal(hit.point.clone());
                    pointer.x = local.x;
                    pointer.z = local.z;
                }
                canvas.style.cursor = hit ? 'none' : '';
            };
            // with a mouse, the finger hovers and a click presses; a touch always presses
            canvas.addEventListener('pointermove', (e) => { aim(e); if (e.pointerType !== 'mouse') pointer.down = pointer.over; });
            canvas.addEventListener('pointerdown', (e) => { aim(e); pointer.down = pointer.over; });
            const onUp = () => { pointer.down = false; };
            window.addEventListener('pointerup', onUp);
            canvas.addEventListener('pointerleave', () => { pointer.over = false; pointer.down = false; canvas.style.cursor = ''; });

            // ---------- Animation ----------
            const clock = new THREE.Clock();
            let press = 0;              // 0: hovering, 1: pushed in
            let still = 0;              // seconds without moving while pressing
            let last = { row: -1, col: -1 };
            let relief = 0;             // shows "pressure relieved" for a moment
            let wasAlert = false;
            const lit = { row: -1, col: -1 };
            const baseColour = new THREE.Color('#c9ccd4');
            const rowColour = new THREE.Color(ORANGE);
            const colColour = new THREE.Color(BLUE);
            const corner = new THREE.Vector3();
            const tipPos = new THREE.Vector3();

            (function frame() {
                // the project page was closed or changed: stop and free the graphics card
                if (!root.isConnected) {
                    observer.disconnect();
                    window.removeEventListener('pointerup', onUp);
                    renderer.dispose();
                    return;
                }
                const dt = Math.min(0.25, clock.getDelta());
                const time = clock.elapsedTime;
                const ease = (rate) => 1 - Math.exp(-rate * dt);   // smoothing that does not depend on the frame rate
                progress += (target - progress) * ease(3.5);

                // exploded ↔ assembled
                const gap = 0.45 * (1 - progress * progress * (3 - 2 * progress));
                let y = 0.2;
                for (let i = layers.length - 1; i >= 0; i--) {
                    layers[i].g.position.y = y + layers[i].thick / 2;
                    y += layers[i].thick + gap;
                }
                stack.rotation.y = -0.6 + Math.sin(time * 0.2) * 0.06;

                // crossing under the finger
                const pitch = W / N;
                const col = Math.min(N - 1, Math.max(0, Math.floor((pointer.x + W / 2) / pitch)));
                const row = Math.min(N - 1, Math.max(0, Math.floor((pointer.z + W / 2) / pitch)));
                press += ((pointer.over && pointer.down ? 1 : 0) - press) * ease(11);

                // pressure field: a soft round footprint under the fingertip
                const fieldEase = ease(8);
                for (let r = 0; r < N; r++) {
                    for (let c = 0; c < N; c++) {
                        const dx = c - col, dz = r - row;
                        const want = pointer.over ? press * Math.exp(-(dx * dx + dz * dz) / 7) : 0;
                        field[r * N + c] += (want - field[r * N + c]) * fieldEase;
                    }
                }

                // stillness counter and alert
                const moved = row !== last.row || col !== last.col;
                if (press > 0.5 && !moved) still += dt;
                else if (moved || press < 0.3) {
                    if (wasAlert) relief = 2;
                    still = 0;
                    wasAlert = false;
                }
                last = { row, col };
                const alert = still > ALERT_AFTER;
                if (alert) wasAlert = true;
                relief = Math.max(0, relief - dt);

                // light the row (TX) and the column (RX) under the finger
                const rows = layers[4].g.userData.strips, cols = layers[2].g.userData.strips;
                const on = pointer.over && press > 0.2;
                if (on ? (lit.row !== row || lit.col !== col) : lit.row !== -1) {
                    for (let s = 0; s < N; s++) {
                        rows.setColorAt(s, on && s === row ? rowColour : baseColour);
                        cols.setColorAt(s, on && s === col ? colColour : baseColour);
                    }
                    rows.instanceColor.needsUpdate = cols.instanceColor.needsUpdate = true;
                    lit.row = on ? row : -1;
                    lit.col = on ? col : -1;
                }

                // the map: blue at rest, orange where it presses (redder when alerting)
                const img = smallCtx.createImageData(N, N);
                let peak = 0;
                const hot = alert ? [214, 58, 32] : [224, 96, 47];
                for (let k = 0; k < N * N; k++) {
                    const v = field[k];
                    peak = Math.max(peak, v);
                    img.data[k * 4] = 47 + (hot[0] - 47) * v;
                    img.data[k * 4 + 1] = 69 + (hot[1] - 69) * v;
                    img.data[k * 4 + 2] = 214 + (hot[2] - 214) * v;
                    img.data[k * 4 + 3] = 255;
                }
                smallCtx.putImageData(img, 0, 0);
                mapCtx.imageSmoothingEnabled = false;
                mapCtx.drawImage(small, 0, 0);
                coverCtx.imageSmoothingEnabled = true;
                coverCtx.drawImage(small, 0, 0, 256, 256);
                coverTexture.needsUpdate = true;

                // dent in the cover under the finger
                const { geo, rest } = layers[0].g.userData.dent;
                const arr = geo.attributes.position.array;
                const depth = pointer.over ? press : 0;
                for (let i = 0; i < arr.length; i += 3) {
                    const dx = rest[i] - pointer.x, dz = rest[i + 2] - pointer.z;
                    arr[i + 1] = rest[i + 1] - depth * 0.07 * Math.exp(-(dx * dx + dz * dz) / 0.06);
                }
                geo.attributes.position.needsUpdate = true;
                geo.computeVertexNormals();

                // the finger: hovers above the point, goes down on a press
                finger.visible = pointer.over;
                if (finger.visible) {
                    tipPos.set(pointer.x, LAYERS[0][0] / 2, pointer.z);
                    layers[0].g.localToWorld(tipPos);
                    finger.position.set(tipPos.x, tipPos.y + 0.02 + (1 - press) * 0.3 + Math.sin(time * 3) * 0.012 * (1 - press), tipPos.z);
                }

                // turn the map like the cover appears on screen: its x axis follows the cushion's x axis
                corner.set(-W / 2, 0, 0);
                layers[0].g.localToWorld(corner);
                corner.project(camera);
                const ax = corner.x, ay = corner.y;
                corner.set(W / 2, 0, 0);
                layers[0].g.localToWorld(corner);
                corner.project(camera);
                const angle = Math.atan2(-(corner.y - ay) * stage.clientHeight, (corner.x - ax) * stage.clientWidth);
                mapEl.style.transform = `rotate(${angle}rad)`;

                // a faint vertical line under the finger, down through the layers
                guide.visible = on;
                if (on) {
                    tipPos.set(pointer.x, 0, pointer.z);
                    layers[0].g.localToWorld(tipPos);
                    guide.position.set(tipPos.x, (0.2 + tipPos.y) / 2, tipPos.z);
                    guide.scale.y = Math.max(0.01, tipPos.y - 0.2);
                }

                // readouts
                const mmHg = Math.round(peak * 85);
                readEl.textContent = on ? `TX ${row + 1} · RX ${col + 1} · ${mmHg} mmHg` : '—';
                stateEl.className = 'cushion-state' + (alert ? ' is-alert' : relief > 0 ? ' is-ok' : '');
                stateEl.textContent = alert ? t('tissu_alert')
                    : relief > 0 ? t('tissu_relief')
                        : on && mmHg > HEAVY ? t('tissu_still')(still.toFixed(1))
                            : t('tissu_idle');

                // labels beside each layer (the corner furthest right on screen), fading as they close up
                const box = { width: stage.clientWidth, height: stage.clientHeight };
                const opacity = Math.max(0, 1 - progress * 1.8);
                layers.forEach((L, i) => {
                    let best = null;
                    for (const [cx, cz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
                        corner.set(cx * W / 2, 0, cz * W / 2);
                        L.g.localToWorld(corner);
                        corner.project(camera);
                        if (!best || corner.x > best.x) best = { x: corner.x, y: corner.y };
                    }
                    labelEls[i].style.transform = `translate(${(best.x + 1) / 2 * box.width + 10}px, ${(1 - best.y) / 2 * box.height - 9}px)`;
                    labelEls[i].style.opacity = opacity;
                });

                // camera: the stack sits a little to the left, leaving room for the labels
                const centre = (0.2 + y) / 2;
                camera.position.set(0.7 + dist * 0.05, centre + dist * 0.55, dist * 0.83);
                camera.lookAt(0.7, centre - 0.1, 0);

                renderer.render(scene, camera);
                requestAnimationFrame(frame);
            })();
        }
    }

    window.mountCushion = mountCushion;
})();

/* A small live WebGPU scene: raymarched spheres that melt into each other
   (smooth union), in the site's colours, following the mouse.
   Same technique as the 3D Scene Editor project.

   mountBlobs(canvas) resolves to true when the scene runs, false when the
   browser has no WebGPU (the caller then keeps its fallback image). */

const BLOBS_SHADER = /* wgsl */ `
struct Uniforms {
    time: f32,
    aspect: f32,
    mouse: vec2f,
    bg: vec4f,
    accent: vec4f,
    ink: vec4f,
};
@group(0) @binding(0) var<uniform> u: Uniforms;

struct VertexOut {
    @builtin(position) pos: vec4f,
    @location(0) uv: vec2f,
};

// One triangle that covers the whole canvas
@vertex
fn vs(@builtin(vertex_index) i: u32) -> VertexOut {
    var corners = array<vec2f, 3>(vec2f(-1.0, -3.0), vec2f(-1.0, 1.0), vec2f(3.0, 1.0));
    var out: VertexOut;
    out.pos = vec4f(corners[i], 0.0, 1.0);
    out.uv = corners[i];
    return out;
}

// Smooth minimum: what makes two spheres melt into one
fn smin(a: f32, b: f32, k: f32) -> f32 {
    let h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

fn scene(p: vec3f) -> f32 {
    var d = 1e9;
    for (var i = 0; i < 5; i++) {
        let f = f32(i);
        let centre = vec3f(
            sin(u.time * 0.55 + f * 1.7) * 0.95,
            cos(u.time * 0.45 + f * 2.3) * 0.55,
            sin(u.time * 0.35 + f) * 0.4
        );
        d = smin(d, length(p - centre) - (0.26 + 0.05 * f), 0.45);
    }
    // One sphere follows the mouse
    let m = vec3f(u.mouse.x * 1.3 * u.aspect, u.mouse.y * 0.9, 0.4);
    return smin(d, length(p - m) - 0.3, 0.5);
}

fn normalAt(p: vec3f) -> vec3f {
    let e = vec2f(0.002, 0.0);
    return normalize(vec3f(
        scene(p + e.xyy) - scene(p - e.xyy),
        scene(p + e.yxy) - scene(p - e.yxy),
        scene(p + e.yyx) - scene(p - e.yyx)
    ));
}

@fragment
fn fs(in: VertexOut) -> @location(0) vec4f {
    let origin = vec3f(0.0, 0.0, 3.2);
    let dir = normalize(vec3f(in.uv.x * u.aspect, in.uv.y, -2.2));

    var t = 0.0;
    var hit = false;
    for (var i = 0; i < 128; i++) {
        let d = scene(origin + dir * t);
        if (d < 0.001 * t) { hit = true; break; }
        // Smooth unions under-estimate the distance a little: step a bit shorter
        t += d * 0.8;
        if (t > 8.0) { break; }
    }
    if (!hit) { return vec4f(u.bg.rgb, 1.0); }

    let p = origin + dir * t;
    let n = normalAt(p);
    let light = normalize(vec3f(0.6, 0.8, 0.9));
    let diffuse = max(dot(n, light), 0.0);
    let spec = pow(max(dot(reflect(-light, n), -dir), 0.0), 32.0);
    let rim = pow(1.0 - max(dot(n, -dir), 0.0), 3.0);

    var col = u.accent.rgb * (0.35 + 0.65 * diffuse);
    col = mix(col, u.ink.rgb, rim * 0.25);
    col += vec3f(1.0) * spec * 0.55;
    return vec4f(col, 1.0);
}
`;

function cssColor(name) {
    const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const n = parseInt(hex.replace('#', ''), 16);
    if (Number.isNaN(n)) return [1, 1, 1, 1];
    return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, 1];
}

let gpuDevice = null;

async function getDevice() {
    if (gpuDevice) return gpuDevice;
    if (!('gpu' in navigator)) return null;
    try {
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) return null;
        gpuDevice = await adapter.requestDevice();
        gpuDevice.lost.then(() => { gpuDevice = null; });
        return gpuDevice;
    } catch (e) {
        return null;
    }
}

async function mountBlobs(canvas) {
    const device = await getDevice();
    if (!device || !canvas.isConnected) return false;

    const context = canvas.getContext('webgpu');
    if (!context) return false;
    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({ device, format, alphaMode: 'opaque' });

    const module = device.createShaderModule({ code: BLOBS_SHADER });
    const pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: { module, entryPoint: 'vs' },
        fragment: { module, entryPoint: 'fs', targets: [{ format }] },
        primitive: { topology: 'triangle-list' },
    });

    const uniforms = new Float32Array(16);
    const buffer = device.createBuffer({ size: uniforms.byteLength, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer } }],
    });

    // Keep the drawing buffer at the canvas' real size
    const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
        canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    // The mouse sphere eases towards the pointer
    const mouse = { x: 0.6, y: 0.2, tx: 0.6, ty: 0.2 };
    const onMove = (e) => {
        const r = canvas.getBoundingClientRect();
        mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
        mouse.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove);

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now();
    let colours = null;
    let frame = 0;

    (function draw() {
        if (!canvas.isConnected) {
            observer.disconnect();
            window.removeEventListener('pointermove', onMove);
            return;
        }
        // Re-read the colours now and then, so the theme switch is picked up
        if (frame++ % 30 === 0) colours = [cssColor('--paper-2'), cssColor('--accent'), cssColor('--ink')];

        mouse.x += (mouse.tx - mouse.x) * 0.06;
        mouse.y += (mouse.ty - mouse.y) * 0.06;
        uniforms[0] = still ? 2.0 : (performance.now() - start) / 1000;
        uniforms[1] = canvas.width / canvas.height;
        uniforms[2] = mouse.x;
        uniforms[3] = mouse.y;
        uniforms.set(colours[0], 4);
        uniforms.set(colours[1], 8);
        uniforms.set(colours[2], 12);
        device.queue.writeBuffer(buffer, 0, uniforms);

        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
            colorAttachments: [{ view: context.getCurrentTexture().createView(), loadOp: 'clear', storeOp: 'store', clearValue: { r: 0, g: 0, b: 0, a: 1 } }],
        });
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.draw(3);
        pass.end();
        device.queue.submit([encoder.finish()]);

        if (!still) requestAnimationFrame(draw);
    })();

    return true;
}

window.mountBlobs = mountBlobs;

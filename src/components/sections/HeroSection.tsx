'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

/**
 * SRS FR-001: Hero Section
 *
 * Features:
 * - WebGL shader ocean animation background
 * - Hero gradient overlay
 * - Headline Lora Bold "Nhận nuôi san hô — Gieo mầm cho đại dương"
 * - Sub-headline Vietnamese (SRS H-02)
 * - CTA chính "Nhận nuôi ngay →" → /san-pham (SRS H-03)
 * - CTA phụ "Tìm hiểu thêm ↓" scroll xuống section 2 (SRS H-04)
 * - CTA styling: rounded-lg (SRS Design Spec 4.3.5)
 * - Mobile responsive: display-lg → display-lg-mobile
 *
 * TODO: Replace shader with actual video when CLB provides 1920×1080 file
 */
function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;
    const ctx = gl as WebGLRenderingContext;

    function syncSize() {
      const c = canvas;
      const w = c.clientWidth || 1280;
      const h = c.clientHeight || 720;
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
      }
    }

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(syncSize).observe(canvas);
    }
    syncSize();

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
varying vec2 v_texCoord;
void main() {
    vec2 uv = v_texCoord;
    float wave1 = sin(uv.x * 3.0 + u_time * 0.5) * 0.05;
    float wave2 = sin(uv.y * 2.0 + u_time * 0.3) * 0.02;
    vec3 oceanBlue = vec3(0.71, 0.85, 0.91);
    vec3 navyDeep = vec3(0.06, 0.30, 0.36);
    vec3 tealMid = vec3(0.36, 0.66, 0.71);
    float mixFactor = clamp(uv.y + wave1 + wave2, 0.0, 1.0);
    vec3 color = mix(navyDeep, oceanBlue, mixFactor);
    float shimmer = pow(max(0.0, 1.0 - uv.y + sin(u_time * 0.2 + uv.x * 10.0) * 0.05), 4.0) * 0.1;
    color += shimmer;
    gl_FragColor = vec4(color, 1.0);
}`;

    function createShader(type: number, src: string) {
      const s = ctx.createShader(type);
      if (!s) return null;
      ctx.shaderSource(s, src);
      ctx.compileShader(s);
      return s;
    }

    const vertShader = createShader(ctx.VERTEX_SHADER, vs);
    const fragShader = createShader(ctx.FRAGMENT_SHADER, fs);
    if (!vertShader || !fragShader) return;

    const prog = ctx.createProgram();
    if (!prog) return;
    ctx.attachShader(prog, vertShader);
    ctx.attachShader(prog, fragShader);
    ctx.linkProgram(prog);
    ctx.useProgram(prog);

    const buf = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buf);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), ctx.STATIC_DRAW);
    const pos = ctx.getAttribLocation(prog, 'a_position');
    ctx.enableVertexAttribArray(pos);
    ctx.vertexAttribPointer(pos, 2, ctx.FLOAT, false, 0, 0);

    const uTime = ctx.getUniformLocation(prog, 'u_time');
    const uRes = ctx.getUniformLocation(prog, 'u_resolution');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    window.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    });

    function render(t: number) {
      if (typeof ResizeObserver === 'undefined') syncSize();
      ctx.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) ctx.uniform1f(uTime, t * 0.001);
      if (uRes) ctx.uniform2f(uRes, canvas.width, canvas.height);
      ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    }
    render(0);

    return () => {
      // Cleanup handled by component unmount
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
      style={{ display: 'block' }}
    />
  );
}

export function HeroSection() {
  const scrollToSection2 = () => {
    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      statsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative min-h-screen flex items-center justify-center pt-20">
      {/* WebGL Shader Background */}
      <ShaderBackground />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 hero-gradient-overlay z-10" />

      {/* Content */}
      <div className="relative z-20 text-center max-w-4xl px-[var(--spacing-margin-mobile)]">
        {/* Headline (SRS H-01) */}
        <h1 className="font-heading-serif text-display-lg-mobile md:text-display-lg text-primary mb-4 leading-tight">
          Nhận nuôi san hô —{' '}
          <br className="hidden md:block" />{' '}
          Gieo mầm cho đại dương
        </h1>

        {/* Sub-headline (SRS H-02) */}
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-4 max-w-2xl mx-auto">
          Mỗi san hô bạn nhận nuôi sẽ được theo dõi, cập nhật ảnh và lớn lên cùng bạn.
        </p>

        {/* CTA Buttons (SRS H-03, H-04 + Design Spec 4.3.5) */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
          {/* CTA chính: "Nhận nuôi ngay →" — Coral Orange, rounded-lg */}
          <Link
            href="/san-pham"
            className="bg-secondary text-on-secondary px-10 py-4 rounded-lg font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-normal"
          >
            Nhận nuôi ngay →
          </Link>
          {/* CTA phụ: "Tìm hiểu thêm ↓" — ghost button with Navy border */}
          <button
            onClick={scrollToSection2}
            className="border-2 border-primary text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-primary hover:text-on-primary transition-all duration-normal"
          >
            Tìm hiểu thêm ↓
          </button>
        </div>
      </div>
    </header>
  );
}

import React, { useEffect, useRef } from 'react';

const noiseSvg = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

export const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    let isDark = document.documentElement.classList.contains('dark');
    const observer = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains('dark');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const setupCanvas = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    setupCanvas();
    window.addEventListener('resize', setupCanvas);

    // Telemetry Packets (API Health Pings & Latency Signals)
    const packets = Array.from({ length: 15 }, (_, i) => ({
      xProgress: (i / 15) + Math.random() * 0.05,
      speed: 0.0007 + Math.random() * 0.0011,
      waveId: i % 2 === 0 ? 1 : 2, // 1 for primary wave, 2 for secondary
      size: 2.5 + Math.random() * 1.8,
      type: i % 4 === 0 ? 'green' : i % 3 === 0 ? 'cyan' : 'sky',
      tail: [],
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    // Occasional Ping Rings (Simulating endpoint health check pulses)
    const pingRings = [];
    let lastRingTime = 0;

    let startTime = performance.now();

    const getWaveY = (x, t, waveId, h) => {
      if (waveId === 1) {
        // Primary API Latency Stream
        const baseline = h * 0.45;
        const w1 = Math.sin(x * 0.0022 + t * 0.85) * 42;
        const w2 = Math.sin(x * 0.0055 - t * 0.55) * 20;
        const w3 = Math.cos(x * 0.0012 + t * 0.3) * 14;
        return baseline + w1 + w2 + w3;
      } else if (waveId === 2) {
        // Secondary Throughput Wave
        const baseline = h * 0.60;
        const w1 = Math.sin(x * 0.0018 + t * 0.65 + 1.8) * 46;
        const w2 = Math.cos(x * 0.0042 + t * 0.4) * 24;
        return baseline + w1 + w2;
      } else {
        // Tertiary Baseline Echo
        const baseline = h * 0.74;
        const w1 = Math.sin(x * 0.0015 - t * 0.45 + 3.4) * 30;
        const w2 = Math.sin(x * 0.0032 + t * 0.3) * 12;
        return baseline + w1 + w2;
      }
    };

    const render = (currentTime) => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const t = (currentTime - startTime) * 0.001;

      ctx.clearRect(0, 0, width, height);

      // 1. Subtle Ambient Radial Center Glow
      const centerGlow = ctx.createRadialGradient(
        width * 0.5, height * 0.48, 50,
        width * 0.5, height * 0.48, Math.max(width, height) * 0.75
      );
      if (isDark) {
        centerGlow.addColorStop(0, 'rgba(14, 165, 233, 0.07)');
        centerGlow.addColorStop(0.5, 'rgba(6, 182, 212, 0.025)');
        centerGlow.addColorStop(1, 'rgba(8, 8, 10, 0)');
      } else {
        centerGlow.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
        centerGlow.addColorStop(0.5, 'rgba(14, 165, 233, 0.05)');
        centerGlow.addColorStop(1, 'rgba(250, 252, 255, 0)');
      }
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. Technical Telemetry Grid (Telemetry Observatory Lines & Labels)
      ctx.save();
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.06)' : 'rgba(14, 165, 233, 0.09)';

      const gridYLevels = [0.25, 0.45, 0.60, 0.78];
      const gridLabels = ['350ms', '180ms', '60ms', '10ms'];

      ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
      ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.35)' : 'rgba(100, 116, 139, 0.45)';

      gridYLevels.forEach((pct, idx) => {
        const y = height * pct;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        // Right-aligned telemetry latency marker
        ctx.fillText(gridLabels[idx], width - 52, y - 6);
      });
      ctx.restore();

      // 3. Draw Tertiary Baseline Wave (Subtle background harmonic)
      ctx.save();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.22)' : 'rgba(14, 165, 233, 0.22)';
      ctx.beginPath();
      for (let x = 0; x <= width; x += 12) {
        const y = getWaveY(x, t, 3, height);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // 4. Draw Secondary Wave (Throughput Stream)
      ctx.save();
      const wave2Grad = ctx.createLinearGradient(0, 0, width, 0);
      if (isDark) {
        wave2Grad.addColorStop(0, 'rgba(14, 165, 233, 0.15)');
        wave2Grad.addColorStop(0.3, 'rgba(56, 189, 248, 0.45)');
        wave2Grad.addColorStop(0.7, 'rgba(99, 102, 241, 0.4)');
        wave2Grad.addColorStop(1, 'rgba(14, 165, 233, 0.15)');
      } else {
        wave2Grad.addColorStop(0, 'rgba(14, 165, 233, 0.2)');
        wave2Grad.addColorStop(0.3, 'rgba(14, 165, 233, 0.45)');
        wave2Grad.addColorStop(0.7, 'rgba(56, 189, 248, 0.4)');
        wave2Grad.addColorStop(1, 'rgba(14, 165, 233, 0.2)');
      }
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = wave2Grad;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 8) {
        const y = getWaveY(x, t, 2, height);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // 5. Draw Primary Telemetry Pulse Wave (Prominent glowing latency stream with fill)
      ctx.save();
      const wave1Grad = ctx.createLinearGradient(0, 0, width, 0);
      if (isDark) {
        wave1Grad.addColorStop(0, 'rgba(34, 211, 238, 0.2)');
        wave1Grad.addColorStop(0.25, 'rgba(56, 189, 248, 0.75)');
        wave1Grad.addColorStop(0.65, 'rgba(6, 182, 212, 0.85)');
        wave1Grad.addColorStop(0.85, 'rgba(129, 140, 248, 0.7)');
        wave1Grad.addColorStop(1, 'rgba(14, 165, 233, 0.2)');
      } else {
        wave1Grad.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
        wave1Grad.addColorStop(0.3, 'rgba(14, 165, 233, 0.75)');
        wave1Grad.addColorStop(0.7, 'rgba(56, 189, 248, 0.7)');
        wave1Grad.addColorStop(1, 'rgba(6, 182, 212, 0.3)');
      }

      ctx.lineWidth = 2.4;
      ctx.strokeStyle = wave1Grad;
      ctx.shadowColor = isDark ? 'rgba(56, 189, 248, 0.6)' : 'rgba(14, 165, 233, 0.45)';
      ctx.shadowBlur = isDark ? 14 : 8;

      ctx.beginPath();
      for (let x = 0; x <= width; x += 6) {
        const y = getWaveY(x, t, 1, height);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Area fill beneath primary wave
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      const fillGrad = ctx.createLinearGradient(0, height * 0.38, 0, height);
      if (isDark) {
        fillGrad.addColorStop(0, 'rgba(6, 182, 212, 0.07)');
        fillGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.03)');
        fillGrad.addColorStop(1, 'rgba(8, 8, 10, 0)');
      } else {
        fillGrad.addColorStop(0, 'rgba(14, 165, 233, 0.08)');
        fillGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.03)');
        fillGrad.addColorStop(1, 'rgba(250, 252, 255, 0)');
      }
      ctx.fillStyle = fillGrad;
      ctx.shadowBlur = 0;
      ctx.fill();
      ctx.restore();

      // 6. Occasional Ping Event Ripple Rings
      if (currentTime - lastRingTime > 2600) {
        lastRingTime = currentTime;
        const randomX = width * (0.2 + Math.random() * 0.6);
        const ringWave = Math.random() > 0.5 ? 1 : 2;
        const randomY = getWaveY(randomX, t, ringWave, height);
        pingRings.push({
          x: randomX,
          y: randomY,
          radius: 2,
          maxRadius: 28 + Math.random() * 20,
          opacity: 0.8,
        });
      }

      for (let i = pingRings.length - 1; i >= 0; i--) {
        const ring = pingRings[i];
        ring.radius += 0.8;
        ring.opacity -= 0.018;

        if (ring.opacity <= 0 || ring.radius >= ring.maxRadius) {
          pingRings.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? `rgba(56, 189, 248, ${ring.opacity * 0.6})`
          : `rgba(14, 165, 233, ${ring.opacity * 0.5})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      // 7. Render Telemetry Packets (Flowing Health Pings & Latency Signals)
      packets.forEach((p) => {
        p.xProgress += p.speed;
        if (p.xProgress > 1.05) {
          p.xProgress = -0.05;
          p.speed = 0.0007 + Math.random() * 0.0011;
          p.waveId = Math.random() > 0.4 ? 1 : 2;
          p.tail = [];
        }

        const px = p.xProgress * width;
        const py = getWaveY(px, t, p.waveId, height);

        // Update trailing tail
        p.tail.unshift({ x: px, y: py });
        if (p.tail.length > 5) p.tail.pop();

        // Draw tail
        if (p.tail.length > 1) {
          ctx.save();
          for (let ti = 0; ti < p.tail.length - 1; ti++) {
            const pt1 = p.tail[ti];
            const pt2 = p.tail[ti + 1];
            const tailOpacity = (1 - ti / p.tail.length) * (isDark ? 0.4 : 0.3);
            ctx.strokeStyle = p.type === 'green'
              ? `rgba(16, 185, 129, ${tailOpacity})`
              : p.type === 'cyan'
              ? `rgba(6, 182, 212, ${tailOpacity})`
              : `rgba(56, 189, 248, ${tailOpacity})`;
            ctx.lineWidth = p.size * (1 - ti / p.tail.length);
            ctx.beginPath();
            ctx.moveTo(pt1.x, pt1.y);
            ctx.lineTo(pt2.x, pt2.y);
            ctx.stroke();
          }
          ctx.restore();
        }

        // Draw glowing packet dot
        ctx.save();
        const pulse = 1 + Math.sin(t * 4 + p.pulseOffset) * 0.25;
        const drawRadius = p.size * pulse;

        let packetColor;
        let packetShadow;
        if (p.type === 'green') {
          // Healthy 200 OK Ping
          packetColor = isDark ? '#34D399' : '#10B981';
          packetShadow = 'rgba(16, 185, 129, 0.8)';
        } else if (p.type === 'cyan') {
          packetColor = isDark ? '#22D3EE' : '#06B6D4';
          packetShadow = 'rgba(6, 182, 212, 0.8)';
        } else {
          packetColor = isDark ? '#38BDF8' : '#0EA5E9';
          packetShadow = 'rgba(14, 165, 233, 0.8)';
        }

        ctx.shadowColor = packetShadow;
        ctx.shadowBlur = isDark ? 12 : 7;
        ctx.fillStyle = packetColor;

        ctx.beginPath();
        ctx.arc(px, py, drawRadius, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright core
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(px, py, drawRadius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setupCanvas);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#FAFCFF] dark:bg-[#08080A] transition-colors duration-500 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
      {/* Luxury Film Grain Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] brightness-100 contrast-150 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url("${noiseSvg}")` }}
      />
    </div>
  );
};

export default AnimatedBackground;

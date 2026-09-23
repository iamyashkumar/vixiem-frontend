import React, { useEffect, useRef } from 'react';

export const TelemetryGraphBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let offset = 0;

    const render = () => {
      offset += 0.015;
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');

      // High-contrast delicate telemetry colors
      const gridColor = isDark ? 'rgba(255, 255, 255, 0.035)' : 'rgba(0, 0, 0, 0.035)';
      const primaryLine = isDark ? 'rgba(16, 185, 129, 0.28)' : 'rgba(16, 185, 129, 0.20)';
      const secondaryLine = isDark ? 'rgba(52, 211, 153, 0.16)' : 'rgba(5, 150, 105, 0.12)';
      const tertiaryLine = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
      const dotColor = isDark ? 'rgba(16, 185, 129, 0.60)' : 'rgba(16, 185, 129, 0.45)';

      // 1. Draw 2D Cartesian Graph Grid Lines
      const gridSize = 44;
      ctx.beginPath();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 2. Draw Subtle Graph Waves (Telemetry curves behind text)
      // Wave 1 - Primary telemetry curve (middle to lower-half)
      const baseHeight1 = height * 0.42;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 4) {
        const y =
          baseHeight1 +
          Math.sin(x * 0.003 + offset) * 45 +
          Math.cos(x * 0.007 - offset * 0.8) * 25 +
          Math.sin(x * 0.015 + offset * 1.5) * 12;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = primaryLine;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Wave 1 Area Fill (Soft translucent gradient)
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      const grad1 = ctx.createLinearGradient(0, baseHeight1 - 60, 0, height);
      grad1.addColorStop(0, isDark ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.03)');
      grad1.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = grad1;
      ctx.fill();

      // Wave 2 - Secondary telemetry baseline curve
      const baseHeight2 = height * 0.68;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 4) {
        const y =
          baseHeight2 +
          Math.sin(x * 0.004 - offset * 0.9) * 35 +
          Math.cos(x * 0.008 + offset * 0.7) * 20;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = secondaryLine;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Wave 3 - Upper subtle network frequency line
      const baseHeight3 = height * 0.22;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 6) {
        const y =
          baseHeight3 +
          Math.sin(x * 0.005 + offset * 1.2) * 20 +
          Math.sin(x * 0.012 - offset * 0.5) * 10;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = tertiaryLine;
      ctx.lineWidth = 1;
      ctx.stroke();

      // 3. Telemetry Pulse Nodes (Moving data packets along Wave 1)
      const numDots = 5;
      for (let i = 0; i < numDots; i++) {
        const progress = ((offset * 0.35 + i / numDots) % 1);
        const dotX = progress * width;
        const dotY =
          baseHeight1 +
          Math.sin(dotX * 0.003 + offset) * 45 +
          Math.cos(dotX * 0.007 - offset * 0.8) * 25 +
          Math.sin(dotX * 0.015 + offset * 1.5) * 12;

        ctx.beginPath();
        ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.shadowColor = '#10B981';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-100 transition-opacity duration-300"
      aria-hidden="true"
    />
  );
};

export default TelemetryGraphBackground;

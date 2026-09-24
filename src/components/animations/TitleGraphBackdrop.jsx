import React, { useEffect, useRef } from 'react';

export const TitleGraphBackdrop = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    let offset = 0;

    const render = () => {
      offset += 0.02;
      const width = canvas.width;
      const height = canvas.height;
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const isDark = document.documentElement.classList.contains('dark');

      // 1. Draw subtle localized coordinate grid
      const gridSize = 28;
      ctx.beginPath();
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
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

      // 2. Draw localized flowing graph curve directly behind title text
      const midY = height * 0.55;

      // Primary wave
      ctx.beginPath();
      for (let x = 0; x <= width; x += 3) {
        const y = midY + Math.sin(x * 0.008 + offset) * 16 + Math.cos(x * 0.015 - offset * 0.6) * 8;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      // Linear gradient stroke with fade out on edges
      const strokeGrad = ctx.createLinearGradient(0, 0, width, 0);
      strokeGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
      strokeGrad.addColorStop(0.2, isDark ? 'rgba(16, 185, 129, 0.45)' : 'rgba(16, 185, 129, 0.35)');
      strokeGrad.addColorStop(0.8, isDark ? 'rgba(52, 211, 153, 0.45)' : 'rgba(5, 150, 105, 0.35)');
      strokeGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');

      ctx.strokeStyle = strokeGrad;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Area fill underneath wave
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      const fillGrad = ctx.createLinearGradient(0, midY - 20, 0, height);
      fillGrad.addColorStop(0, isDark ? 'rgba(16, 185, 129, 0.06)' : 'rgba(16, 185, 129, 0.04)');
      fillGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = fillGrad;
      ctx.fill();

      // Secondary subtle baseline wave
      ctx.beginPath();
      for (let x = 0; x <= width; x += 4) {
        const y = midY + Math.sin(x * 0.006 - offset * 0.8) * 10 + Math.cos(x * 0.012 + offset) * 6;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 3. Pulse nodes along wave
      const numDots = 3;
      for (let i = 0; i < numDots; i++) {
        const progress = ((offset * 0.25 + i / numDots) % 0.8) + 0.1;
        const dotX = progress * width;
        const dotY = midY + Math.sin(dotX * 0.008 + offset) * 16 + Math.cos(dotX * 0.015 - offset * 0.6) * 8;

        ctx.beginPath();
        ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(16, 185, 129, 0.85)' : 'rgba(16, 185, 129, 0.7)';
        ctx.shadowColor = '#10B981';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none -z-0 w-full h-full"
      aria-hidden="true"
    />
  );
};

export default TitleGraphBackdrop;

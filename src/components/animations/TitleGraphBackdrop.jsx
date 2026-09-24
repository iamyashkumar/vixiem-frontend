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

    // Laser beam properties
    let beamX = 0;
    const beamSpeed = 1.8; // Smooth sweep speed
    const beamRadius = 110; // Width of glow influence
    const dotSpacing = 18; // Spacing between matrix dots

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const isDark = document.documentElement.classList.contains('dark');

      // Update laser beam position
      beamX += beamSpeed;
      if (beamX > width + beamRadius) {
        beamX = -beamRadius;
      }

      // 1. Draw Laser Scanner Beam (Vertical gradient bar)
      if (beamX > 0 && beamX < width) {
        // Soft ambient glow bar behind the laser
        const glowGrad = ctx.createLinearGradient(beamX - 40, 0, beamX + 10, 0);
        glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
        glowGrad.addColorStop(0.7, isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.05)');
        glowGrad.addColorStop(1, isDark ? 'rgba(16, 185, 129, 0.20)' : 'rgba(16, 185, 129, 0.12)');
        
        ctx.fillStyle = glowGrad;
        ctx.fillRect(beamX - 40, 0, 40, height);

        // Core thin laser line
        const lineGrad = ctx.createLinearGradient(0, 0, 0, height);
        lineGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
        lineGrad.addColorStop(0.2, isDark ? 'rgba(16, 185, 129, 0.45)' : 'rgba(16, 185, 129, 0.35)');
        lineGrad.addColorStop(0.5, isDark ? 'rgba(52, 211, 153, 0.85)' : 'rgba(5, 150, 105, 0.70)');
        lineGrad.addColorStop(0.8, isDark ? 'rgba(16, 185, 129, 0.45)' : 'rgba(16, 185, 129, 0.35)');
        lineGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');

        ctx.beginPath();
        ctx.moveTo(beamX, 0);
        ctx.lineTo(beamX, height);
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#10B981';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      }

      // 2. Draw Dot Matrix Grid with Interactive Illumination
      const baseAlpha = isDark ? 0.08 : 0.07;
      const baseRadius = 1.2;

      for (let x = dotSpacing / 2; x < width; x += dotSpacing) {
        // Distance to the sweeping beam
        const dist = Math.abs(x - beamX);
        const inGlow = dist < beamRadius;

        // Phosphor decay curve: dots behind the beam stay lit slightly longer
        const isTrailing = x < beamX && dist < beamRadius * 0.9;
        const proximity = inGlow ? Math.pow(1 - dist / beamRadius, isTrailing ? 1.5 : 2.5) : 0;

        for (let y = dotSpacing / 2; y < height; y += dotSpacing) {
          // Edge fade (dots fade out smoothly near top, bottom, and side borders)
          const edgeFadeX = Math.min(1, Math.min(x / 40, (width - x) / 40));
          const edgeFadeY = Math.min(1, Math.min(y / 20, (height - y) / 20));
          const edgeMultiplier = edgeFadeX * edgeFadeY;

          ctx.beginPath();
          
          if (proximity > 0.05) {
            // Illuminated Dot (swept by laser radar)
            const dotR = baseRadius + proximity * 1.5;
            ctx.arc(x, y, dotR, 0, Math.PI * 2);

            const rAlpha = Math.min(1, (baseAlpha + proximity * 0.75) * edgeMultiplier);
            ctx.fillStyle = isDark
              ? `rgba(52, 211, 153, ${rAlpha})`
              : `rgba(16, 185, 129, ${rAlpha})`;

            if (proximity > 0.4) {
              ctx.shadowColor = '#10B981';
              ctx.shadowBlur = proximity * 8;
            }
            ctx.fill();
            ctx.shadowBlur = 0;
          } else {
            // Baseline Idle Dot
            ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
            ctx.fillStyle = isDark 
              ? `rgba(255, 255, 255, ${baseAlpha * edgeMultiplier})` 
              : `rgba(0, 0, 0, ${baseAlpha * edgeMultiplier})`;
            ctx.fill();
          }
        }
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

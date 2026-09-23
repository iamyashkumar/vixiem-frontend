import React, { useEffect, useRef } from 'react';

// Major Global Datacenter Regions
const DATACENTERS = [
  { id: 'SFO', name: 'US-West (SF)', lat: 37.77, lon: -122.42 },
  { id: 'NYC', name: 'US-East (NYC)', lat: 40.71, lon: -74.00 },
  { id: 'SAO', name: 'SA-East (São Paulo)', lat: -23.55, lon: -46.63 },
  { id: 'LON', name: 'EU-West (London)', lat: 51.51, lon: -0.13 },
  { id: 'FRA', name: 'EU-Central (Frankfurt)', lat: 50.11, lon: 8.68 },
  { id: 'DXB', name: 'ME-Central (Dubai)', lat: 25.20, lon: 55.27 },
  { id: 'BOM', name: 'AP-South (Mumbai)', lat: 19.07, lon: 72.87 },
  { id: 'SIN', name: 'AP-Southeast (Singapore)', lat: 1.35, lon: 103.82 },
  { id: 'HND', name: 'AP-Northeast (Tokyo)', lat: 35.68, lon: 139.69 },
  { id: 'SYD', name: 'AP-East (Sydney)', lat: -33.87, lon: 151.21 },
];

// Active Telemetry Transit Arcs between Datacenters
const ARCS_CONFIG = [
  { from: 0, to: 3 }, // SF -> London
  { from: 1, to: 4 }, // NYC -> Frankfurt
  { from: 3, to: 4 }, // London -> Frankfurt
  { from: 4, to: 6 }, // Frankfurt -> Mumbai
  { from: 6, to: 7 }, // Mumbai -> Singapore
  { from: 7, to: 8 }, // Singapore -> Tokyo
  { from: 8, to: 0 }, // Tokyo -> SF
  { from: 1, to: 2 }, // NYC -> São Paulo
  { from: 4, to: 5 }, // Frankfurt -> Dubai
  { from: 5, to: 6 }, // Dubai -> Mumbai
  { from: 7, to: 9 }, // Singapore -> Sydney
];

// Procedural World Landmass Coordinate Clusters
const CONTINENT_POINTS = [];
const generatePoints = () => {
  if (CONTINENT_POINTS.length > 0) return;
  const clusters = [
    { minLat: 22, maxLat: 55, minLon: -125, maxLon: -70, count: 50 }, // North America
    { minLat: -35, maxLat: 10, minLon: -75, maxLon: -38, count: 35 },  // South America
    { minLat: 35, maxLat: 62, minLon: -10, maxLon: 35, count: 45 },   // Europe
    { minLat: -28, maxLat: 28, minLon: 10, maxLon: 45, count: 40 },   // Africa
    { minLat: 12, maxLat: 58, minLon: 60, maxLon: 135, count: 65 },   // Asia
    { minLat: -35, maxLat: -16, minLon: 115, maxLon: 150, count: 25 }, // Australia
  ];
  clusters.forEach((c) => {
    for (let i = 0; i < c.count; i++) {
      CONTINENT_POINTS.push({
        lat: c.minLat + Math.random() * (c.maxLat - c.minLat),
        lon: c.minLon + Math.random() * (c.maxLon - c.minLon),
      });
    }
  });
};
generatePoints();

export const GlobeCanvas = ({ className = '', globeSizeFactor = 0.44, interactive = true }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;

    const getIsDark = () => document.documentElement.classList.contains('dark');

    const setupCanvas = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    setupCanvas();

    // Use ResizeObserver so dimensions are ALWAYS 100% accurate down to the pixel
    const resizeObserver = new ResizeObserver(() => {
      setupCanvas();
    });
    resizeObserver.observe(container);

    // Globe Physics & Rotation State
    let rotX = 0.28; // Axial tilt
    let rotY = 0.6;  // Spinning angle
    let targetTiltX = 0.28;
    let targetTiltY = 0;

    const handleMouseMove = (e) => {
      if (!interactive || width === 0 || height === 0) return;
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / width - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / height - 0.5) * 2;
      targetTiltX = 0.28 + normY * 0.12;
      targetTiltY = normX * 0.2;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // Active Telemetry Packets traveling across Arcs
    const packets = ARCS_CONFIG.map((arc, idx) => ({
      arcIndex: idx,
      progress: (idx * 0.14) % 1,
      speed: 0.0038 + (idx % 3) * 0.0016,
      type: idx % 3 === 0 ? 'green' : 'sky',
    }));

    // Ping ripple rings expanding from datacenters
    const pingRings = [];

    // Helper: 3D point transformation and projection
    const project3D = (latDeg, lonDeg, radius, cx, cy) => {
      const lat = (latDeg * Math.PI) / 180;
      const lon = (lonDeg * Math.PI) / 180;

      // Base 3D Sphere Cartesian Coordinates
      const x0 = radius * Math.cos(lat) * Math.sin(lon);
      const y0 = -radius * Math.sin(lat);
      const z0 = radius * Math.cos(lat) * Math.cos(lon);

      // Rotate around Y-axis (rotY + targetTiltY)
      const currentRotY = rotY + targetTiltY;
      const x1 = x0 * Math.cos(currentRotY) + z0 * Math.sin(currentRotY);
      const y1 = y0;
      const z1 = -x0 * Math.sin(currentRotY) + z0 * Math.cos(currentRotY);

      // Rotate around X-axis (axial tilt rotX)
      const x2 = x1;
      const y2 = y1 * Math.cos(rotX) - z1 * Math.sin(rotX);
      const z2 = y1 * Math.sin(rotX) + z1 * Math.cos(rotX);

      // Camera Perspective projection
      const fov = 750;
      const scale = fov / (fov + z2);
      const projX = cx + x2 * scale;
      const projY = cy + y2 * scale;

      return { x: projX, y: projY, z: z2, scale, rawX: x2, rawY: y2, rawZ: z2 };
    };

    const render = () => {
      if (document.hidden || width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const isDark = getIsDark();

      ctx.clearRect(0, 0, width, height);

      rotX += (targetTiltX - rotX) * 0.05;
      rotY += 0.0024; // Smooth natural orbit

      const globeRadius = Math.min(width, height) * globeSizeFactor;
      // ALWAYS center the globe at the exact center of this container
      const globeCenterX = width * 0.5;
      const globeCenterY = height * 0.5;

      // 1. Ambient Radial Glow behind Globe (Tuned for Light & Dark mode)
      const glowGrad = ctx.createRadialGradient(
        globeCenterX, globeCenterY, globeRadius * 0.2,
        globeCenterX, globeCenterY, globeRadius * 1.55
      );
      if (isDark) {
        glowGrad.addColorStop(0, 'rgba(14, 165, 233, 0.22)');
        glowGrad.addColorStop(0.45, 'rgba(6, 182, 212, 0.08)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.32)');
        glowGrad.addColorStop(0.45, 'rgba(14, 165, 233, 0.12)');
        glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }

      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Translucent Sphere Body
      ctx.save();
      ctx.beginPath();
      ctx.arc(globeCenterX, globeCenterY, globeRadius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(14, 165, 233, 0.035)' : 'rgba(56, 189, 248, 0.04)';
      ctx.fill();
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(14, 165, 233, 0.45)';
      ctx.lineWidth = isDark ? 1.4 : 1.6;
      ctx.stroke();
      ctx.restore();

      // 3. Draw 3D Latitude Rings
      const latitudes = [-60, -40, -20, 0, 20, 40, 60];
      latitudes.forEach((lat) => {
        ctx.save();
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 6) {
          const pt = project3D(lat, lon, globeRadius, globeCenterX, globeCenterY);
          const opacity = pt.z < 0 ? (isDark ? 0.09 : 0.12) : (isDark ? 0.32 : 0.45);
          ctx.strokeStyle = isDark
            ? `rgba(56, 189, 248, ${opacity})`
            : `rgba(14, 165, 233, ${opacity})`;
          ctx.lineWidth = lat === 0 ? 1.5 : 0.9;

          if (!started) {
            ctx.moveTo(pt.x, pt.y);
            started = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.stroke();
        ctx.restore();
      });

      // 4. Draw 3D Longitude Meridians
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.save();
        ctx.beginPath();
        let started = false;
        for (let lat = -90; lat <= 90; lat += 6) {
          const pt = project3D(lat, lon, globeRadius, globeCenterX, globeCenterY);
          const opacity = pt.z < 0 ? (isDark ? 0.08 : 0.1) : (isDark ? 0.28 : 0.4);
          ctx.strokeStyle = isDark
            ? `rgba(56, 189, 248, ${opacity})`
            : `rgba(14, 165, 233, ${opacity})`;
          ctx.lineWidth = 0.9;

          if (!started) {
            ctx.moveTo(pt.x, pt.y);
            started = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.stroke();
        ctx.restore();
      }

      // 5. Draw 3D Outer Orbital Telemetry Ring
      ctx.save();
      ctx.beginPath();
      const orbitRadius = globeRadius * 1.28;
      let orbitStarted = false;
      for (let angle = 0; angle <= 360; angle += 6) {
        const rad = (angle * Math.PI) / 180;
        const ox = orbitRadius * Math.cos(rad);
        const oy = Math.sin(rad * 2) * 14;
        const oz = orbitRadius * Math.sin(rad);

        const curRotY = rotY * 0.7;
        const rx = ox * Math.cos(curRotY) + oz * Math.sin(curRotY);
        const rz = -ox * Math.sin(curRotY) + oz * Math.cos(curRotY);
        const ry = oy * Math.cos(rotX * 0.8) - rz * Math.sin(rotX * 0.8);
        const fz = oy * Math.sin(rotX * 0.8) + rz * Math.cos(rotX * 0.8);

        const fov = 750;
        const scale = fov / (fov + fz);
        const px = globeCenterX + rx * scale;
        const py = globeCenterY + ry * scale;

        if (!orbitStarted) {
          ctx.moveTo(px, py);
          orbitStarted = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.setLineDash([4, 10]);
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(14, 165, 233, 0.55)';
      ctx.lineWidth = 1.3;
      ctx.stroke();
      ctx.restore();

      // 6. Draw Procedural Landmass / Network Dots
      CONTINENT_POINTS.forEach((pt) => {
        const p = project3D(pt.lat, pt.lon, globeRadius, globeCenterX, globeCenterY);
        if (p.z > -globeRadius * 0.25) {
          const depthAlpha = Math.max(0.1, (p.z + globeRadius) / (globeRadius * 2));
          ctx.save();
          ctx.fillStyle = isDark
            ? `rgba(56, 189, 248, ${depthAlpha * 0.65})`
            : `rgba(14, 165, 233, ${depthAlpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.8, 1.4 * p.scale), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // 7. Draw 3D Curved Telemetry Arcs
      ARCS_CONFIG.forEach((arc) => {
        const dc1 = DATACENTERS[arc.from];
        const dc2 = DATACENTERS[arc.to];

        const p1 = project3D(dc1.lat, dc1.lon, globeRadius, globeCenterX, globeCenterY);
        const p2 = project3D(dc2.lat, dc2.lon, globeRadius, globeCenterX, globeCenterY);

        if (p1.z > -globeRadius * 0.5 || p2.z > -globeRadius * 0.5) {
          const midLat = (dc1.lat + dc2.lat) * 0.5;
          const midLon = (dc1.lon + dc2.lon) * 0.5;
          const arcAltitude = globeRadius * 1.22;
          const pMid = project3D(midLat, midLon, arcAltitude, globeCenterX, globeCenterY);

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.quadraticCurveTo(pMid.x, pMid.y, p2.x, p2.y);
          ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(14, 165, 233, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }
      });

      // 8. Render Flowing Telemetry Packets
      packets.forEach((pkt) => {
        pkt.progress += pkt.speed;
        const arc = ARCS_CONFIG[pkt.arcIndex];

        if (pkt.progress >= 1) {
          pkt.progress = 0;
          const targetDC = DATACENTERS[arc.to];
          pingRings.push({
            lat: targetDC.lat,
            lon: targetDC.lon,
            radius: 2,
            maxRadius: 24,
            opacity: 1,
            color: pkt.type === 'green' ? '#10B981' : (isDark ? '#38BDF8' : '#0EA5E9'),
          });
        }

        const dc1 = DATACENTERS[arc.from];
        const dc2 = DATACENTERS[arc.to];

        const t = pkt.progress;
        const curLat = (1 - t) * (1 - t) * dc1.lat + 2 * (1 - t) * t * ((dc1.lat + dc2.lat) * 0.5) + t * t * dc2.lat;
        const curLon = (1 - t) * (1 - t) * dc1.lon + 2 * (1 - t) * t * ((dc1.lat + dc2.lon) * 0.5) + t * t * dc2.lon;
        const arcLift = Math.sin(t * Math.PI) * (globeRadius * 0.22);
        const curRadius = globeRadius + arcLift;

        const p = project3D(curLat, curLon, curRadius, globeCenterX, globeCenterY);

        if (p.z > -globeRadius * 0.4) {
          ctx.save();
          const isGreen = pkt.type === 'green';
          const color = isGreen
            ? (isDark ? '#34D399' : '#10B981')
            : (isDark ? '#38BDF8' : '#0EA5E9');
          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = 12;

          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(2.4, 3.6 * p.scale), 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(1, 1.5 * p.scale), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // 9. Render Destination Ping Rings
      for (let i = pingRings.length - 1; i >= 0; i--) {
        const ring = pingRings[i];
        ring.radius += 0.7;
        ring.opacity -= 0.022;

        if (ring.opacity <= 0 || ring.radius >= ring.maxRadius) {
          pingRings.splice(i, 1);
          continue;
        }

        const p = project3D(ring.lat, ring.lon, globeRadius, globeCenterX, globeCenterY);
        if (p.z > -globeRadius * 0.2) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, ring.radius * p.scale, 0, Math.PI * 2);
          ctx.strokeStyle = ring.color;
          ctx.globalAlpha = ring.opacity;
          ctx.lineWidth = 1.4;
          ctx.stroke();
          ctx.restore();
        }
      }

      // 10. Draw Global Datacenter Hub Markers
      DATACENTERS.forEach((dc) => {
        const p = project3D(dc.lat, dc.lon, globeRadius, globeCenterX, globeCenterY);
        if (p.z > -globeRadius * 0.25) {
          ctx.save();
          const hubColor = isDark ? '#38BDF8' : '#0EA5E9';
          ctx.fillStyle = hubColor;
          ctx.shadowColor = hubColor;
          ctx.shadowBlur = 9;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(3, 4.4 * p.scale), 0, Math.PI * 2);
          ctx.fill();

          if (p.z > globeRadius * 0.2) {
            ctx.font = 'bold 9px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
            ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)';
            ctx.shadowBlur = 0;
            ctx.fillText(dc.id, p.x + 6, p.y + 3);
          }
          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [globeSizeFactor, interactive]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
};

export default GlobeCanvas;

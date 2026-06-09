'use client';

import { useEffect } from 'react';

export function GoldWaves() {
  useEffect(() => {
    const canvas = document.getElementById('goldWavesCanvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = 120;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationId: number;
    let time = 0;

    const drawWaves = () => {
      ctx.fillStyle = '#0D0D0D';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const waveCount = 3;
      const baseAmplitude = 12;
      const frequency = 0.008;
      const speed = 0.08;

      for (let waveIndex = 0; waveIndex < waveCount; waveIndex++) {
        // Different colors for each wave layer
        const colors = [
          'rgba(212, 175, 55, 0.4)',    // Gold main
          'rgba(232, 197, 71, 0.25)',   // Light gold
          'rgba(160, 134, 15, 0.15)'    // Dark gold
        ];

        ctx.strokeStyle = colors[waveIndex];
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();

        const phaseShift = waveIndex * (Math.PI / waveCount);
        const yOffset = 40 + waveIndex * 15;
        const amplitude = baseAmplitude - waveIndex * 2;

        for (let x = 0; x <= canvas.width; x += 5) {
          const wave = Math.sin(x * frequency + time * speed + phaseShift) * amplitude;
          const y = yOffset + wave;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      // Add glow effect with additional subtle waves
      for (let waveIndex = 0; waveIndex < 2; waveIndex++) {
        const glowColors = [
          'rgba(212, 175, 55, 0.1)',
          'rgba(232, 197, 71, 0.08)'
        ];

        ctx.strokeStyle = glowColors[waveIndex];
        ctx.lineWidth = 1.5;

        ctx.beginPath();

        const phaseShift = waveIndex * (Math.PI / 2) + Math.PI / 4;
        const yOffset = 50 + waveIndex * 12;
        const amplitude = baseAmplitude * 1.5 - waveIndex * 2;

        for (let x = 0; x <= canvas.width; x += 5) {
          const wave = Math.sin(x * frequency * 0.7 + time * speed * 1.2 + phaseShift) * amplitude;
          const y = yOffset + wave;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      // Draw particles/dots
      ctx.fillStyle = 'rgba(212, 175, 55, 0.6)';
      for (let i = 0; i < 8; i++) {
        const x = (i * (canvas.width / 8) + time * 30) % canvas.width;
        const y = 50 + Math.sin(time * speed + i) * 15;
        
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      time++;
      animationId = requestAnimationFrame(drawWaves);
    };

    drawWaves();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative w-full h-28 flex items-center justify-center bg-gradient-to-b from-transparent via-[#0D0D0D] to-[#0D0D0D]">
      <canvas
        id="goldWavesCanvas"
        className="w-full h-full"
        style={{
          filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.2))'
        }}
      />
      
      {/* Bottom fade out */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-[#0D0D0D] pointer-events-none" />
    </div>
  );
}

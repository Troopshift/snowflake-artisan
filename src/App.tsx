/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Snowflake, RefreshCw, Star, Share2, Download } from 'lucide-react';

/**
 * Generates a professional, creative snowflake path data string.
 * Uses 6-fold symmetry and internal branching logic.
 */
function makeSnowflakePath(size: number, complexity: number = 0.5, thickness: number = 0.05): string {
  const branches = 6;
  const pts: string[] = [];
  const R = size;
  const t = size * thickness;
  
  // Angle for each branch
  const branchAngle = (Math.PI * 2) / branches;

  // We'll define a set of relative coordinates for ONE half-arm
  // and then mirror + rotate it.
  const armProfile = [
    { r: 0.0, side: 0.0 },
    { r: 0.2, side: 0.0 },
    { r: 0.4, side: 0.25 * complexity },
    { r: 0.45, side: 0.22 * complexity },
    { r: 0.3, side: 0.0 },
    { r: 0.6, side: 0.0 },
    { r: 0.75, side: 0.15 * complexity },
    { r: 0.8, side: 0.12 * complexity },
    { r: 0.7, side: 0.0 },
    { r: 1.0, side: 0.0 },
  ];

  for (let b = 0; b < branches; b++) {
    const angle = b * branchAngle;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    // Perpendicular vector for the "thickness" and "side branches"
    const pCos = Math.cos(angle + Math.PI / 2);
    const pSin = Math.sin(angle + Math.PI / 2);

    const getPos = (radiusFactor: number, sideFactor: number, isMirror: boolean) => {
      const dist = radiusFactor * R;
      const side = (sideFactor * R + t) * (isMirror ? -1 : 1);
      return {
        x: dist * cos + side * pCos,
        y: dist * sin + side * pSin
      };
    };

    // Forward path (one side)
    const sideA = armProfile.map(p => getPos(p.r, p.side, false));
    // Backward path (mirrored side)
    const sideB = [...armProfile].reverse().map(p => getPos(p.r, p.side, true));

    // Combine into points string
    if (b === 0) {
      pts.push(`M ${sideA[0].x.toFixed(2)},${sideA[0].y.toFixed(2)}`);
    }
    
    sideA.forEach(p => pts.push(`L ${p.x.toFixed(2)},${p.y.toFixed(2)}`));
    sideB.forEach(p => pts.push(`L ${p.x.toFixed(2)},${p.y.toFixed(2)}`));
  }

  return pts.join(' ') + ' Z';
}

export default function App() {
  const [radius, setRadius] = useState(150);
  const [complexity, setComplexity] = useState(0.6);
  const [thickness, setThickness] = useState(0.04);
  const [rotate, setRotate] = useState(0);

  const path = useMemo(() => 
    makeSnowflakePath(radius, complexity, thickness), 
    [radius, complexity, thickness]
  );

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* Background accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left side: Controls */}
        <div className="flex flex-col space-y-8 order-2 lg:order-1">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Snowflake Artisan
            </h1>
            <p className="text-slate-400 text-lg max-w-md">
              Create mathematically perfect, unique snowflake geometries for your creative projects.
            </p>
          </div>

          <div id="controls-panel" className="grid gap-6 p-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label htmlFor="radius-slider" className="text-sm font-medium text-slate-300 uppercase tracking-widest">Radius</label>
                <span className="text-cyan-400 font-mono text-sm">{radius}px</span>
              </div>
              <input 
                id="radius-slider"
                type="range" min="50" max="250" step="1" 
                value={radius} onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label htmlFor="complexity-slider" className="text-sm font-medium text-slate-300 uppercase tracking-widest">Complexity</label>
                <span className="text-cyan-400 font-mono text-sm">{(complexity * 100).toFixed(0)}%</span>
              </div>
              <input 
                id="complexity-slider"
                type="range" min="0" max="1.5" step="0.01" 
                value={complexity} onChange={(e) => setComplexity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label htmlFor="thickness-slider" className="text-sm font-medium text-slate-300 uppercase tracking-widest">Thickness</label>
                <span className="text-cyan-400 font-mono text-sm">{(thickness * 100).toFixed(1)}%</span>
              </div>
              <input 
                id="thickness-slider"
                type="range" min="0.01" max="0.1" step="0.005" 
                value={thickness} onChange={(e) => setThickness(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div className="pt-4 flex gap-4">
              <button 
                id="rotate-btn"
                onClick={() => setRotate(r => r + 60)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all active:scale-95"
              >
                <RefreshCw size={18} className="text-cyan-400" />
                <span>Rotate</span>
              </button>
              <button 
                id="randomize-btn"
                onClick={() => {
                  setComplexity(Math.random() * 1.2 + 0.3);
                  setThickness(Math.random() * 0.06 + 0.02);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
              >
                <Snowflake size={18} />
                <span>Randomize</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6 px-2">
            <div className="flex items-center gap-2 text-slate-500 text-sm italic border-b border-slate-800 pb-1">
              <Star size={14} className="text-yellow-500/50" />
              <span>Vector export ready</span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <button 
              id="copy-path-btn"
              onClick={() => {
                navigator.clipboard.writeText(path);
                alert("SVG Path copied to clipboard!");
              }}
              className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 text-sm"
            >
              <Share2 size={16} />
              Copy Path
            </button>
          </div>
        </div>

        {/* Right side: Preview */}
        <div id="preview-section" className="flex flex-col items-center justify-center order-1 lg:order-2">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-[60px] group-hover:bg-cyan-500/30 transition-all duration-700" />
            
            <motion.div
              id="snowflake-canvas"
              animate={{ rotate }}
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
              className="relative p-12 bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-[4rem] shadow-2xl flex items-center justify-center min-w-[400px] min-h-[400px]"
            >
              <svg 
                viewBox={`-300 -300 600 600`} 
                className="w-full h-full drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
              >
                <motion.path
                  d={path}
                  fill="url(#flakeGradient)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  strokeWidth="2"
                  stroke="rgba(34,211,238,0.2)"
                />
                <defs>
                  <linearGradient id="flakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Floating details */}
            <div className="absolute -top-4 -right-4 p-4 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl shadow-xl">
               <Download size={20} className="text-cyan-400" />
            </div>
          </div>
        </div>

      </main>

      {/* Footer / Credits */}
      <footer className="fixed bottom-0 w-full p-8 flex justify-center pointer-events-none">
        <p className="text-slate-600 text-xs tracking-[0.2em] uppercase">
          Procedural Geometry • Wave-6 Symmetry
        </p>
      </footer>
    </div>
  );
}

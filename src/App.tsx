/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Snowflake, RefreshCw, Star, Share2, Download, Github, Plus, Settings2, Clipboard } from 'lucide-react';

/**
 * Generates a professional, creative snowflake path data string.
 * Uses 6-fold symmetry and internal branching logic based on style profiles.
 */
type SnowflakeStyle = 'classic' | 'geometric' | 'floral' | 'stellar' | 'dendritic' | 'crystal';

interface AdvancedConfig {
  branchAngle: number;
  stemLength: number;
  subBranchFactor: number;
}

function makeSnowflakePath(
  size: number, 
  complexity: number = 0.5, 
  thickness: number = 0.05, 
  style: SnowflakeStyle = 'classic',
  advanced: AdvancedConfig = { branchAngle: 60, stemLength: 1, subBranchFactor: 1 }
): string {
  const branches = 6;
  const pts: string[] = [];
  const R = size * advanced.stemLength;
  const t = size * thickness;
  
  // Angle for each branch
  const baseBranchAngle = (Math.PI * 2) / branches;

  // Style-based profiles
  const profiles: Record<SnowflakeStyle, { r: number, side: number }[]> = {
    // ... existing profiles ...
    classic: [
      { r: 0.0, side: 0.0 },
      { r: 0.2, side: 0.0 },
      { r: 0.4, side: 0.25 },
      { r: 0.45, side: 0.22 },
      { r: 0.3, side: 0.0 },
      { r: 0.6, side: 0.0 },
      { r: 0.75, side: 0.15 },
      { r: 0.8, side: 0.12 },
      { r: 0.7, side: 0.0 },
      { r: 1.0, side: 0.0 },
    ],
    geometric: [
      { r: 0.0, side: 0.0 },
      { r: 0.3, side: 0.1 },
      { r: 0.6, side: 0.4 },
      { r: 0.7, side: 0.1 },
      { r: 1.0, side: 0.0 },
    ],
    floral: [
      { r: 0.0, side: 0.0 },
      { r: 0.2, side: 0.2 },
      { r: 0.5, side: 0.5 },
      { r: 0.8, side: 0.2 },
      { r: 1.0, side: 0.0 },
    ],
    stellar: [
      { r: 0.0, side: 0.0 },
      { r: 0.1, side: 0.05 },
      { r: 0.9, side: 0.02 },
      { r: 1.0, side: 0.0 },
    ],
    dendritic: [
      { r: 0.0, side: 0.0 },
      { r: 0.2, side: 0.1 },
      { r: 0.4, side: 0.3 },
      { r: 0.35, side: 0.0 },
      { r: 0.6, side: 0.5 },
      { r: 0.55, side: 0.0 },
      { r: 0.8, side: 0.2 },
      { r: 1.0, side: 0.0 },
    ],
    crystal: [
      { r: 0.0, side: 0.2 },
      { r: 0.4, side: 0.4 },
      { r: 0.8, side: 0.2 },
      { r: 1.0, side: 0.0 },
    ]
  };

  const armProfile = profiles[style];

  for (let b = 0; b < branches; b++) {
    const angle = b * baseBranchAngle;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    // Perpendicular vector for the "thickness" and "side branches"
    const spreadRad = (advanced.branchAngle * Math.PI) / 180;
    const pCos = Math.cos(angle + spreadRad);
    const pSin = Math.sin(angle + spreadRad);

    const getPos = (radiusFactor: number, sideFactor: number, isMirror: boolean) => {
      const dist = radiusFactor * R;
      const spreadAdjustment = isMirror ? -spreadRad : spreadRad;
      const sCos = Math.cos(angle + spreadAdjustment);
      const sSin = Math.sin(angle + spreadAdjustment);

      const side = (sideFactor * complexity * advanced.subBranchFactor * R + t);
      
      return {
        x: dist * cos + side * sCos,
        y: dist * sin + side * sSin
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


const PALETTES = [
  { name: 'Arctic', from: '#22d3ee', to: '#818cf8' },
  { name: 'Midnight', from: '#f472b6', to: '#9333ea' },
  { name: 'Aurora', from: '#34d399', to: '#059669' },
  { name: 'Sunset', from: '#fbbf24', to: '#ea580c' },
  { name: 'Silver', from: '#94a3b8', to: '#334155' },
  { name: 'Electric', from: '#6366f1', to: '#a855f7' },
  { name: 'Rose Gold', from: '#fda4af', to: '#e11d48' },
  { name: 'Forest', from: '#4ade80', to: '#166534' },
];

const STYLES: { id: SnowflakeStyle; name: string }[] = [
  { id: 'classic', name: 'Classic' },
  { id: 'geometric', name: 'Geometric' },
  { id: 'floral', name: 'Floral' },
  { id: 'stellar', name: 'Stellar' },
  { id: 'dendritic', name: 'Dendritic' },
  { id: 'crystal', name: 'Crystal' },
];

export default function App() {
  const [radius, setRadius] = useState(150);
  const [complexity, setComplexity] = useState(0.6);
  const [thickness, setThickness] = useState(0.04);
  const [rotate, setRotate] = useState(0);
  const [activePalette, setActivePalette] = useState(PALETTES[0]);
  const [activeStyle, setActiveStyle] = useState<SnowflakeStyle>('classic');
  const [advanced, setAdvanced] = useState<AdvancedConfig>({ branchAngle: 60, stemLength: 1, subBranchFactor: 1 });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const path = useMemo(() => 
    makeSnowflakePath(radius, complexity, thickness, activeStyle, advanced), 
    [radius, complexity, thickness, activeStyle, advanced]
  );

  const downloadSvg = () => {
    const svgData = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-400 -400 800 800" width="1200" height="1200">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${activePalette.from}" />
            <stop offset="100%" stop-color="${activePalette.to}" />
          </linearGradient>
        </defs>
        <rect width="800" height="800" x="-400" y="-400" fill="#0a0f1d" />
        <path d="${path}" fill="url(#g)" />
      </svg>
    `.trim();
    
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `snowflake-${activeStyle}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgData = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-400 -400 800 800" width="1200" height="1200">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${activePalette.from}" />
            <stop offset="100%" stop-color="${activePalette.to}" />
          </linearGradient>
        </defs>
        <path d="${path}" fill="url(#g)" />
      </svg>
    `;
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `snowflake-${activeStyle}.png`;
      link.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Snowflake Artisan',
      text: `Check out this ${activeStyle} snowflake I created!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleRandomize = () => {
    setComplexity(Math.random() * 1.2 + 0.3);
    setThickness(Math.random() * 0.06 + 0.02);
    setActivePalette(PALETTES[Math.floor(Math.random() * PALETTES.length)]);
    setActiveStyle(STYLES[Math.floor(Math.random() * STYLES.length)].id);
    setAdvanced({
      branchAngle: Math.random() * 120 + 30,
      stemLength: Math.random() * 0.4 + 0.8,
      subBranchFactor: Math.random() * 1.5 + 0.5,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 font-sans selection:bg-cyan-500/30 transition-colors duration-1000 overflow-x-hidden">
      {/* Background accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-colors duration-1000 opacity-20" 
          style={{ backgroundColor: activePalette.from }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-colors duration-1000 opacity-20" 
          style={{ backgroundColor: activePalette.to }}
        />
      </div>

      <main className="relative z-10 w-full max-w-[90rem] mx-auto px-6 lg:px-12 min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center py-8 lg:py-12">
        
        {/* Left side: Controls */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-5 flex flex-col space-y-6 order-2 lg:order-1 lg:pr-4 pb-12"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-3 px-2">
            <div className="space-y-2">
              <h1 
                className="block text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter bg-clip-text text-transparent transition-all duration-700 leading-none py-2"
                style={{ backgroundImage: `linear-gradient(to bottom right, ${activePalette.from}, ${activePalette.to})` }}
              >
                Snowflake Artisan
              </h1>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed border-l-2 border-white/10 pl-6 py-2">
              Mathematically generated crystal structures. Synthesis of code and nature.
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            id="controls-panel" 
            className="grid gap-6 p-6 lg:p-8 bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] lg:rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            {/* Style Selection */}
            <section className="space-y-4">
              <div className="flex justify-between items-center px-1 h-8">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Structure Profile</label>
                <button 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className={`p-1.5 rounded-lg transition-all ${showAdvanced ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Settings2 size={16} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveStyle(s.id)}
                    className={`px-2 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all border ${
                      activeStyle === s.id 
                      ? 'bg-white/10 border-white/20 text-white shadow-xl translate-y-[-2px]' 
                      : 'bg-white/[0.02] border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </section>

            {/* Range Controls */}
            <section className="space-y-6">
              {[
                { id: 'radius', label: 'Radius', value: radius, setter: setRadius, min: 50, max: 250, unit: 'px' },
                { id: 'complexity', label: 'Branching', value: complexity, setter: setComplexity, min: 0, max: 1.5, unit: '%' },
                { id: 'thickness', label: 'Density', value: thickness, setter: setThickness, min: 0.01, max: 0.1, unit: '%' },
              ].map((ctrl) => (
                <div key={ctrl.id} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label htmlFor={`${ctrl.id}-slider`} className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">{ctrl.label}</label>
                    <span className="font-mono text-xs font-bold" style={{ color: activePalette.from }}>
                      {ctrl.id === 'radius' ? ctrl.value : (Number(ctrl.value) * 100).toFixed(ctrl.id === 'thickness' ? 1 : 0)}{ctrl.unit}
                    </span>
                  </div>
                  <input 
                    id={`${ctrl.id}-slider`}
                    type="range" min={ctrl.min} max={ctrl.max} step={ctrl.id === 'radius' ? 1 : 0.01} 
                    value={ctrl.value} onChange={(e) => ctrl.setter(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: activePalette.from }}
                  />
                </div>
              ))}
            </section>

            {/* Advanced Controls */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.section 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-8 pt-4 overflow-hidden"
                >
                   {[
                    { id: 'branchAngle', label: 'Branch Angle', value: advanced.branchAngle, min: 0, max: 180, unit: '°' },
                    { id: 'subBranchFactor', label: 'Reach', value: advanced.subBranchFactor, min: 0.1, max: 2, unit: 'x' },
                    { id: 'stemLength', label: 'Extension', value: advanced.stemLength, min: 0.5, max: 1.5, unit: 'x' },
                  ].map((ctrl) => (
                    <div key={ctrl.id} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">{ctrl.label}</label>
                        <span className="font-mono text-xs font-bold" style={{ color: activePalette.from }}>
                          {ctrl.value.toFixed(ctrl.id === 'branchAngle' ? 0 : 2)}{ctrl.unit}
                        </span>
                      </div>
                      <input 
                        type="range" min={ctrl.min} max={ctrl.max} step={0.01} 
                        value={ctrl.value} 
                        onChange={(e) => setAdvanced(prev => ({ ...prev, [ctrl.id]: Number(e.target.value) }))}
                        className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: activePalette.from }}
                      />
                    </div>
                  ))}
                  <div className="h-px w-full bg-white/5" />
                </motion.section>
              )}
            </AnimatePresence>

            {/* Chroma Range */}
            <section className="space-y-4">
              <div className="flex items-center px-1 h-8">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Chromatic Range</label>
              </div>
              <div className="flex flex-wrap gap-3">
                {PALETTES.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setActivePalette(p)}
                    className={`group relative w-12 h-12 rounded-2xl transition-all border-2 overflow-hidden ${
                      activePalette.name === p.name 
                      ? 'border-white scale-110 shadow-xl' 
                      : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div 
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
                    />
                  </button>
                ))}
                {/* Custom Color Trigger */}
                <div className="relative w-12 h-12">
                  <input 
                    type="color"
                    onChange={(e) => setActivePalette({ name: 'Custom', from: e.target.value, to: activePalette.to })}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-white/[0.02] border-2 border-white/5 border-dashed rounded-2xl text-slate-500 hover:border-white/20 hover:text-slate-300 transition-all">
                    <Plus size={20} />
                  </div>
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="pt-4 flex gap-3">
              <button 
                id="rotate-btn"
                onClick={() => setRotate(r => r + 60)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all active:scale-95"
              >
                <RefreshCw size={16} style={{ color: activePalette.from }} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Rotate</span>
              </button>
              <button 
                id="randomize-btn"
                onClick={handleRandomize}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-4 text-slate-900 font-bold rounded-2xl transition-all shadow-xl active:scale-95"
                style={{ backgroundColor: activePalette.from, boxShadow: `0 10px 20px -5px ${activePalette.from}55` }}
              >
                <Snowflake size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Randomize</span>
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-4 px-2 pt-6 border-t border-slate-800/50">
            <div className="flex items-center gap-2">
              <button 
                onClick={handleShare}
                className="h-12 w-12 flex items-center justify-center bg-slate-900/50 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all shadow-lg active:scale-90"
                title="Share Design"
              >
                <Share2 size={18} />
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(path);
                  alert("SVG Path copied to clipboard!");
                }}
                className="h-12 w-12 flex items-center justify-center bg-slate-900/50 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all shadow-lg active:scale-90"
                title="Copy SVG Path"
              >
                <Clipboard size={18} />
              </button>
              <a 
                href="https://github.com/jose-ilizarbee/snowflake-artisan" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-12 px-4 flex items-center justify-center gap-2 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all shadow-lg active:scale-90 group"
                title="Star on GitHub"
              >
                <Github size={18} />
                <span className="text-slate-600 font-light">|</span>
                <Star size={18} className="text-slate-400 group-hover:text-white transition-all" />
              </a>
            </div>
            
            <div className="flex items-center gap-2">
               <button 
                onClick={downloadPng}
                className="h-12 px-5 flex items-center justify-center gap-2 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all shadow-lg text-[10px] font-bold uppercase tracking-widest active:scale-95"
              >
                PNG
              </button>
              <button 
                onClick={downloadSvg}
                className="h-12 px-5 flex items-center justify-center gap-2 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all shadow-lg text-[10px] font-bold uppercase tracking-widest active:scale-95"
              >
                SVG
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-2 flex flex-col items-center lg:items-start gap-4">
            <p className="text-slate-600 text-[10px] tracking-[0.6em] uppercase font-bold px-2">
              Synthesis • v2.1
            </p>
          </motion.div>
        </motion.div>

        {/* Right side: Preview */}
        <div id="preview-section" className="lg:col-span-7 flex flex-col items-center justify-center order-1 lg:order-2 py-8">
          <motion.div 
            whileHover={{ y: -10, scale: 1.02 }}
            className="relative group w-full max-w-[28rem] lg:max-w-xl aspect-square flex items-center justify-center cursor-crosshair mx-auto"
          >
            {/* Glow effect */}
            <div 
              className="absolute inset-0 rounded-full blur-[160px] opacity-10 group-hover:opacity-20 transition-all duration-1000 scale-125 pointer-events-none" 
              style={{ backgroundColor: activePalette.from }}
            />
            
            <motion.div
              id="snowflake-canvas"
              animate={{ 
                y: [0, -15, 0],
              }}
              transition={{ 
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative w-full h-full lg:max-h-[85vh] bg-slate-900/10 backdrop-blur-sm border border-white/[0.03] rounded-[4rem] lg:rounded-[5rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-visible"
            >
              <motion.svg 
                animate={{ rotate }}
                transition={{ type: 'spring', stiffness: 40, damping: 25 }}
                viewBox={`-340 -340 680 680`} 
                className="w-[110%] h-[110%] drop-shadow-2xl overflow-visible"
              >
                <AnimatePresence mode="wait">
                  <motion.path
                    key={path}
                    d={path}
                    fill="url(#flakeGradient)"
                    initial={{ scale: 0.9, opacity: 0, rotate: -15 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.9, opacity: 0, rotate: 15 }}
                    transition={{ 
                      type: "spring",
                      duration: 0.8,
                      bounce: 0.3
                    }}
                    strokeWidth="1.5"
                    stroke={`${activePalette.from}44`}
                  />
                </AnimatePresence>
                <defs>
                  <linearGradient id="flakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={activePalette.from} />
                    <stop offset="100%" stopColor={activePalette.to} />
                  </linearGradient>
                </defs>
              </motion.svg>

              {/* Floating label */}
              <div className="absolute top-10 left-10 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.4em]">Design Instance</span>
                <span className="text-xs font-mono text-slate-400">#{(radius * complexity).toFixed(0)}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </main>
    </div>
  );
}



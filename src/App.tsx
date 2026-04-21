/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Github, Music as MusicIcon, Gamepad2 } from 'lucide-react';

export default function App() {
  return (
    <div className="h-screen flex flex-col p-6 overflow-hidden">
      {/* Header - Styled to match Professional Polish Design HTML */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[var(--neon-cyan)] rounded-lg flex items-center justify-center neon-border">
            <Gamepad2 className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter uppercase whitespace-nowrap">
              Neon<span className="text-[var(--neon-cyan)]">Snake</span> v2.0
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none">
              Neural Audio Interface // Alpha Build
            </p>
          </div>
        </div>
        
        {/* We'll keep the SnakeGame internal HUD for score for now, but App Header can show static placeholder or we can link them if we lift state. For now, let's just match the style of the design header's secondary info area. */}
        <div className="hidden md:flex gap-8">
          <div className="text-right">
             <p className="text-[10px] text-gray-500 uppercase tracking-widest">System Status</p>
             <p className="text-xs font-mono text-green-400">OPERATIONAL</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] text-gray-500 uppercase tracking-widest">Protocol</p>
             <p className="text-xs font-mono text-[var(--neon-cyan)]">AES-NEON-V.2</p>
          </div>
        </div>
      </header>

      {/* Main Content Grid - Adjusted for Design HTML pattern */}
      <main className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Left Sidebar - Playlist & Hardware Status */}
        <aside className="w-72 hidden lg:flex flex-col gap-4">
          <div className="glass-panel rounded-xl p-4 flex-1 flex flex-col">
            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <MusicIcon className="w-3 h-3" /> Playlist // Neural Beats
            </h2>
            <div className="space-y-3 overflow-y-auto pr-1">
              {['Midnight Pulse', 'Data Stream', 'Glitch Matrix'].map((track, i) => (
                <div key={i} className={`flex items-center gap-3 p-2 ${i === 0 ? 'bg-white/5 border-l-2 border-[var(--neon-cyan)]' : 'hover:bg-white/5 opacity-60'} rounded-lg transition-colors cursor-pointer`}>
                  <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-[var(--neon-cyan)] font-mono text-xs">
                    0{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{track}</p>
                    <p className="text-[10px] text-gray-500 uppercase leading-none mt-1">Synth-Core AI</p>
                  </div>
                  {i === 0 && <div className="w-2 h-2 bg-[var(--neon-cyan)] rounded-full animate-pulse shadow-[0_0_8px_var(--neon-cyan)]"></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4 h-48">
            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Hardware Status</h2>
            <div className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-500 uppercase">Neural Load</span>
                  <span className="text-green-400">42%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '42%' }}
                    className="h-full bg-green-400"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-500 uppercase">Latency</span>
                  <span className="text-[var(--neon-cyan)]">12ms</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '20%' }}
                    className="h-full bg-[var(--neon-cyan)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center - Game Area */}
        <section className="flex-1 flex flex-col items-center justify-center relative bg-black/20 rounded-2xl overflow-hidden border border-white/5">
          <SnakeGame />
          
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-2 py-1 bg-black/50 border border-[var(--neon-cyan)]/30 rounded text-[9px] uppercase tracking-widest text-[#00f3ff]">System_Override: ON</span>
            <span className="px-2 py-1 bg-black/50 border border-[var(--neon-pink)]/30 rounded text-[9px] uppercase tracking-widest text-[var(--neon-pink)]">Mode: Veteran</span>
          </div>
        </section>
      </main>

      {/* Footer - Music Player (Horizontal Style) */}
      <footer className="mt-6 flex-shrink-0">
        <MusicPlayer />
      </footer>
    </div>
  );
}

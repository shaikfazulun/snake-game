/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';

const INITIAL_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cybernetic Pulse',
    artist: 'AI Pulse',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/cyber/200/200',
    duration: 372,
  },
  {
    id: '2',
    title: 'Neon Horizon',
    artist: 'SynthWave AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon/200/200',
    duration: 425,
  },
  {
    id: '3',
    title: 'Digital Dreams',
    artist: 'Neural Beat',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    cover: 'https://picsum.photos/seed/digital/200/200',
    duration: 312,
  }
];

export default function MusicPlayer() {
  const [tracks] = useState<Track[]>(INITIAL_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Auto-play blocked or error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setProgress(0);
  };

  const skipPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setProgress(0);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const onEnded = () => {
    skipNext();
  };

  return (
    <div className="w-full glass-panel h-24 rounded-2xl flex items-center px-8 gap-8 transition-all">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />
      
      {/* Left: Track Info */}
      <div className="flex items-center gap-4 w-64 flex-shrink-0">
        <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden flex items-center justify-center relative">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title}
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className={`w-8 h-8 border-2 border-[var(--neon-cyan)] rounded-full flex items-center justify-center ${isPlaying ? 'animate-spin-[slow]' : ''}`}>
                <div className="w-4 h-4 bg-[var(--neon-cyan)] rounded-sm"></div>
             </div>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold truncate text-white">{currentTrack.title}</p>
          <p className="text-[11px] text-[var(--neon-cyan)] uppercase tracking-wider font-semibold">Now Playing</p>
        </div>
      </div>

      {/* Center: Controls & Progress */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={skipPrev}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>

          <button 
            onClick={skipNext}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-gray-500 min-w-[35px]">
            {Math.floor((audioRef.current?.currentTime || 0) / 60)}:{Math.floor((audioRef.current?.currentTime || 0) % 60).toString().padStart(2, '0')}
          </span>
          <div className="flex-1 h-1 bg-white/10 rounded-full relative group cursor-pointer">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-[var(--neon-cyan)] rounded-full"
              style={{ width: `${progress}%` }}
            />
            <motion.div 
              className="absolute top-[-4px] w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#fff] -ml-1.5"
              style={{ left: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-gray-500 min-w-[35px]">
            {Math.floor(currentTrack.duration / 60)}:{Math.floor(currentTrack.duration % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Right: Volume */}
      <div className="w-64 flex items-center justify-end gap-4 flex-shrink-0">
        <Volume2 className="w-4 h-4 text-gray-500" />
        <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-white/40 w-3/4"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { motion } from 'motion/react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import { Point, Direction } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highscore, setHighscore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(p => p.x === newFood.x && p.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check wall collisions
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Check self-collision
      if (prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (directionRef.current !== 'DOWN') directionRef.current = 'UP'; break;
        case 'ArrowDown': if (directionRef.current !== 'UP') directionRef.current = 'DOWN'; break;
        case 'ArrowLeft': if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT'; break;
        case 'ArrowRight': if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT'; break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    if (!lastUpdateRef.current) lastUpdateRef.current = timestamp;
    const elapsed = timestamp - lastUpdateRef.current;

    if (elapsed > GAME_SPEED) {
      moveSnake();
      lastUpdateRef.current = timestamp;
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [moveSnake]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameLoop]);

  useEffect(() => {
    if (score > highscore) setHighscore(score);
  }, [score, highscore]);

  const setManualDirection = (d: Direction) => {
    if (d === 'UP' && directionRef.current !== 'DOWN') directionRef.current = 'UP';
    if (d === 'DOWN' && directionRef.current !== 'UP') directionRef.current = 'DOWN';
    if (d === 'LEFT' && directionRef.current !== 'RIGHT') directionRef.current = 'LEFT';
    if (d === 'RIGHT' && directionRef.current !== 'LEFT') directionRef.current = 'RIGHT';
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* HUD - Styled for Professional Polish */}
      <div className="w-full flex justify-between items-center px-2">
        <div className="text-left">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none mb-1">Session Score</p>
          <p className="text-3xl font-mono neon-text-pink leading-none tracking-tighter transition-all">
            {score.toLocaleString('en-US', { minimumIntegerDigits: 6 })}
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none mb-1">High Score</p>
          <p className="text-3xl font-mono text-[var(--neon-cyan)] leading-none tracking-tighter drop-shadow-[0_0_8px_var(--neon-cyan)] opacity-90">
            {highscore.toLocaleString('en-US', { minimumIntegerDigits: 6 })}
          </p>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative p-1 glass-panel rounded-2xl neon-border">
        <div 
          className="relative grid bg-black/40 overflow-hidden rounded-xl"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)'
          }}
        >
          {/* Grid Background */}
          <div className="absolute inset-0 grid opacity-10 pointer-events-none" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-white/10" />
            ))}
          </div>

          {/* Food */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="snake-cell snake-food z-10"
            style={{
              gridRowStart: food.y + 1,
              gridColumnStart: food.x + 1,
            }}
          />

          {/* Snake */}
          {snake.map((segment, i) => (
            <motion.div 
              key={`${segment.x}-${segment.y}-${i}`}
              className={i === 0 
                ? "snake-cell snake-head z-20" 
                : "snake-cell snake-body z-20"
              }
              style={{
                gridRowStart: segment.y + 1,
                gridColumnStart: segment.x + 1,
              }}
            />
          ))}

          {/* Overlay */}
          {(isGameOver || isPaused) && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md transition-all">
              {isGameOver ? (
                <div className="text-center space-y-6">
                  <h3 className="text-5xl font-black text-[var(--neon-pink)] uppercase tracking-tighter italic scale-110 drop-shadow-[0_0_15px_rgba(255,0,127,0.5)]">Game Over</h3>
                  <button 
                    onClick={resetGame}
                    className="group relative px-8 py-3 overflow-hidden rounded-full transition-all hover:scale-105 active:scale-95"
                  >
                    <div className="absolute inset-0 bg-[var(--neon-cyan)] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="absolute inset-0 border border-[var(--neon-cyan)]/50 rounded-full"></div>
                    <span className="relative flex items-center gap-2 text-[var(--neon-cyan)] font-black tracking-widest text-sm">
                      <RotateCcw className="w-4 h-4" /> RESTART_PROTOCOL
                    </span>
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <h3 className="text-5xl font-black text-white/20 uppercase tracking-tighter italic">Paused</h3>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="px-10 py-3 bg-white text-black font-black rounded-full hover:scale-105 transition-transform tracking-widest text-sm"
                  >
                    CONTINUE
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Touch Controls */}
      <div className="grid grid-cols-3 gap-2 lg:hidden">
        <div />
        <ControlButton icon={<ChevronUp />} onClick={() => setManualDirection('UP')} />
        <div />
        <ControlButton icon={<ChevronLeft />} onClick={() => setManualDirection('LEFT')} />
        <ControlButton icon={<ChevronDown />} onClick={() => setManualDirection('DOWN')} />
        <ControlButton icon={<ChevronRight />} onClick={() => setManualDirection('RIGHT')} />
      </div>
      
      <div className="hidden lg:block text-xs font-mono text-white/30 uppercase tracking-[0.2em]">
        Use Arrow Keys to Move • Space to Pause
      </div>
    </div>
  );
}

function ControlButton({ icon, onClick }: { icon: ReactNode, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-white/60"
    >
      {icon}
    </button>
  );
}

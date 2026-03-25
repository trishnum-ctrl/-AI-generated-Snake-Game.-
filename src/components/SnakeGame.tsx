import React, { useState, useEffect, useCallback } from 'react';
import { useInterval } from '../hooks/useInterval';

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 120;

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    setFood(generateFood(INITIAL_SNAKE));
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      case ' ':
      case 'Escape':
        setIsPaused(p => !p);
        break;
    }
  }, [direction, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const gameLoop = () => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP':
          newHead.y -= 1;
          break;
        case 'DOWN':
          newHead.y += 1;
          break;
        case 'LEFT':
          newHead.x -= 1;
          break;
        case 'RIGHT':
          newHead.x += 1;
          break;
      }

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setFood(generateFood(newSnake));
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  };

  useInterval(gameLoop, gameOver || isPaused ? null : GAME_SPEED);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-black border-glitch">
      <div className="absolute -top-4 -right-4 bg-[#0ff] text-black px-3 py-1 text-xl font-bold font-pixel shadow-[-4px_4px_0_#f0f]">
        PROCESS: OROBOROS
      </div>
      
      {/* Game Grid */}
      <div 
        className="relative bg-black border-4 border-[#f0f] overflow-hidden mt-4"
        style={{
          width: `${GRID_SIZE * 20}px`,
          height: `${GRID_SIZE * 20}px`,
          backgroundImage: 'linear-gradient(#f0f 1px, transparent 1px), linear-gradient(90deg, #f0f 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '-1px -1px',
          opacity: 0.9
        }}
      >
        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute w-5 h-5 ${index === 0 ? 'bg-[#0ff] border-2 border-black z-10' : 'bg-[#0ff] opacity-80 border border-black'}`}
            style={{
              left: `${segment.x * 20}px`,
              top: `${segment.y * 20}px`,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute w-5 h-5 bg-[#f0f] animate-[pulse_0.2s_infinite] border-2 border-black"
          style={{
            left: `${food.x * 20}px`,
            top: `${food.y * 20}px`,
          }}
        />

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-4 border-[#f0f] screen-tear">
            <h2 className="text-5xl font-bold text-[#f0f] mb-4 glitch-text font-pixel text-center leading-tight" data-text="FATAL ERROR">FATAL<br/>ERROR</h2>
            <p className="text-[#0ff] mb-8 text-2xl">DATA LOST: {score}</p>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-black border-4 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black transition-colors font-bold text-2xl uppercase font-pixel shadow-[4px_4px_0_#f0f] hover:shadow-[-4px_-4px_0_#f0f]"
            >
              REBOOT
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 screen-tear">
            <h2 className="text-5xl font-bold text-[#0ff] glitch-text font-pixel" data-text="HALTED">HALTED</h2>
          </div>
        )}
      </div>

      <div className="mt-8 text-[#f0f] text-xl flex gap-8 uppercase font-bold">
        <span><kbd className="bg-[#0ff] text-black px-2 py-1 mr-2">W A S D</kbd> OVERRIDE</span>
        <span><kbd className="bg-[#f0f] text-black px-2 py-1 mr-2">SPACE</kbd> HALT</span>
      </div>
    </div>
  );
}

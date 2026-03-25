import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#0ff] font-['VT323'] overflow-hidden selection:bg-[#f0f] selection:text-[#0ff]">
      {/* Background Grid & Glows */}
      <div className="static-noise" />
      <div className="scanlines" />

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b-4 border-[#f0f] pb-6 screen-tear">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-pixel tracking-tighter text-black bg-[#0ff] px-6 py-4 inline-block glitch-text shadow-[8px_8px_0_#f0f]" data-text="EXECUTE: SNAKE">
              EXECUTE: SNAKE
            </h1>
            <p className="text-[#f0f] text-xl md:text-2xl tracking-widest uppercase mt-6 animate-pulse">
              STATUS: NEURAL LINK COMPROMISED //
            </p>
          </div>
          
          {/* Score Display */}
          <div className="border-glitch bg-black px-8 py-4">
            <div className="text-xl text-[#f0f] uppercase tracking-widest mb-2 font-bold">DATA HARVESTED</div>
            <div 
              className="text-7xl font-bold text-[#0ff] glitch-text"
              data-text={score.toString().padStart(5, '0')}
            >
              {score.toString().padStart(5, '0')}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
          
          {/* Left/Top: Music Player */}
          <div className="w-full lg:w-auto flex justify-center order-2 lg:order-1 screen-tear" style={{animationDelay: '1s'}}>
            <MusicPlayer />
          </div>

          {/* Right/Center: Game */}
          <div className="w-full lg:w-auto flex justify-center order-1 lg:order-2">
            <SnakeGame onScoreChange={setScore} />
          </div>

        </main>
      </div>
    </div>
  );
}

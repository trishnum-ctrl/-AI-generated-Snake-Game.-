import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Terminal } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "SECTOR_01.WAV",
    artist: "UNKNOWN_ENTITY",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "CORRUPTION.MP3",
    artist: "SYSTEM_PROCESS",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "VOID_SIGNAL.FLAC",
    artist: "NULL",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Audio playback failed", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    playNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="w-full max-w-md bg-black border-glitch p-8 relative group">
      <div className="absolute -top-4 -left-4 bg-[#f0f] text-black px-3 py-1 text-xl font-bold font-pixel shadow-[4px_4px_0_#0ff]">
        AUDIO_STREAM
      </div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />

      <div className="flex items-center gap-6 mt-8 mb-8">
        <div className={`w-20 h-20 border-4 border-[#0ff] flex items-center justify-center ${isPlaying ? 'animate-pulse bg-[#f0f] border-[#f0f]' : 'bg-black'}`}>
          <Terminal className={`w-10 h-10 ${isPlaying ? 'text-black' : 'text-[#0ff]'}`} />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-[#0ff] font-bold text-3xl truncate glitch-text" data-text={currentTrack.title}>{currentTrack.title}</h3>
          <p className="text-[#f0f] text-xl truncate mt-1">SRC: {currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="h-6 border-2 border-[#0ff] mb-8 cursor-pointer relative overflow-hidden bg-black"
        onClick={handleProgressClick}
      >
        <div 
          className="absolute top-0 left-0 h-full bg-[#f0f]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMuted(!isMuted)} className="text-[#0ff] hover:text-black hover:bg-[#0ff] p-2 transition-colors border-2 border-transparent hover:border-[#0ff]">
            {isMuted ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-24 h-3 bg-black border-2 border-[#0ff] appearance-none cursor-pointer accent-[#f0f]"
          />
        </div>

        <div className="flex items-center gap-4">
          <button onClick={playPrev} className="text-[#0ff] hover:text-black hover:bg-[#0ff] p-2 transition-colors border-2 border-[#0ff]">
            <SkipBack className="w-8 h-8" />
          </button>
          <button 
            onClick={togglePlay} 
            className="w-16 h-16 flex items-center justify-center bg-[#0ff] text-black hover:bg-[#f0f] transition-colors border-4 border-black shadow-[0_0_0_2px_#0ff] hover:shadow-[0_0_0_2px_#f0f]"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
          <button onClick={playNext} className="text-[#0ff] hover:text-black hover:bg-[#0ff] p-2 transition-colors border-2 border-[#0ff]">
            <SkipForward className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
}

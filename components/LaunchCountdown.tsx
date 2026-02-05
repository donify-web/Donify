
import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Lock, ArrowRight, Bell, Calendar, Rocket } from 'lucide-react';

interface LaunchCountdownProps {
  targetDate: Date;
  onLoginRequest: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function LaunchCountdown({ targetDate, onLoginRequest }: LaunchCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [email, setEmail] = useState('');
  const [notified, setNotified] = useState(false);

  function calculateTimeLeft(): TimeLeft {
    const difference = +targetDate - +new Date();
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    setNotified(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0ca1b3] to-gray-900 text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
         <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
         <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl px-6 text-center">
        
        {/* Brand & Badge */}
        <div className="flex flex-col items-center mb-10 animate-in fade-in slide-in-from-top-10 duration-700">
          
          {/* BIG LAUNCH BADGE */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-blue-100 text-sm font-bold tracking-widest uppercase mb-8 backdrop-blur-sm shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            Próximo Gran Lanzamiento
          </div>

          <div className="w-20 h-20 bg-white text-primary rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-primary/50 transform rotate-3">
            <Logo className="w-12 h-12" />
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-4 drop-shadow-xl">
            Donify
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 font-light max-w-2xl leading-relaxed">
            Tu cambio suelto está a punto de cambiar el mundo.
          </p>
        </div>

        {/* Countdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          <TimeBox value={timeLeft.days} label="Días" />
          <TimeBox value={timeLeft.hours} label="Horas" />
          <TimeBox value={timeLeft.minutes} label="Minutos" />
          <TimeBox value={timeLeft.seconds} label="Segundos" />
        </div>

        {/* CTA */}
        <div className="max-w-md mx-auto bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl mb-12">
            {!notified ? (
                <form onSubmit={handleNotify}>
                    <label className="block text-sm font-medium text-blue-100 mb-3 flex items-center justify-center gap-2">
                        <Rocket size={16} /> Avísame cuando despeguemos
                    </label>
                    <div className="flex gap-2">
                        <input 
                            type="email" 
                            placeholder="tu@email.com" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-blue-200/30 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                        <button type="submit" className="bg-white text-primary px-4 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-lg">
                            <ArrowRight />
                        </button>
                    </div>
                </form>
            ) : (
                <div className="text-center py-2 animate-in zoom-in">
                    <div className="inline-flex bg-green-500/20 text-green-300 p-2 rounded-full mb-2 border border-green-500/30">
                        <Calendar size={24} />
                    </div>
                    <p className="font-bold text-lg text-white">¡Estás en la lista!</p>
                    <p className="text-sm text-blue-200">Te avisaremos el 4 de Marzo.</p>
                </div>
            )}
        </div>

        {/* Footer info */}
        <div className="flex flex-col items-center gap-2 text-sm text-blue-200/40">
           <p>Lanzamiento Oficial Global</p>
           <p className="font-mono tracking-wider">04 / 03 / 2025</p>
        </div>

      </div>

      {/* Bypass Button */}
      <button 
        onClick={onLoginRequest}
        className="absolute bottom-6 right-6 text-white/10 hover:text-white/80 text-[10px] flex items-center gap-2 transition-colors uppercase tracking-widest font-bold"
      >
        <Lock size={10} /> Acceso Equipo
      </button>

    </div>
  );
}

const TimeBox = ({ value, label }: { value: number, label: string }) => (
  <div className="flex flex-col items-center group cursor-default">
    <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center mb-2 shadow-lg relative overflow-hidden transition-transform group-hover:-translate-y-1">
      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
      <span className="text-3xl md:text-5xl font-bold font-mono relative z-10 text-white drop-shadow-md">
        {value.toString().padStart(2, '0')}
      </span>
    </div>
    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-blue-200/60 group-hover:text-primary transition-colors">{label}</span>
  </div>
);

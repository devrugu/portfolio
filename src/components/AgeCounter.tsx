"use client";

import { useState, useEffect } from 'react';
import { intervalToDuration } from 'date-fns';

export default function AgeCounter({ birthDate }: { birthDate: Date }) {
  const [duration, setDuration] = useState({
    years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0,
  });
  const [milliseconds, setMilliseconds] = useState(0);

  useEffect(() => {
    const calculateAge = () => {
      const now = new Date();
      const ageDuration = intervalToDuration({ start: birthDate, end: now });
      setDuration({
        years: ageDuration.years || 0,
        months: ageDuration.months || 0,
        days: ageDuration.days || 0,
        hours: ageDuration.hours || 0,
        minutes: ageDuration.minutes || 0,
        seconds: ageDuration.seconds || 0
      });
      setMilliseconds(now.getMilliseconds());
    };

    calculateAge();
    const interval = setInterval(calculateAge, 50);
    return () => clearInterval(interval);
  }, [birthDate]);

  // NEW: Final format: YY years MM months DD days HH:MM:SS:ZZZ
  return (
    <div className="font-mono text-center mt-4 text-base md:text-lg whitespace-nowrap overflow-x-auto pb-2">
      {/* Date Part */}
      <span className="text-primary font-bold">{duration.years}</span>
      <span className="text-gray-400 text-sm"> years </span>
      <span className="text-primary font-bold">{duration.months}</span>
      <span className="text-gray-400 text-sm"> months </span>
      <span className="text-primary font-bold">{duration.days}</span>
      <span className="text-gray-400 text-sm"> days </span>

      {/* Time Part */}
      <span className="text-primary font-bold">{String(duration.hours).padStart(2, '0')}</span>
      <span className="text-gray-400 text-sm">:</span>
      <span className="text-primary font-bold">{String(duration.minutes).padStart(2, '0')}</span>
      <span className="text-gray-400 text-sm">:</span>
      <span className="text-primary font-bold">{String(duration.seconds).padStart(2, '0')}</span>
      <span className="text-gray-400 text-sm">:</span>
      <span className="text-accent font-bold">{String(milliseconds).padStart(3, '0')}</span>
    </div>
  );
}
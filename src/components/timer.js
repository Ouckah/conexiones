import React, { useState, useEffect } from 'react';

function format(number) {
    return number.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
}

function Timer() {
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Function to calculate the time remaining until the next day
    function calculateTimeRemaining() {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setDate(now.getDate() + 1);
      endOfDay.setHours(0, 0, 0, 0);

      const timeDiff = endOfDay - now;

      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    }

    // Update the time remaining every second
    const timerInterval = setInterval(() => {
      const remainingTime = calculateTimeRemaining();
      setTimeRemaining(remainingTime);

      // Check if it's a new day
      if (remainingTime.hours === 0 && remainingTime.minutes === 0 && remainingTime.seconds === 0) {
        clearInterval(timerInterval);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  return (
    <div className='flex flex-col justify-items-center items-center'>
      <h1 className='text-black font-normal text-lg uppercase'>Siguiente rompecabezas en</h1>
      <div className='text-black font-semibold text-4xl'>
        <span>{format(timeRemaining.hours)}:</span>
        <span>{format(timeRemaining.minutes)}:</span>
        <span>{format(timeRemaining.seconds)}</span>
      </div>
    </div>
  );
}

export default Timer;
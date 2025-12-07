import React, { useState, useEffect, useRef } from 'react';  // CHANGE: tambah useRef

export default function TrafficLight() {
  const [current, setCurrent] = useState('red');                 // state FSM
  const [secondsLeft, setSecondsLeft] = useState(5);            // timer
  const [paused, setPaused] = useState(true);                   // ADD: kontrol pause/resume

  const lastTimestamp = useRef(null);                           // ADD: untuk requestAnimationFrame timing

  // ADD: Durasi per state
  const DURATIONS = {
    red: 5,
    green: 4,
    yellow: 2,
  };

  const nextState = (c) => {
    if (c === 'red') return 'green';
    if (c === 'green') return 'yellow';
    return 'red';
  };

  useEffect(() => {
    let frame;

    const loop = (ts) => {
      if (paused) {
        lastTimestamp.current = ts;
        frame = requestAnimationFrame(loop);
        return;
      }

      if (!lastTimestamp.current) {
        lastTimestamp.current = ts;
      }

      const delta = (ts - lastTimestamp.current) / 1000; // seconds

      if (delta >= 1) {
        setSecondsLeft((prev) => {
          // time habis → pindah state
          if (prev <= 1) {
            const next = nextState(current);
            setCurrent(next);
            return DURATIONS[next];
          }
          return prev - 1;
        });

        lastTimestamp.current = ts;
      }

      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frame);
  }, [current, paused]);


  const togglePause = () => {
    setPaused((p) => !p);
  };

  const reset = () => {
    setPaused(true);
    setCurrent("red");
    setSecondsLeft(DURATIONS.red);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <div style={{ width: 60, margin: '0 auto' }}>
{['red', 'yellow', 'green'].map(color => (
          <div
            key={color}
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              marginBottom: 10,
              backgroundColor: current === color ? color : '#ddd',
            }}
          />
        ))}
      </div>

      <div style={{ fontSize: 24, marginTop: 10 }}>
        {secondsLeft}s left
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={togglePause}>
          {paused ? "Start" : "Pause"}
        </button>

        <button onClick={reset} style={{ marginLeft: 10 }}>
          Reset
        </button>
      </div>
    </div>
  );
}

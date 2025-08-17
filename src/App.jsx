import { useState, useEffect, useRef } from "react";

function App() {
  const [time, setTime] = useState(
    Number(localStorage.getItem("savedTime")) || 0
  );
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState(
    JSON.parse(localStorage.getItem("laps")) || []
  );

  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    localStorage.setItem("savedTime", time.toString());
    localStorage.setItem("laps", JSON.stringify(laps));
  }, [time, laps]);

  const format = (ms) => {
    const s = `0${Math.floor((ms / 1000) % 60)}`.slice(-2);
    const m = `0${Math.floor((ms / 60000) % 60)}`.slice(-2);
    const msPart = `0${Math.floor((ms / 10) % 100)}`.slice(-2);
    return `${m}:${s}:${msPart}`;
  };

  const handleLap = () => {
    setLaps((prev) => [...prev, time]);
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setLaps([]);
    localStorage.removeItem("savedTime");
    localStorage.removeItem("laps");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-cyan-200">
      <div className="backdrop-blur-lg bg-white/30 rounded-xl shadow-xl p-10 flex flex-col items-center gap-6 w-full max-w-md animate-fadeIn">
        <h1 className="text-3xl font-bold tracking-wider">⏱️ Stopwatch</h1>

        <div className="text-4xl font-semibold">{format(time)}</div>

        <div className="flex gap-4">
          {!isRunning ? (
            <button
              className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg transition transform hover:scale-95"
              onClick={() => setIsRunning(true)}
            >
              Start
            </button>
          ) : (
            <button
              className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded-lg transition transform hover:scale-95"
              onClick={() => setIsRunning(false)}
            >
              Pause
            </button>
          )}

          <button
            className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg transition transform hover:scale-95"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>

        {isRunning && (
          <button
            className="bg-blue-500 hover:bg-blue-600 mt-2 px-4 py-2 rounded-lg transition hover:scale-95"
            onClick={handleLap}
          >
            Lap
          </button>
        )}

        {laps.length > 0 && (
          <div className="mt-4 w-full max-h-60 overflow-y-auto space-y-2">
            <h2 className="text-lg font-semibold mb-2">Laps</h2>
            {laps.map((lapTime, index) => (
              <div
                key={index}
                className="bg-white/50 backdrop-blur rounded p-2"
              >
                Lap {index + 1}: {format(lapTime)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

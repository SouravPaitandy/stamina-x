"use client";

import { useState, useEffect } from "react";

export default function Timer({ label = "Kegel Hold", durations = [10], mode = "single" }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(durations[0]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (running && secondsLeft > 0) {
      timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    } else if (running && secondsLeft === 0) {
      if (currentStep + 1 < durations.length) {
        setCurrentStep((prev) => prev + 1);
        setSecondsLeft(durations[currentStep + 1]);
        // Optional: Play beep sound here
      } else {
        setRunning(false);
      }
    }
    return () => clearTimeout(timer);
  }, [running, secondsLeft]);

  const reset = () => {
    setRunning(false);
    setCurrentStep(0);
    setSecondsLeft(durations[0]);
  };

  const format = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border rounded-xl p-6 text-center shadow-md">
      <h2 className="text-xl font-semibold text-primary mb-1">{label}</h2>
      <p className="text-sm text-gray-500 mb-4">
        {mode === "cycle" ? `Step ${currentStep + 1} of ${durations.length}` : "Single Timer"}
      </p>
      <div className="text-5xl font-mono mb-6">{format(secondsLeft)}</div>
      <div className="flex justify-center gap-4">
        {!running ? (
          <button
            onClick={() => setRunning(true)}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Start
          </button>
        ) : (
          <button
            onClick={() => setRunning(false)}
            className="bg-yellow-400 text-white px-6 py-2 rounded-lg hover:bg-yellow-500"
          >
            Pause
          </button>
        )}
        <button
          onClick={reset}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

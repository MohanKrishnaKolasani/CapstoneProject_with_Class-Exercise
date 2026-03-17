import React, { useState } from "react";
import useTimer from "./useTimer";

const WorkoutTracker = () => {
  const { seconds, start, stop, reset, isActive } = useTimer();
  const [sets, setSets] = useState(0);

  return (
    <div className="card p-4 shadow">
      <h3>Workout Tracker</h3>

      <p><strong>Sets Completed:</strong> {sets}</p>
      <p><strong>Timer:</strong> {seconds} sec</p>

      <div className="mb-3">
        <button
          className="btn btn-success me-2"
          onClick={() => setSets((prev) => prev + 1)}
        >
          Add Set
        </button>

        {!isActive ? (
          <button className="btn btn-primary me-2" onClick={start}>
            Start Timer
          </button>
        ) : (
          <button className="btn btn-warning me-2" onClick={stop}>
            Stop Timer
          </button>
        )}

        <button className="btn btn-danger" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default WorkoutTracker;
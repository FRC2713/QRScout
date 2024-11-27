import { Pause, Play, TimerReset, Undo } from 'lucide-react';
import BaseInputProps from './BaseInputProps';
import { useState, useEffect } from 'react';
export interface TimerInputProps extends BaseInputProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
}
function getAvg(array: any[]) {
  if (array.length === 0) {
    return 0;
  }
  let avg = 0;
  array.forEach((num) => {
    avg += num;
  });
  return avg / array.length;
}
export default function TimerInput(data: TimerInputProps) {
  const [time, setTime] = useState(0);
  const [isRunning, toggleTimer] = useState(false);
  const [times, setTimes] = useState<number[]>([]);

  useEffect(() => {
    if (data.value === data.defaultValue && times.length > 0) {
      clearTimer();
      setTimes([]);
    }
  }, [data.value, data.defaultValue, times]);

  function startStop() {
    toggleTimer(!isRunning);
  }

  function clearTimer(update: boolean = false) {
    if (update) {
      updateTimes(time / 100);
    }
    setTime(0);
    toggleTimer(false);
  }

  function updateTimes(newValue: number) {
    data.onChange(getAvg([...times, newValue]))
    setTimes((old) => ([...old, newValue]));
  }

  useEffect(() => {
    let intervalId: number;
    if (isRunning) {
      intervalId = setInterval(() => setTime(time + (data.step || 1)), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);


  return (
    <div className="my-2 flex flex-col items-center justify-center">
      <p className='font-bold'>{`${data.value.toFixed(3)} (${times.length})`}</p>
      <h2 className="px-4 text-2xl dark:text-white">{(time / 100).toFixed(2)}</h2>
      <div className="my-2 flex flex-row items-center justify-center gap-4">
        <button
          className="focus:shadow-outline rounded bg-gray-500 text-white hover:bg-red-700 focus:outline-none dark:bg-gray-700 p-2"
          type="button"
          onClick={() => startStop()}
        >
          {isRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
        <button
          className="focus:shadow-outline rounded bg-gray-500 text-white hover:bg-red-700 focus:outline-none dark:bg-gray-700 p-2"
          type="button"
          onClick={() => clearTimer(true)}
        >
          <TimerReset className="size-4" />
        </button>
        <button
          className="focus:shadow-outline rounded bg-gray-500 text-white hover:bg-red-700 focus:outline-none dark:bg-gray-700 p-2"
          type="button"
          onClick={() => clearTimer(false)}
        >
          <Undo className="size-4" />
        </button>
      </div>
    </div>
  );
}

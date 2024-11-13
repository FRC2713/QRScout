import { Pause, Play, X } from 'lucide-react';
import BaseInputProps from './BaseInputProps';
import { useState, useEffect, useMemo } from 'react';
export interface TimerInputProps extends BaseInputProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
}
function getAvg(array: any[]) {
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

  console.log(data.value);

  function startStop() {
    toggleTimer(!isRunning);
  }
  function clearTimer() {
    setTime(0);
    toggleTimer(false);
  }
  function updateTimes(newValue: number) {
    setTimes((old) => ([...old, newValue]));
  }
  useEffect(() => {
    let intervalId: number;
    if (isRunning) {
      intervalId = setInterval(() => setTime(time + (data.step || 1)), 10);
    }
    if (!isRunning && time !== 0) {
      updateTimes(time / 100)
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  const avg = useMemo(() => {
    const avg2 = getAvg(times);
    data.onChange(avg2);
    return avg2;
  }, [times]);

  return (
    <div className="my-2 flex flex-col items-center justify-center">
      <p className='font-mono text-wrap'>{times.map((t) => { return `${t}` }).join(',')}</p>
      <p className='font-bold'>{avg.toFixed(3)}</p>
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
          onClick={() => clearTimer()}
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

import { Pause, Play, TimerReset, Undo } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { TimerInputProps } from './BaseInputProps';

function getAvg(array: any[]) {
  if (array.length === 0) {
    return 0;
  }
  let avg = 0;
  array.forEach(num => {
    avg += num;
  });
  return avg / array.length;
}
export default function TimerInput(props: TimerInputProps) {
  const [time, setTime] = useState(0);
  const [isRunning, toggleTimer] = useState(false);
  const [times, setTimes] = useState<number[]>([]);

  useEffect(() => {
    if (props.value === props.defaultValue && times.length > 0) {
      clearTimer();
      setTimes([]);
    }
  }, [props.value, props.defaultValue, times]);

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
    props.onChange(getAvg([...times, newValue]));
    setTimes(old => [...old, newValue]);
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRunning) {
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  return (
    <div className="my-2 flex flex-col items-center justify-center">
      <p className="font-bold">{`${props.value?.toFixed(3)} (${
        times.length
      })`}</p>
      <h2 className="px-4 text-2xl dark:text-white">
        {(time / 100).toFixed(2)}
      </h2>
      <div className="my-2 flex flex-row items-center justify-center gap-4">
        <Button variant="outline" onClick={() => startStop()}>
          {isRunning ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4" />
          )}
        </Button>
        <Button variant="outline" onClick={() => clearTimer(true)}>
          <TimerReset className="size-4" />
        </Button>
        <Button variant="outline" onClick={() => clearTimer(false)}>
          <Undo className="size-4" />
        </Button>
      </div>
    </div>
  );
}

import { useEvent } from '@/hooks';
import { inputSelector, updateValue, useQRScoutState } from '@/store/store';
import { Pause, Play, TimerReset, Undo } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { TimerInputData } from './BaseInputProps';
import { ConfigurableInputProps } from './ConfigurableInput';

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
export default function TimerInput(props: ConfigurableInputProps) {
  const data = useQRScoutState(
    inputSelector<TimerInputData>(props.section, props.code),
  );

  if (!data) {
    return <div>Invalid input</div>;
  }

  const [time, setTime] = useState(data.defaultValue);
  const [isRunning, setIsRunning] = useState(false);
  const [times, setTimes] = useState<number[]>([]);

  // Refs for accurate time tracking
  const startTimeRef = useRef<number>(0);
  const timeAccumulatorRef = useRef<number>(0);
  const requestAnimationFrameIdRef = useRef<number | null>(null);

  const average = useMemo(() => getAvg(times), [times]);

  const resetState = useCallback(
    ({ force }: { force: boolean }) => {
      if (force) {
        setTime(data.defaultValue);
        setIsRunning(false);
        setTimes([]);
        timeAccumulatorRef.current = 0;
        if (requestAnimationFrameIdRef.current !== null) {
          cancelAnimationFrame(requestAnimationFrameIdRef.current);
          requestAnimationFrameIdRef.current = null;
        }
        updateValue(props.code, data.defaultValue);
        return;
      }
      if (data.formResetBehavior === 'preserve') {
        return;
      }

      setTime(data.defaultValue);
      setIsRunning(false);
      setTimes([]);
      timeAccumulatorRef.current = 0;
      if (requestAnimationFrameIdRef.current !== null) {
        cancelAnimationFrame(requestAnimationFrameIdRef.current);
        requestAnimationFrameIdRef.current = null;
      }
      updateValue(props.code, data.defaultValue);
    },
    [data.defaultValue, data.formResetBehavior, props.code],
  );

  useEvent('resetFields', resetState);

  // Accurate timer using requestAnimationFrame
  const updateTimer = useCallback(() => {
    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    startTimeRef.current = now;

    timeAccumulatorRef.current += elapsed;
    setTime(timeAccumulatorRef.current);

    requestAnimationFrameIdRef.current = requestAnimationFrame(updateTimer);
  }, []);

  // Effect to handle starting and stopping the timer
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now();
      requestAnimationFrameIdRef.current = requestAnimationFrame(updateTimer);
    } else if (requestAnimationFrameIdRef.current !== null) {
      cancelAnimationFrame(requestAnimationFrameIdRef.current);
      requestAnimationFrameIdRef.current = null;
    }

    return () => {
      if (requestAnimationFrameIdRef.current !== null) {
        cancelAnimationFrame(requestAnimationFrameIdRef.current);
        requestAnimationFrameIdRef.current = null;
      }
    };
  }, [isRunning, updateTimer]);

  function startStop() {
    setIsRunning(!isRunning);
  }

  function lap() {
    // Convert milliseconds to seconds with 2 decimal places
    const currentTimeInSeconds = Number(
      (timeAccumulatorRef.current / 1000).toFixed(3),
    );
    setTimes([...times, currentTimeInSeconds]);
    timeAccumulatorRef.current = 0;
    setTime(0);
  }

  useEffect(() => {
    if (times.length > 0) {
      if (data.outputType === 'average') {
        updateValue(props.code, getAvg(times));
      } else {
        updateValue(props.code, times);
      }
    }
  }, [times, props.code]);

  // Format time display (milliseconds to seconds with 2 decimal places)
  const formattedTime = (time / 1000).toFixed(2);

  return (
    <div className="my-2 flex flex-col items-center justify-center">
      <h2 className="px-4 text-2xl dark:text-white">{formattedTime}</h2>
      <div className="my-2 flex flex-row items-center justify-center gap-4">
        <Button variant="outline" onClick={startStop}>
          {isRunning ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4" />
          )}
        </Button>
        <Button variant="outline" disabled={time === 0} onClick={lap}>
          <TimerReset className="size-4" />
        </Button>
        <Button variant="outline" onClick={() => resetState({ force: false })}>
          <Undo className="size-4" />
        </Button>
      </div>
      {data.outputType === 'average' ? (
        <p className="font-bold">{`${average.toFixed(3)} (${times.length})`}</p>
      ) : (
        <p className="font-bold">{times.map(t => t.toFixed(3)).join(', ')}</p>
      )}
    </div>
  );
}

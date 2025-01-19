import { useEvent } from '@/hooks';
import { inputSelector, updateValue, useQRScoutState } from '@/store/store';
import { Pause, Play, TimerReset, Undo } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [isRunning, toggleTimer] = useState(false);
  const [times, setTimes] = useState<number[]>([]);

  const average = useMemo(() => getAvg(times), [times]);

  const resetState = useCallback(({ force }: { force: boolean }) => {
    if (force) {
      setTime(data.defaultValue);
      toggleTimer(false);
      setTimes([]);
      updateValue(props.code, data.defaultValue);
      return;
    }
    if (data.formResetBehavior === 'preserve') {
      return;
    }

    setTime(data.defaultValue);
    toggleTimer(false);
    setTimes([]);
    updateValue(props.code, data.defaultValue);
  }, []);

  useEvent('resetFields', resetState);

  function startStop() {
    toggleTimer(!isRunning);
  }

  function lap() {
    setTimes([...times, time / 100]);
    setTime(0);
  }

  useEffect(() => {
    if (times.length > 0) {
      updateValue(props.code, getAvg(times));
    }
  }, [times]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRunning) {
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  return (
    <div className="my-2 flex flex-col items-center justify-center">
      <p className="font-bold">{`${average.toFixed(3)} (${times.length})`}</p>
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
        <Button variant="outline" disabled={time === 0} onClick={() => lap()}>
          <TimerReset className="size-4" />
        </Button>
        <Button variant="outline" onClick={() => resetState({ force: false })}>
          <Undo className="size-4" />
        </Button>
      </div>
    </div>
  );
}

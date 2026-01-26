import { Button } from '@/components/ui/button';
import { useEvent } from '@/hooks';
import { inputSelector, updateValue, useQRScoutState } from '@/store/store';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { Play, Square, Undo2 } from 'lucide-react';
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActionTrackerInputData } from './BaseInputProps';
import { ConfigurableInputProps } from './ConfigurableInput';

// Cache for lazy-loaded icon components to avoid recreating on each render
const iconCache = new Map<string, React.LazyExoticComponent<React.FC<{ className?: string }>>>();

interface DynamicIconProps {
  name: string;
  className?: string;
}

function DynamicIcon({ name, className }: DynamicIconProps) {
  // Check if the icon name exists in the available imports
  if (!name || !(name in dynamicIconImports)) {
    return null;
  }

  // Get or create the lazy component
  if (!iconCache.has(name)) {
    const importFn = dynamicIconImports[name as keyof typeof dynamicIconImports];
    iconCache.set(name, lazy(importFn) as React.LazyExoticComponent<React.FC<{ className?: string }>>);
  }

  const IconComponent = iconCache.get(name)!;

  return (
    <Suspense fallback={<span className={className} />}>
      <IconComponent className={className} />
    </Suspense>
  );
}

interface ActionEntry {
  actionCode: string;
  timestamp: number; // seconds since timer start
}

export default function ActionTrackerInput(props: ConfigurableInputProps) {
  const data = useQRScoutState(
    inputSelector<ActionTrackerInputData>(props.section, props.code),
  );

  if (!data) {
    return <div>Invalid input</div>;
  }

  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // milliseconds
  const [autoStarted, setAutoStarted] = useState(false);

  // Action log state
  const [actionLog, setActionLog] = useState<ActionEntry[]>([]);

  // Refs for accurate time tracking
  const startTimeRef = useRef<number>(0);
  const elapsedAccumulatorRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Compute counts per action
  const actionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const action of data.actions) {
      counts[action.code] = actionLog.filter(
        e => e.actionCode === action.code,
      ).length;
    }
    return counts;
  }, [actionLog, data.actions]);

  // Compute times per action
  const actionTimes = useMemo(() => {
    const times: Record<string, number[]> = {};
    for (const action of data.actions) {
      times[action.code] = actionLog
        .filter(e => e.actionCode === action.code)
        .map(e => e.timestamp);
    }
    return times;
  }, [actionLog, data.actions]);

  // Reset handler
  const resetState = useCallback(
    ({ force }: { force: boolean }) => {
      if (force || data.formResetBehavior === 'reset') {
        setIsRunning(false);
        setElapsedTime(0);
        setAutoStarted(false);
        setActionLog([]);
        elapsedAccumulatorRef.current = 0;
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      }
      // 'preserve' does nothing, 'increment' doesn't make sense for this input
    },
    [data.formResetBehavior],
  );

  useEvent('resetFields', resetState);

  // Timer update loop using requestAnimationFrame
  const updateTimer = useCallback(() => {
    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    startTimeRef.current = now;
    elapsedAccumulatorRef.current += elapsed;
    setElapsedTime(elapsedAccumulatorRef.current);
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, []);

  // Effect to handle timer start/stop
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    } else if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isRunning, updateTimer]);

  // Start timer
  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  // Stop timer
  const stopTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Record an action
  const recordAction = useCallback(
    (actionCode: string) => {
      // Auto-start timer if not running
      if (!isRunning) {
        startTimer();
        setAutoStarted(true);
      }

      // Get current timestamp in seconds (with 1 decimal precision)
      const timestampSeconds = Number(
        (elapsedAccumulatorRef.current / 1000).toFixed(1),
      );

      setActionLog(prev => [...prev, { actionCode, timestamp: timestampSeconds }]);
    },
    [isRunning, startTimer],
  );

  // Undo last action
  const undoLastAction = useCallback(() => {
    setActionLog(prev => prev.slice(0, -1));
  }, []);

  // Sync to store whenever actionLog changes
  useEffect(() => {
    // Update each action's count and times fields
    for (const action of data.actions) {
      const countCode = `${props.code}_${action.code}_count`;
      const timesCode = `${props.code}_${action.code}_times`;

      updateValue(countCode, actionCounts[action.code] || 0);
      updateValue(
        timesCode,
        (actionTimes[action.code] || []).join(','),
      );
    }
  }, [actionLog, actionCounts, actionTimes, data.actions, props.code]);

  // Format elapsed time as MM:SS.s
  const formattedTime = useMemo(() => {
    const totalSeconds = elapsedTime / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toFixed(1).padStart(4, '0')}`;
  }, [elapsedTime]);

  // Get recent log entries (last 5) for display
  const recentLog = useMemo(() => {
    return actionLog.slice(-5).reverse();
  }, [actionLog]);

  // Find label for action code
  const getActionLabel = useCallback(
    (code: string) => {
      return data.actions.find(a => a.code === code)?.label || code;
    },
    [data.actions],
  );

  return (
    <div className="my-2 flex flex-col items-center gap-3">
      {/* Timer display */}
      <div className="flex flex-col items-center gap-1">
        <div className="font-mono text-3xl font-bold dark:text-white">
          {formattedTime}
        </div>
        {autoStarted && !isRunning && (
          <span className="text-xs text-muted-foreground">(auto-started)</span>
        )}
      </div>

      {/* Timer controls */}
      <div className="flex gap-2">
        {!isRunning ? (
          <Button variant="outline" size="sm" onClick={startTimer}>
            <Play className="mr-1 size-4" />
            Start
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={stopTimer}>
            <Square className="mr-1 size-4" />
            Stop
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={undoLastAction}
          disabled={actionLog.length === 0}
        >
          <Undo2 className="mr-1 size-4" />
          Undo
        </Button>
      </div>

      {/* Action buttons grid */}
      <div className="grid w-full grid-cols-2 gap-2">
        {data.actions.map(action => (
          <Button
            key={action.code}
            variant="secondary"
            className="min-h-16 flex-col gap-1 text-wrap py-3"
            onClick={() => recordAction(action.code)}
            disabled={data.disabled}
          >
            {action.icon && (
              <DynamicIcon name={action.icon} className="size-5" />
            )}
            <span className="text-sm font-medium">{action.label}</span>
            <span className="text-xs text-muted-foreground">
              ({actionCounts[action.code] || 0})
            </span>
          </Button>
        ))}
      </div>

      {/* Recent action log */}
      {actionLog.length > 0 && (
        <div className="w-full rounded-md border bg-muted/50 p-2 text-xs">
          <div className="mb-1 font-medium text-muted-foreground">
            Recent ({actionLog.length} total):
          </div>
          <div className="flex flex-wrap gap-1">
            {recentLog.map((entry, idx) => (
              <span
                key={`${entry.actionCode}-${entry.timestamp}-${idx}`}
                className="rounded bg-background px-1.5 py-0.5"
              >
                {getActionLabel(entry.actionCode)}@{entry.timestamp}s
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

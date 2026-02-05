import { Button } from '@/components/ui/button';
import { useEvent } from '@/hooks';
import { cn } from '@/lib/utils';
import { inputSelector, updateValue, useQRScoutState } from '@/store/store';
import { Play, Square, Undo2 } from 'lucide-react';
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActionTrackerInputData } from './BaseInputProps';
import { ConfigurableInputProps } from './ConfigurableInput';

// Lazy-load DynamicIcon module only when icons are used (avoids 100KB+ bundle cost)
const LazyDynamicIcon = lazy(() => import('./DynamicIcon'));

// Touch gesture constants (based on React Native / @use-gesture standards)
const HOLD_INTENT_DELAY_MS = 200; // Time before hold is considered intentional
const MOVEMENT_THRESHOLD_PX = 10; // Movement that cancels a pending press (scroll detection)

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  return (
    <Suspense fallback={<span className={className} />}>
      <LazyDynamicIcon name={name} className={className} />
    </Suspense>
  );
}

interface ActionEntry {
  actionCode: string;
  timestamp: number; // start time in seconds since timer start
  endTimestamp?: number; // end time in seconds (hold mode only)
}

// Track active pointer presses for multi-touch hold mode
interface ActivePointer {
  actionCode: string;
  startTime: number;
}

// Pending pointer tracking (before intent is confirmed for hold mode)
interface PendingPointer {
  actionCode: string;
  startX: number;
  startY: number;
  intentTimerId: ReturnType<typeof setTimeout>;
}

// Pending tap tracking (for scroll detection in tap mode)
interface PendingTap {
  actionCode: string;
  startX: number;
  startY: number;
  cancelled: boolean;
}

// Haptic feedback helper - fails silently on unsupported devices
const vibrate = (pattern: number | number[]) => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

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

  // Hold mode state - track active pointer presses for multi-touch
  const [activePointers, setActivePointers] = useState<Map<number, ActivePointer>>(
    () => new Map(),
  );

  // Pending pointers (hold mode) - before intent is confirmed
  const pendingPointersRef = useRef<Map<number, PendingPointer>>(new Map());

  // Pending taps (tap mode) - for scroll detection
  const pendingTapsRef = useRef<Map<number, PendingTap>>(new Map());

  // Determine mode (defaults to 'hold')
  const isHoldMode = data.mode !== 'tap';

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

  // Reset handler
  const resetState = useCallback(
    ({ force }: { force: boolean }) => {
      if (force || data.formResetBehavior === 'reset') {
        setIsRunning(false);
        setElapsedTime(0);
        setAutoStarted(false);
        setActionLog([]);
        setActivePointers(new Map()); // Clear any active holds
        elapsedAccumulatorRef.current = 0;
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      }
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

  // Cancel a pending pointer (hold mode) - clears timer and removes from tracking
  const cancelPendingPointer = useCallback((pointerId: number) => {
    const pending = pendingPointersRef.current.get(pointerId);
    if (pending) {
      clearTimeout(pending.intentTimerId);
      pendingPointersRef.current.delete(pointerId);
    }
  }, []);

  // Hold mode: handle pointer down (start intent tracking)
  const handlePointerDown = useCallback(
    (e: React.PointerEvent, actionCode: string) => {
      if (isHoldMode) {
        // Store element reference for use in setTimeout (e.currentTarget won't be valid later)
        const element = e.currentTarget;
        const pointerId = e.pointerId;

        // Start intent timer - don't record action until confirmed
        // NOTE: We delay setPointerCapture until intent is confirmed so that
        // the browser can still initiate a scroll if the user moves quickly
        const intentTimerId = setTimeout(() => {
          // Intent confirmed after delay
          pendingPointersRef.current.delete(pointerId);

          // NOW capture the pointer - user has committed to the hold
          element.setPointerCapture(pointerId);

          // Auto-start timer if not running
          if (!isRunning) {
            startTimer();
            setAutoStarted(true);
          }

          const startTime = Number((elapsedAccumulatorRef.current / 1000).toFixed(1));

          setActivePointers(prev => {
            const next = new Map(prev);
            next.set(pointerId, { actionCode, startTime });
            return next;
          });

          vibrate(50); // Haptic on confirmed hold
        }, HOLD_INTENT_DELAY_MS);

        // Track as pending
        pendingPointersRef.current.set(e.pointerId, {
          actionCode,
          startX: e.clientX,
          startY: e.clientY,
          intentTimerId,
        });
      } else {
        // Tap mode: capture pointer immediately for reliable tracking
        e.currentTarget.setPointerCapture(e.pointerId);

        // Track for scroll detection (no delay)
        pendingTapsRef.current.set(e.pointerId, {
          actionCode,
          startX: e.clientX,
          startY: e.clientY,
          cancelled: false,
        });
      }
    },
    [isHoldMode, isRunning, startTimer],
  );

  // Handle pointer movement - detect scroll intent and cancel if needed
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isHoldMode) {
        // Only check pending pointers (not yet confirmed)
        const pending = pendingPointersRef.current.get(e.pointerId);
        if (!pending) return; // Already confirmed or not tracking

        const deltaX = e.clientX - pending.startX;
        const deltaY = e.clientY - pending.startY;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance > MOVEMENT_THRESHOLD_PX) {
          // User is scrolling - cancel the pending press
          // No need to releasePointerCapture - we haven't captured it yet
          cancelPendingPointer(e.pointerId);
        }
      } else {
        // Tap mode: check for scroll
        const pending = pendingTapsRef.current.get(e.pointerId);
        if (!pending || pending.cancelled) return;

        const deltaX = e.clientX - pending.startX;
        const deltaY = e.clientY - pending.startY;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance > MOVEMENT_THRESHOLD_PX) {
          pending.cancelled = true; // Mark as cancelled (scroll detected)
        }
      }
    },
    [isHoldMode, cancelPendingPointer],
  );

  // Hold mode: handle pointer up/cancel/leave (end tracking and record)
  const handlePointerEnd = useCallback(
    (e: React.PointerEvent) => {
      if (!isHoldMode) return;

      // Check if this was a pending pointer (not yet confirmed)
      if (pendingPointersRef.current.has(e.pointerId)) {
        // Pending pointers can be cancelled by any end event
        // No need to releasePointerCapture - we haven't captured it yet
        cancelPendingPointer(e.pointerId);
        return; // Don't record - wasn't held long enough
      }

      // For CONFIRMED holds: only end on pointerup
      // Ignore pointercancel and pointerleave - user is still holding,
      // the browser just got confused by finger movement
      if (e.type === 'pointercancel' || e.type === 'pointerleave') {
        return;
      }

      // Handle confirmed active pointer (only on pointerup)
      const active = activePointers.get(e.pointerId);
      if (!active) return;

      e.currentTarget.releasePointerCapture(e.pointerId);

      const endTime = Number((elapsedAccumulatorRef.current / 1000).toFixed(1));

      // Record the action with start and end times
      setActionLog(prev => [
        ...prev,
        {
          actionCode: active.actionCode,
          timestamp: active.startTime,
          endTimestamp: endTime,
        },
      ]);

      setActivePointers(prev => {
        const next = new Map(prev);
        next.delete(e.pointerId);
        return next;
      });

      vibrate([30, 20, 30]); // Double buzz on release
    },
    [isHoldMode, activePointers, cancelPendingPointer],
  );

  // Tap mode: handle pointer up - record action if not cancelled by scroll
  const handleTapEnd = useCallback(
    (e: React.PointerEvent) => {
      if (isHoldMode) return;

      const pending = pendingTapsRef.current.get(e.pointerId);
      pendingTapsRef.current.delete(e.pointerId);

      e.currentTarget.releasePointerCapture(e.pointerId);

      if (pending && !pending.cancelled) {
        // Valid tap - record action
        recordAction(pending.actionCode);
      }
    },
    [isHoldMode, recordAction],
  );

  // End all active holds and cancel pending pointers when window loses focus
  useEffect(() => {
    const handleBlur = () => {
      // Cancel all pending pointers (hold mode)
      for (const [, pending] of pendingPointersRef.current) {
        clearTimeout(pending.intentTimerId);
      }
      pendingPointersRef.current.clear();

      // Clear pending taps (tap mode)
      pendingTapsRef.current.clear();

      // Record all confirmed active holds as completed
      if (activePointers.size === 0) return;

      const endTime = Number((elapsedAccumulatorRef.current / 1000).toFixed(1));

      // Record all active holds as completed
      setActionLog(prev => [
        ...prev,
        ...Array.from(activePointers.values()).map(p => ({
          actionCode: p.actionCode,
          timestamp: p.startTime,
          endTimestamp: endTime,
        })),
      ]);

      setActivePointers(new Map());
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [activePointers]);

  // Cleanup pending pointer timers on unmount
  useEffect(() => {
    return () => {
      for (const pending of pendingPointersRef.current.values()) {
        clearTimeout(pending.intentTimerId);
      }
    };
  }, []);

  // Sync to store whenever actionLog changes
  useEffect(() => {
    // Update each action's count and times fields
    for (const action of data.actions) {
      const countCode = `${props.code}_${action.code}_count`;
      const timesCode = `${props.code}_${action.code}_times`;

      updateValue(countCode, actionCounts[action.code] || 0);

      // Format times based on mode
      const entries = actionLog.filter(e => e.actionCode === action.code);
      const formattedTimes = isHoldMode
        ? entries.map(e => `${e.timestamp}-${e.endTimestamp}`).join(',')
        : entries.map(e => e.timestamp).join(',');

      updateValue(timesCode, formattedTimes);
    }
  }, [actionLog, actionCounts, data.actions, props.code, isHoldMode]);

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
        {data.actions.map(action => {
          // Check if this action has any active pointers (being held)
          const isBeingHeld = Array.from(activePointers.values()).some(
            p => p.actionCode === action.code,
          );

          return (
            <Button
              key={action.code}
              variant="secondary"
              className={cn(
                'h-auto min-h-16 flex-col gap-1 text-wrap py-3 touch-none select-none',
                isBeingHeld && 'ring-2 ring-primary ring-offset-2 !bg-primary/20 animate-pulse',
              )}
              onPointerDown={e => handlePointerDown(e, action.code)}
              onPointerMove={handlePointerMove}
              onPointerUp={e => {
                handlePointerEnd(e);
                handleTapEnd(e);
              }}
              onPointerCancel={handlePointerEnd}
              onPointerLeave={handlePointerEnd}
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
          );
        })}
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
                {getActionLabel(entry.actionCode)}@
                {entry.endTimestamp !== undefined
                  ? `${entry.timestamp}-${entry.endTimestamp}s`
                  : `${entry.timestamp}s`}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

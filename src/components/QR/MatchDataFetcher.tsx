import { useState, useCallback } from 'react';
import { useQRScoutState, setMatchData } from '@/store/store';
import { fetchTeamEvents, fetchEventMatches } from '@/util/theBlueAlliance';
import { EventData } from '@/types/eventData';
import { EventSelectionDialog } from './EventSelectionDialog';
import { Button } from '@/components/ui/button';
import { Database, Loader2 } from 'lucide-react';

type MatchDataFetcherProps = {
  onError: (message: string) => void;
  className?: string;
};

/**
 * A self-contained component for fetching and processing match data from The Blue Alliance,
 * including its own button and dialog handling.
 */
export function MatchDataFetcher({
  onError,
  className,
}: MatchDataFetcherProps) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formData = useQRScoutState(state => state.formData);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const teamNumber = formData.teamNumber;
      if (!teamNumber) {
        onError('Team number is required to fetch event data');
        return;
      }

      const result = await fetchTeamEvents(teamNumber);

      if (!result.success) {
        onError(result.error.message);
        return;
      }

      if (result.data.length === 0) {
        onError('No events found for this team in the current year');
        return;
      }

      setEvents(result.data);
      setIsEventDialogOpen(true);
    } catch (error) {
      onError(
        'Failed to fetch event data. Please check your internet connection.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [formData, onError]);

  const handlePrefillClick = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEventSelected = useCallback(
    async (eventKey: string) => {
      try {
        const result = await fetchEventMatches(eventKey);

        if (!result.success) {
          onError(result.error.message);
          return;
        }

        if (result.data.length === 0) {
          onError('No match data available for this event yet');
          return;
        }

        // Store match data and close dialog
        setMatchData(result.data);
        setIsEventDialogOpen(false);
      } catch (error) {
        onError(
          'Failed to fetch match data. Please check your internet connection.',
        );
      }
    },
    [onError],
  );

  return (
    <>
      <EventSelectionDialog
        isOpen={isEventDialogOpen}
        onOpenChange={setIsEventDialogOpen}
        events={events}
        onEventSelected={handleEventSelected}
        onClose={() => setIsEventDialogOpen(false)}
      />

      <Button
        variant="secondary"
        onClick={handlePrefillClick}
        className={className}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 flex-shrink-0 animate-spin" />
        ) : (
          <Database className="h-5 w-5 flex-shrink-0" />
        )}
        <span className="overflow-hidden text-ellipsis">
          {isLoading ? 'Loading...' : 'Prefill Match Data'}
        </span>
      </Button>
    </>
  );
}


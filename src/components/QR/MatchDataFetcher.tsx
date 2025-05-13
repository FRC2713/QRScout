import { useState, useCallback } from 'react';
import { useQRScoutState, setConfigWithMatchData } from '@/store/store';
import { fetchTeamEvents, fetchEventMatches } from '@/util/theBlueAlliance';
import { EventData } from '@/types/eventData';
import { EventSelectionDialog } from './EventSelectionDialog';
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const formData = useQRScoutState(state => state.formData);
  const configText = JSON.stringify(formData, null, 2);

  const fetchEvents = useCallback(async () => {
    try {
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
      setIsDialogOpen(true);
    } catch (error) {
      onError(
        'Failed to fetch event data. Please check your internet connection.',
      );
    }
  }, [formData, onError]);

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
        const configResult = setConfigWithMatchData(configText, result.data);
        if (!configResult.success) {
          onError(configResult.error.message);
        }

        setIsDialogOpen(false);
      } catch (error) {
        onError(
          'Failed to fetch match data. Please check your internet connection.',
        );
      }
    },
    [configText, onError],
  );

  return (
    <>
      <EventSelectionDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        events={events}
        onEventSelected={handleEventSelected}
        onClose={() => setIsDialogOpen(false)}
      />

      <Button variant="secondary" onClick={fetchEvents} className={className}>
        <Database className="h-5 w-5 flex-shrink-0" />
        <span className="overflow-hidden text-ellipsis">
          Prefill Match Data
        </span>
      </Button>
    </>
  );
}


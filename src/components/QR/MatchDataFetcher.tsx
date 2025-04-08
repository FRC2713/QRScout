import { useState, useCallback } from 'react';
import { useQRScoutState, fetchTBAData, setConfigWithMatchData } from '@/store/store';
import { EventData } from '@/types/eventData';
import { MatchData } from '@/types/matchData';
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
export function MatchDataFetcher({ onError, className }: MatchDataFetcherProps) {
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
      
      const teamKey = `frc${teamNumber}`;
      const year = new Date().getFullYear();
      const url = `https://www.thebluealliance.com/api/v3/team/${teamKey}/events/${year}`;
      const result = await fetchTBAData(url);
      
      if (!result.success) {
        onError(result.error.message);
        return;
      }
      
      // The API returns an array of events
      const eventData = result.data as EventData[];
      if (eventData.length === 0) {
        onError('No events found for this team in the current year');
        return;
      }
      
      setEvents(eventData);
      setIsDialogOpen(true);
    } catch (error) {
      onError('Failed to fetch event data. Please check your internet connection.');
    }
  }, [formData, onError]);

  const handleEventSelected = useCallback(async (eventKey: string) => {
    try {
      const url = `https://www.thebluealliance.com/api/v3/event/${eventKey}/matches`;
      const result = await fetchTBAData(url);
      
      if (!result.success) {
        onError(result.error.message);
        return;
      }
      
      // The API returns an array of matches
      const matchData = result.data as MatchData[];
      if (matchData.length === 0) {
        onError('No match data available for this event yet');
        return;
      }
      
      // Store match data and close dialog
      const configResult = setConfigWithMatchData(configText, matchData);
      if (!configResult.success) {
        onError(configResult.error.message);
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      onError('Failed to fetch match data. Please check your internet connection.');
    }
  }, [configText, onError]);

  return (
    <>
      <EventSelectionDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        events={events}
        onEventSelected={handleEventSelected}
        onClose={() => setIsDialogOpen(false)}
      />
      
      <Button
        variant="secondary"
        onClick={fetchEvents}
        className={className}
      >
        <Database className="h-5 w-5 flex-shrink-0" />
        <span className="overflow-hidden text-ellipsis">Prefill Match Data</span>
      </Button>
    </>
  );
}
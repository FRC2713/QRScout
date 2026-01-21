import { useState } from 'react';
import { EventData } from '@/types/eventData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

type EventSelectionDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  events: EventData[];
  onEventSelected: (eventKey: string) => Promise<void>;
  onClose: () => void;
};

export function EventSelectionDialog({
  isOpen,
  onOpenChange,
  events,
  onEventSelected,
  onClose,
}: EventSelectionDialogProps) {
  const [selectedEventKey, setSelectedEventKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEventSelect = (eventKey: string) => {
    setSelectedEventKey(eventKey);
  };

  const handleConfirm = async () => {
    if (!selectedEventKey) return;
    
    try {
      setIsLoading(true);
      setError(null);
      await onEventSelected(selectedEventKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch match data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Event</DialogTitle>
          <DialogDescription>
            Choose an event to fetch match data from The Blue Alliance
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-100 text-red-800 p-2 rounded-lg">{error}</div>
        )}

        <div className="grid gap-4 max-h-[50vh] overflow-y-auto py-4">
          {events.length === 0 ? (
            <p className="text-center text-muted-foreground">No events found</p>
          ) : (
            events.map((event) => (
              <Card 
                key={event.key}
                className={`cursor-pointer transition-colors ${
                  selectedEventKey === event.key ? 'border-primary' : ''
                }`}
                onClick={() => handleEventSelect(event.key)}
              >
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-2 pb-4">
                  <p className="text-sm">
                    {event.city} | {event.start_date} to {event.end_date}
                  </p>
                  {event.short_name && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.short_name} (Week {event.week})
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedEventKey || isLoading}
          >
            {isLoading ? 'Loading...' : 'Fetch Match Data'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

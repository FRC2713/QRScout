import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateTBAApiKey } from '@/util/theBlueAlliance';
import { setTBAApiKey, getTBAApiKey } from '@/util/tbaApiKeyStorage';

interface TBAApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApiKeySet: () => void;
}

export default function TBAApiKeyDialog({
  open,
  onOpenChange,
  onApiKeySet,
}: TBAApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState(getTBAApiKey() || '');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleTestAndSave = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setIsValidating(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await validateTBAApiKey(apiKey.trim());

      if (result.success) {
        setTBAApiKey(apiKey.trim());
        setSuccess('API key validated and saved successfully!');
        setTimeout(() => {
          onApiKeySet();
          onOpenChange(false);
        }, 1000);
      } else {
        setError(result.error.message);
      }
    } catch (error) {
      setError(`Validation failed: ${(error as Error).message}`);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSkip = () => {
    onOpenChange(false);
  };

  const resetState = () => {
    setError(null);
    setSuccess(null);
    setApiKey(getTBAApiKey() || '');
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      resetState();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure Blue Alliance API Key</DialogTitle>
          <DialogDescription>
            To use match data prefilling, you need to configure your Blue
            Alliance API key. This will be stored locally in your browser for
            subsequent use.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="api-key" className="text-sm font-medium">
              API Key
            </label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your Blue Alliance API key"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              disabled={isValidating}
            />
          </div>

          {error && (
            <div className="p-4 border border-red-200 bg-red-50 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 border border-green-200 bg-green-50 rounded-md">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Don't have an API key?</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                Go to{' '}
                <a
                  href="https://www.thebluealliance.com/account/login?next=http://www.thebluealliance.com/account"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  The Blue Alliance
                </a>
              </li>
              <li>Sign in to your account</li>
              <li>Go to Account → Read API Keys</li>
              <li>Create a new API key</li>
            </ol>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleSkip}
            disabled={isValidating}
          >
            Skip for now
          </Button>
          <Button
            onClick={handleTestAndSave}
            disabled={isValidating || !apiKey.trim()}
          >
            {isValidating ? 'Testing...' : 'Test & Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


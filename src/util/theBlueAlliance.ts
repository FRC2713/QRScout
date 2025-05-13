import { MatchData } from '../types/matchData';
import { EventData } from '../types/eventData';

type Result<T> = { success: true; data: T } | { success: false; error: Error };

const TBA_API_KEY =
  'uI64oiGePY9oTFFIiwImsng5EMj92CaKg3S4CFiJUrowEZ3Q8emkdt2tswkV5o1Q';
const TBA_API_BASE_URL = 'https://www.thebluealliance.com/api/v3';

/**
 * Extract a user-friendly error message from an HTTP response
 */
async function extractErrorMessage(response: Response): Promise<string> {
  try {
    // Try to read the response body as text
    const bodyText = await response.text();

    // If we have body text, try to parse it as JSON
    if (bodyText) {
      try {
        const bodyJson = JSON.parse(bodyText);

        // Handle TBA API specific error format
        if (bodyJson.Error) {
          // Extract just the error message part, removing any prefix like "team key:"
          return bodyJson.Error.replace(/^.*?:\s*/, '');
        }

        if (bodyJson.message) {
          return bodyJson.message;
        }
      } catch {
        // If JSON parsing fails, return the raw text
        return bodyText;
      }
    }

    // Default messages based on status code if no specific message was found
    if (response.status === 404) {
      return 'Resource not found';
    } else if (response.status === 403) {
      return 'Access denied';
    } else if (response.status === 429) {
      return 'Too many requests, please try again later';
    }

    // Fallback status-based message
    return `Server error (${response.status})`;
  } catch (error) {
    // Complete fallback
    return `Error ${response.status}`;
  }
}

/**
 * Base function to fetch data from The Blue Alliance API
 */
async function fetchTBAData<T>(endpoint: string): Promise<Result<T>> {
  try {
    // If endpoint is a full URL, use it as is, otherwise prepend the base URL
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${TBA_API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'X-TBA-Auth-Key': TBA_API_KEY,
      },
    });

    if (!response.ok) {
      const errorDetail = await extractErrorMessage(response);
      throw new Error(errorDetail);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('TBA API error:', error);
    return { success: false, error: error as Error };
  }
}

/**
 * Fetches events for a specific team and year
 */
export async function fetchTeamEvents(
  teamNumber: number,
  year?: number,
): Promise<Result<EventData[]>> {
  const currentYear = year || new Date().getFullYear();
  const teamKey = `frc${teamNumber}`;
  const endpoint = `/team/${teamKey}/events/${currentYear}`;

  try {
    const result = await fetchTBAData<EventData[]>(endpoint);
    return result;
  } catch (error) {
    // Add context to the error message
    const errorMessage = `Failed fetching events: ${(error as Error).message}`;
    return { success: false, error: new Error(errorMessage) };
  }
}

/**
 * Fetches matches for a specific event
 */
export async function fetchEventMatches(
  eventKey: string,
): Promise<Result<MatchData[]>> {
  const endpoint = `/event/${eventKey}/matches`;

  try {
    const result = await fetchTBAData<MatchData[]>(endpoint);
    return result;
  } catch (error) {
    // Add context to the error message
    const errorMessage = `Failed fetching matches: ${(error as Error).message}`;
    return { success: false, error: new Error(errorMessage) };
  }
}


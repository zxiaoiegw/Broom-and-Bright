import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { API_URL } from '@/lib/api';
import { staffApi } from './staffApi';

export function CalendarSyncPanel() {
  const [token, setToken] = useState<string | null | undefined>(undefined); // undefined = loading
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const load = async () => {
    try {
      const { token } = await staffApi.getCalendarFeedToken();
      setToken(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load.');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const feedUrl = token ? `${API_URL}/api/calendar-feed/${token}` : null;

  const generate = async () => {
    setBusy(true);
    setError(null);
    try {
      const { token } = await staffApi.generateCalendarFeedToken();
      setToken(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate link.');
    } finally {
      setBusy(false);
    }
  };

  const regenerate = async () => {
    if (!confirm('Regenerate your link? The old one will stop working, so re-add the new one in Google/Apple Calendar.')) {
      return;
    }
    await generate();
  };

  const revoke = async () => {
    if (!confirm('Turn off calendar sync? Your existing link will stop working.')) return;
    setBusy(true);
    setError(null);
    try {
      await staffApi.revokeCalendarFeedToken();
      setToken(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to turn off.');
    } finally {
      setBusy(false);
    }
  };

  const copyLink = async () => {
    if (!feedUrl) return;
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail (permissions, non-secure context) — the URL
      // is still selectable in the input, so this isn't fatal.
    }
  };

  return (
    <div className="space-y-4 max-w-lg">
      <div>
        <h3 className="text-sm font-bold text-slate-900">Calendar sync</h3>
        <p className="text-xs text-slate-600 mt-1">
          Get a personal link you can subscribe to from Google Calendar or Apple Calendar, so your
          TrueClean KC jobs show up automatically alongside your own events. This is one-way — it
          just shows your bookings; it won't pull events from your personal calendar back in.
        </p>
      </div>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      {token === undefined ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : token === null ? (
        <Button size="sm" onClick={generate} disabled={busy}>
          {busy ? 'Generating...' : 'Get my calendar link'}
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input readOnly value={feedUrl ?? ''} onFocus={(e) => e.target.select()} className="text-xs" />
            <Button size="sm" variant="outline" onClick={copyLink} className="shrink-0">
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>

          <div className="text-xs text-slate-500 space-y-1">
            <p>
              <strong>Google Calendar:</strong> Settings → Add calendar → From URL → paste this link.
            </p>
            <p>
              <strong>Apple Calendar:</strong> File → New Calendar Subscription → paste this link.
            </p>
            <p>Calendars typically refresh a subscribed link every few hours, not instantly.</p>
          </div>

          <div className="flex gap-2 pt-1">
            <Button size="sm" variant="outline" onClick={regenerate} disabled={busy}>
              Regenerate link
            </Button>
            <Button size="sm" variant="outline" className="text-destructive" onClick={revoke} disabled={busy}>
              Turn off
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

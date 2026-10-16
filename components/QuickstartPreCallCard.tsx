'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type QuickstartPreCallCardProps = {
  ended?: boolean;
  isLoading: boolean;
  error: string | null;
  onStartConversation: () => void;
};

export function QuickstartPreCallCard({
  isLoading,
  ended = false,
  error,
  onStartConversation,
}: QuickstartPreCallCardProps) {
  return (
    <div
      className="mx-auto flex w-[min(92vw,26.25rem)] animate-fade-up flex-col items-center rounded-[20px] border border-[#2b2b2b] px-10 py-10 text-center shadow-[0_10px_24px_rgba(0,0,0,0.28)]"
      style={{
        backgroundImage:
          'linear-gradient(164.988deg, rgba(54,54,54,0.2) 1.0596%, rgba(0,0,0,0) 96.089%), linear-gradient(90deg, rgb(16,16,16) 0%, rgb(16,16,16) 100%)',
      }}
    >
      <span className="mb-4 text-xs font-medium tracking-wide text-white/60">SCENARIO 03</span>
      <h1 className="text-[28px] font-medium leading-[1.2] text-white">
        Service Feedback Survey
      </h1>
      <p className="mt-[14px] text-sm font-medium leading-6 text-white/70">
        Share whether your support issue was resolved, give a 1–5 service rating, and tell us what could be better.
      </p>

      <Button
        onClick={onStartConversation}
        disabled={isLoading}
        className="mt-8 min-h-10 h-auto py-3 whitespace-normal w-full rounded-lg border border-primary bg-primary text-sm font-medium text-black hover:border-white hover:bg-white hover:text-black disabled:hover:border-primary disabled:hover:bg-primary disabled:hover:text-black"
        aria-label={
          isLoading
            ? 'Connecting to the Feedback Assistant…'
            : 'Start feedback survey'
        }
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting to the Feedback Assistant…
          </>
        ) : (
          ended ? 'Start another survey' : 'Start feedback survey'
        )}
      </Button>
      <p className="mt-5 text-xs leading-5 text-white/60">About 2 minutes. Ask the assistant to review and save before ending; ending alone does not save unsubmitted answers.</p>
      {ended && <p className="mt-3 text-xs text-white/70">Only answers confirmed as saved by the assistant were recorded.</p>}
      {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  );
}

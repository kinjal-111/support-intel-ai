import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TicketInputProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

const EXAMPLE_TICKET = `Hi Support,

I've been a paying customer for 2 years now and I'm extremely frustrated. My dashboard has been broken for the third time this month — it keeps showing a 500 error whenever I try to export reports.

I've already contacted support twice about this and nothing has been fixed. At this point, I'm seriously considering switching to a competitor. This is unacceptable for the price we're paying.

I need this resolved ASAP or I'll need to request a full refund for this quarter.

— Sarah M., Enterprise Plan`;

const TicketInput = ({ onAnalyze, isLoading }: TicketInputProps) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) onAnalyze(text.trim());
  };

  return (
    <div className="flex h-full flex-col rounded-lg border bg-card">
      <div className="border-b px-5 py-4">
        <h2 className="text-sm font-semibold text-foreground">Ticket Input</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Paste a customer support ticket to analyze
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the customer support ticket here..."
          className="flex-1 resize-none rounded-md border bg-surface p-4 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
          rows={12}
        />
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setText(EXAMPLE_TICKET)}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Load example ticket
          </button>
          <Button
            onClick={handleSubmit}
            disabled={!text.trim() || isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Analyze Ticket
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketInput;

import { useState } from "react";
import { Sparkles } from "lucide-react";
import KPIBar from "@/components/KPIBar";
import TicketInput from "@/components/TicketInput";
import InsightsPanel from "@/components/InsightsPanel";
import { analyzeTicket, type TicketAnalysis } from "@/lib/analyzeTicket";

const Index = () => {
  const [analysis, setAnalysis] = useState<TicketAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = (text: string) => {
    setIsLoading(true);
    // Simulate AI processing delay
    setTimeout(() => {
      const result = analyzeTicket(text);
      setAnalysis(result);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground leading-none">
                Support Intelligence Copilot
              </h1>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                AI-powered ticket triage & escalation prediction
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-risk-low animate-pulse" />
            <span className="text-xs font-medium text-primary">System Online</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-6 space-y-6">
        <KPIBar />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ minHeight: "calc(100vh - 220px)" }}>
          <TicketInput onAnalyze={handleAnalyze} isLoading={isLoading} />
          <div className={analysis ? "animate-fade-in" : ""}>
            <InsightsPanel analysis={analysis} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

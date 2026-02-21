import { AlertTriangle, CheckCircle2, Clock, Copy, FileText, Lightbulb, Shield, Tag } from "lucide-react";
import type { TicketAnalysis, RiskLevel } from "@/lib/analyzeTicket";
import { useState } from "react";

interface InsightsPanelProps {
  analysis: TicketAnalysis | null;
}

const riskConfig: Record<RiskLevel, { bg: string; text: string; border: string }> = {
  Low: { bg: "bg-risk-low-bg", text: "text-risk-low-foreground", border: "border-risk-low/20" },
  Medium: { bg: "bg-risk-medium-bg", text: "text-risk-medium-foreground", border: "border-risk-medium/20" },
  High: { bg: "bg-risk-high-bg", text: "text-risk-high-foreground", border: "border-risk-high/20" },
};

const InsightsPanel = ({ analysis }: InsightsPanelProps) => {
  const [copied, setCopied] = useState(false);

  if (!analysis) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-lg border bg-card p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-foreground">No analysis yet</h3>
        <p className="mt-1 max-w-[240px] text-xs text-muted-foreground">
          Paste a support ticket and click "Analyze Ticket" to generate AI insights
        </p>
      </div>
    );
  }

  const risk = riskConfig[analysis.riskLevel];

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis.draftedResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-col rounded-lg border bg-card overflow-hidden">
      <div className="border-b px-5 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">AI Insights</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Powered by intelligent ticket analysis</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>~{analysis.timeSaved} min saved</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Classification + Risk Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
              <Tag className="h-3.5 w-3.5" />
              Issue Type
            </div>
            <p className="text-lg font-semibold text-foreground">{analysis.issueType}</p>
          </div>
          <div className={`rounded-lg border p-4 ${risk.bg} ${risk.border}`}>
            <div className={`flex items-center gap-2 text-xs font-medium ${risk.text} mb-2`}>
              <Shield className="h-3.5 w-3.5" />
              Escalation Risk
            </div>
            <div className="flex items-baseline gap-2">
              <p className={`text-lg font-semibold ${risk.text}`}>{analysis.riskLevel}</p>
              <span className={`text-xs font-medium ${risk.text} opacity-70`}>
                {analysis.confidence}% confidence
              </span>
            </div>
          </div>
        </div>

        {/* Churn Signals */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-3">
            <AlertTriangle className="h-3.5 w-3.5" />
            Churn Risk Signals
          </div>
          {analysis.churnSignals.length > 0 ? (
            <ul className="space-y-2">
              {analysis.churnSignals.map((signal, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-risk-high" />
                  {signal}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center gap-2 text-sm text-risk-low-foreground">
              <CheckCircle2 className="h-4 w-4 text-risk-low" />
              No immediate churn signals detected.
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-3">
            <Lightbulb className="h-3.5 w-3.5" />
            Recommended Next Steps
          </div>
          <ol className="space-y-2">
            {analysis.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                {rec}
              </li>
            ))}
          </ol>
        </div>

        {/* Drafted Response */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              AI-Drafted Response
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Copy className="h-3 w-3" />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="rounded-md bg-surface p-4 text-sm leading-relaxed text-foreground whitespace-pre-line">
            {analysis.draftedResponse}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;

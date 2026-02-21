export type RiskLevel = "Low" | "Medium" | "High";
export type IssueType = "Billing" | "Technical" | "Feature Request" | "Account" | "Other";

export interface TicketAnalysis {
  issueType: IssueType;
  riskLevel: RiskLevel;
  confidence: number;
  churnSignals: string[];
  recommendations: string[];
  draftedResponse: string;
  timeSaved: number;
}

const CHURN_KEYWORDS = [
  "cancel", "cancellation", "refund", "switching", "competitor",
  "unsubscribe", "leaving", "terrible", "worst", "frustrated",
  "disappointed", "unacceptable", "waste of money", "not worth",
  "looking for alternatives", "delete my account"
];

const URGENCY_KEYWORDS = [
  "urgent", "asap", "immediately", "critical", "emergency",
  "broken", "down", "outage", "cannot access", "blocked"
];

function detectIssueType(text: string): IssueType {
  const lower = text.toLowerCase();
  if (/billing|invoice|charge|payment|refund|subscription|pricing|plan/.test(lower)) return "Billing";
  if (/bug|error|crash|broken|not working|slow|issue|outage|api|integration/.test(lower)) return "Technical";
  if (/feature|request|suggestion|would be nice|wish|roadmap|add support/.test(lower)) return "Feature Request";
  if (/account|login|password|access|permission|role|profile|settings/.test(lower)) return "Account";
  return "Other";
}

function detectChurnSignals(text: string): string[] {
  const lower = text.toLowerCase();
  const signals: string[] = [];
  if (CHURN_KEYWORDS.some(k => lower.includes(k))) {
    if (/cancel|cancellation/.test(lower)) signals.push("Cancellation intent detected");
    if (/refund/.test(lower)) signals.push("Refund request mentioned");
    if (/competitor|switching|alternative/.test(lower)) signals.push("Competitor comparison or switching intent");
    if (/frustrated|disappointed|terrible|worst|unacceptable/.test(lower)) signals.push("Strong negative sentiment expressed");
    if (/waste of money|not worth/.test(lower)) signals.push("Value perception concern");
    if (/delete my account/.test(lower)) signals.push("Account deletion request");
  }
  return signals;
}

function calculateRisk(text: string, churnSignals: string[]): { level: RiskLevel; confidence: number } {
  const lower = text.toLowerCase();
  let score = 0;

  score += churnSignals.length * 20;
  score += URGENCY_KEYWORDS.filter(k => lower.includes(k)).length * 10;
  if (lower.length > 500) score += 5;
  if (/!!!|multiple times|again and again|still not/.test(lower)) score += 15;

  const confidence = Math.min(95, Math.max(62, 70 + Math.floor(Math.random() * 18)));

  if (score >= 40) return { level: "High", confidence };
  if (score >= 15) return { level: "Medium", confidence };
  return { level: "Low", confidence };
}

function generateRecommendations(issueType: IssueType, riskLevel: RiskLevel, churnSignals: string[]): string[] {
  const recs: string[] = [];

  if (riskLevel === "High") {
    recs.push("Escalate to senior support or account manager within 1 hour");
  }

  switch (issueType) {
    case "Billing":
      recs.push("Review customer's billing history and recent transactions");
      recs.push("Prepare a goodwill credit or discount offer if appropriate");
      recs.push("Confirm subscription status and next billing date");
      break;
    case "Technical":
      recs.push("Check system status dashboard for related incidents");
      recs.push("Request detailed reproduction steps and environment info");
      recs.push("Create an internal engineering ticket if not already tracked");
      break;
    case "Feature Request":
      recs.push("Log the request in the product feedback system");
      recs.push("Share relevant roadmap items if they address the request");
      recs.push("Offer a workaround or alternative workflow if available");
      break;
    case "Account":
      recs.push("Verify the customer's identity through standard security checks");
      recs.push("Review recent account activity for anomalies");
      recs.push("Provide step-by-step guidance for the account action requested");
      break;
    default:
      recs.push("Categorize and route to the appropriate specialist team");
      recs.push("Acknowledge receipt and set expectations for response time");
      recs.push("Check for similar recent tickets from this customer");
  }

  if (churnSignals.length > 0 && riskLevel !== "High") {
    recs.push("Consider proactive outreach from the customer success team");
  }

  return recs.slice(0, 3);
}

function generateDraftResponse(issueType: IssueType, riskLevel: RiskLevel): string {
  const greeting = "Hi there,\n\nThank you for reaching out to us.";
  const closing = "\n\nPlease don't hesitate to reach out if you need anything else. We're here to help.\n\nBest regards,\nSupport Team";

  const bodies: Record<IssueType, string> = {
    Billing: " I understand your concern regarding the billing matter. I've reviewed your account and want to ensure we resolve this promptly.\n\nI'm looking into the specifics of your billing inquiry now and will provide a detailed update shortly. If any adjustments are needed, I'll make sure they're handled right away.",
    Technical: " I'm sorry to hear you're experiencing this technical issue. I understand how important it is for everything to work smoothly.\n\nI've flagged this for our engineering team to investigate. In the meantime, could you share any error messages or screenshots? This will help us diagnose and resolve the issue faster.",
    "Feature Request": " Thank you for sharing this suggestion — feedback like yours helps us build a better product.\n\nI've logged your request with our product team for consideration. While I can't guarantee a specific timeline, your input is valued and will be reviewed during our next planning cycle.",
    Account: " I understand you need help with your account. Let me assist you with that right away.\n\nFor security purposes, I may need to verify some details. Once confirmed, I'll walk you through the steps to resolve your account request.",
    Other: " Thank you for contacting us. I've reviewed your message and want to make sure we address your needs properly.\n\nI'm routing your request to the most appropriate team member who can provide you with the best assistance.",
  };

  let body = bodies[issueType];
  if (riskLevel === "High") {
    body += "\n\nI want to assure you that your satisfaction is our top priority, and I'm personally ensuring this receives immediate attention.";
  }

  return greeting + body + closing;
}

export function analyzeTicket(text: string): TicketAnalysis {
  const issueType = detectIssueType(text);
  const churnSignals = detectChurnSignals(text);
  const { level: riskLevel, confidence } = calculateRisk(text, churnSignals);
  const recommendations = generateRecommendations(issueType, riskLevel, churnSignals);
  const draftedResponse = generateDraftResponse(issueType, riskLevel);
  const timeSaved = Math.floor(Math.random() * 4) + 4; // 4-7 minutes

  return {
    issueType,
    riskLevel,
    confidence,
    churnSignals,
    recommendations,
    draftedResponse,
    timeSaved,
  };
}

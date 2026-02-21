import { Clock, Target, TrendingUp } from "lucide-react";

const kpis = [
  {
    label: "Avg Triage Time Reduced",
    value: "68%",
    icon: Clock,
    detail: "vs. manual process",
  },
  {
    label: "Escalation Prediction Accuracy",
    value: "94.2%",
    icon: Target,
    detail: "last 30 days",
  },
  {
    label: "Projected CSAT Impact",
    value: "+12pts",
    icon: TrendingUp,
    detail: "quarter estimate",
  },
];

const KPIBar = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="flex items-center gap-3 rounded-lg border bg-card p-4"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <kpi.icon className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-semibold tracking-tight text-foreground">
              {kpi.value}
            </p>
            <p className="text-xs font-medium text-muted-foreground truncate">
              {kpi.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPIBar;

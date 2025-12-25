import { AuditStep } from "../models/Output";

export class DecisionEngine {
  decide(confidence: number, audit: AuditStep[]) {
    let requiresHumanReview = true;

    if (confidence >= 0.85) {
      requiresHumanReview = false;
    }

    audit.push({
      step: "decide",
      timestamp: new Date().toISOString(),
      details: requiresHumanReview
        ? "Confidence insufficient, human review required"
        : "Auto-accepted due to high confidence"
    });

    return requiresHumanReview;
  }
}

export const CONFIDENCE_THRESHOLDS = {
  AUTO_APPLY: 0.85,
  SUGGEST_ONLY: 0.7,
  MINIMUM: 0.5
};

/**
 * Reinforce confidence after human approval
 */
export function reinforceConfidence(
  current: number,
  delta = 0.1
): number {
  return Math.min(1.0, round(current + delta));
}

/**
 * Penalize confidence after rejection or bad learning
 */
export function penalizeConfidence(
  current: number,
  delta = 0.15
): number {
  return Math.max(0.0, round(current - delta));
}

/**
 * Decay confidence slightly on every run
 * Prevents stale or wrong memory dominance
 */
export function decayConfidence(
  current: number,
  decayRate = 0.98
): number {
  return round(current * decayRate);
}

/**
 * Decide whether memory can be applied
 */
export function canAutoApply(confidence: number): boolean {
  return confidence >= CONFIDENCE_THRESHOLDS.AUTO_APPLY;
}

export function canSuggest(confidence: number): boolean {
  return confidence >= CONFIDENCE_THRESHOLDS.SUGGEST_ONLY;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

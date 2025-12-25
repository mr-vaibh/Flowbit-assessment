import { MemoryRecord } from "../models/Memory";
import { AuditStep } from "../models/Output";

export class ApplyEngine {
  apply(invoice: any, memories: MemoryRecord[], audit: AuditStep[]) {
    const corrections: string[] = [];
    let confidence = 0;

    for (const mem of memories) {
      if (mem.confidence >= 0.7) {
        if (mem.action === "serviceDate" && !invoice.serviceDate) {
          invoice.serviceDate = "INFERRED_FROM_VENDOR";
          corrections.push(`Filled serviceDate using ${mem.pattern}`);
          confidence += mem.confidence;
          audit.push({
            step: "apply",
            timestamp: new Date().toISOString(),
            details: `Applied ${mem.pattern} → serviceDate`
          });
        }
      }
    }

    return { invoice, corrections, confidence };
  }
}

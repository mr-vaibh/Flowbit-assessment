import { MemoryStore } from "./MemoryStore";
import { AuditStep } from "../models/Output";

export class RecallEngine {
  constructor(private store: MemoryStore) {}

  recall(vendor: string, rawText: string, audit: AuditStep[]) {
    const memories = this.store.getRelevant(vendor, rawText);
    audit.push({
      step: "recall",
      timestamp: new Date().toISOString(),
      details: `Recalled ${memories.length} memory records`
    });
    return memories;
  }
}

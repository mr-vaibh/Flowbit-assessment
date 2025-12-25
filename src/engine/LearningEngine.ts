import { MemoryStore } from "./MemoryStore";
import { v4 as uuid } from "uuid";
import { AuditStep } from "../models/Output";

export class LearningEngine {
  constructor(private store: MemoryStore) {}

  learn(vendor: string, pattern: string, action: string, audit: AuditStep[]) {
    const memory = {
      id: uuid(),
      type: "VENDOR" as const,
      vendor,
      pattern,
      action,
      confidence: 0.6,
      usageCount: 1,
      lastUsedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    this.store.save(memory);

    audit.push({
      step: "learn",
      timestamp: new Date().toISOString(),
      details: `Stored new vendor memory: ${pattern} → ${action}`
    });

    return memory;
  }
}

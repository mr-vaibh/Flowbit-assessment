export interface MemoryRecord {
  id: string;
  type: "VENDOR" | "CORRECTION" | "RESOLUTION";
  vendor?: string;
  pattern: string;              // e.g. "Leistungsdatum"
  action: string;               // e.g. "map_to_serviceDate"
  confidence: number;           // 0.0 → 1.0
  usageCount: number;
  lastUsedAt: string;
  createdAt: string;
}

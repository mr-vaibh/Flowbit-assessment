import Database from "better-sqlite3";
import { MemoryRecord } from "../models/Memory";

export class MemoryStore {
    private db: Database.Database;

    constructor() {
        this.db = new Database("memory.db");
        this.init();
    }

    private init() {
        this.db.prepare(`
      CREATE TABLE IF NOT EXISTS memory (
        id TEXT PRIMARY KEY,
        type TEXT,
        vendor TEXT,
        pattern TEXT,
        action TEXT,
        confidence REAL,
        usageCount INTEGER,
        lastUsedAt TEXT,
        createdAt TEXT
      )
    `).run();
    }

    getRelevant(vendor: string, rawText: string): MemoryRecord[] {
        const rows = this.db
            .prepare(`
      SELECT * FROM memory
      WHERE (vendor = ? OR vendor IS NULL)
    `)
            .all(vendor) as MemoryRecord[];

        return rows.filter(m =>
            rawText.includes(m.pattern)
        );
    }


    save(memory: MemoryRecord) {
        this.db.prepare(`
      INSERT OR REPLACE INTO memory
      VALUES (@id, @type, @vendor, @pattern, @action,
              @confidence, @usageCount, @lastUsedAt, @createdAt)
    `).run(memory);
    }

    reinforce(id: string, delta: number) {
        this.db.prepare(`
      UPDATE memory
      SET confidence = MIN(1.0, confidence + ?),
          usageCount = usageCount + 1,
          lastUsedAt = ?
      WHERE id = ?
    `).run(delta, new Date().toISOString(), id);
    }
}

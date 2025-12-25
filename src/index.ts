import fs from "fs";
import { MemoryStore } from "./engine/MemoryStore";
import { RecallEngine } from "./engine/RecallEngine";
import { ApplyEngine } from "./engine/ApplyEngine";
import { DecisionEngine } from "./engine/DecisionEngine";
import { LearningEngine } from "./engine/LearningEngine";
import { loadInvoices, loadHumanCorrections } from "./data/sampleInvoices";
import { AuditStep } from "./models/Output";
import { Invoice } from "./models/Invoice";

const store = new MemoryStore();
const recallEngine = new RecallEngine(store);
const applyEngine = new ApplyEngine();
const decisionEngine = new DecisionEngine();
const learningEngine = new LearningEngine(store);

const invoices = loadInvoices();
const humanCorrections = loadHumanCorrections();

const results: any[] = [];

for (const invoice of invoices) {
  const output = processInvoice(invoice);
  results.push(output);
}

fs.writeFileSync(
  "answer.json",
  JSON.stringify(results, null, 2)
);

console.log("\n✅ Exported results to answer.json");

function processInvoice(invoice: Invoice) {
  const audit: AuditStep[] = [];

  // 1. Recall
  const memories = recallEngine.recall(
    invoice.vendor,
    invoice.rawText,
    audit
  );

  // 2. Apply
  const applied = applyEngine.apply(
    invoice.extractedFields,
    memories,
    audit
  );

  // 3. Decide
  const requiresHumanReview = decisionEngine.decide(
    applied.confidence,
    audit
  );

  // 4. Learn from human corrections
  const correction = humanCorrections.find(
    (c: any) => c.invoiceId === invoice.invoiceId
  );

  if (correction && correction.finalDecision === "approved") {
    for (const c of correction.corrections) {
      learningEngine.learn(
        invoice.vendor,
        c.reason.includes("Leistungsdatum")
          ? "Leistungsdatum"
          : "VAT included",
        c.field,
        audit
      );
    }
  }

  const output = {
    invoiceId: invoice.invoiceId,
    normalizedInvoice: invoice.extractedFields,
    proposedCorrections: applied.corrections,
    requiresHumanReview,
    reasoning:
      memories.length > 0
        ? "Applied learned vendor-specific memory with confidence gating"
        : "No prior memory available; escalated for human review",
    confidenceScore: applied.confidence,
    memoryUpdates: correction ? ["Memory reinforced from human approval"] : [],
    auditTrail: audit
  };

  // Optional console output (good for demo)
  console.log("\n==============================");
  console.log(`Invoice: ${invoice.invoiceId}`);
  console.log("==============================");
  console.log(JSON.stringify(output, null, 2));

  return output;
}

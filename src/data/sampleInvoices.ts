import fs from "fs";
import path from "path";
import { Invoice } from "../models/Invoice";

const DATA_DIR = path.resolve("src/data");

export function loadInvoices(): Invoice[] {
  const raw = fs.readFileSync(
    path.join(DATA_DIR, "invoices_extracted.json"),
    "utf-8"
  );

  const parsed = JSON.parse(raw);

  return parsed.map((inv: any) => ({
    invoiceId: inv.invoiceId,
    vendor: inv.vendor,
    invoiceNumber: inv.fields.invoiceNumber,
    extractedFields: {
      serviceDate: inv.fields.serviceDate ?? undefined,
      quantity: inv.fields.lineItems?.[0]?.qty,
      currency: inv.fields.currency,
      vatIncluded: detectVatIncluded(inv.rawText),
      description: inv.fields.lineItems?.[0]?.description
    },
    rawText: inv.rawText,
    poCandidates: inv.fields.poNumber ? [inv.fields.poNumber] : []
  }));
}

export function loadHumanCorrections() {
  const raw = fs.readFileSync(
    path.join(DATA_DIR, "human_corrections.json"),
    "utf-8"
  );
  return JSON.parse(raw);
}

export function loadReferenceData() {
  const raw = fs.readFileSync(
    path.join(DATA_DIR, "reference_data.json"),
    "utf-8"
  );
  return JSON.parse(raw);
}

function detectVatIncluded(rawText: string): boolean {
  const keywords = [
    "VAT already included",
    "Prices incl. VAT",
    "MwSt. inkl"
  ];
  return keywords.some(k => rawText.includes(k));
}

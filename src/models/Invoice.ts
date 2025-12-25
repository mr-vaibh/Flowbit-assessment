export interface Invoice {
  invoiceId: string;
  vendor: string;
  invoiceNumber: string;
  extractedFields: {
    serviceDate?: string;
    quantity?: number;
    currency?: string;
    vatIncluded?: boolean;
    description?: string;
  };
  rawText: string;
  poCandidates?: string[];
}

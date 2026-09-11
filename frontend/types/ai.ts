export type CertaintyLevel = "KNOWN" | "INFERRED" | "MISSING" | "RECOMMENDED" | "CONFIRMED";
export type ConfidenceTier = "HIGH" | "MEDIUM" | "LOW";

export interface AIAnalysis {
  id: string;
  complaint_id: string;
  detected_language: string;
  extracted_issue: string;
  extracted_location?: string | null;
  extracted_duration?: string | null;
  recommended_department: string;
  recommended_priority: "P0" | "P1" | "P2" | "P3";
  actionability_score: number;
  confidence_score: number;
  confidence_level: ConfidenceTier;
  missing_fields: string[];
  recommended_actions: string[];
  citizen_response_draft: string;
}

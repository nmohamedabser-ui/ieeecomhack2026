
export enum PersonaType {
  EXECUTIVE = 'Executive (CEO/COO)',
  BOARD = 'Board Member',
  PRODUCT_MANAGER = 'Product Manager',
  TECHNICAL_LEAD = 'Technical Lead'
}

export interface AIPipelineResult {
  executiveSummary: string;
  complexityScore: number;
  readabilityScore: number;
  communicationGapScore: number;
  risks: string[];
  keyTakeaways: string[];
  suggestedActionItems: string[];
}

export interface SummaryReport extends AIPipelineResult {
  id: string;
  userId: string;
  projectName: string;
  originalText: string;
  persona: PersonaType;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Developer' | 'Manager' | 'Executive';
}

export enum View {
  DASHBOARD = 'dashboard',
  NEW_SUMMARY = 'new_summary',
  HISTORY = 'history',
  DETAIL = 'detail'
}

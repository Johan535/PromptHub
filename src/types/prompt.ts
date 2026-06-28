export type ToolName =
  | "Cursor"
  | "Claude Code"
  | "Codex"
  | "Windsurf"
  | "Trae";

export type PromptVariableType = "INPUT" | "TEXTAREA" | "SELECT";

export interface PromptVariable {
  id: string;
  varKey: string;
  varLabel: string;
  varType: PromptVariableType;
  defaultValue?: string | null;
  options?: string[];
  isRequired: boolean;
  sortOrder: number;
}

export interface PromptAuthor {
  id: string;
  username: string;
}

export interface PromptCategory {
  id: string;
  name: string;
  slug: string;
}

export interface PromptTag {
  id: string;
  name: string;
}

export interface PromptItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  visibility: "PUBLIC" | "PRIVATE";
  status: "DRAFT" | "PUBLISHED" | "OFFLINE";
  toolSupport: ToolName[];
  favoriteCount: number;
  useCount: number;
  createdAt: string;
  updatedAt: string;
  author: PromptAuthor;
  category: PromptCategory;
  tags: PromptTag[];
  variables: PromptVariable[];
}

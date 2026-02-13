/**
 * Process Options - options for processScript
 */
export interface ProcessOptions {
  profile?: string;
  section?: string;
  tags?: string[];
}

/**
 * Profile Info - profile metadata with beat counts
 */
export interface ProfileInfo {
  name: string;
  displayName?: string;
  description?: string;
  beatCount: number;
  skippedCount: number;
}

/**
 * Filter Options - section/tags filtering (subset of ProcessOptions)
 */
export interface FilterOptions {
  section?: string;
  tags?: string[];
}

/**
 * System Prompt Options - common options for building system prompts
 */
export interface SystemPromptOptions {
  systemPrompt?: string;
  lang?: string;
}

/**
 * Conversation message for interactive query
 */
export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

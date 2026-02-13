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

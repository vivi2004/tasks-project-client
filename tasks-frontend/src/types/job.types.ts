export type JobType = 'ai-extract-text' | 'ai-summarize' | 'ocr-only';

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

export type JobTimelineEntry = {
  event: string;
  message?: string;
  progress?: number;
  timestamp: string;
};

export type Job = {
  _id: string;
  user: string;
  type: JobType;
  fileUrl: string;
  processedUrl?: string;
  extractedText?: string;
  ocrTextRaw?: string;
  summary?: string;
  cancelRequested?: boolean;
  timeline?: JobTimelineEntry[];
  status: JobStatus;
  bullJobId?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;

  // Backend adds these on some endpoints
  timelineFormatted?: string[];
  progress?: number;
};

export type PaginatedJobsResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Job[];
};

export type JobProgressResponse = {
  jobId: string;
  status: JobStatus;
  progress: number;
  etaSeconds: number | null;
  timelineFormatted: JobTimelineEntry[];
};

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type TaskAttachment = {
  url: string;
  public_id?: string;
  publicId?: string;
  format?: string;
  bytes?: number;
};

export type Task = {
  _id: string;
  project: string;
  title: string;
  status: TaskStatus;
  dueDate?: string;
  deleteAt?: string | null;
  attachments?: TaskAttachment[];
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskInput = {
  title: string;
  status?: TaskStatus;
  dueDate?: string;
};

export type UpdateTaskInput = Partial<CreateTaskInput>;

export type PaginatedTasksResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Task[];
};

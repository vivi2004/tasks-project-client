export type ProjectStatus = "active" | "on-hold" | "completed";

export type Project = {
  _id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
};

export type ProjectInput = {
  name: string;
  description?: string;
  status: ProjectStatus;
};
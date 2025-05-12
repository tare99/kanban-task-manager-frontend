export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MED" | "HIGH";

export interface TaskRequest {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  version: number;
}

export interface TaskDoc extends TaskRequest {
  id: number;
  _links: LinkDoc;
}

export interface LinkType {
  href: string;
  type?: string;
}

export interface LinkDoc {
  self: LinkType;
  create?: LinkType;
  update?: LinkType;
  patch?: LinkType;
  delete?: LinkType;
}

export interface ApiPaginatedResponse {
  _embedded: {
    taskList: TaskDoc[];
  };
  _links: {
    self: LinkType;
    first?: LinkType;
    prev?: LinkType;
    next?: LinkType;
    last?: LinkType;
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface ErrorResponse {
  message: string;
}

export interface BadRequestResponse {
  message: string;
  errors: Record<string, string>;
}

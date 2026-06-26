export type BusinessStatus = "active" | "archived" | "suspended";

export interface Business {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  industryId: string;
  countryId: string;
  stateId: string | null;
  lgaId: string | null;
  status: BusinessStatus;
  employeeCount: number | null;
  website: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusinessInput {
  name: string;
  description?: string;
  industryId: string;
  countryId: string;
  stateId?: string;
  lgaId?: string;
  employeeCount?: number;
  website?: string;
}

export interface UpdateBusinessInput extends Partial<CreateBusinessInput> {
  status?: BusinessStatus;
}

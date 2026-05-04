export interface IQuery {
  search?: string;
  category?: string;
  location?: string;
  job_type?: string;
  salaryRange?: [number, number];
  page?: number;
}

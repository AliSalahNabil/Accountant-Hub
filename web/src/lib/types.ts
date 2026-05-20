export type ApiUser = {
  id: number;
  name: string;
  email: string;
  headline: string | null;
  bio: string | null;
  skills: string[];
  years_of_experience: number;
  created_at: string;
};

export type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  jobs_count?: number;
};

export type ApiJob = {
  id: number;
  slug: string;
  title: string;
  company: {
    name: string;
    logo: string | null;
    location: string | null;
  };
  short_description: string;
  description?: string;
  required_skills: string[];
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  delivery_days: number;
  deadline: string;
  attachments: Array<{ name: string; url: string }>;
  status: "open" | "closed";
  is_open: boolean;
  category: ApiCategory;
  bids_count: number;
  has_my_bid?: boolean;
  posted_at: string;
  posted_human: string;
};

export type ApiBid = {
  id: number;
  job_id: number;
  user_id: number;
  proposed_price: number;
  delivery_days: number;
  cover_letter: string;
  experience_summary: string | null;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  submitted_at: string;
  submitted_human: string;
  job?: ApiJob;
  user?: ApiUser;
};

export type Paginated<T> = {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
};

export type DashboardStats = {
  total_bids: number;
  pending_bids: number;
  accepted_bids: number;
  rejected_bids: number;
  withdrawn_bids: number;
};

export type JobFilters = {
  search?: string;
  category?: string;
  budget_min?: number;
  budget_max?: number;
  status?: "open" | "closed" | "all";
  sort?: "newest" | "oldest" | "budget_high" | "budget_low" | "deadline";
  per_page?: number;
  page?: number;
};

export interface Professor {
  creator_id: string;
  creator_name: string;
  creator_college: string;
  total_tests: number;
  latest_test: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  created_at: string;
}
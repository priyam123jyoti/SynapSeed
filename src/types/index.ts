export interface Test {
  id: string;
  title: string;
  description?: string;
  status: 'DRAFT' | 'PUBLISHED';
  created_at: string;
}

export interface Question {
  id: string;
  test_id: string;
  type: 'MCQ' | 'MSQ' | 'FITB';
  question_text: string;
  options: string[] | null;
  correct_answers: string[];
}

export interface Submission {
  id: string;
  test_id: string;
  student_id: string | null;
  student_name: string;
  student_answers: Record<string, string[]>;
  score: number;
  total_questions: number;
  submitted_at: string;
}
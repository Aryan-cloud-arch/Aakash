export interface Subject {
  id: string;
  name: string;
  syllabus: string;
  color: string;
}

export interface Question {
  id: string;
  number: number;
  text: string;
  options: string[];
  subject: string; // Dynamic subject name
}

export interface PaperData {
  date: string;
  code: string;
  testName: string;
  maxMarks: string;
  time: string;
  subjects: Subject[];
  instructions: string[];
  questions: Question[];
  pageNumber: number;
}

export interface Question {
  id: string;
  number: number;
  text: string;
  options: string[];
}

export interface PaperData {
  date: string;
  code: string;
  testName: string;
  maxMarks: string;
  time: string;
  physicsSyllabus: string;
  chemistrySyllabus: string;
  biologySyllabus: string;
  instructions: string[];
  questions: Question[];
  pageNumber: number;
}

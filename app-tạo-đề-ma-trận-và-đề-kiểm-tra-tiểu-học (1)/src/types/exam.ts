export type GradeLevel = 1 | 2 | 3 | 4 | 5;

export type SubjectName =
  | 'Toán'
  | 'Tiếng Việt'
  | 'Lịch sử và Địa lí'
  | 'Khoa học'
  | 'Công nghệ'
  | 'Tin học'
  | 'Đạo đức'
  | 'Tự nhiên và Xã hội';

export type TermName =
  | 'Giữa Học kì I'
  | 'Cuối Học kì I'
  | 'Giữa Học kì II'
  | 'Cuối Năm học';

export type CognitiveLevel = 'Mức 1' | 'Mức 2' | 'Mức 3';
export type QuestionType = 'multiple_choice' | 'essay';

export interface SchoolHeader {
  agency: string; // UBND XÃ XÍN MẦN
  schoolName: string; // TRƯỜNG PTDTBT TH CHÍ CÀ
  examTitle: string; // ĐỀ KIỂM TRA ĐỊNH KÌ GIỮA HỌC KÌ I
  schoolYear: string; // NĂM HỌC 2026 - 2027
  subject: SubjectName;
  grade: GradeLevel;
  durationMinutes: number;
  classGroup?: string;
  teacherName?: string;
}

export interface LessonItem {
  id: string;
  name: string;
  weeks: string;
  periods: number;
  strand: string;
  keyKnowledge: string;
}

export interface LessonUnit {
  topic: string;
  lessons: LessonItem[];
}

export interface KnowledgeStrand {
  strandName: string;
  weightPercent: number; // e.g. 70% or 30%
  allocatedPeriods?: number;
  levels: {
    level1: string[]; // Nhận biết
    level2: string[]; // Kết nối / Thông hiểu
    level3: string[]; // Vận dụng
  };
}

export interface MatrixRow {
  id: string;
  strand: string;
  topic?: string;
  // Mức 1
  m1_tn_count: number;
  m1_tn_pts: number;
  m1_tl_count: number;
  m1_tl_pts: number;
  // Mức 2
  m2_tn_count: number;
  m2_tn_pts: number;
  m2_tl_count: number;
  m2_tl_pts: number;
  // Mức 3
  m3_tn_count: number;
  m3_tn_pts: number;
  m3_tl_count: number;
  m3_tl_pts: number;
  // Row summary
  total_count: number;
  total_pts: number;
}

export interface MatrixSummary {
  tn_total_pts: number;
  tn_percent: number;
  tl_total_pts: number;
  tl_percent: number;
  m1_pts: number;
  m1_percent: number;
  m2_pts: number;
  m2_percent: number;
  m3_pts: number;
  m3_percent: number;
  total_pts: number;
  total_questions: number;
}

export interface SpecificationItem {
  id: string;
  order: number;
  strand: string;
  content: string;
  standard: string;
  questionType: 'Trắc nghiệm' | 'Tự luận';
  level: CognitiveLevel;
  questionNumber: string; // e.g., "Câu 1"
  points: number;
}

export interface GridShape {
  gridSize: number; // e.g. 8x8
  shapeType: 'rectangle' | 'square' | 'triangle' | 'polygon' | 'grid_count';
  coordinates: { x: number; y: number }[];
  label?: string;
  fillColor?: string;
  unit?: string; // cm or ô vuông
}

export interface QuestionItem {
  id: string;
  number: number;
  type: QuestionType;
  level: CognitiveLevel;
  strand: string;
  questionText: string;
  options?: string[]; // A, B, C, D
  correctAnswer?: string; // e.g., 'A', 'B', 'C', 'D'
  points: number; // Sửa điểm trực tiếp
  rubric: string; // Barem hướng dẫn chấm chi tiết
  gridShape?: GridShape | null;
}

export interface ReadingPassage {
  title: string;
  author: string;
  content: string;
  wordCount?: number;
  genre?: 'Truyện' | 'Kịch' | 'Thơ' | 'Miêu tả' | 'Văn bản thông tin';
}

export interface WritingCriterion {
  name: string;
  points: number;
  desc: string;
}

export interface WritingSection {
  prompt: string;
  points: number;
  criteria: WritingCriterion[];
}

export interface OralReadingSection {
  prompt: string;
  points: number;
  passages: string[];
}

export interface ExamPackage {
  header: SchoolHeader;
  readingPassage?: ReadingPassage | null;
  questions: QuestionItem[];
  writingSection?: WritingSection | null;
  oralReadingSection?: OralReadingSection | null;
  matrixRows: MatrixRow[];
  matrixSummary: MatrixSummary;
  specifications: SpecificationItem[];
  knowledgeStrands: KnowledgeStrand[];
  lessons: LessonUnit[];
}

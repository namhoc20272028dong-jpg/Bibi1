import {
  GradeLevel,
  SubjectName,
  TermName,
  LessonUnit,
  KnowledgeStrand,
  MatrixRow,
  SpecificationItem,
  QuestionItem,
  ExamPackage,
  SchoolHeader,
} from '../types/exam';
import {
  DEFAULT_LESSONS,
  DEFAULT_KNOWLEDGE_STRANDS,
  DEFAULT_MATH_MATRIX_ROWS,
  DEFAULT_SPECIFICATIONS,
  DEFAULT_MATH_QUESTIONS,
  DEFAULT_VIETNAMESE_EXAM,
  getStandardCurriculumRatio,
} from '../data/curriculumData';

export interface AISuggestionResponse<T> {
  success: boolean;
  data: T;
  source: 'ai' | 'curriculum_bank';
  message?: string;
}

// Check AI status
export async function checkAIStatus(): Promise<{ hasKey: boolean; model: string }> {
  try {
    const res = await fetch('/api/ai/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Cannot reach backend AI status:', e);
  }
  return { hasKey: false, model: 'gemini-3.8-flash' };
}

// Request AI generate or fallback
async function callAIGenerate<T>(payload: any, fallbackData: T): Promise<AISuggestionResponse<T>> {
  try {
    const res = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        return {
          success: true,
          data: result.data,
          source: 'ai',
        };
      }
    }
  } catch (error) {
    console.warn('AI request failed, using pedagogical knowledge bank:', error);
  }

  return {
    success: true,
    data: fallbackData,
    source: 'curriculum_bank',
    message: 'Đang dùng kho dữ liệu chuẩn GDPT 2018 (Kết nối tri thức)',
  };
}

// 1. AI gợi ý Danh sách bài học
export async function suggestLessons(
  grade: GradeLevel,
  subject: SubjectName,
  term: TermName
): Promise<AISuggestionResponse<LessonUnit[]>> {
  const cacheKey = `${subject}_${grade}_${term}`;
  const fallback =
    DEFAULT_LESSONS[cacheKey] ||
    DEFAULT_LESSONS[`${subject}_4_Giữa Học kì I`] ||
    DEFAULT_LESSONS['Toán_4_Giữa Học kì I'];

  const response = await callAIGenerate<{ units?: LessonUnit[] } | LessonUnit[]>(
    {
      task: 'lessons',
      grade,
      subject,
      term,
      curriculum: 'Kết nối tri thức với cuộc sống',
    },
    fallback
  );

  let units: LessonUnit[] = [];
  if (Array.isArray(response.data)) {
    units = response.data;
  } else if (response.data && response.data.units) {
    units = response.data.units;
  } else {
    units = fallback;
  }

  return {
    ...response,
    data: units,
  };
}

// 2. AI gợi ý Kiến thức & Yêu cầu cần đạt
export async function suggestKnowledge(
  grade: GradeLevel,
  subject: SubjectName,
  term: TermName
): Promise<AISuggestionResponse<KnowledgeStrand[]>> {
  const fallback = DEFAULT_KNOWLEDGE_STRANDS[subject] || DEFAULT_KNOWLEDGE_STRANDS['Toán'];
  const response = await callAIGenerate<{ strands?: KnowledgeStrand[] } | KnowledgeStrand[]>(
    {
      task: 'knowledge',
      grade,
      subject,
      term,
      curriculum: 'Kết nối tri thức với cuộc sống',
    },
    fallback
  );

  let strands: KnowledgeStrand[] = [];
  if (Array.isArray(response.data)) {
    strands = response.data;
  } else if (response.data && response.data.strands) {
    strands = response.data.strands;
  } else {
    strands = fallback;
  }

  return {
    ...response,
    data: strands,
  };
}

// 3. AI gợi ý Ma trận
export async function suggestMatrix(
  grade: GradeLevel,
  subject: SubjectName,
  term: TermName,
  ratioInfo?: any
): Promise<AISuggestionResponse<MatrixRow[]>> {
  const fallback = DEFAULT_MATH_MATRIX_ROWS;
  const standardRatio = getStandardCurriculumRatio(grade, subject, term);

  const response = await callAIGenerate<{ matrixRows?: MatrixRow[] } | MatrixRow[]>(
    {
      task: 'matrix',
      grade,
      subject,
      term,
      context: { standardRatio, ...ratioInfo },
      curriculum: 'Kết nối tri thức với cuộc sống',
    },
    fallback
  );

  let rows: MatrixRow[] = [];
  if (Array.isArray(response.data)) {
    rows = response.data;
  } else if (response.data && response.data.matrixRows) {
    rows = response.data.matrixRows;
  } else {
    rows = fallback;
  }

  return {
    ...response,
    data: rows,
  };
}

// 4. AI gợi ý Bản đặc tả
export async function suggestSpecifications(
  grade: GradeLevel,
  subject: SubjectName,
  term: TermName,
  matrixRows?: MatrixRow[]
): Promise<AISuggestionResponse<SpecificationItem[]>> {
  const fallback = DEFAULT_SPECIFICATIONS;
  const response = await callAIGenerate<{ specs?: SpecificationItem[] } | SpecificationItem[]>(
    {
      task: 'specification',
      grade,
      subject,
      term,
      context: { matrixRows },
      curriculum: 'Kết nối tri thức với cuộc sống',
    },
    fallback
  );

  let specs: SpecificationItem[] = [];
  if (Array.isArray(response.data)) {
    specs = response.data;
  } else if (response.data && response.data.specs) {
    specs = response.data.specs;
  } else {
    specs = fallback;
  }

  return {
    ...response,
    data: specs,
  };
}

// 5. AI gợi ý Đề thi & Đáp án hoàn chỉnh
export async function suggestExamAndRubric(
  grade: GradeLevel,
  subject: SubjectName,
  term: TermName,
  header: SchoolHeader,
  customPrompt?: string
): Promise<AISuggestionResponse<Partial<ExamPackage>>> {
  const isVietnamese = subject === 'Tiếng Việt';
  const fallbackQuestions = isVietnamese ? DEFAULT_VIETNAMESE_EXAM.questions : DEFAULT_MATH_QUESTIONS;

  const fallback: Partial<ExamPackage> = {
    header,
    readingPassage: isVietnamese ? DEFAULT_VIETNAMESE_EXAM.readingPassage : null,
    questions: fallbackQuestions,
    writingSection: isVietnamese ? DEFAULT_VIETNAMESE_EXAM.writingSection : null,
    oralReadingSection: isVietnamese ? DEFAULT_VIETNAMESE_EXAM.oralReadingSection : null,
  };

  const response = await callAIGenerate<any>(
    {
      task: 'exam',
      grade,
      subject,
      term,
      customPrompt,
      context: {
        ratio: getStandardCurriculumRatio(grade, subject, term),
      },
      curriculum: 'Kết nối tri thức với cuộc sống',
    },
    fallback
  );

  const raw = response.data;
  const questions: QuestionItem[] = raw.questions || fallbackQuestions;

  return {
    ...response,
    data: {
      header: { ...header, ...(raw.schoolHeader || {}) },
      readingPassage: raw.readingPassage || fallback.readingPassage,
      questions: questions.map((q, idx) => ({
        ...q,
        id: q.id || `q_${idx + 1}`,
        number: idx + 1,
        points: typeof q.points === 'number' ? q.points : 1.0,
      })),
      writingSection: raw.writingSection || fallback.writingSection,
      oralReadingSection: raw.oralReadingSection || fallback.oralReadingSection,
    },
  };
}

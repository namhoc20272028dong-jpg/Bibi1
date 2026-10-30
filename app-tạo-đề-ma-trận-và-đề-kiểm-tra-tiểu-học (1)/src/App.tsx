/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  GradeLevel,
  SubjectName,
  TermName,
  SchoolHeader,
  LessonUnit,
  KnowledgeStrand,
  MatrixRow,
  SpecificationItem,
  QuestionItem,
  ReadingPassage,
  WritingSection,
  OralReadingSection,
  ExamPackage,
  GridShape,
} from './types/exam';
import {
  DEFAULT_LESSONS,
  DEFAULT_KNOWLEDGE_STRANDS,
  DEFAULT_MATH_MATRIX_ROWS,
  DEFAULT_SPECIFICATIONS,
  DEFAULT_MATH_QUESTIONS,
  DEFAULT_VIETNAMESE_EXAM,
  getStandardCurriculumRatio,
} from './data/curriculumData';
import {
  checkAIStatus,
  suggestLessons,
  suggestKnowledge,
  suggestMatrix,
  suggestSpecifications,
  suggestExamAndRubric,
} from './services/aiService';

import { Header } from './components/Header';
import { NavigationTabs, TabKey } from './components/NavigationTabs';
import { LessonListView } from './components/LessonListView';
import { KnowledgeView } from './components/KnowledgeView';
import { MatrixEditorView } from './components/MatrixEditorView';
import { SpecificationView } from './components/SpecificationView';
import { ExamAndRubricView } from './components/ExamAndRubricView';
import { SquareGridCanvas } from './components/SquareGridCanvas';
import { SummaryExportView } from './components/SummaryExportView';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';
import { Check, Info, Sparkles } from 'lucide-react';

export default function App() {
  // Primary parameters
  const [grade, setGrade] = useState<GradeLevel>(4);
  const [subject, setSubject] = useState<SubjectName>('Toán');
  const [term, setTerm] = useState<TermName>('Giữa Học kì I');
  const [activeTab, setActiveTab] = useState<TabKey>('lessons');

  // School Header with official administrative defaults
  const [header, setHeader] = useState<SchoolHeader>({
    agency: 'UBND XÃ XÍN MẦN',
    schoolName: 'TRƯỜNG PTDTBT TH CHÍ CÀ',
    examTitle: 'ĐỀ KIỂM TRA ĐỊNH KÌ GIỮA HỌC KÌ I',
    schoolYear: 'NĂM HỌC 2026 - 2027',
    subject: 'Toán',
    grade: 4,
    durationMinutes: 40,
    classGroup: 'Lớp 4A',
    teacherName: 'Tổ khối Tiểu học',
  });

  // Data states
  const [units, setUnits] = useState<LessonUnit[]>(() => {
    return (
      DEFAULT_LESSONS[`Toán_4_Giữa Học kì I`] ||
      DEFAULT_LESSONS['Toán_4_Giữa Học kì I']
    );
  });
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [strands, setStrands] = useState<KnowledgeStrand[]>(() => {
    return DEFAULT_KNOWLEDGE_STRANDS['Toán'];
  });
  const [matrixRows, setMatrixRows] = useState<MatrixRow[]>(DEFAULT_MATH_MATRIX_ROWS);
  const [specifications, setSpecifications] = useState<SpecificationItem[]>(DEFAULT_SPECIFICATIONS);
  const [questions, setQuestions] = useState<QuestionItem[]>(DEFAULT_MATH_QUESTIONS);
  const [readingPassage, setReadingPassage] = useState<ReadingPassage | null>(null);
  const [writingSection, setWritingSection] = useState<WritingSection | null>(null);
  const [oralReadingSection, setOralReadingSection] = useState<OralReadingSection | null>(null);

  // UI state
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [aiConnected, setAiConnected] = useState<boolean>(true);
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check AI backend status on mount
  useEffect(() => {
    checkAIStatus().then((res) => {
      if (res && res.hasKey) {
        setAiConnected(true);
      }
    });
  }, []);

  // Update header and defaults when grade/subject/term changes
  const handleGradeChange = (newGrade: GradeLevel) => {
    setGrade(newGrade);
    setHeader((prev) => ({
      ...prev,
      grade: newGrade,
      classGroup: `Lớp ${newGrade}A`,
    }));
    loadCurriculumDefaults(newGrade, subject, term);
  };

  const handleSubjectChange = (newSubject: SubjectName) => {
    setSubject(newSubject);
    setHeader((prev) => ({
      ...prev,
      subject: newSubject,
      durationMinutes: newSubject === 'Tiếng Việt' ? 60 : 40,
    }));
    loadCurriculumDefaults(grade, newSubject, term);
  };

  const handleTermChange = (newTerm: TermName) => {
    setTerm(newTerm);
    setHeader((prev) => ({
      ...prev,
      examTitle: `ĐỀ KIỂM TRA ĐỊNH KÌ ${newTerm.toUpperCase()}`,
    }));
    loadCurriculumDefaults(grade, subject, newTerm);
  };

  const loadCurriculumDefaults = (
    g: GradeLevel,
    s: SubjectName,
    t: TermName
  ) => {
    const key = `${s}_${g}_${t}`;
    const foundUnits =
      DEFAULT_LESSONS[key] ||
      DEFAULT_LESSONS[`${s}_4_Giữa Học kì I`] ||
      DEFAULT_LESSONS['Toán_4_Giữa Học kì I'];
    setUnits(foundUnits);
    setSelectedLessonIds(foundUnits.flatMap((u) => u.lessons.map((l) => l.id)));

    const foundStrands = DEFAULT_KNOWLEDGE_STRANDS[s] || DEFAULT_KNOWLEDGE_STRANDS['Toán'];
    setStrands(foundStrands);

    if (s === 'Tiếng Việt') {
      setReadingPassage(DEFAULT_VIETNAMESE_EXAM.readingPassage);
      setQuestions(DEFAULT_VIETNAMESE_EXAM.questions);
      setWritingSection(DEFAULT_VIETNAMESE_EXAM.writingSection);
      setOralReadingSection(DEFAULT_VIETNAMESE_EXAM.oralReadingSection);
      // Tiếng Việt standard matrix
      setMatrixRows([
        {
          id: 'tv_row_1',
          strand: 'Đọc hiểu văn bản (Ngoài SGK)',
          topic: 'Đọc hiểu',
          m1_tn_count: 3,
          m1_tn_pts: 1.5,
          m1_tl_count: 0,
          m1_tl_pts: 0,
          m2_tn_count: 1,
          m2_tn_pts: 0.5,
          m2_tl_count: 1,
          m2_tl_pts: 1.0,
          m3_tn_count: 0,
          m3_tn_pts: 0,
          m3_tl_count: 1,
          m3_tl_pts: 1.0,
          total_count: 6,
          total_pts: 4.0,
        },
        {
          id: 'tv_row_2',
          strand: 'Kiến thức tiếng Việt',
          topic: 'KTTV',
          m1_tn_count: 2,
          m1_tn_pts: 1.0,
          m1_tl_count: 0,
          m1_tl_pts: 0,
          m2_tn_count: 2,
          m2_tn_pts: 1.0,
          m2_tl_count: 0,
          m2_tl_pts: 0,
          m3_tn_count: 0,
          m3_tn_pts: 0,
          m3_tl_count: 1,
          m3_tl_pts: 1.0,
          total_count: 5,
          total_pts: 3.0,
        },
      ]);
    } else {
      setReadingPassage(null);
      setWritingSection(null);
      setOralReadingSection(null);
      setQuestions(DEFAULT_MATH_QUESTIONS);
      setMatrixRows(DEFAULT_MATH_MATRIX_ROWS);
    }
  };

  // Initial selection of all lessons
  useEffect(() => {
    setSelectedLessonIds(units.flatMap((u) => u.lessons.map((l) => l.id)));
  }, []);

  // AI Suggestions
  const handleAISuggestLessons = async () => {
    setIsLoadingAI(true);
    try {
      const res = await suggestLessons(grade, subject, term);
      if (res.data && res.data.length > 0) {
        setUnits(res.data);
        setSelectedLessonIds(res.data.flatMap((u) => u.lessons.map((l) => l.id)));
        showToast('✨ AI đã gợi ý danh sách bài học bộ sách Kết nối tri thức thành công!');
      }
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleAISuggestKnowledge = async () => {
    setIsLoadingAI(true);
    try {
      const res = await suggestKnowledge(grade, subject, term);
      if (res.data && res.data.length > 0) {
        setStrands(res.data);
        showToast('✨ AI đã gợi ý chuẩn Yêu cầu cần đạt (3 mức độ GDPT 2018) thành công!');
      }
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleAISuggestMatrix = async () => {
    setIsLoadingAI(true);
    try {
      const res = await suggestMatrix(grade, subject, term);
      if (res.data && res.data.length > 0) {
        setMatrixRows(res.data);
        showToast('✨ AI đã gợi ý Ma trận chuẩn tỉ lệ 50-30-20% thành công!');
      }
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleAISuggestSpecifications = async () => {
    setIsLoadingAI(true);
    try {
      const res = await suggestSpecifications(grade, subject, term, matrixRows);
      if (res.data && res.data.length > 0) {
        setSpecifications(res.data);
        showToast('✨ AI đã gợi ý Bản đặc tả ma trận chi tiết thành công!');
      }
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleAISuggestExamAndRubric = async () => {
    setIsLoadingAI(true);
    try {
      const res = await suggestExamAndRubric(grade, subject, term, header);
      if (res.data) {
        if (res.data.questions) setQuestions(res.data.questions);
        if (res.data.readingPassage) setReadingPassage(res.data.readingPassage);
        if (res.data.writingSection) setWritingSection(res.data.writingSection);
        if (res.data.oralReadingSection) setOralReadingSection(res.data.oralReadingSection);
        showToast('✨ AI đã tạo Đề kiểm tra & Hướng dẫn chấm chi tiết thành công!');
      }
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Toggle lesson in selection
  const handleToggleLesson = (id: string) => {
    setSelectedLessonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllLessons = (select: boolean) => {
    if (select) {
      setSelectedLessonIds(units.flatMap((u) => u.lessons.map((l) => l.id)));
    } else {
      setSelectedLessonIds([]);
    }
  };

  // Attach grid geometry shape to a question
  const handleAttachShapeToQuestion = (questionId: string, shape: GridShape) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, gridShape: shape } : q))
    );
    showToast(`📐 Đã chèn hình vẽ vào câu hỏi thành công!`);
  };

  // Assemble full exam package for summary
  const examPackage: ExamPackage = {
    header,
    readingPassage,
    questions,
    writingSection,
    oralReadingSection,
    matrixRows,
    matrixSummary: {
      tn_total_pts: 6,
      tn_percent: 60,
      tl_total_pts: 4,
      tl_percent: 40,
      m1_pts: 5,
      m1_percent: 50,
      m2_pts: 3,
      m2_percent: 30,
      m3_pts: 2,
      m3_percent: 20,
      total_pts: questions.reduce((sum, q) => sum + (q.points || 0), 0),
      total_questions: questions.length,
    },
    specifications,
    knowledgeStrands: strands,
    lessons: units,
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-700 animate-in slide-in-from-bottom duration-300 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Header */}
      <Header
        grade={grade}
        onGradeChange={handleGradeChange}
        subject={subject}
        onSubjectChange={handleSubjectChange}
        term={term}
        onTermChange={handleTermChange}
        header={header}
        onOpenSettings={() => setSettingsModalOpen(true)}
        aiConnected={aiConnected}
      />

      {/* Navigation Tabs (7 sections) */}
      <NavigationTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        examQuestionsCount={questions.length}
        totalPoints={questions.reduce((acc, q) => acc + (q.points || 0), 0)}
      />

      {/* Main Workspace Area */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 flex-1 w-full">
        {activeTab === 'lessons' && (
          <LessonListView
            grade={grade}
            subject={subject}
            term={term}
            units={units}
            selectedLessonIds={selectedLessonIds}
            onToggleLesson={handleToggleLesson}
            onSelectAll={handleSelectAllLessons}
            onUpdateUnits={setUnits}
            onAISuggest={handleAISuggestLessons}
            isLoadingAI={isLoadingAI}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeView
            grade={grade}
            subject={subject}
            term={term}
            strands={strands}
            onUpdateStrands={setStrands}
            onAISuggest={handleAISuggestKnowledge}
            isLoadingAI={isLoadingAI}
          />
        )}

        {activeTab === 'matrix' && (
          <MatrixEditorView
            grade={grade}
            subject={subject}
            term={term}
            rows={matrixRows}
            onUpdateRows={setMatrixRows}
            onAISuggest={handleAISuggestMatrix}
            isLoadingAI={isLoadingAI}
          />
        )}

        {activeTab === 'specifications' && (
          <SpecificationView
            grade={grade}
            subject={subject}
            term={term}
            specs={specifications}
            onUpdateSpecs={setSpecifications}
            onAISuggest={handleAISuggestSpecifications}
            isLoadingAI={isLoadingAI}
          />
        )}

        {activeTab === 'exam' && (
          <ExamAndRubricView
            grade={grade}
            subject={subject}
            term={term}
            header={header}
            readingPassage={readingPassage}
            questions={questions}
            writingSection={writingSection}
            oralReadingSection={oralReadingSection}
            onUpdateQuestions={setQuestions}
            onUpdatePassage={setReadingPassage}
            onUpdateWritingSection={setWritingSection}
            onUpdateOralReading={setOralReadingSection}
            onAISuggest={handleAISuggestExamAndRubric}
            isLoadingAI={isLoadingAI}
          />
        )}

        {activeTab === 'grid' && (
          <SquareGridCanvas
            questions={questions}
            onAttachToQuestion={handleAttachShapeToQuestion}
          />
        )}

        {activeTab === 'summary' && (
          <SummaryExportView examData={examPackage} />
        )}
      </main>

      {/* Settings Modal */}
      <SchoolSettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        header={header}
        onChange={setHeader}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>APP TẠO ĐỀ MA TRẬN VÀ ĐỀ KIỂM TRA TIỂU HỌC</strong> • Bộ sách Kết nối tri thức với cuộc sống (Lớp 1 - 5)
          </div>
          <div>
            Hệ thống hỗ trợ Giáo viên tiểu học chuẩn GDPT 2018 - Thông tư 27/2020/TT-BGDĐT
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState } from 'react';
import {
  SchoolHeader,
  QuestionItem,
  ReadingPassage,
  WritingSection,
  OralReadingSection,
  SubjectName,
  GradeLevel,
  TermName,
  GridShape,
} from '../types/exam';
import {
  Sparkles,
  FileCheck,
  Edit3,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  Eye,
  Sliders,
  AlertCircle,
  Grid,
} from 'lucide-react';

interface Props {
  grade: GradeLevel;
  subject: SubjectName;
  term: TermName;
  header: SchoolHeader;
  readingPassage?: ReadingPassage | null;
  questions: QuestionItem[];
  writingSection?: WritingSection | null;
  oralReadingSection?: OralReadingSection | null;
  onUpdateQuestions: (questions: QuestionItem[]) => void;
  onUpdatePassage: (passage: ReadingPassage) => void;
  onUpdateWritingSection: (writing: WritingSection) => void;
  onUpdateOralReading: (oral: OralReadingSection) => void;
  onAISuggest: () => Promise<void>;
  isLoadingAI: boolean;
}

export const ExamAndRubricView: React.FC<Props> = ({
  grade,
  subject,
  term,
  header,
  readingPassage,
  questions,
  writingSection,
  oralReadingSection,
  onUpdateQuestions,
  onUpdatePassage,
  onUpdateWritingSection,
  onUpdateOralReading,
  onAISuggest,
  isLoadingAI,
}) => {
  const [viewMode, setViewMode] = useState<'both' | 'student' | 'teacher'>('both');
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Compute total points
  const totalQuestionPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
  const isMathOrGeneral = subject !== 'Tiếng Việt';
  const isPointsBalanced = Math.abs(totalQuestionPoints - (isMathOrGeneral ? 10 : 7)) < 0.05;

  // Question editing handlers
  const handleUpdateQuestion = (index: number, updated: Partial<QuestionItem>) => {
    const newQuestions = [...questions];
    newQuestions[index] = {
      ...newQuestions[index],
      ...updated,
    };
    onUpdateQuestions(newQuestions);
  };

  const handlePointChange = (index: number, newPoints: number) => {
    const cleanPoints = Math.max(0, Math.round(newPoints * 100) / 100);
    handleUpdateQuestion(index, { points: cleanPoints });
  };

  const handleAddQuestion = () => {
    const nextNum = questions.length + 1;
    const newQ: QuestionItem = {
      id: `q_custom_${Date.now()}`,
      number: nextNum,
      type: 'multiple_choice',
      level: 'Mức 1',
      strand: subject === 'Toán' ? 'Số và phép tính' : 'Đọc hiểu văn bản',
      questionText: 'Nội dung câu hỏi mới...',
      options: [
        'A. Phương án A',
        'B. Phương án B',
        'C. Phương án C',
        'D. Phương án D',
      ],
      correctAnswer: 'A',
      points: 1.0,
      rubric: 'Khoanh đúng phương án A cho 1,0 điểm.',
    };
    onUpdateQuestions([...questions, newQ]);
    setEditingQuestionId(newQ.id);
  };

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    const renumbered = newQuestions.map((q, idx) => ({ ...q, number: idx + 1 }));
    onUpdateQuestions(renumbered);
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === questions.length - 1)
    )
      return;
    const newQuestions = [...questions];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[targetIdx];
    newQuestions[targetIdx] = temp;
    const renumbered = newQuestions.map((q, idx) => ({ ...q, number: idx + 1 }));
    onUpdateQuestions(renumbered);
  };

  return (
    <div className="space-y-6">
      {/* Banner & AI Controls */}
      <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-white border border-emerald-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-700 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                Mục 5
              </span>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">
                Đề kiểm tra & Hướng dẫn chấm (Barem chi tiết)
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
              <span>Đơn vị: <strong>{header.agency} - {header.schoolName}</strong></span>
              <span>•</span>
              <span className="font-bold text-emerald-800">CÓ CHỖ SỬA ĐIỂM TRỰC TIẾP CHO TỪNG CÂU</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* View Mode Toggle */}
            <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center shadow-2xs text-xs font-semibold">
              <button
                onClick={() => setViewMode('both')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  viewMode === 'both' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả (Đề + Barem)
              </button>
              <button
                onClick={() => setViewMode('student')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  viewMode === 'student' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Đề học sinh
              </button>
              <button
                onClick={() => setViewMode('teacher')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  viewMode === 'teacher' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Chỉ đáp án & Barem
              </button>
            </div>

            <button
              onClick={onAISuggest}
              disabled={isLoadingAI}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-emerald-700/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoadingAI ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Đang sinh đề & đáp án...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>AI Gợi ý đề & đáp án mới ngay</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Total Points Tracker with Quick Balance */}
        <div className="mt-4 pt-4 border-t border-emerald-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">Tổng điểm phần câu hỏi:</span>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-lg font-black px-2.5 py-0.5 rounded-lg border ${
                  isPointsBalanced
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                {totalQuestionPoints.toFixed(2)} / {isMathOrGeneral ? '10.0' : '7.0'} điểm
              </span>
              <span className="text-slate-500 font-medium">({questions.length} câu)</span>
            </div>
            {!isPointsBalanced && (
              <span className="text-amber-700 flex items-center gap-1 font-medium text-[11px]">
                <AlertCircle className="w-3.5 h-3.5" />
                (Tổng điểm lệch so với quy chuẩn, thầy/cô vui lòng chỉnh ô điểm ở từng câu)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddQuestion}
              className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-3 py-1.5 rounded-lg shadow-2xs transition"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Thêm câu hỏi mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Administrative Test Header Box */}
      <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-xs text-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-200 pb-5 text-center md:text-left">
          {/* Left: Agency & School */}
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {header.agency}
            </div>
            <div className="text-sm md:text-base font-extrabold uppercase text-slate-900 underline decoration-slate-400 underline-offset-4">
              {header.schoolName}
            </div>
            <div className="text-xs text-slate-500 pt-1">
              Họ và tên học sinh: ................................................................ Lớp: {header.grade}...
            </div>
          </div>

          {/* Right: Exam Title & Year */}
          <div className="text-center md:text-right space-y-1">
            <div className="text-sm md:text-base font-black uppercase text-emerald-900 tracking-tight">
              {header.examTitle}
            </div>
            <div className="text-xs font-bold text-slate-700">
              {header.schoolYear}
            </div>
            <div className="text-xs font-extrabold text-slate-800 uppercase">
              MÔN: {header.subject} - LỚP {header.grade}
            </div>
            <div className="text-xs italic text-slate-500">
              (Thời gian làm bài: {header.durationMinutes} phút - Không kể thời gian giao đề)
            </div>
          </div>
        </div>

        {/* Student Score & Teacher Feedback Box (Chuẩn Thông tư 27) */}
        {viewMode !== 'teacher' && (
          <div className="mt-4 grid grid-cols-12 border border-slate-300 rounded-xl overflow-hidden text-center text-xs divide-x divide-slate-300">
            <div className="col-span-3 sm:col-span-2 p-2.5 bg-slate-50 font-bold flex flex-col justify-center">
              <span>ĐIỂM SỐ</span>
              <span className="text-[10px] font-normal text-slate-500">(Bằng số và chữ)</span>
              <div className="h-10 mt-1"></div>
            </div>
            <div className="col-span-6 sm:col-span-7 p-2.5 text-left font-semibold">
              <span className="block font-bold text-center border-b border-slate-200 pb-1 mb-1">
                LỜI NHẬN XÉT CỦA GIÁO VIÊN
              </span>
              <div className="text-slate-400 italic text-[11px] pt-1">
                ....................................................................................................................................................
              </div>
            </div>
            <div className="col-span-3 sm:col-span-3 p-2.5 bg-slate-50 flex flex-col justify-center">
              <span className="font-bold">CHỮ KÝ GIÁO VIÊN</span>
              <div className="h-10 mt-1"></div>
            </div>
          </div>
        )}
      </div>

      {/* SPECIAL FOR TIẾNG VIỆT: Oral Reading Section (3đ) & Reading Passage (7đ) */}
      {subject === 'Tiếng Việt' && (
        <div className="space-y-6">
          {/* Oral Reading (3 points) */}
          {oralReadingSection && viewMode !== 'student' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-black text-slate-900 text-sm md:text-base flex items-center gap-2">
                  <span className="bg-emerald-700 text-white text-xs px-2 py-0.5 rounded">A.1</span>
                  KIỂM TRA ĐỌC THÀNH TIẾNG (3,0 ĐIỂM)
                </h3>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {oralReadingSection.points} điểm
                </span>
              </div>

              <div className="mt-3 text-xs text-slate-700 space-y-2">
                <p className="font-semibold text-slate-800">{oralReadingSection.prompt}</p>
                <div className="space-y-1.5 pl-3 border-l-2 border-emerald-500">
                  {oralReadingSection.passages.map((p, idx) => (
                    <div key={idx} className="bg-slate-50 p-2 rounded-lg text-slate-800 font-medium">
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reading Passage (Outside textbook with standard word count) */}
          {readingPassage && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded">A.2</span>
                  <h3 className="font-black text-slate-900 text-sm md:text-base">
                    ĐỌC HIỂU VÀ KIẾN THỨC TIẾNG VIỆT (7,0 ĐIỂM - 11 CÂU HỎI)
                  </h3>
                </div>
                {readingPassage.wordCount && (
                  <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium">
                    Độ dài: ~{readingPassage.wordCount} chữ (Chuẩn ngoài SGK)
                  </span>
                )}
              </div>

              <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-5 text-slate-800">
                <div className="text-center mb-3">
                  <input
                    type="text"
                    value={readingPassage.title}
                    onChange={(e) => onUpdatePassage({ ...readingPassage, title: e.target.value })}
                    className="font-black text-base uppercase text-emerald-950 text-center w-full bg-transparent border-b border-transparent hover:border-amber-400 focus:border-emerald-600 focus:outline-hidden"
                  />
                  <div className="text-xs text-slate-500 italic mt-0.5">
                    Tác giả: {readingPassage.author}
                  </div>
                </div>

                <textarea
                  rows={8}
                  value={readingPassage.content}
                  onChange={(e) => onUpdatePassage({ ...readingPassage, content: e.target.value })}
                  className="w-full text-xs md:text-sm leading-relaxed text-slate-800 bg-transparent border border-transparent hover:border-amber-300 focus:border-emerald-500 rounded p-2 focus:bg-white focus:outline-hidden whitespace-pre-line resize-y"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Questions List (10 or 11 questions with editable points) */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const isMultipleChoice = q.type === 'multiple_choice';

          return (
            <div
              key={q.id || idx}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 transition hover:border-slate-300"
            >
              {/* Question Header & Points Controller (CHỖ SỬA ĐIỂM) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                    {q.number}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    Câu {q.number}:
                  </span>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                      q.level === 'Mức 1'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : q.level === 'Mức 2'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {q.level}
                  </span>

                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                    {isMultipleChoice ? 'Trắc nghiệm' : 'Tự luận'}
                  </span>

                  <span className="text-xs text-slate-400">• {q.strand}</span>
                </div>

                {/* CRITICAL: CHỖ SỬA ĐIỂM (INLINE EDIT POINT CONTROLLER) */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <div className="flex items-center bg-emerald-50 border border-emerald-300 rounded-xl px-2.5 py-1 shadow-2xs">
                    <span className="text-xs font-bold text-emerald-950 mr-1.5">
                      Điểm:
                    </span>
                    <button
                      onClick={() => handlePointChange(idx, q.points - 0.25)}
                      className="w-5 h-5 rounded bg-white hover:bg-emerald-200 text-emerald-900 font-bold flex items-center justify-center border border-emerald-200 text-xs transition"
                      title="Giảm 0.25 điểm"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      step={0.25}
                      min={0}
                      max={10}
                      value={q.points}
                      onChange={(e) => handlePointChange(idx, Number(e.target.value))}
                      className="w-12 px-1 text-center font-black text-emerald-900 text-xs bg-transparent focus:outline-hidden"
                    />
                    <button
                      onClick={() => handlePointChange(idx, q.points + 0.25)}
                      className="w-5 h-5 rounded bg-white hover:bg-emerald-200 text-emerald-900 font-bold flex items-center justify-center border border-emerald-200 text-xs transition"
                      title="Tăng 0.25 điểm"
                    >
                      +
                    </button>
                    <span className="text-[11px] font-bold text-emerald-800 ml-1">
                      đ
                    </span>
                  </div>

                  {/* Ordering & delete actions */}
                  <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                    <button
                      onClick={() => handleMoveQuestion(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 transition"
                      title="Chuyển câu lên trên"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveQuestion(idx, 'down')}
                      disabled={idx === questions.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 transition"
                      title="Chuyển câu xuống dưới"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(idx)}
                      className="p-1 text-slate-400 hover:text-red-500 transition"
                      title="Xóa câu hỏi này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Question Text (Editable inline) */}
              <div className="mt-3">
                <textarea
                  rows={2}
                  value={q.questionText}
                  onChange={(e) => handleUpdateQuestion(idx, { questionText: e.target.value })}
                  placeholder="Nhập nội dung câu hỏi..."
                  className="w-full text-xs md:text-sm font-medium text-slate-800 bg-transparent border border-transparent hover:border-slate-300 focus:border-emerald-500 rounded p-1.5 focus:bg-white focus:outline-hidden leading-relaxed resize-y"
                />
              </div>

              {/* Geometry Grid Shape if attached */}
              {q.gridShape && (
                <div className="my-3 p-3 bg-slate-50 border border-slate-200 rounded-xl inline-block">
                  <div className="flex items-center justify-between mb-1 text-[11px] font-bold text-slate-600">
                    <span className="flex items-center gap-1">
                      <Grid className="w-3.5 h-3.5 text-emerald-600" />
                      {q.gridShape.label || 'Hình vẽ trên lưới ô vuông'}
                    </span>
                    <button
                      onClick={() => handleUpdateQuestion(idx, { gridShape: null })}
                      className="text-red-500 hover:underline text-[10px]"
                    >
                      Gỡ hình vẽ
                    </button>
                  </div>
                  {/* Miniature SVG representation */}
                  <svg width="200" height="130" className="bg-white rounded border border-slate-300">
                    <defs>
                      <pattern id={`miniGrid_${idx}`} width="18" height="18" patternUnits="userSpaceOnUse">
                        <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="200" height="130" fill={`url(#miniGrid_${idx})`} />
                    <rect x="25" y="20" width="130" height="80" fill="rgba(16, 185, 129, 0.2)" stroke="#047857" strokeWidth="2" />
                    <text x="90" y="16" fontSize="11" fontWeight="bold" fill="#047857" textAnchor="middle">5 cm</text>
                    <text x="160" y="65" fontSize="11" fontWeight="bold" fill="#047857" textAnchor="start">3 cm</text>
                  </svg>
                </div>
              )}

              {/* Options for Multiple Choice */}
              {isMultipleChoice && q.options && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, optIdx) => {
                    const optLetter = String.fromCharCode(65 + optIdx);
                    const isCorrect = q.correctAnswer === optLetter;

                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-2 p-2 rounded-xl border transition ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-400 font-semibold text-emerald-950'
                            : 'bg-slate-50/70 border-slate-200 text-slate-700'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleUpdateQuestion(idx, { correctAnswer: optLetter })}
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition ${
                            isCorrect
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white text-slate-600 border border-slate-300 hover:border-emerald-500'
                          }`}
                          title={`Chọn ${optLetter} làm đáp án đúng`}
                        >
                          {optLetter}
                        </button>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...(q.options || [])];
                            newOptions[optIdx] = e.target.value;
                            handleUpdateQuestion(idx, { options: newOptions });
                          }}
                          className="flex-1 bg-transparent border-0 focus:outline-hidden text-xs"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Rubric / Hướng dẫn chấm (Barem chi tiết) */}
              {viewMode !== 'student' && (
                <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 p-4 rounded-b-2xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Hướng dẫn chấm & Đáp án chi tiết (Barem {q.points} điểm):
                    </span>
                    {q.correctAnswer && (
                      <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded text-[11px] font-bold">
                        Đáp án đúng: {q.correctAnswer}
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    value={q.rubric}
                    onChange={(e) => handleUpdateQuestion(idx, { rubric: e.target.value })}
                    placeholder="Nhập thang điểm chi tiết cho từng ý (0.25đ / 0.5đ / 1.0đ)..."
                    className="w-full text-xs leading-relaxed text-slate-700 bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden resize-y font-mono text-[11px]"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SPECIAL FOR TIẾNG VIỆT: Section B - Writing (10 points) */}
      {subject === 'Tiếng Việt' && writingSection && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="font-black text-slate-900 text-sm md:text-base flex items-center gap-2">
              <span className="bg-emerald-700 text-white text-xs px-2 py-0.5 rounded">B</span>
              KIỂM TRA VIẾT ĐOẠN VĂN / BÀI VĂN (10 ĐIỂM)
            </h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {writingSection.points} điểm
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Đề bài viết văn:
            </label>
            <textarea
              rows={2}
              value={writingSection.prompt}
              onChange={(e) =>
                onUpdateWritingSection({ ...writingSection, prompt: e.target.value })
              }
              className="w-full text-xs md:text-sm font-semibold text-slate-900 bg-amber-50/40 border border-amber-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Barem chấm 5 tiêu chí chuẩn Thông tư 27 */}
          {viewMode !== 'student' && (
            <div className="mt-4 pt-3 border-t border-slate-200">
              <span className="text-xs font-bold text-emerald-950 block mb-2">
                Barem tiêu chí đánh giá bài viết (Tổng 10 điểm):
              </span>
              <div className="space-y-2">
                {writingSection.criteria.map((c, cIdx) => (
                  <div
                    key={cIdx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <div className="flex-1">
                      <span className="font-bold text-slate-800">{c.name}: </span>
                      <span className="text-slate-600">{c.desc}</span>
                    </div>
                    <div className="flex items-center gap-1.5 self-end sm:self-auto bg-white border border-slate-200 px-2 py-1 rounded-lg">
                      <span className="font-bold text-emerald-800">{c.points.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-500">điểm</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

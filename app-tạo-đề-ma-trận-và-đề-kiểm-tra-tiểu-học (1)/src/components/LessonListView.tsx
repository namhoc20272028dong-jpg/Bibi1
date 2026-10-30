import React, { useState } from 'react';
import { GradeLevel, SubjectName, TermName, LessonUnit, LessonItem } from '../types/exam';
import {
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Info,
  RefreshCw,
} from 'lucide-react';

interface Props {
  grade: GradeLevel;
  subject: SubjectName;
  term: TermName;
  units: LessonUnit[];
  selectedLessonIds: string[];
  onToggleLesson: (id: string) => void;
  onSelectAll: (select: boolean) => void;
  onUpdateUnits: (units: LessonUnit[]) => void;
  onAISuggest: () => Promise<void>;
  isLoadingAI: boolean;
}

export const LessonListView: React.FC<Props> = ({
  grade,
  subject,
  term,
  units,
  selectedLessonIds,
  onToggleLesson,
  onSelectAll,
  onUpdateUnits,
  onAISuggest,
  isLoadingAI,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newLessonName, setNewLessonName] = useState('');
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);

  const totalLessons = units.reduce((acc, u) => acc + u.lessons.length, 0);
  const totalPeriods = units.reduce(
    (acc, u) => acc + u.lessons.reduce((sub, l) => sub + (l.periods || 0), 0),
    0
  );

  const handleAddLesson = (topicIdx: number) => {
    if (!newLessonName.trim()) return;
    const newLesson: LessonItem = {
      id: `lesson_custom_${Date.now()}`,
      name: newLessonName.trim(),
      weeks: 'Tuần tự chọn',
      periods: 2,
      strand: 'Kiến thức chung',
      keyKnowledge: 'Nội dung bổ sung theo phân phối chương trình thực tế',
    };

    const newUnits = [...units];
    newUnits[topicIdx].lessons.push(newLesson);
    onUpdateUnits(newUnits);
    onToggleLesson(newLesson.id);
    setNewLessonName('');
  };

  const handleDeleteLesson = (topicIdx: number, lessonIdx: number) => {
    const newUnits = [...units];
    newUnits[topicIdx].lessons.splice(lessonIdx, 1);
    onUpdateUnits(newUnits);
  };

  const filteredUnits = units.map((u) => ({
    ...u,
    lessons: u.lessons.filter(
      (l) =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.keyKnowledge.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.strand.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  return (
    <div className="space-y-6">
      {/* Banner & AI Suggestion Button */}
      <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-white border border-emerald-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-700 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                Mục 1
              </span>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">
                Danh sách bài học môn {subject} Lớp {grade} - {term}
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
              <span>Bộ sách: <strong>Kết nối tri thức với cuộc sống</strong></span>
              <span>•</span>
              <span>Tổng số: <strong>{totalLessons} bài học</strong> ({totalPeriods} tiết học)</span>
              <span>•</span>
              <span className="text-emerald-700 font-medium">Đã chọn kiểm tra: {selectedLessonIds.length} bài</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onAISuggest}
              disabled={isLoadingAI}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-700/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoadingAI ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Đang gợi ý...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>AI Gợi ý ngay danh sách bài học</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter & Selection bar */}
        <div className="mt-4 pt-4 border-t border-emerald-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm kiếm bài học, mạch kiến thức..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => onSelectAll(true)}
              className="text-xs font-semibold text-emerald-700 hover:bg-emerald-100/60 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition"
            >
              Chọn tất cả
            </button>
            <button
              onClick={() => onSelectAll(false)}
              className="text-xs font-semibold text-slate-600 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-200 transition"
            >
              Bỏ chọn tất cả
            </button>
          </div>
        </div>
      </div>

      {/* Topics & Lessons */}
      <div className="space-y-6">
        {filteredUnits.map((unit, topicIdx) => (
          <div
            key={topicIdx}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
          >
            {/* Topic Header */}
            <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-800 text-sm md:text-base">
                  {unit.topic}
                </h3>
                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                  {unit.lessons.length} bài
                </span>
              </div>
            </div>

            {/* Lessons List */}
            <div className="divide-y divide-slate-100">
              {unit.lessons.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  Không tìm thấy bài học nào phù hợp với từ khóa tìm kiếm.
                </div>
              ) : (
                unit.lessons.map((lesson, lessonIdx) => {
                  const isChecked = selectedLessonIds.includes(lesson.id);
                  return (
                    <div
                      key={lesson.id}
                      className={`p-4 transition-colors flex items-start gap-3.5 ${
                        isChecked ? 'bg-emerald-50/30' : 'hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleLesson(lesson.id)}
                        className="mt-1 w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
                      />

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                            {lesson.name}
                            {isChecked && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                            )}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-600">
                              <Calendar className="w-3 h-3 text-emerald-600" />
                              {lesson.weeks}
                            </span>
                            <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-600">
                              <Clock className="w-3 h-3 text-emerald-600" />
                              {lesson.periods} tiết
                            </span>
                            <span className="bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                              {lesson.strand}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="font-semibold text-slate-700">Yêu cầu cần đạt: </span>
                          {lesson.keyKnowledge}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteLesson(topicIdx, lessonIdx)}
                        className="text-slate-300 hover:text-red-500 p-1 rounded-md transition"
                        title="Xóa bài học khỏi danh sách"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick add custom lesson to this topic */}
            <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2 text-xs">
              <input
                type="text"
                placeholder={`+ Thêm bài học mới vào "${unit.topic}"...`}
                value={selectedTopicIndex === topicIdx ? newLessonName : ''}
                onFocus={() => setSelectedTopicIndex(topicIdx)}
                onChange={(e) => setNewLessonName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddLesson(topicIdx);
                }}
                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <button
                onClick={() => handleAddLesson(topicIdx)}
                className="inline-flex items-center gap-1 bg-slate-200 hover:bg-emerald-700 hover:text-white px-3 py-1.5 rounded-lg font-semibold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Guide Note Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold">Lưu ý chuyên môn của Chuyên gia ra đề:</div>
          <p className="mt-1 leading-relaxed">
            Giáo viên chọn lọc các bài học trọng tâm cần kiểm tra bằng các ô tích xanh. Hệ thống và AI sẽ tự động căn cứ vào các bài đã chọn để xây dựng Ma trận (Mục 3), Bản đặc tả (Mục 4) và sinh Đề kiểm tra chuẩn xác (Mục 5).
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { GradeLevel, SubjectName, TermName, KnowledgeStrand } from '../types/exam';
import {
  Sparkles,
  Target,
  Plus,
  Trash2,
  Lightbulb,
  Check,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { PROGRAM_2018_MATH_HOURS } from '../data/curriculumData';

interface Props {
  grade: GradeLevel;
  subject: SubjectName;
  term: TermName;
  strands: KnowledgeStrand[];
  onUpdateStrands: (strands: KnowledgeStrand[]) => void;
  onAISuggest: () => Promise<void>;
  isLoadingAI: boolean;
}

export const KnowledgeView: React.FC<Props> = ({
  grade,
  subject,
  term,
  strands,
  onUpdateStrands,
  onAISuggest,
  isLoadingAI,
}) => {
  const [editingLevel, setEditingLevel] = useState<{
    strandIdx: number;
    levelKey: 'level1' | 'level2' | 'level3';
  } | null>(null);
  const [newItemText, setNewItemText] = useState('');

  const handleAddItem = (
    strandIdx: number,
    levelKey: 'level1' | 'level2' | 'level3'
  ) => {
    if (!newItemText.trim()) return;
    const newStrands = [...strands];
    newStrands[strandIdx].levels[levelKey].push(newItemText.trim());
    onUpdateStrands(newStrands);
    setNewItemText('');
  };

  const handleDeleteItem = (
    strandIdx: number,
    levelKey: 'level1' | 'level2' | 'level3',
    itemIdx: number
  ) => {
    const newStrands = [...strands];
    newStrands[strandIdx].levels[levelKey].splice(itemIdx, 1);
    onUpdateStrands(newStrands);
  };

  const isMath = subject === 'Toán';
  const mathNote = isMath ? PROGRAM_2018_MATH_HOURS.detailedNotes[grade] : null;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-white border border-emerald-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-700 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                Mục 2
              </span>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">
                Kiến thức trọng tâm & Yêu cầu cần đạt môn {subject} Lớp {grade}
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
              <span>Chuẩn: <strong>Thông tư 27/2020/TT-BGDĐT</strong></span>
              <span>•</span>
              <span>Đánh giá 3 mức độ nhận thức: Mức 1 (Nhận biết) • Mức 2 (Thông hiểu) • Mức 3 (Vận dụng)</span>
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
                  <span>AI Đang phân tích...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>AI Gợi ý chuẩn YCCĐ ngay</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* If math, display the official Ministry GDPT 2018 hours and percentage table */}
        {isMath && (
          <div className="mt-4 pt-4 border-t border-emerald-200/60 bg-emerald-100/40 -mx-5 -mb-5 p-4 rounded-b-2xl text-xs text-emerald-950">
            <div className="font-bold flex items-center gap-1.5 mb-1.5 text-emerald-900">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Thời lượng thực hiện chương trình GDPT 2018 Lớp {grade}:</span>
            </div>
            <p className="leading-relaxed">
              <strong>Số tiết cả năm:</strong> {PROGRAM_2018_MATH_HOURS.periods[grade]} tiết.{' '}
              {mathNote && <span>• <strong>Tỷ lệ chi tiết:</strong> {mathNote}</span>}
            </p>
          </div>
        )}
      </div>

      {/* Strands List */}
      <div className="space-y-6">
        {strands.map((strand, strandIdx) => (
          <div
            key={strandIdx}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
          >
            {/* Strand Title */}
            <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Target className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-800 text-base">
                  Mạch kiến thức: {strand.strandName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">
                  Tỷ lệ thời lượng: ~{strand.weightPercent}%
                </span>
                {strand.allocatedPeriods && (
                  <span className="bg-slate-200 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {strand.allocatedPeriods} tiết
                  </span>
                )}
              </div>
            </div>

            {/* 3 Cognitive Levels Grids */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Level 1: Nhận biết (50%) */}
              <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-blue-200 mb-3">
                    <span className="font-bold text-blue-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                      Mức 1: Nhận biết
                    </span>
                    <span className="bg-blue-200 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
                      Chiếm ~50%
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {strand.levels.level1.map((item, i) => (
                      <li
                        key={i}
                        className="group flex items-start justify-between gap-2 bg-white p-2 rounded-lg border border-blue-100 shadow-2xs"
                      >
                        <span className="leading-relaxed flex-1">• {item}</span>
                        <button
                          onClick={() => handleDeleteItem(strandIdx, 'level1', i)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition p-0.5"
                          title="Xóa yêu cầu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Add requirement */}
                <div className="mt-3 pt-3 border-t border-blue-100">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="+ Thêm YCCĐ Mức 1..."
                      value={
                        editingLevel?.strandIdx === strandIdx &&
                        editingLevel?.levelKey === 'level1'
                          ? newItemText
                          : ''
                      }
                      onFocus={() =>
                        setEditingLevel({ strandIdx, levelKey: 'level1' })
                      }
                      onChange={(e) => setNewItemText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddItem(strandIdx, 'level1');
                      }}
                      className="flex-1 px-2.5 py-1 text-xs bg-white border border-blue-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleAddItem(strandIdx, 'level1')}
                      className="p-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Level 2: Kết nối / Thông hiểu (30%) */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200 mb-3">
                    <span className="font-bold text-amber-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                      Mức 2: Kết nối / Thông hiểu
                    </span>
                    <span className="bg-amber-200 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
                      Chiếm ~30%
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {strand.levels.level2.map((item, i) => (
                      <li
                        key={i}
                        className="group flex items-start justify-between gap-2 bg-white p-2 rounded-lg border border-amber-100 shadow-2xs"
                      >
                        <span className="leading-relaxed flex-1">• {item}</span>
                        <button
                          onClick={() => handleDeleteItem(strandIdx, 'level2', i)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition p-0.5"
                          title="Xóa yêu cầu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 pt-3 border-t border-amber-100">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="+ Thêm YCCĐ Mức 2..."
                      value={
                        editingLevel?.strandIdx === strandIdx &&
                        editingLevel?.levelKey === 'level2'
                          ? newItemText
                          : ''
                      }
                      onFocus={() =>
                        setEditingLevel({ strandIdx, levelKey: 'level2' })
                      }
                      onChange={(e) => setNewItemText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddItem(strandIdx, 'level2');
                      }}
                      className="flex-1 px-2.5 py-1 text-xs bg-white border border-amber-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      onClick={() => handleAddItem(strandIdx, 'level2')}
                      className="p-1 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Level 3: Vận dụng (20%) */}
              <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-rose-200 mb-3">
                    <span className="font-bold text-rose-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                      Mức 3: Vận dụng
                    </span>
                    <span className="bg-rose-200 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
                      Chiếm ~20%
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {strand.levels.level3.map((item, i) => (
                      <li
                        key={i}
                        className="group flex items-start justify-between gap-2 bg-white p-2 rounded-lg border border-rose-100 shadow-2xs"
                      >
                        <span className="leading-relaxed flex-1">• {item}</span>
                        <button
                          onClick={() => handleDeleteItem(strandIdx, 'level3', i)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition p-0.5"
                          title="Xóa yêu cầu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 pt-3 border-t border-rose-100">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="+ Thêm YCCĐ Mức 3..."
                      value={
                        editingLevel?.strandIdx === strandIdx &&
                        editingLevel?.levelKey === 'level3'
                          ? newItemText
                          : ''
                      }
                      onFocus={() =>
                        setEditingLevel({ strandIdx, levelKey: 'level3' })
                      }
                      onChange={(e) => setNewItemText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddItem(strandIdx, 'level3');
                      }}
                      className="flex-1 px-2.5 py-1 text-xs bg-white border border-rose-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                    />
                    <button
                      onClick={() => handleAddItem(strandIdx, 'level3')}
                      className="p-1 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Advisory card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold">Định hướng sư phạm chuẩn Thông tư 27:</div>
          <p className="mt-1 leading-relaxed">
            - Mức 1 (Nhận biết): Đạt được khi học sinh nhắc lại, tái hiện hoặc nhận diện ngay dữ liệu trực quan quen thuộc trong SGK.
            <br />
            - Mức 2 (Kết nối, Thông hiểu): Đòi hỏi kết nối các dữ kiện, so sánh, thực hiện 2 bước tính hoặc giải thích vì sao.
            <br />
            - Mức 3 (Vận dụng): Giải quyết tình huống mới lạ trong đời sống, tính nhanh thuận tiện, lập luận hoặc bày tỏ suy nghĩ cá nhân.
          </p>
        </div>
      </div>
    </div>
  );
};

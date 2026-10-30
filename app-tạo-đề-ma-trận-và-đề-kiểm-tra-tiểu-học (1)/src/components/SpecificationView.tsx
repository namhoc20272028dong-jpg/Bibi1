import React from 'react';
import { GradeLevel, SubjectName, TermName, SpecificationItem, CognitiveLevel } from '../types/exam';
import {
  Sparkles,
  FileSpreadsheet,
  Plus,
  Trash2,
  RefreshCw,
  FileText,
} from 'lucide-react';

interface Props {
  grade: GradeLevel;
  subject: SubjectName;
  term: TermName;
  specs: SpecificationItem[];
  onUpdateSpecs: (specs: SpecificationItem[]) => void;
  onAISuggest: () => Promise<void>;
  isLoadingAI: boolean;
}

export const SpecificationView: React.FC<Props> = ({
  grade,
  subject,
  term,
  specs,
  onUpdateSpecs,
  onAISuggest,
  isLoadingAI,
}) => {
  const handleUpdateField = (
    index: number,
    field: keyof SpecificationItem,
    value: any
  ) => {
    const newSpecs = [...specs];
    newSpecs[index] = {
      ...newSpecs[index],
      [field]: value,
    };
    onUpdateSpecs(newSpecs);
  };

  const handleAddSpec = () => {
    const nextNum = specs.length + 1;
    const newSpec: SpecificationItem = {
      id: `sp_${Date.now()}`,
      order: nextNum,
      strand: 'Mạch kiến thức',
      content: 'Nội dung kiến thức',
      standard: 'Yêu cầu cần đạt cụ thể theo GDPT 2018...',
      questionType: 'Trắc nghiệm',
      level: 'Mức 1',
      questionNumber: `Câu ${nextNum}`,
      points: 1.0,
    };
    onUpdateSpecs([...specs, newSpec]);
  };

  const handleDeleteSpec = (index: number) => {
    const newSpecs = [...specs];
    newSpecs.splice(index, 1);
    // re-number orders
    const reordered = newSpecs.map((s, idx) => ({
      ...s,
      order: idx + 1,
      questionNumber: `Câu ${idx + 1}`,
    }));
    onUpdateSpecs(reordered);
  };

  const totalPoints = specs.reduce((acc, s) => acc + (s.points || 0), 0);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-white border border-emerald-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-700 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                Mục 4
              </span>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">
                Bản đặc tả Ma trận Đề kiểm tra môn {subject} Lớp {grade}
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
              <span>Học kì: <strong>{term}</strong></span>
              <span>•</span>
              <span>Tổng số: <strong>{specs.length} câu hỏi</strong> ({totalPoints.toFixed(1)} điểm)</span>
              <span>•</span>
              <span className="text-emerald-700 font-medium">Khớp 100% với Ma trận & Đề thi</span>
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
                  <span>AI Đang lập bản đặc tả...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>AI Gợi ý bản đặc tả ngay</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Specification Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-800 text-sm md:text-base">
              Bảng mô tả chi tiết từng câu hỏi trong đề kiểm tra
            </h3>
          </div>
          <button
            onClick={handleAddSpec}
            className="inline-flex items-center gap-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm câu đặc tả</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-800 border-collapse">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-300 font-bold text-slate-700">
                <th className="p-2.5 text-center w-12 border-r border-slate-200">STT</th>
                <th className="p-2.5 text-left w-36 border-r border-slate-200">Mạch kiến thức</th>
                <th className="p-2.5 text-left w-36 border-r border-slate-200">Đơn vị kiến thức</th>
                <th className="p-2.5 text-left border-r border-slate-200">Mức độ đánh giá / Yêu cầu cần đạt</th>
                <th className="p-2.5 text-center w-28 border-r border-slate-200">Hình thức</th>
                <th className="p-2.5 text-center w-24 border-r border-slate-200">Mức độ</th>
                <th className="p-2.5 text-center w-20 border-r border-slate-200">Câu số</th>
                <th className="p-2.5 text-center w-16 border-r border-slate-200">Điểm</th>
                <th className="p-2.5 text-center w-12">Xóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {specs.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-slate-50/80">
                  <td className="p-2 text-center font-bold text-slate-500 border-r border-slate-200">
                    {index + 1}
                  </td>

                  <td className="p-2 border-r border-slate-200">
                    <input
                      type="text"
                      value={item.strand}
                      onChange={(e) => handleUpdateField(index, 'strand', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-emerald-500 rounded bg-transparent focus:bg-white focus:outline-hidden font-medium"
                    />
                  </td>

                  <td className="p-2 border-r border-slate-200">
                    <input
                      type="text"
                      value={item.content}
                      onChange={(e) => handleUpdateField(index, 'content', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-emerald-500 rounded bg-transparent focus:bg-white focus:outline-hidden"
                    />
                  </td>

                  <td className="p-2 border-r border-slate-200">
                    <textarea
                      rows={2}
                      value={item.standard}
                      onChange={(e) => handleUpdateField(index, 'standard', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-emerald-500 rounded bg-transparent focus:bg-white focus:outline-hidden leading-relaxed resize-y"
                    />
                  </td>

                  <td className="p-2 text-center border-r border-slate-200">
                    <select
                      value={item.questionType}
                      onChange={(e) => handleUpdateField(index, 'questionType', e.target.value)}
                      className="px-2 py-1 text-xs bg-white border border-slate-200 rounded font-medium focus:outline-hidden"
                    >
                      <option value="Trắc nghiệm">Trắc nghiệm</option>
                      <option value="Tự luận">Tự luận</option>
                    </select>
                  </td>

                  <td className="p-2 text-center border-r border-slate-200">
                    <select
                      value={item.level}
                      onChange={(e) => handleUpdateField(index, 'level', e.target.value as CognitiveLevel)}
                      className={`px-2 py-1 text-xs font-bold rounded border focus:outline-hidden ${
                        item.level === 'Mức 1'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : item.level === 'Mức 2'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      <option value="Mức 1">Mức 1</option>
                      <option value="Mức 2">Mức 2</option>
                      <option value="Mức 3">Mức 3</option>
                    </select>
                  </td>

                  <td className="p-2 text-center border-r border-slate-200">
                    <input
                      type="text"
                      value={item.questionNumber}
                      onChange={(e) => handleUpdateField(index, 'questionNumber', e.target.value)}
                      className="w-16 px-1 py-1 text-center font-bold text-slate-800 border border-slate-200 rounded bg-white"
                    />
                  </td>

                  <td className="p-2 text-center border-r border-slate-200">
                    <input
                      type="number"
                      step={0.25}
                      min={0}
                      value={item.points}
                      onChange={(e) => handleUpdateField(index, 'points', Number(e.target.value))}
                      className="w-14 px-1 py-1 text-center font-bold text-emerald-700 border border-slate-200 rounded bg-white"
                    />
                  </td>

                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleDeleteSpec(index)}
                      className="text-slate-300 hover:text-red-500 p-1 transition"
                      title="Xóa đặc tả"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Total row */}
              <tr className="bg-slate-100 font-bold border-t border-slate-300 text-slate-900">
                <td colSpan={6} className="p-2.5 text-right border-r border-slate-200 uppercase tracking-wide">
                  Tổng cộng:
                </td>
                <td className="p-2.5 text-center border-r border-slate-200 font-extrabold">
                  {specs.length} câu
                </td>
                <td className="p-2.5 text-center border-r border-slate-200 font-black text-emerald-800 text-sm">
                  {totalPoints.toFixed(1)} đ
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

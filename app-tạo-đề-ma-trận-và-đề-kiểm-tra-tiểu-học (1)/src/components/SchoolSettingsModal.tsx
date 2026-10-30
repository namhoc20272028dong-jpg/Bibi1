import React from 'react';
import { SchoolHeader } from '../types/exam';
import { X, Building2, Calendar, Clock, User, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  header: SchoolHeader;
  onChange: (header: SchoolHeader) => void;
}

export const SchoolSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  header,
  onChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-emerald-200" />
            <div>
              <h3 className="font-bold text-lg leading-tight">Cấu hình Đơn vị & Tiêu đề Đề thi</h3>
              <p className="text-xs text-emerald-100">Chuẩn hành chính sư phạm tiểu học</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-slate-800 text-sm">
          <div>
            <label className="block font-semibold mb-1 text-slate-700">Cơ quan quản lý cấp trên (Dòng 1):</label>
            <input
              type="text"
              value={header.agency}
              onChange={(e) => onChange({ ...header, agency: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              placeholder="VD: UBND XÃ XÍN MẦN hoặc PHÒNG GD&ĐT..."
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700">Tên trường (Dòng 2):</label>
            <input
              type="text"
              value={header.schoolName}
              onChange={(e) => onChange({ ...header, schoolName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
              placeholder="VD: TRƯỜNG PTDTBT TH CHÍ CÀ"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700">Tiêu đề bài kiểm tra:</label>
            <input
              type="text"
              value={header.examTitle}
              onChange={(e) => onChange({ ...header, examTitle: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-bold text-emerald-900"
              placeholder="VD: ĐỀ KIỂM TRA ĐỊNH KÌ GIỮA HỌC KÌ I"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Năm học:
              </label>
              <input
                type="text"
                value={header.schoolYear}
                onChange={(e) => onChange({ ...header, schoolYear: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                placeholder="NĂM HỌC 2026 - 2027"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                Thời gian làm bài:
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={header.durationMinutes}
                  onChange={(e) => onChange({ ...header, durationMinutes: Number(e.target.value) || 40 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-l-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  min={15}
                  max={90}
                />
                <span className="bg-slate-100 border border-l-0 border-slate-300 px-3 py-2 rounded-r-lg text-slate-600 text-xs">
                  phút
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                Giáo viên ra đề:
              </label>
              <input
                type="text"
                value={header.teacherName || ''}
                onChange={(e) => onChange({ ...header, teacherName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                placeholder="Tên giáo viên"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700">Lớp / Khối lớp:</label>
              <input
                type="text"
                value={header.classGroup || `Lớp ${header.grade}`}
                onChange={(e) => onChange({ ...header, classGroup: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                placeholder="Lớp 4A1..."
              />
            </div>
          </div>

          {/* Quick preset */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800">
            <span className="font-bold">Gợi ý đơn vị chuẩn yêu cầu:</span>
            <p className="mt-0.5">UBND XÃ XÍN MẦN - TRƯỜNG PTDTBT TH CHÍ CÀ - NĂM HỌC 2026 - 2027</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition"
          >
            Đóng
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium shadow-xs flex items-center gap-1.5 transition"
          >
            <Check className="w-4 h-4" />
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

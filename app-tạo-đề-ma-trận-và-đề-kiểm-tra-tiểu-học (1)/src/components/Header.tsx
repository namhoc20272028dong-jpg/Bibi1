import React from 'react';
import { GradeLevel, SubjectName, TermName, SchoolHeader } from '../types/exam';
import {
  GraduationCap,
  Sparkles,
  Settings,
  BookOpen,
  Calendar,
  Building,
} from 'lucide-react';

interface Props {
  grade: GradeLevel;
  onGradeChange: (grade: GradeLevel) => void;
  subject: SubjectName;
  onSubjectChange: (subject: SubjectName) => void;
  term: TermName;
  onTermChange: (term: TermName) => void;
  header: SchoolHeader;
  onOpenSettings: () => void;
  aiConnected: boolean;
}

const GRADES: GradeLevel[] = [1, 2, 3, 4, 5];

const SUBJECTS: SubjectName[] = [
  'Toán',
  'Tiếng Việt',
  'Lịch sử và Địa lí',
  'Khoa học',
  'Công nghệ',
  'Tin học',
  'Đạo đức',
  'Tự nhiên và Xã hội',
];

const TERMS: TermName[] = [
  'Giữa Học kì I',
  'Cuối Học kì I',
  'Giữa Học kì II',
  'Cuối Năm học',
];

export const Header: React.FC<Props> = ({
  grade,
  onGradeChange,
  subject,
  onSubjectChange,
  term,
  onTermChange,
  header,
  onOpenSettings,
  aiConnected,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner with Administrative School Information */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white px-4 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-100 flex-wrap justify-center md:justify-start">
            <Building className="w-4 h-4 text-emerald-300 shrink-0" />
            <span className="font-semibold text-white uppercase tracking-wider">{header.agency}</span>
            <span className="text-emerald-400">|</span>
            <span className="font-bold text-amber-300 uppercase tracking-wide">{header.schoolName}</span>
            <span className="text-emerald-400">|</span>
            <span className="bg-emerald-700/80 px-2 py-0.5 rounded-full font-medium text-emerald-100">
              {header.schoolYear}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2.5 py-0.5 rounded-full text-[11px] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {aiConnected ? 'AI Gemini 3.8 Flash Cốt Cán' : 'Chuyên gia GDPT 2018 Sẵn sàng'}
            </span>
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer"
              title="Đổi tên trường, cơ quan, năm học"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Cấu hình tiêu đề</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header & Selectors Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-tight">
                  APP TẠO ĐỀ MA TRẬN VÀ ĐỀ KIỂM TRA TIỂU HỌC
                </h1>
                <span className="hidden sm:inline-block bg-teal-100 text-teal-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border border-teal-300">
                  GDPT 2018 - TT 27
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600 inline" />
                <span>Bộ sách Kết nối tri thức với cuộc sống</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-medium">Đầy đủ Ma trận, Đặc tả, Đề thi, Đáp án & Sửa điểm</span>
              </p>
            </div>
          </div>

          {/* Quick Selectors (Khối lớp, Môn học, Học kì) */}
          <div className="flex items-center gap-2.5 flex-wrap bg-slate-50 p-2 rounded-xl border border-slate-200">
            {/* Grade Tabs */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
              {GRADES.map((g) => (
                <button
                  key={g}
                  onClick={() => onGradeChange(g)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                    grade === g
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Lớp {g}
                </button>
              ))}
            </div>

            {/* Subject Dropdown */}
            <div className="relative">
              <select
                value={subject}
                onChange={(e) => onSubjectChange(e.target.value as SubjectName)}
                className="bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-lg px-3 py-1.5 pr-8 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden appearance-none cursor-pointer shadow-2xs"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    Môn {s}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 text-xs">
                ▼
              </div>
            </div>

            {/* Term Dropdown */}
            <div className="relative">
              <select
                value={term}
                onChange={(e) => onTermChange(e.target.value as TermName)}
                className="bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-lg px-3 py-1.5 pr-8 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden appearance-none cursor-pointer shadow-2xs"
              >
                {TERMS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

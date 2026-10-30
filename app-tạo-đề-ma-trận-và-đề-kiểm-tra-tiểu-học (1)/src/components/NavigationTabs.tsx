import React from 'react';
import {
  ListChecks,
  Target,
  TableProperties,
  FileSpreadsheet,
  FileCheck,
  Grid3X3,
  Printer,
} from 'lucide-react';

export type TabKey =
  | 'lessons'
  | 'knowledge'
  | 'matrix'
  | 'specifications'
  | 'exam'
  | 'grid'
  | 'summary';

interface Props {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  examQuestionsCount?: number;
  totalPoints?: number;
}

interface TabDef {
  key: TabKey;
  number: number;
  label: string;
  sub: string;
  icon: React.ElementType;
}

const TABS: TabDef[] = [
  {
    key: 'lessons',
    number: 1,
    label: 'Danh sách bài học',
    sub: 'Sách Kết nối tri thức',
    icon: ListChecks,
  },
  {
    key: 'knowledge',
    number: 2,
    label: 'Kiến thức trọng tâm',
    sub: 'Yêu cầu cần đạt 2018',
    icon: Target,
  },
  {
    key: 'matrix',
    number: 3,
    label: 'Ma trận đề kiểm tra',
    sub: 'Tỉ lệ 50-30-20% & TN/TL',
    icon: TableProperties,
  },
  {
    key: 'specifications',
    number: 4,
    label: 'Bản đặc tả',
    sub: 'Mô tả chi tiết câu hỏi',
    icon: FileSpreadsheet,
  },
  {
    key: 'exam',
    number: 5,
    label: 'Đề và Đáp án',
    sub: 'Sửa điểm & sửa đề trực tiếp',
    icon: FileCheck,
  },
  {
    key: 'grid',
    number: 6,
    label: 'Lưới ô vuông Toán',
    sub: 'Vẽ hình trực quan Lớp 1-5',
    icon: Grid3X3,
  },
  {
    key: 'summary',
    number: 7,
    label: 'Tổng hợp & Xuất bản',
    sub: 'Xuất file Word, In ấn A4',
    icon: Printer,
  },
];

export const NavigationTabs: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  examQuestionsCount = 10,
  totalPoints = 10,
}) => {
  return (
    <nav className="bg-slate-100 border-b border-slate-200 sticky top-[108px] z-30 overflow-x-auto no-scrollbar shadow-xs">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex space-x-1 py-1.5 min-w-max">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="text-xs flex items-center gap-1.5">
                  <span
                    className={`inline-block px-1 py-0.2 rounded text-[10px] font-bold ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    Mục {tab.number}
                  </span>
                  <span>{tab.label}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[130px]">
                  {tab.key === 'exam' ? `${examQuestionsCount} câu • ${totalPoints} điểm` : tab.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

import React, { useState } from 'react';
import {
  ExamPackage,
  SchoolHeader,
  MatrixRow,
  SpecificationItem,
  QuestionItem,
  ReadingPassage,
  WritingSection,
  OralReadingSection,
} from '../types/exam';
import {
  Printer,
  Download,
  Copy,
  Check,
  FileText,
  FileSpreadsheet,
  TableProperties,
  Award,
  Sparkles,
  Share2,
} from 'lucide-react';

interface Props {
  examData: ExamPackage;
}

export const SummaryExportView: React.FC<Props> = ({ examData }) => {
  const [copied, setCopied] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [activeSection, setActiveSection] = useState<'all' | 'matrix' | 'spec' | 'exam' | 'rubric'>('all');

  const {
    header,
    readingPassage,
    questions,
    writingSection,
    oralReadingSection,
    matrixRows,
    specifications,
  } = examData;

  // Handle Word (.doc) export with official Microsoft Word XML/HTML styling
  const handleExportWord = () => {
    setDownloadingDocx(true);
    try {
      const docHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${header.examTitle} - MÔN ${header.subject.toUpperCase()}</title>
        <style>
          @page {
            size: 21.0cm 29.7cm; /* A4 */
            margin: 2.0cm 1.5cm 2.0cm 2.0cm;
            mso-page-orientation: portrait;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 13pt;
            line-height: 1.35;
            color: #000;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 12px 0;
            font-size: 11pt;
          }
          th, td {
            border: 1px solid #000;
            padding: 6px 8px;
          }
          th {
            background-color: #f2f2f2;
            text-align: center;
            font-weight: bold;
          }
          .header-table {
            width: 100%;
            border: none;
            margin-bottom: 20px;
          }
          .header-table td {
            border: none;
            padding: 2px 4px;
            vertical-align: top;
          }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .uppercase { text-transform: uppercase; }
          .page-break { page-break-before: always; }
        </style>
      </head>
      <body>
        <!-- PHẦN I: MA TRẬN ĐỀ KIỂM TRA -->
        <table class="header-table">
          <tr>
            <td style="width: 45%; text-align: center;">
              <b>${header.agency.toUpperCase()}</b><br>
              <b><u>${header.schoolName.toUpperCase()}</u></b>
            </td>
            <td style="width: 55%; text-align: center;">
              <b>MA TRẬN ĐỀ KIỂM TRA ĐỊNH KÌ</b><br>
              <b>${header.schoolYear.toUpperCase()}</b><br>
              <b>MÔN: ${header.subject.toUpperCase()} - LỚP ${header.grade}</b>
            </td>
          </tr>
        </table>

        <table>
          <thead>
            <tr>
              <th rowspan="3">STT</th>
              <th rowspan="3">Mạch kiến thức, kĩ năng</th>
              <th colspan="4">Mức 1</th>
              <th colspan="4">Mức 2</th>
              <th colspan="4">Mức 3</th>
              <th colspan="2" rowspan="2">Tổng cộng</th>
            </tr>
            <tr>
              <th colspan="2">TNKQ</th>
              <th colspan="2">Tự luận</th>
              <th colspan="2">TNKQ</th>
              <th colspan="2">Tự luận</th>
              <th colspan="2">TNKQ</th>
              <th colspan="2">Tự luận</th>
            </tr>
            <tr>
              <th>Câu</th><th>Điểm</th><th>Câu</th><th>Điểm</th>
              <th>Câu</th><th>Điểm</th><th>Câu</th><th>Điểm</th>
              <th>Câu</th><th>Điểm</th><th>Câu</th><th>Điểm</th>
              <th>Câu</th><th>Điểm</th>
            </tr>
          </thead>
          <tbody>
            ${matrixRows
              .map(
                (r, i) => `
              <tr>
                <td class="center">${i + 1}</td>
                <td>${r.strand}</td>
                <td class="center">${r.m1_tn_count}</td>
                <td class="center">${r.m1_tn_pts}</td>
                <td class="center">${r.m1_tl_count}</td>
                <td class="center">${r.m1_tl_pts}</td>
                <td class="center">${r.m2_tn_count}</td>
                <td class="center">${r.m2_tn_pts}</td>
                <td class="center">${r.m2_tl_count}</td>
                <td class="center">${r.m2_tl_pts}</td>
                <td class="center">${r.m3_tn_count}</td>
                <td class="center">${r.m3_tn_pts}</td>
                <td class="center">${r.m3_tl_count}</td>
                <td class="center">${r.m3_tl_pts}</td>
                <td class="center bold">${r.total_count}</td>
                <td class="center bold">${r.total_pts.toFixed(1)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="page-break"></div>

        <!-- PHẦN II: BẢN ĐẶC TẢ MA TRẬN -->
        <h3 class="center uppercase">BẢN ĐẶC TẢ MA TRẬN ĐỀ KIỂM TRA ĐỊNH KÌ</h3>
        <p class="center"><b>Môn: ${header.subject} - Lớp ${header.grade} - ${header.schoolYear}</b></p>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mạch kiến thức</th>
              <th>Đơn vị kiến thức</th>
              <th>Mức độ đánh giá / Yêu cầu cần đạt</th>
              <th>Hình thức</th>
              <th>Mức độ</th>
              <th>Câu</th>
              <th>Điểm</th>
            </tr>
          </thead>
          <tbody>
            ${specifications
              .map(
                (s, i) => `
              <tr>
                <td class="center">${i + 1}</td>
                <td>${s.strand}</td>
                <td>${s.content}</td>
                <td>${s.standard}</td>
                <td class="center">${s.questionType}</td>
                <td class="center">${s.level}</td>
                <td class="center bold">${s.questionNumber}</td>
                <td class="center bold">${s.points.toFixed(1)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="page-break"></div>

        <!-- PHẦN III: ĐỀ KIỂM TRA HỌC SINH -->
        <table class="header-table">
          <tr>
            <td style="width: 45%; text-align: center;">
              <b>${header.agency.toUpperCase()}</b><br>
              <b><u>${header.schoolName.toUpperCase()}</u></b><br>
              <br>
              Họ và tên: ............................................<br>
              Lớp: ${header.grade}......
            </td>
            <td style="width: 55%; text-align: center;">
              <b>${header.examTitle.toUpperCase()}</b><br>
              <b>${header.schoolYear.toUpperCase()}</b><br>
              <b>MÔN: ${header.subject.toUpperCase()} - LỚP ${header.grade}</b><br>
              <i>Thời gian làm bài: ${header.durationMinutes} phút</i>
            </td>
          </tr>
        </table>

        <!-- Khung điểm số & lời phê -->
        <table style="margin-bottom: 20px;">
          <tr>
            <td style="width: 30%; height: 70px; text-align: center; vertical-align: top;">
              <b>ĐIỂM</b><br>
              <i>(Bằng số và chữ)</i>
            </td>
            <td style="width: 70%; text-align: center; vertical-align: top;">
              <b>LỜI NHẬN XÉT CỦA GIÁO VIÊN</b><br>
              <br>
              ...........................................................................................................
            </td>
          </tr>
        </table>

        ${
          readingPassage
            ? `
          <div style="background-color: #fcfcfc; border: 1px solid #ccc; padding: 12px; margin-bottom: 15px;">
            <p class="center bold uppercase">${readingPassage.title}</p>
            <p style="text-align: justify; font-style: italic;">${readingPassage.content.replace(/\n/g, '<br>')}</p>
            <p style="text-align: right; font-style: italic;">(${readingPassage.author})</p>
          </div>
        `
            : ''
        }

        <p><b>A. CÂU HỎI KIỂM TRA:</b></p>
        ${questions
          .map(
            (q) => `
          <div style="margin-bottom: 14px;">
            <p><b>Câu ${q.number} (${q.points} điểm):</b> ${q.questionText}</p>
            ${
              q.type === 'multiple_choice' && q.options
                ? `
              <table style="border: none; width: 100%;">
                <tr>
                  <td style="border: none; width: 50%;">${q.options[0] || ''}</td>
                  <td style="border: none; width: 50%;">${q.options[1] || ''}</td>
                </tr>
                <tr>
                  <td style="border: none; width: 50%;">${q.options[2] || ''}</td>
                  <td style="border: none; width: 50%;">${q.options[3] || ''}</td>
                </tr>
              </table>
            `
                : `<p><i>(Học sinh làm bài trực tiếp vào khoảng trống dưới đây)</i></p><br><br><br>`
            }
          </div>
        `
          )
          .join('')}

        ${
          writingSection
            ? `
          <div style="margin-top: 20px;">
            <p><b>B. KIỂM TRA VIẾT (${writingSection.points} điểm):</b></p>
            <p>${writingSection.prompt}</p>
            <p><i>Bài làm:</i></p>
            <p>........................................................................................................................................................</p>
            <p>........................................................................................................................................................</p>
            <p>........................................................................................................................................................</p>
            <p>........................................................................................................................................................</p>
          </div>
        `
            : ''
        }

        <div class="page-break"></div>

        <!-- PHẦN IV: ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM -->
        <h3 class="center uppercase">HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN CHI TIẾT</h3>
        <p class="center"><b>Môn: ${header.subject} - Lớp ${header.grade} - ${header.schoolYear}</b></p>

        <table>
          <thead>
            <tr>
              <th style="width: 12%;">Câu</th>
              <th style="width: 18%;">Đáp án</th>
              <th style="width: 12%;">Điểm</th>
              <th>Hướng dẫn chấm chi tiết</th>
            </tr>
          </thead>
          <tbody>
            ${questions
              .map(
                (q) => `
              <tr>
                <td class="center bold">Câu ${q.number}</td>
                <td class="center bold">${q.correctAnswer || 'Tự luận'}</td>
                <td class="center bold">${q.points} đ</td>
                <td>${(q.rubric || '').replace(/\n/g, '<br>')}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </body>
      </html>
      `;

      const blob = new Blob(['\ufeff', docHtml], {
        type: 'application/msword;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Bo_De_Kiem_Tra_${header.subject}_Lop_${header.grade}_${header.schoolYear.replace(/\s+/g, '_')}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Word export error:', err);
    } finally {
      setTimeout(() => setDownloadingDocx(false), 800);
    }
  };

  // Browser Direct Print
  const handlePrint = () => {
    window.print();
  };

  // Copy plain text
  const handleCopyText = () => {
    let fullText = `${header.agency.toUpperCase()}\n${header.schoolName.toUpperCase()}\n${header.examTitle.toUpperCase()}\n${header.schoolYear}\nMÔN: ${header.subject.toUpperCase()} - LỚP ${header.grade}\n\n`;

    if (readingPassage) {
      fullText += `--- BÀI ĐỌC ---\n${readingPassage.title}\n${readingPassage.content}\n(${readingPassage.author})\n\n`;
    }

    fullText += `--- CÂU HỎI KIỂM TRA ---\n`;
    questions.forEach((q) => {
      fullText += `Câu ${q.number} (${q.points} điểm): ${q.questionText}\n`;
      if (q.options) {
        q.options.forEach((opt) => (fullText += `  ${opt}\n`));
      }
      fullText += `  Đáp án / Barem: ${q.correctAnswer || ''} - ${q.rubric}\n\n`;
    });

    if (writingSection) {
      fullText += `--- VIẾT (${writingSection.points} điểm) ---\n${writingSection.prompt}\n`;
    }

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-white border border-emerald-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-700 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                Mục 7
              </span>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">
                Tổng hợp & Xuất bản Hồ sơ Đề kiểm tra
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
              <span>Đơn vị: <strong>{header.agency} - {header.schoolName}</strong></span>
              <span>•</span>
              <span>Đầy đủ 5 thành phần: Ma trận • Đặc tả • Đề thi • Đáp án & Hướng dẫn chấm • Barem</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleExportWord}
              disabled={downloadingDocx}
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-blue-700/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingDocx ? 'Đang tạo file Word...' : 'Tải file Word (.doc)'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In ấn / Xuất PDF (A4)</span>
            </button>

            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold px-3 py-2.5 rounded-xl text-xs shadow-2xs transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Đã sao chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Sao chép toàn bộ</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section Filter */}
        <div className="mt-4 pt-4 border-t border-emerald-200/60 flex items-center gap-2 flex-wrap text-xs">
          <span className="font-semibold text-slate-600">Xem nhanh phần:</span>
          {[
            { id: 'all', name: 'Toàn bộ hồ sơ' },
            { id: 'matrix', name: '1. Ma trận đề' },
            { id: 'spec', name: '2. Bản đặc tả' },
            { id: 'exam', name: '3. Đề kiểm tra học sinh' },
            { id: 'rubric', name: '4. Hướng dẫn chấm & Đáp án' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                activeSection === sec.id
                  ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {sec.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Document Preview Container (Styled like a clean A4 printed paper) */}
      <div className="bg-white rounded-2xl border border-slate-300 p-8 shadow-md text-slate-900 max-w-4xl mx-auto space-y-10 print:border-none print:shadow-none print:p-0">
        {/* SECTION 1: MA TRẬN ĐỀ THI */}
        {(activeSection === 'all' || activeSection === 'matrix') && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-xs font-bold uppercase text-slate-500">
                {header.agency} - {header.schoolName}
              </div>
              <h3 className="text-base font-black uppercase text-slate-900 mt-1">
                MA TRẬN ĐỀ KIỂM TRA ĐỊNH KÌ
              </h3>
              <p className="text-xs font-semibold text-slate-700">
                MÔN: {header.subject.toUpperCase()} - LỚP {header.grade} - {header.schoolYear}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-slate-300 text-center">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-300">
                    <th rowSpan={2} className="border-r border-slate-300 p-2 w-10">STT</th>
                    <th rowSpan={2} className="border-r border-slate-300 p-2 text-left">Mạch nội dung</th>
                    <th colSpan={2} className="border-r border-slate-300 p-1.5 bg-blue-50">Mức 1</th>
                    <th colSpan={2} className="border-r border-slate-300 p-1.5 bg-amber-50">Mức 2</th>
                    <th colSpan={2} className="border-r border-slate-300 p-1.5 bg-rose-50">Mức 3</th>
                    <th colSpan={2} className="p-1.5 bg-emerald-50">Tổng cộng</th>
                  </tr>
                  <tr className="bg-slate-50 font-semibold text-[11px] border-b border-slate-300">
                    <th className="border-r border-slate-300 p-1">TNKQ</th>
                    <th className="border-r border-slate-300 p-1">TL</th>
                    <th className="border-r border-slate-300 p-1">TNKQ</th>
                    <th className="border-r border-slate-300 p-1">TL</th>
                    <th className="border-r border-slate-300 p-1">TNKQ</th>
                    <th className="border-r border-slate-300 p-1">TL</th>
                    <th className="border-r border-slate-300 p-1">Số câu</th>
                    <th className="p-1">Điểm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {matrixRows.map((r, i) => (
                    <tr key={i}>
                      <td className="p-2 border-r border-slate-200 font-bold">{i + 1}</td>
                      <td className="p-2 border-r border-slate-200 text-left font-medium">{r.strand}</td>
                      <td className="p-2 border-r border-slate-200">{r.m1_tn_count} câu ({r.m1_tn_pts}đ)</td>
                      <td className="p-2 border-r border-slate-200">{r.m1_tl_count} câu ({r.m1_tl_pts}đ)</td>
                      <td className="p-2 border-r border-slate-200">{r.m2_tn_count} câu ({r.m2_tn_pts}đ)</td>
                      <td className="p-2 border-r border-slate-200">{r.m2_tl_count} câu ({r.m2_tl_pts}đ)</td>
                      <td className="p-2 border-r border-slate-200">{r.m3_tn_count} câu ({r.m3_tn_pts}đ)</td>
                      <td className="p-2 border-r border-slate-200">{r.m3_tl_count} câu ({r.m3_tl_pts}đ)</td>
                      <td className="p-2 border-r border-slate-200 font-bold">{r.total_count}</td>
                      <td className="p-2 font-bold text-emerald-800">{r.total_pts.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 2: BẢN ĐẶC TẢ */}
        {(activeSection === 'all' || activeSection === 'spec') && (
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <div className="text-center">
              <h3 className="text-base font-black uppercase text-slate-900">
                BẢN ĐẶC TẢ MA TRẬN ĐỀ KIỂM TRA
              </h3>
              <p className="text-xs font-semibold text-slate-700">
                Yêu cầu cần đạt và hình thức đánh giá chi tiết
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-300">
                    <th className="p-2 text-center w-10 border-r border-slate-300">STT</th>
                    <th className="p-2 text-left border-r border-slate-300">Mạch kiến thức & YCCĐ</th>
                    <th className="p-2 text-center w-24 border-r border-slate-300">Hình thức</th>
                    <th className="p-2 text-center w-20 border-r border-slate-300">Mức độ</th>
                    <th className="p-2 text-center w-16 border-r border-slate-300">Câu</th>
                    <th className="p-2 text-center w-16">Điểm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {specifications.map((s, i) => (
                    <tr key={i}>
                      <td className="p-2 text-center font-bold border-r border-slate-200">{i + 1}</td>
                      <td className="p-2 border-r border-slate-200">
                        <div className="font-bold text-slate-800">{s.content}</div>
                        <div className="text-slate-600 mt-0.5 leading-relaxed">{s.standard}</div>
                      </td>
                      <td className="p-2 text-center border-r border-slate-200">{s.questionType}</td>
                      <td className="p-2 text-center border-r border-slate-200 font-bold">{s.level}</td>
                      <td className="p-2 text-center border-r border-slate-200 font-bold text-emerald-900">{s.questionNumber}</td>
                      <td className="p-2 text-center font-bold text-emerald-900">{s.points.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 3: ĐỀ THI HỌC SINH */}
        {(activeSection === 'all' || activeSection === 'exam') && (
          <div className="space-y-6 pt-6 border-t border-slate-200">
            {/* Exam Header */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-300">
              <div>
                <div className="text-xs font-bold uppercase">{header.agency}</div>
                <div className="text-sm font-extrabold uppercase underline decoration-slate-400">
                  {header.schoolName}
                </div>
                <div className="text-xs text-slate-600 mt-2">
                  Họ và tên: ................................................................ Lớp: {header.grade}...
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black uppercase text-emerald-950">
                  {header.examTitle}
                </div>
                <div className="text-xs font-bold text-slate-800">{header.schoolYear}</div>
                <div className="text-xs font-extrabold uppercase mt-1">
                  MÔN: {header.subject} - LỚP {header.grade}
                </div>
                <div className="text-xs italic text-slate-600">
                  (Thời gian làm bài: {header.durationMinutes} phút)
                </div>
              </div>
            </div>

            {/* Score & Teacher Note Box */}
            <div className="grid grid-cols-12 border border-slate-300 rounded-lg text-center text-xs divide-x divide-slate-300">
              <div className="col-span-3 p-2 bg-slate-50 font-bold">
                <span>ĐIỂM SỐ</span>
                <div className="h-8"></div>
              </div>
              <div className="col-span-6 p-2 text-left font-semibold">
                <span className="block font-bold text-center border-b border-slate-200 pb-1">
                  LỜI NHẬN XÉT CỦA GIÁO VIÊN
                </span>
                <div className="h-8"></div>
              </div>
              <div className="col-span-3 p-2 bg-slate-50 font-bold">
                <span>CHỮ KÝ GIÁO VIÊN</span>
                <div className="h-8"></div>
              </div>
            </div>

            {/* Reading Passage */}
            {readingPassage && (
              <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="text-center font-bold text-sm uppercase text-slate-900">
                  {readingPassage.title}
                </div>
                <p className="leading-relaxed text-slate-800 whitespace-pre-line text-justify">
                  {readingPassage.content}
                </p>
                <div className="text-right italic text-slate-600">({readingPassage.author})</div>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-4">
              <div className="font-bold text-xs uppercase text-slate-800 border-b border-slate-200 pb-1">
                PHẦN CÂU HỎI BÀI LÀM:
              </div>

              {questions.map((q) => (
                <div key={q.id} className="text-xs leading-relaxed space-y-1.5">
                  <p className="font-bold text-slate-900">
                    Câu {q.number} ({q.points} điểm):{' '}
                    <span className="font-normal">{q.questionText}</span>
                  </p>

                  {q.type === 'multiple_choice' && q.options && (
                    <div className="grid grid-cols-2 gap-2 pl-3">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="text-slate-800">
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'essay' && (
                    <div className="pl-3 text-slate-400 italic text-[11px] py-2">
                      Bài làm: ....................................................................................................................................
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Writing Section */}
            {writingSection && (
              <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
                <div className="font-bold uppercase text-slate-800">
                  PHẦN KIỂM TRA VIẾT ({writingSection.points} ĐIỂM):
                </div>
                <p className="font-semibold text-slate-900">{writingSection.prompt}</p>
                <div className="text-slate-400 italic text-[11px] pt-2">
                  Bài làm: ....................................................................................................................................
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 4: ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM */}
        {(activeSection === 'all' || activeSection === 'rubric') && (
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <div className="text-center">
              <h3 className="text-base font-black uppercase text-slate-900">
                ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM CHI TIẾT
              </h3>
              <p className="text-xs font-semibold text-slate-700">
                Barem chia điểm chuẩn Thông tư 27
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-300">
                    <th className="p-2 text-center w-14 border-r border-slate-300">Câu</th>
                    <th className="p-2 text-center w-24 border-r border-slate-300">Đáp án</th>
                    <th className="p-2 text-center w-16 border-r border-slate-300">Điểm</th>
                    <th className="p-2 text-left">Hướng dẫn chấm cụ thể</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {questions.map((q) => (
                    <tr key={q.id}>
                      <td className="p-2 text-center font-bold border-r border-slate-200">Câu {q.number}</td>
                      <td className="p-2 text-center font-extrabold text-emerald-800 border-r border-slate-200">
                        {q.correctAnswer || 'Tự luận'}
                      </td>
                      <td className="p-2 text-center font-bold text-emerald-900 border-r border-slate-200">
                        {q.points} đ
                      </td>
                      <td className="p-2 leading-relaxed whitespace-pre-line text-slate-700">{q.rubric}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Writing Rubric Breakdown */}
            {writingSection && (
              <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-slate-900">Barem chấm bài viết:</span>
                <div className="space-y-1">
                  {writingSection.criteria.map((c, i) => (
                    <div key={i} className="flex justify-between border-b border-slate-200/60 pb-1">
                      <span>• {c.name}: {c.desc}</span>
                      <span className="font-bold text-emerald-800">{c.points} điểm</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

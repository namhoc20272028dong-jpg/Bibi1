import React, { useState } from 'react';
import { GridShape, QuestionItem } from '../types/exam';
import {
  Grid3X3,
  Square,
  Maximize2,
  Check,
  Download,
  Copy,
  Plus,
  RefreshCw,
  Sparkles,
  Layers,
} from 'lucide-react';

interface Props {
  questions: QuestionItem[];
  onAttachToQuestion: (questionId: string, shape: GridShape) => void;
}

export const SquareGridCanvas: React.FC<Props> = ({
  questions,
  onAttachToQuestion,
}) => {
  const [gridSize, setGridSize] = useState<number>(8); // 8x8 grid
  const [selectedShape, setSelectedShape] = useState<
    'rectangle' | 'square' | 'triangle' | 'parallelogram' | 'trapezoid' | 'custom'
  >('rectangle');
  const [shapeWidth, setShapeWidth] = useState<number>(5);
  const [shapeHeight, setShapeHeight] = useState<number>(3);
  const [unit, setUnit] = useState<string>('cm');
  const [label, setLabel] = useState<string>('ABCD');
  const [fillColor, setFillColor] = useState<string>('rgba(16, 185, 129, 0.25)');
  const [strokeColor, setStrokeColor] = useState<string>('#047857');
  const [showGridNumbers, setShowGridNumbers] = useState<boolean>(true);
  const [targetQuestionId, setTargetQuestionId] = useState<string>(
    questions[8]?.id || questions[0]?.id || ''
  );
  const [attachedSuccess, setAttachedSuccess] = useState<boolean>(false);

  // SVG grid sizing
  const cellSize = 36;
  const padding = 30;
  const svgWidth = gridSize * cellSize + padding * 2;
  const svgHeight = gridSize * cellSize + padding * 2;

  // Compute vertices based on shape and params
  const getCoordinates = () => {
    const startX = 1;
    const startY = 1;

    switch (selectedShape) {
      case 'square':
        const side = Math.min(shapeWidth, gridSize - 2);
        return [
          { x: startX, y: startY, label: label[0] || 'A' },
          { x: startX + side, y: startY, label: label[1] || 'B' },
          { x: startX + side, y: startY + side, label: label[2] || 'C' },
          { x: startX, y: startY + side, label: label[3] || 'D' },
        ];
      case 'rectangle':
        const w = Math.min(shapeWidth, gridSize - 2);
        const h = Math.min(shapeHeight, gridSize - 2);
        return [
          { x: startX, y: startY, label: label[0] || 'A' },
          { x: startX + w, y: startY, label: label[1] || 'B' },
          { x: startX + w, y: startY + h, label: label[2] || 'C' },
          { x: startX, y: startY + h, label: label[3] || 'D' },
        ];
      case 'triangle':
        const tw = Math.min(shapeWidth, gridSize - 2);
        const th = Math.min(shapeHeight, gridSize - 2);
        return [
          { x: startX + Math.floor(tw / 2), y: startY, label: label[0] || 'A' },
          { x: startX + tw, y: startY + th, label: label[1] || 'B' },
          { x: startX, y: startY + th, label: label[2] || 'C' },
        ];
      case 'parallelogram':
        const pw = Math.min(shapeWidth, gridSize - 3);
        const ph = Math.min(shapeHeight, gridSize - 2);
        const shift = 1;
        return [
          { x: startX + shift, y: startY, label: label[0] || 'A' },
          { x: startX + shift + pw, y: startY, label: label[1] || 'B' },
          { x: startX + pw, y: startY + ph, label: label[2] || 'C' },
          { x: startX, y: startY + ph, label: label[3] || 'D' },
        ];
      case 'trapezoid':
        const topW = Math.max(2, Math.floor(shapeWidth / 2));
        const botW = Math.min(shapeWidth, gridSize - 2);
        const th_trap = Math.min(shapeHeight, gridSize - 2);
        return [
          { x: startX + 1, y: startY, label: label[0] || 'A' },
          { x: startX + 1 + topW, y: startY, label: label[1] || 'B' },
          { x: startX + botW, y: startY + th_trap, label: label[2] || 'C' },
          { x: startX, y: startY + th_trap, label: label[3] || 'D' },
        ];
      default:
        return [
          { x: 1, y: 1, label: 'A' },
          { x: 5, y: 1, label: 'B' },
          { x: 5, y: 4, label: 'C' },
          { x: 1, y: 4, label: 'D' },
        ];
    }
  };

  const coords = getCoordinates();
  const polygonPoints = coords
    .map((c) => `${padding + c.x * cellSize},${padding + c.y * cellSize}`)
    .join(' ');

  const handleAttach = () => {
    if (!targetQuestionId) return;
    const gridShape: GridShape = {
      gridSize,
      shapeType: selectedShape as any,
      coordinates: coords.map((c) => ({ x: c.x, y: c.y })),
      label: `Hình vẽ ${label} (${shapeWidth} x ${shapeHeight} ${unit})`,
      fillColor,
      unit,
    };
    onAttachToQuestion(targetQuestionId, gridShape);
    setAttachedSuccess(true);
    setTimeout(() => setAttachedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-white border border-emerald-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-700 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                Mục 6
              </span>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">
                Công cụ Vẽ hình trên Lưới ô vuông (Lớp 1 - 5)
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Đáp ứng chuẩn sư phạm GDPT 2018: Giáo viên dễ dàng tạo hình phẳng, hình học đo lường, tính chu vi diện tích trên lưới ô vuông chuẩn tập kẻ ô li.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-300">
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>Kẻ ô vuông 5 li / 1 cm</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Controls & Presets */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-5">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2 flex items-center gap-2">
            <Square className="w-4 h-4 text-emerald-600" />
            <span>Tùy chỉnh hình học & kích thước</span>
          </h3>

          {/* Shape Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Chọn dạng hình học:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'rectangle', name: 'Hình chữ nhật' },
                { id: 'square', name: 'Hình vuông' },
                { id: 'triangle', name: 'Hình tam giác' },
                { id: 'parallelogram', name: 'Hình bình hành' },
                { id: 'trapezoid', name: 'Hình thang' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedShape(s.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition text-left ${
                    selectedShape === s.id
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Độ dài cạnh đáy / Dài ({unit}):
              </label>
              <input
                type="number"
                min={2}
                max={gridSize - 1}
                value={shapeWidth}
                onChange={(e) => setShapeWidth(Number(e.target.value) || 2)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Chiều rộng / Cao ({unit}):
              </label>
              <input
                type="number"
                min={1}
                max={gridSize - 1}
                value={shapeHeight}
                onChange={(e) => setShapeHeight(Number(e.target.value) || 1)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-bold"
              />
            </div>
          </div>

          {/* Labels & Unit */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tên các đỉnh:</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value.toUpperCase())}
                placeholder="ABCD hoặc MNPQ"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-bold tracking-widest uppercase"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Đơn vị đo:</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
              >
                <option value="cm">cm (Xăng-ti-mét)</option>
                <option value="dm">dm (Đề-xi-mét)</option>
                <option value="m">m (Mét)</option>
                <option value="ô vuông">ô vuông (Số ô li)</option>
              </select>
            </div>
          </div>

          {/* Grid Settings */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kích cỡ lưới:</label>
              <select
                value={gridSize}
                onChange={(e) => setGridSize(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value={6}>6 x 6 ô</option>
                <option value={8}>8 x 8 ô (Chuẩn)</option>
                <option value={10}>10 x 10 ô</option>
                <option value={12}>12 x 12 ô</option>
              </select>
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={showGridNumbers}
                  onChange={(e) => setShowGridNumbers(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-sm"
                />
                <span>Hiện tọa độ ô</span>
              </label>
            </div>
          </div>

          {/* Color Fill */}
          <div className="text-xs space-y-1.5">
            <label className="block font-semibold text-slate-700">Màu tô diện tích:</label>
            <div className="flex items-center gap-2">
              {[
                { name: 'Xanh ngọc', fill: 'rgba(16, 185, 129, 0.25)', stroke: '#047857' },
                { name: 'Xanh dương', fill: 'rgba(59, 130, 246, 0.25)', stroke: '#1d4ed8' },
                { name: 'Cam đất', fill: 'rgba(249, 115, 22, 0.25)', stroke: '#c2410c' },
                { name: 'Tím', fill: 'rgba(168, 85, 247, 0.25)', stroke: '#7e22ce' },
              ].map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    setFillColor(c.fill);
                    setStrokeColor(c.stroke);
                  }}
                  className={`w-7 h-7 rounded-full border-2 transition ${
                    strokeColor === c.stroke ? 'ring-2 ring-slate-800 scale-110' : 'border-white'
                  }`}
                  style={{ backgroundColor: c.stroke }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Attach directly to Exam Question */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Chèn hình vẽ này vào Câu hỏi kiểm tra:
            </label>
            <div className="flex items-center gap-2">
              <select
                value={targetQuestionId}
                onChange={(e) => setTargetQuestionId(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium"
              >
                {questions.map((q) => (
                  <option key={q.id} value={q.id}>
                    Câu {q.number}: {q.questionText.slice(0, 32)}...
                  </option>
                ))}
              </select>
              <button
                onClick={handleAttach}
                className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition shrink-0 cursor-pointer"
              >
                {attachedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Đã chèn!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Chèn vào đề</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Interactive SVG Grid Canvas */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between mb-4 pb-2 border-b border-slate-100 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Grid3X3 className="w-4 h-4 text-emerald-600" />
              Lưới ô vuông tập học sinh (Mỗi cạnh ô = 1 {unit})
            </span>
            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
              Diện tích hình: {shapeWidth * shapeHeight} {unit}²
            </span>
          </div>

          {/* SVG Canvas */}
          <div className="p-4 bg-slate-50/60 rounded-2xl border border-slate-200 shadow-inner overflow-auto max-w-full">
            <svg
              width={svgWidth}
              height={svgHeight}
              className="bg-white rounded-xl shadow-xs"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
                backgroundSize: `${cellSize}px ${cellSize}px`,
                backgroundPosition: `${padding}px ${padding}px`,
              }}
            >
              {/* Outer border & Grid Lines */}
              <defs>
                <pattern
                  id="gridPattern"
                  width={cellSize}
                  height={cellSize}
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>

              <rect
                x={padding}
                y={padding}
                width={gridSize * cellSize}
                height={gridSize * cellSize}
                fill="url(#gridPattern)"
                stroke="#94a3b8"
                strokeWidth="2"
              />

              {/* Grid coordinate markers */}
              {showGridNumbers &&
                Array.from({ length: gridSize + 1 }).map((_, i) => (
                  <React.Fragment key={i}>
                    {/* Top markers */}
                    <text
                      x={padding + i * cellSize}
                      y={padding - 8}
                      fontSize="10"
                      fill="#64748b"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      {i}
                    </text>
                    {/* Left markers */}
                    <text
                      x={padding - 10}
                      y={padding + i * cellSize + 4}
                      fontSize="10"
                      fill="#64748b"
                      textAnchor="end"
                      fontFamily="sans-serif"
                    >
                      {i}
                    </text>
                  </React.Fragment>
                ))}

              {/* Drawn Polygon */}
              <polygon
                points={polygonPoints}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Vertices Dots & Labels */}
              {coords.map((c, i) => {
                const px = padding + c.x * cellSize;
                const py = padding + c.y * cellSize;
                return (
                  <g key={i}>
                    <circle cx={px} cy={py} r="4.5" fill="#0f172a" />
                    <text
                      x={px + (c.x > gridSize / 2 ? 10 : -10)}
                      y={py + (c.y > gridSize / 2 ? 14 : -8)}
                      fontSize="13"
                      fontWeight="bold"
                      fill="#0f172a"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      {c.label}
                    </text>
                  </g>
                );
              })}

              {/* Dimension indicators on sides */}
              <text
                x={padding + (coords[0].x + coords[1].x) * (cellSize / 2)}
                y={padding + coords[0].y * cellSize - 8}
                fontSize="11"
                fontWeight="bold"
                fill={strokeColor}
                textAnchor="middle"
              >
                {shapeWidth} {unit}
              </text>
              <text
                x={padding + coords[1].x * cellSize + 14}
                y={padding + (coords[1].y + coords[2].y) * (cellSize / 2) + 4}
                fontSize="11"
                fontWeight="bold"
                fill={strokeColor}
                textAnchor="start"
              >
                {shapeHeight} {unit}
              </text>
            </svg>
          </div>

          {/* Math teacher advice */}
          <div className="mt-4 text-xs text-slate-500 text-center max-w-md">
            Hình vẽ đã được tính toán chính xác theo chuẩn ô vuông. Khi bấm <strong>"Chèn vào đề"</strong>, hình này sẽ hiển thị trực quan trong bài thi của học sinh và khi xuất bản in/Word.
          </div>
        </div>
      </div>
    </div>
  );
};

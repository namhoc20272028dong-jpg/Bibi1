import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));
const port = process.env.PORT || 3000;

// Initialize Google Gemini AI Server Client
const apiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Endpoint to check AI status
app.get('/api/ai/status', (req, res) => {
  res.json({
    hasKey: Boolean(apiKey && apiKey.length > 5),
    model: 'gemini-3.8-flash',
  });
});

// Endpoint for AI suggestions: lessons, knowledge, matrix, specification, exam & answers
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { task, grade, subject, term, curriculum = 'Kết nối tri thức với cuộc sống', context, customPrompt } = req.body;

    if (!aiClient) {
      return res.status(503).json({
        error: 'Chưa cấu hình API Key cho Gemini AI. Vui lòng kiểm tra Settings > Secrets.',
        fallback: true,
      });
    }

    const systemInstruction = `Bạn là một Giáo viên Tiểu học cốt cán, chuyên gia hàng đầu về Chương trình Giáo dục phổ thông (GDPT) 2018 và Thông tư 27/2020/TT-BGDĐT về đánh giá học sinh tiểu học.
Bạn am hiểu sâu sắc bộ sách "Kết nối tri thức với cuộc sống" từ Lớp 1 đến Lớp 5 cho các môn: Toán, Tiếng Việt, Khoa học, Lịch sử và Địa lí, Công nghệ, Tin học, Đạo đức, Tự nhiên và Xã hội.
Bạn là Chuyên gia ra đề kiểm tra, xây dựng ma trận, bản đặc tả và hướng dẫn chấm barem chi tiết.
Quy tắc chuyên môn:
1. Đánh giá theo 3 mức độ (Mức 1: Nhận biết, Mức 2: Kết nối/Thông hiểu, Mức 3: Vận dụng). Tỉ lệ thông dụng: Mức 1 (50%), Mức 2 (30%), Mức 3 (20%).
2. Môn Toán: Thường 10 câu - 10 điểm (Trắc nghiệm 60-70%, Tự luận 30-40%). Mạch Số & Phép tính chiếm chủ đạo, Hình học & Đo lường, Thống kê & Xác suất theo đúng tỷ lệ thời lượng chương trình 2018. Lưu ý có hỗ trợ vẽ hình ô vuông.
3. Môn Tiếng Việt:
   - Lớp 4, 5: Đọc thành tiếng (3đ), Đọc hiểu (7đ với 11 câu: 4 TN đọc hiểu (2đ), 2 TL đọc hiểu (2đ), 4 TN kiến thức tiếng Việt (2đ), 1 TL kiến thức tiếng Việt (1đ)). Ngữ liệu đọc hiểu lấy NGOÀI sách giáo khoa, đúng dung lượng chuẩn số chữ (Lớp 4: truyện 280-330 từ, thơ 100-120 từ; Lớp 5: truyện 300-350 từ, thơ 110-130 từ). Viết đoạn văn (10đ) kèm barem chi tiết.
4. Môn Khoa học, Lịch sử & Địa lý, Công nghệ (Lớp 4, 5): 10 câu, 10 điểm, tỉ lệ TN 60% (6 câu x 1đ hoặc 6 câu), TL 40% (4 câu).
5. Trả về định dạng JSON hợp lệ theo yêu cầu, nội dung sư phạm chuẩn mực, câu từ trong sáng, giàu tính giáo dục.`;

    let userPrompt = '';

    if (task === 'lessons') {
      userPrompt = `Hãy liệt kê đầy đủ danh sách bài học và chủ đề môn ${subject} Lớp ${grade} kì ${term} thuộc bộ sách "${curriculum}".
Trả về kết quả dưới dạng JSON có cấu trúc:
{
  "curriculum": "${curriculum}",
  "grade": ${grade},
  "subject": "${subject}",
  "term": "${term}",
  "units": [
    {
      "topic": "Tên chủ đề / Mạch nội dung",
      "lessons": [
        { "id": "b1", "name": "Tên bài học", "weeks": "Tuần...", "periods": 3, "keyKnowledge": "Tóm tắt yêu cầu cần đạt chính" }
      ]
    }
  ],
  "note": "Ghi chú phân phối chương trình GDPT 2018"
}`;
    } else if (task === 'knowledge') {
      userPrompt = `Hãy tóm tắt và phân loại Kiến thức trọng tâm, Yêu cầu cần đạt (YCCĐ) theo Thông tư 27 và GDPT 2018 cho môn ${subject} Lớp ${grade} kì ${term} (bộ sách "${curriculum}").
Bối cảnh bổ sung: ${JSON.stringify(context || {})}
Trả về định dạng JSON:
{
  "strands": [
    {
      "strandName": "Tên mạch kiến thức (VD: Số và phép tính, Hình học và đo lường, ...)",
      "weightPercent": 70,
      "levels": {
        "level1": ["YCCĐ Mức 1: Nhận biết..."],
        "level2": ["YCCĐ Mức 2: Kết nối, thông hiểu..."],
        "level3": ["YCCĐ Mức 3: Vận dụng giải quyết vấn đề..."]
      }
    }
  ],
  "pedagogicalAdvice": "Lời khuyên sư phạm khi ôn tập và ra đề"
}`;
    } else if (task === 'matrix') {
      userPrompt = `Hãy lập Ma trận đề kiểm tra định kì chuẩn GDPT 2018 môn ${subject} Lớp ${grade} kì ${term} (Sách ${curriculum}).
Tỉ lệ mức: 50% Mức 1 - 30% Mức 2 - 20% Mức 3.
Tổng số câu: 10 câu (nếu là Tiếng Việt thì cấu trúc Đọc hiểu 11 câu 7 điểm + Đọc thành tiếng 3 điểm + Viết 10 điểm).
Bối cảnh/Tuỳ chọn: ${JSON.stringify(context || {})}
Trả về JSON:
{
  "title": "MA TRẬN ĐỀ KIỂM TRA ĐỊNH KÌ",
  "grade": ${grade},
  "subject": "${subject}",
  "term": "${term}",
  "totalPoints": 10,
  "matrixRows": [
    {
      "strand": "Tên mạch kiến thức",
      "m1_tn_count": 2, "m1_tn_pts": 2.0, "m1_tl_count": 0, "m1_tl_pts": 0,
      "m2_tn_count": 1, "m2_tn_pts": 1.0, "m2_tl_count": 1, "m2_tl_pts": 1.0,
      "m3_tn_count": 0, "m3_tn_pts": 0, "m3_tl_count": 1, "m3_tl_pts": 1.0,
      "total_count": 5, "total_pts": 5.0
    }
  ],
  "summary": {
    "tn_total_pts": 6.0, "tn_percent": 60,
    "tl_total_pts": 4.0, "tl_percent": 40,
    "m1_pts": 5.0, "m1_percent": 50,
    "m2_pts": 3.0, "m2_percent": 30,
    "m3_pts": 2.0, "m3_percent": 20
  }
}`;
    } else if (task === 'specification') {
      userPrompt = `Hãy xây dựng BẢN ĐẶC TẢ MA TRẬN ĐỀ KIỂM TRA môn ${subject} Lớp ${grade} kì ${term} (Bộ sách ${curriculum}).
Chi tiết từng mạch nội dung, yêu cầu cần đạt và phân bổ câu hỏi tương ứng.
Bối cảnh: ${JSON.stringify(context || {})}
Trả về JSON:
{
  "title": "BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KÌ",
  "specs": [
    {
      "order": 1,
      "strand": "Tên mạch kiến thức",
      "content": "Đơn vị kiến thức cụ thể",
      "standard": "Mức độ đánh giá / Yêu cầu cần đạt chi tiết",
      "questionType": "Trắc nghiệm" hoặc "Tự luận",
      "level": "Mức 1" | "Mức 2" | "Mức 3",
      "questionNumber": "Câu 1",
      "points": 1.0
    }
  ]
}`;
    } else if (task === 'exam') {
      userPrompt = `Hãy soạn thảo hoàn chỉnh ĐỀ KIỂM TRA ĐỊNH KÌ VÀ HƯỚNG DẪN CHẤM (ĐÁP ÁN, BAREM ĐIỂM) môn ${subject} Lớp ${grade} kì ${term} (Bộ sách ${curriculum}).
Tiêu đề chuẩn:
UBND XÃ XÍN MẦN
TRƯỜNG PTDTBT TH CHÍ CÀ
ĐỀ KIỂM TRA ĐỊNH KÌ ${term.toUpperCase()}
NĂM HỌC 2026 - 2027
MÔN: ${subject.toUpperCase()} - LỚP ${grade}
Thời gian: 40 phút (hoặc theo quy định).

Yêu cầu chi tiết:
- Đảm bảo đúng tỷ lệ Mức 1 (50%), Mức 2 (30%), Mức 3 (20%).
- Nếu là môn TOÁN: 10 câu 10 điểm (Trắc nghiệm + Tự luận rõ ràng, có bài toán tình huống thực tế hoặc hình học ô vuông).
- Nếu là môn TIẾNG VIỆT Lớp 4, 5:
  + Phần A: Kiểm tra đọc (10 điểm):
    1. Đọc thành tiếng (3 điểm): Gợi ý 3 đoạn đọc và câu hỏi phụ.
    2. Đọc hiểu và kiến thức tiếng Việt (7 điểm): Cho 1 văn bản mới ngoài SGK (dung lượng chuẩn ~280-330 từ), gồm 11 câu hỏi (4 câu TN đọc hiểu 2đ, 2 câu TL đọc hiểu 2đ, 4 câu TN KTTV 2đ, 1 câu TL KTTV 1đ).
  + Phần B: Kiểm tra viết (10 điểm): Đề bài viết đoạn văn / bài văn kèm barem hướng dẫn chấm chi tiết.
- Nếu là Lịch sử & Địa lý, Khoa học, Công nghệ: 10 câu (6 câu TN, 4 câu TL).
- Có Hướng dẫn chấm chi tiết từng câu, từng bước chia nhỏ điểm 0.25đ / 0.5đ / 1.0đ.

Bối cảnh / Lưu ý riêng từ giáo viên: ${customPrompt || ''} ${JSON.stringify(context || {})}

Trả về JSON có cấu trúc sau:
{
  "schoolHeader": {
    "agency": "UBND XÃ XÍN MẦN",
    "schoolName": "TRƯỜNG PTDTBT TH CHÍ CÀ",
    "examTitle": "ĐỀ KIỂM TRA ĐỊNH KÌ ${term.toUpperCase()}",
    "schoolYear": "NĂM HỌC 2026 - 2027",
    "subject": "${subject}",
    "grade": ${grade},
    "durationMinutes": 40
  },
  "readingPassage": {
    "title": "Tên bài đọc (dành cho Tiếng Việt)",
    "author": "Tác giả",
    "content": "Nội dung bài đọc ngoài SGK đúng số chữ..."
  },
  "questions": [
    {
      "id": "q1",
      "number": 1,
      "type": "multiple_choice" | "essay",
      "level": "Mức 1" | "Mức 2" | "Mức 3",
      "strand": "Số và phép tính / Đọc hiểu...",
      "questionText": "Nội dung câu hỏi...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A",
      "points": 1.0,
      "rubric": "Hướng dẫn chấm chi tiết, từng ý nhỏ...",
      "gridShape": null
    }
  ],
  "writingSection": {
    "prompt": "Đề bài viết văn (nếu là Tiếng Việt)",
    "points": 10,
    "criteria": [
      { "name": "Mở đoạn/bài", "points": 1.0, "desc": "Giới thiệu sinh động..." },
      { "name": "Thân đoạn/bài", "points": 6.0, "desc": "Nội dung chi tiết..." },
      { "name": "Kết đoạn/bài", "points": 1.0, "desc": "Bày tỏ cảm xúc..." },
      { "name": "Chính tả, từ ngữ, câu", "points": 1.0, "desc": "Đúng chuẩn ngữ pháp..." },
      { "name": "Sáng tạo", "points": 1.0, "desc": "Cách diễn đạt độc đáo..." }
    ]
  },
  "oralReadingSection": {
    "prompt": "Hướng dẫn kiểm tra đọc thành tiếng",
    "points": 3,
    "passages": ["Đoạn 1...", "Đoạn 2..."]
  }
}`;
    } else {
      userPrompt = customPrompt || `Hãy tạo nội dung hỗ trợ giáo viên về ${subject} Lớp ${grade} kì ${term}.`;
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    let parsedData = {};
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      // Fallback extract json from markdown
      const jsonMatch = responseText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        parsedData = { rawText: responseText };
      }
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Lỗi xử lý AI',
    });
  }
});

// Configure Vite middleware in development or static serving in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

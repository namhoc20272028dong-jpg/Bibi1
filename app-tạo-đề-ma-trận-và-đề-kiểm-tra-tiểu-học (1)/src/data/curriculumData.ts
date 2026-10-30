import {
  GradeLevel,
  SubjectName,
  TermName,
  LessonUnit,
  KnowledgeStrand,
  MatrixRow,
  SpecificationItem,
  QuestionItem,
  ReadingPassage,
  WritingSection,
  OralReadingSection,
} from '../types/exam';

// Bảng thời lượng chính thức GDPT 2018 cho môn Toán Tiểu học (Theo yêu cầu đề bài)
export const PROGRAM_2018_MATH_HOURS = {
  periods: { 1: 105, 2: 175, 3: 175, 4: 175, 5: 175 },
  strandsEstimate: {
    1: { so: 80, hh_dl: 15, tk_xs: 0, hdtn: 5 },
    2: { so: 75, hh_dl: 17, tk_xs: 3, hdtn: 5 },
    3: { so: 70, hh_dl: 22, tk_xs: 3, hdtn: 5 },
    4: { so: 75, hh_dl: 16, tk_xs: 4, hdtn: 5 },
    5: { so: 50, hh_dl: 40, tk_xs: 5, hdtn: 5 },
    all: { so: 69, hh_dl: 23, tk_xs: 3, hdtn: 5 },
  },
  detailedNotes: {
    1: 'Kì I: HH và ĐL = 11/54 tiết (20,37%); Cả năm: 29/105 tiết (27,61%). Tập huấn: Số = 18t/52 = 3.5đ; 21/52 = 4.5đ; HH và ĐL = 11/52 = 2.0đ.',
    2: 'CKì I: HH và ĐL = 28/90 tiết (31,1%); Cả năm: 45/175 tiết (25,7%).',
    3: 'CKì I: HH và ĐL = 23/90 tiết (25,55%); Cả năm: 45/175 tiết (25,7%).',
    4: 'GKI: HH và ĐL = 16/45 (35,55%); CKI: 44/90 (48,88%); GKII: 44/135 (32,59%); Cả năm: 47/175 (26,85%).',
    5: 'GKI: HH và ĐL = 8/45 (17,77%); CKI: 34/90 (37,77%); GKII: 75/135 (55,55%); Cả năm: 83/175 (47,42%).',
  },
};

// Cấu hình quy chuẩn theo từng môn học và khối lớp
export function getStandardCurriculumRatio(grade: GradeLevel, subject: SubjectName, term: TermName) {
  if (subject === 'Toán') {
    let soPercent = 70;
    let hhPercent = 30;
    let tkPercent = 0;

    if (grade === 1) {
      soPercent = 80;
      hhPercent = 20;
      tkPercent = 0;
    } else if (grade === 2 || grade === 3) {
      if (term.includes('I') && !term.includes('II')) {
        soPercent = 70;
        hhPercent = 30;
        tkPercent = 0;
      } else {
        soPercent = 70;
        hhPercent = 20;
        tkPercent = 10;
      }
    } else if (grade === 4) {
      if (term === 'Giữa Học kì I') {
        soPercent = 70;
        hhPercent = 30;
      } else if (term === 'Cuối Học kì I') {
        soPercent = 50;
        hhPercent = 50;
      } else if (term === 'Giữa Học kì II') {
        soPercent = 70;
        hhPercent = 30;
      } else {
        soPercent = 70;
        hhPercent = 20;
        tkPercent = 10;
      }
    } else if (grade === 5) {
      if (term === 'Giữa Học kì I') {
        soPercent = 80;
        hhPercent = 20;
      } else if (term === 'Cuối Học kì I') {
        soPercent = 60;
        hhPercent = 40;
      } else if (term === 'Giữa Học kì II') {
        soPercent = 50;
        hhPercent = 50;
      } else {
        soPercent = 50;
        hhPercent = 40;
        tkPercent = 10;
      }
    }

    return {
      levelsRatio: '50% (Mức 1) - 30% (Mức 2) - 20% (Mức 3)',
      questionFormatRatio: 'Trắc nghiệm 60-70% (6-7 câu) - Tự luận 30-40% (3-4 câu) - Tổng 10 câu 10 điểm',
      strands: [
        { name: 'Số và phép tính', percent: soPercent },
        { name: 'Hình học và đo lường', percent: hhPercent },
        ...(tkPercent > 0 ? [{ name: 'Một số yếu tố Thống kê và Xác suất', percent: tkPercent }] : []),
      ],
      drawingNote: 'Lưu ý: Vẽ hình trên lưới ô vuông (Lớp 1 - 5)',
    };
  }

  if (subject === 'Tiếng Việt') {
    return {
      levelsRatio: 'Mức 1 -> Mức 3: Khoảng 40% - 20% - 10%',
      questionFormatRatio:
        grade >= 4
          ? 'Đọc thành tiếng (3đ) + Đọc hiểu 11 câu (7đ) [4 TN ĐH (2đ), 2 TL ĐH (2đ), 4 TN KTTV (2đ), 1 TL KTTV (1đ)] + Viết đoạn văn (10đ)'
          : 'Đọc thành tiếng (3-4đ) + Đọc hiểu & KTTV (6-7đ) + Viết chính tả/đoạn văn (10đ)',
      textLengthRule:
        grade === 4
          ? 'Độ dài văn bản ngoài SGK: Truyện/kịch 280-330 chữ, miêu tả 200-250 chữ, thơ 100-120 chữ, thông tin 150-180 chữ'
          : grade === 5
          ? 'Độ dài văn bản ngoài SGK: Truyện/kịch 300-350 chữ, miêu tả 200-250 chữ, thơ 110-130 chữ, thông tin ~230 chữ'
          : 'Văn bản đọc ngoài SGK ngắn gọn, trong sáng, phù hợp lứa tuổi',
    };
  }

  // Các môn Lịch sử & Địa lí, Khoa học, Công nghệ
  return {
    levelsRatio: '50% (Mức 1) - 30% (Mức 2) - 20% (Mức 3)',
    questionFormatRatio: 'Trắc nghiệm 60% (6 câu x 1đ) - Tự luận 40% (4 câu x 1đ) - Tổng 10 câu 10 điểm',
    strands: [{ name: 'Chủ đề / Mạch kiến thức cốt lõi theo phân phối chương trình', percent: 100 }],
  };
}

// Dữ liệu mẫu bài học Sách Kết nối tri thức với cuộc sống
export const DEFAULT_LESSONS: Record<string, LessonUnit[]> = {
  // TOÁN LỚP 1
  'Toán_1_Giữa Học kì I': [
    {
      topic: 'Chủ đề 1: Các số từ 0 đến 10',
      lessons: [
        { id: 't1_1', name: 'Bài 1: Các số 1, 2, 3', weeks: 'Tuần 1', periods: 2, strand: 'Số và phép tính', keyKnowledge: 'Nhận biết, đọc, đếm số lượng 1, 2, 3' },
        { id: 't1_2', name: 'Bài 2: Các số 4, 5, 6', weeks: 'Tuần 2', periods: 2, strand: 'Số và phép tính', keyKnowledge: 'Đếm, so sánh các số đến 6' },
        { id: 't1_3', name: 'Bài 3: Các số 7, 8, 9, 10 và số 0', weeks: 'Tuần 3', periods: 3, strand: 'Số và phép tính', keyKnowledge: 'Đọc, viết, so sánh thứ tự từ 0 đến 10' },
        { id: 't1_4', name: 'Bài 4: So sánh số, nhiều hơn, ít hơn, bằng nhau', weeks: 'Tuần 4', periods: 3, strand: 'Số và phép tính', keyKnowledge: 'Sử dụng dấu >, <, =' },
      ],
    },
    {
      topic: 'Chủ đề 2: Làm quen với một số hình phẳng',
      lessons: [
        { id: 't1_5', name: 'Bài 5: Hình vuông, hình tròn, hình tam giác, hình chữ nhật', weeks: 'Tuần 5', periods: 3, strand: 'Hình học và đo lường', keyKnowledge: 'Nhận dạng hình phẳng qua đồ vật, vẽ hình trên lưới ô vuông' },
        { id: 't1_6', name: 'Bài 6: Khối lập phương, khối hộp chữ nhật', weeks: 'Tuần 6', periods: 2, strand: 'Hình học và đo lường', keyKnowledge: 'Phân biệt khối hình thực tế trong đời sống' },
      ],
    },
    {
      topic: 'Chủ đề 3: Phép cộng trong phạm vi 10',
      lessons: [
        { id: 't1_7', name: 'Bài 7: Phép cộng trong phạm vi 10', weeks: 'Tuần 7-9', periods: 6, strand: 'Số và phép tính', keyKnowledge: 'Ý nghĩa phép cộng, bảng cộng trong phạm vi 10' },
      ],
    },
  ],

  // TOÁN LỚP 4
  'Toán_4_Giữa Học kì I': [
    {
      topic: 'Chủ đề 1: Số có nhiều chữ số và phép tính',
      lessons: [
        { id: 't4_1', name: 'Bài 1: Ôn tập các số đến 100 000', weeks: 'Tuần 1', periods: 3, strand: 'Số và phép tính', keyKnowledge: 'Đọc, viết, cấu tạo thập phân số đến 100 000' },
        { id: 't4_2', name: 'Bài 2: Các số có sáu chữ số. Lớp triệu', weeks: 'Tuần 2-3', periods: 5, strand: 'Số và phép tính', keyKnowledge: 'Hàng và lớp: lớp đơn vị, lớp nghìn, lớp triệu; làm tròn số' },
        { id: 't4_3', name: 'Bài 3: So sánh các số có nhiều chữ số', weeks: 'Tuần 4', periods: 3, strand: 'Số và phép tính', keyKnowledge: 'So sánh số, sắp xếp thứ tự từ bé đến lớn và ngược lại' },
        { id: 't4_4', name: 'Bài 4: Phép cộng, phép trừ các số có nhiều chữ số', weeks: 'Tuần 5-6', periods: 6, strand: 'Số và phép tính', keyKnowledge: 'Thực hiện tính cộng, trừ không nhớ và có nhớ; giải bài toán có lời văn' },
      ],
    },
    {
      topic: 'Chủ đề 2: Hình học và đo lường',
      lessons: [
        { id: 't4_5', name: 'Bài 5: Góc nhọn, góc tù, góc bẹt', weeks: 'Tuần 7', periods: 3, strand: 'Hình học và đo lường', keyKnowledge: 'Nhận biết các loại góc bằng ê ke, vẽ trên lưới ô vuông' },
        { id: 't4_6', name: 'Bài 6: Hai đường thẳng vuông góc, song song', weeks: 'Tuần 8', periods: 3, strand: 'Hình học và đo lường', keyKnowledge: 'Nhận biết và vẽ hai đường thẳng song song, vuông góc trên lưới ô vuông' },
        { id: 't4_7', name: 'Bài 7: Yến, tạ, tấn và đơn vị đo thời gian thế kỉ', weeks: 'Tuần 9', periods: 3, strand: 'Hình học và đo lường', keyKnowledge: 'Chuyển đổi các đơn vị đo khối lượng và thế kỉ' },
      ],
    },
  ],

  // TOÁN LỚP 5
  'Toán_5_Giữa Học kì I': [
    {
      topic: 'Chủ đề 1: Phân số và số thập phân',
      lessons: [
        { id: 't5_1', name: 'Bài 1: Ôn tập về phân số và các phép tính với phân số', weeks: 'Tuần 1-2', periods: 6, strand: 'Số và phép tính', keyKnowledge: 'Cộng, trừ, nhân, chia phân số; rút gọn, quy đồng' },
        { id: 't5_2', name: 'Bài 2: Hỗn số và số thập phân', weeks: 'Tuần 3-4', periods: 7, strand: 'Số và phép tính', keyKnowledge: 'Khái niệm số thập phân, hàng của số thập phân, đọc viết số thập phân' },
        { id: 't5_3', name: 'Bài 3: So sánh và làm tròn số thập phân', weeks: 'Tuần 5-6', periods: 6, strand: 'Số và phép tính', keyKnowledge: 'So sánh hai số thập phân, viết các số theo thứ tự' },
      ],
    },
    {
      topic: 'Chủ đề 2: Đơn vị đo diện tích và hình học',
      lessons: [
        { id: 't5_4', name: 'Bài 4: Mi-li-mét vuông, héc-ta', weeks: 'Tuần 7-8', periods: 5, strand: 'Hình học và đo lường', keyKnowledge: 'Bảng đơn vị đo diện tích, mối liên hệ giữa các đơn vị' },
        { id: 't5_5', name: 'Bài 5: Lưới ô vuông và tính chu vi, diện tích hình chữ nhật, hình vuông', weeks: 'Tuần 9', periods: 4, strand: 'Hình học và đo lường', keyKnowledge: 'Vẽ hình và đếm diện tích trên lưới ô vuông, giải toán thực tế' },
      ],
    },
  ],

  // TIẾNG VIỆT LỚP 4
  'Tiếng Việt_4_Giữa Học kì I': [
    {
      topic: 'Chủ điểm 1: Mỗi người một vẻ',
      lessons: [
        { id: 'tv4_1', name: 'Bài 1: Điều kì diệu (Đọc) & Danh từ (Luyện từ và câu)', weeks: 'Tuần 1', periods: 7, strand: 'Đọc hiểu & Luyện từ và câu', keyKnowledge: 'Nhận biết danh từ chỉ người, vật, hiện tượng; đọc diễn cảm' },
        { id: 'tv4_2', name: 'Bài 2: Thi nhạc & Danh từ riêng, danh từ chung', weeks: 'Tuần 2', periods: 7, strand: 'Đọc hiểu & Luyện từ và câu', keyKnowledge: 'Quy tắc viết hoa danh từ riêng; tìm ý cho đoạn văn nêu tình cảm, cảm xúc' },
      ],
    },
    {
      topic: 'Chủ điểm 2: Trải nghiệm và khám phá',
      lessons: [
        { id: 'tv4_3', name: 'Bài 3: Lên rẫy & Động từ', weeks: 'Tuần 3-4', periods: 7, strand: 'Đọc hiểu & Luyện từ và câu', keyKnowledge: 'Nhận biết động từ chỉ hoạt động, trạng thái' },
        { id: 'tv4_4', name: 'Bài 4: Bầu trời trong quả trứng & Tính từ', weeks: 'Tuần 5-6', periods: 7, strand: 'Đọc hiểu & Luyện từ và câu', keyKnowledge: 'Nhận biết tính từ chỉ đặc điểm, màu sắc, hình dáng' },
        { id: 'tv4_5', name: 'Bài 5: Viết bài văn thuật lại một sự việc / đoạn văn tưởng tượng', weeks: 'Tuần 7-9', periods: 7, strand: 'Viết', keyKnowledge: 'Cấu trúc mở đoạn, thân đoạn, kết đoạn; diễn đạt mạch lạc' },
      ],
    },
  ],

  // LỊCH SỬ & ĐỊA LÍ LỚP 4
  'Lịch sử và Địa lí_4_Giữa Học kì I': [
    {
      topic: 'Chủ đề: Địa phương và Vùng Trung du miền núi Bắc Bộ',
      lessons: [
        { id: 'ls4_1', name: 'Bài 1: Làm quen với phương tiện học tập môn Lịch sử và Địa lí', weeks: 'Tuần 1-2', periods: 4, strand: 'Lịch sử và Địa lí', keyKnowledge: 'Sử dụng bản đồ, lược đồ, tranh ảnh, hiện vật lịch sử' },
        { id: 'ls4_2', name: 'Bài 2: Thiên nhiên và đời sống con người vùng Trung du và miền núi Bắc Bộ', weeks: 'Tuần 3-5', periods: 6, strand: 'Lịch sử và Địa lí', keyKnowledge: 'Địa hình, khí hậu, sông ngòi, ruộng bậc thang, nhà sàn' },
        { id: 'ls4_3', name: 'Bài 3: Lễ hội Đền Hùng và truyền thống uống nước nhớ nguồn', weeks: 'Tuần 6-8', periods: 5, strand: 'Lịch sử và Địa lí', keyKnowledge: 'Ý nghĩa lễ giỗ Tổ Hùng Vương, các hoạt động văn hóa' },
      ],
    },
  ],

  // KHOA HỌC LỚP 4
  'Khoa học_4_Giữa Học kì I': [
    {
      topic: 'Chủ đề: Chất và Năng lượng',
      lessons: [
        { id: 'kh4_1', name: 'Bài 1: Tính chất của nước và nước có ở đâu?', weeks: 'Tuần 1-3', periods: 6, strand: 'Khoa học', keyKnowledge: 'Nước không màu, không mùi, không vị; các thể của nước' },
        { id: 'kh4_2', name: 'Bài 2: Sự chuyển thể của nước và vòng tuần hoàn của nước', weeks: 'Tuần 4-6', periods: 6, strand: 'Khoa học', keyKnowledge: 'Bay hơi, ngưng tụ, đông đặc, nóng chảy; bảo vệ nguồn nước' },
        { id: 'kh4_3', name: 'Bài 3: Không khí quanh ta và tính chất của không khí', weeks: 'Tuần 7-9', periods: 6, strand: 'Khoa học', keyKnowledge: 'Không khí trong suốt, có thể nén lại hoặc giãn ra; vai trò của không khí' },
      ],
    },
  ],

  // CÔNG NGHỆ LỚP 4
  'Công nghệ_4_Giữa Học kì I': [
    {
      topic: 'Chủ đề: Công nghệ và Đời sống',
      lessons: [
        { id: 'cn4_1', name: 'Bài 1: Hoa và cây cảnh quanh em', weeks: 'Tuần 1-3', periods: 4, strand: 'Công nghệ', keyKnowledge: 'Lợi ích của hoa và cây cảnh; nhận biết một số loại hoa phổ biến' },
        { id: 'cn4_2', name: 'Bài 2: Vật liệu và dụng cụ trồng hoa, cây cảnh trong chậu', weeks: 'Tuần 4-6', periods: 5, strand: 'Công nghệ', keyKnowledge: 'Các loại chậu, giá thể, xẻng nhỏ, bình tưới nước' },
        { id: 'cn4_3', name: 'Bài 3: Gieo hạt và trồng hoa trong chậu', weeks: 'Tuần 7-9', periods: 5, strand: 'Công nghệ', keyKnowledge: 'Quy trình các bước gieo hạt, chăm sóc hoa đúng kĩ thuật' },
      ],
    },
  ],
};

// Mẫu kiến thức chuẩn GDPT 2018 theo 3 mức độ
export const DEFAULT_KNOWLEDGE_STRANDS: Record<string, KnowledgeStrand[]> = {
  Toán: [
    {
      strandName: 'Số và phép tính',
      weightPercent: 70,
      allocatedPeriods: 35,
      levels: {
        level1: [
          'Đọc, viết, so sánh số tự nhiên/phân số/số thập phân theo yêu cầu.',
          'Thực hiện được phép cộng, trừ, nhân, chia cơ bản trong bảng.',
          'Nhận biết thành phần và kết quả của phép tính.',
        ],
        level2: [
          'Thực hiện tính giá trị biểu thức số có chứa dấu ngoặc hoặc các phép tính liên hoàn.',
          'Tìm thành phần chưa biết của phép tính (tìm x, số hạng, thừa số).',
          'Vận dụng giải bài toán có từ 1 đến 2 bước tính liên quan đến số và phép tính.',
        ],
        level3: [
          'Vận dụng các tính chất giao hoán, kết hợp, phân phối để tính nhanh, tính bằng cách thuận tiện nhất.',
          'Giải quyết bài toán thực tế có nhiều bước tính, liên hệ đời sống (tính tiền, ước lượng, tỉ lệ).',
        ],
      },
    },
    {
      strandName: 'Hình học và đo lường',
      weightPercent: 30,
      allocatedPeriods: 15,
      levels: {
        level1: [
          'Nhận biết được tên gọi hình phẳng (tam giác, vuông, chữ nhật, bình hành, thoi) và góc (nhọn, tù, bẹt).',
          'Đổi được các đơn vị đo thông dụng cùng mạch đo lường (yến, tạ, tấn; dm, cm, m).',
        ],
        level2: [
          'Vẽ được hình và xác định các yếu tố cạnh, góc trên lưới ô vuông.',
          'Tính được chu vi, diện tích các hình đã học bằng công thức cơ bản.',
        ],
        level3: [
          'Giải bài toán tổng hợp kết hợp giữa đơn vị đo và diện tích, chu vi thực tế.',
          'Vẽ và phân tích hình ghép, tính diện tích phần gạch sọc trên lưới ô vuông.',
        ],
      },
    },
  ],

  'Tiếng Việt': [
    {
      strandName: 'Đọc hiểu văn bản (Ngoài SGK)',
      weightPercent: 40,
      levels: {
        level1: [
          'Nhận biết được nhân vật, chi tiết, thời gian, địa điểm cụ thể xuất hiện trực tiếp trong văn bản.',
          'Chọn được phương án trả lời đúng cho câu hỏi rõ nghĩa.',
        ],
        level2: [
          'Hiểu được ý nghĩa của một hình ảnh, câu nói hoặc hành động của nhân vật.',
          'Rút ra được bài học hoặc ý chính mà văn bản muốn gửi gắm.',
        ],
        level3: [
          'Bày tỏ suy nghĩ, tình cảm cá nhân trước hành động của nhân vật.',
          'Liên hệ thực tế bản thân và nêu việc làm cụ thể tương ứng với bài học.',
        ],
      },
    },
    {
      strandName: 'Kiến thức tiếng Việt',
      weightPercent: 30,
      levels: {
        level1: [
          'Nhận biết từ loại (danh từ, động từ, tính từ) hoặc dấu câu trong câu cho trước.',
          'Xác định đúng từ đồng nghĩa, từ trái nghĩa đơn giản.',
        ],
        level2: [
          'Đặt câu với từ cho trước hoặc chuyển đổi câu phù hợp ngữ cảnh.',
          'Nhận biết và phân tích tác dụng của biện pháp so sánh, nhân hóa.',
        ],
        level3: [
          'Viết lại câu văn giàu hình ảnh, sử dụng biện pháp tu từ sáng tạo.',
          'Chữa lỗi dùng từ, lỗi ngữ pháp trong câu văn.',
        ],
      },
    },
    {
      strandName: 'Viết đoạn văn / bài văn',
      weightPercent: 30,
      levels: {
        level1: ['Viết câu đúng ngữ pháp, không sai chính tả quá 3 lỗi.'],
        level2: ['Biết bố cục đoạn văn gồm Mở đoạn, Thân đoạn, Kết đoạn rõ ràng, đúng trọng tâm đề bài.'],
        level3: ['Diễn đạt truyền cảm, dùng từ gợi tả, gợi cảm, có liên tưởng sáng tạo và cảm xúc chân thành.'],
      },
    },
  ],
};

// Ma trận mẫu chuẩn Thông tư 27 (10 câu, 10 điểm, 50-30-20) cho môn Toán Lớp 4
export const DEFAULT_MATH_MATRIX_ROWS: MatrixRow[] = [
  {
    id: 'mr_1',
    strand: 'Số và phép tính (Đọc viết số, làm tròn, phép tính cộng trừ nhân chia)',
    topic: 'Chủ đề 1',
    m1_tn_count: 2,
    m1_tn_pts: 2.0,
    m1_tl_count: 1,
    m1_tl_pts: 1.0,
    m2_tn_count: 2,
    m2_tn_pts: 2.0,
    m2_tl_count: 1,
    m2_tl_pts: 1.0,
    m3_tn_count: 0,
    m3_tn_pts: 0,
    m3_tl_count: 1,
    m3_tl_pts: 1.0,
    total_count: 7,
    total_pts: 7.0,
  },
  {
    id: 'mr_2',
    strand: 'Hình học và đo lường (Góc, đường song song, lưới ô vuông, đơn vị đo)',
    topic: 'Chủ đề 2',
    m1_tn_count: 2,
    m1_tn_pts: 2.0,
    m1_tl_count: 0,
    m1_tl_pts: 0,
    m2_tn_count: 0,
    m2_tn_pts: 0,
    m2_tl_count: 0,
    m2_tl_pts: 0,
    m3_tn_count: 0,
    m3_tn_pts: 0,
    m3_tl_count: 1,
    m3_tl_pts: 1.0,
    total_count: 3,
    total_pts: 3.0,
  },
];

// Bản đặc tả mẫu môn Toán
export const DEFAULT_SPECIFICATIONS: SpecificationItem[] = [
  {
    id: 'sp_1',
    order: 1,
    strand: 'Số và phép tính',
    content: 'Số có nhiều chữ số',
    standard: 'Nhận biết giá trị của chữ số theo vị trí hàng, lớp trong một số tự nhiên.',
    questionType: 'Trắc nghiệm',
    level: 'Mức 1',
    questionNumber: 'Câu 1',
    points: 1.0,
  },
  {
    id: 'sp_2',
    order: 2,
    strand: 'Số và phép tính',
    content: 'Làm tròn số',
    standard: 'Làm tròn số đến hàng trăm nghìn hoặc hàng triệu.',
    questionType: 'Trắc nghiệm',
    level: 'Mức 1',
    questionNumber: 'Câu 2',
    points: 1.0,
  },
  {
    id: 'sp_3',
    order: 3,
    strand: 'Hình học và đo lường',
    content: 'Đơn vị đo khối lượng',
    standard: 'Nhận biết mối quan hệ giữa yến, tạ, tấn và kg.',
    questionType: 'Trắc nghiệm',
    level: 'Mức 1',
    questionNumber: 'Câu 3',
    points: 1.0,
  },
  {
    id: 'sp_4',
    order: 4,
    strand: 'Hình học và đo lường',
    content: 'Góc nhọn, góc tù, góc bẹt',
    standard: 'Nhận biết góc nhọn, góc vuông, góc tù, góc bẹt qua hình vẽ trên lưới ô vuông.',
    questionType: 'Trắc nghiệm',
    level: 'Mức 1',
    questionNumber: 'Câu 4',
    points: 1.0,
  },
  {
    id: 'sp_5',
    order: 5,
    strand: 'Số và phép tính',
    content: 'So sánh số',
    standard: 'So sánh và sắp xếp thứ tự các số có nhiều chữ số.',
    questionType: 'Trắc nghiệm',
    level: 'Mức 2',
    questionNumber: 'Câu 5',
    points: 1.0,
  },
  {
    id: 'sp_6',
    order: 6,
    strand: 'Số và phép tính',
    content: 'Tính giá trị biểu thức',
    standard: 'Tính đúng giá trị biểu thức chứa chữ hoặc có phép tính nhân/chia kết hợp.',
    questionType: 'Trắc nghiệm',
    level: 'Mức 2',
    questionNumber: 'Câu 6',
    points: 1.0,
  },
  {
    id: 'sp_7',
    order: 7,
    strand: 'Số và phép tính',
    content: 'Đặt tính rồi tính',
    standard: 'Thực hiện đặt tính và tính đúng phép cộng, phép trừ số có 6 chữ số có nhớ.',
    questionType: 'Tự luận',
    level: 'Mức 1',
    questionNumber: 'Câu 7',
    points: 1.0,
  },
  {
    id: 'sp_8',
    order: 8,
    strand: 'Số và phép tính',
    content: 'Tính bằng cách thuận tiện',
    standard: 'Áp dụng tính chất giao hoán, kết hợp để tính nhanh hợp lí.',
    questionType: 'Tự luận',
    level: 'Mức 2',
    questionNumber: 'Câu 8',
    points: 1.0,
  },
  {
    id: 'sp_9',
    order: 9,
    strand: 'Hình học và đo lường',
    content: 'Vẽ hình trên lưới ô vuông',
    standard: 'Vẽ hình chữ nhật trên lưới ô vuông và tính chu vi, diện tích.',
    questionType: 'Tự luận',
    level: 'Mức 3',
    questionNumber: 'Câu 9',
    points: 1.0,
  },
  {
    id: 'sp_10',
    order: 10,
    strand: 'Số và phép tính',
    content: 'Giải toán có lời văn',
    standard: 'Giải bài toán tìm hai số khi biết tổng và hiệu của hai số đó trong tình huống thực tế đời sống.',
    questionType: 'Tự luận',
    level: 'Mức 3',
    questionNumber: 'Câu 10',
    points: 1.0,
  },
];

// Ngân hàng câu hỏi mẫu chuẩn cho môn Toán Lớp 4 (10 câu, 10 điểm, chuẩn tiêu chí)
export const DEFAULT_MATH_QUESTIONS: QuestionItem[] = [
  {
    id: 'q1',
    number: 1,
    type: 'multiple_choice',
    level: 'Mức 1',
    strand: 'Số và phép tính',
    questionText: 'Trong số 3 584 219, chữ số 5 thuộc hàng nào, lớp nào?',
    options: [
      'A. Hàng trăm, lớp đơn vị',
      'B. Hàng trăm nghìn, lớp nghìn',
      'C. Hàng triệu, lớp triệu',
      'D. Hàng chục nghìn, lớp nghìn',
    ],
    correctAnswer: 'B',
    points: 1.0,
    rubric: 'Khoanh đúng phương án B cho 1,0 điểm.',
  },
  {
    id: 'q2',
    number: 2,
    type: 'multiple_choice',
    level: 'Mức 1',
    strand: 'Số và phép tính',
    questionText: 'Làm tròn số 482 630 đến hàng trăm nghìn ta được số nào?',
    options: ['A. 400 000', 'B. 480 000', 'C. 500 000', 'D. 490 000'],
    correctAnswer: 'C',
    points: 1.0,
    rubric: 'Khoanh đúng phương án C cho 1,0 điểm.',
  },
  {
    id: 'q3',
    number: 3,
    type: 'multiple_choice',
    level: 'Mức 1',
    strand: 'Hình học và đo lường',
    questionText: 'Số thích hợp điền vào chỗ chấm: 3 tấn 25 kg = ........ kg là:',
    options: ['A. 325 kg', 'B. 3 025 kg', 'C. 3 250 kg', 'D. 30 025 kg'],
    correctAnswer: 'B',
    points: 1.0,
    rubric: 'Khoanh đúng phương án B cho 1,0 điểm.',
  },
  {
    id: 'q4',
    number: 4,
    type: 'multiple_choice',
    level: 'Mức 1',
    strand: 'Hình học và đo lường',
    questionText: 'Trong các góc sau, góc nào là góc tù?',
    options: [
      'A. Góc có số đo bằng 90°',
      'B. Góc nhỏ hơn góc vuông',
      'C. Góc lớn hơn góc vuông và nhỏ hơn góc bẹt',
      'D. Góc bằng hai góc vuông gộp lại',
    ],
    correctAnswer: 'C',
    points: 1.0,
    rubric: 'Khoanh đúng phương án C cho 1,0 điểm.',
  },
  {
    id: 'q5',
    number: 5,
    type: 'multiple_choice',
    level: 'Mức 2',
    strand: 'Số và phép tính',
    questionText: 'Cho các số: 345 800; 345 089; 354 000; 345 901. Số bé nhất trong dãy số là:',
    options: ['A. 345 800', 'B. 345 089', 'C. 354 000', 'D. 345 901'],
    correctAnswer: 'B',
    points: 1.0,
    rubric: 'Khoanh đúng phương án B cho 1,0 điểm.',
  },
  {
    id: 'q6',
    number: 6,
    type: 'multiple_choice',
    level: 'Mức 2',
    strand: 'Số và phép tính',
    questionText: 'Giá trị của biểu thức m + n x 2 với m = 120, n = 40 là:',
    options: ['A. 320', 'B. 200', 'C. 240', 'D. 180'],
    correctAnswer: 'B',
    points: 1.0,
    rubric: 'Khoanh đúng phương án B cho 1,0 điểm. (Tính 40 x 2 = 80; 120 + 80 = 200).',
  },
  {
    id: 'q7',
    number: 7,
    type: 'essay',
    level: 'Mức 1',
    strand: 'Số và phép tính',
    questionText: 'Đặt tính rồi tính:\na) 438 526 + 245 382\nb) 725 418 - 362 175',
    points: 1.0,
    rubric: 'Đặt tính thẳng cột và tính đúng kết quả:\na) 438 526 + 245 382 = 683 908 (0,5 điểm)\nb) 725 418 - 362 175 = 363 243 (0,5 điểm)',
  },
  {
    id: 'q8',
    number: 8,
    type: 'essay',
    level: 'Mức 2',
    strand: 'Số và phép tính',
    questionText: 'Tính bằng cách thuận tiện nhất:\n145 + 289 + 855 + 711',
    points: 1.0,
    rubric: '= (145 + 855) + (289 + 711) (0,5 điểm)\n= 1 000 + 1 000 = 2 000 (0,5 điểm)',
  },
  {
    id: 'q9',
    number: 9,
    type: 'essay',
    level: 'Mức 3',
    strand: 'Hình học và đo lường',
    questionText: 'Trên lưới ô vuông cạnh 1 cm bên dưới, em hãy vẽ một hình chữ nhật ABCD có chiều dài 5 cm, chiều rộng 3 cm. Sau đó tính diện tích hình chữ nhật đó.',
    points: 1.0,
    gridShape: {
      gridSize: 8,
      shapeType: 'rectangle',
      coordinates: [
        { x: 1, y: 1 },
        { x: 6, y: 1 },
        { x: 6, y: 4 },
        { x: 1, y: 4 },
      ],
      label: 'Hình chữ nhật ABCD',
      fillColor: 'rgba(59, 130, 246, 0.2)',
      unit: 'cm',
    },
    rubric: '- Vẽ đúng hình chữ nhật ABCD kích thước 5 cm x 3 cm trên lưới ô vuông: 0,5 điểm.\n- Tính diện tích: Diện tích hình chữ nhật là: 5 x 3 = 15 (cm2). Đáp số: 15 cm2 (0,5 điểm).',
  },
  {
    id: 'q10',
    number: 10,
    type: 'essay',
    level: 'Mức 3',
    strand: 'Số và phép tính',
    questionText: 'Hai lớp 4A và 4B của trường PTDTBT TH Chí Cà quyên góp được tất cả 360 quyển vở giúp các bạn học sinh có hoàn cảnh khó khăn. Trong đó lớp 4A quyên góp được nhiều hơn lớp 4B là 40 quyển vở. Hỏi mỗi lớp quyên góp được bao nhiêu quyển vở?',
    points: 1.0,
    rubric: 'Bài giải:\nLớp 4A quyên góp được số quyển vở là:\n(360 + 40) : 2 = 200 (quyển) (0,5 điểm)\nLớp 4B quyên góp được số quyển vở là:\n200 - 40 = 160 (quyển) [hoặc 360 - 200 = 160] (0,25 điểm)\nĐáp số: Lớp 4A: 200 quyển vở; Lớp 4B: 160 quyển vở (0,25 điểm).',
  },
];

// Mẫu đề Tiếng Việt chuẩn Lớp 4 (chuẩn Thông tư 27 với 11 câu đọc hiểu + đọc thành tiếng + viết)
export const DEFAULT_VIETNAMESE_EXAM = {
  readingPassage: {
    title: 'HƯƠNG RỪNG XÍN MẦN',
    author: 'Văn Thanh',
    genre: 'Truyện' as const,
    wordCount: 310,
    content: `Buổi sớm mùa thu trên đỉnh Chí Cà, gió se lạnh thổi qua những thửa ruộng bậc thang vàng óng. Chảo Vần Sùng thức dậy từ khi con gà rừng cất tiếng gáy đầu tiên. Cậu bé cùng ông nội bước thoăn thoắt lên nương ngô.

Không khí vùng cao trong lành đến ngỡ ngàng. Sương sớm giăng mắc trên những vạt hoa cúc quỳ vàng rực rỡ bên vách đá, long lanh như những hạt ngọc trời ban tặng. Dưới thung lũng, dòng suối nhỏ róc rách uốn lượn như dải lụa mềm vắt ngang lưng trời. Vần Sùng hít một hơi thật sâu lồng ngực hương thơm nồng nàn của đất núi quyện lẫn mùi lúa chín thơm ngát.

Ông nội vỗ vai Sùng, mỉm cười hiền từ:
- Đất quê mình dẫu đá nhiều hơn đất, nhưng chịu thương chịu khó chăm bón thì ngô sẽ bắp to, lúa sẽ trĩu hạt con ạ!

Vần Sùng nhìn ánh mắt rạng ngời của ông, lòng trào dâng niềm tự hào sâu sắc. Cậu thầm hứa sẽ chăm chỉ học tập thật giỏi ở ngôi trường PTDTBT Tiểu học Chí Cà, mai sau lớn lên đem nhiều điều tốt đẹp về dựng xây quê hương Xín Mần thêm ấm no, giàu đẹp.`,
  },
  questions: [
    {
      id: 'tv_q1',
      number: 1,
      type: 'multiple_choice' as const,
      level: 'Mức 1' as const,
      strand: 'Đọc hiểu văn bản',
      questionText: 'Vần Sùng cùng ông nội đi đâu vào buổi sớm mùa thu?',
      options: ['A. Lên nương ngô', 'B. Ra chợ phiên', 'C. Xuống bờ suối bắt cá', 'D. Sang nhà bạn chơi'],
      correctAnswer: 'A',
      points: 0.5,
      rubric: 'Khoanh đúng A cho 0,5 điểm.',
    },
    {
      id: 'tv_q2',
      number: 2,
      type: 'multiple_choice' as const,
      level: 'Mức 1' as const,
      strand: 'Đọc hiểu văn bản',
      questionText: 'Trong bài đọc, những giọt sương sớm được so sánh với hình ảnh nào?',
      options: ['A. Dải lụa mềm', 'B. Hạt ngọc trời ban tặng', 'C. Ánh sao lung linh', 'D. Mặt gương sáng'],
      correctAnswer: 'B',
      points: 0.5,
      rubric: 'Khoanh đúng B cho 0,5 điểm.',
    },
    {
      id: 'tv_q3',
      number: 3,
      type: 'multiple_choice' as const,
      level: 'Mức 2' as const,
      strand: 'Đọc hiểu văn bản',
      questionText: 'Câu nói của ông nội muốn nhắn nhủ Vần Sùng điều gì?',
      options: [
        'A. Vùng cao Xín Mần chỉ có đá sỏi cằn cỗi',
        'B. Cần phải biết chăm chỉ, chịu thương chịu khó lao động để ấm no',
        'C. Phải dậy thật sớm trước khi gà gáy',
        'D. Lúa chín vàng thì không cần chăm bón',
      ],
      correctAnswer: 'B',
      points: 0.5,
      rubric: 'Khoanh đúng B cho 0,5 điểm.',
    },
    {
      id: 'tv_q4',
      number: 4,
      type: 'multiple_choice' as const,
      level: 'Mức 1' as const,
      strand: 'Đọc hiểu văn bản',
      questionText: 'Dưới thung lũng, dòng suối nhỏ được miêu tả như thế nào?',
      options: [
        'A. Chảy cuồn cuộn qua khe đá',
        'B. Róc rách uốn lượn như dải lụa mềm',
        'C. Nước đục ngầu sau cơn mưa',
        'D. Phẳng lặng như tờ không một gợn sóng',
      ],
      correctAnswer: 'B',
      points: 0.5,
      rubric: 'Khoanh đúng B cho 0,5 điểm.',
    },
    {
      id: 'tv_q5',
      number: 5,
      type: 'essay' as const,
      level: 'Mức 2' as const,
      strand: 'Đọc hiểu văn bản',
      questionText: 'Chi tiết nào trong bài thể hiện tình cảm của Vần Sùng đối với quê hương Chí Cà?',
      points: 1.0,
      rubric: 'Học sinh nêu được: Vần Sùng cảm thấy tự hào, thầm hứa chăm chỉ học giỏi ở trường để mai sau về dựng xây quê hương ấm no, giàu đẹp (1,0 điểm). Nêu được 1 ý cho 0,5 điểm.',
    },
    {
      id: 'tv_q6',
      number: 6,
      type: 'essay' as const,
      level: 'Mức 3' as const,
      strand: 'Đọc hiểu văn bản',
      questionText: 'Là một học sinh, em cần làm những việc gì cụ thể để góp phần xây dựng quê hương, trường lớp thêm tươi đẹp?',
      points: 1.0,
      rubric: 'Học sinh nêu được từ 2 việc làm thiết thực (học tập chăm chỉ, giữ gìn vệ sinh, trồng cây xanh, yêu thương giúp đỡ bạn bè...). Mỗi ý đúng cho 0,5 điểm.',
    },
    {
      id: 'tv_q7',
      number: 7,
      type: 'multiple_choice' as const,
      level: 'Mức 1' as const,
      strand: 'Kiến thức tiếng Việt',
      questionText: 'Trong câu: "Sương sớm giăng mắc trên những vạt hoa cúc quỳ vàng rực rỡ bên vách đá.", từ nào là danh từ riêng?',
      options: ['A. Sương sớm', 'B. Hoa cúc quỳ', 'C. Vách đá', 'D. Trong câu trên không có danh từ riêng'],
      correctAnswer: 'D',
      points: 0.5,
      rubric: 'Khoanh đúng D cho 0,5 điểm.',
    },
    {
      id: 'tv_q8',
      number: 8,
      type: 'multiple_choice' as const,
      level: 'Mức 1' as const,
      strand: 'Kiến thức tiếng Việt',
      questionText: 'Từ nào dưới đây là động từ trong câu: "Cậu bé cùng ông nội bước thoăn thoắt lên nương ngô."?',
      options: ['A. Cậu bé', 'B. Bước', 'C. Thoăn thoắt', 'D. Nương ngô'],
      correctAnswer: 'B',
      points: 0.5,
      rubric: 'Khoanh đúng B cho 0,5 điểm.',
    },
    {
      id: 'tv_q9',
      number: 9,
      type: 'multiple_choice' as const,
      level: 'Mức 2' as const,
      strand: 'Kiến thức tiếng Việt',
      questionText: 'Nhóm từ nào dưới đây chỉ gồm các tính từ tả màu sắc?',
      options: [
        'A. Vàng óng, xanh biếc, đỏ ối',
        'B. Thoăn thoắt, róc rách, ngọt ngào',
        'C. Buổi sớm, hạt ngọc, dải lụa',
        'D. Hít thở, mỉm cười, tự hào',
      ],
      correctAnswer: 'A',
      points: 0.5,
      rubric: 'Khoanh đúng A cho 0,5 điểm.',
    },
    {
      id: 'tv_q10',
      number: 10,
      type: 'multiple_choice' as const,
      level: 'Mức 2' as const,
      strand: 'Kiến thức tiếng Việt',
      questionText: 'Biện pháp tu từ so sánh được sử dụng trong câu nào sau đây?',
      options: [
        'A. Chảo Vần Sùng thức dậy từ sớm',
        'B. Dưới thung lũng, dòng suối nhỏ róc rách uốn lượn như dải lụa mềm',
        'C. Đất quê mình chịu thương chịu khó',
        'D. Vần Sùng nhìn ánh mắt rạng ngời của ông',
      ],
      correctAnswer: 'B',
      points: 0.5,
      rubric: 'Khoanh đúng B cho 0,5 điểm.',
    },
    {
      id: 'tv_q11',
      number: 11,
      type: 'essay' as const,
      level: 'Mức 3' as const,
      strand: 'Kiến thức tiếng Việt',
      questionText: 'Em hãy đặt một câu có sử dụng biện pháp nhân hóa hoặc so sánh để miêu tả vẻ đẹp của thiên nhiên vùng cao quê em.',
      points: 1.0,
      rubric: 'Học sinh đặt được câu hoàn chỉnh (đầu câu viết hoa, cuối câu có dấu chấm), có sử dụng đúng biện pháp so sánh hoặc nhân hóa tự nhiên, sinh động. Đạt chuẩn cho 1,0 điểm. Nếu thiếu dấu câu trừ 0,25 điểm.',
    },
  ],
  writingSection: {
    prompt: 'Đề bài: Hãy viết một đoạn văn (từ 7 đến 9 câu) kể lại một kỉ niệm đẹp hoặc một việc làm tốt mà em đã thực hiện cùng thầy cô, bạn bè dưới mái trường thân yêu.',
    points: 10,
    criteria: [
      { name: '1. Mở đoạn', points: 1.0, desc: 'Giới thiệu được kỉ niệm hoặc việc làm tốt một cách tự nhiên.' },
      { name: '2. Thân đoạn (Nội dung chính)', points: 6.0, desc: 'Kể diễn biến sự việc mạch lạc, có chi tiết cụ thể, nêu được cảm xúc và suy nghĩ của bản thân.' },
      { name: '3. Kết đoạn', points: 1.0, desc: 'Khẳng định ý nghĩa của kỉ niệm/việc làm tốt và cảm xúc đọng lại.' },
      { name: '4. Chính tả, ngữ pháp', points: 1.0, desc: 'Chữ viết rõ ràng, không mắc quá 3 lỗi chính tả, dùng từ chuẩn xác.' },
      { name: '5. Sáng tạo', points: 1.0, desc: 'Có hình ảnh so sánh, liên tưởng sinh động, giàu cảm xúc chân thực.' },
    ],
  },
  oralReadingSection: {
    prompt: 'Giáo viên cho học sinh bốc thăm đọc một trong các đoạn văn sau (tốc độ đọc khoảng 80-90 tiếng/phút) và trả lời 1 câu hỏi do giáo viên nêu:',
    points: 3,
    passages: [
      'Đoạn 1: Từ "Buổi sớm mùa thu..." đến "...hạt ngọc trời ban tặng." (Hỏi: Tìm những hình ảnh miêu tả buổi sớm mùa thu?)',
      'Đoạn 2: Từ "Dưới thung lũng..." đến "...thì ngô sẽ bắp to, lúa sẽ trĩu hạt con ạ!" (Hỏi: Ông nội đã khuyên Vần Sùng điều gì?)',
      'Đoạn 3: Từ "Vần Sùng nhìn ánh mắt..." đến hết. (Hỏi: Vần Sùng đã thầm hứa điều gì?)',
    ],
  },
};

const fs = require('fs');

const html = fs.readFileSync('home.html', 'utf8');

// Extract Header and Footer
const headerMatch = html.match(/<header class="skmd-header"[^>]*>[\s\S]*?<\/header>/);
const footerMatch = html.match(/<footer class="skmd-footer">[\s\S]*?<\/footer>/);
const scriptMatch = html.match(/<script>[\s\S]*?window\.skmdShowPopup[\s\S]*?<\/script>/);

if (!headerMatch || !footerMatch || !scriptMatch) {
  console.error("Could not find header or footer");
  process.exit(1);
}

const header = headerMatch[0];
const footer = footerMatch[0];
const script = scriptMatch ? scriptMatch[0] : '';

const template = (title, content) => `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} - Sống Khỏe Mỗi Ngày 24h</title>
<meta property="og:site_name" content="Sống Khỏe Mỗi Ngày 24h" />
<link rel="icon" type="image/svg+xml" href="/favicon_46ozzcminjco6vl4qpkay.svg" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Sống Khỏe Mỗi Ngày 24h",
  "url": "https://songkhoemoingay24h.vercel.app/"
}
</script>
<link rel="stylesheet" href="/style.css?v=4">
<link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
<style>
  .skmd-static-page { padding: var(--space-12) 0; background: var(--color-bg-offset); min-height: 60vh; }
  .skmd-static-container { background: var(--color-white); padding: var(--space-10); border-radius: var(--radius-xl); box-shadow: var(--shadow-sm); max-width: 900px; margin: 0 auto; }
  .skmd-static-header { text-align: center; margin-bottom: var(--space-8); padding-bottom: var(--space-6); border-bottom: 1px solid var(--color-border); }
  .skmd-static-title { font-size: var(--text-3xl); color: var(--color-primary-dark); font-weight: 800; }
  .skmd-static-content h2 { font-size: var(--text-xl); color: var(--color-primary); margin-top: var(--space-8); margin-bottom: var(--space-3); font-weight: 700; }
  .skmd-static-content h3 { font-size: var(--text-lg); color: var(--color-text-main); margin-top: var(--space-4); margin-bottom: var(--space-2); font-weight: 600; }
  .skmd-static-content p { color: var(--color-text-muted); line-height: 1.8; margin-bottom: var(--space-4); font-size: var(--text-base); }
  .skmd-static-content ul { padding-left: var(--space-6); margin-bottom: var(--space-4); color: var(--color-text-muted); line-height: 1.8; font-size: var(--text-base); }
  .skmd-static-content li { margin-bottom: var(--space-2); }
  .skmd-static-content strong { color: var(--color-text-main); }
</style>
</head>
<body class="skmd">
${header}

<main class="skmd-static-page">
  <div class="skmd-container skmd-static-container">
    <div class="skmd-static-header">
      <h1 class="skmd-static-title">${title}</h1>
    </div>
    <div class="skmd-static-content">
      ${content}
    </div>
  </div>
</main>

${footer}
${script}
</body>
</html>`;

const pages = [
  {
    file: 'gioi-thieu.html',
    title: 'Giới Thiệu Về Sống Khỏe Mỗi Ngày',
    content: `
      <h2>1. Sứ mệnh của chúng tôi</h2>
      <p>Chào mừng bạn đến với <strong>Sống Khỏe Mỗi Ngày</strong>. Sứ mệnh cốt lõi của chúng tôi là mang đến cho cộng đồng những kiến thức y khoa, sức khỏe chính xác, dễ hiểu và dễ áp dụng nhất. Chúng tôi tin rằng, một cuộc sống khỏe mạnh bắt nguồn từ những thói quen nhỏ mỗi ngày và sự hiểu biết đúng đắn về cơ thể mình.</p>
      
      <h2>2. Đội ngũ chuyên gia</h2>
      <p>Mọi nội dung trên website đều được biên tập và kiểm duyệt bởi đội ngũ biên tập viên giàu kinh nghiệm, cùng sự cố vấn từ các bác sĩ, chuyên gia y tế hàng đầu. Chúng tôi cam kết thông tin luôn bám sát các nghiên cứu khoa học mới nhất và tiêu chuẩn y khoa quốc tế.</p>
      
      <h2>3. Giá trị cốt lõi</h2>
      <ul>
        <li><strong>Chính xác:</strong> Thông tin có cơ sở khoa học, được tham chiếu từ các nguồn y khoa uy tín.</li>
        <li><strong>Dễ hiểu:</strong> Truyền tải các thuật ngữ y học phức tạp một cách đơn giản, gần gũi với mọi người.</li>
        <li><strong>Tận tâm:</strong> Luôn đặt sức khỏe và quyền lợi của người đọc lên hàng đầu.</li>
      </ul>
      
      <h2>4. Liên hệ</h2>
      <p>Nếu bạn có bất kỳ thắc mắc hay góp ý nào, xin vui lòng liên hệ với chúng tôi qua thông tin được cung cấp ở phần cuối trang web. Đội ngũ của chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn.</p>
    `
  },
  {
    file: 'dieu-khoan-su-dung.html',
    title: 'Điều Khoản Sử Dụng',
    content: `
      <h2>1. Chấp nhận điều khoản</h2>
      <p>Bằng việc truy cập và sử dụng website <strong>Sống Khỏe Mỗi Ngày</strong>, bạn đồng ý tuân thủ các Điều Khoản Sử Dụng này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản, vui lòng ngừng sử dụng website ngay lập tức.</p>

      <h2>2. Quyền sở hữu trí tuệ</h2>
      <p>Toàn bộ nội dung, hình ảnh, đồ họa, thiết kế và các tài liệu khác trên website này đều thuộc quyền sở hữu của Sống Khỏe Mỗi Ngày hoặc được cấp phép sử dụng hợp pháp. Bạn không được phép sao chép, phân phối, sửa đổi, tái bản hoặc sử dụng cho mục đích thương mại mà không có sự đồng ý bằng văn bản của chúng tôi.</p>

      <h2>3. Sử dụng thông tin</h2>
      <p>Bạn được phép đọc, chia sẻ các bài viết trên mạng xã hội với mục đích cá nhân phi thương mại, kèm theo nguồn gốc rõ ràng (dẫn link trực tiếp về bài viết gốc trên website của chúng tôi).</p>

      <h2>4. Hành vi bị nghiêm cấm</h2>
      <ul>
        <li>Sử dụng website cho bất kỳ mục đích vi phạm pháp luật nào.</li>
        <li>Cố ý phát tán virus, mã độc hoặc có các hành vi phá hoại hệ thống.</li>
        <li>Thu thập dữ liệu tự động (scraping, crawling) mà không có sự cho phép.</li>
      </ul>

      <h2>5. Thay đổi điều khoản</h2>
      <p>Chúng tôi có quyền cập nhật và chỉnh sửa Điều Khoản Sử Dụng này bất kỳ lúc nào mà không cần báo trước. Việc bạn tiếp tục sử dụng website sau khi có sự thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới đó.</p>
    `
  },
  {
    file: 'chinh-sach-bao-mat.html',
    title: 'Chính Sách Bảo Mật',
    content: `
      <h2>1. Cam kết không thu thập thông tin cá nhân</h2>
      <p>Tại <strong>Sống Khỏe Mỗi Ngày</strong>, chúng tôi đề cao và tôn trọng quyền riêng tư của bạn. Chúng tôi cam kết <strong>đảm bảo không thu thập thông tin cá nhân</strong> (như tên, số điện thoại, địa chỉ nhà) từ người dùng trong quá trình bạn đọc bài và trải nghiệm website.</p>
      <p>Chức năng đăng ký nhận bản tin qua email hiện tại chỉ là tính năng thử nghiệm và đang trong quá trình phát triển, do đó hệ thống không lưu trữ hay xử lý bất kỳ email nào của bạn vào cơ sở dữ liệu.</p>

      <h2>2. Dữ liệu truy cập ẩn danh (Cookies & Analytics)</h2>
      <p>Để cải thiện chất lượng nội dung và trải nghiệm người dùng, chúng tôi có thể sử dụng các công cụ phân tích lưu lượng (như Google Analytics). Những công cụ này chỉ thu thập các dữ liệu ẩn danh như: loại trình duyệt, thời gian truy cập, trang bạn đã xem. Các dữ liệu này hoàn toàn không gắn liền với danh tính cá nhân của bạn.</p>
      
      <h2>3. Quảng cáo và Liên kết bên thứ ba</h2>
      <p>Website của chúng tôi có thể chứa các liên kết dẫn đến các trang web khác. Khi bạn nhấp vào các liên kết này, bạn sẽ rời khỏi trang web của chúng tôi và tuân theo chính sách bảo mật của bên thứ ba đó. Chúng tôi không chịu trách nhiệm về nội dung và thực tiễn bảo mật của họ.</p>
      
      <h2>4. Thay đổi chính sách</h2>
      <p>Chúng tôi bảo lưu quyền thay đổi Chính Sách Bảo Mật này bất cứ lúc nào để phù hợp với các thay đổi trong quy định pháp luật hoặc quá trình vận hành website. Mọi thay đổi sẽ được cập nhật công khai tại trang này.</p>
    `
  },
  {
    file: 'mien-tru-trach-nhiem.html',
    title: 'Miễn Trừ Trách Nhiệm Y Khoa',
    content: `
      <h2>1. Thông tin chỉ mang tính chất tham khảo</h2>
      <p>Tất cả nội dung bao gồm văn bản, hình ảnh, đồ họa và các tài liệu khác trên <strong>Sống Khỏe Mỗi Ngày</strong> chỉ nhằm mục đích cung cấp thông tin tham khảo giáo dục. Nội dung không được thiết kế hoặc có ý định thay thế cho những lời khuyên, chẩn đoán, hoặc điều trị y khoa chuyên nghiệp từ các bác sĩ hoặc chuyên gia y tế.</p>

      <h2>2. Không tự ý điều trị</h2>
      <p><strong>KHÔNG BAO GIỜ</strong> được bỏ qua hoặc trì hoãn việc tìm kiếm sự tư vấn y khoa chuyên nghiệp dựa trên những gì bạn đã đọc trên trang web này. Nếu bạn nghi ngờ mình đang gặp vấn đề về sức khỏe hoặc trong tình trạng y tế khẩn cấp, hãy liên hệ ngay với bác sĩ, đến cơ sở y tế gần nhất, hoặc gọi trực tiếp cho dịch vụ cấp cứu (115).</p>

      <h2>3. Tính chính xác của thông tin</h2>
      <p>Mặc dù chúng tôi đã nỗ lực hết sức để đảm bảo nội dung trên website là chính xác, cập nhật và dựa trên các nguồn y khoa uy tín, lĩnh vực y học luôn không ngừng thay đổi và phát triển. Do đó, chúng tôi không đảm bảo (dù rõ ràng hay ngụ ý) về tính hoàn thiện, tính chính xác tuyệt đối, hoặc sự phù hợp của thông tin cho mọi trường hợp cá biệt.</p>

      <h2>4. Không chịu trách nhiệm hệ quả</h2>
      <p>Sống Khỏe Mỗi Ngày, ban quản trị, biên tập viên, và các đối tác liên quan hoàn toàn không chịu bất kỳ trách nhiệm pháp lý nào đối với những tổn thất, rủi ro, thiệt hại cá nhân hay tài sản phát sinh trực tiếp hoặc gián tiếp từ việc ứng dụng hoặc tin tưởng vào các thông tin được cung cấp trên website này.</p>
    `
  },
  {
    file: 'gioi-thieu/ban-bien-tap.html',
    title: 'Ban Biên Tập Sống Khỏe Mỗi Ngày',
    content: `
      <h2>Đội ngũ của chúng tôi</h2>
      <p>Tại Sống Khỏe Mỗi Ngày, chúng tôi tự hào sở hữu <strong>Ban Biên Tập</strong> - một đội ngũ những chuyên gia nội dung tận tụy, am hiểu y tế, luôn làm việc với tôn chỉ mang lại thông tin chính xác, khách quan và dễ hiểu nhất cho cộng đồng.</p>
      
      <h2>Trách nhiệm và Vai trò</h2>
      <ul>
        <li><strong>Nghiên cứu & Tổng hợp:</strong> Tìm kiếm, tổng hợp thông tin từ các tài liệu y khoa chính thống, các tạp chí khoa học quốc tế uy tín (như WHO, NIH, PubMed).</li>
        <li><strong>Biên soạn dễ hiểu:</strong> Chuyển ngữ và biên soạn các thuật ngữ y khoa phức tạp thành ngôn từ đại chúng, gần gũi, giúp người đọc dễ dàng tiếp nhận.</li>
        <li><strong>Kiểm duyệt chéo:</strong> Mỗi bài viết trước khi xuất bản đều trải qua ít nhất 2 vòng kiểm duyệt nội bộ để đảm bảo không có sai sót về chuyên môn.</li>
        <li><strong>Cập nhật liên tục:</strong> Y học luôn thay đổi. Ban Biên Tập chịu trách nhiệm theo dõi và cập nhật thường xuyên nội dung các bài viết cũ để phản ánh những tiến bộ y khoa mới nhất.</li>
      </ul>
      
      <h2>Cam kết minh bạch</h2>
      <p>Để đảm bảo tính khách quan và độc lập, Ban Biên Tập làm việc độc lập hoàn toàn với các nhà tài trợ hay các đơn vị quảng cáo. Mọi nội dung y khoa đều xuất phát từ bằng chứng khoa học, <strong>KHÔNG</strong> chịu ảnh hưởng bởi mục đích thương mại.</p>
    `
  },
  {
    file: 'chinh-sach-bien-tap.html',
    title: 'Chính Sách Biên Tập Nội Dung',
    content: `
      <h2>1. Tôn chỉ Biên Tập</h2>
      <p>Mục tiêu lớn nhất của chúng tôi là trở thành nguồn thông tin y khoa và sức khỏe đáng tin cậy nhất của bạn. Mọi bài viết trên <strong>Sống Khỏe Mỗi Ngày</strong> đều tuân thủ nguyên tắc: <strong>Chính xác - Khách quan - Minh bạch - Đồng cảm</strong>.</p>

      <h2>2. Nguồn tài liệu uy tín</h2>
      <p>Chúng tôi tuyệt đối không sử dụng thông tin từ các nguồn thiếu kiểm chứng, tin đồn hoặc các phương pháp chữa bệnh không có cơ sở khoa học. Các tài liệu tham khảo chính của chúng tôi bao gồm:</p>
      <ul>
        <li>Tổ chức Y tế Thế giới (WHO).</li>
        <li>Viện Y tế Quốc gia Hoa Kỳ (NIH).</li>
        <li>Các trung tâm kiểm soát và phòng ngừa dịch bệnh (CDC).</li>
        <li>Các tạp chí y khoa quốc tế như The Lancet, JAMA, PubMed.</li>
      </ul>

      <h2>3. Quy trình xuất bản nghiêm ngặt</h2>
      <ul>
        <li><strong>Bước 1 - Lên ý tưởng & Nghiên cứu:</strong> Đề tài được lựa chọn dựa trên nhu cầu tìm kiếm của người dùng và các vấn đề sức khỏe cộng đồng. Biên tập viên sẽ tiến hành nghiên cứu tài liệu từ các nguồn chuẩn y khoa.</li>
        <li><strong>Bước 2 - Soạn thảo:</strong> Nội dung được viết bằng ngôn ngữ thân thiện, mạch lạc, dễ hiểu.</li>
        <li><strong>Bước 3 - Tham vấn & Kiểm duyệt:</strong> Bản thảo được kiểm tra tính chính xác về mặt chuyên môn y khoa. Những nội dung chuyên sâu sẽ được tham vấn bởi Hội đồng Y khoa.</li>
        <li><strong>Bước 4 - Xuất bản & Cập nhật:</strong> Bài viết được định kỳ rà soát mỗi 6 tháng - 1 năm để đảm bảo thông tin không bị lỗi thời.</li>
      </ul>

      <h2>4. Sửa chữa & Phản hồi</h2>
      <p>Nếu phát hiện bất kỳ sai sót nào trong nội dung bài viết, chúng tôi cam kết sẽ lập tức chỉnh sửa và công khai sự điều chỉnh đó. Chúng tôi luôn hoan nghênh và trân trọng mọi ý kiến đóng góp từ độc giả và các chuyên gia y tế.</p>
    `
  }
];

const path = require('path');
pages.forEach(p => {
  const filePath = p.file;
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, template(p.title, p.content));
  console.log('Created: ' + filePath);
});

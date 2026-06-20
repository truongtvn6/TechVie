import { Product, NewsArticle, TimelineEvent, TeamMember } from './types';
// @ts-ignore
import laptopImg from './assets/images/regenerated_image_1781784768195.jpg';

export const products: Product[] = [
  {
    id: 'lumina-phone-1',
    name: 'Điện Thoại Lumina Ultra v1',
    price: 28990000,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    category: 'Điện thoại',
    description: 'Chiếc flagship siêu phẩm tích hợp màn hình Dynamic OLED dải màu vô hạn kết hợp Camera cảm biến ống kính Lumina Pro. Khung vỏ bằng chất liệu Titanium nguyên khối cho trọng lượng siêu nhẹ và chuẩn bền bỉ vượt trội.',
    specs: [
      { label: 'Màn hình', value: '6.7" Dynamic OLED 120Hz' },
      { label: 'Vi xử lý', value: 'Lumina Core Pro Alpha' },
      { label: 'Dung lượng Pin', value: '5000 mAh (Sạc siêu tốc)' },
      { label: 'Hệ thống Camera', value: '50MP Tri-Lens v2' }
    ]
  },
  {
    id: 'lumina-book-pro',
    name: 'Laptop Lumina Book Pro X',
    price: 42500000,
    image: laptopImg,
    category: 'Laptop',
    description: 'Trạm làm việc di động tối thượng dành cho các nhà sáng tạo nội dung và kỹ sư lập trình. Thiết kế siêu mỏng nhẹ từ hợp kim nhôm tái chế cao cấp, âm thanh phòng thu 6 loa vòm và bàn phím hành trình sâu êm ái.',
    specs: [
      { label: 'Bộ xử lý', value: 'Lumina Silicon M1 Ultra' },
      { label: 'Bộ nhớ RAM', value: '32GB Unified RAM' },
      { label: 'Lưu trữ SSD', value: '1TB NVMe Gen 4' },
      { label: 'Thời lượng Pin', value: 'Lên tới 20 giờ liên tục' }
    ]
  },
  {
    id: 'lumina-watch-ultra',
    name: 'Đồng Hồ Lumina Watch Ultra',
    price: 19500000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    category: 'Đồng hồ',
    description: 'Người đồng hành thầm lặng cho mọi cuộc phiêu lưu khắc nghiệt và bảo trợ sức khỏe toàn thời gian. Khung vỏ Titanium chống ăn mòn cấp độ vũ trụ, hệ thống định vị GPS băng kép độc lập và kính Sapphire chống xước tuyệt đối.',
    specs: [
      { label: 'Kích thước mặt', value: '49mm Titanium Gasket' },
      { label: 'Định vị toàn cầu', value: 'GPS Băng tần kép L1+L5' },
      { label: 'Chống nước', value: 'WR100 (Sâu tới 100m)' },
      { label: 'Cảm biến sức khỏe', value: 'Nhịp tim, ECG & SpO2 cấp phòng khám' }
    ]
  },
  {
    id: 'lumina-buds-2',
    name: 'Tai Nghe Sound Buds Pro v2',
    price: 6800000,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    category: 'Âm thanh',
    description: 'Không gian âm nhạc phòng thu hoàn toàn riêng biệt bất cứ nơi đâu nhờ công nghệ chống ồn chủ động thích ứng ANC thông minh mới nhất lên đến 48dB. Tái tạo chất âm trung thực, âm bass tròn đầy, ấm áp.',
    specs: [
      { label: 'Kháng nhiễu chủ động', value: 'ANC 48dB Adaptive' },
      { label: 'Trình điều khiển', value: 'Dynamic Driver 11mm Dual' },
      { label: 'Pin hộp sạc', value: '36 giờ cả hộp (Sạc không dây)' },
      { label: 'Độ trễ truyền tải', value: 'Cực thấp 20ms (Chế độ Gaming)' }
    ]
  },
  {
    id: 'lumina-keyboard-zen',
    name: 'Bàn Phím Cơ Lumina ZenBoard v2',
    price: 4900000,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    category: 'Bàn phím',
    description: 'Nâng tầm trải nghiệm gõ phím nhẹ nhàng và thư giãn mỗi ngày. Khung kim loại nguyên khối CNC tỉ mỉ, cấu trúc Gasket-mount 5 lớp triệt tiêu mọi tạp âm, switch mượt mà được lube sẵn bằng dầu chất lượng Thụy Sĩ.',
    specs: [
      { label: 'Cấu trúc phím', value: 'Gasket Mount CNC Aluminum' },
      { label: 'Kiểu kết nối', value: '3 Chế độ (Type-C / Bluetooth / 2.4Ghz)' },
      { label: 'Keycaps', value: 'Double-shot PBT Profile Zen' },
      { label: 'Tính năng nâng cao', value: 'Hot-swap 5-pin, Hỗ trợ QMK/VIA' }
    ]
  }
];

export const newsArticles: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Lumina Silicon Ra Mắt Thế Hệ Vi Xử Lý M1 Pro siêu vi',
    category: 'CÔNG NGHỆ',
    date: '15/06/2026',
    summary: 'Bước nhảy vọt đột phá trong công nghệ sản xuất chip của Lumina giúp thiết bị tiết kiệm điện năng hơn 40% đồng thời tối đa hóa luồng xử lý đồ họa phức tạp.',
    content: 'Đội ngũ kỹ sư tại Lumina Lab Thụy Sĩ vừa công bố bản thiết kế chip bán dẫn 2nm đầu tiên mang tên M1 Pro. Bằng việc xếp chồng mật độ bóng bán dẫn theo công nghệ ba chiều mới nhất, con chip này đạt hiệu năng xử lý tác vụ trí tuệ nhân tạo cao gấp 2.5 lần các thế hệ tiền nhiệm, mở ra chương mới cho hệ sinh thái laptop di động cấu hình siêu khủng.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'news-2',
    title: 'Khai Trương Trạm Trải Nghiệm Premium Store Tại Hà Nội & TP. HCM',
    category: 'CÔNG TY',
    date: '28/05/2026',
    summary: 'Điểm chạm vật lý đặc thù mang thiết kế futuristic tối giản Thụy Sĩ cho khách hàng chạm tay vào các siêu phẩm công nghệ đỉnh cao.',
    content: 'Lumina Electronics chính thức chào đón quý khách hàng tham quan không gian phân phối và bảo hành ủy quyền chính hãng đầu tiên tại Việt Nam. Trạm trải nghiệm được tối giản hóa toàn bộ các chi tiết rườm rà, tập trung tuyệt đối vào sự kết nối tự nhiên giữa người dùng và sản phẩm công nghệ thông qua các bục kính trưng bày lơ lửng.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'news-3',
    title: 'Vật liệu hợp kim hàng không thân thiện môi trường trong thiết kế mới',
    category: 'CHẾ TÁC',
    date: '10/04/2026',
    summary: 'Lumina cam kết đạt trạng thái trung hòa carbon toàn bộ chuỗi sản xuất thiết bị vào cuối năm 2026.',
    content: 'Triết lý gia công lớp vỏ nhôm của Lumina Book Pro X sử dụng 100% tài nguyên tái chế được điện phân bằng năng lượng mặt trởi sạch. Điều này không những giảm thiểu ô nhiễm môi trường công nghiệp mà còn giúp cải thiện độ đàn hồi chịu lực của vật liệu tăng thêm 15% so với nhôm thô thương mại.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
  }
];

export const timelineEvents: TimelineEvent[] = [
  {
    year: '2020',
    title: 'Khởi đầu Studio tại Lausanne',
    description: 'Một đội ngũ kỹ sư phần cứng xuất sắc tại Thụy Sĩ khởi động dự án Lumina Lab, nghiên cứu chế tác các linh kiện vi mạch siêu bền bỉ phục vụ công nghiệp thiết bị đeo thông minh.'
  },
  {
    year: '2022',
    title: 'Chào sân chiếc Smartphone đầu tiên',
    description: 'Lumina Phone v1 chính thức trình làng tại triển lãm công nghệ BaselWorld, đánh dấu ngôn ngữ thiết kế viền mỏng vô hạn cùng công nghệ tản nhiệt buồng hơi lỏng độc lập.'
  },
  {
    year: '2024',
    title: 'Mở rộng dải sinh thái phong phú',
    description: 'Ra mắt dòng Laptop Lumina Book và tai nghe Sound Buds chống ồn siêu cấp, mở rộng trung tâm sản xuất bán dẫn phụ trợ tại quốc gia dẫn đầu công nghệ Seoul, Hàn Quốc.'
  },
  {
    year: '2026',
    title: 'Kỷ nguyên Đồng bộ Lumina Ecosystem',
    description: 'Hoàn thiện hệ sinh thái thông minh hoàn hảo từ điện thoại, máy tính, đồng hồ thông minh kết nối liền mạch bằng hạ tầng mật mã bảo mật hai chiều AES-256 an toàn tối thượng.'
  }
];

export const teamMembers: TeamMember[] = [
  {
    name: 'GS. Minh Trí',
    role: 'Founder & Giám đốc Công nghệ',
    bio: 'Cựu chuyên viên nghiên cứu vi kiến trúc bán dẫn tại Lausanne, Thụy Sĩ. Ông đã dành hơn 15 năm thiết kế sơ đồ liên kết của các bo mạch siêu gọn và dẫn dắt định hướng thiết bị phần cứng của Lumina.',
    image: 'https://picsum.photos/seed/tri/400/400'
  },
  {
    name: 'Diệu Linh',
    role: 'Chief of Product Design',
    bio: 'Nhà thiết kế tiên phong với tầm nhìn giao thoa phong cách tối giản Bắc Âu và tính thực dụng tiện nghi. Cô là người trực tiếp chắp bút cho bộ khung Titanium siêu mỏng thanh lịch đặc trưng của LUMINA.',
    image: 'https://picsum.photos/seed/linh/400/400'
  },
  {
    name: 'TS. Seung-Min Kim',
    role: 'Chủ nhiệm Phát triển Mạch Tích Hợp',
    bio: 'Chuyên gia cao cấp về kỹ thuật tần số siêu cao. Ông chịu trách nhiệm chính trong việc tối ưu hóa hiệu suất điện năng và độ trễ phản hồi của hệ thống loa âm thanh Bluetooth của hãng.',
    image: 'https://picsum.photos/seed/kim/400/400'
  },
  {
    name: 'Alexandra Dubois',
    role: 'Giám đốc Chuỗi cung ứng Toàn cầu',
    bio: 'Hơn 12 năm kinh nghiệm điều phối quy trình cung ứng linh kiện hi-end tại Thụy Sĩ và Đức. Đảm bảo nguồn tài nguyên nhôm tái chế sạch và kính sapphire đạt chuẩn quân sự khắt khe nhất.',
    image: 'https://picsum.photos/seed/alexandra/400/400'
  },
  {
    name: 'Bảo Long',
    role: 'Trưởng phòng Trải nghiệm Người dùng',
    bio: 'Cựu kỹ sư tại Silicon Valley, phụ trách xây dựng tính tương tác không độ trễ của giao diện LumiOS và nâng tầm khả năng đồng bộ hóa sinh trắc học thông minh trên hệ sinh thái.',
    image: 'https://picsum.photos/seed/baolong/400/400'
  },
  {
    name: 'Tuấn Kiệt',
    role: 'Kỹ sư trưởng Vật liệu Siêu bền',
    bio: 'Chuyên gia hàng đầu về kỹ thuật gia công lớp phủ anodized và tôi luyện thủy tinh cường lực. Người bảo đảm độ bền cơ học vững chãi vượt qua mọi thử thách va chạm khắc nghiệt nhất.',
    image: 'https://picsum.photos/seed/tuankiet/400/400'
  },
  {
    name: 'Dr. Evelyn Vance',
    role: 'Giám đốc Nghiên cứu LumiOS',
    bio: 'Tiến sĩ Khoa học Máy tính từ MIT, chuyên sâu trong thiết kế vi hạt nhân tối giản và cơ chế mã hóa bảo mật phần cứng hai chiều AES-256 giúp bảo vệ thông tin thông minh tối thượng.',
    image: 'https://picsum.photos/seed/evelyn/400/400'
  },
  {
    name: 'Mai Phương',
    role: 'Giám đốc Chăm sóc Khách hàng Premium',
    bio: 'Quản lý chuỗi Trạm trải nghiệm cao cấp trên toàn quốc. Cô tập trung kiến tạo văn hóa hỗ trợ kỹ thuật tận tâm trọn đời và tổ chức các chương trình đặc quyền dành riêng cho khách VIP.',
    image: 'https://picsum.photos/seed/maiphuong/400/400'
  }
];


const laptopImg = 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80';

const products = [
  {
    id: 'techvie-phone-1',
    name: 'Điện Thoại TechVie Ultra v1',
    price: 28990000,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    category: 'Điện thoại',
    description: 'Chiếc flagship siêu phẩm tích hợp màn hình Dynamic OLED dải màu vô hạn kết hợp Camera cảm biến ống kính TechVie Pro. Khung vỏ bằng chất liệu Titanium nguyên khối cho trọng lượng siêu nhẹ và chuẩn bền bỉ vượt trội.',
    specs: [
      { label: 'Màn hình', value: '6.7" Dynamic OLED 120Hz' },
      { label: 'Vi xử lý', value: 'TechVie Core Pro Alpha' },
      { label: 'Dung lượng Pin', value: '5000 mAh (Sạc siêu tốc)' },
      { label: 'Hệ thống Camera', value: '50MP Tri-Lens v2' }
    ]
  },
  {
    id: 'techvie-book-pro',
    name: 'Laptop TechVie Book Pro X',
    price: 42500000,
    image: laptopImg,
    category: 'Laptop',
    description: 'Trạm làm việc di động tối thượng dành cho các nhà sáng tạo nội dung và kỹ sư lập trình. Thiết kế siêu mỏng nhẹ từ hợp kim nhôm tái chế cao cấp, âm thanh phòng thu 6 loa vòm và bàn phím hành trình sâu êm ái.',
    specs: [
      { label: 'Bộ xử lý', value: 'TechVie Silicon M1 Ultra' },
      { label: 'Bộ nhớ RAM', value: '32GB Unified RAM' },
      { label: 'Lưu trữ SSD', value: '1TB NVMe Gen 4' },
      { label: 'Thời lượng Pin', value: 'Lên tới 20 giờ liên tục' }
    ]
  },
  {
    id: 'techvie-watch-ultra',
    name: 'Đồng Hồ TechVie Watch Ultra',
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
    id: 'techvie-buds-2',
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
    id: 'techvie-keyboard-zen',
    name: 'Bàn Phím Cơ TechVie ZenBoard v2',
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

module.exports = { products };

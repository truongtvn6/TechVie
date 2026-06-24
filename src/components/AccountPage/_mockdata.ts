export const defaultUserProfile = {
  name: 'Nguyễn Minh Tiến',
  email: 'mintzinfinity898@gmail.com',
  phone: '0912 345 678',
  address: '86 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
  memberSince: '17-06-2026',
  techvieId: 'TV-992-88X',
  shieldStatus: 'Đang Kích Hoạt (Premium)',
  role: 'user',
};

export const mockOrders = [
  {
    id: 'TV-938294',
    date: '17-06-2026',
    total: '49.800.000₫',
    status: 'Đang lắp ráp chuẩn bị gửi',
    statusType: 'processing',
    items: [
      { name: 'Kính thực tế tăng cường TechVie One', qty: 1, type: 'Kính AR cao cấp' }
    ]
  },
  {
    id: 'TV-728103',
    date: '02-05-2026',
    total: '8.500.000₫',
    status: 'Giao hàng thành công',
    statusType: 'success',
    items: [
      { name: 'Bản sạc không dây 3-in-1 TechVie Dock', qty: 1, type: 'Phụ kiện cao cấp' }
    ]
  }
];

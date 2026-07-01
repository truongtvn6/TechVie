export const defaultUserProfile = {
  name: '',
  email: '',
  phone: '',
  address: '',
  memberSince: '',
  techvieId: '',
  shieldStatus: 'Standard',
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

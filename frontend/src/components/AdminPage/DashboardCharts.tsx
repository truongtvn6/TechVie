import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, Legend
} from 'recharts';
import { Product } from '../../types';

interface DashboardChartsProps {
  orders: any[];
  products: Product[];
  isDarkMode?: boolean;
}

export default function DashboardCharts({ orders, products, isDarkMode = false }: DashboardChartsProps) {
  const d = isDarkMode;
  const textColor = d ? '#9ca3af' : '#6b7280';
  const gridColor = d ? '#374151' : '#e5e7eb';
  const tooltipBg = d ? '#1f2937' : '#ffffff';

  // 1. Dữ liệu Doanh thu theo 7 ngày gần nhất
  const revenueData = useMemo(() => {
    const data: Record<string, number> = {};
    const today = new Date();
    
    // Khởi tạo 7 ngày gần nhất (bao gồm hôm nay)
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      data[dateStr] = 0;
    }

    orders.forEach(order => {
      if (order.statusType === 'cancelled') return; // Không tính đơn hủy
      
      const orderDate = new Date(order.createdAt);
      const dateStr = orderDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      
      if (data[dateStr] !== undefined) {
        let amount = typeof order.finalTotal === 'number' 
          ? order.finalTotal 
          : parseInt(String(order.finalTotal || '0').replace(/[^0-9]/g, ''));
        
        if (isNaN(amount)) amount = 0;
        data[dateStr] += amount;
      }
    });

    return Object.keys(data).map(date => ({
      date,
      revenue: data[date]
    }));
  }, [orders]);

  // 2. Dữ liệu Trạng thái Đơn hàng
  const orderStatusData = useMemo(() => {
    const counts = {
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };

    orders.forEach(order => {
      if (order.statusType === 'processing') counts.processing++;
      else if (order.statusType === 'shipped') counts.shipped++;
      else if (order.statusType === 'delivered') counts.delivered++;
      else if (order.statusType === 'cancelled') counts.cancelled++;
    });

    return [
      { name: 'Đang xử lý', value: counts.processing, color: '#f59e0b' },
      { name: 'Đang giao', value: counts.shipped, color: '#3b82f6' },
      { name: 'Đã giao', value: counts.delivered, color: '#10b981' },
      { name: 'Đã hủy', value: counts.cancelled, color: '#ef4444' }
    ].filter(item => item.value > 0);
  }, [orders]);

  // 3. Dữ liệu Tồn kho theo Danh mục
  const stockByCategoryData = useMemo(() => {
    const data: Record<string, number> = {};
    
    products.forEach(product => {
      const cat = product.category || 'Khác';
      if (!data[cat]) data[cat] = 0;
      data[cat] += (product.stock || 0);
    });

    return Object.keys(data)
      .map(category => ({
        category,
        stock: data[category]
      }))
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 5); // Lấy top 5 danh mục
  }, [products]);

  // Format tiền tệ cho Tooltip
  const formatCurrency = (value: number) => {
    return value.toLocaleString('vi-VN') + '₫';
  };

  const cardBase = `border rounded-3xl p-5 xl:p-6 transition-all duration-300 min-w-0 flex flex-col`;
  const cardLight = `bg-white border-gray-200`;
  const cardDark = `bg-[#161b22] border-[#30363d]`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6 mt-6">
      
      {/* Biểu đồ Doanh thu (Chiếm 2 cột trên màn hình lớn) */}
      <div className={`${cardBase} ${d ? cardDark : cardLight} lg:col-span-2`}>
        <div className="mb-4">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans block">Biểu đồ</span>
          <h3 className={`text-lg font-bold font-sans ${d ? 'text-white' : 'text-gray-900'}`}>Doanh thu 7 ngày gần nhất</h3>
        </div>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="date" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis 
                stroke={textColor} 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(val) => val >= 1000000 ? (val/1000000).toFixed(0) + 'tr' : val}
                dx={-10}
              />
              <RechartsTooltip 
                formatter={(value: number) => [formatCurrency(value), 'Doanh thu']}
                contentStyle={{ backgroundColor: tooltipBg, borderColor: gridColor, borderRadius: '12px', color: d ? '#fff' : '#000' }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: tooltipBg }}
                activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2, fill: tooltipBg }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Biểu đồ Trạng thái Đơn hàng */}
      <div className={`${cardBase} ${d ? cardDark : cardLight}`}>
        <div className="mb-4">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans block">Phân bổ</span>
          <h3 className={`text-lg font-bold font-sans ${d ? 'text-white' : 'text-gray-900'}`}>Trạng thái Đơn hàng</h3>
        </div>
        <div className="w-full h-[250px] flex items-center justify-center">
          {orderStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: gridColor, borderRadius: '12px', color: d ? '#fff' : '#000' }}
                  itemStyle={{ color: d ? '#fff' : '#000' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm italic">Chưa có dữ liệu đơn hàng</p>
          )}
        </div>
      </div>

      {/* Biểu đồ Tồn kho */}
      <div className={`${cardBase} ${d ? cardDark : cardLight}`}>
        <div className="mb-4">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans block">Kho hàng</span>
          <h3 className={`text-lg font-bold font-sans ${d ? 'text-white' : 'text-gray-900'}`}>Top Tồn kho theo Danh mục</h3>
        </div>
        <div className="w-full h-[250px]">
          {stockByCategoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockByCategoryData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={true} vertical={false} />
                <XAxis type="number" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="category" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} width={80} />
                <RechartsTooltip 
                  formatter={(value: number) => [value + ' sản phẩm', 'Tồn kho']}
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: gridColor, borderRadius: '12px', color: d ? '#fff' : '#000' }}
                  cursor={{ fill: d ? '#374151' : '#f3f4f6' }}
                />
                <Bar dataKey="stock" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400 text-sm italic">Chưa có dữ liệu sản phẩm</p>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
